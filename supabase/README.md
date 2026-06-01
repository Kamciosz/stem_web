# Supabase — baza pytań do quizów

Ten katalog zawiera migracje SQL i dokumentację do bazy pytań
platformy kursów STEM. Quizy losują pytania z bazy, walidacja
odpowiedzi odbywa się po stronie serwera.

## Struktura

- `migrations/0001_quiz_schema.sql` — schemat tabel: `courses`,
  `lessons`, `questions`, `question_options`, `quiz_attempts`.
  Włącza RLS i tworzy widok `public_questions` (anon widzi tylko
  prompt + opcje, NIE poprawne odpowiedzi).
- `migrations/0002_seed_inf03_html.sql` — seed kursu INF.03 i 20
  pytań do lekcji "html-semantyczny".

## Jak uruchomić

1. Otwórz panel Supabase: https://supabase.com/dashboard
2. Wybierz projekt `qunypodqdrhtzpuqgszk` (region EU).
3. **SQL Editor → New query → wklej 0001 → Run.**
4. **New query → wklej 0002 → Run.**
5. **Settings → API → skopiuj:**
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon` / `publishable` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` / `secret` key → `SUPABASE_SERVICE_ROLE_KEY`
6. Dodaj te zmienne w Vercel:
   - Project → Settings → Environment Variables
   - Production + Preview + Development
7. (Opcjonalnie) wykonaj migracje lokalnie przez
   `supabase db push` (wymaga `supabase` CLI i podpiętego projektu).

## Dodawanie nowych pytań

```sql
-- 1) lekcja musi już istnieć w tabeli lessons
-- 2) wstaw pytanie
with q as (
  insert into public.questions
    (course_id, lesson_slug, prompt, correct_index, explanation)
  values
    ('inf-03', 'nowa-lekcja',
     'Treść pytania?',
     0, 'Wyjaśnienie po odpowiedzi.')
  returning id
)
-- 3) wstaw 4 opcje (poprawna ma idx = correct_index)
insert into public.question_options (question_id, idx, label)
select id, 0, 'Opcja A (poprawna)' from q union all
select id, 1, 'Opcja B' from q union all
select id, 2, 'Opcja C' from q union all
select id, 3, 'Opcja D' from q;
```

## Bezpieczeństwo quizu

Architektura jest celowo rozszczelniona: przeglądarka NIGDY nie
widzi poprawnych odpowiedzi.

- `public_questions` (widok) ma tylko `id`, `prompt`, `options`.
  NIE zawiera `correct_index` ani `explanation`.
- RLS włączone: `anon` ma SELECT tylko na aktywne pytania i opcje
  (bez poprawności).
- `service_role` używany TYLKO w route handlers (`/api/quiz/*`)
  do losowania puli, walidacji submit, zapisu prób.
- Walidacja NIGDY nie leci z przeglądarki — submit() idzie do
  serwera, który porównuje z `correct_index` i zwraca feedback.

Blokady frontendowe (visibilitychange / contextmenu / devtools)
są "good faith" — zniechęcają przypadkowe ściąganie, ale NIE
chronią przed kimś z DevTools. Prawdziwa ochrona jest w API.

## Struktury tabel — ściągawka

```
courses (id PK, title, subtitle, badge, intro)
lessons (course_id FK, slug PK, title, summary, minutes, is_published, sort_order)
questions (id PK uuid, course_id FK, lesson_slug, prompt, correct_index, explanation, is_active)
question_options (question_id FK, idx PK, label)
quiz_attempts (id PK uuid, course_id, lesson_slug, quiz_uid, question_ids[], answers jsonb, score, total, started_at, submitted_at)
public_questions (VIEW: id, course_id, lesson_slug, prompt, options[]) — dla anon
```

## Endpointy API

- `GET /api/quiz/[course]/[lesson]/start?limit=5` — losuje N pytań
  z puli, zapisuje attempt, zwraca `attemptId` + pytania (bez
  poprawnych). Cookie `quiz_uid` ustawiane automatycznie.
- `POST /api/quiz/[course]/[lesson]/submit` — body:
  `{ attemptId, answers: { questionId: optionIdx } }`. Zwraca
  `score`, `total`, `results[]` z poprawnym indexem i wyjaśnieniem.
