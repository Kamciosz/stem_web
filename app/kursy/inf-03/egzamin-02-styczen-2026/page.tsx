import { Metadata } from "next";
import { ExamFlowDashboard } from "@/components/courses/examflow/ExamFlowDashboard";
import * as examDataModule from "@/lib/exams/inf-03-egzamin-02";

export const metadata: Metadata = {
    title: `${examDataModule.examMeta.title} | INF.03`,
    description: `Omówienie egzaminu INF.03: ${examDataModule.examMeta.topic}. Etapy rozwiązania, wymagania, kod, CSS, baza danych i checklista punktów do nauki przed egzaminem zawodowym.`,
    alternates: { canonical: examDataModule.examFlowBasePath },
    openGraph: {
        title: `${examDataModule.examMeta.title} | STEM`,
        description: examDataModule.examMeta.description,
        url: examDataModule.examFlowBasePath,
    },
};

export default function ExamPage() {
    // Przekazuj tylko serializowalne pola do Client Component
    const examData = {
        examFlowBasePath: examDataModule.examFlowBasePath,
        examMeta: examDataModule.examMeta,
        examStepsView: examDataModule.examStepsView,
        examChecklistKeys: examDataModule.examChecklistKeys,
        examMaterials: examDataModule.examMaterials,
        examStrategy: examDataModule.examStrategy,
    };
    return <ExamFlowDashboard examData={examData} />;
}
