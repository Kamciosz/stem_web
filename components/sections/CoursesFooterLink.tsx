import Link from "next/link";
import { getLatestSession } from "@/lib/exam-index";

/**
 * Maly odnosnik do kursu INF.03 na dole strony glownej.
 * Kursy nie sa glowna funkcjonalnoscia strony — to dyskretny link, nie sekcja
 * z pojedynczymi arkuszami. Etykieta najnowszej sesji liczona dynamicznie.
 */
export function CoursesFooterLink() {
    const latest = getLatestSession();

    return (
        <section className="courses-footer-link section-shell" aria-label="Kurs INF.03">
            <div className="section-inner courses-footer-link-inner">
                <p className="courses-footer-link-text">
                    Prowadzimy też darmowy kurs przygotowania do egzaminu zawodowego INF.03
                    {latest ? ` — najnowsza sesja: ${latest}.` : "."}
                </p>
                <div className="courses-footer-link-actions">
                    <Link href="/kursy/inf-03" className="courses-footer-link-cta">
                        Kurs INF.03 →
                    </Link>
                    <Link href="/egzaminy" className="courses-footer-link-cta secondary">
                        Wszystkie arkusze
                    </Link>
                </div>
            </div>
        </section>
    );
}
