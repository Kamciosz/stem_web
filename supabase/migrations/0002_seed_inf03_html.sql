-- =====================================================================
-- Migracja 0002 — seed kursu INF.03 + pytania do lekcji HTML semantyczny
-- =====================================================================
-- Uruchom PO 0001_quiz_schema.sql.
-- Wrzuca kurs, lekcję i 20 pytań z prawdziwymi opcjami A/B/C/D do puli.
-- Quiz losuje 5 z tej puli.
--
-- PAMIĘTAJ: ten seed idzie do SUWBAZE z service_role (dane wrażliwe —
-- poprawne odpowiedzi). Anon NIGDY nie zobaczy tych danych (RLS).
-- =====================================================================

insert into public.courses (id, title, subtitle, badge, intro) values
  ('inf-03', 'Przygotowanie do egzaminu INF.03',
   'Tworzenie i administrowanie stron, aplikacji i baz danych',
   'INF.03',
   'Materiały od podstaw do egzaminu zawodowego INF.03.')
on conflict (id) do nothing;

insert into public.lessons (course_id, slug, title, summary, minutes, is_published, sort_order) values
  ('inf-03', 'html-semantyczny', 'HTML semantyczny',
   'Znaczniki opisujące strukturę strony zamiast neutralnych div-ów.', 12, true, 1)
on conflict (course_id, slug) do nothing;

-- =====================================================================
-- Pula 20 pytań. Każde pytanie wstawiamy w bloku z 4 opcjami.
-- Wzorzec: z CTE wstawiamy pytanie, zwracamy id, w UNION ALL wstawiamy
-- opcje powiązane tym id.
-- =====================================================================

-- 1
with q as (
  insert into public.questions (course_id, lesson_slug, prompt, correct_index, explanation) values
  ('inf-03', 'html-semantyczny',
   'Który znacznik powinien zawierać główną, unikalną treść strony?',
   1, '<main> oznacza główną treść strony i powinien wystąpić tylko raz.')
  returning id
)
insert into public.question_options (question_id, idx, label)
select id, 0, '<section>' from q union all
select id, 1, '<main>' from q union all
select id, 2, '<div>' from q union all
select id, 3, '<article>' from q;

-- 2
with q as (
  insert into public.questions (course_id, lesson_slug, prompt, correct_index, explanation) values
  ('inf-03', 'html-semantyczny',
   'Czym różni się <article> od <section>?',
   1, '<article> ma sens samodzielnie (wpis, komentarz), <section> grupuje tematycznie powiązaną treść.')
  returning id
)
insert into public.question_options (question_id, idx, label)
select id, 0, 'Niczym, to synonimy' from q union all
select id, 1, '<article> to samodzielna treść mająca sens w oderwaniu, <section> to tematyczny fragment większej całości' from q union all
select id, 2, '<section> jest tylko do nagłówków' from q union all
select id, 3, '<article> nie może mieć nagłówka' from q;

-- 3
with q as (
  insert into public.questions (course_id, lesson_slug, prompt, correct_index, explanation) values
  ('inf-03', 'html-semantyczny',
   'Ile znaczników <h1> powinno być na jednej stronie?',
   0, 'Jeden <h1> wyznacza główny temat strony.')
  returning id
)
insert into public.question_options (question_id, idx, label)
select id, 0, 'Dokładnie jeden' from q union all
select id, 1, 'Co najmniej trzy' from q union all
select id, 2, 'Dowolnie wiele' from q union all
select id, 3, 'Żadnego' from q;

-- 4
with q as (
  insert into public.questions (course_id, lesson_slug, prompt, correct_index, explanation) values
  ('inf-03', 'html-semantyczny',
   'Po co stosować znaczniki semantyczne zamiast samych <div>?',
   1, 'Semantyka opisuje znaczenie treści maszynom — lepsze SEO i dostępność.')
  returning id
)
insert into public.question_options (question_id, idx, label)
select id, 0, 'Strona ładuje się szybciej' from q union all
select id, 1, 'Dają lepsze pozycjonowanie w wyszukiwarkach i dostępność dla czytników ekranu' from q union all
select id, 2, 'Są wymagane przez przeglądarki' from q union all
select id, 3, 'Automatycznie stylują stronę' from q;

-- 5
with q as (
  insert into public.questions (course_id, lesson_slug, prompt, correct_index, explanation) values
  ('inf-03', 'html-semantyczny',
   'Który znacznik najlepiej pasuje do bloku nawigacji z linkami do podstron?',
   2, '<nav> oznacza blok nawigacji.')
  returning id
)
insert into public.question_options (question_id, idx, label)
select id, 0, '<aside>' from q union all
select id, 1, '<header>' from q union all
select id, 2, '<nav>' from q union all
select id, 3, '<menu>' from q;

-- 6
with q as (
  insert into public.questions (course_id, lesson_slug, prompt, correct_index, explanation) values
  ('inf-03', 'html-semantyczny',
   'Gdzie powinien znaleźć się znacznik <footer>?',
   3, '<footer> może być na końcu strony lub na końcu sekcji/artykułu.')
  returning id
)
insert into public.question_options (question_id, idx, label)
select id, 0, 'Tylko na końcu strony' from q union all
select id, 1, 'Wewnątrz <head>' from q union all
select id, 2, 'Przed <body>' from q union all
select id, 3, 'Na końcu strony lub na końcu sekcji/artykułu' from q;

-- 7
with q as (
  insert into public.questions (course_id, lesson_slug, prompt, correct_index, explanation) values
  ('inf-03', 'html-semantyczny',
   'Co oznacza atrybut lang="pl" w znaczniku <html>?',
   1, 'Informuje przeglądarkę i czytnik ekranu, że treść strony jest po polsku.')
  returning id
)
insert into public.question_options (question_id, idx, label)
select id, 0, 'Zmienia krój czcionki na polski' from q union all
select id, 1, 'Informuje, że treść jest po polsku (np. dla czytnika ekranu)' from q union all
select id, 2, 'Wymusza polskie tłumaczenie strony' from q union all
select id, 3, 'Dodaje polską walutę do sklepu' from q;

-- 8
with q as (
  insert into public.questions (course_id, lesson_slug, prompt, correct_index, explanation) values
  ('inf-03', 'html-semantyczny',
   'Który znacznik jest NAJLEPSZY dla samodzielnego wpisu na blogu?',
   0, '<article> reprezentuje samodzielną treść, którą można udostępnić.')
  returning id
)
insert into public.question_options (question_id, idx, label)
select id, 0, '<article>' from q union all
select id, 1, '<section>' from q union all
select id, 2, '<div>' from q union all
select id, 3, '<aside>' from q;

-- 9
with q as (
  insert into public.questions (course_id, lesson_slug, prompt, correct_index, explanation) values
  ('inf-03', 'html-semantyczny',
   'Czy <section> MUSI mieć nagłówek (h1–h6)?',
   1, 'Dostępnościowo <section> powinien mieć nagłówek.')
  returning id
)
insert into public.question_options (question_id, idx, label)
select id, 0, 'Nie, to opcjonalne' from q union all
select id, 1, 'Powinien, bo inaczej lepiej użyć <div> lub <article>' from q union all
select id, 2, 'Tylko gdy jest pusty' from q union all
select id, 3, 'Tylko w HTML4' from q;

-- 10
with q as (
  insert into public.questions (course_id, lesson_slug, prompt, correct_index, explanation) values
  ('inf-03', 'html-semantyczny',
   'Co to jest <aside>?',
   2, '<aside> to treść poboczna, powiązana tematycznie, ale nie kluczowa.')
  returning id
)
insert into public.question_options (question_id, idx, label)
select id, 0, 'Główna treść strony' from q union all
select id, 1, 'Nagłówek strony' from q union all
select id, 2, 'Treść poboczna, np. panel "Powiązane artykuły"' from q union all
select id, 3, 'Nawigacja dolna' from q;

-- 11
with q as (
  insert into public.questions (course_id, lesson_slug, prompt, correct_index, explanation) values
  ('inf-03', 'html-semantyczny',
   'Który z tych znaczników jest semantyczny?',
   2, '<nav> opisuje rolę bloku — to semantyka.')
  returning id
)
insert into public.question_options (question_id, idx, label)
select id, 0, '<div>' from q union all
select id, 1, '<span>' from q union all
select id, 2, '<nav>' from q union all
select id, 3, '<b>' from q;

-- 12
with q as (
  insert into public.questions (course_id, lesson_slug, prompt, correct_index, explanation) values
  ('inf-03', 'html-semantyczny',
   'Dlaczego hierarchia h1 → h2 → h3 jest ważna?',
   2, 'Czytnik ekranu buduje z nagłówków "spis treści" strony i pozwala po nich skakać.')
  returning id
)
insert into public.question_options (question_id, idx, label)
select id, 0, 'Chodzi o estetykę strony' from q union all
select id, 1, 'Bo Google nie czyta innych znaczników' from q union all
select id, 2, 'Czytniki ekranu budują z nagłówków spis treści strony' from q union all
select id, 3, 'Taki wymóg ma CSS' from q;

-- 13
with q as (
  insert into public.questions (course_id, lesson_slug, prompt, correct_index, explanation) values
  ('inf-03', 'html-semantyczny',
   'Czy <div> jest przestarzały?',
   0, 'Nie — <div> jest poprawny, ale służy do grupowania bez znaczenia.')
  returning id
)
insert into public.question_options (question_id, idx, label)
select id, 0, 'Nie, ale do grupowania bez znaczenia — gdy blok ma rolę, użyj znacznika semantycznego' from q union all
select id, 1, 'Tak, wycofano go w HTML5' from q union all
select id, 2, 'Tak, działa tylko w starych przeglądarkach' from q union all
select id, 3, 'Tak, bo lepiej używać <span>' from q;

-- 14
with q as (
  insert into public.questions (course_id, lesson_slug, prompt, correct_index, explanation) values
  ('inf-03', 'html-semantyczny',
   'Który znacznik NIE jest semantyczny?',
   3, '<div> nie ma wbudowanego znaczenia — to pojemnik ogólnego przeznaczenia.')
  returning id
)
insert into public.question_options (question_id, idx, label)
select id, 0, '<nav>' from q union all
select id, 1, '<article>' from q union all
select id, 2, '<main>' from q union all
select id, 3, '<div>' from q;

-- 15
with q as (
  insert into public.questions (course_id, lesson_slug, prompt, correct_index, explanation) values
  ('inf-03', 'html-semantyczny',
   'Czy <header> może wystąpić więcej niż raz?',
   1, 'Tak — <header> może być w <body> i w każdym <article>/<section>.')
  returning id
)
insert into public.question_options (question_id, idx, label)
select id, 0, 'Nie, tylko raz' from q union all
select id, 1, 'Tak — w <body> i w każdym <article>/<section>' from q union all
select id, 2, 'Tylko dwa razy' from q union all
select id, 3, 'Tylko gdy jest w <main>' from q;

-- 16
with q as (
  insert into public.questions (course_id, lesson_slug, prompt, correct_index, explanation) values
  ('inf-03', 'html-semantyczny',
   'Co jest NAJLEPSZE dla stałego menu górnego z logotypem?',
   0, '<header> + <nav> wewnątrz to klasyczny wzorzec.')
  returning id
)
insert into public.question_options (question_id, idx, label)
select id, 0, '<header> zawierający <nav>' from q union all
select id, 1, '<div> z klasą "menu"' from q union all
select id, 2, '<aside> na górze' from q union all
select id, 3, '<main> z linkami' from q;

-- 17
with q as (
  insert into public.questions (course_id, lesson_slug, prompt, correct_index, explanation) values
  ('inf-03', 'html-semantyczny',
   'Który znacznik jest blokiem powiązanej treści obok głównej?',
   2, '<aside> to treść poboczna obok głównej.')
  returning id
)
insert into public.question_options (question_id, idx, label)
select id, 0, '<article>' from q union all
select id, 1, '<section>' from q union all
select id, 2, '<aside>' from q union all
select id, 3, '<footer>' from q;

-- 18
with q as (
  insert into public.questions (course_id, lesson_slug, prompt, correct_index, explanation) values
  ('inf-03', 'html-semantyczny',
   'Czy do SZUKANIA w googlach ważna jest semantyka?',
   0, 'Tak — Google traktuje <main>, <article>, <h1> jako sygnały ważności.')
  returning id
)
insert into public.question_options (question_id, idx, label)
select id, 0, 'Tak — Google lepiej indeksuje treść w <main>, <article>, <h1>' from q union all
select id, 1, 'Nie, Google czyta tylko tekst' from q union all
select id, 2, 'Nie, liczy się tylko PageRank' from q union all
select id, 3, 'Tylko dla obrazków' from q;

-- 19
with q as (
  insert into public.questions (course_id, lesson_slug, prompt, correct_index, explanation) values
  ('inf-03', 'html-semantyczny',
   'Co oznacza "landmarks" w HTML5?',
   2, 'Punkty orientacyjne: header/nav/main/aside/footer.')
  returning id
)
insert into public.question_options (question_id, idx, label)
select id, 0, 'Stare atrybuty HTML4' from q union all
select id, 1, 'Klasy CSS do stylowania' from q union all
select id, 2, 'Punkty orientacyjne strony — header/nav/main/aside/footer' from q union all
select id, 3, 'Znaczniki do audio' from q;

-- 20
with q as (
  insert into public.questions (course_id, lesson_slug, prompt, correct_index, explanation) values
  ('inf-03', 'html-semantyczny',
   'Który zestaw znaczników to POPRAWNY szkielet dokumentu?',
   0, 'header + nav + main + footer to kanon HTML5.')
  returning id
)
insert into public.question_options (question_id, idx, label)
select id, 0, '<header><nav>...</nav></header><main>...</main><footer>...</footer>' from q union all
select id, 1, '<body><div class="all">...</div></body>' from q union all
select id, 2, '<html><menu><main></main></menu></html>' from q union all
select id, 3, '<head><article></article></head>' from q;
