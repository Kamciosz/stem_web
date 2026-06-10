import Image from "next/image";
import Link from "next/link";
import { projects } from "@/lib/data";
import { getGithubStatsMap } from "@/lib/github";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

export const dynamic = "force-static";

export const metadata = {
    title: "Projekty | STEM",
    description: "Projekty koła technologicznego STEM — robotyka, mechatronika i programowanie. Autonomiczne roboty, automatyzacja, aplikacje webowe i PWA tworzone przez uczniów technikum.",
    alternates: { canonical: "/projekty" },
    openGraph: { url: "/projekty" }
};

export default async function ProjectsPage() {
    const stats = await getGithubStatsMap(projects);

    return (
        <section className="projects-list-page section-shell" aria-labelledby="projects-list-title">
            <div className="section-inner">
                <header className="page-header">
                    <p className="font-mono-industrial body-muted">ARCHIVE / PROJECTS</p>
                    <h1 className="headline-large" id="projects-list-title">
                        PROJEKTY
                    </h1>
                </header>
                <div className="project-row-list">
                    {projects.map((project, index) => (
                        <ScrollReveal as="article" className="project-row" delay={index * 0.1} key={project.slug}>
                            <Link href={`/projekt/${project.slug}`}>
                                <span className="project-row-title">
                                    {project.title}
                                    {project.demo && <span className="demo-tag demo-tag-inline">demo</span>}
                                </span>
                                <span className="project-row-meta font-mono-industrial">{project.category}</span>
                                <span className="project-row-feed terminal-feed">
                                    {stats[project.slug].language} / {stats[project.slug].stars} STARS / {stats[project.slug].lastCommit}
                                </span>
                                <span className="project-row-thumb grain-image" aria-hidden="true">
                                    <Image src={project.image} alt="" fill sizes="320px" unoptimized />
                                </span>
                            </Link>
                        </ScrollReveal>
                    ))}
                </div>
            </div>
        </section>
    );
}
