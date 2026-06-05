import { MetadataRoute } from "next";
import { courseDetails } from "@/lib/courses";
import { projects } from "@/lib/data";

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = "https://stem-web-569q.vercel.app";
    const now = new Date();

    // Static pages
    const staticPages: MetadataRoute.Sitemap = [
        { url: baseUrl, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
        { url: `${baseUrl}/kursy`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
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

    return [...staticPages, ...coursePages, ...lessonPages, ...projectPages];
}
