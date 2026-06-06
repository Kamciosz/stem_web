import { NextResponse } from "next/server";
import { getExamIndex } from "@/lib/exam-index";
import { promises as fs } from "fs";
import path from "path";

export const dynamic = "force-dynamic";

/**
 * Reczne resubmit URL-i do IndexNow. Klucz z .env (INDEXNOW_KEY).
 * Body opcjonalne: { urls?: string[] } - jesli brak, wysyla wszystkie z sitemap + exam index.
 */
export async function POST(req: Request) {
    const KEY = process.env.INDEXNOW_KEY;
    if (!KEY) {
        return NextResponse.json(
            { error: "INDEXNOW_KEY nie ustawiony w .env" },
            { status: 500 }
        );
    }

    let urls: string[] = [];
    try {
        const body = await req.json();
        if (Array.isArray(body.urls)) urls = body.urls;
    } catch {
        // brak body - uzyj wszystkich
    }

    if (urls.length === 0) {
        // Zbierz wszystkie URL ze sitemap + exam index
        const baseUrl = "https://stem-web-569q.vercel.app";
        try {
            const sitemap = await fs.readFile(
                path.join(process.cwd(), ".next/server/app/sitemap.xml.body"),
                "utf-8"
            );
            urls = Array.from(
                sitemap.matchAll(/https:\/\/[^<]+/g),
                (m) => m[0]
            );
        } catch {
            // Fallback: exam index
            const entries = getExamIndex();
            urls = entries.map((e) => `${baseUrl}${e.basePath}`);
        }
    }

    if (urls.length > 10000) urls = urls.slice(0, 10000);

    const body = {
        host: "stem-web-569q.vercel.app",
        key: KEY,
        urlList: urls,
    };

    const r = await fetch("https://api.indexnow.org/indexnow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    });

    const text = await r.text();
    return NextResponse.json({
        submitted: urls.length,
        status: r.status,
        response: text,
    });
}
