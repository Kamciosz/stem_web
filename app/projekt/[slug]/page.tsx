import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { projects, getProjectBySlug, getTeamMemberBySlug } from "@/lib/data";
import { getGithubStats } from "@/lib/github";
import { CornerBrackets } from "@/components/ui/CornerBrackets";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { TerminalLink } from "@/components/ui/TerminalLink";

type ProjectPageProps = {
    params: Promise<{
        slug: string;
    }>;
};

export const dynamic = "force-static";

export function generateStaticParams() {
    return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
    const { slug } = await params;
    const project = getProjectBySlug(slug);

    if (!project) {
        return {
            title: "Projekt | STEM"
        };
    }

    return {
        title: `${project.title} | STEM`,
        description: project.description,
        alternates: { canonical: `/projekt/${project.slug}` },
        openGraph: { url: `/projekt/${project.slug}` }
    };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
    const { slug } = await params;
    const project = getProjectBySlug(slug);

    if (!project) {
        notFound();
    }

    const proj = project as NonNullable<typeof project>;

    const stats = await getGithubStats(proj);
    const author = getTeamMemberBySlug(proj.authorSlug);

    return (
        <article className="project-detail-page">
            <figure className="project-detail-hero grain-image">
                <Image src={proj.image} alt={`${proj.title} — obraz projektu`} fill sizes="100vw" priority unoptimized />
            </figure>
            <section className="section-shell project-detail-shell" aria-labelledby="project-detail-title">
                <div className="section-inner project-detail-frame bracket-active">
                    <CornerBrackets />
                    <ScrollReveal as="div" className="project-detail-copy">
                        <p className="font-mono-industrial body-muted">{proj.category}</p>
                        <h1 className="headline-large" id="project-detail-title">
                            {proj.title}
                        </h1>
                        {proj.demo && (
                            <p className="demo-banner" role="note">
                                Projekt demonstracyjny — przykładowe dane prezentujące układ strony.
                            </p>
                        )}
                        <p>{proj.description}</p>
                    </ScrollReveal>
                    <ScrollReveal as="aside" className="project-sidebar" delay={0.15}>
                        <dl className="terminal-feed detail-terminal">
                            <div>
                                <dt>STARS</dt>
                                <dd>{stats.stars}</dd>
                            </div>
                            <div>
                                <dt>PRIMARY LANGUAGE</dt>
                                <dd>{stats.language}</dd>
                            </div>
                            <div>
                                <dt>LAST COMMIT</dt>
                                <dd>{stats.lastCommit}</dd>
                            </div>
                        </dl>
                        {author && (
                            <TerminalLink href={`/zespol#${author.slug}`} className="detail-author-link">
                                <Image src={author.image} alt="" width={40} height={40} unoptimized />
                                {proj.author}
                            </TerminalLink>
                        )}
                        {proj.githubUrl && (
                            <TerminalLink href={proj.githubUrl} external>
                                REPOZYTORIUM →
                            </TerminalLink>
                        )}
                    </ScrollReveal>
                </div>
            </section>
        </article>
    );
}
