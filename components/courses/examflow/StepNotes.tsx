"use client";

/**
 * Notatki osobiste do kazdego etapu (per exam/step).
 * localStorage['stem-notes-v1'] z kluczem {examSlug}/{stepSlug}.
 */

import { useEffect, useState } from "react";

const STORAGE_KEY = "stem-notes-v1";

function keyFor(slug: string, step: string): string {
    return `${slug}/${step}`;
}

function readAll(): Record<string, string> {
    if (typeof window === "undefined") return {};
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? (JSON.parse(raw) as Record<string, string>) : {};
    } catch {
        return {};
    }
}

function writeAll(data: Record<string, string>) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
        // ignore
    }
}

export function StepNotes({ examSlug, stepSlug }: { examSlug: string; stepSlug: string }) {
    const [value, setValue] = useState("");
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        const all = readAll();
        setValue(all[keyFor(examSlug, stepSlug)] ?? "");
    }, [examSlug, stepSlug]);

    let saveTimer: ReturnType<typeof setTimeout> | null = null;
    function handleChange(v: string) {
        setValue(v);
        if (saveTimer) clearTimeout(saveTimer);
        saveTimer = setTimeout(() => {
            const all = readAll();
            const k = keyFor(examSlug, stepSlug);
            if (v.trim()) {
                all[k] = v;
            } else {
                delete all[k];
            }
            writeAll(all);
            setSaved(true);
            setTimeout(() => setSaved(false), 1500);
        }, 400);
    }

    return (
        <section className="step-notes" aria-label="Notatki osobiste">
            <h2 className="step-notes-title">Notatki</h2>
            <p className="step-notes-hint">
                Pisz co chcesz zapamietac. Zapisywane lokalnie, nie opuszcza przegladarki.
            </p>
            <textarea
                className="step-notes-textarea"
                value={value}
                onChange={(e) => handleChange(e.target.value)}
                placeholder="Twoje notatki z tego etapu..."
                rows={6}
            />
            <div className="step-notes-meta">
                <span className="step-notes-count">{value.length} znakow</span>
                {saved && <span className="step-notes-saved">✓ Zapisano</span>}
            </div>
        </section>
    );
}
