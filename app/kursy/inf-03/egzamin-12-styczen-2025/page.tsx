import type { Metadata } from "next";
import { examMeta, examSteps, examStrategy } from "@/lib/exams/inf-03-egzamin-12-styczen-2025";
import { ExamFlowDashboardGeneric } from "@/components/courses/examflow/ExamFlowDashboardGeneric";

export const dynamic = "force-static";

const baseUrl = "https://stem-web-569q.vercel.app";
const basePath = `/kursy/${examMeta.courseId}/${examMeta.lessonSlug}`;
const url = `${baseUrl}${basePath}`;

export const metadata: Metadata = {
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

const fallbackMaterials = {
    files: [],
    result: { src: "", title: "Makieta", caption: "Brak pliku w repo.", alt: "makieta" },
};

export default function ExamRootPage() {
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
        offers: { "@type": "Offer", price: "0", priceCurrency: "PLN", availability: "https://schema.org/InStock" },
        url,
    };

    return (
        <article
            className="lesson-page section-shell exam-lesson-page"
            data-exam-slug={examMeta.lessonSlug}
        >
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <div className="section-inner lesson-container exam-lesson-container">
                <div className="lesson-main exam-lesson-main">
                    <ExamFlowDashboardGeneric
                        meta={examMeta}
                        steps={examSteps.map((s) => ({ slug: s.slug, index: s.index, label: s.label, short: s.short, summary: s.summary, minutes: s.minutes, technologies: s.technologies }))}
                        strategy={examStrategy}
                        materials={fallbackMaterials}
                        basePath={basePath}
                    />
                </div>
            </div>
        </article>
    );
}
