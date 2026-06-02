"use client";

import { useState } from "react";
import Link from "next/link";

export type ExamEntry = {
    id: string;
    title: string;
    tech: "php" | "js" | "php+js";
    slug: string;
    /** np. "Portal samochodowy" */
    topic: string;
};

export type ExamSession = {
    year: number;
    month: string;
    exams: ExamEntry[];
};

const PhpIcon = () => (
    <svg viewBox="0 0 24 24" className="exam-tech-icon exam-tech-php" aria-label="PHP">
        <rect width="24" height="24" rx="4" fill="#6B21A8" />
        <text x="12" y="16" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#E9D5FF">
            PHP
        </text>
    </svg>
);

const JsIcon = () => (
    <svg viewBox="0 0 24 24" className="exam-tech-icon exam-tech-js" aria-label="JavaScript">
        <rect width="24" height="24" rx="4" fill="#CA8A04" />
        <text x="12" y="16" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#1a1a2e">
            JS
        </text>
    </svg>
);

function TechBadge({ tech }: { tech: ExamEntry["tech"] }) {
    if (tech === "php") return <PhpIcon />;
    if (tech === "js") return <JsIcon />;
    return (
        <span className="exam-tech-both">
            <PhpIcon />
            <JsIcon />
        </span>
    );
}

export function ExamPicker({
    sessions,
    courseId,
}: {
    sessions: ExamSession[];
    courseId: string;
}) {
    const [open, setOpen] = useState(false);

    return (
        <div className="exam-picker">
            <button
                className="exam-picker-toggle"
                onClick={() => setOpen(!open)}
                aria-expanded={open}
            >
                <span className="exam-picker-title">Egzaminy</span>
                <svg
                    className={`exam-picker-chevron ${open ? "open" : ""}`}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                >
                    <path
                        fillRule="evenodd"
                        d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                        clipRule="evenodd"
                    />
                </svg>
            </button>

            <div className={`exam-picker-panel ${open ? "open" : ""}`}>
                {sessions.map((session) => (
                    <div key={`${session.year}-${session.month}`} className="exam-session">
                        <h4 className="exam-session-header">
                            {session.month}&nbsp;{session.year}
                        </h4>
                        <ul className="exam-session-list">
                            {session.exams.map((exam) => (
                                <li key={exam.id} className="exam-entry">
                                    <Link
                                        href={`/kursy/${courseId}/${exam.slug}`}
                                        className="exam-entry-link"
                                    >
                                        <TechBadge tech={exam.tech} />
                                        <span className="exam-entry-text">
                                            <span className="exam-entry-id">{exam.id}</span>
                                            <span className="exam-entry-topic">{exam.topic}</span>
                                        </span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );
}
