/**
 * Rejestr kursów: kurs → moduły → lekcje.
 * Treść lekcji żyje w plikach .mdx (content/<courseId>/<lessonSlug>.mdx).
 * Tu jest tylko struktura i metadane — co istnieje, w jakiej kolejności, czy gotowe.
 */

export type QuizQuestion = {
    question: string;
    options: string[];
    /** Indeks poprawnej odpowiedzi (0-based) */
    correct: number;
    /** Wyjaśnienie pokazywane po odpowiedzi */
    explanation?: string;
};

export type Lesson = {
    slug: string;
    title: string;
    /** Krótki opis pod tytułem */
    summary: string;
    /** Czy lekcja jest dostępna (ma treść). false = WKRÓTCE */
    published: boolean;
    /** Szacowany czas w minutach (orientacyjnie) */
    minutes?: number;
    /** Cele lekcji — "czego się nauczysz". Pokazywane na górze strony lekcji. */
    objectives?: string[];
    /** Quiz sprawdzający wiedzę. Żyje na osobnej podstronie /quiz, nie w treści lekcji. */
    quiz?: QuizQuestion[];
};

export type Module = {
    id: string;
    title: string;
    description: string;
    lessons: Lesson[];
};

export type CourseDetail = {
    id: string;
    title: string;
    subtitle: string;
    /** Dla kogo i po co — wizja kursu */
    intro: string;
    /** Egzamin/temat, np. "INF.03" */
    badge: string;
    modules: Module[];
};

export const courseDetails: CourseDetail[] = [
    {
        id: "inf-03",
        title: "Przygotowanie do egzaminu INF.03",
        subtitle: "Tworzenie i administrowanie stron, aplikacji i baz danych",
        badge: "INF.03",
        intro:
            "Materiały od podstaw do egzaminu zawodowego INF.03 — dla uczniów techników (programista, informatyk) i każdego, kto chce wejść w web-dev jako hobby. Niski próg wejścia: tłumaczymy żargon, pokazujemy na przykładach, sprawdzamy wiedzę quizami. Tworzone przez członków Koła STEM.",
        modules: [
            {
                id: "html",
                title: "HTML — struktura strony",
                description:
                    "Budowa dokumentu, znaczniki semantyczne, formularze, tabele. Fundament każdej strony.",
                lessons: [
                    {
                        slug: "html-semantyczny",
                        title: "HTML semantyczny",
                        summary:
                            "Czym jest semantyka znaczników i dlaczego <nav>, <article>, <section> są lepsze od samych <div>.",
                        published: true,
                        minutes: 12
                    },
                    {
                        slug: "formularze",
                        title: "Formularze i pola",
                        summary: "input, label, select, walidacja po stronie HTML.",
                        published: false
                    },
                    {
                        slug: "tabele",
                        title: "Tabele danych",
                        summary: "table, thead, tbody, scope — poprawne tabele dostępne dla wszystkich.",
                        published: false
                    }
                ]
            },
            {
                id: "css",
                title: "CSS — wygląd i układ",
                description:
                    "Selektory, box model, Flexbox, Grid, RWD. Od stylowania tekstu do responsywnych layoutów.",
                lessons: [
                    {
                        slug: "selektory",
                        title: "Selektory i kaskada",
                        summary: "Jak CSS wybiera elementy i co wygrywa, gdy reguły się gryzą.",
                        published: false
                    },
                    {
                        slug: "flexbox-grid",
                        title: "Flexbox i Grid",
                        summary: "Dwa systemy układu, które rozwiązują 90% problemów z layoutem.",
                        published: false
                    },
                    {
                        slug: "rwd",
                        title: "Responsywność (RWD)",
                        summary: "Media queries i strona, która działa na telefonie i monitorze.",
                        published: false
                    }
                ]
            },
            {
                id: "javascript",
                title: "JavaScript — interaktywność",
                description:
                    "Zmienne, funkcje, DOM, zdarzenia, fetch. Ożywianie statycznej strony.",
                lessons: [
                    {
                        slug: "podstawy-js",
                        title: "Podstawy JavaScriptu",
                        summary: "Zmienne, typy, operatory, instrukcje warunkowe i pętle.",
                        published: false
                    },
                    {
                        slug: "dom-zdarzenia",
                        title: "DOM i zdarzenia",
                        summary: "Wybieranie elementów, reagowanie na kliknięcia, zmiana treści.",
                        published: false
                    }
                ]
            },
            {
                id: "php",
                title: "PHP — backend",
                description:
                    "Składnia, formularze, sesje, połączenie z bazą. Logika po stronie serwera.",
                lessons: [
                    {
                        slug: "podstawy-php",
                        title: "Podstawy PHP",
                        summary: "Składnia, zmienne, funkcje, obsługa formularzy metodą POST/GET.",
                        published: false
                    },
                    {
                        slug: "php-mysql",
                        title: "PHP + baza danych",
                        summary: "Połączenie z MySQL, zapytania, bezpieczne przekazywanie danych.",
                        published: false
                    }
                ]
            },
            {
                id: "sql",
                title: "SQL — bazy danych",
                description:
                    "Projektowanie tabel, relacje, zapytania SELECT/INSERT/UPDATE/DELETE, JOIN.",
                lessons: [
                    {
                        slug: "podstawy-sql",
                        title: "Podstawy SQL",
                        summary: "Tabele, typy danych, CRUD — pierwsze zapytania.",
                        published: false
                    },
                    {
                        slug: "relacje-join",
                        title: "Relacje i JOIN",
                        summary: "Klucze obce i łączenie danych z wielu tabel.",
                        published: false
                    }
                ]
            },
            {
                id: "projekt",
                title: "Projekt egzaminacyjny",
                description:
                    "Przejście pełnego zadania typu egzaminacyjnego: od makiety do działającej aplikacji z bazą.",
                lessons: [
                    {
                        slug: "anatomia-zadania",
                        title: "Anatomia zadania INF.03",
                        summary: "Jak czytać arkusz, jak rozłożyć czas, na co patrzy egzaminator.",
                        published: false
                    }
                ]
            }
        ]
    }
];

export function getCourseDetail(id: string) {
    return courseDetails.find((c) => c.id === id);
}

export function getLesson(courseId: string, lessonSlug: string) {
    const course = getCourseDetail(courseId);
    if (!course) return null;
    for (const module of course.modules) {
        const lesson = module.lessons.find((l) => l.slug === lessonSlug);
        if (lesson) return { course, module, lesson };
    }
    return null;
}

/** Płaska lista wszystkich lekcji kursu w kolejności — do nawigacji prev/next */
export function getFlatLessons(courseId: string) {
    const course = getCourseDetail(courseId);
    if (!course) return [];
    return course.modules.flatMap((module) =>
        module.lessons.map((lesson) => ({ module, lesson }))
    );
}
