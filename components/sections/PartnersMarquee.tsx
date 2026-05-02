import Link from "next/link";
import { partners } from "@/lib/data";

const placeholders = ["SZUKAMY PARTNERÓW", "TECH SUPPORT", "INDUSTRY NODE", "LAB ACCESS", "MENTORING"];

export function PartnersMarquee() {
    const marqueeItems = partners.length > 0 ? partners.map((partner) => partner.name) : placeholders;

    return (
        <section className="partners-marquee" aria-labelledby="partners-marquee-title">
            <div className="section-inner">
                <p className="font-mono-industrial body-muted" id="partners-marquee-title">
                    PARTNERZY
                </p>
                <Link href="/partnerzy" className="marquee-track" aria-label="Przejdź do strony partnerów">
                    <span>
                        {[...marqueeItems, ...marqueeItems].map((item, index) => (
                            <b key={`${item}-${index}`}>{item}</b>
                        ))}
                    </span>
                </Link>
                <p className="awards-hidden font-mono-industrial">NAGRODY — WKRÓTCE</p>
            </div>
        </section>
    );
}
