import Link from "next/link";

export const metadata = {
    title: "404 — strona nie istnieje | STEM",
    description: "Nie znaleźliśmy tej strony. Sprawdź nasze kursy, egzaminy lub progres.",
    robots: { index: false, follow: false },
};

export default function NotFound() {
    return (
        <article className="not-found-page section-shell">
            <div className="section-inner not-found-container">
                <p className="not-found-eyebrow">404</p>
                <h1 className="not-found-title">Nie znaleźliśmy tej strony</h1>
                <p className="not-found-lead">
                    Strona mogła zostać przeniesiona, usunięta lub link jest nieaktualny.
                </p>
                <nav className="not-found-actions" aria-label="Sugerowane strony">
                    <Link href="/" className="not-found-btn primary">Strona główna</Link>
                    <Link href="/egzaminy" className="not-found-btn">Wszystkie egzaminy</Link>
                    <Link href="/progres" className="not-found-btn">Twój progres</Link>
                    <Link href="/kursy/inf-03" className="not-found-btn">Kurs INF.03</Link>
                </nav>
                <div className="not-found-search">
                    <p className="not-found-search-hint">Szybki dostęp (Ctrl/Cmd + K):</p>
                </div>
            </div>
        </article>
    );
}
