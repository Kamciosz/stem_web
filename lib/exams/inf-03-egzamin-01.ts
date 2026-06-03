/**
 * Single source of truth dla redesignu arkusza INF.03 / styczeń 2026 / 01.
 * Dashboard + 4 podstrony etapow zywia sie z tego pliku.
 */

export type ExamStepSlug = "baza-danych" | "html-php" | "css" | "kontrola";

export type ExamStepView = {
    slug: ExamStepSlug;
    index: number;          // 1..4
    label: string;          // "Baza danych"
    short: string;          // "Baza"
    summary: string;
    minutes: string;
    technologies: string[];
};

export type ExamStep = ExamStepView & {
    /** komponent MDX renderowany w main column. Server-only (nieserializowalne) */
    mdx: () => Promise<{ default: React.ComponentType }>;
};

export type ExamMeta = {
    courseId: "inf-03";
    lessonSlug: "egzamin-01-styczen-2026";
    examId: string;         // "INF.03-01"
    session: string;        // "Styczeń 2026"
    title: string;
    topic: string;
    description: string;
    rule: string;
    time: string;
    technologies: string[];
    scoreTarget: string;
    scoringTotal: string;   // "30 pkt"
    objective: string;
};

export const examMeta: ExamMeta = {
    courseId: "inf-03",
    lessonSlug: "egzamin-01-styczen-2026",
    examId: "INF.03-01",
    session: "Styczeń 2026",
    title: "Arkusz 01 — Portal samochodowy",
    topic: "Portal samochodowy",
    description:
        "Przewodnik po rozwiązaniu w kolejności pracy. Cztery etapy, każdy na osobnej stronie. Plan, materiały, błędy i kod — bez jednego długiego scrolla.",
    rule: "SQL → PHP → CSS → Kontrola",
    time: "150 min",
    technologies: ["PHP", "SQL", "CSS", "HTML"],
    scoreTarget: "~22 / 30 pkt",
    scoringTotal: "30 pkt",
    objective: "Strona salonu samochodowego z bazą i widokiem zgodnym z makietą",
};

export const examSteps: ExamStep[] = [
    {
        slug: "baza-danych",
        index: 1,
        label: "Baza danych",
        short: "Baza",
        summary: "Dwie tabele, klucz obcy, cztery zapytania SQL sprawdzone w bazie.",
        minutes: "0–25 min",
        technologies: ["SQL", "MySQL"],
        mdx: () => import("@/content/inf-03/egzamin-01-styczen-2026/baza-danych.mdx"),
    },
    {
        slug: "html-php",
        index: 2,
        label: "HTML / PHP",
        short: "HTML/PHP",
        summary: "Połączenie z bazą, pętle, obliczenia, losowanie i tabela z rowspan.",
        minutes: "25–90 min",
        technologies: ["PHP", "HTML"],
        mdx: () => import("@/content/inf-03/egzamin-01-styczen-2026/html-php.mdx"),
    },
    {
        slug: "css",
        index: 3,
        label: "CSS",
        short: "CSS",
        summary: "Trzy kolumny, kolory z polecenia, hover, overflow — odtworzenie makiety.",
        minutes: "90–130 min",
        technologies: ["CSS"],
        mdx: () => import("@/content/inf-03/egzamin-01-styczen-2026/css.mdx"),
    },
    {
        slug: "kontrola",
        index: 4,
        label: "Kontrola",
        short: "Kontrola",
        summary: "Ostatnie 20 minut — punktacja, błędy, checklista przed oddaniem.",
        minutes: "130–150 min",
        technologies: ["QA"],
        mdx: () => import("@/content/inf-03/egzamin-01-styczen-2026/kontrola.mdx"),
    },
];

/** Materialy z arkusza — thumbnails + makieta koncowa */
export const examMaterials = {
    files: [
        { src: "/img/egzaminy/e01-a1.jpg", alt: "a1.jpg — niebieskie Audi", title: "e01-a1.jpg", caption: "sekcja środkowa" },
        { src: "/img/egzaminy/e01-a2.jpg", alt: "a2.jpg — białe BMW", title: "e01-a2.jpg", caption: "drugi pojazd" },
        { src: "/img/egzaminy/e01-a3.png", alt: "a3.png — czerwony kabriolet", title: "e01-a3.png", caption: "sekcja kontakt" },
    ],
    result: {
        src: "/img/egzaminy/e01-rozwiazanie.webp",
        alt: "Makieta końcowa INF.03-01-26.01",
        title: "Makieta końcowa",
        caption: "do odtworzenia 1:1",
    },
} as const;

/** Krotki blok strategii — pokazany na dashboard */
export const examStrategy = [
    { time: "0–25 min", title: "SQL", body: "Cztery zapytania sprawdzone w bazie.", tag: "łatwe punkty" },
    { time: "25–90 min", title: "PHP i baza", body: "Połączenie, charset, pętle, cena, losowanie, tabela z rowspan.", tag: "tu się oblewa" },
    { time: "90–130 min", title: "CSS pod makietę", body: "Trzy kolumny, kolory, hover, overflow.", tag: "dopięcie" },
    { time: "130–150 min", title: "Kontrola", body: "Porównanie z makietą punkt po punkcie.", tag: "ostatnie punkty" },
];

/** Pelna checklista — uzywana na podstronie Kontrola i jako summary na dashboardzie */
export const examChecklistKeys = [
    "sql-4-zapytan",
    "php-polaczenie",
    "utf8",
    "cena-w-php",
    "dwa-losowe",
    "rowspan",
    "obrazki-sciezki",
    "main-flex",
    "sekcje-333",
    "makieta-zgodna",
] as const;

export type ExamChecklistKey = (typeof examChecklistKeys)[number];

/** localStorage key dla progressu */
export const EXAM_PROGRESS_STORAGE_KEY = "exam:inf-03-egzamin-01-styczen-2026:checklist";

export function getStepBySlug(slug: string): ExamStep | undefined {
    return examSteps.find((s) => s.slug === slug);
}

/** Lista etapow bez funkcji mdx — bezpieczna do przekazania do client component. */
export const examStepsView: ExamStepView[] = examSteps.map(({ mdx: _mdx, ...rest }) => rest);

/** Zwroc tylko serializowalne pola etapu (do prop client component). */
export function toExamStepView(step: ExamStep): ExamStepView {
    const { mdx: _mdx, ...view } = step;
    return view;
}

export const examFlowBasePath = `/kursy/${examMeta.courseId}/${examMeta.lessonSlug}`;
