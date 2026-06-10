import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { team, projects, getTeamMemberBySlug } from "@/lib/data";
import { CornerBrackets } from "@/components/ui/CornerBrackets";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { TerminalLink } from "@/components/ui/TerminalLink";

export const dynamic = "force-static";

export function generateStaticParams() {
    return team.map((member) => ({ slug: member.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const member = getTeamMemberBySlug(slug);
    if (!member) return {};
    return {
        title: `${member.name} | STEM`,
        description: member.description,
        alternates: { canonical: `/zespol/${member.slug}` },
        openGraph: { url: `/zespol/${member.slug}` }
    };
}

export default async function TeamMemberPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const member = getTeamMemberBySlug(slug);
    if (!member) notFound();

    const m = member as NonNullable<typeof member>;

    const memberProjects = projects.filter((p) => p.authorSlug === m.slug);

    return (
        <section className="team-member-page section-shell" aria-labelledby="member-name">
            <div className="section-inner">
                <p className="font-mono-industrial body-muted" style={{ marginBottom: "48px" }}>
                    <Link href="/zespol" className="terminal-link">ZESPÓŁ</Link>
                    {" / "}
                    {m.role.toUpperCase()}
                </p>

                <div className="member-hero">
                    <div className="member-portrait-frame grain-image">
                        <Image
                            src={m.image}
                            alt={`${m.name} — portret`}
                            fill
                            sizes="(max-width: 900px) 240px, 320px"
                            unoptimized
                        />
                    </div>
                    <div className="member-info-block">
                        <span className="member-role-tag font-mono-industrial">{m.role}</span>
                        <h1 id="member-name">{m.name}</h1>
                        {m.demo && (
                            <p className="demo-banner" role="note">
                                Profil demonstracyjny — przykładowe dane prezentujące układ strony.
                            </p>
                        )}
                        <p className="member-description">{m.description}</p>
                        <nav className="member-links" aria-label={`Linki: ${m.name}`}>
                            {m.github && (
                                <TerminalLink href={`https://github.com/${m.github}`} external>
                                    GITHUB →
                                </TerminalLink>
                            )}
                            {m.linkedin && (
                                <TerminalLink href={m.linkedin} external>
                                    LINKEDIN →
                                </TerminalLink>
                            )}
                        </nav>
                    </div>
                </div>

                <div className="member-projects-section">
                    <h2>PROJEKTY</h2>
                    {memberProjects.length > 0 ? (
                        <div className="member-projects-grid">
                            {memberProjects.map((project, i) => (
                                <ScrollReveal delay={i * 0.1} key={project.slug}>
                                    <Link href={`/projekt/${project.slug}`} className="member-project-card">
                                        <CornerBrackets />
                                        <p className="font-mono-industrial body-muted" style={{ margin: "0 0 6px", fontSize: "11px" }}>
                                            {project.category}
                                        </p>
                                        <h3>{project.title}</h3>
                                        <p>{project.description}</p>
                                    </Link>
                                </ScrollReveal>
                            ))}
                        </div>
                    ) : (
                        <p className="no-projects-state">
                            {"> "}BRAK PROJEKTÓW W REPOZYTORIUM — WKRÓTCE
                        </p>
                    )}
                </div>
            </div>
        </section>
    );
}
