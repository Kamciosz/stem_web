"use client";

import { useState, useId, useRef, useEffect } from "react";
import { glossary } from "@/lib/glossary";

type TermProps = {
    /** Słowo-klucz ze słownika (lib/glossary.ts). Jeśli podany, definicja pobierana automatycznie. */
    word?: string;
    /** Definicja inline — nadpisuje słownik. Użyj, gdy pojęcie jest jednorazowe. */
    define?: string;
    children: React.ReactNode;
};

/**
 * Żargon techniczny z tłumaczeniem po najechaniu (desktop) lub tapnięciu (mobile).
 * Użycie w MDX:
 *   <Term word="semantyczny">semantyczny</Term>
 *   <Term define="Dzielenie wyników na strony">paginacja</Term>
 */
export function Term({ word, define, children }: TermProps) {
    const [open, setOpen] = useState(false);
    const tooltipId = useId();
    const ref = useRef<HTMLSpanElement>(null);

    const definition = define ?? (word ? glossary[word] : undefined);

    // Zamknij po kliknięciu poza elementem (dla trybu tap na mobile)
    useEffect(() => {
        if (!open) return;
        function handleClickOutside(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
            }
        }
        function handleEsc(e: KeyboardEvent) {
            if (e.key === "Escape") setOpen(false);
        }
        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleEsc);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleEsc);
        };
    }, [open]);

    if (!definition) {
        // Brak definicji — renderuj zwykły tekst, nie psuj lekcji
        return <span>{children}</span>;
    }

    return (
        <span
            ref={ref}
            className="term"
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
        >
            <button
                type="button"
                className="term-trigger"
                aria-describedby={open ? tooltipId : undefined}
                aria-expanded={open}
                onClick={() => setOpen((v) => !v)}
                onFocus={() => setOpen(true)}
                onBlur={() => setOpen(false)}
            >
                {children}
            </button>
            <span
                role="tooltip"
                id={tooltipId}
                className={`term-tooltip ${open ? "term-tooltip-open" : ""}`}
            >
                {word && <span className="term-tooltip-word">{word}</span>}
                <span className="term-tooltip-def">{definition}</span>
            </span>
        </span>
    );
}
