import type { Metadata } from "next";
import type { ReactNode } from "react";
import { ExamFlowStagePageWithProvider } from "@/components/courses/examflow/ExamFlowStagePageWithProvider";
import * as examDataModule from "@/lib/exams/inf-03-egzamin-08";

const stageSlug = "html-php";
const stage = examDataModule.examStepsView.find((item) => item.slug === stageSlug);

export const metadata: Metadata = {
    title: `${examDataModule.examMeta.title} — ${stage?.label ?? "Etap"} | INF.03`,
    description: `${stage?.summary ?? examDataModule.examMeta.description} Omówienie etapu egzaminu INF.03: ${examDataModule.examMeta.topic}.`,
    alternates: { canonical: `${examDataModule.examFlowBasePath}/${stageSlug}` },
    openGraph: {
        title: `${examDataModule.examMeta.title} — ${stage?.label ?? "Etap"} | STEM`,
        description: stage?.summary ?? examDataModule.examMeta.description,
        url: `${examDataModule.examFlowBasePath}/${stageSlug}`,
    },
};


export default function StageLayout({ children }: { children: ReactNode }) {
    if (!stage) {
        return <>{children}</>;
    }

    const examData = {
        examFlowBasePath: examDataModule.examFlowBasePath,
        examMeta: examDataModule.examMeta,
        examStepsView: examDataModule.examStepsView,
        examChecklistKeys: examDataModule.examChecklistKeys,
        examMaterials: examDataModule.examMaterials,
        examStrategy: examDataModule.examStrategy,
    };

    return (
        <ExamFlowStagePageWithProvider examData={examData} step={stage}>
            {children}
        </ExamFlowStagePageWithProvider>
    );
}
