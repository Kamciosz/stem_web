/**
 * Single source of truth dla arkusza INF.03 / styczeń 2026 / 02.
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
    lessonSlug: "egzamin-02-styczen-2026",
    examId: "INF.03-02",
    session: "Styczeń 2026",
    title: "Arkusz 02 — Portal warzywny",
    topic: "Portal warzywny",
    description:
        "Przewodnik po rozwiązaniu w kolejności pracy. Cztery etapy, każdy na osobnej stronie. Plan, materiały, błędy i kod — bez jednego długiego scrolla.",
    rule: "SQL → PHP → CSS → Kontrola",
    time: "150 min",
    technologies: ["PHP", "SQL", "CSS", "HTML"],
    scoreTarget: "~22 / 30 pkt",
    scoringTotal: "30 pkt",
    objective: "Wykonanie aplikacji internetowej portalu dla sklepów z warzywami",
};

export const examSteps: ExamStep[] = [
    {
        slug: "baza-danych",
        index: 1,
        label: "Baza danych",
        short: "Baza",
        summary: "Import bazy bazar, cztery zapytania SQL i dane dla formularza zamówienia.",
        minutes: "0–25 min",
        technologies: ["SQL", "MySQL"],
        mdx: () => import("@/content/inf-03/egzamin-02-styczen-2026/baza-danych.mdx"),
    },
    {
        slug: "html",
        index: 2,
        label: "HTML",
        short: "HTML",
        summary: "Szkielet index.php: header, nav, aside, section z formularzem i footer.",
        minutes: "25–45 min",
        technologies: ["HTML"],
        mdx: () => import("@/content/inf-03/egzamin-02-styczen-2026/html.mdx"),
    },
    {
        slug: "php",
        index: 3,
        label: "PHP",
        short: "PHP",
        summary: "Trzy skrypty PHP: obrazki z bazy, select z towarami i obliczenie wartości POST.",
        minutes: "45–90 min",
        technologies: ["PHP", "MySQL"],
        mdx: () => import("@/content/inf-03/egzamin-02-styczen-2026/php.mdx"),
    },
    {
        slug: "css",
        index: 4,
        label: "CSS",
        short: "CSS",
        summary: "Georgia, ForestGreen/DarkKhaki/Khaki, flex, overflow hidden i styl paragrafu.",
        minutes: "90–130 min",
        technologies: ["CSS"],
        mdx: () => import("@/content/inf-03/egzamin-02-styczen-2026/css.mdx"),
    },
    {
        slug: "kontrola",
        index: 5,
        label: "Kontrola",
        short: "Kontrola",
        summary: "Weryfikacja wymagań, punktacja, checklista.",
        minutes: "130–150 min",
        technologies: ["QA"],
        mdx: () => import("@/content/inf-03/egzamin-02-styczen-2026/kontrola.mdx"),
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
        { src: "/img/egzaminy/e02-market.png", alt: "e02-market.png — materiał arkusza INF.03-02", title: "e02-market.png", caption: "materiał z arkusza" },
        { src: "/img/egzaminy/e02-owoc.png", alt: "e02-owoc.png — materiał arkusza INF.03-02", title: "e02-owoc.png", caption: "materiał z arkusza" },
        { src: "/img/egzaminy/e02-jabłko.png", alt: "e02-jabłko.png — materiał arkusza INF.03-02", title: "e02-jabłko.png", caption: "materiał z arkusza" },
        { src: "/img/egzaminy/e02-ananas.png", alt: "e02-ananas.png — materiał arkusza INF.03-02", title: "e02-ananas.png", caption: "materiał z arkusza" },
        { src: "/img/egzaminy/e02-banan.png", alt: "e02-banan.png — materiał arkusza INF.03-02", title: "e02-banan.png", caption: "materiał z arkusza" },
        { src: "/img/egzaminy/e02-cytryna.png", alt: "e02-cytryna.png — materiał arkusza INF.03-02", title: "e02-cytryna.png", caption: "materiał z arkusza" },
        { src: "/img/egzaminy/e02-gruszka.png", alt: "e02-gruszka.png — materiał arkusza INF.03-02", title: "e02-gruszka.png", caption: "materiał z arkusza" },
        { src: "/img/egzaminy/e02-jagody.png", alt: "e02-jagody.png — materiał arkusza INF.03-02", title: "e02-jagody.png", caption: "materiał z arkusza" },
        { src: "/img/egzaminy/e02-maliny.png", alt: "e02-maliny.png — materiał arkusza INF.03-02", title: "e02-maliny.png", caption: "materiał z arkusza" },
        { src: "/img/egzaminy/e02-mango.png", alt: "e02-mango.png — materiał arkusza INF.03-02", title: "e02-mango.png", caption: "materiał z arkusza" },
        { src: "/img/egzaminy/e02-pomarancza.png", alt: "e02-pomarancza.png — materiał arkusza INF.03-02", title: "e02-pomarancza.png", caption: "materiał z arkusza" },
        { src: "/img/egzaminy/e02-winogrona.png", alt: "e02-winogrona.png — materiał arkusza INF.03-02", title: "e02-winogrona.png", caption: "materiał z arkusza" },
    ],
    result: {
        src: "/img/egzaminy/e02-kw4.png",
        alt: "Makieta lub wynik końcowy INF.03-02 — Portal warzywny",
        title: "e02-kw4.png",
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
