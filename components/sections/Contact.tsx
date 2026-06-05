import { CornerBrackets } from "@/components/ui/CornerBrackets";
import { MonolithDivider } from "@/components/ui/MonolithDivider";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { TerminalLink } from "@/components/ui/TerminalLink";

type ContactProps = {
    fullPage?: boolean;
};

export function Contact({ fullPage = false }: ContactProps) {
    const HeadingTag = fullPage ? "h1" : "h2";

    return (
        <section className={`contact-section ${fullPage ? "contact-full" : ""}`} aria-labelledby="contact-title">
            {!fullPage && <MonolithDivider />}
            <div className="section-shell">
                <div className="section-inner contact-frame bracket-active">
                    <CornerBrackets />
                    <ScrollReveal as="div" className="contact-copy">
                        <p className="font-mono-industrial body-muted">TRANSMISSION / CONTACT</p>
                        <HeadingTag className="headline-large" id="contact-title">
                            KONTAKT
                        </HeadingTag>
                        <form className="contact-form" action="mailto:kontakt@stem-kolo.pl" method="post" encType="text/plain">
                            <p className="field">
                                <label htmlFor={fullPage ? "name-full" : "name-home"}>Name</label>
                                <input id={fullPage ? "name-full" : "name-home"} name="name" type="text" autoComplete="name" required />
                            </p>
                            <p className="field">
                                <label htmlFor={fullPage ? "email-full" : "email-home"}>Email</label>
                                <input id={fullPage ? "email-full" : "email-home"} name="email" type="email" autoComplete="email" required />
                            </p>
                            <p className="field">
                                <label htmlFor={fullPage ? "subject-full" : "subject-home"}>Subject</label>
                                <input id={fullPage ? "subject-full" : "subject-home"} name="subject" type="text" required />
                            </p>
                            <p className="field">
                                <label htmlFor={fullPage ? "message-full" : "message-home"}>Message</label>
                                <textarea id={fullPage ? "message-full" : "message-home"} name="message" required />
                            </p>
                            <button className="industrial-button" type="submit">
                                WYŚLIJ SYGNAŁ
                            </button>
                        </form>
                    </ScrollReveal>
                    <ScrollReveal as="aside" className="contact-info" delay={0.15}>
                        <dl>
                            <div>
                                <dt>EMAIL</dt>
                                <dd>kontakt@stem-kolo.pl</dd>
                            </div>
                            <div>
                                <dt>DISCORD</dt>
                                <dd>
                                    <TerminalLink href="https://discord.com" external>
                                        STEM DISCORD →
                                    </TerminalLink>
                                </dd>
                            </div>
                            <div>
                                <dt>TEAMS</dt>
                                <dd>
                                    <TerminalLink href="https://www.microsoft.com/microsoft-teams" external>
                                        STEM TEAMS →
                                    </TerminalLink>
                                </dd>
                            </div>
                            <div>
                                <dt>LOCATION</dt>
                                <dd>WARSZAWA, UL. MIŃSKA 25</dd>
                            </div>
                        </dl>
                    </ScrollReveal>
                </div>
            </div>
        </section>
    );
}
