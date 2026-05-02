"use client";

import { useEffect, useRef, useState } from "react";

type TypewriterTextProps = {
    text: string;
    delay?: number;
    speed?: number;
};

export function TypewriterText({ text, delay = 0.5, speed = 50 }: TypewriterTextProps) {
    const [displayed, setDisplayed] = useState("");
    const [done, setDone] = useState(false);
    const startedRef = useRef(false);

    useEffect(() => {
        if (startedRef.current) return;
        startedRef.current = true;

        const ids: ReturnType<typeof setTimeout>[] = [];

        ids.push(
            setTimeout(() => {
                for (let i = 0; i < text.length; i++) {
                    ids.push(
                        setTimeout(
                            () => {
                                setDisplayed(text.slice(0, i + 1));
                                if (i === text.length - 1) setDone(true);
                            },
                            i * speed
                        )
                    );
                }
            }, delay * 1000)
        );

        return () => {
            for (const id of ids) clearTimeout(id);
        };
    }, [text, delay, speed]);

    return (
        <span suppressHydrationWarning>
            {displayed}
            {!done && <span className="typewriter-cursor" aria-hidden="true">▋</span>}
        </span>
    );
}
