import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { examMeta, examSteps, getStepBySlug, toExamStepView } from "@/lib/exams/inf-03-egzamin-03-czerwiec-2024";
import { ExamFlowStagePage } from "@/components/courses/examflow/ExamFlowStagePage";
import { ExamFlowDashboard } from "@/components/courses/examflow/ExamFlowDashboard";

type StagePageProps = { params: Promise<{ step: string }>; };
export const dynamic = "force-static";
export function generateStaticParams() { return [{ step: "" }, ...examSteps.map((s) => ({ step: s.slug }))]; }

const baseUrl = "https://stem-web-569q.vercel.app";

export async function generateMetadata({ params }: StagePageProps): Promise<Metadata> {
    const { step: stepSlug } = await params;
    const step = getStepBySlug(stepSlug);
    const url = stepSlug
        ? `${baseUrl}/kursy/${examMeta.courseId}/${examMeta.lessonSlug}/${stepSlug}`
        : `${baseUrl}/kursy/${examMeta.courseId}/${examMeta.lessonSlug}`;

    if (!step) {
        return {
            title: `${examMeta.title} — ${examMeta.session} | ${examMeta.examId}`,
            description: examMeta.description,
            alternates: { canonical: url },
            openGraph: {
                title: `${examMeta.title} — ${examMeta.session}`,
                description: examMeta.description,
                url,
                siteName: "STEM",
                locale: "pl_PL",
                type: "article",
            },
            twitter: {
                card: "summary_large_image",
                title: `${examMeta.title} — ${examMeta.session}`,
                description: examMeta.description,
            },
        };
    }

    return {
        title: `${examMeta.examId} — ${step.label} | ${examMeta.title}`,
        description: step.summary,
        alternates: { canonical: url },
        openGraph: {
            title: `${examMeta.title} — ${step.label}`,
            description: step.summary,
            url,
            siteName: "STEM",
            locale: "pl_PL",
            type: "article",
        },
        twitter: {
            card: "summary_large_image",
            title: `${examMeta.title} — ${step.label}`,
            description: step.summary,
        },
    };
}

export default async function ExamStagePage({ params }: StagePageProps) {
    const { step: stepSlug } = await params;
    const step = getStepBySlug(stepSlug);
    const basePath = `${baseUrl}/kursy/${examMeta.courseId}/${examMeta.lessonSlug}`;

    // Root dashboard: /kursy/inf-03/egzamin-XX — stepSlug pusty
    if (!stepSlug) {
        const jsonLd = {
            "@context": "https://schema.org",
            "@type": "Course",
            name: `${examMeta.title} (${examMeta.session})`,
            description: examMeta.description,
            provider: { "@type": "Organization", name: "STEM", sameAs: baseUrl },
            educationalLevel: "Zawodowy INF.03",
            inLanguage: "pl",
            hasCourseInstance: {
                "@type": "CourseInstance",
                courseMode: "onsite",
                courseWorkload: examMeta.time,
                instructor: { "@type": "Person", name: "Zespół STEM" },
            },
            offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "PLN",
                availability: "https://schema.org/InStock",
            },
            url: basePath,
        };
        return (
            <>
                <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
                <ExamFlowDashboard />
            </>
        );
    }

    if (!step) notFound();
    let Content!: React.ComponentType;
    try { const mod = await step.mdx(); Content = mod.default; } catch { notFound(); }

    const pageUrl = `${basePath}/${step.slug}`;
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "LearningResource",
        name: `${examMeta.title} — ${step.label}`,
        description: step.summary,
        educationalLevel: "Zawodowy INF.03",
        learningResourceType: "lesson",
        timeRequired: step.minutes,
        inLanguage: "pl",
        isPartOf: {
            "@type": "Course",
            name: `${examMeta.title} (${examMeta.session})`,
            url: basePath,
        },
        teaches: step.technologies.join(", "),
        url: pageUrl,
        provider: { "@type": "Organization", name: "STEM", sameAs: baseUrl },
    };
    const breadcrumbLd = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
            { "@type": "ListItem", position: 1, name: "Kursy", item: `${baseUrl}/kursy` },
            { "@type": "ListItem", position: 2, name: "INF.03", item: `${baseUrl}/kursy/inf-03` },
            { "@type": "ListItem", position: 3, name: examMeta.title, item: basePath },
            { "@type": "ListItem", position: 4, name: step.label, item: pageUrl },
        ],
    };

    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
            <article className="lesson-page section-shell exam-lesson-page" data-exam-slug={examMeta.lessonSlug}>
                <div className="section-inner lesson-container exam-lesson-container">
                    <div className="lesson-main exam-lesson-main">
                        <ExamFlowStagePage step={toExamStepView(step)}>
                            <Content />
                        </ExamFlowStagePage>
                    </div>
                </div>
            </article>
        </>
    );
}
