/**
 * Generyczne pytania quiz oparte na metadanych egzaminu.
 * 5 pytan - szybkie, merytoryczne.
 */

type ExamLike = {
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

export type QuizQuestion = {
    question: string;
    options: string[];
    correct: number;
    explanation: string;
};

function shuffle<T>(arr: T[]): T[] {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

export function generateQuickQuiz(exam: ExamLike, count = 5): QuizQuestion[] {
    const qs: QuizQuestion[] = [];
    const techs = exam.technologies;

    // 1. Temat
    if (exam.topic) {
        const options = shuffle([
            exam.topic,
            ...shuffle(techs).slice(0, 3).filter((t) => t !== exam.topic),
            "Quiz mieszany",
        ]).slice(0, 4);
        if (!options.includes(exam.topic)) options[0] = exam.topic;
        qs.push({
            question: `Jaki jest temat tego arkusza?`,
            options: shuffle(options),
            correct: options.indexOf(exam.topic),
            explanation: `Temat arkusza to "${exam.topic}" — ${exam.title}.`,
        });
    }

    // 2. Technologie
    if (techs.length > 0) {
        const correct = techs[0];
        const options = shuffle([
            correct,
            ...shuffle(["PHP", "JavaScript", "Python", "C++", "Java", "Ruby", "Go", "Rust"]).filter(
                (t) => t !== correct
            ).slice(0, 3),
        ]).slice(0, 4);
        if (!options.includes(correct)) options[0] = correct;
        qs.push({
            question: `Ktora technologia jest wymagana w tym arkuszu?`,
            options: shuffle(options),
            correct: options.indexOf(correct),
            explanation: `Wymagane technologie: ${techs.join(", ")}.`,
        });
    }

    // 3. Sesja
    if (exam.session) {
        const correct = exam.session;
        const sessions = [
            "Styczen 2023",
            "Czerwiec 2024",
            "Styczen 2024",
            "Czerwiec 2025",
            "Styczen 2025",
            "Styczen 2026",
        ];
        const options = shuffle(sessions.filter((s) => s !== correct).concat(correct)).slice(0, 4);
        if (!options.includes(correct)) options[0] = correct;
        qs.push({
            question: `Z ktorej sesji pochodzi ten arkusz?`,
            options: shuffle(options),
            correct: options.indexOf(correct),
            explanation: `Arkusz pochodzi z sesji ${correct}.`,
        });
    }

    // 4. Czas
    if (exam.time) {
        const m = exam.time.match(/(\d+)/);
        if (m) {
            const minutes = parseInt(m[1], 10);
            const correct = `${minutes} min`;
            const options = shuffle([
                correct,
                `${minutes + 30} min`,
                `${Math.max(15, minutes - 30)} min`,
                `${minutes + 60} min`,
            ]).slice(0, 4);
            if (!options.includes(correct)) options[0] = correct;
            qs.push({
                question: `Ile czasu masz na ten egzamin?`,
                options: shuffle(options),
                correct: options.indexOf(correct),
                explanation: `Czas egzaminu: ${exam.time}.`,
            });
        }
    }

    // 5. Score target
    if (exam.scoreTarget) {
        const m = exam.scoreTarget.match(/(\d+)/);
        if (m) {
            const target = parseInt(m[1], 10);
            const correct = exam.scoreTarget;
            const options = shuffle([
                correct,
                `~${target + 5} / ${exam.scoringTotal || "30"} pkt`,
                `~${Math.max(0, target - 5)} / ${exam.scoringTotal || "30"} pkt`,
                `100% / 30 pkt`,
            ]).slice(0, 4);
            if (!options.includes(correct)) options[0] = correct;
            qs.push({
                question: `Ile punktow musisz uzyskac, by zaliczyc?`,
                options: shuffle(options),
                correct: options.indexOf(correct),
                explanation: `Prog zdania: ${exam.scoreTarget}.`,
            });
        }
    }

    return qs.slice(0, count);
}
