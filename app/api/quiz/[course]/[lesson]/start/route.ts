/**
 * GET /api/quiz/[course]/[lesson]/start
 *
 * Losuje N pytań z puli przypisanej do lekcji i zwraca je przeglądarce
 * BEZ kolumn correct_index / explanation.
 *
 * Przepływ:
 *   1. Czyta pulę pytań przez ANON client (RLS ogranicza do public_questions).
 *   2. Losuje `limit` pytań (domyślnie 5) algorytmem Fisher-Yates.
 *   3. Przepuszcza wynik przez service_role, żeby zapisać próbę
 *      w quiz_attempts (anon NIE ma prawa tam pisać).
 *   4. Zwraca przeglądarce: pytania + attempt_id (klucz do submit).
 *
 * Dlaczego NIE losujemy po stronie bazy (ORDER BY random() LIMIT 5)?
 *   Bo przy małej puli ORDER BY random() w Postgresie jest kosztowne
 *   i nie daje gwarancji rozkładu. Losujemy w pamiści po pobraniu puli
 *   — do 50 pytań na lekcję to ~50KB JSON, śmiesznie mało.
 */
import { NextResponse } from "next/server";
import { getAnonClient, getServiceClient, getOrCreateQuizUid } from "@/lib/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic"; // route NIE może być cache'owany — losuje za każdym razem

const DEFAULT_LIMIT = 5;
const MAX_LIMIT = 20;
const MIN_POOL = 5; // wymagamy min. 5 pytań w puli, inaczej 503

type RouteContext = { params: Promise<{ course: string; lesson: string }> };

/**
 * Fisher-Yates w miejscu. Bez zależności, deterministyczny seed jeśli
 * potrzebny (tutaj nie — chcemy prawdziwą losowość).
 */
function shuffle<T>(arr: T[]): T[] {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

export async function GET(_req: Request, ctx: RouteContext) {
    const { course: courseId, lesson: lessonSlug } = await ctx.params;

    // Limit pytań do wylosowania — z query ?limit=N, domyślnie 5.
    const url = new URL(_req.url);
    const limitParam = Number(url.searchParams.get("limit") ?? DEFAULT_LIMIT);
    const limit = Number.isFinite(limitParam)
        ? Math.max(1, Math.min(MAX_LIMIT, Math.floor(limitParam)))
        : DEFAULT_LIMIT;

    // 1) Pobierz pulę przez ANON client — RLS odsiewa nieaktywne,
    //    widok public_questions odsiewa poprawne odpowiedzi.
    type PoolRow = {
        id: string;
        course_id: string;
        lesson_slug: string;
        prompt: string;
        options: Array<{ idx: number; label: string }>;
    };
    let pool: PoolRow[] | null = null;
    let poolErr: { message: string; cause?: unknown; code?: string } | null = null;
    let poolErrStack: string | undefined;

    try {
        const anon = getAnonClient();
        const result = await anon
            .from("public_questions")
            .select("id, course_id, lesson_slug, prompt, options")
            .eq("course_id", courseId)
            .eq("lesson_slug", lessonSlug);
        pool = (result.data as PoolRow[] | null) ?? null;
        poolErr = result.error as typeof poolErr;
    } catch (e) {
        // getAnonClient może rzucić jeśli brak env vars (build/runtime check)
        const err = e as Error;
        poolErr = {
            message: err.message,
            cause: (err as { cause?: unknown }).cause,
            code: (err as { code?: string }).code
        };
        poolErrStack = err.stack;
    }

    if (poolErr) {
        // Błąd po stronie serwera logujemy, ale do klienta NIE wysyłamy
        // stack trace ani flag env — to wyciek informacji. Klient dostaje
        // ogólny komunikat, szczegóły idą do logów Vercel.
        console.error("[quiz/start] błąd odczytu puli:", {
            message: poolErr.message,
            cause: poolErr.cause ? String(poolErr.cause) : undefined,
            code: poolErr.code,
            stack: poolErrStack
        });
        return NextResponse.json(
            { error: "Błąd odczytu puli pytań. Spróbuj ponownie później." },
            { status: 500 }
        );
    }

    if (!pool || pool.length < MIN_POOL) {
        // Świadomy stan: pytania nie są jeszcze zaseedowane dla tej lekcji.
        // 503, nie 404 — komunikat "w przygotowaniu" wyświetli klient.
        return NextResponse.json(
            {
                error: "Pula pytań dla tej lekcji jest jeszcze pusta lub za mała.",
                available: pool?.length ?? 0,
                required: MIN_POOL
            },
            { status: 503 }
        );
    }

    // 2) Losuj N z puli.
    const picked = shuffle(pool).slice(0, limit);

    // 3) Zapisz próbę przez service_role (anon nie ma uprawnień do INSERT).
    const quizUid = await getOrCreateQuizUid();
    const svc = getServiceClient();
    const { data: attempt, error: attemptErr } = await svc
        .from("quiz_attempts")
        .insert({
            course_id: courseId,
            lesson_slug: lessonSlug,
            quiz_uid: quizUid,
            question_ids: picked.map((q) => q.id),
            answers: {}, // wypełni submit()
            total: picked.length
        })
        .select("id")
        .single();

    if (attemptErr || !attempt) {
        return NextResponse.json(
            { error: "Nie udało się zapisać próby.", detail: attemptErr?.message },
            { status: 500 }
        );
    }

    // 4) Zwróć pytania. attempt_id to jedyny sposób, żeby submit()
    //    wiedział, że to ta sama sesja quizu.
    return NextResponse.json({
        attemptId: attempt.id,
        questions: picked.map((q) => ({
            id: q.id,
            prompt: q.prompt,
            options: q.options
        })),
        total: picked.length
    });
}
