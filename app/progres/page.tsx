import type { Metadata } from "next";
import { getExamIndex } from "@/lib/exam-index";
import { ProgressDashboard } from "@/components/courses/examflow/ProgressDashboard";
import { ProgressExport } from "@/components/courses/examflow/ProgressExport";
import { ProgressBadges } from "@/components/courses/examflow/ProgressBadges";
import { ProgressByTech } from "@/components/courses/examflow/ProgressByTech";
import { RecentlyVisited } from "@/components/courses/examflow/RecentlyVisited";

export const dynamic = "force-static";

const baseUrl = "https://stem-web-569q.vercel.app";
const url = `${baseUrl}/progres`;

export const metadata: Metadata = {
    title: "Twój progres — STEM",
    description:
        "Sprawdź, które egzaminy INF.03 już przerobiłeś, które są w trakcie, a które czekają. Śledź progres w 54 arkuszach z 6 sesji (styczeń 2023 — styczeń 2026).",
    alternates: { canonical: url },
    openGraph: {
        title: "Twój progres — STEM INF.03",
        description:
            "54 arkusze INF.03 z 6 sesji. Śledź swój progres: ukończone, w trakcie, nierozpoczęte.",
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
                    <p className="progres-eyebrow">Tylko na tym urządzeniu</p>
                    <h1 className="progres-title">Twój progres</h1>
                    <p className="progres-lead">
                        Checklista z każdego egzaminu zapisuje się lokalnie (localStorage). Ta
                        strona zbiera wszystko w jedno miejsce — bez kont, bez logowania.
                    </p>
                </header>
                <ProgressDashboard entries={entries} />
                <ProgressByTech entries={entries} />
                <ProgressBadges entries={entries} />
                <RecentlyVisited />
                <section className="progres-export-section">
                    <h2 className="progres-export-title">Kopia zapasowa progresu</h2>
                    <ProgressExport />
                </section>
            </div>
        </article>
    );
}
