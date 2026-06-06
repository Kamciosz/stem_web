"use client";

/**
 * Losuje losowy egzamin z listy i przekierowuje.
 */

import { useRouter } from "next/navigation";
import { useState } from "react";

type Entry = { basePath: string; title: string; examId: string; session: string };

export function RandomExamButton({ entries }: { entries: Entry[] }) {
    const router = useRouter();
    const [msg, setMsg] = useState<string | null>(null);

    function pick() {
        if (entries.length === 0) return;
        const e = entries[Math.floor(Math.random() * entries.length)];
        setMsg(`Wylosowano: ${e.examId} — ${e.title}`);
        // Spin anim - 1.2s before redirect
        setTimeout(() => router.push(e.basePath), 700);
    }

    return (
        <button
            type="button"
            className="random-exam-btn"
            onClick={pick}
            aria-label="Losuj losowy egzamin"
        >
            <span aria-hidden="true">🎲</span>
            {msg ?? "Losuj arkusz"}
        </button>
    );
}
