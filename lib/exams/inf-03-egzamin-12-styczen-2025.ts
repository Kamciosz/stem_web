/**
 * INF.03 / Styczen 2025 / 12
 */

export type ExamStepSlug = "baza-danych" | "html-php" | "css" | "kontrola";
export type ExamStepView = {
    slug: ExamStepSlug;
    index: number;
    label: string;
    short: string;
    summary: string;
    minutes: string;
    technologies: string[];
};
export type ExamStep = ExamStepView & { mdx: () => Promise<{ default: React.ComponentType }>; };
export type ExamMeta = {
    courseId: "inf-03";
    lessonSlug: string;
    examId: string;
    session: string;
    title: string;
    topic: string;
    description: string;
    rule: string;
    time: string;
    technologies: string[];
    scoreTarget: string;
    scoringTotal: string;
    objective: string;
};

export const examMeta: ExamMeta = {
    courseId: "inf-03",
    lessonSlug: "egzamin-12-styczen-2025",
    examId: "INF.03-12-ST25",
    session: "Styczeń 2025",
    title: "Arkusz 12 — Piekarnia",
    topic: "Piekarnia",
    description: "Piekarnia — katalog, zamowienia, dostawy.",
    rule: "SQL → PHP → CSS → Kontrola",
    time: "150 min",
    technologies: ["PHP", "SQL", "CSS"],
    scoreTarget: "~22 / 30 pkt",
    scoringTotal: "30 pkt",
    objective: "Piekarnia — katalog, zamowienia, dostawy.",
};

export const examSteps: ExamStep[] = [
    { slug: "baza-danych", index: 1, label: "Baza danych", short: "Baza", summary: "Schemat + 4 kwerendy SQL.", minutes: "0-25 min", technologies: ["SQL"], mdx: () => import("@/content/inf-03/egzamin-12-styczen-2025/baza-danych.mdx") },
    { slug: "html-php", index: 2, label: "PHP", short: "Etap 2", summary: "Polaczenie, renderowanie.", minutes: "25-90 min", technologies: ["PHP"], mdx: () => import("@/content/inf-03/egzamin-12-styczen-2025/html-php.mdx") },
    { slug: "css", index: 3, label: "CSS", short: "CSS", summary: "Makieta z arkusza.", minutes: "90-130 min", technologies: ["CSS"], mdx: () => import("@/content/inf-03/egzamin-12-styczen-2025/css.mdx") },
    { slug: "kontrola", index: 4, label: "Kontrola", short: "Kontrola", summary: "Ostatnie 20 minut.", minutes: "130-150 min", technologies: ["QA"], mdx: () => import("@/content/inf-03/egzamin-12-styczen-2025/kontrola.mdx") },
];

export const examStrategy = [
    { time: "0-25 min", title: "SQL", body: "Cztery zapytania.", tag: "łatwe" },
    { time: "25-90 min", title: "PHP", body: "Polaczenie, renderowanie.", tag: "tu sie oblewa" },
    { time: "90-130 min", title: "CSS", body: "Makieta.", tag: "dopinanie" },
    { time: "130-150 min", title: "Kontrola", body: "Porownanie z makietą.", tag: "ostatnie" },
];

export const examChecklistKeys = ["sql-4-zapytan", "kod-polaczenie", "utf8", "renderowanie", "obrazki", "layout", "hover", "makieta-zgodna"] as const;
export type ExamChecklistKey = (typeof examChecklistKeys)[number];
export const EXAM_PROGRESS_STORAGE_KEY = "exam:inf-03:egzamin-12-styczen-2025:checklist";

export function getStepBySlug(slug: string): ExamStep | undefined { return examSteps.find((s) => s.slug === slug); }
export const examStepsView: ExamStepView[] = examSteps.map(({ mdx: _mdx, ...rest }) => rest);
export function toExamStepView(step: ExamStep): ExamStepView { const { mdx: _mdx, ...view } = step; return view; }
export const examFlowBasePath = `/kursy/${examMeta.courseId}/${examMeta.lessonSlug}`;
