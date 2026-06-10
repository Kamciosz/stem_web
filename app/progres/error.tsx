"use client";

/**
 * Error boundary dla /progres.
 * Progres trzymany jest w localStorage — najczestsza przyczyna bledu to
 * uszkodzony/niezgodny wpis. Dajemy uzytkownikowi przycisk resetu lokalnych
 * danych + powrot do kursu, zamiast golego komunikatu frameworka.
 */

import { useEffect } from "react";
import Link from "next/link";

const PROGRESS_KEYS = ["stem-exam-progress-v1", "stem-scroll-position-v1"];

export default function ProgresError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // log do konsoli dla diagnostyki (nie pokazujemy stacka uzytkownikowi)
        console.error("Blad na /progres:", error);
    }, [error]);

    function clearLocalProgress() {
        try {
            for (const k of PROGRESS_KEYS) window.localStorage.removeItem(k);
        } catch {
            /* private mode / quota */
        }
        reset();
    }

    return (
        <article className="error-page section-shell">
            <div className="section-inner error-container">
                <p className="error-eyebrow">Błąd ładowania</p>
                <h1 className="error-title">Nie udało się wczytać progresu</h1>
                <p className="error-lead">
                    Twój postęp zapisany jest lokalnie w tej przeglądarce. Jeśli dane się
                    uszkodziły, wyczyść je i spróbuj ponownie — to nie usunie żadnych
                    materiałów, tylko Twoje lokalne zaznaczenia.
                </p>
                <div className="error-actions">
                    <button type="button" onClick={() => reset()} className="error-btn primary">
                        Spróbuj ponownie
                    </button>
                    <button type="button" onClick={clearLocalProgress} className="error-btn">
                        Wyczyść lokalny progres
                    </button>
                    <Link href="/kursy/inf-03" className="error-btn">
                        Wróć do kursu INF.03
                    </Link>
                </div>
            </div>
        </article>
    );
}
