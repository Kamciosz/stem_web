import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { courseDetails, getLesson, getFlatLessons } from "@/lib/courses";

type LessonPageProps = {
    params: Promise<{ course: string; lesson: string }>;
};

export const dynamic = "force-static";

export function generateStaticParams() {
    // Tylko opublikowane lekcje dostają wygenerowaną stronę
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

    const { course, module, lesson } = found;

    // Render treści lekcji z pliku MDX
    let LessonContent: React.ComponentType;
    try {
        const mod = await import(`@/content/${courseId}/${lessonSlug}.mdx`);
        LessonContent = mod.default;
    } catch {
        notFound();
    }

    // Nawigacja prev/next po opublikowanych lekcjach kursu
    const flat = getFlatLessons(courseId).filter((entry) => entry.lesson.published);
    const currentIndex = flat.findIndex((entry) => entry.lesson.slug === lessonSlug);
    const prev = currentIndex > 0 ? flat[currentIndex - 1] : null;
    const next = currentIndex < flat.length - 1 ? flat[currentIndex + 1] : null;

    return (
        <article className="lesson-page section-shell">
            <div className="section-inner lesson-inner">
                <nav className="lesson-breadcrumb" aria-label="Ścieżka nawigacji">
                    <Link href="/kursy">KURSY</Link>
                    <span aria-hidden="true">/</span>
                    <Link href={`/kursy/${course.id}`}>{course.badge}</Link>
                    <span aria-hidden="true">/</span>
                    <span className="lesson-breadcrumb-current">{module.title}</span>
                </nav>

                <header className="lesson-header">
                    <p className="font-mono-industrial body-muted">{module.title}</p>
                    <h1 className="headline-large lesson-title-main">{lesson.title}</h1>
                    <p className="lesson-summary-main">{lesson.summary}</p>
                </header>

                <div className="lesson-content">
                    <LessonContent />
                </div>

                <nav className="lesson-nav" aria-label="Nawigacja między lekcjami">
                    {prev ? (
                        <Link href={`/kursy/${course.id}/${prev.lesson.slug}`} className="lesson-nav-link lesson-nav-prev">
                            <span className="lesson-nav-dir">← POPRZEDNIA</span>
                            <span className="lesson-nav-name">{prev.lesson.title}</span>
                        </Link>
                    ) : (
                        <span className="lesson-nav-link lesson-nav-empty" aria-hidden="true" />
                    )}
                    {next ? (
                        <Link href={`/kursy/${course.id}/${next.lesson.slug}`} className="lesson-nav-link lesson-nav-next">
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
        </article>
    );
}
