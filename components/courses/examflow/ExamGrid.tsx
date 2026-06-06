"use client";

/**
 * Filtrowalna siatka wszystkich egzaminow.
 * Filtry: technologia, sesja, status progresu.
 */

import Link from "next/link";
import { useMemo, useState } from "react";
import {
    useAllExamProgress,
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

const ALL_SESSIONS = [
    "Styczen 2023",
    "Czerwiec 2024",
    "Styczen 2024",
    "Czerwiec 2025",
    "Styczen 2025",
    "Styczen 2026",
] as const;

const ALL_TECHS = ["PHP", "SQL", "JavaScript", "HTML", "CSS", "JS"] as const;

export function ExamGrid({ entries }: { entries: Entry[] }) {
    const [tech, setTech] = useState<string>("all");
    const [session, setSession] = useState<string>("all");
    const [status, setStatus] = useState<string>("all");

    const examSlugs = useMemo(() => entries.map((e) => e.slug), [entries]);
    const totalBySlug = useMemo(
        () => Object.fromEntries(entries.map((e) => [e.slug, 8])),
        [entries]
    );
    const progress = useAllExamProgress(examSlugs, totalBySlug);

    const filtered = useMemo(() => {
        return entries.filter((e) => {
            if (session !== "all" && e.session !== session) return false;
            if (tech !== "all") {
                const eTechsLower = e.technologies.map((t) => t.toLowerCase());
                if (!eTechsLower.includes(tech.toLowerCase())) return false;
            }
            if (status !== "all") {
                const s = progress[e.slug];
                if (status === "done" && !s?.isComplete) return false;
                if (status === "progress" && !(s?.hasAny && !s?.isComplete)) return false;
                if (status === "none" && s?.hasAny) return false;
            }
            return true;
        });
    }, [entries, tech, session, status, progress]);

    return (
        <div className="exam-grid-wrap">
            <div className="exam-grid-filters" role="region" aria-label="Filtry egzaminow">
                <div className="exam-grid-filter">
                    <label htmlFor="egzaminy-tech">Technologia</label>
                    <select id="egzaminy-tech" value={tech} onChange={(e) => setTech(e.target.value)}>
                        <option value="all">Wszystkie</option>
                        {ALL_TECHS.map((t) => (
                            <option key={t} value={t}>
                                {t}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="exam-grid-filter">
                    <label htmlFor="egzaminy-session">Sesja</label>
                    <select id="egzaminy-session" value={session} onChange={(e) => setSession(e.target.value)}>
                        <option value="all">Wszystkie</option>
                        {ALL_SESSIONS.map((s) => (
                            <option key={s} value={s}>
                                {s}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="exam-grid-filter">
                    <label htmlFor="egzaminy-status">Status</label>
                    <select id="egzaminy-status" value={status} onChange={(e) => setStatus(e.target.value)}>
                        <option value="all">Wszystkie</option>
                        <option value="done">Ukończone</option>
                        <option value="progress">W trakcie</option>
                        <option value="none">Nie rozpoczęte</option>
                    </select>
                </div>
                <div className="exam-grid-count">
                    <strong>{filtered.length}</strong>
                    <span>z {entries.length}</span>
                </div>
            </div>

            <ol className="exam-grid">
                {filtered.map((e) => {
                    const s = progress[e.slug];
                    const tone = s?.isComplete ? "is-done" : s?.hasAny ? "is-progress" : "is-none";
                    return (
                        <li key={e.slug} className={`exam-grid-item ${tone}`}>
                            <Link href={e.basePath} className="exam-grid-card">
                                <span className="exam-grid-id">{e.examId}</span>
                                <strong className="exam-grid-title">{e.title}</strong>
                                <span className="exam-grid-topic">{e.topic}</span>
                                <div className="exam-grid-techs">
                                    {e.technologies.map((t) => (
                                        <span key={t} className="exam-grid-tech">
                                            {t}
                                        </span>
                                    ))}
                                </div>
                                <span className="exam-grid-status">
                                    {s?.isComplete && "✓ Ukończony"}
                                    {s?.hasAny && !s.isComplete && `W trakcie ${s.done}/${s.total}`}
                                    {!s?.hasAny && "—"}
                                </span>
                            </Link>
                        </li>
                    );
                })}
            </ol>

            {filtered.length === 0 && (
                <div className="exam-grid-empty">Brak arkuszy spelniajacych wybrane filtry.</div>
            )}
        </div>
    );
}
