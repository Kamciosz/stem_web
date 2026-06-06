import Link from "next/link";
import { findRelated } from "@/lib/exam-related";
import { getExamIndex } from "@/lib/exam-index";

type Entry = {
    slug: string;
    title: string;
    examId: string;
    session: string;
    topic: string;
    description?: string;
    technologies: string[];
    basePath: string;
    courseId: string;
};

export function RelatedExams({ current }: { current: Entry }) {
    const all = getExamIndex();
    const related = findRelated(current, all, 4);
    if (related.length === 0) return null;

    return (
        <section className="related-exams" aria-label="Powiazane arkusze">
            <h2 className="related-exams-title">Powiazane arkusze</h2>
            <p className="related-exams-lead">
                Te same technologie lub sesja. Uzyj ich do przećwiczenia podobnych problemów.
            </p>
            <ol className="related-exams-grid">
                {related.map((r) => {
                    const href = r.basePath ?? `/kursy/${r.courseId ?? "inf-03"}/${r.slug}`;
                    return (
                    <li key={r.slug}>
                        <Link href={href} className="related-exams-card">
                            <span className="related-exams-id">{r.examId}</span>
                            <strong className="related-exams-card-title">{r.title}</strong>
                            <span className="related-exams-meta">
                                {r.session} · {r.technologies.join(" · ")}
                            </span>
                            <span className="related-exams-cta" aria-hidden="true">→</span>
                        </Link>
                    </li>
                    );
                })}
            </ol>
        </section>
    );
}
