"use client";

import { useState } from "react";
import Link from "next/link";

export type ExamEntry = {
    id: string;
    title: string;
    tech: "php" | "js" | "php+js";
    slug: string;
    topic: string;
};

export type ExamSession = {
    year: number;
    month: string;
    exams: ExamEntry[];
};

const PhpIcon = () => (
    <svg viewBox="0 0 28 16" className="exam-tech-badge" aria-label="PHP">
        <rect width="28" height="16" rx="3" fill="#7c3aed" />
        <text x="14" y="12" textAnchor="middle" fontSize="9" fontWeight="700" fill="#e9d5ff">
            PHP
        </text>
    </svg>
);

const JsIcon = () => (
    <svg viewBox="0 0 20 16" className="exam-tech-badge" aria-label="JS">
        <rect width="20" height="16" rx="3" fill="#ca8a04" />
        <text x="10" y="12" textAnchor="middle" fontSize="9" fontWeight="700" fill="#1a1a2e">
            JS
        </text>
    </svg>
);

function TechBadges({ tech }: { tech: ExamEntry["tech"] }) {
    if (tech === "php") return <PhpIcon />;
    if (tech === "js") return <JsIcon />;
    return (
        <span className="exam-badges-row">
            <PhpIcon />
            <JsIcon />
        </span>
    );
}

export function ExamPicker({
    sessions,
    courseId,
    label = "Egzaminy",
}: {
    sessions: ExamSession[];
    courseId: string;
    label?: string;
}) {
    const [open, setOpen] = useState(false);
    const [idx, setIdx] = useState(0);

    const current = sessions[idx];
    const hasPrev = idx > 0;
    const hasNext = idx < sessions.length - 1;

    return (
        <div className="exam-picker">
            {/* Toggle */}
            <button
                className="exam-picker-toggle"
                onClick={() => setOpen(!open)}
                aria-expanded={open}
            >
                <span className="exam-picker-label">{label}</span>
                <svg
                    className={`exam-picker-chevron ${open ? "open" : ""}`}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    width="18"
                    height="18"
                >
                    <path
                        fillRule="evenodd"
                        d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                        clipRule="evenodd"
                    />
                </svg>
            </button>

            {/* Panel */}
            <div className={`exam-picker-panel ${open ? "open" : ""}`}>
                {/* Session navigator */}
                <div className="exam-nav">
                    <button
                        className="exam-nav-arrow"
                        onClick={() => setIdx(idx - 1)}
                        disabled={!hasPrev}
                        aria-label="Poprzednia sesja"
                    >
                        ‹
                    </button>
                    <span className="exam-nav-title">
                        {current.month.toUpperCase()} {current.year}
                    </span>
                    <button
                        className="exam-nav-arrow"
                        onClick={() => setIdx(idx + 1)}
                        disabled={!hasNext}
                        aria-label="Następna sesja"
                    >
                        ›
                    </button>
                </div>

                {/* Exams list or "coming soon" */}
                {current.exams.length > 0 ? (
                    <ul className="exam-list">
                        {current.exams.map((exam) => (
                            <li key={exam.id}>
                                <Link
                                    href={`/kursy/${courseId}/${exam.slug}`}
                                    className="exam-row"
                                >
                                    <TechBadges tech={exam.tech} />
                                    <span className="exam-row-id">{exam.id}</span>
                                    <span className="exam-row-topic">{exam.topic}</span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="exam-empty">WKRÓTCE</p>
                )}

                {/* Dots indicator */}
                <div className="exam-dots">
                    {sessions.map((s, i) => (
                        <button
                            key={`${s.year}-${s.month}`}
                            className={`exam-dot ${i === idx ? "active" : ""} ${s.exams.length > 0 ? "has-content" : ""}`}
                            onClick={() => setIdx(i)}
                            aria-label={`${s.month} ${s.year}`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
