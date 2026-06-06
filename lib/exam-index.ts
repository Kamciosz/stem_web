import type { ExamMeta } from "@/lib/exams/inf-03-egzamin-01";
import { examMeta as m01 } from "@/lib/exams/inf-03-egzamin-01";
import { examMeta as m02 } from "@/lib/exams/inf-03-egzamin-01-czerwiec-2024";
import { examMeta as m03 } from "@/lib/exams/inf-03-egzamin-01-czerwiec-2025";
import { examMeta as m04 } from "@/lib/exams/inf-03-egzamin-01-styczen-2023";
import { examMeta as m05 } from "@/lib/exams/inf-03-egzamin-01-styczen-2024";
import { examMeta as m06 } from "@/lib/exams/inf-03-egzamin-01-styczen-2025";
import { examMeta as m07 } from "@/lib/exams/inf-03-egzamin-02-czerwiec-2024";
import { examMeta as m08 } from "@/lib/exams/inf-03-egzamin-02-czerwiec-2025";
import { examMeta as m09 } from "@/lib/exams/inf-03-egzamin-02-styczen-2023";
import { examMeta as m10 } from "@/lib/exams/inf-03-egzamin-02-styczen-2024";
import { examMeta as m11 } from "@/lib/exams/inf-03-egzamin-02-styczen-2025";
import { examMeta as m12 } from "@/lib/exams/inf-03-egzamin-03-czerwiec-2024";
import { examMeta as m13 } from "@/lib/exams/inf-03-egzamin-03-czerwiec-2025";
import { examMeta as m14 } from "@/lib/exams/inf-03-egzamin-03-styczen-2023";
import { examMeta as m15 } from "@/lib/exams/inf-03-egzamin-03-styczen-2024";
import { examMeta as m16 } from "@/lib/exams/inf-03-egzamin-03-styczen-2025";
import { examMeta as m17 } from "@/lib/exams/inf-03-egzamin-04-czerwiec-2024";
import { examMeta as m18 } from "@/lib/exams/inf-03-egzamin-04-czerwiec-2025";
import { examMeta as m19 } from "@/lib/exams/inf-03-egzamin-04-styczen-2023";
import { examMeta as m20 } from "@/lib/exams/inf-03-egzamin-04-styczen-2024";
import { examMeta as m21 } from "@/lib/exams/inf-03-egzamin-04-styczen-2025";
import { examMeta as m22 } from "@/lib/exams/inf-03-egzamin-05-czerwiec-2024";
import { examMeta as m23 } from "@/lib/exams/inf-03-egzamin-05-czerwiec-2025";
import { examMeta as m24 } from "@/lib/exams/inf-03-egzamin-05-styczen-2023";
import { examMeta as m25 } from "@/lib/exams/inf-03-egzamin-05-styczen-2024";
import { examMeta as m26 } from "@/lib/exams/inf-03-egzamin-05-styczen-2025";
import { examMeta as m27 } from "@/lib/exams/inf-03-egzamin-06-czerwiec-2024";
import { examMeta as m28 } from "@/lib/exams/inf-03-egzamin-06-czerwiec-2025";
import { examMeta as m29 } from "@/lib/exams/inf-03-egzamin-06-styczen-2024";
import { examMeta as m30 } from "@/lib/exams/inf-03-egzamin-06-styczen-2025";
import { examMeta as m31 } from "@/lib/exams/inf-03-egzamin-07-czerwiec-2024";
import { examMeta as m32 } from "@/lib/exams/inf-03-egzamin-07-czerwiec-2025";
import { examMeta as m33 } from "@/lib/exams/inf-03-egzamin-07-styczen-2024";
import { examMeta as m34 } from "@/lib/exams/inf-03-egzamin-07-styczen-2025";
import { examMeta as m35 } from "@/lib/exams/inf-03-egzamin-08-czerwiec-2024";
import { examMeta as m36 } from "@/lib/exams/inf-03-egzamin-08-czerwiec-2025";
import { examMeta as m37 } from "@/lib/exams/inf-03-egzamin-08-styczen-2024";
import { examMeta as m38 } from "@/lib/exams/inf-03-egzamin-08-styczen-2025";
import { examMeta as m39 } from "@/lib/exams/inf-03-egzamin-09-czerwiec-2024";
import { examMeta as m40 } from "@/lib/exams/inf-03-egzamin-09-czerwiec-2025";
import { examMeta as m41 } from "@/lib/exams/inf-03-egzamin-09-styczen-2024";
import { examMeta as m42 } from "@/lib/exams/inf-03-egzamin-09-styczen-2025";
import { examMeta as m43 } from "@/lib/exams/inf-03-egzamin-10-czerwiec-2024";
import { examMeta as m44 } from "@/lib/exams/inf-03-egzamin-10-czerwiec-2025";
import { examMeta as m45 } from "@/lib/exams/inf-03-egzamin-10-styczen-2024";
import { examMeta as m46 } from "@/lib/exams/inf-03-egzamin-10-styczen-2025";
import { examMeta as m47 } from "@/lib/exams/inf-03-egzamin-11-czerwiec-2024";
import { examMeta as m48 } from "@/lib/exams/inf-03-egzamin-11-czerwiec-2025";
import { examMeta as m49 } from "@/lib/exams/inf-03-egzamin-11-styczen-2024";
import { examMeta as m50 } from "@/lib/exams/inf-03-egzamin-11-styczen-2025";
import { examMeta as m51 } from "@/lib/exams/inf-03-egzamin-12-czerwiec-2024";
import { examMeta as m52 } from "@/lib/exams/inf-03-egzamin-12-czerwiec-2025";
import { examMeta as m53 } from "@/lib/exams/inf-03-egzamin-12-styczen-2024";
import { examMeta as m54 } from "@/lib/exams/inf-03-egzamin-12-styczen-2025";

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

const ALL = [
    m01, m02, m03, m04, m05, m06, m07, m08, m09, m10,
    m11, m12, m13, m14, m15, m16, m17, m18, m19, m20,
    m21, m22, m23, m24, m25, m26, m27, m28, m29, m30,
    m31, m32, m33, m34, m35, m36, m37, m38, m39, m40,
    m41, m42, m43, m44, m45, m46, m47, m48, m49, m50,
    m51, m52, m53, m54,
] as unknown as ExamMeta[];

export function getExamIndex(): ExamIndexEntry[] {
    return ALL.map((m) => ({
        slug: m.lessonSlug,
        title: m.title,
        examId: m.examId,
        session: m.session,
        topic: m.topic,
        description: m.description,
        technologies: m.technologies,
        basePath: `/kursy/${m.courseId}/${m.lessonSlug}`,
        courseId: m.courseId,
    }));
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
