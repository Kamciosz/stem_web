import Image from "next/image";
import { team } from "@/lib/data";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { TerminalLink } from "@/components/ui/TerminalLink";

export function TeamPreview() {
    return (
        <section className="team-preview section-shell" aria-labelledby="team-preview-title">
            <div className="section-inner">
                <ScrollReveal as="header" className="team-heading">
                    <p className="font-mono-industrial body-muted">CREW / ACTIVE MEMBERS</p>
                    <h2 className="headline-large" id="team-preview-title">
                        ZESPÓŁ
                    </h2>
                </ScrollReveal>
                <div className="team-preview-grid">
                    {team.slice(0, 5).map((member, index) => (
                        <ScrollReveal as="article" className="team-preview-card" delay={index * 0.12} key={member.slug}>
                            <figure className="team-portrait grain-image">
                                <Image src={member.image} alt={`${member.name} — portret`} fill sizes="(max-width: 620px) 100vw, 20vw" unoptimized />
                            </figure>
                            <h3>{member.name}</h3>
                            <p>{member.role}</p>
                        </ScrollReveal>
                    ))}
                </div>
                <TerminalLink href="/zespol">POZNAJ CAŁY ZESPÓŁ →</TerminalLink>
            </div>
        </section>
    );
}
