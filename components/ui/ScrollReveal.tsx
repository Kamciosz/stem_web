"use client";

import { createElement, type CSSProperties, type ReactNode, useCallback, useEffect, useState } from "react";
import type React from "react";

type ScrollRevealProps = {
    as?: keyof React.JSX.IntrinsicElements;
    children: ReactNode;
    className?: string;
    delay?: number;
    id?: string;
    style?: CSSProperties;
};

export function ScrollReveal({ as = "div", children, className = "", delay = 0, id, style }: ScrollRevealProps) {
    const [element, setElement] = useState<HTMLElement | null>(null);
    const [visible, setVisible] = useState(false);
    const handleRef = useCallback((node: HTMLElement | null) => setElement(node), []);

    useEffect(() => {
        if (!element) {
            return;
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setVisible(true);
                    observer.unobserve(element);
                }
            },
            { rootMargin: "0px 0px 0px", threshold: 0.02 }
        );

        observer.observe(element);
        return () => observer.disconnect();
    }, [element]);

    return createElement(
        as,
        {
            ref: handleRef,
            id,
            className: `scroll-reveal ${visible ? "is-visible" : ""} ${className}`,
            style: { ...style, transitionDelay: `${delay}s` }
        },
        children
    );
}
