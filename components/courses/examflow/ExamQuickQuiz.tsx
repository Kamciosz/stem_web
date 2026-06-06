import { generateQuickQuiz, QuizQuestion } from "@/lib/exam-quiz";
import { Quiz } from "@/components/courses/Quiz";

type Meta = {
    title: string;
    examId: string;
    session: string;
    topic: string;
    description: string;
    technologies: string[];
    scoreTarget: string;
    scoringTotal: string;
    time: string;
    rule: string;
};

export function ExamQuickQuiz({ meta }: { meta: Meta }) {
    const questions: QuizQuestion[] = generateQuickQuiz(meta, 5);
    return (
        <section className="exam-quick-quiz" aria-label="Szybki quiz z tego arkusza">
            <h2 className="exam-quick-quiz-title">Szybki quiz</h2>
            <p className="exam-quick-quiz-lead">
                5 pytan z metadanych arkusza. Sprawdza czy pamietasz co wlasnie przeczytales.
            </p>
            <Quiz questions={questions} title="Quiz: ten arkusz" />
        </section>
    );
}
