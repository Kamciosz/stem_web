import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { courseDetails, getLesson, getFlatLessons, lessonHasQuiz } from "@/lib/courses";

type LessonPageProps = {
    params: Promise<{ course: string; lesson: string }>;
};

export const dynamic = "force-static";

export function generateStaticParams() {
    return courseDetails.flatMap((course) =>
        course.modules.flatMap((module) =>
            module.lessons
                .filter((lesson) => lesson.published)
                .map((lesson) => ({ course: course.id, lesson: lesson.slug }))
        )
    );
}

export async function generateMetadata({ params }: LessonPageProps): Promise<Metadata> {
    const { course: courseId, lesson: lessonSlug } = await params;
    const found = getLesson(courseId, lessonSlug);
    if (!found) {
        return { title: "Lekcja | STEM" };
    }
    return {
        title: `${found.lesson.title} | ${found.course.title}`,
        description: found.lesson.summary
    };
}

export default async function LessonPage({ params }: LessonPageProps) {
    const { course: courseId, lesson: lessonSlug } = await params;
    const found = getLesson(courseId, lessonSlug);

    if (!found || !found.lesson.published) {
        notFound();
    }

    const { course, module, lesson } = found as NonNullable<typeof found>;

    let LessonContent!: React.ComponentType;
    try {
        const mod = await import(`@/content/${courseId}/${lessonSlug}.mdx`);
        LessonContent = mod.default;
    } catch {
        notFound();
    }

    const flat = getFlatLessons(courseId).filter((entry) => entry.lesson.published);
    const currentIndex = flat.findIndex((entry) => entry.lesson.slug === lessonSlug);
    const prev = currentIndex > 0 ? flat[currentIndex - 1] : null;
    const next = currentIndex < flat.length - 1 ? flat[currentIndex + 1] : null;

    const hasQuiz = lessonHasQuiz(courseId, lessonSlug);

    return (
        <article className="lesson-page section-shell">
            <div className="section-inner lesson-container">
                <aside className="lesson-sidebar">
                    <nav className="lesson-breadcrumb" aria-label="Ścieżka nawigacji">
                        <Link href="/kursy">KURSY</Link>
                        <span aria-hidden="true">/</span>
                        <Link href={`/kursy/${course.id}`}>{course.badge}</Link>
                    </nav>

                    <div className="lesson-meta">
                        <span className="lesson-meta-module">{module.title}</span>
                        {lesson.minutes && <span className="lesson-meta-time">{lesson.minutes} MIN</span>}
                    </div>

                    <div className="lesson-module-nav">
                        <h3 className="lesson-module-nav-title">Lekcje w module</h3>
                        <ol className="lesson-module-list">
                            {module.lessons
                                .filter((l) => l.published)
                                .map((l) => (
                                    <li key={l.slug} className={l.slug === lessonSlug ? "active" : ""}>
                                        <Link href={`/kursy/${course.id}/${l.slug}`}>{l.title}</Link>
                                    </li>
                                ))}
                        </ol>
                    </div>
                </aside>

                <div className="lesson-main">
                    <header className="lesson-header">
                        <h1 className="lesson-title-main">{lesson.title}</h1>
                        <p className="lesson-summary-main">{lesson.summary}</p>
                    </header>

                    {lesson.objectives && lesson.objectives.length > 0 && (
                        <div className="lesson-objectives">
                            <h2 className="lesson-objectives-title">Czego się nauczysz</h2>
                            <ul className="lesson-objectives-list">
                                {lesson.objectives.map((obj, i) => (
                                    <li key={i}>{obj}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <div className="lesson-content">
                        <LessonContent />
                    </div>

                    {hasQuiz && (
                        <div className="lesson-quiz-cta">
                            <div className="lesson-quiz-cta-inner">
                                <span className="lesson-quiz-cta-label">SPRAWDŹ WIEDZĘ</span>
                                <h3 className="lesson-quiz-cta-title">Gotowy na quiz?</h3>
                                <p className="lesson-quiz-cta-desc">
                                    Sprawdź, czy opanowałeś materiał. Quiz składa się z {lesson.quiz?.length || 0}{" "}
                                    pytań i trwa około 3–5 minut.
                                </p>
                                <Link href={`/kursy/${course.id}/${lessonSlug}/quiz`} className="lesson-quiz-cta-btn">
                                    ROZPOCZNIJ QUIZ →
                                </Link>
                            </div>
                        </div>
                    )}

                    <nav className="lesson-nav" aria-label="Nawigacja między lekcjami">
                        {prev ? (
                            <Link
                                href={`/kursy/${course.id}/${prev.lesson.slug}`}
                                className="lesson-nav-link lesson-nav-prev"
                            >
                                <span className="lesson-nav-dir">← POPRZEDNIA</span>
                                <span className="lesson-nav-name">{prev.lesson.title}</span>
                            </Link>
                        ) : (
                            <span className="lesson-nav-link lesson-nav-empty" aria-hidden="true" />
                        )}
                        {next ? (
                            <Link
                                href={`/kursy/${course.id}/${next.lesson.slug}`}
                                className="lesson-nav-link lesson-nav-next"
                            >
                                <span className="lesson-nav-dir">NASTĘPNA →</span>
                                <span className="lesson-nav-name">{next.lesson.title}</span>
                            </Link>
                        ) : (
                            <Link href={`/kursy/${course.id}`} className="lesson-nav-link lesson-nav-next">
                                <span className="lesson-nav-dir">KONIEC MODUŁU →</span>
                                <span className="lesson-nav-name">Wróć do przeglądu kursu</span>
                            </Link>
                        )}
                    </nav>
                </div>
            </div>
        </article>
    );
}
