"use client";

/**
 * Ostatnio odwiedzone egzaminy (w sidebar /egzaminy i /progres).
 * Storage: localStorage['stem-recently-visited-v1'] (max 8 entries).
 */

import Link from "next/link";
import { useEffect, useState } from "react";

const STORAGE_KEY = "stem-recently-visited-v1";
const MAX = 8;

type Entry = { slug: string; title: string; examId: string; basePath: string; ts: number };

function readRecent(): Entry[] {
    if (typeof window === "undefined") return [];
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return [];
        const data = JSON.parse(raw) as Entry[];
        return Array.isArray(data) ? data : [];
    } catch {
        return [];
    }
}

export function trackRecent(entry: Omit<Entry, "ts">) {
    if (typeof window === "undefined") return;
    const list = readRecent().filter((e) => e.slug !== entry.slug);
    list.unshift({ ...entry, ts: Date.now() });
    list.splice(MAX);
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    } catch {
        // ignore
    }
}

export function RecentlyVisited() {
    const [items, setItems] = useState<Entry[]>([]);

    useEffect(() => {
        setItems(readRecent());
        // Odswiez co 1s na wypadek nowego wejscia
        const t = setInterval(() => setItems(readRecent()), 1000);
        return () => clearInterval(t);
    }, []);

    if (items.length === 0) {
        return (
            <section className="recently-visited is-empty" aria-label="Ostatnio odwiedzone">
                <h2 className="recently-visited-title">Ostatnio odwiedzone</h2>
                <p className="recently-visited-empty">
                    Kliknij dowolny egzamin - pojawi sie tutaj dla szybkiego powrotu.
                </p>
            </section>
        );
    }

    return (
        <section className="recently-visited" aria-label="Ostatnio odwiedzone">
            <h2 className="recently-visited-title">Ostatnio odwiedzone</h2>
            <ol className="recently-visited-list">
                {items.map((e) => (
                    <li key={e.slug}>
                        <Link href={e.basePath} className="recently-visited-item">
                            <span className="recently-visited-id">{e.examId}</span>
                            <span className="recently-visited-title">{e.title}</span>
                        </Link>
                    </li>
                ))}
            </ol>
        </section>
    );
}
