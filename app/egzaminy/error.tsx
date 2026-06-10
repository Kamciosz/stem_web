"use client";

/**
 * Error boundary dla /egzaminy.
 * Katalog egzaminow korzysta z progresu w localStorage (badge'e, postep).
 * Przy bledzie dajemy reset lokalnych danych + powrot do kursu.
 */

import { useEffect } from "react";
import Link from "next/link";

const PROGRESS_KEYS = ["stem-exam-progress-v1", "stem-scroll-position-v1"];

export default function EgzaminyError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error("Blad na /egzaminy:", error);
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
                <h1 className="error-title">Nie udało się wczytać katalogu egzaminów</h1>
                <p className="error-lead">
                    Lista arkuszy łączy się z Twoim lokalnym postępem zapisanym w tej
                    przeglądarce. Jeśli dane się uszkodziły, wyczyść je i spróbuj ponownie.
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
