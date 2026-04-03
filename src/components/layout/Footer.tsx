"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Heart, Camera, MessageCircle, ExternalLink } from "lucide-react";

export default function Footer() {
    const t = useTranslations("footer");
    const year = new Date().getFullYear();

    return (
        <footer className="relative border-t border-[var(--color-border)] bg-[var(--color-bg-secondary)]">
            <div className="mx-auto max-w-7xl px-6 py-12 md:px-10">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    {/* Brand */}
                    <div className="flex items-center gap-2">
                        <Link href="/" className="text-lg font-bold tracking-tight">
                            <span className="text-[var(--color-text-primary)]">STEM</span>
                            <span className="text-[var(--color-purple-400)] mx-1">×</span>
                            <span className="text-[var(--color-text-primary)]">TEB Technikum</span>
                        </Link>
                    </div>

                    {/* Links */}
                    <nav className="flex items-center gap-6 text-sm text-[var(--color-text-muted)]">
                        <Link
                            href="/projekty"
                            className="hover:text-[var(--color-purple-400)] transition-colors"
                        >
                            Projekty
                        </Link>
                        <Link
                            href="/kontakt"
                            className="hover:text-[var(--color-purple-400)] transition-colors"
                        >
                            Kontakt
                        </Link>
                    </nav>

                    {/* Social links */}
                    <div className="flex items-center gap-4">
                        <a
                            href="#"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Instagram"
                            className="p-2 rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-purple-400)] hover:bg-[var(--color-accent-subtle)] transition-all"
                        >
                            <Camera size={18} />
                        </a>
                        <a
                            href="#"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Discord"
                            className="p-2 rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-purple-400)] hover:bg-[var(--color-accent-subtle)] transition-all"
                        >
                            <MessageCircle size={18} />
                        </a>
                        <a
                            href="#"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="TEB Technikum"
                            className="p-2 rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-purple-400)] hover:bg-[var(--color-accent-subtle)] transition-all"
                        >
                            <ExternalLink size={18} />
                        </a>
                    </div>

                    {/* Copyright */}
                    <div className="flex items-center gap-1.5 text-sm text-[var(--color-text-muted)]">
                        <span>© {year}</span>
                        <span>{t("madeWith")}</span>
                        <Heart size={14} className="text-[var(--color-purple-500)] fill-current" />
                        <span>{t("by")}</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
