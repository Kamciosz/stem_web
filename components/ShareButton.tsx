"use client";

/**
 * Przycisk Share - uzywa Web Share API jesli dostepne, fallback do copy.
 */

import { useState } from "react";

export function ShareButton({
    title,
    url,
    className = "",
}: {
    title: string;
    url: string;
    className?: string;
}) {
    const [msg, setMsg] = useState<string | null>(null);

    async function handleShare() {
        const fullUrl = url.startsWith("http")
            ? url
            : typeof window !== "undefined"
            ? `${window.location.origin}${url}`
            : url;

        const nav = (typeof navigator !== "undefined" ? navigator : null) as
            | (Navigator & { clipboard?: { writeText: (s: string) => Promise<void> } })
            | null;

        if (nav && "share" in nav && typeof (nav as Navigator & { share?: unknown }).share === "function") {
            try {
                await (nav as Navigator & { share: (data: { title: string; url: string }) => Promise<void> }).share({
                    title,
                    url: fullUrl,
                });
                setMsg("Otwarto share dialog");
            } catch (e) {
                if ((e as DOMException).name !== "AbortError") {
                    setMsg("Blad share");
                }
            }
        } else if (nav?.clipboard) {
            // Fallback - copy to clipboard
            try {
                await nav.clipboard.writeText(fullUrl);
                setMsg("Link skopiowany do schowka");
                setTimeout(() => setMsg(null), 2500);
            } catch {
                setMsg("Nie udalo sie skopiowac");
            }
        } else {
            setMsg("Brak share ani clipboard API");
        }
    }

    return (
        <button
            type="button"
            className={`share-button ${className}`}
            onClick={handleShare}
            aria-label="Udostępnij"
            title="Udostępnij"
        >
            <span aria-hidden="true">↗</span>
            <span className="share-button-text">{msg ?? "Udostepnij"}</span>
        </button>
    );
}
