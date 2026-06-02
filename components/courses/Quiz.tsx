"use client";

import { useState } from "react";

type QuizQuestion = {
    question: string;
    options: string[];
    /** Indeks poprawnej odpowiedzi (0-based) */
    correct: number;
    /** Wyjaśnienie pokazywane po odpowiedzi */
    explanation?: string;
};

type QuizProps = {
    questions: QuizQuestion[];
    title?: string;
};

/**
 * Quiz sprawdzający wiedzę na końcu lekcji. Bez kont, bez backendu —
 * weryfikacja wyłącznie wiedzy ucznia, wynik liczony lokalnie w przeglądarce.
 * Użycie w MDX:
 *   <Quiz questions={[
 *     { question: "Co robi tag <nav>?", options: ["...", "..."], correct: 0, explanation: "..." }
 *   ]} />
 */
export function Quiz({ questions, title = "Sprawdź wiedzę" }: QuizProps) {
    const [answers, setAnswers] = useState<Record<number, number>>({});
    const [submitted, setSubmitted] = useState(false);

    const allAnswered = questions.every((_, i) => answers[i] !== undefined);
    const score = questions.reduce(
        (acc, q, i) => (answers[i] === q.correct ? acc + 1 : acc),
        0
    );

    function selectAnswer(qIndex: number, optIndex: number) {
        if (submitted) return;
        setAnswers((prev) => ({ ...prev, [qIndex]: optIndex }));
    }

    function reset() {
        setAnswers({});
        setSubmitted(false);
    }

    return (
        <div className="quiz">
            <div className="quiz-header">
                <span className="quiz-label">QUIZ</span>
                <h3 className="quiz-title">{title}</h3>
            </div>

            <ol className="quiz-questions">
                {questions.map((q, qi) => (
                    <li key={qi} className="quiz-question">
                        <p className="quiz-question-text">{q.question}</p>
                        <div className="quiz-options">
                            {q.options.map((opt, oi) => {
                                const selected = answers[qi] === oi;
                                const isCorrect = oi === q.correct;
                                let state = "";
                                if (submitted) {
                                    if (isCorrect) state = "quiz-option-correct";
                                    else if (selected) state = "quiz-option-wrong";
                                } else if (selected) {
                                    state = "quiz-option-selected";
                                }
                                return (
                                    <button
                                        key={oi}
                                        type="button"
                                        className={`quiz-option ${state}`}
                                        onClick={() => selectAnswer(qi, oi)}
                                        disabled={submitted}
                                        aria-pressed={selected}
                                    >
                                        <span className="quiz-option-marker">
                                            {String.fromCharCode(65 + oi)}
                                        </span>
                                        <span>{opt}</span>
                                    </button>
                                );
                            })}
                        </div>
                        {submitted && q.explanation && (
                            <p className="quiz-explanation">{q.explanation}</p>
                        )}
                    </li>
                ))}
            </ol>

            <div className="quiz-footer">
                {!submitted ? (
                    <button
                        type="button"
                        className="quiz-submit"
                        onClick={() => setSubmitted(true)}
                        disabled={!allAnswered}
                    >
                        {allAnswered ? "SPRAWDŹ ODPOWIEDZI" : "ODPOWIEDZ NA WSZYSTKIE"}
                    </button>
                ) : (
                    <div className="quiz-result">
                        <span className="quiz-score">
                            {score} / {questions.length} poprawnych
                        </span>
                        <button type="button" className="quiz-retry" onClick={reset}>
                            SPRÓBUJ PONOWNIE
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
