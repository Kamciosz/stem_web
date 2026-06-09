"use client";

import React from "react";
import Link from "next/link";
import {
    ExamFlowHeader,
    ExamFlowInfoPanel,
    ExamFlowShell,
    ExamFlowStepNav,
} from "./ExamFlowChrome";
import { ExamFlowProvider } from "./ExamFlowContext";
import { ExamImagePreview } from "./ExamImagePreview";

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

function MaterialsGallery({ materials }: { materials: any }) {
    const allMaterials = [...(materials.files ?? []), materials.result].filter(Boolean);
    return (
        <section className="exam-flow-materials" aria-label="Materiały arkusza">
            <h2 className="exam-flow-section-title">Materiały</h2>
            <p className="exam-flow-section-lead">
                Wszystkie obrazy potrzebne w arkuszu są w jednej responsywnej galerii. Miniatury nie są ucinane; kliknięcie otwiera podgląd z zoomem.
            </p>
            <div className="exam-flow-materials-grid" data-count={allMaterials.length}>
                {allMaterials.map((file: any, index: number) => (
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

/**
 * Dashboard egzaminu — entry point /kursy/inf-03/egzamin-XX-styczen-2026.
 * Client component — otrzymuje metadata z server component.
 */
export function ExamFlowDashboard({ examData }: { examData: any }) {
    const contextValue = {
        examFlowBasePath: examData.examFlowBasePath,
        examMeta: examData.examMeta,
        examStepsView: examData.examStepsView,
        examChecklistKeys: examData.examChecklistKeys || [],
        examMaterials: examData.examMaterials,
        examStrategy: examData.examStrategy,
    };

    const { examFlowBasePath, examMeta, examStepsView, examMaterials, examStrategy } = contextValue;
    const timeMinutes = Number.parseInt(String(examMeta.time ?? ""), 10);
    const learningResourceJsonLd = {
        "@context": "https://schema.org",
        "@type": "LearningResource",
        name: examMeta.title,
        description: examMeta.description,
        learningResourceType: "exam walkthrough",
        educationalLevel: "secondary education/vocational",
        inLanguage: "pl",
        isAccessibleForFree: true,
        url: `https://stem-web-569q.vercel.app${examFlowBasePath}`,
        teaches: examMeta.technologies,
        assesses: examMeta.objective,
        ...(Number.isFinite(timeMinutes) ? { timeRequired: `PT${timeMinutes}M` } : {}),
        provider: {
            "@type": "EducationalOrganization",
            name: "STEM | Koło Technologiczne",
            url: "https://stem-web-569q.vercel.app",
        },
    };

    return (
        <ExamFlowProvider value={contextValue}>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(learningResourceJsonLd) }}
            />
            <ExamFlowShell>
                <ExamFlowHeader />
                <ExamFlowStepNav />
                <ExamFutureVideoSlot examId={examMeta.examId} />

                <div className="exam-flow-dashboard">
                    <section className="exam-flow-dashboard-main">
                        <section className="exam-flow-stages" aria-label="Etapy">
                            <h2 className="exam-flow-section-title">Etapy</h2>
                            <p className="exam-flow-section-lead">
                                Cztery etapy w kolejności pracy. Każdy ma osobną stronę z kodem, błędami i punktacją.
                            </p>
                            <ol className="exam-flow-stages-grid">
                                {examStepsView.map((step: any) => (
                                    <li key={step.slug}>
                                        <Link href={`${examFlowBasePath}/${step.slug}`} className="exam-flow-stage-card">
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
                                    </li>
                                ))}
                            </ol>
                        </section>

                        {examMaterials && <MaterialsGallery materials={examMaterials} />}

                        <section className="exam-flow-strategy" aria-label="Strategia czasu">
                            <h2 className="exam-flow-section-title">Strategia</h2>
                            <p className="exam-flow-section-lead">
                                Najpierw działające dane, potem wygląd. Tak nie traci się punktów na końcu.
                            </p>
                            <ol className="exam-flow-strategy-list">
                                {examStrategy.map((step: any) => (
                                    <li key={step.time}>
                                        <time>{step.time}</time>
                                        <div>
                                            <strong>{step.title}</strong>
                                            <p>{step.body}</p>
                                        </div>
                                        <span className="exam-flow-strategy-tag">{step.tag}</span>
                                    </li>
                                ))}
                            </ol>
                            <p className="exam-flow-strategy-objective">
                                <span>Cel arkusza</span>
                                {examMeta.objective}.
                            </p>
                        </section>
                    </section>

                    <aside className="exam-flow-dashboard-aside">
                        <ExamFlowInfoPanel />
                    </aside>
                </div>
            </ExamFlowShell>
        </ExamFlowProvider>
    );
}
