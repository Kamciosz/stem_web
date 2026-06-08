"use client";

import { createContext, useContext, ReactNode } from "react";

/**
 * Typ dla pojedynczego etapu egzaminu.
 */
export interface ExamStepView {
    slug: string;
    index: number;
    label: string;
    short: string;
    summary: string;
    minutes: string;
    technologies: string[];
}

/**
 * Context dla metadanych egzaminu — dostępny globalnie w drzewie ExamFlow.
 */
export interface ExamFlowContextValue {
    examFlowBasePath: string;
    examMeta: {
        courseId: string;
        lessonSlug: string;
        examId: string;
        session: string;
        title: string;
        description: string;
        time: string;
        technologies: string[];
        scoreTarget: string;
        scoringTotal: string;
        rule: string;
    };
    examStepsView: ExamStepView[];
    examChecklistKeys: string[];
    examMaterials: {
        assets?: string;
        database?: string;
    };
    examStrategy: string;
}

const ExamFlowContext = createContext<ExamFlowContextValue | null>(null);

export function ExamFlowProvider({
    children,
    value,
}: {
    children: ReactNode;
    value: ExamFlowContextValue;
}) {
    return <ExamFlowContext.Provider value={value}>{children}</ExamFlowContext.Provider>;
}

export function useExamFlow() {
    const ctx = useContext(ExamFlowContext);
    if (!ctx) {
        throw new Error("useExamFlow must be used within ExamFlowProvider");
    }
    return ctx;
}
