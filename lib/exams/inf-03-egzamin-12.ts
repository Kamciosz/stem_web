/**
 * Single source of truth dla arkusza INF.03 / styczeń 2026 / 12.
 * Dashboard + 4 podstrony etapow.
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
    lessonSlug: "egzamin-12-styczen-2026",
    examId: "INF.03-12",
    session: "Styczeń 2026",
    title: "Arkusz 12 — Studio tatuażu",
    topic: "Studio tatuażu",
    description:
        "Przewodnik po rozwiązaniu w kolejności pracy. Cztery etapy, każdy na osobnej stronie. Plan, materiały, błędy i kod — bez jednego długiego scrolla.",
    rule: "SQL → PHP → CSS → Kontrola",
    time: "150 min",
    technologies: ["PHP", "SQL", "CSS", "HTML"],
    scoreTarget: "~22 / 30 pkt",
    scoringTotal: "30 pkt",
    objective: "Wykonanie aplikacji internetowej studia tatuażu",
};

export const examSteps: ExamStep[] = [
    {
        slug: "baza-danych",
        index: 1,
        label: "Baza danych",
        short: "Baza",
        summary: "Struktura tabel, klucze obce, zapytania SQL.",
        minutes: "0–25 min",
        technologies: ["SQL", "MySQL"],
        mdx: () => import("@/content/inf-03/egzamin-12-styczen-2026/baza-danych.mdx"),
    },
    {
        slug: "html-php",
        index: 2,
        label: "HTML / PHP",
        short: "HTML/PHP",
        summary: "Połączenie z bazą, logika biznesowa, wyświetlanie danych.",
        minutes: "25–90 min",
        technologies: ["PHP", "HTML"],
        mdx: () => import("@/content/inf-03/egzamin-12-styczen-2026/html-php.mdx"),
    },
    {
        slug: "css",
        index: 3,
        label: "CSS",
        short: "CSS",
        summary: "Layout, kolory, odtworzenie makiety.",
        minutes: "90–130 min",
        technologies: ["CSS"],
        mdx: () => import("@/content/inf-03/egzamin-12-styczen-2026/css.mdx"),
    },
    {
        slug: "kontrola",
        index: 4,
        label: "Kontrola",
        short: "Kontrola",
        summary: "Weryfikacja wymagań, punktacja, checklista.",
        minutes: "130–150 min",
        technologies: ["QA"],
        mdx: () => import("@/content/inf-03/egzamin-12-styczen-2026/kontrola.mdx"),
    },
];

export const examStrategy = [
    { time: "0–25 min", title: "Analiza i SQL", body: "Rozpisz dane wejściowe, sprawdź zapytania albo wymagane pliki.", tag: "łatwe punkty" },
    { time: "25–90 min", title: "PHP i baza", body: "Połączenie, charset, pętle, formularze, obliczenia i zapis danych.", tag: "główna część" },
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
        { src: "/img/egzaminy/e12-logo.png", alt: "e12-logo.png — materiał arkusza INF.03-12", title: "e12-logo.png", caption: "materiał z arkusza" },
        { src: "/img/egzaminy/e12-smok.png", alt: "e12-smok.png — materiał arkusza INF.03-12", title: "e12-smok.png", caption: "materiał z arkusza" },
        { src: "/img/egzaminy/e12-tygrys.png", alt: "e12-tygrys.png — materiał arkusza INF.03-12", title: "e12-tygrys.png", caption: "materiał z arkusza" },
    ],
    result: {
        src: "/img/egzaminy/e12-kw4.png",
        alt: "Makieta lub wynik końcowy INF.03-12 — Studio tatuażu",
        title: "e12-kw4.png",
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
