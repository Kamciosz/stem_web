/**
 * Single source of truth dla arkusza INF.03 / styczeń 2026 / 06.
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
    lessonSlug: "egzamin-06-styczen-2026",
    examId: "INF.03-06",
    session: "Styczeń 2026",
    title: "Arkusz 06 — Portal diagnostyki online",
    topic: "Portal diagnostyki online",
    description:
        "Przewodnik po rozwiązaniu w kolejności pracy. Cztery etapy, każdy na osobnej stronie. Plan, materiały, błędy i kod — bez jednego długiego scrolla.",
    rule: "SQL → PHP → CSS → Kontrola",
    time: "150 min",
    technologies: ["PHP", "SQL", "CSS", "HTML"],
    scoreTarget: "~22 / 30 pkt",
    scoringTotal: "30 pkt",
    objective: "Wykonanie aplikacji internetowej portalu do diagnostyki online",
};

export const examSteps: ExamStep[] = [
    {
        slug: "baza-danych",
        index: 1,
        label: "Baza danych",
        short: "Baza",
        summary: "Relacja choroby-objawy, choroby zakaźne i zapytania przez tabelę łączącą.",
        minutes: "0–25 min",
        technologies: ["SQL", "MySQL"],
        mdx: () => import("@/content/inf-03/egzamin-06-styczen-2026/baza-danych.mdx"),
    },
    {
        slug: "html",
        index: 2,
        label: "HTML",
        short: "HTML",
        summary: "Strona zdrowie.php: nav target blank, formularz select, sekcje i obraz zdrowia.",
        minutes: "25–45 min",
        technologies: ["HTML"],
        mdx: () => import("@/content/inf-03/egzamin-06-styczen-2026/html.mdx"),
    },
    {
        slug: "php",
        index: 3,
        label: "PHP",
        short: "PHP",
        summary: "Lista chorób, select z bazy i objawy wybranej choroby w elementach span.",
        minutes: "45–90 min",
        technologies: ["PHP", "MySQL"],
        mdx: () => import("@/content/inf-03/egzamin-06-styczen-2026/php.mdx"),
    },
    {
        slug: "css",
        index: 4,
        label: "CSS",
        short: "CSS",
        summary: "Pozycjonowanie absolutne, nth-child na span i układ zgodny z makietą.",
        minutes: "90–130 min",
        technologies: ["CSS"],
        mdx: () => import("@/content/inf-03/egzamin-06-styczen-2026/css.mdx"),
    },
    {
        slug: "kontrola",
        index: 5,
        label: "Kontrola",
        short: "Kontrola",
        summary: "Weryfikacja wymagań, punktacja, checklista.",
        minutes: "130–150 min",
        technologies: ["QA"],
        mdx: () => import("@/content/inf-03/egzamin-06-styczen-2026/kontrola.mdx"),
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
        { src: "/img/egzaminy/e06-zdrowia.png", alt: "e06-zdrowia.png — materiał arkusza INF.03-06", title: "e06-zdrowia.png", caption: "materiał z arkusza" },
        { src: "/img/egzaminy/e06-obraz.jpg", alt: "e06-obraz.jpg — materiał arkusza INF.03-06", title: "e06-obraz.jpg", caption: "materiał z arkusza" },
        { src: "/img/egzaminy/e06-cyfry.gif", alt: "e06-cyfry.gif — materiał arkusza INF.03-06", title: "e06-cyfry.gif", caption: "materiał z arkusza" },
        { src: "/img/egzaminy/e06-0.png", alt: "e06-0.png — materiał arkusza INF.03-06", title: "e06-0.png", caption: "materiał z arkusza" },
        { src: "/img/egzaminy/e06-1.png", alt: "e06-1.png — materiał arkusza INF.03-06", title: "e06-1.png", caption: "materiał z arkusza" },
        { src: "/img/egzaminy/e06-2.png", alt: "e06-2.png — materiał arkusza INF.03-06", title: "e06-2.png", caption: "materiał z arkusza" },
        { src: "/img/egzaminy/e06-2a.png", alt: "e06-2a.png — materiał arkusza INF.03-06", title: "e06-2a.png", caption: "materiał z arkusza" },
        { src: "/img/egzaminy/e06-3.png", alt: "e06-3.png — materiał arkusza INF.03-06", title: "e06-3.png", caption: "materiał z arkusza" },
        { src: "/img/egzaminy/e06-4.png", alt: "e06-4.png — materiał arkusza INF.03-06", title: "e06-4.png", caption: "materiał z arkusza" },
        { src: "/img/egzaminy/e06-5.png", alt: "e06-5.png — materiał arkusza INF.03-06", title: "e06-5.png", caption: "materiał z arkusza" },
        { src: "/img/egzaminy/e06-6.png", alt: "e06-6.png — materiał arkusza INF.03-06", title: "e06-6.png", caption: "materiał z arkusza" },
        { src: "/img/egzaminy/e06-7.png", alt: "e06-7.png — materiał arkusza INF.03-06", title: "e06-7.png", caption: "materiał z arkusza" },
        { src: "/img/egzaminy/e06-8.png", alt: "e06-8.png — materiał arkusza INF.03-06", title: "e06-8.png", caption: "materiał z arkusza" },
        { src: "/img/egzaminy/e06-9.png", alt: "e06-9.png — materiał arkusza INF.03-06", title: "e06-9.png", caption: "materiał z arkusza" },
        { src: "/img/egzaminy/e06-A.png", alt: "e06-A.png — materiał arkusza INF.03-06", title: "e06-A.png", caption: "materiał z arkusza" },
        { src: "/img/egzaminy/e06-B.png", alt: "e06-B.png — materiał arkusza INF.03-06", title: "e06-B.png", caption: "materiał z arkusza" },
        { src: "/img/egzaminy/e06-C.png", alt: "e06-C.png — materiał arkusza INF.03-06", title: "e06-C.png", caption: "materiał z arkusza" },
        { src: "/img/egzaminy/e06-D.png", alt: "e06-D.png — materiał arkusza INF.03-06", title: "e06-D.png", caption: "materiał z arkusza" },
        { src: "/img/egzaminy/e06-E.png", alt: "e06-E.png — materiał arkusza INF.03-06", title: "e06-E.png", caption: "materiał z arkusza" },
        { src: "/img/egzaminy/e06-F.png", alt: "e06-F.png — materiał arkusza INF.03-06", title: "e06-F.png", caption: "materiał z arkusza" },
    ],
    result: {
        src: "/img/egzaminy/e06-kw5.jpeg",
        alt: "Makieta lub wynik końcowy INF.03-06 — Portal diagnostyki online",
        title: "e06-kw5.jpeg",
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
