"use client";

import { ReactNode } from "react";
import type { ExamStepView } from "./ExamFlowContext";
import { ExamFlowProvider } from "./ExamFlowContext";
import {
    ExamFlowHeader,
    ExamFlowShell,
    ExamFlowStageAside,
    ExamFlowStepNav,
} from "./ExamFlowChrome";

/**
 * StagePageWithProvider — wrapper dla podstron etapow z ExamFlowProvider.
 * Client component, renderuje ExamFlowStagePage z contextem.
 */
export function ExamFlowStagePageWithProvider({
    examData,
    step,
    children,
}: {
    examData: any;
    step: ExamStepView;
    children: ReactNode;
}) {
    const contextValue = {
        examFlowBasePath: examData.examFlowBasePath,
        examMeta: examData.examMeta,
        examStepsView: examData.examStepsView,
        examChecklistKeys: examData.examChecklistKeys || [],
        examMaterials: examData.examMaterials,
        examStrategy: examData.examStrategy,
    };

    // Schema.org structured data dla SEO
    const schemaOrg = {
        "@context": "https://schema.org",
        "@type": "LearningResource",
        name: `${examData.examMeta.examId} — ${step.label}`,
        description: step.summary || examData.examMeta.description,
        educationalLevel: "Technik Programista",
        inLanguage: "pl",
        isAccessibleForFree: true,
        learningResourceType: "Tutorial",
        teaches: step.label,
        about: {
            "@type": "Thing",
            name: examData.examMeta.title,
        },
        provider: {
            "@type": "EducationalOrganization",
            name: "STEM | Koło Technologiczne",
            url: "https://stem-web-569q.vercel.app",
        },
        isPartOf: {
            "@type": "Course",
            name: "INF.03 — Przygotowanie do egzaminu",
            provider: {
                "@type": "EducationalOrganization",
                name: "STEM | Koło Technologiczne",
            },
        },
    };

    return (
        <ExamFlowProvider value={contextValue}>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrg) }}
            />
            <ExamFlowShell>
                <ExamFlowHeader currentStep={step} />
                <ExamFlowStepNav />

                <div className="exam-flow-stage">
                    <main className="exam-flow-stage-main">
                        <div className="exam-flow-stage-content lesson-content">{children}</div>
                    </main>
                    <ExamFlowStageAside step={step} />
                </div>
            </ExamFlowShell>
        </ExamFlowProvider>
    );
}
