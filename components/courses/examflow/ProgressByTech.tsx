"use client";

/**
 * Breakdown postepu per technologia.
 * Dla kazdej technologii: total/done/in-progress.
 */

import { useMemo } from "react";
import { useAllExamProgress } from "./useExamProgressGlobal";

type Entry = { slug: string; technologies: string[] };

export function ProgressByTech({ entries }: { entries: Entry[] }) {
    const slugs = useMemo(() => entries.map((e) => e.slug), [entries]);
    const totals = useMemo(
        () => Object.fromEntries(entries.map((e) => [e.slug, 8])),
        [entries]
    );
    const all = useAllExamProgress(slugs, totals);

    const byTech = useMemo(() => {
        const acc: Record<string, { total: number; done: number; inProgress: number }> = {};
        for (const e of entries) {
            const s = all[e.slug];
            for (const t of e.technologies) {
                const key = t.toLowerCase();
                if (!acc[key]) acc[key] = { total: 0, done: 0, inProgress: 0 };
                acc[key].total++;
                if (s?.isComplete) acc[key].done++;
                else if (s?.hasAny) acc[key].inProgress++;
            }
        }
        return Object.entries(acc)
            .sort(([, a], [, b]) => b.total - a.total);
    }, [all, entries]);

    if (byTech.length === 0) return null;

    return (
        <section className="progress-by-tech" aria-label="Progres per technologia">
            <h2 className="progress-by-tech-title">Progres per technologia</h2>
            <ul className="progress-by-tech-list">
                {byTech.map(([tech, s]) => {
                    const pct = s.total > 0 ? Math.round((s.done / s.total) * 100) : 0;
                    return (
                        <li key={tech} className="progress-by-tech-item">
                            <div className="progress-by-tech-head">
                                <strong className="progress-by-tech-name">{tech}</strong>
                                <span className="progress-by-tech-count">
                                    {s.done}/{s.total}
                                    {s.inProgress > 0 && (
                                        <span className="progress-by-tech-progress">
                                            + {s.inProgress} w trakcie
                                        </span>
                                    )}
                                </span>
                            </div>
                            <div className="progress-by-tech-bar" aria-hidden="true">
                                <div
                                    className="progress-by-tech-bar-fill"
                                    style={{ width: `${pct}%` }}
                                />
                            </div>
                            <span className="progress-by-tech-pct">{pct}%</span>
                        </li>
                    );
                })}
            </ul>
        </section>
    );
}
