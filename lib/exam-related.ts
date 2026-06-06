/**
 * Related exams - heurystyczne powiazanie egzaminow.
 * Score'uje kazdy inny egzamin po:
 *   - tej samej technologii (np. PHP) +3
 *   - tej samej sesji (np. Styczen 2025) +5
 *   - pokrewnym temacie (np. Obuwie) +1
 */

import type { ExamIndexEntry } from "./exam-index";

type ExamLike = {
    slug: string;
    title: string;
    examId: string;
    session: string;
    topic: string;
    description?: string;
    technologies: string[];
    basePath?: string;
    courseId?: string;
};

export function findRelated(current: ExamLike, entries: ExamLike[], limit = 4): ExamLike[] {
    const currentTechs = new Set(current.technologies.map((t) => t.toLowerCase()));
    const scored = entries
        .filter((e) => e.slug !== current.slug)
        .map((e) => {
            let score = 0;
            if (e.session === current.session) score += 5;
            const eTechs = new Set(e.technologies.map((t) => t.toLowerCase()));
            for (const t of eTechs) if (currentTechs.has(t)) score += 3;
            // Bonus za te same technologie 2+
            if ([...eTechs].filter((t) => currentTechs.has(t)).length >= 2) score += 2;
            return { e, score };
        })
        .filter((s) => s.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, limit);
    return scored.map((s) => s.e);
}
