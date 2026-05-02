import { TypewriterText } from "@/components/ui/TypewriterText";

export function Hero() {
    return (
        <section className="hero-section" aria-labelledby="hero-title">
            <div className="hero-copy">
                <p className="hero-subtitle font-mono-industrial" aria-label="KOŁO TECHNOLOGICZNE">
                    <TypewriterText text="KOŁO TECHNOLOGICZNE" delay={0.6} speed={48} />
                </p>
                <h1 className="display-title hero-title" id="hero-title">
                    <span className="glitch-text" data-text="STEM">STEM</span>
                </h1>
                <p className="hero-description">Uczniowie technikum tworzący w hardware i software.</p>
            </div>
            <div className="scroll-indicator" aria-hidden="true">
                <svg width="2" height="96" viewBox="0 0 2 96" role="img">
                    <line x1="1" y1="0" x2="1" y2="96" />
                </svg>
                <span>SCROLL</span>
            </div>
        </section>
    );
}
