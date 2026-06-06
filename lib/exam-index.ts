export type ExamIndexEntry = {
    slug: string;
    title: string;
    examId: string;
    session: string;
    topic: string;
    description: string;
    technologies: string[];
    basePath: string;
    courseId: string;
};

import { promises as fs } from "fs";
import path from "path";
import { examMeta as m01 } from "@/lib/exams/inf-03-egzamin-01";

const SESSIONS = [
    "styczen-2023",
    "czerwiec-2024",
    "styczen-2024",
    "czerwiec-2025",
    "styczen-2025",
    "styczen-2026",
] as const;

let _cache: ExamIndexEntry[] | null = null;

export async function getExamIndex(): Promise<ExamIndexEntry[]> {
    if (_cache) return _cache;

    const baseUrl = "https://stem-web-569q.vercel.app";
    const out: ExamIndexEntry[] = [];

    // Prototyp 01-styczen-2026 z dedykowanego lib
    out.push({
        slug: m01.lessonSlug,
        title: m01.title,
        examId: m01.examId,
        session: m01.session,
        topic: m01.topic,
        description: m01.description,
        technologies: m01.technologies,
        basePath: `/kursy/${m01.courseId}/${m01.lessonSlug}`,
        courseId: m01.courseId,
    });

    // Reszta z plikow na dysku (unika koniecznosci importu 53 lib modules)
    for (const num of Array.from({ length: 12 }, (_, i) => i + 1)) {
        for (const sess of SESSIONS) {
            if (num === 1 && sess === "styczen-2026") continue; // juz dodany
            const slug = `egzamin-${String(num).padStart(2, "0")}-${sess}`;
            const libPath = path.join(process.cwd(), "lib/exams", `inf-03-${slug}.ts`);
            try {
                await fs.access(libPath);
            } catch {
                continue;
            }
            try {
                const mod = await import(`@/lib/exams/inf-03-${slug}`);
                const meta = mod.examMeta;
                out.push({
                    slug: meta.lessonSlug,
                    title: meta.title,
                    examId: meta.examId,
                    session: meta.session,
                    topic: meta.topic,
                    description: meta.description,
                    technologies: meta.technologies,
                    basePath: `/kursy/${meta.courseId}/${meta.lessonSlug}`,
                    courseId: meta.courseId,
                });
            } catch {
                /* skip */
            }
        }
    }

    _cache = out;
    return out;
}

export function searchExams(entries: ExamIndexEntry[], q: string, limit = 20): ExamIndexEntry[] {
    if (!q.trim()) return entries.slice(0, limit);
    const needle = q.toLowerCase();
    const tokens = needle.split(/\s+/).filter(Boolean);
    const scored = entries
        .map((e) => {
            const haystack = `${e.title} ${e.examId} ${e.session} ${e.topic} ${e.description} ${e.technologies.join(" ")}`.toLowerCase();
            let score = 0;
            for (const t of tokens) {
                if (!haystack.includes(t)) return null;
                score += 1;
                if (e.title.toLowerCase().includes(t)) score += 2;
                if (e.examId.toLowerCase().includes(t)) score += 3;
            }
            return { e, score };
        })
        .filter((x): x is { e: ExamIndexEntry; score: number } => x !== null)
        .sort((a, b) => b.score - a.score)
        .slice(0, limit);
    return scored.map((s) => s.e);
}
