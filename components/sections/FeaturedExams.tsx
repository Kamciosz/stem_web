import Link from "next/link";
import { getExamIndex } from "@/lib/exam-index";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { RecentlyVisited } from "@/components/courses/examflow/RecentlyVisited";

const SESSIONS_PROMO = ["Styczen 2026", "Styczen 2025", "Czerwiec 2025"];

export function FeaturedExams() {
    const all = getExamIndex();
    const featured = all
        .filter((e) => SESSIONS_PROMO.includes(e.session))
        .slice(0, 3);

    if (featured.length === 0) return null;

    return (
        <section className="featured-exams section-shell" aria-label="Polecane egzaminy">
            <div className="section-inner featured-exams-inner">
                <ScrollReveal>
                    <header className="featured-exams-header">
                        <p className="font-mono-industrial featured-exams-eyebrow">
                            KURS INF.03 · 54 ARKUSZE
                        </p>
                        <h2 className="featured-exams-title">Najnowsze arkusze</h2>
                        <p className="featured-exams-lead">
                            Z kazdym arkuszem 4 etapy nauki: baza danych, HTML/PHP, CSS,
                            kontrola. Sprawdz swoj progres w czasie rzeczywistym.
                        </p>
                    </header>
                </ScrollReveal>
                <ol className="featured-exams-grid">
                    {featured.map((e, i) => (
                        <ScrollReveal key={e.slug} delay={i * 100}>
                            <li>
                                <Link href={e.basePath} className="featured-exams-card">
                                    <span className="featured-exams-id">{e.examId}</span>
                                    <strong className="featured-exams-card-title">{e.title}</strong>
                                    <span className="featured-exams-topic">{e.topic}</span>
                                    <div className="featured-exams-techs">
                                        {e.technologies.slice(0, 4).map((t) => (
                                            <span key={t} className="featured-exams-tech">
                                                {t}
                                            </span>
                                        ))}
                                    </div>
                                    <span className="featured-exams-cta" aria-hidden="true">
                                        Otworz →
                                    </span>
                                </Link>
                            </li>
                        </ScrollReveal>
                    ))}
                </ol>
                <ScrollReveal delay={400}>
                    <div className="featured-exams-actions">
                        <Link href="/egzaminy" className="featured-exams-link primary">
                            Wszystkie 54 egzaminy →
                        </Link>
                        <Link href="/progres" className="featured-exams-link">
                            Moj progres
                        </Link>
                    </div>
                </ScrollReveal>
                <ScrollReveal delay={500}>
                    <RecentlyVisited />
                </ScrollReveal>
            </div>
        </section>
    );
}
