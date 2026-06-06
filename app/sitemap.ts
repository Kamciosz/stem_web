import { MetadataRoute } from "next";
import { promises as fs } from "fs";
import path from "path";
import { courseDetails } from "@/lib/courses";
import { projects } from "@/lib/data";

const EXAM_STEPS = ["baza-danych", "html-php", "css", "kontrola"] as const;

async function discoverExamSlugs(): Promise<string[]> {
    const base = path.join(process.cwd(), "app/kursy/inf-03");
    try {
        const entries = await fs.readdir(base, { withFileTypes: true });
        return entries
            .filter((e) => e.isDirectory() && e.name.startsWith("egzamin-"))
            .map((e) => e.name)
            .sort();
    } catch {
        return [];
    }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = "https://stem-web-569q.vercel.app";
    const now = new Date();

    // Static pages
    const staticPages: MetadataRoute.Sitemap = [
        { url: baseUrl, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
        { url: `${baseUrl}/kursy`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
        { url: `${baseUrl}/progres`, lastModified: now, changeFrequency: "daily", priority: 0.6 },
        { url: `${baseUrl}/egzaminy`, lastModified: now, changeFrequency: "daily", priority: 0.8 },
        { url: `${baseUrl}/projekty`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
        { url: `${baseUrl}/zespol`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
        { url: `${baseUrl}/partnerzy`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
        { url: `${baseUrl}/kontakt`, lastModified: now, changeFrequency: "yearly", priority: 0.5 }
    ];

    // Course pages
    const coursePages: MetadataRoute.Sitemap = courseDetails.map((course) => ({
        url: `${baseUrl}/kursy/${course.id}`,
        lastModified: now,
        changeFrequency: "weekly" as const,
        priority: 0.8
    }));

    // Lesson pages (only published)
    const lessonPages: MetadataRoute.Sitemap = courseDetails.flatMap((course) =>
        course.modules.flatMap((module) =>
            module.lessons
                .filter((lesson) => lesson.published)
                .map((lesson) => ({
                    url: `${baseUrl}/kursy/${course.id}/${lesson.slug}`,
                    lastModified: now,
                    changeFrequency: "monthly" as const,
                    priority: 0.7
                }))
        )
    );

    // Project pages
    const projectPages: MetadataRoute.Sitemap = projects.map((project) => ({
        url: `${baseUrl}/projekt/${project.slug}`,
        lastModified: now,
        changeFrequency: "monthly" as const,
        priority: 0.7
    }));

    // Exam dashboard pages (egzamin-XX-YYY) + 4 stage pages each
    const examSlugs = await discoverExamSlugs();
    const examPages: MetadataRoute.Sitemap = examSlugs.flatMap((slug) => {
        const base = `${baseUrl}/kursy/inf-03/${slug}`;
        return [
            { url: base, lastModified: now, changeFrequency: "monthly" as const, priority: 0.7 },
            ...EXAM_STEPS.map((step) => ({
                url: `${base}/${step}`,
                lastModified: now,
                changeFrequency: "monthly" as const,
                priority: 0.6
            }))
        ];
    });

    return [...staticPages, ...coursePages, ...lessonPages, ...projectPages, ...examPages];
}
