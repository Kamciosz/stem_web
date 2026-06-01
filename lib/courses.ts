/**
 * Rejestr kursów: kurs → moduły → lekcje.
 * Treść lekcji żyje w plikach .mdx (content/<courseId>/<lessonSlug>.mdx).
 * Tu jest tylko struktura i metadane — co istnieje, w jakiej kolejności, czy gotowe.
 *
 * PYTANIA QUIZU:
 *   * Standardowo: pytania żyją w bazie Supabase (tabela `questions`).
 *   * `hasQuiz: true` oznacza, że lekcja MA pulę pytań w Supabase i strona
 *     /quiz powinna istnieć. `hasQuiz: false` = brak quizu (generuje 404).
 *   * `quizPoolSize` (opcjonalne) to orientacyjna wielkość puli — UI
 *     może to pokazać ("5 z 20 losowych pytań"). Jeśli null, UI
 *     pokaże ogólny opis.
 *   * Stare pole `quiz` (z pytaniami w kodzie) zostawiam jako fallback
 *     developerski — używane TYLKO gdy Supabase nie jest podpięte.
 *     W produkcji pytania lecą z bazy.
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
    /**
     * Czy lekcja ma quiz (osobna podstrona /quiz). Źródło prawdy o istnieniu
     * strony /quiz — generateStaticParams ją pominie jeśli false.
     * Pytania lecą z Supabase, nie stąd.
     */
    hasQuiz?: boolean;
    /** Orientacyjna wielkość puli (do UI: "5 z N losowych") */
    quizPoolSize?: number;
    /**
     * Fallback developerski: pytania w kodzie. Używane TYLKO gdy
     * Supabase nie zwróci puli. Produkcja powinna mieć pytania w bazie.
     */
    quiz?: QuizQuestion[];
    /**
     * WIDEO WYJAŚNIAJĄCE — miejsce przygotowane na przyszłość.
     * Gdy lekcja dostanie nagranie, dopisujesz tu obiekt i wideo
     * automatycznie wyświetli się nad treścią lekcji.
     *   - provider: "youtube" (nocookie) albo "cloudflare" (Stream).
     *     Dostawca jeszcze nieustalony — komponent obsługuje OBA.
     *   - customerCode: tylko dla Cloudflare (subdomena z dashboardu).
     * PLAN: gdy wejdą konta użytkowników, na wideo nałożymy nick
     * zalogowanego ucznia (watermark) jako zabezpieczenie przed
     * kradzieżą materiału. To dojdzie razem z warstwą logowania.
     */
    video?: {
        provider: "youtube" | "cloudflare";
        id: string;
        customerCode?: string;
    };
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
                    "Budowa dokumentu, znaczniki semantyczne, formularze, tabele, multimedia. Fundament każdej strony.",
                lessons: [
                    {
                        slug: "html-semantyczny",
                        title: "HTML semantyczny",
                        summary:
                            "Czym jest semantyka znaczników i dlaczego <nav>, <article>, <section> są lepsze od samych <div>.",
                        published: true,
                        minutes: 12,
                        objectives: [
                            "Rozróżnisz znaczniki semantyczne od neutralnych pojemników div",
                            "Poznasz header, nav, main, article, section, aside i footer oraz ich role",
                            "Zbudujesz poprawny szkielet strony, w którym każdy blok ma znaczenie",
                            "Zrozumiesz hierarchię nagłówków h1–h6 i dlaczego nie wolno jej łamać"
                        ],
                        hasQuiz: true,
                        quizPoolSize: 20
                    },
                    {
                        slug: "formularze",
                        title: "Formularze i pola",
                        summary:
                            "<form>, <input>, <label>, <select>, <textarea>, walidacja po stronie HTML.",
                        published: true,
                        minutes: 15,
                        objectives: [
                            "Zbudujesz formularz z polami tekstowymi, selectem, checkboxami i radio",
                            "Powiążesz <label> z <input> przez id/for dla dostępności",
                            "Poznasz atrybuty walidacji HTML5 (required, type, pattern, min/max)",
                            "Zrozumiesz metodę GET vs POST i kiedy ich używać"
                        ],
                        hasQuiz: true,
                        quizPoolSize: 20
                    },
                    {
                        slug: "tabele",
                        title: "Tabele danych",
                        summary:
                            "<table>, <thead>, <tbody>, <tfoot>, scope, atrybuty dostępności.",
                        published: true,
                        minutes: 10,
                        objectives: [
                            "Zbudujesz poprawną tabelę z thead/tbody/tfoot",
                            "Dodasz atrybut scope (col/row) dla dostępności",
                            "Rozróżnisz tabele danych od layoutu (kiedy NIE używać tabel)",
                            "Zastosujesz <caption> jako opis tabeli"
                        ],
                        hasQuiz: true,
                        quizPoolSize: 20
                    },
                    {
                        slug: "multimedia",
                        title: "Multimedia i linki",
                        summary:
                            "<img>, <a>, <video>, <audio>, atrybut alt, linkowanie wewnętrzne i zewnętrzne.",
                        published: true,
                        minutes: 10,
                        objectives: [
                            "Dodasz obrazy z opisowym atrybutem alt",
                            "Zbudujesz linki zewnętrzne (target=_blank, rel=noopener) i wewnętrzne (#kotwica)",
                            "Osadzisz wideo i audio z kontrolkami",
                            "Zrozumiesz kiedy użyć <figure> i <figcaption>"
                        ],
                        hasQuiz: true,
                        quizPoolSize: 20
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
                        published: true,
                        minutes: 12,
                        objectives: [
                            "Poznasz selektory: element, klasa, id, atrybut, pseudoklasy",
                            "Zrozumiesz specyficzność i kaskadę — co wygrywa w konflikcie",
                            "Użyjesz dziedziczenia i kaskady świadomie",
                            "Zdebugujesz konflikt reguł DevTools-em"
                        ],
                        hasQuiz: true,
                        quizPoolSize: 20
                    },
                    {
                        slug: "box-model",
                        title: "Box model i jednostki",
                        summary: "content/padding/border/margin, px vs em vs rem, box-sizing.",
                        published: true,
                        minutes: 10,
                        objectives: [
                            "Zrozumiesz różnicę content-box vs border-box",
                            "Dobierzesz jednostki (px, em, rem, %, vw/vh) do kontekstu",
                            "Policzysz rzeczywisty rozmiar elementu",
                            "Poznasz collapse marginów i jak go unikać"
                        ],
                        hasQuiz: true,
                        quizPoolSize: 20
                    },
                    {
                        slug: "flexbox",
                        title: "Flexbox — układ w 1D",
                        summary: "Elastyczny układ w jednym kierunku: display:flex i właściwości.",
                        published: true,
                        minutes: 18,
                        objectives: [
                            "Wystylujesz pasek nawigacji, listę kart i centrowanie",
                            "Poznasz justify-content, align-items, flex-wrap",
                            "Użyjesz flex-grow/shrink/basis do elastycznych kolumn",
                            "Rozwiążesz typowe problemy layoutu"
                        ],
                        hasQuiz: true,
                        quizPoolSize: 20
                    },
                    {
                        slug: "grid",
                        title: "CSS Grid — układ w 2D",
                        summary: "Siatka: display:grid, template-columns/rows, gap, named areas.",
                        published: true,
                        minutes: 18,
                        objectives: [
                            "Zbudujesz layout strony z header/sidebar/main/footer w Grid",
                            "Użyjesz fr, repeat(), minmax() i named areas",
                            "Rozróżnisz Flexbox (1D) od Grid (2D) i dobierzesz narzędzie",
                            "Zrobisz responsywny grid bez media queries (auto-fit/minmax)"
                        ],
                        hasQuiz: true,
                        quizPoolSize: 20
                    },
                    {
                        slug: "rwd",
                        title: "Responsywność (RWD)",
                        summary: "Media queries, mobile-first, breakpointy, viewport meta.",
                        published: true,
                        minutes: 12,
                        objectives: [
                            "Zastosujesz podejście mobile-first",
                            "Napiszesz media queries (min-width) dla typowych breakpointów",
                            "Dodasz viewport meta i zrozumiesz jego rolę",
                            "Zamienisz layout desktopowy na mobilny"
                        ],
                        hasQuiz: true,
                        quizPoolSize: 20
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
                        summary: "let/const, typy, operatory, if/for, funkcje strzałkowe.",
                        published: true,
                        minutes: 18,
                        objectives: [
                            "Deklarujesz zmienne let/const i rozróżniasz od var",
                            "Poznasz typy: string, number, boolean, array, object",
                            "Napiszesz if/else, pętle for/while, funkcje (w tym strzałkowe)",
                            "Użyjesz template stringów i destrukturyzacji"
                        ],
                        hasQuiz: true,
                        quizPoolSize: 20
                    },
                    {
                        slug: "dom-zdarzenia",
                        title: "DOM i zdarzenia",
                        summary: "querySelector, addEventListener, manipulacja treścią i klasami.",
                        published: true,
                        minutes: 18,
                        objectives: [
                            "Wybierzesz elementy querySelector/querySelectorAll",
                            "Dodasz reakcję na click/input/submit (addEventListener)",
                            "Zmienisz treść (textContent) i klasy (classList)",
                            "Zbudujesz prosty interaktywny komponent (np. toggle, modal, lista)"
                        ],
                        hasQuiz: true,
                        quizPoolSize: 20
                    },
                    {
                        slug: "fetch-api",
                        title: "Fetch i asynchroniczność",
                        summary: "fetch, Promise, async/await, obsługa błędów.",
                        published: true,
                        minutes: 15,
                        objectives: [
                            "Wysyłasz zapytanie fetch() i czytasz JSON",
                            "Obsłużysz błędy (try/catch, response.ok)",
                            "Użyjesz async/await zamiast .then()",
                            "Wyświetlisz dane z API na stronie"
                        ],
                        hasQuiz: true,
                        quizPoolSize: 20
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
                        summary: "Składnia, zmienne, funkcje, formularze metodą GET/POST.",
                        published: true,
                        minutes: 18,
                        objectives: [
                            "Zapiszesz skrypt PHP i uruchomisz go na serwerze (XAMPP)",
                            "Odbierzesz dane z $_GET i $_POST",
                            "Zastosujesz htmlspecialchars() przy wyświetlaniu danych",
                            "Napiszesz prosty handler formularza kontaktowego"
                        ],
                        hasQuiz: true,
                        quizPoolSize: 20
                    },
                    {
                        slug: "php-mysql",
                        title: "PHP + baza danych",
                        summary: "mysqli/PDO, prepared statements, bezpieczne zapytania.",
                        published: true,
                        minutes: 20,
                        objectives: [
                            "Połączysz się z MySQL przez PDO",
                            "Użyjesz prepared statements (ochrona przed SQL injection)",
                            "Wyciągniesz dane (SELECT) i wyświetlisz je w HTML",
                            "Wstawisz rekord (INSERT) i obsłużysz błędy"
                        ],
                        hasQuiz: true,
                        quizPoolSize: 20
                    },
                    {
                        slug: "sesje",
                        title: "Sesje i logowanie",
                        summary: "session_start(), $_SESSION, hashowanie haseł, prosta autoryzacja.",
                        published: true,
                        minutes: 18,
                        objectives: [
                            "Użyjesz sesji do zapamiętania zalogowanego usera",
                            "Zahaszujesz hasło (password_hash) i zweryfikujesz (password_verify)",
                            "Zabezpieczysz stronę przed wejściem niezalogowanego",
                            "Wylogujesz usera (session_destroy)"
                        ],
                        hasQuiz: true,
                        quizPoolSize: 20
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
                        summary: "CREATE TABLE, typy, klucz główny, INSERT/SELECT/UPDATE/DELETE.",
                        published: true,
                        minutes: 18,
                        objectives: [
                            "Utworzysz tabelę z odpowiednimi typami i kluczem głównym",
                            "Wstawisz dane (INSERT) i odczytasz (SELECT)",
                            "Przefiltrujesz (WHERE), posortujesz (ORDER BY), ograniczysz (LIMIT)",
                            "Zaktualizujesz i usuniesz rekordy (UPDATE/DELETE)"
                        ],
                        hasQuiz: true,
                        quizPoolSize: 20
                    },
                    {
                        slug: "relacje-join",
                        title: "Relacje i JOIN",
                        summary: "Klucz obcy, relacje 1:N, INNER/LEFT JOIN, normalizacja.",
                        published: true,
                        minutes: 20,
                        objectives: [
                            "Zaprojektujesz relację 1:N (klucz obcy)",
                            "Połączysz dane z dwóch tabel (INNER JOIN)",
                            "Rozróżnisz INNER od LEFT JOIN",
                            "Wybierzesz dane z 3 tabel (JOIN × 2)"
                        ],
                        hasQuiz: true,
                        quizPoolSize: 20
                    },
                    {
                        slug: "agregacje",
                        title: "Agregacje i GROUP BY",
                        summary: "COUNT, SUM, AVG, GROUP BY, HAVING, podzapytania.",
                        published: true,
                        minutes: 18,
                        objectives: [
                            "Użyjesz COUNT, SUM, AVG, MIN, MAX",
                            "Pogrupujesz wyniki (GROUP BY) i odfiltrujesz grupy (HAVING)",
                            "Napiszesz podzapytanie (subquery)",
                            "Zbudujesz raport sprzedaży / statystykę"
                        ],
                        hasQuiz: true,
                        quizPoolSize: 20
                    }
                ]
            },
            {
                id: "egzaminy",
                title: "Egzaminy praktyczne INF.03",
                description:
                    "Realne arkusze egzaminacyjne z rozwiązaniami, omówieniem i wnioskami. Sesja styczeń 2026 — 12 arkuszy.",
                lessons: [
                    {
                        slug: "anatomia-zadania",
                        title: "Jak czytać arkusz INF.03",
                        summary: "Struktura arkusza, podział czasu, na co patrzy egzaminator, typowe pułapki.",
                        published: true,
                        minutes: 15,
                        objectives: [
                            "Rozłożysz arkusz egzaminacyjny na sekcje",
                            "Zaplanujesz czas (ile minut na SQL / PHP / CSS)",
                            "Rozpoznasz typowe pułapki punktowe",
                            "Zastosujesz zasadę 'najpierw łatwe punkty'"
                        ],
                        hasQuiz: true,
                        quizPoolSize: 20
                    },
                    {
                        slug: "egzamin-01-styczen-2026",
                        title: "Arkusz 01 — Portal samochodowy",
                        summary: "PHP+SQL: baza samochody, JOIN z dopłatą, losowanie rekordów, CSS DarkGreen.",
                        published: true,
                        minutes: 40,
                        objectives: [
                            "Napiszesz 4 kwerendy SQL (LIMIT, AVG/MAX, JOIN, ORDER BY RAND())",
                            "Zbudujesz stronę index.php z 3 sekcjami i tabelami",
                            "Połączysz PHP z bazą i wyświetlisz dane w pętli",
                            "Zastosujesz hover na wierszach tabeli w CSS"
                        ],
                        hasQuiz: false
                    },
                    {
                        slug: "egzamin-02-styczen-2026",
                        title: "Arkusz 02 — Zdrowy bazarek",
                        summary: "PHP+SQL: baza bazar, formularz zamówień, dynamiczna lista rozwijana, grafika z przezroczystością.",
                        published: true,
                        minutes: 40,
                        objectives: [
                            "Napiszesz kwerendy SQL (LIMIT, INSERT, SELECT po id)",
                            "Zbudujesz formularz z listą rozwijaną wypełnioną z bazy",
                            "Obsłużysz POST w PHP i wstawisz rekord do bazy",
                            "Ustawisz przezroczyste tło grafiki"
                        ],
                        hasQuiz: false
                    },
                    {
                        slug: "egzamin-03-styczen-2026",
                        title: "Arkusz 03 — Pola figur",
                        summary: "JavaScript: animacja GIF, DOM (zmiana src obrazu), obliczanie pól figur, znaki specjalne HTML.",
                        published: true,
                        minutes: 40,
                        objectives: [
                            "Utworzysz animację GIF z 5 klatek",
                            "Napiszesz skrypt JS zmieniający src obrazu po kliknięciu",
                            "Obliczysz pole trójkąta/prostokąta na podstawie pól formularza",
                            "Użyjesz &Pi; i <sup> do zapisu wzoru"
                        ],
                        hasQuiz: false
                    },
                    {
                        slug: "egzamin-04-styczen-2026",
                        title: "Arkusz 04 — Portal maturzystów",
                        summary: "PHP+SQL: baza matura, GET między stronami, 5 kwerend, GROUP BY ze średnią.",
                        published: true,
                        minutes: 45,
                        objectives: [
                            "Napiszesz 5 kwerend SQL (DISTINCT, MIN/MAX, AVG+GROUP BY, JOIN)",
                            "Przekażesz dane między stronami metodą GET przez odnośniki",
                            "Zbudujesz dynamiczne odnośniki z parametrami z bazy",
                            "Zastosujesz box-shadow i inline-block w CSS"
                        ],
                        hasQuiz: false
                    },
                    {
                        slug: "egzamin-05-styczen-2026",
                        title: "Arkusz 05 — Zgłoszenia wypadków",
                        summary: "PHP+SQL: baza zgloszenia, radio buttons, NOT IN, INSERT z datą, hover na przyciskach.",
                        published: true,
                        minutes: 40,
                        objectives: [
                            "Napiszesz kwerendy z NOT IN i COUNT+GROUP BY",
                            "Obsłużysz pola opcji (radio) w formularzu PHP",
                            "Wstawisz rekord z aktualną datą (NOW())",
                            "Zastosujesz zaokrąglone przyciski z hover w CSS"
                        ],
                        hasQuiz: false
                    },
                    {
                        slug: "egzamin-06-styczen-2026",
                        title: "Arkusz 06 — Diagnostyka online",
                        summary: "PHP+SQL: baza choroby, relacja n:m, grafika z przezroczystym tłem, pozycjonowanie absolute, nth-child.",
                        published: true,
                        minutes: 45,
                        objectives: [
                            "Napiszesz kwerendę z relacją n:m (3 tabele)",
                            "Utworzysz grafikę PNG z przezroczystym tłem i tekstem",
                            "Zastosujesz position: absolute i nth-child w CSS",
                            "Dynamicznie wypełnisz listę rozwijaną i wyświetlisz wyniki"
                        ],
                        hasQuiz: false
                    },
                    {
                        slug: "egzamin-07-styczen-2026",
                        title: "Arkusz 07 — Stacja meteorologiczna",
                        summary: "PHP+SQL: baza pogoda, ROUND+AVG, INSERT, JOIN, kadrowanie grafik pogodowych.",
                        published: true,
                        minutes: 40,
                        objectives: [
                            "Napiszesz kwerendy z ROUND(AVG()), INSERT i JOIN",
                            "Wykadrujesz i przeskolujesz 3 grafiki z jednego pliku źródłowego",
                            "Zbudujesz stronę z formularzem i dynamiczną tabelą",
                            "Wyświetlisz dane pogodowe z bazy w odpowiednich sekcjach"
                        ],
                        hasQuiz: false
                    },
                    {
                        slug: "egzamin-08-styczen-2026",
                        title: "Arkusz 08 — Korona gór polskich",
                        summary: "PHP+SQL: baza korona, LIKE 'Beskid%', JOIN z opisem, 2 strony PHP, przezroczystość logo.",
                        published: true,
                        minutes: 45,
                        objectives: [
                            "Napiszesz kwerendy z ORDER BY, LIMIT, JOIN i LIKE",
                            "Zbudujesz 2 strony PHP (index + szczyty) z przekazaniem GET",
                            "Ustawisz przezroczyste tło logo i przeskolujesz grafikę",
                            "Zastosujesz overflow: auto i dynamiczne obrazy z bazy"
                        ],
                        hasQuiz: false
                    },
                    {
                        slug: "egzamin-09-styczen-2026",
                        title: "Arkusz 09 — Salon paznokci",
                        summary: "PHP+JS+SQL: baza paznokcie, JS przełączanie sekcji (display), ALTER TABLE, kadrowanie grafiki.",
                        published: true,
                        minutes: 45,
                        objectives: [
                            "Napiszesz kwerendy z JOIN i ALTER TABLE ADD COLUMN",
                            "Napiszesz JS przełączający widoczność 3 sekcji (display block/none)",
                            "Użyjesz PHP lub JS do generowania 10 obrazów w pętli",
                            "Wykadrujesz grafikę do krawędzi butelek i przeskolujesz"
                        ],
                        hasQuiz: false
                    },
                    {
                        slug: "egzamin-10-styczen-2026",
                        title: "Arkusz 10 — Blog kulinarny",
                        summary: "PHP+SQL: baza przepisy, relacja n:m (potrawy-alergeny), GET przez odnośniki, kadrowanie separatora.",
                        published: true,
                        minutes: 40,
                        objectives: [
                            "Napiszesz kwerendy z relacją n:m przez tabelę pośredniczącą",
                            "Zbudujesz nawigację przez odnośniki z parametrem GET id",
                            "Wyświetlisz przepis, alergeny i obrazek potrawy z bazy",
                            "Wykadrujesz graficzny separator"
                        ],
                        hasQuiz: false
                    },
                    {
                        slug: "egzamin-11-styczen-2026",
                        title: "Arkusz 11 — KinoTEKA",
                        summary: "PHP+SQL: baza kino, relacja n:m (filmy-aktorzy), 5 kwerend, 2 strony, awatary aktorów.",
                        published: true,
                        minutes: 45,
                        objectives: [
                            "Napiszesz 5 kwerend SQL (>=, WHERE id, ORDER BY, JOIN n:m, COUNT+GROUP BY)",
                            "Zbudujesz 2 strony PHP z przekazaniem danych GET",
                            "Wyświetlisz awatary aktorów jako klikalne karty",
                            "Zastosujesz <em>, <strong> i semantyczne znaczniki"
                        ],
                        hasQuiz: false
                    },
                    {
                        slug: "egzamin-12-styczen-2026",
                        title: "Arkusz 12 — Studio tatuażu",
                        summary: "PHP+JS+SQL: baza studiotatuazu, JS createElement+appendChild, @font-face Dancing Script, UPDATE +10%.",
                        published: true,
                        minutes: 45,
                        objectives: [
                            "Napiszesz kwerendy z UPDATE SET cena=cena*1.1, GROUP BY, JOIN",
                            "Napiszesz JS tworzący elementy DOM (createElement, appendChild)",
                            "Dodasz czcionkę @font-face do CSS",
                            "Wydobędziesz nazwę pliku z C:\\\\fakepath\\\\ w JS"
                        ],
                        hasQuiz: false
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

/** Czy lekcja ma quiz (osobna podstrona /quiz). Źródło prawdy: hasQuiz. */
export function lessonHasQuiz(courseId: string, lessonSlug: string) {
    const found = getLesson(courseId, lessonSlug);
    return Boolean(found?.lesson.hasQuiz);
}

/** Dane do komponentu ExamPicker — sesje egzaminacyjne z ikonami technologii */
import type { ExamSession } from "@/components/ExamPicker";

export const examSessions: ExamSession[] = [
    {
        year: 2026,
        month: "Styczeń",
        exams: [
            { id: "INF.03-01", title: "Arkusz 01", tech: "php", slug: "egzamin-01-styczen-2026", topic: "Portal samochodowy" },
            { id: "INF.03-02", title: "Arkusz 02", tech: "php", slug: "egzamin-02-styczen-2026", topic: "Zdrowy bazarek" },
            { id: "INF.03-03", title: "Arkusz 03", tech: "js", slug: "egzamin-03-styczen-2026", topic: "Pola figur" },
            { id: "INF.03-04", title: "Arkusz 04", tech: "php", slug: "egzamin-04-styczen-2026", topic: "Portal maturzystów" },
            { id: "INF.03-05", title: "Arkusz 05", tech: "php", slug: "egzamin-05-styczen-2026", topic: "Zgłoszenia wypadków" },
            { id: "INF.03-06", title: "Arkusz 06", tech: "php", slug: "egzamin-06-styczen-2026", topic: "Diagnostyka online" },
            { id: "INF.03-07", title: "Arkusz 07", tech: "php", slug: "egzamin-07-styczen-2026", topic: "Stacja meteorologiczna" },
            { id: "INF.03-08", title: "Arkusz 08", tech: "php", slug: "egzamin-08-styczen-2026", topic: "Korona gór polskich" },
            { id: "INF.03-09", title: "Arkusz 09", tech: "php+js", slug: "egzamin-09-styczen-2026", topic: "Salon paznokci" },
            { id: "INF.03-10", title: "Arkusz 10", tech: "php", slug: "egzamin-10-styczen-2026", topic: "Blog kulinarny" },
            { id: "INF.03-11", title: "Arkusz 11", tech: "php", slug: "egzamin-11-styczen-2026", topic: "KinoTEKA" },
            { id: "INF.03-12", title: "Arkusz 12", tech: "php+js", slug: "egzamin-12-styczen-2026", topic: "Studio tatuażu" },
        ],
    },
];
