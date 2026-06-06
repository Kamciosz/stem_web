"use client";

/**
 * Generyczny ExamFlowStagePage (props-based).
 * Server-side MDX rendering -> Client component wrapper.
 */

import { ReactNode, useEffect } from "react";
import {
    ExamFlowShell,
    ExamFlowInfoPanelGeneric,
    ExamFlowStepNavGeneric,
    ExamFlowStageAsideGeneric,
} from "./ExamFlowChromeGeneric";
import { useScrollMemory } from "./useScrollMemory";
import { trackRecent } from "./RecentlyVisited";
import { ShareButton } from "@/components/ShareButton";

type StepView = {
    slug: string;
    index: number;
    label: string;
    short: string;
    summary: string;
    minutes: string;
    technologies: string[];
};

type Meta = {
    lessonSlug: string;
    examId: string;
    courseId: string;
    session?: string;
    title: string;
    description: string;
    technologies: string[];
    time: string;
    scoreTarget: string;
    scoringTotal: string;
    rule: string;
};

type Props = {
    step: StepView;
    meta: Meta;
    stepViews: StepView[];
    basePath: string;
    totalChecklist: number;
    children: ReactNode;
};

export function ExamFlowStagePageGeneric({ step, meta, stepViews, basePath, totalChecklist, children }: Props) {
    useScrollMemory(meta.lessonSlug, step.slug);
    useEffect(() => {
        trackRecent({
            slug: meta.lessonSlug,
            title: meta.title,
            examId: meta.examId,
            basePath,
        });
    }, [meta.lessonSlug, meta.title, meta.examId, basePath]);
    return (
        <ExamFlowShell meta={meta} basePath={basePath}>
            <ExamFlowHeaderGeneric step={step} meta={meta} basePath={basePath} />
            <ExamFlowStepNavGeneric stepViews={stepViews} basePath={basePath} />
            <div className="exam-flow-stage">
                <main className="exam-flow-stage-main">
                    <div className="exam-flow-stage-content lesson-content">{children}</div>
                </main>
                <ExamFlowStageAsideGeneric
                    step={step}
                    stepViews={stepViews}
                    meta={meta}
                    basePath={basePath}
                    totalChecklist={totalChecklist}
                />
            </div>
        </ExamFlowShell>
    );
}

function ExamFlowHeaderGeneric({
    step,
    meta,
    basePath,
}: {
    step: StepView;
    meta: Meta;
    basePath: string;
}) {
    return (
        <header className="exam-flow-header">
            <nav className="exam-flow-breadcrumb" aria-label="Sciezka egzaminu">
                <a href="/kursy">Kursy</a>
                <span aria-hidden="true">/</span>
                <a href={`/kursy/${meta.courseId}`}>{meta.courseId.toUpperCase().replace("-", ".")}</a>
                <span aria-hidden="true">/</span>
                <a href={basePath} className="">
                    {meta.examId}
                </a>
                <span aria-hidden="true">/</span>
                <span className="is-current">{step.label}</span>
            </nav>
            <div className="exam-flow-header-row">
                <div className="exam-flow-header-copy">
                    <p className="exam-flow-eyebrow">
                        {meta.session ? `${meta.examId} · ${meta.session}` : meta.examId}
                    </p>
                    <div className="exam-flow-title-row">
                        <span className="exam-flow-step-badge" aria-hidden="true">
                            {String(step.index).padStart(2, "0")}
                        </span>
                        <h1 className="exam-flow-title">{step.label}</h1>
                    </div>
                    <p className="exam-flow-lead">{step.summary}</p>
                </div>
                <div className="exam-flow-header-meta">
                    <dl>
                        <div>
                            <dt>Czas</dt>
                            <dd>{step.minutes}</dd>
                        </div>
                        <div>
                            <dt>Technologie</dt>
                            <dd>{step.technologies.join(" · ")}</dd>
                        </div>
                    </dl>
                    <ShareButton title={`${meta.title} - ${step.label}`} url={`${basePath}/${step.slug}`} className="share-button-header" />
                </div>
            </div>
        </header>
    );
}
