import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { courseDetails, getLesson } from "@/lib/courses";
import { QuizClient } from "@/components/courses/QuizClient";

type QuizPageProps = {
    params: Promise<{ course: string; lesson: string }>;
};

export const dynamic = "force-static";

/**
 * Generujemy statyczne strony /quiz dla KAŻDEJ opublikowanej lekcji z quizem
 * w courses.ts. Pula pytań i tak leci z Supabase w runtime — strona jest
 * tylko szkieletem (tytuł + nawigacja + QuizClient który fetchuje API).
 *
 * Źródło prawdy o tym, czy lekcja ma quiz: pole `hasQuiz` w lib/courses.ts
 * (dawne `quiz` z pytaniami w kodzie — deprecated, zostawiam jako fallback).
 */
export function generateStaticParams() {
    return courseDetails.flatMap((course) =>
        course.modules.flatMap((module) =>
            module.lessons
                .filter((lesson) => lesson.published && lessonHasQuizFlag(lesson))
                .map((lesson) => ({ course: course.id, lesson: lesson.slug }))
        )
    );
}

function lessonHasQuizFlag(lesson: { hasQuiz?: boolean; quiz?: unknown[] }): boolean {
    // Preferuj nowe pole `hasQuiz`. Fallback: stare `quiz` z pytaniami.
    if (lesson.hasQuiz) return true;
    return Boolean(lesson.quiz && lesson.quiz.length > 0);
}

export async function generateMetadata({ params }: QuizPageProps): Promise<Metadata> {
    const { course: courseId, lesson: lessonSlug } = await params;
    const found = getLesson(courseId, lessonSlug);
    if (!found) {
        return { title: "Quiz | STEM" };
    }
    return {
        title: `Quiz: ${found.lesson.title} | ${found.course.title}`,
        description: `Sprawdź wiedzę z lekcji "${found.lesson.title}" w quizie STEM. 5 losowych pytań, wynik liczony po stronie serwera.`,
        alternates: { canonical: `/kursy/${courseId}/${lessonSlug}/quiz` },
        openGraph: { url: `/kursy/${courseId}/${lessonSlug}/quiz` },
        robots: { index: false, follow: true }
    };
}

export default async function QuizPage({ params }: QuizPageProps) {
    const { course: courseId, lesson: lessonSlug } = await params;
    const found = getLesson(courseId, lessonSlug);

    if (!found || !found.lesson.published) {
        notFound();
    }
    // Źródło prawdy o tym, czy lekcja ma quiz, to courses.ts — to gwarantuje,
    // że strona istnieje tylko dla lekcji, które admin oznaczył.
    if (!lessonHasQuizFlag(found.lesson)) {
        notFound();
    }

    const safe = found as NonNullable<typeof found>;
    const { course, module, lesson } = safe;

    const baseUrl = "https://stem-web-569q.vercel.app";
    const quizJsonLd = {
        "@context": "https://schema.org",
        "@type": "LearningResource",
        name: `Quiz: ${lesson.title}`,
        description: `Quiz sprawdzający wiedzę z lekcji "${lesson.title}" w kursie ${course.title}.`,
        learningResourceType: "quiz",
        educationalLevel: "secondary education/vocational",
        inLanguage: "pl",
        isAccessibleForFree: true,
        assesses: lesson.title,
        isPartOf: {
            "@type": "Course",
            name: course.title,
            url: `${baseUrl}/kursy/${course.id}`,
        },
        provider: { "@type": "Organization", name: "STEM", sameAs: baseUrl },
        url: `${baseUrl}/kursy/${course.id}/${lessonSlug}/quiz`,
    };

    return (
        <section className="quiz-page section-shell">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(quizJsonLd) }}
            />
            <div className="section-inner lesson-inner">
                <nav className="lesson-breadcrumb" aria-label="Ścieżka nawigacji">
                    <Link href="/kursy">KURSY</Link>
                    <span aria-hidden="true">/</span>
                    <Link href={`/kursy/${course.id}`}>{course.badge}</Link>
                    <span aria-hidden="true">/</span>
                    <Link href={`/kursy/${course.id}/${lessonSlug}`}>{lesson.title}</Link>
                    <span aria-hidden="true">/</span>
                    <span className="lesson-breadcrumb-current">QUIZ</span>
                </nav>

                <header className="quiz-page-header">
                    <p className="font-mono-industrial body-muted">{module.title}</p>
                    <h1 className="headline-large quiz-page-title">Quiz: {lesson.title}</h1>
                    <p className="quiz-page-desc">
                        5 losowych pytań z puli {lesson.quizPoolSize ?? "kilkunastu"}. Wynik
                        weryfikowany po stronie serwera. Przełączanie okna / DevTools / kopiowanie =
                        automatyczne zakończenie quizu.
                    </p>
                </header>

                <QuizClient
                    courseId={course.id}
                    lessonSlug={lessonSlug}
                    lessonTitle={lesson.title}
                />

                <div className="quiz-page-back">
                    <Link href={`/kursy/${course.id}/${lessonSlug}`} className="terminal-link">
                        ← WRÓĆ DO LEKCJI
                    </Link>
                </div>
            </div>
        </section>
    );
}
