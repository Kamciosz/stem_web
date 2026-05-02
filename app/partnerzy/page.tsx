import Image from "next/image";
import { partners } from "@/lib/data";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { TerminalLink } from "@/components/ui/TerminalLink";

export const dynamic = "force-static";

const benefits = [
    {
        label: "LAB ACCESS",
        desc: "Udostępnij przestrzeń roboczą, narzędzia lub komponenty sprzętowe dla naszych projektów."
    },
    {
        label: "MENTORING",
        desc: "Podziel się wiedzą branżową — warsztaty, konsultacje, code review od specjalistów."
    },
    {
        label: "INDUSTRY NODE",
        desc: "Pokaż uczniom jak wygląda praca w technologii — wizyty studyjne, praktyki, staże."
    },
    {
        label: "TECH SUPPORT",
        desc: "Wspomóż nas licencjami, oprogramowaniem lub sprzętem potrzebnym do realizacji projektów."
    }
];

export default function PartnersPage() {
    return (
        <section className="partners-page section-shell" aria-labelledby="partners-title">
            <div className="section-inner">
                <header className="partners-cta">
                    <p className="font-mono-industrial body-muted">PARTNER NODE / OPEN</p>
                    <h1 className="headline-large" id="partners-title">
                        SZUKAMY PARTNERÓW
                    </h1>
                    <p style={{ maxWidth: 600, color: "var(--recede)", lineHeight: 1.7, marginTop: 16, marginBottom: 0 }}>
                        Jesteśmy kołem uczniowskim, które tworzy realny hardware i software. Szukamy firm i organizacji, które chcą wspierać rozwój młodych inżynierów — i zyskać kontakt z pokoleniem, które wchodzi właśnie na rynek.
                    </p>
                </header>

                <div className="partner-why-grid">
                    {benefits.map((b, i) => (
                        <ScrollReveal as="div" className="partner-why-card" delay={i * 0.1} key={b.label}>
                            <h3>{b.label}</h3>
                            <p>{b.desc}</p>
                        </ScrollReveal>
                    ))}
                </div>

                <div style={{ marginBottom: 64, borderTop: "1px solid #1f1f1f", paddingTop: 48 }}>
                    <p className="font-mono-industrial body-muted" style={{ marginBottom: 24 }}>ZOSTAŃ PARTNEREM</p>
                    <p style={{ color: "var(--recede)", lineHeight: 1.7, maxWidth: 540, marginBottom: 32 }}>
                        Skontaktuj się z nami, żebyśmy mogli omówić formę współpracy dopasowaną do Twoich możliwości i potrzeb projektu.
                    </p>
                    <TerminalLink href="/kontakt">NAPISZ DO NAS →</TerminalLink>
                </div>

                {partners.length > 0 && (
                    <>
                        <p className="font-mono-industrial body-muted" style={{ marginBottom: 32 }}>AKTUALNI PARTNERZY</p>
                        <div className="partners-list">
                            {partners.map((partner, index) => (
                                <ScrollReveal as="article" className="partner-row" delay={index * 0.1} key={partner.name}>
                                    <Image src={partner.logo} alt={`${partner.name} — logo`} width={220} height={96} unoptimized />
                                    <div>
                                        <h2>{partner.name}</h2>
                                        <p>{partner.description}</p>
                                        <TerminalLink href={partner.website} external>
                                            STRONA PARTNERA →
                                        </TerminalLink>
                                    </div>
                                </ScrollReveal>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </section>
    );
}
