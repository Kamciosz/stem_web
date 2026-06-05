"use client";

import { useEffect, useRef, useSyncExternalStore, type CSSProperties } from "react";

const particles = Array.from({ length: 72 }, (_, index) => {
    const left = (index * 37) % 100;
    const top = (index * 61) % 100;
    const size = index % 5 === 0 ? 2 : 1;
    const opacity = 0.04 + ((index * 13) % 9) / 100;
    return { left, top, size, opacity };
});

/** Subskrypcja prefers-reduced-motion przez useSyncExternalStore —
 *  zero hydration mismatch (server snapshot = true), zero setState-in-effect. */
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function subscribeReducedMotion(callback: () => void): () => void {
    const mq = window.matchMedia(REDUCED_MOTION_QUERY);
    mq.addEventListener("change", callback);
    return () => mq.removeEventListener("change", callback);
}

function getReducedMotionSnapshot(): boolean {
    return window.matchMedia(REDUCED_MOTION_QUERY).matches;
}

function getReducedMotionServerSnapshot(): boolean {
    return true; // SSR: nie renderuj dekoracji do czasu hydratacji
}

export function ParallaxLayers() {
    const cursorGlowRef = useRef<HTMLDivElement>(null);
    const reducedMotion = useSyncExternalStore(
        subscribeReducedMotion,
        getReducedMotionSnapshot,
        getReducedMotionServerSnapshot
    );

    useEffect(() => {
        if (reducedMotion) return; // bez ruchu nie podpinamy scroll listenera
        let animationFrame = 0;
        const layers = Array.from(document.querySelectorAll<HTMLElement>("[data-parallax-speed]"));

        const update = () => {
            const scrollY = window.scrollY;
            for (const layer of layers) {
                const speed = Number(layer.dataset.parallaxSpeed ?? 0);
                layer.style.transform = `translate3d(0, ${scrollY * speed}px, 0)`;
            }
            animationFrame = 0;
        };

        const requestUpdate = () => {
            if (!animationFrame) {
                animationFrame = window.requestAnimationFrame(update);
            }
        };

        update();
        window.addEventListener("scroll", requestUpdate, { passive: true });
        window.addEventListener("resize", requestUpdate);

        return () => {
            window.removeEventListener("scroll", requestUpdate);
            window.removeEventListener("resize", requestUpdate);
            if (animationFrame) {
                window.cancelAnimationFrame(animationFrame);
            }
        };
    }, [reducedMotion]);

    useEffect(() => {
        if (reducedMotion) return; // bez ruchu nie śledzimy kursora
        const moveCursor = (e: MouseEvent) => {
            if (cursorGlowRef.current) {
                cursorGlowRef.current.style.left = `${e.clientX}px`;
                cursorGlowRef.current.style.top = `${e.clientY}px`;
            }
        };
        window.addEventListener("mousemove", moveCursor, { passive: true });
        return () => window.removeEventListener("mousemove", moveCursor);
    }, [reducedMotion]);

    // Reduced motion: nie renderujemy dekoracyjnych warstw ani 72 cząstek.
    if (reducedMotion) {
        return null;
    }

    return (
        <>
            <div className="parallax-void" data-layer="Z-0 Void" data-parallax-speed="0.05" />
            <div className="parallax-wireframe" data-layer="Z-1 Wireframe" data-parallax-speed="0.15">
                <div className="wireframe-floor" />
            </div>
            <div className="parallax-particles" data-layer="Z-2 Particulate" data-parallax-speed="0.25">
                {particles.map((particle, index) => (
                    <i
                        aria-hidden="true"
                        className="particle"
                        key={index}
                        style={
                            {
                                "--left": `${particle.left}%`,
                                "--top": `${particle.top}%`,
                                "--size": `${particle.size}px`,
                                "--opacity": particle.opacity
                            } as CSSProperties
                        }
                    />
                ))}
            </div>
            <div className="parallax-volumetric" data-layer="Z-3 Volumetric" data-parallax-speed="0.4" />
            <div ref={cursorGlowRef} className="cursor-glow" aria-hidden="true" style={{ left: "-350px", top: "-350px" }} />
            <div className="parallax-foreground foreground-frame" data-layer="Z-5 Foreground" data-parallax-speed="1.3" />
        </>
    );
}

