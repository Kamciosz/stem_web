"use client";

import { useEffect, useRef } from "react";

export function ScrollProgress() {
    const barRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const update = () => {
            const scrollable = document.documentElement.scrollHeight - window.innerHeight;
            const progress = scrollable > 0 ? window.scrollY / scrollable : 0;
            if (barRef.current) {
                barRef.current.style.transform = `scaleX(${progress})`;
            }
        };

        update();
        window.addEventListener("scroll", update, { passive: true });
        return () => window.removeEventListener("scroll", update);
    }, []);

    return <div ref={barRef} className="scroll-progress" aria-hidden="true" />;
}
