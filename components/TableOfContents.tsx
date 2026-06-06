"use client";

/**
 * Spis tresci generowany z naglowkow w kontenie artykulu.
 * Uzywa IntersectionObserver do podswietlania aktywnej sekcji.
 */

import { useEffect, useMemo, useState } from "react";

type Item = { id: string; text: string; level: number };

export function TableOfContents({ containerSelector = ".exam-flow-stage-content" }: { containerSelector?: string }) {
    const [items, setItems] = useState<Item[]>([]);
    const [activeId, setActiveId] = useState<string | null>(null);

    useEffect(() => {
        const container = document.querySelector(containerSelector);
        if (!container) return;
        const headings = container.querySelectorAll<HTMLElement>("h1, h2, h3");
        const found: Item[] = [];
        headings.forEach((h, i) => {
            const text = (h.textContent || "").trim();
            if (!text) return;
            const id = h.id || `toc-${i}-${text.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 50)}`;
            h.id = id;
            found.push({ id, text, level: parseInt(h.tagName.slice(1), 10) });
        });
        setItems(found);

        const obs = new IntersectionObserver(
            (entries) => {
                for (const e of entries) {
                    if (e.isIntersecting) {
                        setActiveId(e.target.id);
                    }
                }
            },
            { rootMargin: "-20% 0% -70% 0%" }
        );
        headings.forEach((h) => h.id && obs.observe(h));
        return () => obs.disconnect();
    }, [containerSelector]);

    const grouped = useMemo(() => {
        const result: Item[] = [];
        let currentH2: Item | null = null;
        for (const item of items) {
            if (item.level === 2) {
                currentH2 = item;
                result.push(item);
            } else if (item.level === 3 && currentH2) {
                result.push(item);
            }
        }
        return result;
    }, [items]);

    if (grouped.length === 0) return null;

    return (
        <nav className="table-of-contents" aria-label="Spis tresci">
            <h2 className="table-of-contents-title">Spis tresci</h2>
            <ol className="table-of-contents-list">
                {grouped.map((item) => (
                    <li
                        key={item.id}
                        className={`table-of-contents-item ${item.level === 3 ? "is-sub" : ""} ${
                            activeId === item.id ? "is-active" : ""
                        }`}
                    >
                        <a href={`#${item.id}`} className="table-of-contents-link">
                            {item.text}
                        </a>
                    </li>
                ))}
            </ol>
        </nav>
    );
}
