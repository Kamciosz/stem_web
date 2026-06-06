"use client";

/**
 * Dashboard progresu - wyswietla wszystkie 54 egzaminy z ich stanem.
 * Czyta z useExamProgressGlobal. Grupuje po sesji.
 */

import Link from "next/link";
import { useMemo } from "react";
import {
    useAllExamProgress,
    useGlobalProgressSummary,
} from "./useExamProgressGlobal";

type Entry = {
    slug: string;
    title: string;
    examId: string;
    session: string;
    topic: string;
    description: string;
    technologies: string[];
    basePath: string;
    courseId: string;
};

const TOTAL_CHECKLIST = 8;

export function ProgressDashboard({ entries }: { entries: Entry[] }) {
    const examSlugs = useMemo(() => entries.map((e) => e.slug), [entries]);
    const totalBySlug = useMemo(
        () => Object.fromEntries(entries.map((e) => [e.slug, TOTAL_CHECKLIST])),
        [entries]
    );
    const all = useAllExamProgress(examSlugs, totalBySlug);
    const summary = useGlobalProgressSummary(all);

    const bySession = useMemo(() => {
        const groups: Record<string, Entry[]> = {};
        for (const e of entries) {
            if (!groups[e.session]) groups[e.session] = [];
            groups[e.session].push(e);
        }
        return groups;
    }, [entries]);

    return (
        <div className="progres-dashboard">
            <div className="progres-summary">
                <SummaryCard label="Ukończone" value={summary.completed} total={summary.total} tone="done" />
                <SummaryCard label="W trakcie" value={summary.inProgress} total={summary.total} tone="progress" />
                <SummaryCard label="Nie rozpoczęte" value={summary.notStarted} total={summary.total} tone="none" />
            </div>

            {Object.entries(bySession).map(([session, items]) => (
                <section key={session} className="progres-session">
                    <h2 className="progres-session-title">{session}</h2>
                    <ol className="progres-list">
                        {items.map((e) => {
                            const s = all[e.slug];
                            return (
                                <li key={e.slug} className={`progres-item ${s?.isComplete ? "is-done" : s?.hasAny ? "is-progress" : "is-none"}`}>
                                    <Link href={e.basePath} className="progres-item-link">
                                        <span className="progres-item-num">{e.examId.split("-").pop()}</span>
                                        <span className="progres-item-body">
                                            <strong>{e.title}</strong>
                                            <span className="progres-item-meta">
                                                {e.technologies.join(" · ")}
                                            </span>
                                        </span>
                                        <span className="progres-item-status">
                                            {s?.isComplete && "✓ Ukończony"}
                                            {s?.hasAny && !s.isComplete && `${s.done}/${s.total}`}
                                            {!s?.hasAny && "—"}
                                        </span>
                                    </Link>
                                </li>
                            );
                        })}
                    </ol>
                </section>
            ))}
        </div>
    );
}

function SummaryCard({
    label,
    value,
    total,
    tone,
}: {
    label: string;
    value: number;
    total: number;
    tone: "done" | "progress" | "none";
}) {
    return (
        <div className={`progres-summary-card is-${tone}`}>
            <strong className="progres-summary-value">
                {value}
                <span className="progres-summary-total">/{total}</span>
            </strong>
            <span className="progres-summary-label">{label}</span>
        </div>
    );
}
