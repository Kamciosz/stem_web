import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { courseDetails, getCourseDetail, examSessions } from "@/lib/courses";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { ExamPicker } from "@/components/ExamPicker";
import { CourseLayout } from "@/components/CourseLayout";

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
        description: course.subtitle,
        alternates: { canonical: `/kursy/${course.id}` },
        openGraph: { url: `/kursy/${course.id}` }
    };
}

export default async function CoursePage({ params }: CoursePageProps) {
    const { course: courseId } = await params;
    const course = getCourseDetail(courseId);

    if (!course) {
        notFound();
    }

    const detail = course as NonNullable<typeof course>;

    const visibleModules = detail.modules.filter((m) => !m.hidden);
    const totalLessons = visibleModules.reduce((acc, m) => acc + m.lessons.length, 0);
    const publishedLessons = visibleModules.reduce(
        (acc, m) => acc + m.lessons.filter((l) => l.published).length,
        0
    );

    const courseJsonLd = {
        "@context": "https://schema.org",
        "@type": "Course",
        name: detail.title,
        description: detail.subtitle,
        provider: {
            "@type": "EducationalOrganization",
            name: "STEM | Koło Technologiczne",
            url: "https://stem-web-569q.vercel.app"
        },
        inLanguage: "pl",
        isAccessibleForFree: true,
        url: `https://stem-web-569q.vercel.app/kursy/${detail.id}`
    };

    const breadcrumbs = [
        { label: "Kursy", href: "/kursy" },
        { label: detail.title }
    ];

    return (
        <CourseLayout course={detail} breadcrumbs={breadcrumbs}>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(courseJsonLd) }}
            />

            <header className="page-header">
                <p className="font-mono-industrial body-muted">KNOWLEDGE BASE / {detail.badge}</p>
                <h1 className="headline-large" id="course-overview-title">
                    {detail.title}
                </h1>
                <p className="course-overview-subtitle">{detail.subtitle}</p>
                <p className="course-overview-intro">{detail.intro}</p>
                <div className="course-overview-stats">
                    <span>
                        <strong>{visibleModules.length}</strong> MODUŁÓW
                    </span>
                    <span>
                        <strong>{publishedLessons}</strong> / {totalLessons} LEKCJI GOTOWYCH
                    </span>
                </div>
            </header>

            {detail.id === "inf-03" && examSessions.length > 0 && (
                <ScrollReveal delay={0.1}>
                    <ExamPicker sessions={examSessions} courseId={detail.id} />
                </ScrollReveal>
            )}
        </CourseLayout>
    );
}
