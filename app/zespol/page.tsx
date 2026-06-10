import Image from "next/image";
import Link from "next/link";
import { team } from "@/lib/data";
import { CornerBrackets } from "@/components/ui/CornerBrackets";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

export const dynamic = "force-static";

export const metadata = {
    title: "Zespół | STEM",
    description: "Poznaj zespół koła technologicznego STEM — uczniowie technikum specjalizujący się w robotyce, mechatronice i programowaniu.",
    alternates: { canonical: "/zespol" },
    openGraph: { url: "/zespol" }
};

export default function TeamPage() {
    return (
        <section className="team-page section-shell" aria-labelledby="team-title">
            <div className="section-inner">
                <header className="page-header">
                    <p className="font-mono-industrial body-muted">CREW / FULL GRID</p>
                    <h1 className="headline-large" id="team-title">
                        ZESPÓŁ
                    </h1>
                </header>
                <div className="team-grid">
                    {team.map((member, index) => (
                        <ScrollReveal as="article" className="team-card depth-card" delay={index * 0.08} id={member.slug} key={member.slug}>
                            <CornerBrackets />
                            <Link href={`/zespol/${member.slug}`} className="team-portrait-link" aria-label={`Profil: ${member.name}`}>
                                <figure className="team-portrait grain-image">
                                    <Image src={member.image} alt={`${member.name} — portret`} fill sizes="(max-width: 620px) 100vw, (max-width: 900px) 50vw, 25vw" unoptimized />
                                </figure>
                            </Link>
                            <div className="team-card-body">
                                <Link href={`/zespol/${member.slug}`} className="team-member-link">
                                    <span>{member.name}</span>
                                    <small>{member.role}</small>
                                </Link>
                                {member.demo && (
                                    <span className="demo-tag" title="Profil demonstracyjny — przykładowe dane">
                                        Profil demonstracyjny
                                    </span>
                                )}
                            </div>
                        </ScrollReveal>
                    ))}
                </div>
            </div>
        </section>
    );
}
