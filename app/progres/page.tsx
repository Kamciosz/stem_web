import type { Metadata } from "next";
import { getExamIndex } from "@/lib/exam-index";
import { ProgressDashboard } from "@/components/courses/examflow/ProgressDashboard";
import { ProgressExport } from "@/components/courses/examflow/ProgressExport";

export const dynamic = "force-static";

const baseUrl = "https://stem-web-569q.vercel.app";
const url = `${baseUrl}/progres`;

export const metadata: Metadata = {
    title: "Twoj progres — STEM",
    description:
        "Sprawdz ktore egzaminy INF.03 juz przerobiles, ktore sa w trakcie, a ktore czekaja. Postap w 54 arkuszach z 6 sesji (styczen 2023 — styczen 2026).",
    alternates: { canonical: url },
    openGraph: {
        title: "Twoj progres — STEM INF.03",
        description:
            "54 arkusze INF.03 z 6 sesji. Sledz swoj progres: ukonczone, w trakcie, nie rozpoczete.",
        url,
        siteName: "STEM",
        locale: "pl_PL",
        type: "website",
    },
};

export default function ProgresPage() {
    const entries = getExamIndex();
    return (
        <article className="progres-page section-shell">
            <div className="section-inner progres-container">
                <header className="progres-header">
                    <p className="progres-eyebrow">Tylko na tym urzadzeniu</p>
                    <h1 className="progres-title">Twoj progres</h1>
                    <p className="progres-lead">
                        Checklista z kazdego egzaminu zapisuje sie lokalnie (localStorage). Ta
                        strona zbiera wszystko w jedno miejsce — bez kont, bez logowania.
                    </p>
                </header>
                <ProgressDashboard entries={entries} />
                <section className="progres-export-section">
                    <h2 className="progres-export-title">Kopia zapasowa progresu</h2>
                    <ProgressExport />
                </section>
            </div>
        </article>
    );
}
