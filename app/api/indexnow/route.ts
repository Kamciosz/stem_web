import { NextResponse } from "next/server";
import { getExamIndex } from "@/lib/exam-index";
import { promises as fs } from "fs";
import path from "path";

export const dynamic = "force-dynamic";

/**
 * Reczne resubmit URL-i do IndexNow.
 * Klucz z body (POST) lub z env INDEXNOW_KEY.
 * Body: { urls?: string[], key?: string }
 */

const DEFAULT_KEY = "ac4965d26d4fc3a5b819f99c640cec75";
const HOST = "stem-web-569q.vercel.app";

export async function POST(req: Request) {
    let urls: string[] = [];
    let key = process.env.INDEXNOW_KEY || DEFAULT_KEY;

    try {
        const body = await req.json();
        if (Array.isArray(body.urls)) urls = body.urls;
        if (typeof body.key === "string" && body.key.length > 0) key = body.key;
    } catch {
        // brak body
    }

    if (urls.length === 0) {
        // Fallback: wszystkie URL ze sitemap (build-time) + exam index
        const baseUrl = `https://${HOST}`;
        try {
            const sitemap = await fs.readFile(
                path.join(process.cwd(), ".next/server/app/sitemap.xml.body"),
                "utf-8"
            );
            urls = Array.from(sitemap.matchAll(/https:\/\/[^<]+/g), (m) => m[0]);
        } catch {
            const entries = getExamIndex();
            urls = entries.map((e) => `${baseUrl}${e.basePath}`);
            urls.push(
                `${baseUrl}`,
                `${baseUrl}/kursy`,
                `${baseUrl}/kursy/inf-03`,
                `${baseUrl}/progres`,
                `${baseUrl}/projekty`,
                `${baseUrl}/zespol`,
                `${baseUrl}/partnerzy`,
                `${baseUrl}/kontakt`
            );
        }
    }

    if (urls.length > 10000) urls = urls.slice(0, 10000);

    const body = { host: HOST, key, urlList: urls };

    const r = await fetch("https://api.indexnow.org/indexnow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    });

    const text = await r.text();
    return NextResponse.json({
        submitted: urls.length,
        key: `${key.slice(0, 8)}...`,
        status: r.status,
        indexnowResponse: text,
    });
}

export async function GET() {
    return NextResponse.json({
        usage: "POST { urls?: string[], key?: string }",
        defaultKey: `${DEFAULT_KEY.slice(0, 8)}...`,
    });
}
