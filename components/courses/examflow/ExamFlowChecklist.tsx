"use client";

/**
 * Pelna interaktywna checklista uzywana na podstronie Kontrola.
 * Stan w `localStorage` pod kluczem globalnym `stem-exam-progress-v1`,
 * per-egzamin dzięki slug z useParams().
 *
 * Komponent czyta slug z URL: /kursy/inf-03/egzamin-XXX => slug = egzamin-XXX
 */

import { ReactNode, useMemo } from "react";
import { useParams } from "next/navigation";
import { useExamProgressMutator, useExamProgress } from "./useExamProgressGlobal";

type Item = { label: ReactNode };

function slugFromPath(path: string | string[] | undefined): string {
    if (!path) return "";
    const parts = Array.isArray(path) ? path : [path];
    // Szukamy segmentu zaczynajacego sie od "egzamin-"
    for (const p of parts) {
        if (typeof p === "string" && p.startsWith("egzamin-")) return p;
    }
    // Fallback: ostatni segment
    return (parts[parts.length - 1] as string) ?? "";
}

export function ExamFlowChecklist({ items }: { items: Item[] }) {
    const params = useParams();
    const slug = useMemo(() => {
        // useParams() returns obiekt, np. { step: "kontrola" } - nie ma slug
        // wiec czytamy z window.location
        if (typeof window === "undefined") return "";
        const path = window.location.pathname;
        const m = path.match(/\/(egzamin-[\w-]+)/);
        return m ? m[1] : "";
    }, [params]);

    // Uzywamy totals z progress (max 16 items zwykle)
    const tmp = useExamProgress(slug, items.length);
    const total = tmp.total || items.length;

    const { state, toggle, reset, hydrated, done } = useExamProgressMutator(slug, total);

    return (
        <div className="exam-flow-checklist">
            <div className="exam-flow-checklist-head">
                <div>
                    <p className="exam-flow-checklist-kicker">Checklista przed oddaniem</p>
                    <strong className="exam-flow-checklist-count">
                        {done}/{total}
                    </strong>
                </div>
                <button
                    type="button"
                    className="exam-flow-checklist-reset"
                    onClick={reset}
                    disabled={!hydrated || done === 0}
                >
                    Wyczysc
                </button>
            </div>
            <ol className="exam-flow-checklist-list">
                {items.map((item, index) => {
                    const checked = state[index] ?? false;
                    return (
                        <li key={index} className={checked ? "is-done" : undefined}>
                            <label>
                                <input
                                    type="checkbox"
                                    checked={checked}
                                    onChange={(e) => toggle(index, e.target.checked)}
                                />
                                <span className="exam-flow-checklist-index">
                                    {String(index + 1).padStart(2, "0")}
                                </span>
                                <span className="exam-flow-checklist-label">{item.label}</span>
                            </label>
                        </li>
                    );
                })}
            </ol>
        </div>
    );
}
