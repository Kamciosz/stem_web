/**
 * INF.03 / Czerwiec 2025 / 04
 * Source of truth dla dashboard + 4 podstron etapow.
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

export type ExamStep = ExamStepView & {
    mdx: () => Promise<{ default: React.ComponentType }>;
};

export type ExamMeta = {
    courseId: "inf-03";
    lessonSlug: "egzamin-04-czerwiec-2025";
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
    lessonSlug: "egzamin-04-czerwiec-2025",
    examId: "INF.03-04-CZ25",
    session: "Czerwiec 2025",
    title: "Arkusz 04 — Firma przewozowa",
    topic: "Firma przewozowa",
    description: "Firma przewozowa — kursy, busy, rozkłady.",
    rule: "SQL → PHP → CSS → Kontrola",
    time: "150 min",
    technologies: ["PHP", "SQL", "CSS"],
    scoreTarget: "~22 / 30 pkt",
    scoringTotal: "30 pkt",
    objective: "Firma przewozowa — kursy, busy, rozkłady.",
};

export const examSteps: ExamStep[] = [
    {
        slug: "baza-danych",
        index: 1,
        label: "Baza danych",
        short: "Baza",
        summary: "Schemat + 4 kwerendy SQL sprawdzone w bazie.",
        minutes: "0–25 min",
        technologies: ["SQL", "MySQL"],
        mdx: () => import("@/content/inf-03/egzamin-04-czerwiec-2025/baza-danych.mdx"),
    },
    {
        slug: "html-php",
        index: 2,
        label: "HTML / PHP",
        short: "Etap 2",
        summary: "Polaczenie z baza, petle, formularze, renderowanie.",
        minutes: "25–90 min",
        technologies: ["PHP"],
        mdx: () => import("@/content/inf-03/egzamin-04-czerwiec-2025/html-php.mdx"),
    },
    {
        slug: "css",
        index: 3,
        label: "CSS",
        short: "CSS",
        summary: "Odtworzenie makiety z arkusza — kolory, layout, hover.",
        minutes: "90–130 min",
        technologies: ["CSS"],
        mdx: () => import("@/content/inf-03/egzamin-04-czerwiec-2025/css.mdx"),
    },
    {
        slug: "kontrola",
        index: 4,
        label: "Kontrola",
        short: "Kontrola",
        summary: "Ostatnie 20 minut — punktacja, bledy, checklista.",
        minutes: "130–150 min",
        technologies: ["QA"],
        mdx: () => import("@/content/inf-03/egzamin-04-czerwiec-2025/kontrola.mdx"),
    },
];

export const examStrategy = [
    { time: "0–25 min", title: "SQL", body: "Cztery zapytania sprawdzone w bazie.", tag: "łatwe punkty" },
    { time: "25–90 min", title: "PHP + baza", body: "Polaczenie, petle, renderowanie.", tag: "tu sie oblewa" },
    { time: "90–130 min", title: "CSS", body: "Makieta, kolory, hover, overflow.", tag: "dopinanie" },
    { time: "130–150 min", title: "Kontrola", body: "Porownanie z makietą.", tag: "ostatnie punkty" },
];

export const examChecklistKeys = [
    "sql-4-zapytan",
    "kod-polaczenie",
    "utf8",
    "renderowanie",
    "obrazki-sciezki",
    "layout",
    "hover",
    "makieta-zgodna",
] as const;

export type ExamChecklistKey = (typeof examChecklistKeys)[number];

export const EXAM_PROGRESS_STORAGE_KEY = "exam:inf-03:egzamin-04-czerwiec-2025:checklist";

export function getStepBySlug(slug: string): ExamStep | undefined {
    return examSteps.find((s) => s.slug === slug);
}

export const examStepsView: ExamStepView[] = examSteps.map(({ mdx: _mdx, ...rest }) => rest);

export function toExamStepView(step: ExamStep): ExamStepView {
    const { mdx: _mdx, ...view } = step;
    return view;
}

export const examFlowBasePath = `/kursy/${examMeta.courseId}/${examMeta.lessonSlug}`;
