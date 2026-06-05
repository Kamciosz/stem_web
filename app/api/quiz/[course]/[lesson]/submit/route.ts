/**
 * POST /api/quiz/[course]/[lesson]/submit
 *
 * Waliduje odpowiedzi ucznia po stronie serwera i zwraca:
 *   - ogólny wynik (score / total)
 *   - per-pytanie: czy dobrze, poprawny index, wyjaśnienie
 *
 * Dlaczego walidacja po stronie serwera?
 *   Bo gdyby przeglądarka miała dostęp do poprawnych odpowiedzi,
 *   wystarczyłoby otworzyć DevTools, przeczytać JSON /api/quiz/start
 *   i znać klucz. Tutaj service_role czyta kolumny correct_index
 *   i explanation dopiero w TYM endpoincie — klient wysyła tylko
 *   swoje odpowiedzi, a my je porównujemy.
 *
 * Body:
 *   { attemptId: string, answers: Record<questionId, optionIndex> }
 *
 * Odpowiedź:
 *   {
 *     score: number, total: number,
 *     results: [{ questionId, chosen, correctIndex, isCorrect, explanation }]
 *   }
 */
import { NextResponse } from "next/server";
import { getServiceClient, getOrCreateQuizUid } from "@/lib/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ course: string; lesson: string }> };

type SubmitBody = {
    attemptId: string;
    answers: Record<string, number>;
};

type ResultRow = {
    questionId: string;
    chosen: number | null;
    correctIndex: number;
    isCorrect: boolean;
    explanation: string | null;
};

export async function POST(req: Request, ctx: RouteContext) {
    const { course: courseId, lesson: lessonSlug } = await ctx.params;

    // 1) Parsuj i waliduj body.
    let body: SubmitBody;
    try {
        body = (await req.json()) as SubmitBody;
    } catch {
        return NextResponse.json({ error: "Niepoprawne JSON body." }, { status: 400 });
    }

    if (
        !body ||
        typeof body.attemptId !== "string" ||
        typeof body.answers !== "object" ||
        body.answers === null
    ) {
        return NextResponse.json(
            { error: "Brak attemptId lub answers." },
            { status: 400 }
        );
    }

    const svc = getServiceClient();
    const quizUid = await getOrCreateQuizUid();

    // 2) Pobierz attempt — i sprawdź właściciela po quiz_uid.
    //    Bez tego user mógłby submitować cudze próby.
    const { data: attempt, error: attemptErr } = await svc
        .from("quiz_attempts")
        .select("id, quiz_uid, course_id, lesson_slug, question_ids, submitted_at")
        .eq("id", body.attemptId)
        .single();

    if (attemptErr || !attempt) {
        return NextResponse.json({ error: "Nie znaleziono próby." }, { status: 404 });
    }
    if (attempt.quiz_uid !== quizUid) {
        return NextResponse.json(
            { error: "Próba nie należy do tej sesji." },
            { status: 403 }
        );
    }
    if (attempt.course_id !== courseId || attempt.lesson_slug !== lessonSlug) {
        return NextResponse.json(
            { error: "Próba nie pasuje do kursu/lekcji w URL." },
            { status: 400 }
        );
    }
    if (attempt.submitted_at) {
        return NextResponse.json(
            { error: "Ta próba została już zakończona." },
            { status: 409 }
        );
    }

    // 3) Pobierz pełne dane pytań (z poprawnymi) — service_role, więc RLS nie blokuje.
    const questionIds = attempt.question_ids as string[];
    const { data: fullQuestions, error: qErr } = await svc
        .from("questions")
        .select("id, correct_index, explanation")
        .in("id", questionIds);

    if (qErr || !fullQuestions) {
        console.error("[quiz/submit] błąd odczytu pytań próby:", qErr?.message);
        return NextResponse.json(
            { error: "Nie udało się sprawdzić odpowiedzi. Spróbuj ponownie później." },
            { status: 500 }
        );
    }

    const correctMap = new Map(fullQuestions.map((q) => [q.id, q.correct_index]));
    const explanationMap = new Map<string, string | null>(
        fullQuestions.map((q) => [q.id, q.explanation ?? null])
    );

    const results: ResultRow[] = questionIds.map((qid) => {
        const chosen = body.answers[qid];
        const correctIndex = correctMap.get(qid) ?? -1;
        const isCorrect = typeof chosen === "number" && chosen === correctIndex;
        return {
            questionId: qid,
            chosen: typeof chosen === "number" ? chosen : null,
            correctIndex,
            isCorrect,
            explanation: explanationMap.get(qid) ?? null
        };
    });

    const score = results.filter((r: ResultRow) => r.isCorrect).length;
    const total = results.length;

    // 4) Zaktualizuj attempt.
    const { error: updateErr } = await svc
        .from("quiz_attempts")
        .update({
            answers: body.answers,
            score,
            total,
            submitted_at: new Date().toISOString()
        })
        .eq("id", body.attemptId);

    if (updateErr) {
        console.error("[quiz/submit] błąd zapisu wyniku:", updateErr.message);
        return NextResponse.json(
            { error: "Nie udało się zapisać wyniku. Spróbuj ponownie później." },
            { status: 500 }
        );
    }

    return NextResponse.json({ score, total, results });
}
