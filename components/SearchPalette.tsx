"use client";

/**
 * Globalne pole wyszukiwania egzaminow (Cmd+K / Ctrl+K).
 * Indeks ladowany z /api/exam-index.json.
 */

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

type Entry = {
    slug: string;
    title: string;
    examId: string;
    session: string;
    topic: string;
    description: string;
    technologies: string[];
    basePath: string;
    courseId: string;
};

function search(entries: Entry[], q: string): Entry[] {
    if (!q.trim()) return entries.slice(0, 20);
    const needle = q.toLowerCase();
    const tokens = needle.split(/\s+/).filter(Boolean);
    const scored = entries
        .map((e) => {
            const haystack = `${e.title} ${e.examId} ${e.session} ${e.topic} ${e.description} ${e.technologies.join(" ")}`.toLowerCase();
            let score = 0;
            for (const t of tokens) {
                if (!haystack.includes(t)) return null;
                score += 1;
                if (e.title.toLowerCase().includes(t)) score += 2;
                if (e.examId.toLowerCase().includes(t)) score += 3;
            }
            return { e, score };
        })
        .filter((x): x is { e: Entry; score: number } => x !== null)
        .sort((a, b) => b.score - a.score)
        .slice(0, 20);
    return scored.map((s) => s.e);
}

export function SearchPalette() {
    const [open, setOpen] = useState(false);
    const [q, setQ] = useState("");
    const [entries, setEntries] = useState<Entry[]>([]);
    const [active, setActive] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);

    // Keyboard shortcut
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "k") {
                e.preventDefault();
                setOpen((o) => !o);
            } else if (e.key === "Escape" && open) {
                setOpen(false);
            }
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [open]);

    // Load index on open
    useEffect(() => {
        if (!open) return;
        if (entries.length > 0) return;
        fetch("/exam-index.json")
            .then((r) => r.json())
            .then((data) => setEntries(data))
            .catch(() => setEntries([]));
    }, [open, entries.length]);

    // Focus input on open
    useEffect(() => {
        if (open) {
            setTimeout(() => inputRef.current?.focus(), 50);
            setQ("");
            setActive(0);
        }
    }, [open]);

    const results = useMemo(() => search(entries, q), [entries, q]);

    function go(entry: Entry) {
        setOpen(false);
        window.location.href = entry.basePath;
    }

    return (
        <>
            {open && (
                <div className="search-palette-backdrop" onClick={() => setOpen(false)} role="presentation">
                    <div
                        className="search-palette"
                        role="dialog"
                        aria-modal="true"
                        aria-label="Wyszukiwarka egzaminow"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="search-palette-input-wrap">
                            <span className="search-palette-icon" aria-hidden="true">🔍</span>
                            <input
                                ref={inputRef}
                                type="search"
                                placeholder="Szukaj egzaminu... (np. PHP, Motory, Styczen 2025)"
                                className="search-palette-input"
                                value={q}
                                onChange={(e) => {
                                    setQ(e.target.value);
                                    setActive(0);
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === "ArrowDown") {
                                        e.preventDefault();
                                        setActive((a) => Math.min(a + 1, results.length - 1));
                                    } else if (e.key === "ArrowUp") {
                                        e.preventDefault();
                                        setActive((a) => Math.max(0, a - 1));
                                    } else if (e.key === "Enter" && results[active]) {
                                        e.preventDefault();
                                        go(results[active]);
                                    }
                                }}
                            />
                            <kbd className="search-palette-kbd">ESC</kbd>
                        </div>

                        <div className="search-palette-results">
                            {results.length === 0 && (
                                <div className="search-palette-empty">Brak wynikow dla &quot;{q}&quot;.</div>
                            )}
                            {results.map((r, i) => (
                                <button
                                    key={r.slug}
                                    type="button"
                                    className={`search-palette-item ${i === active ? "is-active" : ""}`}
                                    onClick={() => go(r)}
                                    onMouseEnter={() => setActive(i)}
                                >
                                    <div className="search-palette-item-main">
                                        <strong className="search-palette-item-title">
                                            {r.title}
                                        </strong>
                                        <span className="search-palette-item-meta">
                                            {r.examId} · {r.session} · {r.technologies.join(", ")}
                                        </span>
                                    </div>
                                    <span aria-hidden="true" className="search-palette-item-cta">
                                        →
                                    </span>
                                </button>
                            ))}
                        </div>

                        <div className="search-palette-footer">
                            <span>↑↓ nawigacja</span>
                            <span>↵ otworz</span>
                            <span>{results.length} wynikow</span>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
