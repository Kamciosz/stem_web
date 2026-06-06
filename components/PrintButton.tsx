"use client";

/**
 * Przycisk drukowania - wywoluje window.print() z opcja cls
 * dla kontrolowanego wydruku.
 */

import { useState } from "react";

export function PrintButton({
    label = "Drukuj / PDF",
    className = "",
}: {
    label?: string;
    className?: string;
}) {
    const [printing, setPrinting] = useState(false);

    function handleClick() {
        setPrinting(true);
        try {
            // document.title patch na "STEM - Arkusz XX" dla nazwy pliku
            window.print();
        } catch {
            // ignore
        }
        setTimeout(() => setPrinting(false), 500);
    }

    return (
        <button
            type="button"
            className={`print-button ${className}`}
            onClick={handleClick}
            aria-label="Drukuj lub zapisz jako PDF"
        >
            <span aria-hidden="true">🖨</span>
            {printing ? "Przygotowuje..." : label}
        </button>
    );
}
