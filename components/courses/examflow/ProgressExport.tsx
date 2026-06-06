"use client";

/**
 * Eksport/Import danych progresu (localStorage).
 * Generuje plik JSON z wszystkimi kluczami 'stem-*-v1'.
 * Import nadpisuje/marge'uje z istniejacymi.
 */

import { useState } from "react";

const PROGRESS_KEYS = [
    "stem-exam-progress-v1",
    "stem-scroll-position-v1",
    // przyszle klucze dodane tu
];

function downloadJson(data: unknown, filename: string) {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}

export function ProgressExport() {
    const [msg, setMsg] = useState<string | null>(null);

    function handleExport() {
        try {
            const payload: Record<string, unknown> = {};
            for (const k of PROGRESS_KEYS) {
                const raw = localStorage.getItem(k);
                if (raw) payload[k] = JSON.parse(raw);
            }
            const stamp = new Date().toISOString().slice(0, 10);
            downloadJson(
                {
                    version: 1,
                    exportedAt: new Date().toISOString(),
                    payload,
                },
                `stem-progress-${stamp}.json`
            );
            setMsg(`Eksport: ${Object.keys(payload).length} kluczy`);
        } catch (e) {
            setMsg(`Blad: ${String(e)}`);
        }
    }

    function handleImport() {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "application/json";
        input.onchange = async () => {
            const file = input.files?.[0];
            if (!file) return;
            try {
                const text = await file.text();
                const data = JSON.parse(text);
                if (!data.payload || typeof data.payload !== "object") {
                    setMsg("Blad: nieprawidlowy plik");
                    return;
                }
                let count = 0;
                for (const [k, v] of Object.entries(data.payload)) {
                    localStorage.setItem(k, JSON.stringify(v));
                    count++;
                }
                setMsg(`Import: ${count} kluczy zapisanych. Odswiez strone.`);
            } catch (e) {
                setMsg(`Blad importu: ${String(e)}`);
            }
        };
        input.click();
    }

    function handleClear() {
        if (!confirm("Na pewno wyczyscic caly progres? Tej operacji nie mozna cofnac.")) return;
        for (const k of PROGRESS_KEYS) localStorage.removeItem(k);
        setMsg("Wyczyszczono. Odswiez strone.");
    }

    return (
        <div className="progress-export">
            <div className="progress-export-row">
                <button type="button" className="admin-btn" onClick={handleExport}>
                    Pobierz progres (JSON)
                </button>
                <button type="button" className="admin-btn" onClick={handleImport}>
                    Wczytaj progres z pliku
                </button>
                <button type="button" className="admin-btn is-danger" onClick={handleClear}>
                    Wyczysc progres
                </button>
            </div>
            {msg && <p className="progress-export-msg">{msg}</p>}
            <p className="progress-export-hint">
                Przechowuj kopie zapasowa na innym urzadzeniu. Format JSON, czytelny.
            </p>
        </div>
    );
}
