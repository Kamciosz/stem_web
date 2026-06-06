import type { Metadata } from "next";
import { getExamIndex } from "@/lib/exam-index";
import { ExamGrid } from "@/components/courses/examflow/ExamGrid";
import { RecentlyVisited } from "@/components/courses/examflow/RecentlyVisited";

export const dynamic = "force-static";

const baseUrl = "https://stem-web-569q.vercel.app";
const url = `${baseUrl}/egzaminy`;

export const metadata: Metadata = {
    title: "Wszystkie egzaminy INF.03 — STEM",
    description:
        "54 arkusze egzaminacyjne INF.03 z sesji 2023-2026. Filtruj po technologii, sesji, statusie. SQL, PHP, JavaScript, HTML, CSS — kompletny przeglad.",
    alternates: { canonical: url },
    openGraph: {
        title: "Wszystkie egzaminy INF.03 — STEM",
        description: "54 arkusze z 6 sesji (2023-2026). Filtruj i przegladaj.",
        url,
        siteName: "STEM",
        locale: "pl_PL",
        type: "website",
    },
};

export default function EgzaminyPage() {
    const entries = getExamIndex();
    return (
        <article className="egzaminy-page section-shell">
            <div className="section-inner egzaminy-container">
                <header className="egzaminy-header">
                    <p className="egzaminy-eyebrow">54 arkuszy · 6 sesji</p>
                    <h1 className="egzaminy-title">Wszystkie egzaminy INF.03</h1>
                    <p className="egzaminy-lead">
                        Przegladaj i filtruj arkusze. Kazdy ma 4 etapy: baza danych, HTML/PHP, CSS,
                        kontrola. Status Twojego progresu zapisywany jest lokalnie.
                    </p>
                </header>
                <ExamGrid entries={entries} />
                <RecentlyVisited />
            </div>
        </article>
    );
}
