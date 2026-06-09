/**
 * Single source of truth dla arkusza INF.03 / styczeń 2026 / 03.
 * Dashboard + 4 podstrony etapow.
 */

export type ExamStepSlug = "baza-danych" | "html" | "javascript" | "css" | "kontrola";

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
    lessonSlug: "egzamin-03-styczen-2026",
    examId: "INF.03-03",
    session: "Styczeń 2026",
    title: "Arkusz 03 — Witryna matematyczna",
    topic: "Witryna matematyczna",
    description:
        "Przewodnik po rozwiązaniu w kolejności pracy. Cztery etapy, każdy na osobnej stronie. Plan, materiały, błędy i kod — bez jednego długiego scrolla.",
    rule: "Analiza → HTML → JavaScript → CSS → Kontrola",
    time: "150 min",
    technologies: ["HTML", "JavaScript", "CSS"],
    scoreTarget: "~22 / 30 pkt",
    scoringTotal: "30 pkt",
    objective: "Wykonanie witryny matematycznej z animacją i skryptem JavaScript",
};

export const examSteps: ExamStep[] = [
    {
        slug: "baza-danych",
        index: 1,
        label: "Analiza arkusza",
        short: "Analiza",
        summary: "Arkusz bez bazy: pliki graficzne, animacja GIF, struktura dwóch stron i wymagania JS.",
        minutes: "0–20 min",
        technologies: ["Analiza", "Grafika"],
        mdx: () => import("@/content/inf-03/egzamin-03-styczen-2026/baza-danych.mdx"),
    },
    {
        slug: "html",
        index: 2,
        label: "HTML",
        short: "HTML",
        summary: "Dwie strony HTML: index.html, kolo.html, nawigacja, formularz i grafiki.",
        minutes: "20–50 min",
        technologies: ["HTML"],
        mdx: () => import("@/content/inf-03/egzamin-03-styczen-2026/html.mdx"),
    },
    {
        slug: "javascript",
        index: 3,
        label: "JavaScript",
        short: "JS",
        summary: "Zmiana dużego obrazu, obsługa stanu początkowego i obliczanie pola figury.",
        minutes: "50–85 min",
        technologies: ["JavaScript"],
        mdx: () => import("@/content/inf-03/egzamin-03-styczen-2026/javascript.mdx"),
    },
    {
        slug: "css",
        index: 4,
        label: "CSS",
        short: "CSS",
        summary: "Garamond, Navy/DodgerBlue/SkyBlue, flex, first-letter i miniatury.",
        minutes: "85–125 min",
        technologies: ["CSS"],
        mdx: () => import("@/content/inf-03/egzamin-03-styczen-2026/css.mdx"),
    },
    {
        slug: "kontrola",
        index: 5,
        label: "Kontrola",
        short: "Kontrola",
        summary: "Test obliczeń, obrazów, GIF-a i zgodności z makietą.",
        minutes: "125–150 min",
        technologies: ["QA"],
        mdx: () => import("@/content/inf-03/egzamin-03-styczen-2026/kontrola.mdx"),
    },
];


export const examStrategy = [
    { time: "0–25 min", title: "Analiza plików", body: "Ten arkusz nie ma bazy: sprawdź obrazy, GIF, HTML i wymagane skrypty.", tag: "łatwe punkty" },
    { time: "25–90 min", title: "HTML i JS", body: "Struktura HTML, logika skryptów i dane wejściowe zgodnie z arkuszem.", tag: "główna część" },
    { time: "90–130 min", title: "CSS pod makietę", body: "Odtwarzaj polecenie: fonty, kolory, układ, obrazy i formularze.", tag: "dopięcie" },
    { time: "130–150 min", title: "Kontrola", body: "Porównaj wymagania, działanie i wygląd punkt po punkcie.", tag: "ostatnie punkty" },
];

export function getStepBySlug(slug: string): ExamStep | undefined {
    return examSteps.find((s) => s.slug === slug);
}

export const examStepsView: ExamStepView[] = examSteps.map(({ mdx: _mdx, ...rest }) => rest);

export function toExamStepView(step: ExamStep): ExamStepView {
    const { mdx: _mdx, ...view } = step;
    return view;
}

/** Materialy z arkusza — dashboard pokazuje realne pliki arkusza. */
export const examMaterials = {
    files: [
        { src: "/img/egzaminy/e03-kolo.gif", alt: "e03-kolo.gif — materiał arkusza INF.03-03", title: "e03-kolo.gif", caption: "materiał z arkusza" },
        { src: "/img/egzaminy/e03-parametry.jpg", alt: "e03-parametry.jpg — materiał arkusza INF.03-03", title: "e03-parametry.jpg", caption: "materiał z arkusza" },
        { src: "/img/egzaminy/e03-1d.bmp", alt: "e03-1d.bmp — materiał arkusza INF.03-03", title: "e03-1d.bmp", caption: "materiał z arkusza" },
    ],
    result: {
        src: "/img/egzaminy/e03-kw4.png",
        alt: "Makieta lub wynik końcowy INF.03-03 — Witryna matematyczna",
        title: "e03-kw4.png",
        caption: "porównaj z własnym rozwiązaniem",
    },
} as const;

/** Pelna checklista — uzywana na podstronie Kontrola i jako summary na dashboardzie. */
export const examChecklistKeys = [
    "sql-zapytania",
    "php-polaczenie",
    "utf8",
    "petle",
    "formularz-post",
    "obliczenia-lub-insert",
    "obrazy-sciezki",
    "css-makieta",
    "brak-warningow",
    "makieta-zgodna",
] as const;

export const examFlowBasePath = `/kursy/${examMeta.courseId}/${examMeta.lessonSlug}`;
