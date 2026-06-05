import Link from "next/link";
import { courses } from "@/lib/data";
import { courseDetails } from "@/lib/courses";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

export const dynamic = "force-static";

export const metadata = {
    title: "Kursy | STEM",
    description: "Darmowe materiały do nauki programowania — przygotowanie do egzaminów INF.02, INF.03, INF.04 dla uczniów techników i pasjonatów. Niski próg wejścia."
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
                    <p className="courses-intro">
                        Darmowe materiały do nauki dla uczniów techników przygotowujących się do egzaminów INF.02, INF.03 i INF.04 — i dla każdego, kto traktuje programowanie jako hobby. Niski próg wejścia, żargon tłumaczony po najechaniu, wiedza sprawdzana quizami. Tworzymy je jako członkowie Koła STEM.
                    </p>
                </header>

                {courseDetails.length > 0 && (
                    <>
                        <h2 className="courses-section-label font-mono-industrial">DOSTĘPNE TERAZ</h2>
                        <div className="courses-grid">
                            {courseDetails.map((course, i) => {
                                const totalLessons = course.modules.reduce((acc, m) => acc + m.lessons.length, 0);
                                const publishedLessons = course.modules.reduce(
                                    (acc, m) => acc + m.lessons.filter((l) => l.published).length,
                                    0
                                );
                                return (
                                    <ScrollReveal key={course.id} delay={i * 0.06}>
                                        <Link href={`/kursy/${course.id}`} className="course-card course-card-live">
                                            <div className="course-card-header">
                                                <span className="course-level">{course.badge}</span>
                                                <span className="course-available">DOSTĘPNY →</span>
                                            </div>
                                            <h3>{course.title}</h3>
                                            <p className="course-card-subtitle">
                                                {course.subtitle}
                                            </p>
                                            <p>{course.intro}</p>
                                            <div className="course-progress">
                                                <span>{course.modules.length} MODUŁÓW</span>
                                                <span>{publishedLessons} / {totalLessons} LEKCJI GOTOWYCH</span>
                                            </div>
                                        </Link>
                                    </ScrollReveal>
                                );
                            })}
                        </div>
                    </>
                )}

                <h2 className="courses-section-label font-mono-industrial">W PRZYGOTOWANIU</h2>
                <div className="courses-grid">
                    {courses.map((course, i) => (
                        <ScrollReveal key={course.id} delay={i * 0.06}>
                            <article className="course-card">
                                <div className="course-card-header">
                                    <span className="course-level">{levelLabel[course.level] ?? course.level}</span>
                                    <span className="coming-soon">WKRÓTCE</span>
                                </div>
                                <h3>{course.title}</h3>
                                <p className="course-card-subtitle">
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
