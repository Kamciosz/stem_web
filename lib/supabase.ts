/**
 * Klienty Supabase — dwa, bo mamy dwie role:
 *
 * 1. `getServiceClient()` — service_role, TYLKO po stronie serwera.
 *    Ma pełny dostęp do bazy (omija RLS). Służy do:
 *      - walidacji odpowiedzi w /api/quiz/submit
 *      - zapisu prób w quiz_attempts
 *      - seedowania pytań w adminie
 *    WAŻNE: tego importu NIE WOLNO używać w plikach z dyrektywą
 *    "use client" — service_role wycieknie do bundla przeglądarki.
 *
 * 2. `getBrowserClient()` — anon (publishable key), bezpieczny w przeglądarce.
 *    Widzi TYLKO widok public_questions (anon nie ma dostępu do
 *    kolumn is_correct / explanation). Służy do: losowania puli pytań.
 *
 * Dlaczego dwa?
 *    Gdyby losowanie pytań leciało przez service_role, każdy user
 *    mógłby otworzyć DevTools, zobaczyć request i wyciągnąć
 *    poprawne odpowiedzi z response. RLS + widok + klient anon
 *    gwarantują, że przeglądarka NIGDY nie dostanie pól correct.
 *
 * Uwaga: ten plik importuje `next/headers` i `cookies()` więc musi
 * być używany WYŁĄCZNIE w server components / route handlers.
 */
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY;
const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/**
 * Brak env vars NIE crashuje buildu — zwracamy null przy próbie użycia.
 * Build i tak nie woła żadnego API runtime'owego (SSG), a route handlers
 * zwracają wtedy 500 z czytelnym komunikatem. Dzięki temu Vercel
 * zbuduje projekt nawet gdy zapomni się dodać env vars.
 */
function requireEnv(name: string, value: string | undefined): string {
    if (!value) {
        throw new Error(
            `Brak zmiennej środowiskowej ${name}. Dodaj ją w Vercel Dashboard → ` +
            `Settings → Environment Variables (Production, Preview, Development) ` +
            `i zrób redeploy.`
        );
    }
    return value;
}

/** Server-only — service role, omija RLS. Do walidacji i zapisu. */
export function getServiceClient(): SupabaseClient {
    return createClient(requireEnv("NEXT_PUBLIC_SUPABASE_URL", SUPABASE_URL), requireEnv("SUPABASE_SERVICE_ROLE_KEY", SERVICE_ROLE), {
        auth: { persistSession: false, autoRefreshToken: false }
    });
}

/**
 * Anon client — bezpieczny w przeglądarce. W tym projekcie używany
 * głównie z servera (route handler) do losowania puli pytań, bo
 * route handler działa jako "anon" z perspektywy RLS.
 *
 * Jeśli w przyszłości chcesz czytać coś z bazy bezpośrednio z React
 * component ("use client"), użyj createBrowserClient z @supabase/ssr
 * — ale w naszym modelu nie jest to potrzebne, bo cała logika idzie
 * przez /api/quiz/*.
 */
export function getAnonClient(): SupabaseClient {
    return createClient(requireEnv("NEXT_PUBLIC_SUPABASE_URL", SUPABASE_URL), requireEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", ANON_KEY), {
        auth: { persistSession: false, autoRefreshToken: false }
    });
}

/**
 * Identyfikator ucznia (anonimowy, ale unikalny w obrębie quizu).
 * Trzymany w HttpOnly cookie ustawianym przy starcie pierwszego quizu
 * — służy do audytu / limitowania prób w tabeli quiz_attempts.
 *
 * WAŻNE: to NIE jest konto usera. Świadomie rezygnujemy z auth —
 * zgodnie z wizją platformy ("weryfikacja = tylko wiedza w quizach,
 * bez kont"). quiz_uid istnieje wyłącznie po to, żeby pojedynczy
 * uczeń nie mógł w nieskończoność powtarzać quizu i wyciągać
 * poprawnych odpowiedzi metodą prób i błędów.
 */
export async function getOrCreateQuizUid(): Promise<string> {
    const jar = await cookies();
    const existing = jar.get("quiz_uid")?.value;
    if (existing && /^[0-9a-f-]{36}$/i.test(existing)) return existing;

    const { randomUUID } = await import("crypto");
    const fresh = randomUUID();
    jar.set("quiz_uid", fresh, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        // 30 dni — po tym uczeń dostaje nowe uid i może "odblokować"
        // kolejną pulę. To świadomy kompromis: 0 dni = nowe pulowanie
        // co odświeżenie (zbyt łatwe obejście), 365 dni = brak rotacji.
        maxAge: 60 * 60 * 24 * 30
    });
    return fresh;
}
