"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

const links = [
    { href: "/", number: "01", label: "HOME" },
    { href: "/projekty", number: "02", label: "PROJEKTY" },
    { href: "/zespol", number: "03", label: "ZESPÓŁ" },
    { href: "/partnerzy", number: "04", label: "PARTNERZY" },
    { href: "/kontakt", number: "05", label: "KONTAKT" },
    { href: "/kursy", number: "06", label: "KURSY" }
];

type DrawerProps = {
    open: boolean;
    onClose: () => void;
};

export function Drawer({ open, onClose }: DrawerProps) {
    const pathname = usePathname();
    useEffect(() => {
        if (!open) {
            return;
        }

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                onClose();
            }
        };

        document.body.style.overflow = "hidden";
        window.addEventListener("keydown", handleKeyDown);

        return () => {
            document.body.style.overflow = "";
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [open, onClose]);

    return (
        <div className={`drawer-shell ${open ? "is-open" : ""}`} aria-hidden={!open} inert={!open}>
            <button className="drawer-backdrop" type="button" aria-label="Zamknij nawigację" onClick={onClose} />
            <aside className="drawer-panel" aria-label="Nawigacja STEM">
                <p className="drawer-kicker font-mono-industrial">STEM / NAVIGATION</p>
                <nav>
                    {links.map((link, index) => (
                        <Link
                            href={link.href}
                            className={`drawer-link ${pathname === link.href ? "drawer-link-active" : ""}`}
                            key={link.href}
                            onClick={onClose}
                            style={{ transitionDelay: `${index * 0.1}s` }}
                        >
                            <span>{link.number}</span>
                            {link.label}
                        </Link>
                    ))}
                </nav>
            </aside>
        </div>
    );
}
