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
    /** Ukryty moduł — nie wyświetla się w UI, ale routing generuje strony */
    hidden?: boolean;
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
                        summary: "fetch, Promise, async/await i obsługa błędów — pobieranie danych z API w zadaniach INF.03 i bezpieczna aktualizacja interfejsu.",
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
                        summary: "COUNT, SUM, AVG, GROUP BY, HAVING i podzapytania — agregowanie danych SQL oraz raporty wymagane w praktycznych zadaniach INF.03.",
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
                id: "_egzaminy",
                title: "Egzaminy praktyczne",
                description: "Arkusze egzaminacyjne INF.03 z rozwiązaniami — dostępne przez ExamPicker.",
                hidden: true,
                lessons: [
                    { slug: "anatomia-zadania", title: "Jak czytać arkusz INF.03", summary: "Struktura arkusza, podział czasu, na co patrzy egzaminator.", published: true, minutes: 15, hasQuiz: true, quizPoolSize: 20 },
                    { slug: "egzamin-01-styczen-2026", title: "Arkusz 01 — Portal samochodowy", summary: "Interaktywny przewodnik egzaminacyjny: SQL, PHP, CSS, punktacja i checklista.", published: true, minutes: 150 },
                    { slug: "egzamin-02-styczen-2026", title: "Arkusz 02 — Portal warzywny", summary: "PHP+SQL", published: true, minutes: 40 },
                    { slug: "egzamin-03-styczen-2026", title: "Arkusz 03 — Witryna matematyczna", summary: "JavaScript", published: true, minutes: 40 },
                    { slug: "egzamin-04-styczen-2026", title: "Arkusz 04 — Portal maturzystów", summary: "PHP+SQL", published: true, minutes: 45 },
                    { slug: "egzamin-05-styczen-2026", title: "Arkusz 05 — Portal zgłoszeń wypadków", summary: "PHP+SQL", published: true, minutes: 40 },
                    { slug: "egzamin-06-styczen-2026", title: "Arkusz 06 — Portal diagnostyki online", summary: "PHP+SQL", published: true, minutes: 45 },
                    { slug: "egzamin-07-styczen-2026", title: "Arkusz 07 — Stacja meteorologiczna", summary: "PHP+SQL", published: true, minutes: 40 },
                    { slug: "egzamin-08-styczen-2026", title: "Arkusz 08 — Korona gór polskich", summary: "PHP+SQL", published: true, minutes: 45 },
                    { slug: "egzamin-09-styczen-2026", title: "Arkusz 09 — Salon stylizacji paznokci", summary: "PHP+JS+SQL", published: true, minutes: 45 },
                    { slug: "egzamin-10-styczen-2026", title: "Arkusz 10 — Blog kulinarny", summary: "PHP+SQL", published: true, minutes: 40 },
                    { slug: "egzamin-11-styczen-2026", title: "Arkusz 11 — Portal kina", summary: "PHP+SQL", published: true, minutes: 45 },
                    { slug: "egzamin-12-styczen-2026", title: "Arkusz 12 — Studio tatuażu", summary: "PHP+JS+SQL", published: true, minutes: 45 },
                    { slug: "egzamin-01-czerwiec-2025", title: "Arkusz 01 — Gry komputerowe", summary: "Ranking gier komputerowych z PHP+SQL+CSS, schemat, kwerendy, formularz.", published: true, minutes: 150 },
                    { slug: "egzamin-02-czerwiec-2025", title: "Arkusz 02 — Notatki", summary: "Notatki online z priorytetami — PHP+SQL+CSS.", published: true, minutes: 40 },
                    { slug: "egzamin-03-czerwiec-2025", title: "Arkusz 03 — Biblioteka szkolna", summary: "Portal biblioteki szkolnej — PHP+SQL+CSS.", published: true, minutes: 40 },
                    { slug: "egzamin-04-czerwiec-2025", title: "Arkusz 04 — Firma przewozowa", summary: "Firma przewozowa — PHP+SQL+CSS.", published: true, minutes: 45 },
                    { slug: "egzamin-05-czerwiec-2025", title: "Arkusz 05 — Fotografia", summary: "Uslugi fotograficzne — HTML+SQL+CSS, kwerendy i layout.", published: true, minutes: 45 },
                    { slug: "egzamin-06-czerwiec-2025", title: "Arkusz 06 — Biblioteka", summary: "System wypozyczalni — PHP+SQL+CSS.", published: true, minutes: 45 },
                    { slug: "egzamin-07-czerwiec-2025", title: "Arkusz 07 — Wyprawy", summary: "Przewodnik po wyprawach — HTML+SQL+CSS, galeria i kwerendy.", published: true, minutes: 45 },
                    { slug: "egzamin-08-czerwiec-2025", title: "Arkusz 08 — Smoki", summary: "Katalog smokow — JS+SQL+CSS, fetch i renderowanie.", published: true, minutes: 45 },
                    { slug: "egzamin-09-czerwiec-2025", title: "Arkusz 09 — Remonty", summary: "Firma remontowa — PHP+SQL+CSS, kwerendy i zlecenia.", published: true, minutes: 45 },
                    { slug: "egzamin-10-czerwiec-2025", title: "Arkusz 10 — Szkolenia", summary: "System szkolen — PHP+SQL+CSS.", published: true, minutes: 45 },
                    { slug: "egzamin-11-czerwiec-2025", title: "Arkusz 11 — Opony", summary: "Sklep z oponami — PHP+SQL+CSS.", published: true, minutes: 45 },
                    { slug: "egzamin-12-czerwiec-2025", title: "Arkusz 12 — Medica", summary: "Przychodnia medyczna — PHP+SQL+CSS.", published: true, minutes: 45 },
                    { slug: "egzamin-01-styczen-2025", title: "Arkusz 01 — Obuwie", summary: "Sklep obuwniczy z ratami i katalogiem. (HTML)", published: true, minutes: 45 },
                    { slug: "egzamin-02-styczen-2025", title: "Arkusz 02 — Przewozy", summary: "Portal przewozowy z rozkładami i trasami. (HTML)", published: true, minutes: 45 },
                    { slug: "egzamin-03-styczen-2025", title: "Arkusz 03 — Kalendarz", summary: "Kalendarz wydarzen z baza. (PHP+SQL)", published: true, minutes: 45 },
                    { slug: "egzamin-04-styczen-2025", title: "Arkusz 04 — Obuwie", summary: "Sklep obuwniczy — wersja PHP. (PHP+SQL)", published: true, minutes: 45 },
                    { slug: "egzamin-05-styczen-2025", title: "Arkusz 05 — Firma", summary: "Strona firmy z formularzem kontaktowym. (PHP+SQL)", published: true, minutes: 45 },
                    { slug: "egzamin-06-styczen-2025", title: "Arkusz 06 — Szachy", summary: "Turniej szachowy: gracze, partie, ranking. (HTML)", published: true, minutes: 45 },
                    { slug: "egzamin-07-styczen-2025", title: "Arkusz 07 — Wykaz", summary: "System wykazow z baza. (PHP+SQL)", published: true, minutes: 45 },
                    { slug: "egzamin-08-styczen-2025", title: "Arkusz 08 — Mieszalnia", summary: "Mieszalnia farb — karty kolorow. (PHP+SQL)", published: true, minutes: 45 },
                    { slug: "egzamin-09-styczen-2025", title: "Arkusz 09 — Zdobywcy", summary: "Baza zdobywcow górskich szczytów. (PHP+SQL)", published: true, minutes: 45 },
                    { slug: "egzamin-10-styczen-2025", title: "Arkusz 10 — Szachy", summary: "Turniej szachowy: wersja PHP. (PHP+SQL)", published: true, minutes: 45 },
                    { slug: "egzamin-11-styczen-2025", title: "Arkusz 11 — Konkurs", summary: "System konkursowy z glosowaniem. (PHP+SQL)", published: true, minutes: 45 },
                    { slug: "egzamin-12-styczen-2025", title: "Arkusz 12 — Piekarnia", summary: "Piekarnia — katalog, zamowienia, dostawy. (PHP+SQL)", published: true, minutes: 45 },
                    { slug: "egzamin-01-czerwiec-2024", title: "Arkusz 01 — Motory", summary: "Motoryzacja z PHP+SQL", published: true, minutes: 45 },
                    { slug: "egzamin-02-czerwiec-2024", title: "Arkusz 02 — Chat", summary: "Chat JS+SQL", published: true, minutes: 45 },
                    { slug: "egzamin-03-czerwiec-2024", title: "Arkusz 03 — Rzeki", summary: "Rzeki i zbiorniki PHP+SQL", published: true, minutes: 45 },
                    { slug: "egzamin-04-czerwiec-2024", title: "Arkusz 04 — Galeria", summary: "Galeria zdjec PHP+SQL", published: true, minutes: 45 },
                    { slug: "egzamin-05-czerwiec-2024", title: "Arkusz 05 — Kupauto", summary: "Kupauto - ogloszenia PHP+SQL", published: true, minutes: 45 },
                    { slug: "egzamin-06-czerwiec-2024", title: "Arkusz 06 — Konferencja", summary: "Konferencja JS+SQL", published: true, minutes: 45 },
                    { slug: "egzamin-07-czerwiec-2024", title: "Arkusz 07 — Wazenietirow", summary: "Wazenie tirow PHP+SQL", published: true, minutes: 45 },
                    { slug: "egzamin-08-czerwiec-2024", title: "Arkusz 08 — Klienci", summary: "Klienci JS+SQL", published: true, minutes: 45 },
                    { slug: "egzamin-09-czerwiec-2024", title: "Arkusz 09 — Wycieczki", summary: "Wycieczki JS+SQL", published: true, minutes: 45 },
                    { slug: "egzamin-10-czerwiec-2024", title: "Arkusz 10 — Kadra", summary: "Kadra JS+SQL", published: true, minutes: 45 },
                    { slug: "egzamin-11-czerwiec-2024", title: "Arkusz 11 — Hodowla", summary: "Hodowla zwierzat PHP+SQL", published: true, minutes: 45 },
                    { slug: "egzamin-12-czerwiec-2024", title: "Arkusz 12 — Projekt", summary: "Projekt JS+SQL", published: true, minutes: 45 },
                    { slug: "egzamin-01-styczen-2024", title: "Arkusz 01 — Projekt", summary: "Zadanie JS+SQL", published: true, minutes: 45 },
                    { slug: "egzamin-02-styczen-2024", title: "Arkusz 02 — Projekt", summary: "Zadanie JS+SQL", published: true, minutes: 45 },
                    { slug: "egzamin-03-styczen-2024", title: "Arkusz 03 — Projekt", summary: "Zadanie JS+SQL", published: true, minutes: 45 },
                    { slug: "egzamin-04-styczen-2024", title: "Arkusz 04 — Terminarz", summary: "Terminarz PHP+SQL", published: true, minutes: 45 },
                    { slug: "egzamin-05-styczen-2024", title: "Arkusz 05 — Salon", summary: "Salon pieknosci HTML+SQL", published: true, minutes: 45 },
                    { slug: "egzamin-06-styczen-2024", title: "Arkusz 06 — Podroze", summary: "Podroze PHP+SQL", published: true, minutes: 45 },
                    { slug: "egzamin-07-styczen-2024", title: "Arkusz 07 — Salon", summary: "Salon JS+SQL", published: true, minutes: 45 },
                    { slug: "egzamin-08-styczen-2024", title: "Arkusz 08 — Fryzjer", summary: "Fryzjer JS+SQL", published: true, minutes: 45 },
                    { slug: "egzamin-09-styczen-2024", title: "Arkusz 09 — Projekt", summary: "Zadanie JS+SQL", published: true, minutes: 45 },
                    { slug: "egzamin-10-styczen-2024", title: "Arkusz 10 — Podroze", summary: "Podroze PHP+SQL", published: true, minutes: 45 },
                    { slug: "egzamin-11-styczen-2024", title: "Arkusz 11 — Terminarz", summary: "Terminarz PHP+SQL", published: true, minutes: 45 },
                    { slug: "egzamin-12-styczen-2024", title: "Arkusz 12 — Fryzjer", summary: "Fryzjer JS+SQL", published: true, minutes: 45 },
                    { slug: "egzamin-01-styczen-2023", title: "Arkusz 01 — Projekt", summary: "Zadanie PHP+SQL", published: true, minutes: 45 },
                    { slug: "egzamin-02-styczen-2023", title: "Arkusz 02 — Projekt", summary: "Zadanie PHP+SQL", published: true, minutes: 45 },
                    { slug: "egzamin-03-styczen-2023", title: "Arkusz 03 — Projekt", summary: "Zadanie PHP+SQL", published: true, minutes: 45 },
                    { slug: "egzamin-04-styczen-2023", title: "Arkusz 04 — Projekt", summary: "Zadanie PHP+SQL", published: true, minutes: 45 },
                    { slug: "egzamin-05-styczen-2023", title: "Arkusz 05 — Projekt", summary: "Zadanie PHP+SQL", published: true, minutes: 45 },



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
    for (const mod of course.modules) {
        const lesson = mod.lessons.find((l) => l.slug === lessonSlug);
        if (lesson) return { course, module: mod, lesson };
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

/** Dane do komponentu ExamPicker — sesje egzaminacyjne INF.03 */
import type { ExamSession } from "@/components/ExamPicker";

export const examSessions: ExamSession[] = [
    {
        year: 2026,
        month: "Styczeń",
        exams: [
            { id: "INF.03-01", title: "Arkusz 01", tech: "php", slug: "egzamin-01-styczen-2026", topic: "Portal samochodowy" },
            { id: "INF.03-02", title: "Arkusz 02", tech: "php", slug: "egzamin-02-styczen-2026", topic: "Portal warzywny" },
            { id: "INF.03-03", title: "Arkusz 03", tech: "js", slug: "egzamin-03-styczen-2026", topic: "Witryna matematyczna" },
            { id: "INF.03-04", title: "Arkusz 04", tech: "php", slug: "egzamin-04-styczen-2026", topic: "Portal maturzystów" },
            { id: "INF.03-05", title: "Arkusz 05", tech: "php", slug: "egzamin-05-styczen-2026", topic: "Portal zgłoszeń wypadków" },
            { id: "INF.03-06", title: "Arkusz 06", tech: "php", slug: "egzamin-06-styczen-2026", topic: "Portal diagnostyki online" },
            { id: "INF.03-07", title: "Arkusz 07", tech: "php", slug: "egzamin-07-styczen-2026", topic: "Stacja meteorologiczna" },
            { id: "INF.03-08", title: "Arkusz 08", tech: "php", slug: "egzamin-08-styczen-2026", topic: "Korona gór polskich" },
            { id: "INF.03-09", title: "Arkusz 09", tech: "php+js", slug: "egzamin-09-styczen-2026", topic: "Salon stylizacji paznokci" },
            { id: "INF.03-10", title: "Arkusz 10", tech: "php", slug: "egzamin-10-styczen-2026", topic: "Blog kulinarny" },
            { id: "INF.03-11", title: "Arkusz 11", tech: "php", slug: "egzamin-11-styczen-2026", topic: "Portal kina" },
            { id: "INF.03-12", title: "Arkusz 12", tech: "php+js", slug: "egzamin-12-styczen-2026", topic: "Studio tatuażu" },
        ],
    },
    { year: 2025, month: "Czerwiec", exams: [
        { id: "INF.03-01-CZ25", title: "Arkusz 01", tech: "php", slug: "egzamin-01-czerwiec-2025", topic: "Gry komputerowe" },
        { id: "INF.03-02-CZ25", title: "Arkusz 02", tech: "php", slug: "egzamin-02-czerwiec-2025", topic: "Notatki" },
        { id: "INF.03-03-CZ25", title: "Arkusz 03", tech: "php", slug: "egzamin-03-czerwiec-2025", topic: "Biblioteka szkolna" },
        { id: "INF.03-04-CZ25", title: "Arkusz 04", tech: "php", slug: "egzamin-04-czerwiec-2025", topic: "Firma przewozowa" },
        { id: "INF.03-05-CZ25", title: "Arkusz 05", tech: "js", slug: "egzamin-05-czerwiec-2025", topic: "Fotografia" },
        { id: "INF.03-06-CZ25", title: "Arkusz 06", tech: "php", slug: "egzamin-06-czerwiec-2025", topic: "Biblioteka" },
        { id: "INF.03-07-CZ25", title: "Arkusz 07", tech: "js", slug: "egzamin-07-czerwiec-2025", topic: "Wyprawy" },
        { id: "INF.03-08-CZ25", title: "Arkusz 08", tech: "js", slug: "egzamin-08-czerwiec-2025", topic: "Smoki" },
        { id: "INF.03-09-CZ25", title: "Arkusz 09", tech: "php", slug: "egzamin-09-czerwiec-2025", topic: "Remonty" },
        { id: "INF.03-10-CZ25", title: "Arkusz 10", tech: "php", slug: "egzamin-10-czerwiec-2025", topic: "Szkolenia" },
        { id: "INF.03-11-CZ25", title: "Arkusz 11", tech: "php", slug: "egzamin-11-czerwiec-2025", topic: "Opony" },
        { id: "INF.03-12-CZ25", title: "Arkusz 12", tech: "php", slug: "egzamin-12-czerwiec-2025", topic: "Medica" },
    ] },
    { year: 2025, month: "Styczeń", exams: [
        { id: "INF.03-01-ST25", title: "Arkusz 01", tech: "js", slug: "egzamin-01-styczen-2025", topic: "Obuwie" },
        { id: "INF.03-02-ST25", title: "Arkusz 02", tech: "js", slug: "egzamin-02-styczen-2025", topic: "Przewozy" },
        { id: "INF.03-03-ST25", title: "Arkusz 03", tech: "php", slug: "egzamin-03-styczen-2025", topic: "Kalendarz" },
        { id: "INF.03-04-ST25", title: "Arkusz 04", tech: "php", slug: "egzamin-04-styczen-2025", topic: "Obuwie" },
        { id: "INF.03-05-ST25", title: "Arkusz 05", tech: "php", slug: "egzamin-05-styczen-2025", topic: "Firma" },
        { id: "INF.03-06-ST25", title: "Arkusz 06", tech: "js", slug: "egzamin-06-styczen-2025", topic: "Szachy" },
        { id: "INF.03-07-ST25", title: "Arkusz 07", tech: "php", slug: "egzamin-07-styczen-2025", topic: "Wykaz" },
        { id: "INF.03-08-ST25", title: "Arkusz 08", tech: "php", slug: "egzamin-08-styczen-2025", topic: "Mieszalnia" },
        { id: "INF.03-09-ST25", title: "Arkusz 09", tech: "php", slug: "egzamin-09-styczen-2025", topic: "Zdobywcy" },
        { id: "INF.03-10-ST25", title: "Arkusz 10", tech: "php", slug: "egzamin-10-styczen-2025", topic: "Szachy" },
        { id: "INF.03-11-ST25", title: "Arkusz 11", tech: "php", slug: "egzamin-11-styczen-2025", topic: "Konkurs" },
        { id: "INF.03-12-ST25", title: "Arkusz 12", tech: "php", slug: "egzamin-12-styczen-2025", topic: "Piekarnia" },
    ] },
    { year: 2024, month: "Czerwiec", exams: [
        { id: "INF.03-01-CZ24", title: "Arkusz 01", tech: "php", slug: "egzamin-01-czerwiec-2024", topic: "Motory" },
        { id: "INF.03-02-CZ24", title: "Arkusz 02", tech: "js", slug: "egzamin-02-czerwiec-2024", topic: "Chat" },
        { id: "INF.03-03-CZ24", title: "Arkusz 03", tech: "php", slug: "egzamin-03-czerwiec-2024", topic: "Rzeki" },
        { id: "INF.03-04-CZ24", title: "Arkusz 04", tech: "php", slug: "egzamin-04-czerwiec-2024", topic: "Galeria" },
        { id: "INF.03-05-CZ24", title: "Arkusz 05", tech: "php", slug: "egzamin-05-czerwiec-2024", topic: "Kupauto" },
        { id: "INF.03-06-CZ24", title: "Arkusz 06", tech: "js", slug: "egzamin-06-czerwiec-2024", topic: "Konferencja" },
        { id: "INF.03-07-CZ24", title: "Arkusz 07", tech: "php", slug: "egzamin-07-czerwiec-2024", topic: "Wazenietirow" },
        { id: "INF.03-08-CZ24", title: "Arkusz 08", tech: "js", slug: "egzamin-08-czerwiec-2024", topic: "Klienci" },
        { id: "INF.03-09-CZ24", title: "Arkusz 09", tech: "js", slug: "egzamin-09-czerwiec-2024", topic: "Wycieczki" },
        { id: "INF.03-10-CZ24", title: "Arkusz 10", tech: "js", slug: "egzamin-10-czerwiec-2024", topic: "Kadra" },
        { id: "INF.03-11-CZ24", title: "Arkusz 11", tech: "php", slug: "egzamin-11-czerwiec-2024", topic: "Hodowla" },
        { id: "INF.03-12-CZ24", title: "Arkusz 12", tech: "js", slug: "egzamin-12-czerwiec-2024", topic: "Projekt" },
    ] },
    { year: 2024, month: "Styczeń", exams: [
        { id: "INF.03-01-ST24", title: "Arkusz 01", tech: "js", slug: "egzamin-01-styczen-2024", topic: "Projekt" },
        { id: "INF.03-02-ST24", title: "Arkusz 02", tech: "js", slug: "egzamin-02-styczen-2024", topic: "Projekt" },
        { id: "INF.03-03-ST24", title: "Arkusz 03", tech: "js", slug: "egzamin-03-styczen-2024", topic: "Projekt" },
        { id: "INF.03-04-ST24", title: "Arkusz 04", tech: "php", slug: "egzamin-04-styczen-2024", topic: "Terminarz" },
        { id: "INF.03-05-ST24", title: "Arkusz 05", tech: "php", slug: "egzamin-05-styczen-2024", topic: "Salon" },
        { id: "INF.03-06-ST24", title: "Arkusz 06", tech: "php", slug: "egzamin-06-styczen-2024", topic: "Podroze" },
        { id: "INF.03-07-ST24", title: "Arkusz 07", tech: "js", slug: "egzamin-07-styczen-2024", topic: "Salon" },
        { id: "INF.03-08-ST24", title: "Arkusz 08", tech: "js", slug: "egzamin-08-styczen-2024", topic: "Fryzjer" },
        { id: "INF.03-09-ST24", title: "Arkusz 09", tech: "js", slug: "egzamin-09-styczen-2024", topic: "Projekt" },
        { id: "INF.03-10-ST24", title: "Arkusz 10", tech: "php", slug: "egzamin-10-styczen-2024", topic: "Podroze" },
        { id: "INF.03-11-ST24", title: "Arkusz 11", tech: "php", slug: "egzamin-11-styczen-2024", topic: "Terminarz" },
        { id: "INF.03-12-ST24", title: "Arkusz 12", tech: "js", slug: "egzamin-12-styczen-2024", topic: "Fryzjer" },
    ] },
    { year: 2023, month: "Styczeń", exams: [
        { id: "INF.03-01-ST23", title: "Arkusz 01", tech: "php", slug: "egzamin-01-styczen-2023", topic: "Projekt" },
        { id: "INF.03-02-ST23", title: "Arkusz 02", tech: "php", slug: "egzamin-02-styczen-2023", topic: "Projekt" },
        { id: "INF.03-03-ST23", title: "Arkusz 03", tech: "php", slug: "egzamin-03-styczen-2023", topic: "Projekt" },
        { id: "INF.03-04-ST23", title: "Arkusz 04", tech: "php", slug: "egzamin-04-styczen-2023", topic: "Projekt" },
        { id: "INF.03-05-ST23", title: "Arkusz 05", tech: "php", slug: "egzamin-05-styczen-2023", topic: "Projekt" },
    ] },
    { year: 2023, month: "Czerwiec", exams: [] },
];
