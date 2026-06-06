"use client";

/**
 * Badge "Ukonczony" / "W trakcie" dla egzaminu.
 * Czyta z useExamProgressGlobal - SSR-safe (pokazuje nic przed hydracja).
 */

import { useExamProgress } from "./useExamProgressGlobal";

export function ExamProgressBadge({
    examSlug,
    totalChecklist,
}: {
    examSlug: string;
    totalChecklist: number;
}) {
    const progress = useExamProgress(examSlug, totalChecklist);
    if (!progress.hasAny) return null;

    if (progress.isComplete) {
        return <span className="exam-progress-badge is-done">✓ Ukończony</span>;
    }
    return (
        <span className="exam-progress-badge is-progress">
            W trakcie {progress.done}/{progress.total}
        </span>
    );
}
