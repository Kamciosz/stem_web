"use client";

/**
 * Generyczne wersje komponentow ExamFlow.
 * Kazdy komponent przyjmuje meta/basePath/stepViews jako props.
 * Stary `ExamFlowChrome.tsx` (hardcoded import) zostaje dla prototypu
 * egzamin-01-styczen-2026 - ten plik jest dla pozostalych 53 egzaminow.
 */

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import { useExamProgress } from "./useExamProgressGlobal";
import type { ExamStepView } from "@/lib/exams/inf-03-egzamin-01";

type LocalStepView = {
    slug: string;
    index: number;
    label: string;
    short: string;
    summary: string;
    minutes: string;
    technologies: string[];
};

type BaseProps = {
    meta: {
        lessonSlug: string;
        examId: string;
        courseId: string;
        title: string;
        description: string;
        technologies: string[];
        time: string;
        scoreTarget: string;
        scoringTotal: string;
        rule: string;
    };
    basePath: string;
};

/* ─────────────────────────────────────────────────────────────
   Shell
   ───────────────────────────────────────────────────────────── */

export function ExamFlowShell({
    children,
    meta,
    basePath: _basePath,
}: {
    children: ReactNode;
    meta: BaseProps["meta"];
    basePath: string;
}) {
    return (
        <div className="exam-flow" data-exam-flow={meta.lessonSlug}>
            <div className="exam-flow-inner">{children}</div>
        </div>
    );
}

/* ─────────────────────────────────────────────────────────────
   Breadcrumb
   ───────────────────────────────────────────────────────────── */

export function ExamFlowBreadcrumbGeneric({
    meta,
    basePath,
    currentStep,
}: BaseProps & { currentStep?: LocalStepView }) {
    return (
        <nav className="exam-flow-breadcrumb" aria-label="Sciezka egzaminu">
            <Link href="/kursy">Kursy</Link>
            <span aria-hidden="true">/</span>
            <Link href={`/kursy/${meta.courseId}`}>
                {meta.courseId.toUpperCase().replace("-", ".")}
            </Link>
            <span aria-hidden="true">/</span>
            <Link href={basePath} className={currentStep ? "" : "is-current"}>
                {meta.examId}
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
   Step Nav — routing pills
   ───────────────────────────────────────────────────────────── */

export function ExamFlowStepNavGeneric({
    stepViews,
    basePath,
}: {
    stepViews: LocalStepView[];
    basePath: string;
}) {
    const pathname = usePathname() ?? "";
    const dashboardActive = pathname === basePath;

    return (
        <nav className="exam-flow-stepnav" aria-label="Etapy egzaminu">
            <Link
                href={basePath}
                className={`exam-flow-step ${dashboardActive ? "is-active" : ""}`}
                aria-current={dashboardActive ? "page" : undefined}
            >
                <span className="exam-flow-step-index">00</span>
                <span className="exam-flow-step-label">Przeglad</span>
            </Link>
            {stepViews.map((step) => {
                const href = `${basePath}/${step.slug}`;
                const active = pathname === href;
                return (
                    <Link
                        key={step.slug}
                        href={href}
                        className={`exam-flow-step ${active ? "is-active" : ""}`}
                        aria-current={active ? "page" : undefined}
                    >
                        <span className="exam-flow-step-index">
                            {String(step.index).padStart(2, "0")}
                        </span>
                        <span className="exam-flow-step-label">{step.label}</span>
                    </Link>
                );
            })}
        </nav>
    );
}

/* ─────────────────────────────────────────────────────────────
   Info panel — right column on dashboard
   ───────────────────────────────────────────────────────────── */

export function ExamFlowInfoPanelGeneric({
    meta,
    basePath,
    totalChecklist,
}: BaseProps & { totalChecklist: number }) {
    const progress = useExamProgress(meta.lessonSlug, totalChecklist);
    const pct = progress.total === 0 ? 0 : Math.round((progress.done / progress.total) * 100);

    return (
        <aside className="exam-flow-infopanel" aria-label="Informacje o egzaminie">
            <dl className="exam-flow-infopanel-grid">
                <div>
                    <dt>Czas</dt>
                    <dd>{meta.time}</dd>
                </div>
                <div>
                    <dt>Technologie</dt>
                    <dd>{meta.technologies.join(" · ")}</dd>
                </div>
                <div>
                    <dt>Prog</dt>
                    <dd>{meta.scoreTarget}</dd>
                </div>
                <div>
                    <dt>Punkty</dt>
                    <dd>{meta.scoringTotal}</dd>
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
                <Link href={`${basePath}/kontrola`} className="exam-flow-progress-link">
                    Otworz pelna checkliste →
                </Link>
            </div>

            <div className="exam-flow-rule">
                <span>Zasada kolejnosci</span>
                <strong>{meta.rule}</strong>
            </div>
        </aside>
    );
}

/* ─────────────────────────────────────────────────────────────
   Stage Aside — slim aside on stage page
   ───────────────────────────────────────────────────────────── */

export function ExamFlowStageAsideGeneric({
    step,
    stepViews,
    meta,
    basePath,
    totalChecklist,
}: {
    step: LocalStepView;
    stepViews: LocalStepView[];
    meta: BaseProps["meta"];
    basePath: string;
    totalChecklist: number;
}) {
    const progress = useExamProgress(meta.lessonSlug, totalChecklist);
    const pct = progress.total === 0 ? 0 : Math.round((progress.done / progress.total) * 100);
    const idx = stepViews.findIndex((s) => s.slug === step.slug);
    const prev = idx > 0 ? stepViews[idx - 1] : null;
    const next = idx < stepViews.length - 1 ? stepViews[idx + 1] : null;

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
                        <Link href={`${basePath}/${prev.slug}`} className="exam-flow-aside-link">
                            <span>← Poprzedni</span>
                            <strong>{prev.label}</strong>
                        </Link>
                    ) : (
                        <Link href={basePath} className="exam-flow-aside-link">
                            <span>← Wroc</span>
                            <strong>Przeglad</strong>
                        </Link>
                    )}
                    {next ? (
                        <Link
                            href={`${basePath}/${next.slug}`}
                            className="exam-flow-aside-link is-next"
                        >
                            <span>Nastepny →</span>
                            <strong>{next.label}</strong>
                        </Link>
                    ) : (
                        <Link href={basePath} className="exam-flow-aside-link is-next">
                            <span>Koniec →</span>
                            <strong>Wroc na dashboard</strong>
                        </Link>
                    )}
                </div>
            </div>
        </aside>
    );
}
