"use client";

/**
 * Sekcja z odznakami (gamification) w /progres.
 * Liczy z useAllExamProgress.
 */

import { useMemo } from "react";
import { useAllExamProgress } from "./useExamProgressGlobal";
import { BADGES } from "@/lib/badges";

export function ProgressBadges({ entries }: { entries: { slug: string; session: string; technologies: string[] }[] }) {
    const slugs = useMemo(() => entries.map((e) => e.slug), [entries]);
    const totals = useMemo(
        () => Object.fromEntries(entries.map((e) => [e.slug, 8])),
        [entries]
    );
    const all = useAllExamProgress(slugs, totals);

    const stats = useMemo(() => {
        const done = Object.values(all).filter((s) => s.isComplete).length;
        const inProgress = Object.values(all).filter((s) => s.hasAny && !s.isComplete).length;
        const sessions = new Set<string>();
        const techs = new Set<string>();
        for (const e of entries) {
            if (all[e.slug]?.isComplete) {
                sessions.add(e.session);
                for (const t of e.technologies) techs.add(t.toLowerCase());
            }
        }
        return { done, inProgress, sessions: sessions.size, techs: techs.size };
    }, [all, entries]);

    const earned = useMemo(() => {
        return BADGES.map((b) => {
            let unlocked = b.threshold(stats);
            // Specjalne warunki
            if (b.id === "polyglot") unlocked = stats.techs >= 5;
            if (b.id === "session-2025") {
                const sessions2025 = entries.filter(
                    (e) => all[e.slug]?.isComplete && (e.session.includes("2025") || e.session.includes("Styczen 2026"))
                );
                unlocked = sessions2025.length >= 8;
            }
            return { ...b, unlocked };
        });
    }, [stats, entries, all]);

    const earnedCount = earned.filter((b) => b.unlocked).length;

    return (
        <section className="progress-badges" aria-label="Odznaki za progres">
            <header className="progress-badges-header">
                <h2>Odznaki</h2>
                <span className="progress-badges-count">
                    {earnedCount} z {BADGES.length} zdobytych
                </span>
            </header>
            <ol className="progress-badges-grid">
                {earned.map((b) => (
                    <li
                        key={b.id}
                        className={`progress-badge ${b.unlocked ? "is-earned" : "is-locked"}`}
                    >
                        <span className="progress-badge-icon" aria-hidden="true">
                            {b.unlocked ? b.icon : "🔒"}
                        </span>
                        <strong className="progress-badge-title">{b.title}</strong>
                        <span className="progress-badge-desc">{b.description}</span>
                    </li>
                ))}
            </ol>
        </section>
    );
}
