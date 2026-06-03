"use client";

/**
 * Pelna interaktywna checklista uzywana na podstronie Kontrola.
 * Stan w `localStorage` pod kluczem EXAM_PROGRESS_STORAGE_KEY,
 * dzielony z dashboardem (`useExamProgress`).
 *
 * UWAGA: kolejnosc itemow musi pasowac do `examChecklistKeys`.
 */

import { ReactNode } from "react";
import { examChecklistKeys } from "@/lib/exams/inf-03-egzamin-01";
import { useExamProgressMutator } from "./useExamProgress";

type Item = { label: ReactNode };

export function ExamFlowChecklist({ items }: { items: Item[] }) {
    const total = examChecklistKeys.length;
    const { state, toggle, reset, hydrated, done } = useExamProgressMutator(total);

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
