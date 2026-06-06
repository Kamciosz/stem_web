import Link from "next/link";
import { terminalLogs } from "@/lib/data";
import { MonolithDivider } from "@/components/ui/MonolithDivider";

export function Footer() {
    return (
        <footer className="site-footer">
            <MonolithDivider />
            <section className="footer-grid" aria-label="Stopka STEM">
                <div className="footer-col">
                    <p className="font-mono-industrial footer-copyright">© 2026 STEM</p>
                    <p className="footer-location font-mono-industrial">WARSZAWA, UL. MIŃSKA 25</p>
                </div>
                <nav className="footer-col" aria-label="Nauka">
                    <p className="footer-heading">Nauka</p>
                    <ul className="footer-links">
                        <li>
                            <Link href="/egzaminy">Wszystkie egzaminy (54)</Link>
                        </li>
                        <li>
                            <Link href="/progres">Twoj progres</Link>
                        </li>
                        <li>
                            <Link href="/notatki">Notatki</Link>
                        </li>
                        <li>
                            <Link href="/kursy/inf-03">Kurs INF.03</Link>
                        </li>
                    </ul>
                </nav>
                <nav className="footer-col" aria-label="Projekty">
                    <p className="footer-heading">Projekty</p>
                    <ul className="footer-links">
                        <li>
                            <Link href="/projekty">Lista projektów</Link>
                        </li>
                        <li>
                            <Link href="/zespol">Zespół</Link>
                        </li>
                        <li>
                            <Link href="/partnerzy">Partnerzy</Link>
                        </li>
                        <li>
                            <Link href="/kontakt">Kontakt</Link>
                        </li>
                    </ul>
                </nav>
                <div className="footer-col">
                    <p className="footer-heading">Status systemu</p>
                    <ul className="footer-feed terminal-feed" aria-label="Status systemu">
                        {terminalLogs.map((log, i) => (
                            <li key={log}>
                                {log}
                                {i === terminalLogs.length - 1 && (
                                    <span className="terminal-blink" aria-hidden="true">▋</span>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
                <nav className="footer-col footer-socials" aria-label="Linki społecznościowe">
                    <p className="footer-heading">Social</p>
                    <ul className="footer-links footer-social-links">
                        <li>
                            <a href="https://github.com/Kamciosz" target="_blank" rel="noreferrer" aria-label="GitHub">
                                GitHub
                            </a>
                        </li>
                        <li>
                            <a href="https://www.linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn">
                                LinkedIn
                            </a>
                        </li>
                    </ul>
                </nav>
            </section>
        </footer>
    );
}
