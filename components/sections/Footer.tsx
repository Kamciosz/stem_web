import { terminalLogs } from "@/lib/data";
import { MonolithDivider } from "@/components/ui/MonolithDivider";

export function Footer() {
    return (
        <footer className="site-footer">
            <MonolithDivider />
            <section className="footer-grid" aria-label="Stopka STEM">
                <p className="font-mono-industrial">© 2026 STEM</p>
                <p className="footer-location font-mono-industrial">WARSZAWA, UL. MIŃSKA 25</p>
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
                <nav className="footer-socials" aria-label="Linki społecznościowe">
                    <a href="https://github.com/Kamciosz" target="_blank" rel="noreferrer" aria-label="GitHub">
                        GH
                    </a>
                    <a href="https://www.linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn">
                        IN
                    </a>
                </nav>
            </section>
        </footer>
    );
}
