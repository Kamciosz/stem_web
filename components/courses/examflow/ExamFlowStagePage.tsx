import { ReactNode } from "react";
import type { ExamStepView } from "@/lib/exams/inf-03-egzamin-01";
import {
    ExamFlowHeader,
    ExamFlowShell,
    ExamFlowStageAside,
    ExamFlowStepNav,
} from "./ExamFlowChrome";

/**
 * StagePage — wspolny layout 4 podstron etapow.
 * Server component, dziecko MDX renderowane jako `children`.
 * `step` musi byc ExamStepView (bez funkcji mdx), bo niesie sie do client component.
 */
export function ExamFlowStagePage({ step, children }: { step: ExamStepView; children: ReactNode }) {
    return (
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
    );
}
