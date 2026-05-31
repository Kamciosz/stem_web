type VideoEmbedProps = {
    /** Źródło wideo */
    provider: "youtube" | "cloudflare";
    /** YouTube: ID filmu (np. "dQw4w9WgXcQ"). Cloudflare: video UID. */
    id: string;
    /** Cloudflare Stream: subdomena customer-<code> (z dashboardu). Wymagane dla provider="cloudflare". */
    customerCode?: string;
    title?: string;
};

/**
 * Osadzanie wideo w lekcji. Obsługuje YouTube oraz Cloudflare Stream (VOD).
 * Użycie w MDX:
 *   <VideoEmbed provider="youtube" id="dQw4w9WgXcQ" title="Wstęp do HTML" />
 *   <VideoEmbed provider="cloudflare" id="a1b2c3..." customerCode="abcd1234" title="CSS Grid" />
 */
export function VideoEmbed({ provider, id, customerCode, title }: VideoEmbedProps) {
    let src: string | null = null;

    if (provider === "youtube") {
        src = `https://www.youtube-nocookie.com/embed/${id}`;
    } else if (provider === "cloudflare") {
        if (!customerCode) {
            return (
                <div className="video-embed video-embed-error">
                    <p>Brak customerCode dla Cloudflare Stream.</p>
                </div>
            );
        }
        src = `https://customer-${customerCode}.cloudflarestream.com/${id}/iframe`;
    }

    if (!src) return null;

    return (
        <div className="video-embed">
            <iframe
                src={src}
                title={title ?? "Wideo lekcji"}
                loading="lazy"
                allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture; fullscreen"
                allowFullScreen
            />
        </div>
    );
}
