import type { Metadata } from "next";
import { examMeta } from "@/lib/exams/inf-03-egzamin-03-styczen-2025";
import { ExamFlowDashboard } from "@/components/courses/examflow/ExamFlowDashboard";

export const dynamic = "force-static";

const baseUrl = "https://stem-web-569q.vercel.app";
const url = `${baseUrl}/kursy/${examMeta.courseId}/${examMeta.lessonSlug}`;

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

export default function ExamRoot() {
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
        url,
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <ExamFlowDashboard />
        </>
    );
}
