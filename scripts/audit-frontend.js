#!/usr/bin/env node
/* eslint-disable */
/**
 * Audyt frontendu STEM web — odpalany przed pushem.
 *
 *   npm run audit:frontend
 *
 * Wymaga dzialajacego serwera (domyslnie http://localhost:3000).
 * Ustaw inny URL przez AUDIT_BASE_URL=https://... npm run audit:frontend
 *
 * Sprawdza dla kazdej trasy:
 *  - HTTP 200
 *  - brak runtime errorow Reacta / pageerror / "This page couldn't load"
 *  - brak poziomego overflow
 *  - dokladnie jeden <h1>, h1 pierwszy w kolejnosci naglowkow
 *  - wszystkie widoczne <a>/<button> >= 44px wysokosci (desktop + mobile)
 *  - brak <img> bez atrybutu alt
 *  - brak widocznych placeholder-obrazow (src zawiera "placeholder")
 *  - obecnosc JSON-LD (lekcje/egzaminy/quizy)
 *
 * Zwraca exit code 1 gdy wykryje blad — nadaje sie do CI / pre-push hooka.
 */

const PLAYWRIGHT_PATH = "/opt/homebrew/lib/node_modules/playwright";
let chromium;
try {
    ({ chromium } = require(PLAYWRIGHT_PATH));
} catch {
    try {
        ({ chromium } = require("playwright"));
    } catch {
        console.error("BLAD: brak modulu playwright. Zainstaluj: npm i -D playwright albo globalnie.");
        process.exit(2);
    }
}

const BASE = process.env.AUDIT_BASE_URL || "http://localhost:3000";

// Trasy do audytu. Dodawaj nowe wedle potrzeby.
const ROUTES = [
    { path: "/", jsonLd: false },
    { path: "/kursy", jsonLd: false },
    { path: "/kursy/inf-03", jsonLd: true },
    { path: "/egzaminy", jsonLd: false },
    { path: "/progres", jsonLd: false },
    { path: "/projekty", jsonLd: false },
    { path: "/zespol", jsonLd: false },
    { path: "/kursy/inf-03/html-semantyczny", jsonLd: true },
    { path: "/kursy/inf-03/html-semantyczny/quiz", jsonLd: true },
    { path: "/kursy/inf-03/egzamin-01-styczen-2026", jsonLd: true },
];

const VIEWPORTS = [
    { name: "desktop", width: 1440, height: 900 },
    { name: "mobile", width: 390, height: 844 },
];

// Elementy ktore swiadomie sa mniejsze niz 44px (ikonowe w naglowku, inline zargon w tekscie).
// .term-trigger to inline slowo w zdaniu z definicja (WCAG 2.5.5 wyjatek "inline").
const TOUCH_TARGET_ALLOWLIST = ["course-nav-collapse-toggle", "term-trigger"];

async function auditRoute(browser, route) {
    const problems = [];

    for (const vp of VIEWPORTS) {
        const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
        const runtimeErrors = [];
        page.on("pageerror", (e) => runtimeErrors.push(e.message));
        page.on("console", (m) => {
            if (m.type() === "error") runtimeErrors.push(m.text());
        });

        let status = 0;
        try {
            const resp = await page.goto(BASE + route.path, { waitUntil: "domcontentloaded", timeout: 30000 });
            status = resp ? resp.status() : 0;
            await page.waitForTimeout(900);
        } catch (e) {
            problems.push(`[${vp.name}] goto error: ${e.message.slice(0, 60)}`);
            await page.close();
            continue;
        }

        if (status !== 200) problems.push(`[${vp.name}] HTTP ${status} (oczekiwano 200)`);

        const crashSignals = runtimeErrors.filter((e) =>
            /update depth|getServerSnapshot|infinite loop|couldn.t load|Maximum update/i.test(e)
        );
        if (crashSignals.length) problems.push(`[${vp.name}] RUNTIME CRASH: ${crashSignals[0].slice(0, 70)}`);
        if (runtimeErrors.length) problems.push(`[${vp.name}] ${runtimeErrors.length} bledow konsoli/pageerror`);

        const metrics = await page.evaluate((allowlist) => {
            const res = { overflow: false, h1Count: 0, h1First: true, smallTargets: [], noAlt: 0, placeholderImg: 0, headingsBeforeH1: [] };
            res.overflow = document.documentElement.scrollWidth > window.innerWidth + 1;

            const headings = [...document.querySelectorAll("h1,h2,h3,h4,h5,h6")];
            res.h1Count = headings.filter((h) => h.tagName === "H1").length;
            const firstH1 = headings.findIndex((h) => h.tagName === "H1");
            res.h1First = firstH1 <= 0;
            if (firstH1 > 0) res.headingsBeforeH1 = headings.slice(0, firstH1).map((h) => h.tagName);

            for (const el of document.querySelectorAll("a, button")) {
                const r = el.getBoundingClientRect();
                if (r.width === 0 || r.height === 0) continue;
                const s = getComputedStyle(el);
                if (s.display === "none" || s.visibility === "hidden") continue;
                // pomijamy elementy poza ekranem (chowane menu)
                if (r.right < 0 || r.left > window.innerWidth) continue;
                const cls = el.className.toString();
                if (allowlist.some((a) => cls.includes(a))) continue;
                if (r.height < 44) {
                    res.smallTargets.push({ t: (el.textContent || "").trim().slice(0, 16), h: Math.round(r.height), cls: cls.split(" ")[0] });
                }
            }

            for (const img of document.querySelectorAll("img")) {
                if (!img.hasAttribute("alt")) res.noAlt++;
                if ((img.getAttribute("src") || "").includes("placeholder")) {
                    const r = img.getBoundingClientRect();
                    if (r.width > 0 && r.height > 0) res.placeholderImg++;
                }
            }
            return res;
        }, TOUCH_TARGET_ALLOWLIST);

        if (metrics.overflow) problems.push(`[${vp.name}] poziomy overflow`);
        if (metrics.h1Count !== 1) problems.push(`[${vp.name}] H1 count = ${metrics.h1Count} (oczekiwano 1)`);
        if (!metrics.h1First) problems.push(`[${vp.name}] H1 nie jest pierwszym naglowkiem (przed nim: ${metrics.headingsBeforeH1.join(",")})`);
        if (metrics.smallTargets.length) {
            const uniq = [...new Map(metrics.smallTargets.map((s) => [s.cls + s.t, s])).values()];
            problems.push(`[${vp.name}] ${metrics.smallTargets.length} touch target <44px: ${uniq.slice(0, 4).map((s) => `${s.h}px .${s.cls}`).join(", ")}`);
        }
        if (metrics.noAlt) problems.push(`[${vp.name}] ${metrics.noAlt} <img> bez alt`);
        if (metrics.placeholderImg) problems.push(`[${vp.name}] ${metrics.placeholderImg} widocznych placeholder-obrazow`);

        // JSON-LD tylko raz (desktop)
        if (route.jsonLd && vp.name === "desktop") {
            const hasLd = await page.evaluate(() => {
                const scripts = [...document.querySelectorAll('script[type="application/ld+json"]')];
                return scripts.some((s) => /LearningResource|Course/.test(s.textContent || ""));
            });
            if (!hasLd) problems.push(`[desktop] brak JSON-LD LearningResource/Course`);
        }

        await page.close();
    }

    return problems;
}

(async () => {
    console.log(`\nAudyt frontendu STEM — ${BASE}\n${"=".repeat(50)}`);
    const browser = await chromium.launch();
    let totalProblems = 0;

    for (const route of ROUTES) {
        const problems = await auditRoute(browser, route);
        if (problems.length === 0) {
            console.log(`✓ ${route.path}`);
        } else {
            totalProblems += problems.length;
            console.log(`✗ ${route.path}`);
            problems.forEach((p) => console.log(`    ${p}`));
        }
    }

    await browser.close();
    console.log("=".repeat(50));
    if (totalProblems === 0) {
        console.log("OK — frontend czysty.\n");
        process.exit(0);
    } else {
        console.log(`WYKRYTO ${totalProblems} problemow. Napraw przed pushem.\n`);
        process.exit(1);
    }
})();
