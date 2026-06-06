"use client";

/**
 * Generyczny, props-based ExamFlowDashboard.
 * Dla kazdego egzaminu page.tsx importuje swoj lib i przekazuje meta/steps/strategy/materials.
 * Stary `ExamFlowDashboard` (hardcoded import) zostaje dla egzamin-01-styczen-2026.
 *
 * Typy zdefiniowane lokalnie (niezalezne od konkretnego lib file) - rozne lib files
 * maja literal type dla `lessonSlug`, co uniemozliwia structural assignability.
 */

import Link from "next/link";
import { useEffect } from "react";
import {
    ExamFlowShell,
    ExamFlowStepNavGeneric,
    ExamFlowInfoPanelGeneric,
} from "./ExamFlowChromeGeneric";
import { ExamProgressBadge } from "./ExamProgressBadge";
import { RevealOnScroll } from "./RevealOnScroll";
import { trackRecent } from "./RecentlyVisited";

export type ExamMetaGeneric = {
    courseId: string;
    lessonSlug: string;
    examId: string;
    session: string;
    title: string;
    topic: string;
    description: string;
    rule: string;
    time: string;
    technologies: string[];
    scoreTarget: string;
    scoringTotal: string;
    objective: string;
};

export type ExamStepViewGeneric = {
    slug: string;
    index: number;
    label: string;
    short: string;
    summary: string;
    minutes: string;
    technologies: string[];
};

type StrategyItem = { time: string; title: string; body: string; tag: string };
type MaterialFile = { src: string; title: string; caption: string; alt: string };
type Materials = { files: MaterialFile[]; result: MaterialFile };

type Props = {
    meta: ExamMetaGeneric;
    steps: { slug: string; index: number; label: string; short: string; summary: string; minutes: string; technologies: string[]; mdx?: () => Promise<{ default: React.ComponentType }> }[];
    strategy: StrategyItem[];
    materials: Materials;
    basePath: string;
};

export function ExamFlowDashboardGeneric({ meta, steps, strategy, materials, basePath }: Props) {
    const stepViews: ExamStepViewGeneric[] = steps.map((s) => ({
        slug: s.slug,
        index: s.index,
        label: s.label,
        short: s.short,
        summary: s.summary,
        minutes: s.minutes,
        technologies: s.technologies,
    }));
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
            <ExamFlowHeaderGeneric meta={meta} />
            <ExamFlowStepNavGeneric stepViews={stepViews} basePath={basePath} />

            <div className="exam-flow-dashboard">
                <section className="exam-flow-dashboard-main">
                    <section className="exam-flow-stages" aria-label="Etapy">
                        <h2 className="exam-flow-section-title">Etapy</h2>
                        <p className="exam-flow-section-lead">
                            Cztery etapy w kolejnosci pracy. Kazdy na osobnej stronie z wlasnym kodem,
                            bledami i punktacja.
                        </p>
                        <ol className="exam-flow-stages-grid">
                            {stepViews.map((step, i) => (
                                <li key={step.slug}>
                                    <RevealOnScroll delay={i * 60}>
                                        <Link href={`${basePath}/${step.slug}`} className="exam-flow-stage-card">
                                            <span className="exam-flow-stage-index">
                                                {String(step.index).padStart(2, "0")}
                                            </span>
                                            <span className="exam-flow-stage-title">{step.label}</span>
                                            <span className="exam-flow-stage-summary">{step.summary}</span>
                                            <span className="exam-flow-stage-meta">
                                                <span>{step.minutes}</span>
                                                <span>{step.technologies.join(" · ")}</span>
                                            </span>
                                            <span className="exam-flow-stage-cta" aria-hidden="true">
                                                Otworz →
                                            </span>
                                        </Link>
                                    </RevealOnScroll>
                                </li>
                            ))}
                        </ol>
                    </section>

                    {materials.files.length > 0 && (
                        <section className="exam-flow-materials" aria-label="Materialy arkusza">
                            <h2 className="exam-flow-section-title">Materialy</h2>
                            <p className="exam-flow-section-lead">
                                Trzy obrazki z arkusza i makieta koncowa. Po lewej minatury, po prawej cel.
                            </p>
                            <div className="exam-flow-materials-layout">
                                <div className="exam-flow-materials-thumbs">
                                    {materials.files.map((file) => (
                                        <figure key={file.src}>
                                            <a href={file.src} target="_blank" rel="noopener noreferrer">
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img src={file.src} alt={file.alt} loading="lazy" />
                                            </a>
                                            <figcaption>
                                                <strong>{file.title}</strong>
                                                <span>{file.caption}</span>
                                            </figcaption>
                                        </figure>
                                    ))}
                                </div>
                                <figure className="exam-flow-materials-result">
                                    <a href={materials.result.src} target="_blank" rel="noopener noreferrer">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={materials.result.src} alt={materials.result.alt} loading="lazy" />
                                    </a>
                                    <figcaption>
                                        <strong>{materials.result.title}</strong>
                                        <span>{materials.result.caption}</span>
                                    </figcaption>
                                </figure>
                            </div>
                        </section>
                    )}

                    <section className="exam-flow-strategy" aria-label="Strategia czasu">
                        <h2 className="exam-flow-section-title">Strategia</h2>
                        <p className="exam-flow-section-lead">
                            Najpierw dzialajace dane, potem wyglad. Tak sie nie traci punktow na koncu.
                        </p>
                        <ol className="exam-flow-strategy-list">
                            {strategy.map((s) => (
                                <li key={s.time}>
                                    <time>{s.time}</time>
                                    <div>
                                        <strong>{s.title}</strong>
                                        <p>{s.body}</p>
                                    </div>
                                    <span className="exam-flow-strategy-tag">{s.tag}</span>
                                </li>
                            ))}
                        </ol>
                        <p className="exam-flow-strategy-objective">
                            <span>Cel arkusza</span>
                            {meta.objective}.
                        </p>
                    </section>
                </section>

                <ExamFlowInfoPanelGeneric meta={meta as any} basePath={basePath} totalChecklist={8} />
            </div>
        </ExamFlowShell>
    );
}

function ExamFlowHeaderGeneric({ meta }: { meta: ExamMetaGeneric }) {
    return (
        <header className="exam-flow-header">
            <nav className="exam-flow-breadcrumb" aria-label="Sciezka egzaminu">
                <Link href="/kursy">Kursy</Link>
                <span aria-hidden="true">/</span>
                <Link href={`/kursy/${meta.courseId}`}>
                    {meta.courseId.toUpperCase().replace("-", ".")}
                </Link>
                <span aria-hidden="true">/</span>
                <span className="is-current">{meta.examId}</span>
            </nav>
            <div className="exam-flow-header-row">
                <div className="exam-flow-header-copy">
                    <p className="exam-flow-eyebrow">{`${meta.examId} · ${meta.session}`}</p>
                    <h1 className="exam-flow-title">
                        {meta.title}
                        <ExamProgressBadge examSlug={meta.lessonSlug} totalChecklist={8} />
                    </h1>
                    <p className="exam-flow-lead">{meta.description}</p>
                </div>
                <div className="exam-flow-header-meta">
                    <dl>
                        <div>
                            <dt>Czas</dt>
                            <dd>{meta.time}</dd>
                        </div>
                        <div>
                            <dt>Technologie</dt>
                            <dd>{meta.technologies.join(" · ")}</dd>
                        </div>
                    </dl>
                </div>
            </div>
        </header>
    );
}
