import { courses } from "@/lib/data";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

export const dynamic = "force-static";

export const metadata = {
    title: "Kursy | STEM",
    description: "Kursy programistyczne Koła STEM — Python, JavaScript, C++, TypeScript, Mikrokontrolery i więcej. Wkrótce."
};

const levelLabel: Record<string, string> = {
    BEGINNER: "POCZĄTKUJĄCY",
    INTERMEDIATE: "ŚREDNIOZAAWANSOWANY",
    ADVANCED: "ZAAWANSOWANY"
};

export default function CoursesPage() {
    return (
        <section className="courses-page section-shell" aria-labelledby="courses-title">
            <div className="section-inner">
                <header className="page-header">
                    <p className="font-mono-industrial body-muted">KNOWLEDGE BASE / COURSES</p>
                    <h1 className="headline-large" id="courses-title">
                        KURSY
                    </h1>
                    <p style={{ maxWidth: 560, color: "var(--recede)", lineHeight: 1.7, marginTop: 16 }}>
                        Programujemy, budujemy, uczymy się razem. Poniżej kursy, które przygotowujemy dla członków koła i uczniów zainteresowanych technologią.
                    </p>
                </header>

                <div className="courses-grid">
                    {courses.map((course, i) => (
                        <ScrollReveal key={course.id} delay={i * 0.06}>
                            <article className="course-card">
                                <div className="course-card-header">
                                    <span className="course-level">{levelLabel[course.level] ?? course.level}</span>
                                    <span className="coming-soon">WKRÓTCE</span>
                                </div>
                                <h3>{course.title}</h3>
                                <p style={{ color: "var(--laser)", fontSize: "0.8rem", fontFamily: "var(--font-jetbrains-mono)", marginBottom: 12, marginTop: -4 }}>
                                    {course.subtitle}
                                </p>
                                <p>{course.description}</p>
                                <div className="course-tech">
                                    {course.tech.map((t) => (
                                        <span key={t}>{t}</span>
                                    ))}
                                </div>
                            </article>
                        </ScrollReveal>
                    ))}
                </div>
            </div>
        </section>
    );
}
