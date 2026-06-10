import Image from "next/image";
import { projects } from "@/lib/data";
import { getGithubStatsMap } from "@/lib/github";
import { DepthCard } from "@/components/ui/DepthCard";
import { MonolithDivider } from "@/components/ui/MonolithDivider";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { TerminalLink } from "@/components/ui/TerminalLink";

export async function Projects() {
    const featuredProjects = projects.filter((project) => project.featured).slice(0, 3);
    const stats = await getGithubStatsMap(featuredProjects);

    return (
        <section className="projects-section" aria-labelledby="projects-title">
            <MonolithDivider />
            <div className="section-shell section-number-reveal">
                <ScrollReveal as="span" className="background-number">
                    02
                </ScrollReveal>
                <div className="section-inner projects-inner">
                    <ScrollReveal as="header" className="projects-heading">
                        <p className="font-mono-industrial body-muted">SECTION 02 / PROJECTS</p>
                        <h2 className="headline-large" id="projects-title">
                            WYBRANE PROJEKTY
                        </h2>
                    </ScrollReveal>
                    <div className="featured-projects">
                        {featuredProjects.map((project, index) => {
                            const side = index % 2 === 0 ? "left" : "right";
                            const projectStats = stats[project.slug];
                            return (
                                <ScrollReveal as="div" className={`project-feature project-feature-${side}`} delay={index * 0.15} key={project.slug}>
                                    <figure className={`project-image grain-image image-reveal-${side}`}>
                                        <Image src={project.image} alt={`${project.title} — wizual projektu`} fill sizes="(max-width: 900px) 100vw, 60vw" unoptimized />
                                    </figure>
                                    <DepthCard className="project-card">
                                        <p className="font-mono-industrial body-muted">{project.category}</p>
                                        <h3 className="headline-medium">{project.title}</h3>
                                        {project.demo && (
                                            <span className="demo-tag" title="Projekt demonstracyjny — przykładowe dane">
                                                Projekt demonstracyjny
                                            </span>
                                        )}
                                        <p>{project.description}</p>
                                        <dl className="project-terminal terminal-feed">
                                            <div>
                                                <dt>STARS</dt>
                                                <dd>{projectStats.stars}</dd>
                                            </div>
                                            <div>
                                                <dt>LANG</dt>
                                                <dd>{projectStats.language}</dd>
                                            </div>
                                            <div>
                                                <dt>COMMIT</dt>
                                                <dd>{projectStats.lastCommit}</dd>
                                            </div>
                                        </dl>
                                        <TerminalLink href={`/projekt/${project.slug}`}>ZOBACZ PROJEKT →</TerminalLink>
                                        <footer className="project-author">
                                            <Image src={`/images/team-${project.authorSlug}.svg`} alt="" width={40} height={40} unoptimized />
                                            <span>
                                                {project.author}
                                                {project.authorNickname ? ` (${project.authorNickname})` : ""}
                                            </span>
                                        </footer>
                                    </DepthCard>
                                </ScrollReveal>
                            );
                        })}
                    </div>
                    <TerminalLink href="/projekty" className="all-projects-link">
                        ZOBACZ WSZYSTKIE PROJEKTY →
                    </TerminalLink>
                </div>
            </div>
        </section>
    );
}
