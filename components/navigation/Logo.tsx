"use client";

import { useRef, useState } from "react";
import { Drawer } from "./Drawer";

export function Logo() {
    const [open, setOpen] = useState(false);
    const [armed, setArmed] = useState(false);
    const timer = useRef<number | null>(null);

    const clearTimer = () => {
        if (timer.current) {
            window.clearTimeout(timer.current);
            timer.current = null;
        }
    };

    const handleEnter = () => {
        setArmed(true);
        clearTimer();
        timer.current = window.setTimeout(() => setOpen(true), 600);
    };

    const handleLeave = () => {
        clearTimer();
        if (!open) {
            setArmed(false);
        }
    };

    const handleClick = () => {
        clearTimer();
        setArmed(true);
        setOpen(true);
    };

    const handleClose = () => {
        clearTimer();
        setOpen(false);
        setArmed(false);
    };

    return (
        <>
            <button
                className={`logo-mark ${armed || open ? "is-armed" : ""}`}
                type="button"
                aria-expanded={open}
                aria-label="Otwórz nawigację"
                onClick={handleClick}
                onMouseEnter={handleEnter}
                onMouseLeave={handleLeave}
                onFocus={handleEnter}
                onBlur={handleLeave}
            >
                <span>STEM</span>
                <i aria-hidden="true" />
            </button>
            <Drawer open={open} onClose={handleClose} />
        </>
    );
}
