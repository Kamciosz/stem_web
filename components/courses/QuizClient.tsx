"use client";

/**
 * QuizClient — klient quizu obsługujący:
 *   1. Pobranie puli pytań z /api/quiz/start
 *   2. Blokadę przy zmianie okna / przełączaniu karty
 *      (visibilitychange / blur → auto-submit z ujemnym wynikiem)
 *   3. Blokadę kopiowania / zaznaczania / drag&drop / menu kontekstowego
 *      oraz podstawowych skrótów klawiszowych (Ctrl+C, Ctrl+P, F12, DevTools).
 *
 * Ważne: blokady są "good faith" — wystarczą żeby zniechęcić przypadkowe
 * ściąganie, ale NIE są twierdzeniem bezpieczeństwa. Prawdziwa ochrona
 * quizu jest w API (anon NIGDY nie widzi correct_index, walidacja po
 * stronie serwera). Frontendowe blokady są UX, nie bezpieczeństwem.
 */

import { useCallback, useEffect, useRef, useState } from "react";

type QuizOption = { idx: number; label: string };
type QuizQuestion = { id: string; prompt: string; options: QuizOption[] };
type QuizResult = {
    questionId: string;
    chosen: number | null;
    correctIndex: number;
    isCorrect: boolean;
    explanation: string | null;
};

const VIOLATION_LIMIT = 2; // po ilu naruszeniach auto-submit

export function QuizClient({
    courseId,
    lessonSlug,
    lessonTitle
}: {
    courseId: string;
    lessonSlug: string;
    lessonTitle: string;
}) {
    const [phase, setPhase] = useState<
        "loading" | "taking" | "blocked" | "pending" | "submitted" | "error"
    >("loading");
    const [error, setError] = useState<string | null>(null);
    const [attemptId, setAttemptId] = useState<string | null>(null);
    const [questions, setQuestions] = useState<QuizQuestion[]>([]);
    const [answers, setAnswers] = useState<Record<string, number>>({});
    const [violations, setViolations] = useState(0);
    const [results, setResults] = useState<{ score: number; total: number; rows: QuizResult[] } | null>(
        null
    );

    // Ref do śledzenia, czy już submitowaliśmy (zapobiega podwójnemu submit).
    const submittedRef = useRef(false);
    // Ref do questions i answers, żeby event listenery widziały aktualny stan.
    const stateRef = useRef({ questions, answers, attemptId, phase });
    stateRef.current = { questions, answers, attemptId, phase };

    // ---------------------------------------------------------------
    // 1. START — pobierz pulę pytań z API
    // ---------------------------------------------------------------
    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                const res = await fetch(
                    `/api/quiz/${courseId}/${lessonSlug}/start?limit=5`,
                    { cache: "no-store" }
                );
                if (cancelled) return;
                if (!res.ok) {
                    const data = await res.json().catch(() => ({}));
                    setError(data.error ?? `HTTP ${res.status}`);
                    // 503 = pula pytań jeszcze nie zaseedowana dla tej lekcji.
                    // To NIE jest oszustwo ucznia — pokazujemy "w przygotowaniu".
                    setPhase(res.status === 503 ? "pending" : "error");
                    return;
                }
                const data = (await res.json()) as {
                    attemptId: string;
                    questions: QuizQuestion[];
                    total: number;
                };
                setAttemptId(data.attemptId);
                setQuestions(data.questions);
                setPhase("taking");
            } catch (e) {
                if (!cancelled) {
                    setError((e as Error).message);
                    setPhase("error");
                }
            }
        })();
        return () => {
            cancelled = true;
        };
    }, [courseId, lessonSlug]);

    // ---------------------------------------------------------------
    // 2. SUBMIT
    // ---------------------------------------------------------------
    const submit = useCallback(
        async (reason: "manual" | "violation" = "manual") => {
            if (submittedRef.current) return;
            const s = stateRef.current;
            if (!s.attemptId || s.questions.length === 0) return;
            submittedRef.current = true;

            if (reason === "violation") {
                setPhase("blocked");
            }

            try {
                const res = await fetch(`/api/quiz/${courseId}/${lessonSlug}/submit`, {
                    method: "POST",
                    headers: { "content-type": "application/json" },
                    body: JSON.stringify({
                        attemptId: s.attemptId,
                        answers: s.answers
                    })
                });
                if (!res.ok) {
                    const data = await res.json().catch(() => ({}));
                    setError(data.error ?? `HTTP ${res.status}`);
                    setPhase("error");
                    return;
                }
                const data = (await res.json()) as {
                    score: number;
                    total: number;
                    results: QuizResult[];
                };
                setResults({ score: data.score, total: data.total, rows: data.results });
                setPhase("submitted");
            } catch (e) {
                setError((e as Error).message);
                setPhase("error");
            }
        },
        [courseId, lessonSlug]
    );

    // ---------------------------------------------------------------
    // 3. + 4. BLOKADY OKNA + ŚCIĄGANIA
    //    Wszystko w jednym useEffect, żeby handleViolation było widoczne
    //    zarówno dla zdarzeń okna jak i klawiatury/menu.
    // ---------------------------------------------------------------
    useEffect(() => {
        if (phase !== "taking") return;

        const handleViolation = (_kind: string) => {
            setViolations((v) => {
                const next = v + 1;
                if (next >= VIOLATION_LIMIT) {
                    void submit("violation");
                }
                return next;
            });
        };

        const onVisibility = () => {
            if (document.visibilityState === "hidden") {
                handleViolation("visibility");
            }
        };
        const onBlur = () => handleViolation("blur");
        const onContextMenu = (e: MouseEvent) => e.preventDefault();
        const onCopy = (e: ClipboardEvent) => e.preventDefault();
        const onCut = (e: ClipboardEvent) => e.preventDefault();
        const onDragStart = (e: DragEvent) => e.preventDefault();

        const onKey = (e: KeyboardEvent) => {
            // Ctrl/Cmd + C / X / P / S / U / A
            if ((e.ctrlKey || e.metaKey) && ["c", "x", "p", "s", "u", "a"].includes(e.key.toLowerCase())) {
                e.preventDefault();
                handleViolation("shortcut");
            }
            // F12, Ctrl+Shift+I/J/C, Ctrl+U — próba otwarcia devtools / źródła
            if (
                e.key === "F12" ||
                ((e.ctrlKey || e.metaKey) && e.shiftKey && ["i", "j", "c"].includes(e.key.toLowerCase()))
            ) {
                e.preventDefault();
                handleViolation("devtools");
            }
        };

        document.addEventListener("visibilitychange", onVisibility);
        window.addEventListener("blur", onBlur);
        document.addEventListener("contextmenu", onContextMenu);
        document.addEventListener("copy", onCopy);
        document.addEventListener("cut", onCut);
        document.addEventListener("dragstart", onDragStart);
        document.addEventListener("keydown", onKey);

        return () => {
            document.removeEventListener("visibilitychange", onVisibility);
            window.removeEventListener("blur", onBlur);
            document.removeEventListener("contextmenu", onContextMenu);
            document.removeEventListener("copy", onCopy);
            document.removeEventListener("cut", onCut);
            document.removeEventListener("dragstart", onDragStart);
            document.removeEventListener("keydown", onKey);
        };
    }, [phase, submit]);

    // ---------------------------------------------------------------
    // RENDER
    // ---------------------------------------------------------------
    if (phase === "loading") {
        return (
            <div className="quiz">
                <p className="quiz-loading">Ładowanie pytań z bazy…</p>
            </div>
        );
    }

    if (phase === "pending") {
        return (
            <div className="quiz">
                <div className="quiz-pending">
                    <h3>Quiz w przygotowaniu</h3>
                    <p>
                        Pytania do tej lekcji nie są jeszcze gotowe. Materiał wideo i quiz dodajemy
                        sukcesywnie — wróć tu za jakiś czas. Sama lekcja jest w pełni dostępna powyżej.
                    </p>
                </div>
            </div>
        );
    }

    if (phase === "blocked") {
        return (
            <div className="quiz">
                <div className="quiz-error">
                    <h3>Quiz zablokowany</h3>
                    <p>
                        Wykryto {VIOLATION_LIMIT} naruszenia zasad (zmiana okna, kopiowanie,
                        próba DevTools). Quiz został automatycznie zakończony.
                    </p>
                </div>
            </div>
        );
    }

    if (phase === "error") {
        return (
            <div className="quiz">
                <div className="quiz-error">
                    <h3>Nie udało się uruchomić quizu</h3>
                    <p>{error}</p>
                    <p className="quiz-error-hint">
                        Jeśli jesteśmy w trakcie dodawania pytań do tej lekcji, spróbuj później.
                    </p>
                </div>
            </div>
        );
    }

    if (phase === "submitted" && results) {
        return (
            <div className="quiz">
                <div className="quiz-header">
                    <span className="quiz-label">WYNIK</span>
                    <h3 className="quiz-title">{lessonTitle}</h3>
                </div>
                <div className="quiz-result-summary">
                    <span className="quiz-score-big">
                        {results.score} / {results.total}
                    </span>
                    <span className="quiz-score-label">poprawnych odpowiedzi</span>
                </div>
                <ol className="quiz-questions">
                    {results.rows.map((r, i) => {
                        const q = questions.find((qq) => qq.id === r.questionId);
                        return (
                            <li key={r.questionId} className="quiz-question quiz-question-reviewed">
                                <p className="quiz-question-text">
                                    {i + 1}. {q?.prompt ?? r.questionId}
                                </p>
                                {q?.options.map((opt) => {
                                    const isPicked = r.chosen === opt.idx;
                                    const isCorrect = r.correctIndex === opt.idx;
                                    let cls = "quiz-option";
                                    if (isCorrect) cls += " quiz-option-correct";
                                    else if (isPicked) cls += " quiz-option-wrong";
                                    return (
                                        <div key={opt.idx} className={cls}>
                                            <span className="quiz-option-marker">
                                                {String.fromCharCode(65 + opt.idx)}
                                            </span>
                                            <span>{opt.label}</span>
                                        </div>
                                    );
                                })}
                                {r.explanation && (
                                    <p className="quiz-explanation">{r.explanation}</p>
                                )}
                            </li>
                        );
                    })}
                </ol>
            </div>
        );
    }

    // phase === "taking"
    const allAnswered = questions.every((q) => answers[q.id] !== undefined);

    return (
        <div className="quiz">
            <div className="quiz-header">
                <span className="quiz-label">QUIZ</span>
                <h3 className="quiz-title">{lessonTitle}</h3>
                {violations > 0 && (
                    <p className="quiz-violation">
                        ⚠ Naruszenia: {violations} / {VIOLATION_LIMIT}. Po przekroczeniu quiz
                        zostanie automatycznie zakończony.
                    </p>
                )}
            </div>

            <ol className="quiz-questions">
                {questions.map((q, qi) => (
                    <li key={q.id} className="quiz-question">
                        <p className="quiz-question-text">
                            {qi + 1}. {q.prompt}
                        </p>
                        <div className="quiz-options">
                            {q.options.map((opt) => {
                                const selected = answers[q.id] === opt.idx;
                                return (
                                    <button
                                        key={opt.idx}
                                        type="button"
                                        className={`quiz-option ${selected ? "quiz-option-selected" : ""}`}
                                        onClick={() =>
                                            setAnswers((prev) => ({ ...prev, [q.id]: opt.idx }))
                                        }
                                        aria-pressed={selected}
                                    >
                                        <span className="quiz-option-marker">
                                            {String.fromCharCode(65 + opt.idx)}
                                        </span>
                                        <span>{opt.label}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </li>
                ))}
            </ol>

            <div className="quiz-footer">
                <button
                    type="button"
                    className="quiz-submit"
                    onClick={() => submit("manual")}
                    disabled={!allAnswered}
                >
                    {allAnswered ? "SPRAWDŹ ODPOWIEDZI" : "ODPOWIEDZ NA WSZYSTKIE"}
                </button>
            </div>
        </div>
    );
}
