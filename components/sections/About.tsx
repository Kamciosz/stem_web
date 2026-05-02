import Image from "next/image";
import { pillars } from "@/lib/data";
import { MonolithDivider } from "@/components/ui/MonolithDivider";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

export function About() {
    return (
        <section className="about-section" aria-labelledby="about-title">
            <MonolithDivider />
            <div className="section-shell section-number-reveal">
                <ScrollReveal as="span" className="background-number">
                    01
                </ScrollReveal>
                <div className="section-inner about-grid">
                    <ScrollReveal as="div" className="about-copy">
                        <p className="font-mono-industrial body-muted">SECTION 01 / ABOUT</p>
                        <h2 className="headline-large" id="about-title">
                            KOŁO TECHNOLOGICZNE STEM
                        </h2>
                        <p className="about-lead">
                            Jesteśmy grupą uczniów technikum zafascynowanych technologią. Łączy nas pasja do tworzenia — od lutownicy po commita.
                        </p>
                        <ul className="pillar-list">
                            {pillars.map((pillar) => (
                                <li key={pillar.label}>
                                    <span className="font-mono-industrial">{pillar.label}</span>
                                    <p>{pillar.text}</p>
                                </li>
                            ))}
                        </ul>
                    </ScrollReveal>
                    <ScrollReveal as="figure" className="about-image grain-image image-reveal-right" delay={0.15}>
                        <Image src="/images/workshop.svg" alt="Czarno-biały warsztat technologiczny" fill sizes="(max-width: 900px) 100vw, 55vw" unoptimized />
                    </ScrollReveal>
                </div>
            </div>
        </section>
    );
}
