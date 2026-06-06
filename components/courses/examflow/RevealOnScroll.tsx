"use client";

/**
 * Reveal na scrollu - klasa .reveal-item dostaje .is-revealed gdy
 * wchodzi w viewport (IntersectionObserver).
 */

import { useEffect, useRef } from "react";

export function RevealOnScroll({
    children,
    className = "",
    delay = 0,
}: {
    children: React.ReactNode;
    className?: string;
    delay?: number;
}) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        if (typeof IntersectionObserver === "undefined") {
            el.classList.add("is-revealed");
            return;
        }
        const obs = new IntersectionObserver(
            (entries) => {
                for (const e of entries) {
                    if (e.isIntersecting) {
                        if (delay > 0) {
                            setTimeout(() => e.target.classList.add("is-revealed"), delay);
                        } else {
                            e.target.classList.add("is-revealed");
                        }
                        obs.unobserve(e.target);
                    }
                }
            },
            { threshold: 0.15, rootMargin: "0px 0px -10% 0px" }
        );
        obs.observe(el);
        return () => obs.disconnect();
    }, [delay]);

    return (
        <div ref={ref} className={`reveal-item ${className}`}>
            {children}
        </div>
    );
}
