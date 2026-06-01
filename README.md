# Strona Kólka Technologicznego (MVP)

Implementacja startowa oparta o Next.js 16 (App Router) i TypeScript.

## Zakres aktualnie wdrozony

- Strona glowna z sekcja hero i wyroznionymi projektami.
- Lista projektow pod `/projects`.
- Strony dynamiczne: `/project/[slug]`, `/profile/[slug]`, `/group/[slug]`.
- Wstepny panel opiekuna pod `/adminpanel` z ochrona sesja.
- Logowanie panelu przez endpoint `/api/admin/session` i cookie HTTP-only.
- Bezpieczne naglowki HTTP w konfiguracji Next.js.

## Uruchomienie lokalne

1. Zainstaluj zaleznosci:

```bash
npm install
```

2. Skopiuj env i ustaw token admina:

```bash
cp .env.example .env.local
```

3. Uruchom serwer deweloperski:

```bash
npm run dev
```

4. Otworz `http://localhost:3000`.

## Wymagane zmienne srodowiskowe

- `NEXT_PUBLIC_SITE_URL` - publiczny URL aplikacji (lokalnie `http://localhost:3000`).
- `ADMIN_PANEL_TOKEN` - silny token dostepu do panelu admin.

## Bezpieczenstwo (aktualny baseline)

- Panel admin nie jest publicznie dostepny bez sesji.
- Sesja admin jest trzymana w cookie `httpOnly`.
- Ustawione naglowki: `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, `Content-Security-Policy`.

## Weryfikacja

```bash
npm run lint
npm run build
```

Oba polecenia przechodza poprawnie w aktualnym stanie repozytorium.
