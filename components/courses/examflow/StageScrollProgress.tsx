"use client";

/**
 * Scroll progress bar dla kazdej strony etapu.
 * Pokazuje ile procent strony przescrollowano.
 */

import { useEffect, useState } from "react";

export function StageScrollProgress() {
    const [pct, setPct] = useState(0);

    useEffect(() => {
        function update() {
            const h = document.documentElement;
            const b = document.body;
            const scrollTop = h.scrollTop || b.scrollTop;
            const scrollHeight = Math.max(
                h.scrollHeight,
                b.scrollHeight
            );
            const clientHeight = h.clientHeight;
            const total = scrollHeight - clientHeight;
            const next = total > 0 ? Math.min(100, Math.max(0, (scrollTop / total) * 100)) : 0;
            setPct(next);
        }
        update();
        window.addEventListener("scroll", update, { passive: true });
        window.addEventListener("resize", update);
        return () => {
            window.removeEventListener("scroll", update);
            window.removeEventListener("resize", update);
        };
    }, []);

    return (
        <div className="stage-scroll-progress" aria-hidden="true">
            <div className="stage-scroll-progress-bar" style={{ width: `${pct}%` }} />
        </div>
    );
}
