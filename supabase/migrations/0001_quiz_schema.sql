-- =====================================================================
-- Migracja 0001 — schemat quizów: kurs → lekcja → pytanie → opcje
-- =====================================================================
-- KONWENCJA:
--   * id  : slug tekstowy (np. "inf-03", "html-semantyczny") — czytelny w URL i FK
--   * idx : INTEGER porządkowy (opcje w pytaniu, pytania w lekcji)
--   * pytania poprawna odpowiedź (`is_correct`) i wyjaśnienie (`explanation`)
--     są w bazie, ale NIE wystawiane publicznie. Patrz README sekcja
--     "Bezpieczeństwo quizu".
--   * RLS włączone wszędzie; rola `anon` ma SELECT tylko na kolumnach
--     bez `is_correct` (polityka + widok `public_questions`).
--
-- JAK URUCHOMIĆ:
--   1. Panel Supabase → SQL Editor → wklej całość → Run.
--   2. Po wykonaniu schematu: wklej migrację 0002_seed_inf03_html.sql
--      żeby załadować pytania do pierwszej lekcji.
--   Albo lokalnie: supabase db push (po podpięciu CLI).
-- =====================================================================

create extension if not exists "pgcrypto";

-- Tabela kursów ------------------------------------------------------
create table if not exists public.courses (
  id            text primary key,                 -- np. "inf-03"
  title         text not null,
  subtitle      text,
  badge         text not null,                    -- np. "INF.03"
  intro         text,
  created_at    timestamptz not null default now()
);

-- Tabela lekcji ------------------------------------------------------
-- course_id + slug razem identyfikują lekcję, slug = nazwa pliku .mdx
create table if not exists public.lessons (
  course_id     text not null references public.courses(id) on delete cascade,
  slug          text not null,                    -- np. "html-semantyczny"
  title         text not null,
  summary       text,
  minutes       int,
  is_published  boolean not null default false,
  sort_order    int not null default 0,
  created_at    timestamptz not null default now(),
  primary key (course_id, slug)
);

create index if not exists lessons_course_idx
  on public.lessons (course_id, is_published, sort_order);

-- Pula pytań do lekcji ----------------------------------------------
-- Jedna lekcja ma N pytań w puli. Losujemy z nich podczas /api/quiz/start.
create table if not exists public.questions (
  id              uuid primary key default gen_random_uuid(),
  course_id       text not null references public.courses(id) on delete cascade,
  lesson_slug     text not null,
  prompt          text not null,                    -- treść pytania
  -- Index poprawnej opcji (0-based, wskazuje na question_options.idx).
  -- TYLKO service_role ma prawo to czytać (patrz widok public_questions
  -- oraz polityka RLS niżej).
  correct_index   int  not null check (correct_index >= 0),
  explanation     text,                             -- wyjaśnienie po odpowiedzi
  is_active       boolean not null default true,    -- wyłączone nie wchodzą do puli
  created_at      timestamptz not null default now(),
  foreign key (course_id, lesson_slug)
    references public.lessons (course_id, slug) on delete cascade
);

create index if not exists questions_pool_idx
  on public.questions (course_id, lesson_slug, is_active);

-- Opcje odpowiedzi ---------------------------------------------------
-- correct_index: 0-based index poprawnej opcji.
-- Trzymany RAZEM z pytaniem żeby submit() mógł zweryfikować po stronie serwera.
create table if not exists public.question_options (
  question_id   uuid not null references public.questions(id) on delete cascade,
  idx           int  not null,                    -- 0,1,2,3 — kolejność wyświetlania
  label         text not null,                    -- treść opcji
  primary key (question_id, idx)
);

-- Próby podejścia do quizu -------------------------------------------
-- Służy do: (a) limitowania powtórzeń, (b) audytu, (c) statystyk.
-- Bez logowania userów — identyfikujemy po ciasteczku quiz_uid (anon,
-- losowy UUID z HttpOnly cookie na czas sesji quizu).
create table if not exists public.quiz_attempts (
  id            uuid primary key default gen_random_uuid(),
  course_id     text not null,
  lesson_slug   text not null,
  quiz_uid      text not null,                    -- anon id z cookie
  question_ids  uuid[] not null,                  -- które pytania wylosowane
  answers       jsonb not null,                   -- {questionId: chosenIndex}
  score         int,                              -- wypełniane przy submit()
  total         int,
  started_at    timestamptz not null default now(),
  submitted_at  timestamptz,
  foreign key (course_id, lesson_slug)
    references public.lessons (course_id, slug) on delete cascade
);

create index if not exists attempts_user_idx
  on public.quiz_attempts (quiz_uid, course_id, lesson_slug, started_at desc);

-- =====================================================================
-- WIDOK PUBLICZNY — co widzi anon (przeglądarka)
-- =====================================================================
-- Anon nie ma prawa widzieć correct_index ani explanation. Ten widok
-- filtruje kolumny; endpoint /api/quiz/start korzysta z klienta anon
-- (z RLS) i czyta TYLKO ten widok.
create or replace view public.public_questions
with (security_invoker = true) as
  select
    q.id,
    q.course_id,
    q.lesson_slug,
    q.prompt,
    jsonb_agg(
      jsonb_build_object('idx', o.idx, 'label', o.label)
      order by o.idx
    ) as options
  from public.questions q
  join public.question_options o on o.question_id = q.id
  where q.is_active = true
  group by q.id, q.course_id, q.lesson_slug, q.prompt;

-- =====================================================================
-- ROW LEVEL SECURITY
-- =====================================================================
alter table public.courses            enable row level security;
alter table public.lessons            enable row level security;
alter table public.questions          enable row level security;
alter table public.question_options   enable row level security;
alter table public.quiz_attempts      enable row level security;

-- Polityka: wszyscy (również anon) mogą czytać kursy, lekcje, pytania.
-- Zapis ma TYLKO service_role (bypass RLS) — używane przez route handlery.
drop policy if exists "courses read all"      on public.courses;
create policy "courses read all" on public.courses
  for select using (true);

drop policy if exists "lessons read all"     on public.lessons;
create policy "lessons read all" on public.lessons
  for select using (true);

drop policy if exists "questions read active" on public.questions;
create policy "questions read active" on public.questions
  for select using (is_active = true);

-- ---------------------------------------------------------------------
-- KOLUMNOWE GRANTY na questions — obrona przed wyciekiem correct_index.
-- ---------------------------------------------------------------------
-- UWAGA KRYTYCZNA: RLS w Postgresie filtruje WIERSZE, nie KOLUMNY.
-- Domyślny grant Supabase (GRANT SELECT ON ALL TABLES ... TO anon)
-- daje anonowi SELECT na CAŁEJ tabeli questions. Sama polityka RLS
-- "questions read active" przepuszcza wszystkie aktywne wiersze ze
-- WSZYSTKIMI kolumnami — łącznie z correct_index (klucz odpowiedzi)
-- i explanation. Anon key jest publiczny (ląduje w bundlu przeglądarki),
-- więc bez tej sekcji każdy mógłby zrobić:
--    GET /rest/v1/questions?select=prompt,correct_index&is_active=eq.true
-- i wyciągnąć cały klucz odpowiedzi, omijając widok public_questions.
--
-- Cofamy table-wide grant i przyznajemy SELECT TYLKO na bezpiecznych
-- kolumnach. Widok public_questions (security_invoker = true) działa
-- dalej, bo dotyka wyłącznie tych kolumn. Bezpośredni
-- select=correct_index zwróci anonowi "permission denied for column".
revoke select on public.questions from anon, authenticated;
grant select (id, course_id, lesson_slug, prompt, is_active, created_at)
  on public.questions to anon, authenticated;

drop policy if exists "options read all"     on public.question_options;
create policy "options read all" on public.question_options
  for select using (true);

-- Próby: anon NIE widzi cudzych prób; insert/update przez service_role.
drop policy if exists "attempts no anon read" on public.quiz_attempts;
create policy "attempts no anon read" on public.quiz_attempts
  for select using (false);

-- WIDOK public_questions jest dostępny dla anon (dziedziczy RLS z bazowych tabel).
grant select on public.public_questions to anon, authenticated;

-- =====================================================================
-- KONIEC MIGRACJI 0001
-- =====================================================================
