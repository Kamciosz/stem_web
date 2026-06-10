import type { Metadata } from "next";
import { getExamIndexSorted } from "@/lib/exam-index";
import { ExamGrid } from "@/components/courses/examflow/ExamGrid";
import { RecentlyVisited } from "@/components/courses/examflow/RecentlyVisited";
import { RandomExamButton } from "@/components/courses/examflow/RandomExamButton";

export const dynamic = "force-static";

const baseUrl = "https://stem-web-569q.vercel.app";
const url = `${baseUrl}/egzaminy`;

export const metadata: Metadata = {
    title: "Wszystkie egzaminy INF.03 — STEM",
    description:
        "Arkusze egzaminacyjne INF.03 z sesji 2023-2026. Filtruj po technologii, sesji, statusie. SQL, PHP, JavaScript, HTML, CSS — kompletny przeglad.",
    alternates: { canonical: url },
    openGraph: {
        title: "Wszystkie egzaminy INF.03 — STEM",
        description: "Arkusze INF.03 z sesji 2023-2026. Filtruj i przegladaj.",
        url,
        siteName: "STEM",
        locale: "pl_PL",
        type: "website",
    },
};

export default function EgzaminyPage() {
    const entries = getExamIndexSorted();
    return (
        <article className="egzaminy-page section-shell">
            <div className="section-inner egzaminy-container">
                <header className="egzaminy-header">
                    <p className="egzaminy-eyebrow">{entries.length} arkuszy · INF.03</p>
                    <h1 className="egzaminy-title">Wszystkie egzaminy INF.03</h1>
                    <p className="egzaminy-lead">
                        Przegladaj i filtruj arkusze, od najnowszej sesji. Kazdy ma 4 etapy: baza
                        danych, HTML/PHP, CSS, kontrola. Status Twojego progresu zapisywany jest lokalnie.
                    </p>
                </header>
                <div className="egzaminy-toolbar">
                    <RandomExamButton entries={entries} />
                    <span className="egzaminy-toolbar-count">
                        {entries.length} arkuszy w bazie
                    </span>
                </div>
                <ExamGrid entries={entries} />
                <RecentlyVisited />
            </div>
        </article>
    );
}
