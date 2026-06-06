"use client";

/**
 * Zapamietuje pozycje scrolla per etap (per slug/step).
 * Po mount przywraca.
 */

import { useEffect } from "react";

const STORAGE_KEY = "stem-scroll-position-v1";

function keyFor(slug: string, step: string): string {
    return `${slug}/${step}`;
}

export function useScrollMemory(slug: string, step: string) {
    useEffect(() => {
        if (typeof window === "undefined") return;
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            const data = raw ? (JSON.parse(raw) as Record<string, number>) : {};
            const k = keyFor(slug, step);
            const saved = data[k];
            if (typeof saved === "number" && saved > 100) {
                // Restore po malym opoznieniu (zeby MDX sie zaladowal)
                setTimeout(() => {
                    window.scrollTo({ top: saved, behavior: "instant" });
                }, 60);
            }
        } catch {
            // ignore
        }

        let t: ReturnType<typeof setTimeout> | null = null;
        function save() {
            if (t) clearTimeout(t);
            t = setTimeout(() => {
                try {
                    const raw = localStorage.getItem(STORAGE_KEY);
                    const data = raw ? (JSON.parse(raw) as Record<string, number>) : {};
                    data[keyFor(slug, step)] = window.scrollY;
                    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
                } catch {
                    // ignore
                }
            }, 400);
        }
        window.addEventListener("scroll", save, { passive: true });
        return () => {
            window.removeEventListener("scroll", save);
            if (t) clearTimeout(t);
        };
    }, [slug, step]);
}
