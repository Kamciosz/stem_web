"use client";

/**
 * Wszystkie notatki osobiste ze wszystkich egzaminow/etapow.
 * Wyszukiwarka + sortowanie.
 */

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { getExamIndex } from "@/lib/exam-index";

const STORAGE_KEY = "stem-notes-v1";

type Note = {
    examSlug: string;
    stepSlug: string;
    text: string;
    basePath: string;
    stepLabel: string;
    examTitle: string;
    examId: string;
    ts: number; // local time pseudo - ustawiane na 0 jesli brak
};

function read(): Note[] {
    if (typeof window === "undefined") return [];
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        const data: Record<string, string> = raw ? JSON.parse(raw) : {};
        const all = getExamIndex();
        const map = new Map<string, { examSlug: string; basePath: string; examTitle: string; examId: string }>();
        for (const e of all) map.set(e.slug, { examSlug: e.slug, basePath: e.basePath, examTitle: e.title, examId: e.examId });
        const out: Note[] = [];
        for (const [key, text] of Object.entries(data)) {
            const [examSlug, stepSlug] = key.split("/");
            const meta = map.get(examSlug);
            if (!meta) continue;
            out.push({
                examSlug,
                stepSlug,
                text,
                basePath: meta.basePath,
                examTitle: meta.examTitle,
                examId: meta.examId,
                stepLabel: stepSlug,
                ts: 0,
            });
        }
        return out;
    } catch {
        return [];
    }
}

export default function NotatkiPage() {
    const [notes, setNotes] = useState<Note[]>([]);
    const [query, setQuery] = useState("");

    useEffect(() => {
        setNotes(read());
    }, []);

    const filtered = useMemo(() => {
        if (!query.trim()) return notes;
        const q = query.toLowerCase();
        return notes.filter(
            (n) =>
                n.text.toLowerCase().includes(q) ||
                n.examTitle.toLowerCase().includes(q) ||
                n.examId.toLowerCase().includes(q) ||
                n.stepLabel.toLowerCase().includes(q)
        );
    }, [notes, query]);

    return (
        <article className="all-notes-page section-shell">
            <div className="section-inner all-notes-container">
                <header className="all-notes-header">
                    <p className="all-notes-eyebrow">Notatki osobiste</p>
                    <h1 className="all-notes-title">Twoje notatki</h1>
                    <p className="all-notes-lead">
                        Wszystkie notatki zapisane z kazdego etapu. Wyszukuj, przegladaj, wroc do lekcji.
                    </p>
                </header>
                <div className="all-notes-toolbar">
                    <input
                        type="search"
                        className="all-notes-search"
                        placeholder={`Szukaj w ${notes.length} notatkach...`}
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    <span className="all-notes-count">
                        {filtered.length} / {notes.length}
                    </span>
                </div>
                {notes.length === 0 ? (
                    <div className="all-notes-empty">
                        <p className="all-notes-empty-title">Brak notatek</p>
                        <p className="all-notes-empty-text">
                            Otworz dowolny etap i wpisz cos w panelu <em>Notatki</em> po prawej stronie.
                        </p>
                        <Link href="/egzaminy" className="all-notes-empty-cta">
                            Przejdz do egzaminow →
                        </Link>
                    </div>
                ) : (
                    <ol className="all-notes-list">
                        {filtered.map((n) => (
                            <li key={`${n.examSlug}/${n.stepSlug}`} className="all-notes-item">
                                <header className="all-notes-item-head">
                                    <Link
                                        href={`${n.basePath}/${n.stepSlug}`}
                                        className="all-notes-item-link"
                                    >
                                        <span className="all-notes-item-id">{n.examId}</span>
                                        <strong className="all-notes-item-title">
                                            {n.examTitle} — {n.stepLabel}
                                        </strong>
                                    </Link>
                                </header>
                                <p className="all-notes-item-text">{n.text}</p>
                            </li>
                        ))}
                    </ol>
                )}
            </div>
        </article>
    );
}
