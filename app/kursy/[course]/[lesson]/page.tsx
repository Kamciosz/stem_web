import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { courseDetails, getLesson, getFlatLessons, lessonHasQuiz } from "@/lib/courses";
import { VideoEmbed } from "@/components/courses/VideoEmbed";
import { ExamFlowDashboard } from "@/components/courses/examflow/ExamFlowDashboard";
import { examMeta as examFlow01Meta } from "@/lib/exams/inf-03-egzamin-01";

/** Mapa lekcji z dedykowanym dashboard-em zamiast renderowania MDX 1:1. */
const examFlowDashboards: Record<string, Record<string, () => React.ReactElement>> = {
    "inf-03": {
        [examFlow01Meta.lessonSlug]: () => <ExamFlowDashboard />,
    },
};

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
    const isOtherExam = lessonSlug.startsWith("egzamin-") && lessonSlug !== "egzamin-01-styczen-2026";
    if (isOtherExam) {
        return {
            title: `${found.lesson.title} | ${found.course.title}`,
            description: found.lesson.summary
        };
    }

    const description = lessonSlug === "egzamin-01-styczen-2026"
        ? "Interaktywny przewodnik do arkusza INF.03: Portal samochodowy. SQL, PHP, CSS, punktacja i checklista rozwiązania krok po kroku."
        : found.lesson.summary;

    return {
        title: `${found.lesson.title} | ${found.course.title}`,
        description,
        alternates: { canonical: `/kursy/${courseId}/${lessonSlug}` },
        openGraph: { url: `/kursy/${courseId}/${lessonSlug}` }
    };
}

export default async function LessonPage({ params }: LessonPageProps) {
    const { course: courseId, lesson: lessonSlug } = await params;
    const found = getLesson(courseId, lessonSlug);

    if (!found || !found.lesson.published) {
        notFound();
    }

    const { course, module, lesson } = found as NonNullable<typeof found>;

    // Dedykowany dashboard egzaminu — renderowany zamiast jednolitego MDX.
    // Subpages etapow zyja w app/kursy/inf-03/egzamin-01-styczen-2026/[step]/page.tsx.
    const dashboard = examFlowDashboards[courseId]?.[lessonSlug];
    if (dashboard) {
        return (
            <article
                className="lesson-page section-shell exam-lesson-page"
                data-exam-slug={lessonSlug}
            >
                <div className="section-inner lesson-container exam-lesson-container">
                    <div className="lesson-main exam-lesson-main">
                        {dashboard()}
                    </div>
                </div>
            </article>
        );
    }

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
    const isExamLesson = module.id === "_egzaminy" || lessonSlug.startsWith("egzamin-");

    return (
        <article
            className={`lesson-page section-shell ${isExamLesson ? "exam-lesson-page" : ""}`}
            data-exam-slug={isExamLesson ? lessonSlug : undefined}
        >
            <div className={`section-inner lesson-container ${isExamLesson ? "exam-lesson-container" : ""}`}>
                {!isExamLesson && (
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
                )}

                <div className={`lesson-main ${isExamLesson ? "exam-lesson-main" : ""}`}>
                    {isExamLesson && (
                        <nav className="exam-page-topbar" aria-label="Ścieżka egzaminu">
                            <Link href="/kursy">KURSY</Link>
                            <span aria-hidden="true">/</span>
                            <Link href={`/kursy/${course.id}`}>{course.badge}</Link>
                            <span aria-hidden="true">/</span>
                            <span>{module.title}</span>
                            {lesson.minutes && <strong>{lesson.minutes} MIN</strong>}
                        </nav>
                    )}

                    {lessonSlug === "anatomia-zadania" && (
                        <header className="lesson-header exam-seo-header">
                            <h1 className="lesson-title-main">{lesson.title}</h1>
                            <p className="lesson-summary-main">{lesson.summary}</p>
                        </header>
                    )}

                    {!isExamLesson && (
                        <header className="lesson-header">
                            <h1 className="lesson-title-main">{lesson.title}</h1>
                            <p className="lesson-summary-main">{lesson.summary}</p>
                        </header>
                    )}

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

                    {/*
                      WIDEO WYJAŚNIAJĄCE — miejsce przygotowane na przyszłość.
                      Renderuje się TYLKO gdy lekcja ma ustawione pole `video`
                      w lib/courses.ts. Dopóki żadna lekcja go nie ma, nic się
                      nie pokazuje, ale layout i styl (.lesson-video + .video-embed)
                      są gotowe — wystarczy dopisać { provider, id } w courses.ts.

                      PLAN (do zrobienia PÓŹNIEJ, nie teraz):
                        - Dostawca jeszcze nieustalony: YouTube (nocookie) albo
                          Cloudflare Stream. Komponent <VideoEmbed> obsługuje OBA.
                        - Gdy wejdą KONTA użytkowników: na wideo nakładamy nick
                          zalogowanego ucznia jako watermark (półprzezroczysta
                          warstwa nad <iframe>, pozycja zmieniana co kilka sekund)
                          — zabezpieczenie przed nagrywaniem ekranu i kradzieżą
                          materiału. To wymaga warstwy logowania (jeszcze jej nie ma).
                    */}
                    {lesson.video && (
                        <div className="lesson-video">
                            <VideoEmbed
                                provider={lesson.video.provider}
                                id={lesson.video.id}
                                customerCode={lesson.video.customerCode}
                                title={`Wideo: ${lesson.title}`}
                            />
                        </div>
                    )}

                    <div className="lesson-content">
                        <LessonContent />
                    </div>

                    {hasQuiz && (
                        <div className="lesson-quiz-cta">
                            <span className="lesson-quiz-cta-label">SPRAWDŹ WIEDZĘ</span>
                            <h3 className="lesson-quiz-cta-title">Gotowy na quiz?</h3>
                            <p className="lesson-quiz-cta-desc">
                                5 losowych pytań z puli {lesson.quizPoolSize ?? "kilkunastu"}. Wynik liczy
                                serwer, trwa około 3–5 minut. Możesz podchodzić wielokrotnie — za każdym
                                razem losujemy inny zestaw.
                            </p>
                            <Link href={`/kursy/${course.id}/${lessonSlug}/quiz`} className="lesson-quiz-cta-btn">
                                ROZPOCZNIJ QUIZ →
                            </Link>
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
