import { getExamIndex } from "@/lib/exam-index";

const HOST = "stem-web-569q.vercel.app";
const PROTOCOL = "https";

export const dynamic = "force-static";

function escapeXml(s: string): string {
    return s
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&apos;");
}

export async function GET() {
    const entries = getExamIndex();
    const now = new Date().toUTCString();

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>STEM INF.03 — Wszystkie egzaminy</title>
    <link>${PROTOCOL}://${HOST}/egzaminy</link>
    <atom:link href="${PROTOCOL}://${HOST}/feed.xml" rel="self" type="application/rss+xml" />
    <description>54 arkusze egzaminacyjne INF.03 z 6 sesji (styczen 2023 — styczen 2026). Kazdy z 4 etapami nauki: baza danych, HTML/PHP, CSS, kontrola.</description>
    <language>pl-pl</language>
    <lastBuildDate>${now}</lastBuildDate>
    ${entries
        .map(
            (e) => `
    <item>
      <title>${escapeXml(e.title)} (${e.examId})</title>
      <link>${PROTOCOL}://${HOST}${e.basePath}</link>
      <guid isPermaLink="true">${PROTOCOL}://${HOST}${e.basePath}</guid>
      <pubDate>${now}</pubDate>
      <category>${escapeXml(e.session)}</category>
      ${e.technologies.map((t) => `<category>${escapeXml(t)}</category>`).join("")}
      <description>${escapeXml(e.description)}</description>
    </item>`
        )
        .join("")}
  </channel>
</rss>`;

    return new Response(xml, {
        headers: {
            "Content-Type": "application/rss+xml; charset=utf-8",
            "Cache-Control": "public, max-age=3600, s-maxage=86400",
        },
    });
}
