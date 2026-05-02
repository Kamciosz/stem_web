"use client";

import Link from "next/link";
import { type ReactNode, useCallback, useRef } from "react";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789→←/._▋";
const FRAMES = 10;
const FRAME_MS = 36;

type TerminalLinkProps = {
    href: string;
    children: ReactNode;
    className?: string;
    external?: boolean;
};

export function TerminalLink({ href, children, className = "", external = false }: TerminalLinkProps) {
    const spanRef = useRef<HTMLSpanElement | null>(null);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const scramble = useCallback(() => {
        if (typeof children !== "string" || !spanRef.current) return;
        const target = children;
        let frame = 0;

        const tick = () => {
            if (!spanRef.current) return;
            frame++;
            const progress = (frame / FRAMES) * target.length;
            spanRef.current.textContent = target
                .split("")
                .map((char, i) => {
                    if (char === " ") return " ";
                    if (i < Math.floor(progress)) return char;
                    return CHARS[Math.floor(Math.random() * CHARS.length)];
                })
                .join("");

            if (frame < FRAMES) {
                timerRef.current = setTimeout(tick, FRAME_MS);
            } else {
                spanRef.current.textContent = target;
            }
        };

        if (timerRef.current) clearTimeout(timerRef.current);
        tick();
    }, [children]);

    const reset = useCallback(() => {
        if (timerRef.current) clearTimeout(timerRef.current);
        if (spanRef.current && typeof children === "string") {
            spanRef.current.textContent = children;
        }
    }, [children]);

    const classes = `terminal-link ${className}`;
    const inner = typeof children === "string" ? <span ref={spanRef}>{children}</span> : children;

    if (external) {
        return (
            <a className={classes} href={href} target="_blank" rel="noreferrer" onMouseEnter={scramble} onMouseLeave={reset}>
                {inner}
            </a>
        );
    }

    return (
        <Link className={classes} href={href} onMouseEnter={scramble} onMouseLeave={reset}>
            {inner}
        </Link>
    );
}

