import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { courseDetails, getCourseDetail, examSessions } from "@/lib/courses";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { ExamPicker } from "@/components/ExamPicker";

type CoursePageProps = {
    params: Promise<{ course: string }>;
};

export const dynamic = "force-static";

export function generateStaticParams() {
    return courseDetails.map((course) => ({ course: course.id }));
}

export async function generateMetadata({ params }: CoursePageProps): Promise<Metadata> {
    const { course: courseId } = await params;
    const course = getCourseDetail(courseId);
    if (!course) {
        return { title: "Kurs | STEM" };
    }
    return {
        title: `${course.title} | STEM`,
        description: course.subtitle
    };
}

export default async function CoursePage({ params }: CoursePageProps) {
    const { course: courseId } = await params;
    const course = getCourseDetail(courseId);

    if (!course) {
        notFound();
    }

    const detail = course as NonNullable<typeof course>;

    const totalLessons = detail.modules.reduce((acc, m) => acc + m.lessons.length, 0);
    const publishedLessons = detail.modules.reduce(
        (acc, m) => acc + m.lessons.filter((l) => l.published).length,
        0
    );

    return (
        <section className="course-overview section-shell" aria-labelledby="course-overview-title">
            <div className="section-inner">
                <header className="page-header">
                    <p className="font-mono-industrial body-muted">KNOWLEDGE BASE / {detail.badge}</p>
                    <h1 className="headline-large" id="course-overview-title">
                        {detail.title}
                    </h1>
                    <p className="course-overview-subtitle">{detail.subtitle}</p>
                    <p className="course-overview-intro">{detail.intro}</p>
                    <div className="course-overview-stats">
                        <span>
                            <strong>{detail.modules.length}</strong> MODUŁÓW
                        </span>
                        <span>
                            <strong>{publishedLessons}</strong> / {totalLessons} LEKCJI GOTOWYCH
                        </span>
                    </div>
                </header>

                {detail.id === "inf-03" && examSessions.length > 0 && (
                    <ExamPicker sessions={examSessions} courseId={detail.id} />
                )}

                <ol className="module-list">
                    {detail.modules.map((module, mi) => (
                        <ScrollReveal as="li" key={module.id} delay={mi * 0.05} className="module-item">
                            <div className="module-head">
                                <span className="module-index">{String(mi + 1).padStart(2, "0")}</span>
                                <div>
                                    <h2 className="module-title">{module.title}</h2>
                                    <p className="module-desc">{module.description}</p>
                                </div>
                            </div>
                            <ul className="lesson-list">
                                {module.lessons.map((lesson) => {
                                    const inner = (
                                        <>
                                            <span className="lesson-marker" aria-hidden="true">
                                                {lesson.published ? "›" : "·"}
                                            </span>
                                            <span className="lesson-text">
                                                <span className="lesson-title">{lesson.title}</span>
                                                <span className="lesson-summary">{lesson.summary}</span>
                                            </span>
                                            <span className="lesson-status">
                                                {lesson.published ? (
                                                    lesson.minutes ? `${lesson.minutes} MIN` : "OTWÓRZ"
                                                ) : (
                                                    "WKRÓTCE"
                                                )}
                                            </span>
                                        </>
                                    );

                                    return (
                                        <li
                                            key={lesson.slug}
                                            className={`lesson-row ${lesson.published ? "lesson-open" : "lesson-locked"}`}
                                        >
                                            {lesson.published ? (
                                                <Link
                                                    href={`/kursy/${detail.id}/${lesson.slug}`}
                                                    className="lesson-link"
                                                >
                                                    {inner}
                                                </Link>
                                            ) : (
                                                <div className="lesson-link" aria-disabled="true">
                                                    {inner}
                                                </div>
                                            )}
                                        </li>
                                    );
                                })}
                            </ul>
                        </ScrollReveal>
                    ))}
                </ol>

                <div className="course-overview-back">
                    <Link href="/kursy" className="terminal-link">
                        ← WSZYSTKIE KURSY
                    </Link>
                </div>
            </div>
        </section>
    );
}
