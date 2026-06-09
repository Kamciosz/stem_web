"use client";

import Link from "next/link";
import { useEffect } from "react";
import {
    ExamFlowShell,
    ExamFlowStepNavGeneric,
    ExamFlowInfoPanelGeneric,
} from "./ExamFlowChromeGeneric";
import { ExamImagePreview } from "./ExamImagePreview";
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
type Materials = { files: readonly MaterialFile[]; result: MaterialFile };

type Props = {
    meta: ExamMetaGeneric;
    steps: { slug: string; index: number; label: string; short: string; summary: string; minutes: string; technologies: string[]; mdx?: () => Promise<{ default: React.ComponentType }> }[];
    strategy: StrategyItem[];
    materials: Materials;
    basePath: string;
};

function ExamFutureVideoSlot({ examId }: { examId: string }) {
    return (
        <section className="exam-flow-video-slot" aria-hidden="true" data-video-state="reserved" hidden>
            {/*
              Reserved for future lesson video embeds per exam.
              Intended data shape:
              const videoSources = {
                  youtubeId?: "...",
                  cloudflareStreamId?: "...",
                  poster?: "/img/egzaminy/...",
              };
              Runtime rule for future implementation:
              1. Prefer Cloudflare Stream when cloudflareStreamId is configured and playable.
              2. Fallback to YouTube when youtubeId is configured or Cloudflare errors.
              3. If both fail/missing, render nothing for students; only log a developer warning in non-production.
              This placeholder is hidden intentionally so unfinished video support is invisible in frontend.
            */}
            <span>{examId}</span>
        </section>
    );
}

function MaterialsGallery({ materials }: { materials: Materials }) {
    const allMaterials = [...materials.files, materials.result];
    return (
        <section className="exam-flow-materials" aria-label="Materiały arkusza">
            <h2 className="exam-flow-section-title">Materiały</h2>
            <p className="exam-flow-section-lead">
                Wszystkie obrazy potrzebne w arkuszu są w jednej responsywnej galerii. Miniatury nie są ucinane; kliknięcie otwiera podgląd z zoomem.
            </p>
            <div className="exam-flow-materials-grid" data-count={allMaterials.length}>
                {allMaterials.map((file, index) => (
                    <figure key={`${file.src}-${index}`} className={index === allMaterials.length - 1 ? "is-result" : undefined}>
                        <ExamImagePreview src={file.src} alt={file.alt} title={file.title} />
                        <figcaption>
                            <strong>{file.title}</strong>
                            <span>{index === allMaterials.length - 1 ? "wzór końcowy" : file.caption}</span>
                        </figcaption>
                    </figure>
                ))}
            </div>
        </section>
    );
}

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
    const timeMinutes = Number.parseInt(String(meta.time ?? ""), 10);
    const learningResourceJsonLd = {
        "@context": "https://schema.org",
        "@type": "LearningResource",
        name: meta.title,
        description: meta.description,
        learningResourceType: "exam walkthrough",
        educationalLevel: "secondary education/vocational",
        inLanguage: "pl",
        isAccessibleForFree: true,
        url: `https://stem-web-569q.vercel.app${basePath}`,
        teaches: meta.technologies,
        assesses: meta.objective,
        ...(Number.isFinite(timeMinutes) ? { timeRequired: `PT${timeMinutes}M` } : {}),
        provider: {
            "@type": "EducationalOrganization",
            name: "STEM | Koło Technologiczne",
            url: "https://stem-web-569q.vercel.app",
        },
    };

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
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(learningResourceJsonLd) }}
            />
            <ExamFlowHeaderGeneric meta={meta} />
            <ExamFlowStepNavGeneric stepViews={stepViews} basePath={basePath} />
            <ExamFutureVideoSlot examId={meta.examId} />

            <div className="exam-flow-dashboard">
                <section className="exam-flow-dashboard-main">
                    <section className="exam-flow-stages" aria-label="Etapy">
                        <h2 className="exam-flow-section-title">Etapy</h2>
                        <p className="exam-flow-section-lead">
                            Cztery etapy w kolejności pracy. Każdy ma osobną stronę z kodem, błędami i punktacją.
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
                                                Otwórz →
                                            </span>
                                        </Link>
                                    </RevealOnScroll>
                                </li>
                            ))}
                        </ol>
                    </section>

                    {materials.files.length > 0 && <MaterialsGallery materials={materials} />}

                    <section className="exam-flow-strategy" aria-label="Strategia czasu">
                        <h2 className="exam-flow-section-title">Strategia</h2>
                        <p className="exam-flow-section-lead">
                            Najpierw działające dane, potem wygląd. Tak nie traci się punktów na końcu.
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
            <nav className="exam-flow-breadcrumb" aria-label="Ścieżka egzaminu">
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
                <div className="exam-flow-header-meta" aria-label="Parametry egzaminu">
                    <dl>
                        <dt>Czas</dt>
                        <dd>{meta.time}</dd>
                        <dt>Punktacja</dt>
                        <dd>{meta.scoringTotal}</dd>
                        <dt>Technologie</dt>
                        <dd>{meta.technologies.join(" · ")}</dd>
                    </dl>
                </div>
            </div>
        </header>
    );
}
