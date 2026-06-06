import type { Metadata } from "next";
import { getExamIndex } from "@/lib/exam-index";
import { AdminPanel } from "@/components/admin/AdminPanel";

export const dynamic = "force-static";

export const metadata: Metadata = {
    title: "Administracja — STEM",
    description: "Panel administracyjny STEM. Sitemap, IndexNow, statystyki.",
    robots: { index: false, follow: false },
};

export default function AdminPage() {
    const entries = getExamIndex();
    const totalStages = entries.length * 4;
    const totalUrls =
        entries.length +
        totalStages +
        8 + // statics
        3; // /progres, /egzaminy, /feed.xml

    return (
        <article className="admin-page section-shell">
            <div className="section-inner admin-container">
                <header className="admin-header">
                    <p className="admin-eyebrow">/administracja</p>
                    <h1 className="admin-title">Panel administracyjny</h1>
                    <p className="admin-lead">
                        Narzedzia do zarzadzania STEM. Sitemap, IndexNow submit, statystyki, cache.
                    </p>
                </header>
                <AdminPanel
                    totalExams={entries.length}
                    totalStages={totalStages}
                    totalUrls={totalUrls}
                />
            </div>
        </article>
    );
}
