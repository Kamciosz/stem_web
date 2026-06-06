import Link from "next/link";

type StepView = {
    slug: string;
    index: number;
    label: string;
    short: string;
    summary: string;
    minutes: string;
    technologies: string[];
};

export function StageNav({
    steps,
    currentSlug,
    basePath,
}: {
    steps: StepView[];
    currentSlug: string;
    basePath: string;
}) {
    const idx = steps.findIndex((s) => s.slug === currentSlug);
    const prev = idx > 0 ? steps[idx - 1] : null;
    const next = idx >= 0 && idx < steps.length - 1 ? steps[idx + 1] : null;

    return (
        <nav className="stage-nav" aria-label="Nawigacja miedzy etapami">
            <div className="stage-nav-side">
                {prev ? (
                    <Link href={`${basePath}/${prev.slug}`} className="stage-nav-card stage-nav-prev">
                        <span className="stage-nav-kicker">← Poprzedni etap</span>
                        <strong className="stage-nav-title">{prev.label}</strong>
                        <span className="stage-nav-summary">{prev.short}</span>
                    </Link>
                ) : (
                    <span className="stage-nav-empty" aria-hidden="true" />
                )}
            </div>
            <div className="stage-nav-side">
                {next ? (
                    <Link href={`${basePath}/${next.slug}`} className="stage-nav-card stage-nav-next">
                        <span className="stage-nav-kicker">Nastepny etap →</span>
                        <strong className="stage-nav-title">{next.label}</strong>
                        <span className="stage-nav-summary">{next.short}</span>
                    </Link>
                ) : (
                    <Link href={basePath} className="stage-nav-card stage-nav-done">
                        <span className="stage-nav-kicker">✓ Wroc do podsumowania</span>
                        <strong className="stage-nav-title">Arkusz ukończony</strong>
                        <span className="stage-nav-summary">Wróc do dashboard i wybierz nastepny etap</span>
                    </Link>
                )}
            </div>
        </nav>
    );
}
