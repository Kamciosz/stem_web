"use client";

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
    const current = sessions[0];

    return (
        <div className="exam-picker">
            <header className="exam-picker-static-head">
                <span className="exam-picker-label">{label}</span>
                <span className="exam-picker-static-note">zawsze widoczne</span>
            </header>

            <div className="exam-picker-panel open">
                {/* Session navigator */}
                <div className="exam-nav">
                    <span className="exam-nav-title">
                        {current.month.toUpperCase()} {current.year}
                    </span>
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

            </div>
        </div>
    );
}
