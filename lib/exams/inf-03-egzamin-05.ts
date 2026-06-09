/**
 * Single source of truth dla arkusza INF.03 / styczeń 2026 / 05.
 * Dashboard + 4 podstrony etapow.
 */

export type ExamStepSlug = "baza-danych" | "html" | "php" | "css" | "kontrola";

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
    lessonSlug: "egzamin-05-styczen-2026",
    examId: "INF.03-05",
    session: "Styczeń 2026",
    title: "Arkusz 05 — Portal zgłoszeń wypadków",
    topic: "Portal zgłoszeń wypadków",
    description:
        "Przewodnik po rozwiązaniu w kolejności pracy. Cztery etapy, każdy na osobnej stronie. Plan, materiały, błędy i kod — bez jednego długiego scrolla.",
    rule: "SQL → PHP → CSS → Kontrola",
    time: "150 min",
    technologies: ["PHP", "SQL", "CSS", "HTML"],
    scoreTarget: "~22 / 30 pkt",
    scoringTotal: "30 pkt",
    objective: "Wykonanie aplikacji internetowej portalu zgłoszeń wypadków",
};

export const examSteps: ExamStep[] = [
    {
        slug: "baza-danych",
        index: 1,
        label: "Baza danych",
        short: "Baza",
        summary: "Baza zgłoszeń, SELECT, GROUP BY, NOT IN i INSERT z aktualną datą.",
        minutes: "0–25 min",
        technologies: ["SQL", "MySQL"],
        mdx: () => import("@/content/inf-03/egzamin-05-styczen-2026/baza-danych.mdx"),
    },
    {
        slug: "html",
        index: 2,
        label: "HTML",
        short: "HTML",
        summary: "Formularze radio i dodawania zgłoszenia, sekcje lewa/prawa, lista i tabela.",
        minutes: "25–45 min",
        technologies: ["HTML"],
        mdx: () => import("@/content/inf-03/egzamin-05-styczen-2026/html.mdx"),
    },
    {
        slug: "php",
        index: 3,
        label: "PHP",
        short: "PHP",
        summary: "Obsługa POST, tabela personelu, lista bez zgłoszeń i INSERT do rejestru.",
        minutes: "45–90 min",
        technologies: ["PHP", "MySQL"],
        mdx: () => import("@/content/inf-03/egzamin-05-styczen-2026/php.mdx"),
    },
    {
        slug: "css",
        index: 4,
        label: "CSS",
        short: "CSS",
        summary: "Layout zgłoszeń, przyciski, hover i kolory zgodne z poleceniem.",
        minutes: "90–130 min",
        technologies: ["CSS"],
        mdx: () => import("@/content/inf-03/egzamin-05-styczen-2026/css.mdx"),
    },
    {
        slug: "kontrola",
        index: 5,
        label: "Kontrola",
        short: "Kontrola",
        summary: "Weryfikacja wymagań, punktacja, checklista.",
        minutes: "130–150 min",
        technologies: ["QA"],
        mdx: () => import("@/content/inf-03/egzamin-05-styczen-2026/kontrola.mdx"),
    },
];


export const examStrategy = [
    { time: "0–25 min", title: "Baza / analiza", body: "Rozpisz dane wejściowe, sprawdź zapytania SQL albo wymagane pliki.", tag: "łatwe punkty" },
    { time: "25–90 min", title: "HTML i PHP", body: "Struktura HTML, logika skryptów i dane wejściowe zgodnie z arkuszem.", tag: "główna część" },
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
        { src: "/img/egzaminy/e05-baner.jpg", alt: "e05-baner.jpg — materiał arkusza INF.03-05", title: "e05-baner.jpg", caption: "materiał z arkusza" },
        { src: "/img/egzaminy/e05-kod.jpg", alt: "e05-kod.jpg — materiał arkusza INF.03-05", title: "e05-kod.jpg", caption: "materiał z arkusza" },
        { src: "/img/egzaminy/e05-1.jpg", alt: "e05-1.jpg — materiał arkusza INF.03-05", title: "e05-1.jpg", caption: "materiał z arkusza" },
        { src: "/img/egzaminy/e05-2.jpg", alt: "e05-2.jpg — materiał arkusza INF.03-05", title: "e05-2.jpg", caption: "materiał z arkusza" },
        { src: "/img/egzaminy/e05-3.jpg", alt: "e05-3.jpg — materiał arkusza INF.03-05", title: "e05-3.jpg", caption: "materiał z arkusza" },
        { src: "/img/egzaminy/e05-4.jpg", alt: "e05-4.jpg — materiał arkusza INF.03-05", title: "e05-4.jpg", caption: "materiał z arkusza" },
        { src: "/img/egzaminy/e05-5.jpg", alt: "e05-5.jpg — materiał arkusza INF.03-05", title: "e05-5.jpg", caption: "materiał z arkusza" },
        { src: "/img/egzaminy/e05-6.jpg", alt: "e05-6.jpg — materiał arkusza INF.03-05", title: "e05-6.jpg", caption: "materiał z arkusza" },
        { src: "/img/egzaminy/e05-7.jpg", alt: "e05-7.jpg — materiał arkusza INF.03-05", title: "e05-7.jpg", caption: "materiał z arkusza" },
        { src: "/img/egzaminy/e05-8.jpg", alt: "e05-8.jpg — materiał arkusza INF.03-05", title: "e05-8.jpg", caption: "materiał z arkusza" },
        { src: "/img/egzaminy/e05-9.jpg", alt: "e05-9.jpg — materiał arkusza INF.03-05", title: "e05-9.jpg", caption: "materiał z arkusza" },
        { src: "/img/egzaminy/e05-10.jpg", alt: "e05-10.jpg — materiał arkusza INF.03-05", title: "e05-10.jpg", caption: "materiał z arkusza" },
    ],
    result: {
        src: "/img/egzaminy/e05-kw4.png",
        alt: "Makieta lub wynik końcowy INF.03-05 — Portal zgłoszeń wypadków",
        title: "e05-kw4.png",
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
