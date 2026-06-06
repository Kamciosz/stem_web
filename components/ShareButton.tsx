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

        if (typeof navigator !== "undefined" && "share" in navigator) {
            try {
                await (navigator as Navigator & { share: (data: { title: string; url: string }) => Promise<void> }).share({
                    title,
                    url: fullUrl,
                });
                setMsg("Otwarto share dialog");
            } catch (e) {
                if ((e as DOMException).name !== "AbortError") {
                    setMsg("Blad share");
                }
            }
        } else {
            // Fallback - copy to clipboard
            try {
                if (typeof navigator !== "undefined" && navigator.clipboard) {
                    await navigator.clipboard.writeText(fullUrl);
                    setMsg("Link skopiowany do schowka");
                    setTimeout(() => setMsg(null), 2500);
                } else {
                    setMsg("Brak clipboard API");
                }
            } catch {
                setMsg("Nie udalo sie skopiowac");
            }
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
