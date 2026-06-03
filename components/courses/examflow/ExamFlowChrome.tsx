"use client";

/**
 * ExamFlow — wspolne komponenty UI dla redesignu arkusza INF.03 / Styczen 2026 / 01.
 *
 * Routing-based step navigation (Link + usePathname). Bez anchor links.
 * Scope CSS: `.exam-flow` w app/exam-flow.css.
 */

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import {
    examFlowBasePath,
    examMeta,
    examStepsView,
    examChecklistKeys,
    type ExamStepView,
} from "@/lib/exams/inf-03-egzamin-01";
import { useExamProgress } from "./useExamProgress";

const TOTAL_CHECKLIST = examChecklistKeys.length;

/* ─────────────────────────────────────────────────────────────
   Shell — root wrapper, scope CSS
   ───────────────────────────────────────────────────────────── */

export function ExamFlowShell({ children }: { children: ReactNode }) {
    return (
        <div className="exam-flow" data-exam-flow={examMeta.lessonSlug}>
            <div className="exam-flow-inner">{children}</div>
        </div>
    );
}

/* ─────────────────────────────────────────────────────────────
   Breadcrumb / topbar
   ───────────────────────────────────────────────────────────── */

export function ExamFlowBreadcrumb({ currentStep }: { currentStep?: ExamStepView }) {
    return (
        <nav className="exam-flow-breadcrumb" aria-label="Sciezka egzaminu">
            <Link href="/kursy">Kursy</Link>
            <span aria-hidden="true">/</span>
            <Link href={`/kursy/${examMeta.courseId}`}>{examMeta.courseId.toUpperCase().replace("-", ".")}</Link>
            <span aria-hidden="true">/</span>
            <Link href={examFlowBasePath} className={currentStep ? "" : "is-current"}>
                {examMeta.examId}
            </Link>
            {currentStep && (
                <>
                    <span aria-hidden="true">/</span>
                    <span className="is-current">{currentStep.label}</span>
                </>
            )}
        </nav>
    );
}

/* ─────────────────────────────────────────────────────────────
   Header — tytul + meta. Wspolny dla dashboardu i podstron.
   ───────────────────────────────────────────────────────────── */

export function ExamFlowHeader({
    currentStep,
    eyebrow,
}: {
    currentStep?: ExamStepView;
    eyebrow?: string;
}) {
    return (
        <header className="exam-flow-header">
            <ExamFlowBreadcrumb currentStep={currentStep} />
            <div className="exam-flow-header-row">
                <div className="exam-flow-header-copy">
                    <p className="exam-flow-eyebrow">
                        {eyebrow ?? `${examMeta.examId} · ${examMeta.session}`}
                    </p>
                    {currentStep ? (
                        <div className="exam-flow-title-row">
                            <span className="exam-flow-step-badge" aria-hidden="true">
                                {String(currentStep.index).padStart(2, "0")}
                            </span>
                            <h1 className="exam-flow-title">{currentStep.label}</h1>
                        </div>
                    ) : (
                        <h1 className="exam-flow-title">{examMeta.title}</h1>
                    )}
                    <p className="exam-flow-lead">
                        {currentStep ? currentStep.summary : examMeta.description}
                    </p>
                </div>
                <div className="exam-flow-header-meta">
                    <dl>
                        <div>
                            <dt>Czas</dt>
                            <dd>{currentStep ? currentStep.minutes : examMeta.time}</dd>
                        </div>
                        <div>
                            <dt>Technologie</dt>
                            <dd>{(currentStep ? currentStep.technologies : examMeta.technologies).join(" · ")}</dd>
                        </div>
                    </dl>
                </div>
            </div>
        </header>
    );
}

/* ─────────────────────────────────────────────────────────────
   Step nav — routing pills. Active = obecny pathname.
   ───────────────────────────────────────────────────────────── */

export function ExamFlowStepNav() {
    const pathname = usePathname() ?? "";
    const dashboardActive = pathname === examFlowBasePath;

    return (
        <nav className="exam-flow-stepnav" aria-label="Etapy egzaminu">
            <Link
                href={examFlowBasePath}
                className={`exam-flow-step ${dashboardActive ? "is-active" : ""}`}
                aria-current={dashboardActive ? "page" : undefined}
            >
                <span className="exam-flow-step-index">00</span>
                <span className="exam-flow-step-label">Przeglad</span>
            </Link>
            {examStepsView.map((step) => {
                const href = `${examFlowBasePath}/${step.slug}`;
                const active = pathname === href;
                return (
                    <Link
                        key={step.slug}
                        href={href}
                        className={`exam-flow-step ${active ? "is-active" : ""}`}
                        aria-current={active ? "page" : undefined}
                    >
                        <span className="exam-flow-step-index">{String(step.index).padStart(2, "0")}</span>
                        <span className="exam-flow-step-label">{step.label}</span>
                    </Link>
                );
            })}
        </nav>
    );
}

/* ─────────────────────────────────────────────────────────────
   Info panel (dashboard prawa kolumna)
   ───────────────────────────────────────────────────────────── */

export function ExamFlowInfoPanel() {
    const progress = useExamProgress(TOTAL_CHECKLIST);
    const pct = progress.total === 0 ? 0 : Math.round((progress.done / progress.total) * 100);

    return (
        <aside className="exam-flow-infopanel" aria-label="Informacje o egzaminie">
            <dl className="exam-flow-infopanel-grid">
                <div>
                    <dt>Czas</dt>
                    <dd>{examMeta.time}</dd>
                </div>
                <div>
                    <dt>Technologie</dt>
                    <dd>{examMeta.technologies.join(" · ")}</dd>
                </div>
                <div>
                    <dt>Prog</dt>
                    <dd>{examMeta.scoreTarget}</dd>
                </div>
                <div>
                    <dt>Punkty</dt>
                    <dd>{examMeta.scoringTotal}</dd>
                </div>
            </dl>

            <div className="exam-flow-progress">
                <div className="exam-flow-progress-head">
                    <span>Postep checklisty</span>
                    <strong>
                        {progress.done}/{progress.total}
                    </strong>
                </div>
                <div className="exam-flow-progress-bar" aria-hidden="true">
                    <div className="exam-flow-progress-bar-fill" style={{ width: `${pct}%` }} />
                </div>
                <Link href={`${examFlowBasePath}/kontrola`} className="exam-flow-progress-link">
                    Otworz pelna checkliste →
                </Link>
            </div>

            <div className="exam-flow-rule">
                <span>Zasada kolejnosci</span>
                <strong>{examMeta.rule}</strong>
            </div>
        </aside>
    );
}

/* ─────────────────────────────────────────────────────────────
   Stage aside — slim aside na podstronie etapu
   ───────────────────────────────────────────────────────────── */

export function ExamFlowStageAside({ step }: { step: ExamStepView }) {
    const progress = useExamProgress(TOTAL_CHECKLIST);
    const pct = progress.total === 0 ? 0 : Math.round((progress.done / progress.total) * 100);

    const idx = examStepsView.findIndex((s) => s.slug === step.slug);
    const prev = idx > 0 ? examStepsView[idx - 1] : null;
    const next = idx < examStepsView.length - 1 ? examStepsView[idx + 1] : null;

    return (
        <aside className="exam-flow-aside" aria-label="Postep etapu">
            <div className="exam-flow-aside-block">
                <p className="exam-flow-aside-kicker">Postep ogolny</p>
                <div className="exam-flow-progress-head">
                    <span>Checklista</span>
                    <strong>
                        {progress.done}/{progress.total}
                    </strong>
                </div>
                <div className="exam-flow-progress-bar" aria-hidden="true">
                    <div className="exam-flow-progress-bar-fill" style={{ width: `${pct}%` }} />
                </div>
            </div>

            <div className="exam-flow-aside-block">
                <p className="exam-flow-aside-kicker">Ten etap</p>
                <dl className="exam-flow-aside-meta">
                    <div>
                        <dt>Czas</dt>
                        <dd>{step.minutes}</dd>
                    </div>
                    <div>
                        <dt>Tech</dt>
                        <dd>{step.technologies.join(" · ")}</dd>
                    </div>
                </dl>
            </div>

            <div className="exam-flow-aside-block">
                <p className="exam-flow-aside-kicker">Nawigacja</p>
                <div className="exam-flow-aside-nav">
                    {prev ? (
                        <Link href={`${examFlowBasePath}/${prev.slug}`} className="exam-flow-aside-link">
                            <span>← Poprzedni</span>
                            <strong>{prev.label}</strong>
                        </Link>
                    ) : (
                        <Link href={examFlowBasePath} className="exam-flow-aside-link">
                            <span>← Wroc</span>
                            <strong>Przeglad</strong>
                        </Link>
                    )}
                    {next ? (
                        <Link href={`${examFlowBasePath}/${next.slug}`} className="exam-flow-aside-link is-next">
                            <span>Nastepny →</span>
                            <strong>{next.label}</strong>
                        </Link>
                    ) : (
                        <Link href={examFlowBasePath} className="exam-flow-aside-link is-next">
                            <span>Koniec →</span>
                            <strong>Wroc na dashboard</strong>
                        </Link>
                    )}
                </div>
            </div>

            <div className="exam-flow-aside-block exam-flow-aside-help">
                <p className="exam-flow-aside-kicker">Pomoc</p>
                <p>
                    Punkty leca za <strong>zgodnosc z poleceniem</strong>, nie kreatywnosc. Przy watpliwosciach
                    wracaj do polecenia w arkuszu.
                </p>
            </div>
        </aside>
    );
}
