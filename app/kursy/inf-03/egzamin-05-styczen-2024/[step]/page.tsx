import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { examMeta, examSteps, getStepBySlug, toExamStepView } from "@/lib/exams/inf-03-egzamin-05-styczen-2024";
import { ExamFlowStagePage } from "@/components/courses/examflow/ExamFlowStagePage";
type StagePageProps = { params: Promise<{ step: string }>; };
export const dynamic = "force-static";
export function generateStaticParams() { return examSteps.map((s) => ({ step: s.slug })); }
export async function generateMetadata({ params }: StagePageProps): Promise<Metadata> {
    const { step: stepSlug } = await params;
    const step = getStepBySlug(stepSlug);
    if (!step) return { title: examMeta.title };
    return { title: `${examMeta.examId} - ${step.label} | ${examMeta.title}`, description: step.summary };
}
export default async function ExamStagePage({ params }: StagePageProps) {
    const { step: stepSlug } = await params;
    const step = getStepBySlug(stepSlug);
    if (!step) notFound();
    let Content!: React.ComponentType;
    try { const mod = await step.mdx(); Content = mod.default; } catch { notFound(); }
    return (<article className="lesson-page section-shell exam-lesson-page" data-exam-slug={examMeta.lessonSlug}>
        <div className="section-inner lesson-container exam-lesson-container"><div className="lesson-main exam-lesson-main">
            <ExamFlowStagePage step={toExamStepView(step)}><Content /></ExamFlowStagePage>
        </div></div></article>);
}
