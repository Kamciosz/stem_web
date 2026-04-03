"use client";

import { motion } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
    ArrowLeft,
    GitFork,
    Link2,
    Globe,
    ArrowRight,
} from "lucide-react";

interface ProfileViewProps {
    slug: string;
}

const MOCK_MEMBER = {
    slug: "Szymon-Sosnowski",
    name: "Szymon Sosnowski",
    nickname: "Kamciosz",
    avatar_url: null as string | null,
    bio_pl:
        "Uczeń TEB Technikum w Warszawie, pasjonat programowania i nowoczesnych technologii webowych. Twórca TEB App — progresywnej aplikacji webowej dla szkoły. Specjalizuje się w full-stack development z wykorzystaniem React, Next.js i Node.js.",
    bio_en:
        "TEB Technikum student in Warsaw, passionate about programming and modern web technologies. Creator of TEB App — a progressive web application for school. Specializes in full-stack development using React, Next.js, and Node.js.",
    github_url: "https://github.com/Kamciosz",
    linkedin_url: null as string | null,
    website_url: null as string | null,
    role: "member",
    projects: [
        {
            slug: "teb-app",
            title_pl: "TEB App",
            title_en: "TEB App",
            short_desc_pl: "Progresywna aplikacja webowa dla szkoły TEB Technikum.",
            short_desc_en: "Progressive web app for TEB Technikum school.",
            category: "programowanie" as const,
            role_in_project: "Full-Stack Developer",
        },
    ],
};

export default function ProfileView({ slug }: ProfileViewProps) {
    const t = useTranslations("profile");
    const tCommon = useTranslations("common");
    const tProjects = useTranslations("projects");
    const locale = useLocale();

    const member = MOCK_MEMBER;
    const bio = locale === "en" && member.bio_en ? member.bio_en : member.bio_pl;

    return (
        <div className="min-h-screen pt-28 pb-20 stone-texture">
            <div className="mx-auto max-w-4xl px-6 md:px-10">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4 }}
                >
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-purple-400)] transition-colors mb-10"
                    >
                        <ArrowLeft size={16} />
                        {tCommon("back")}
                    </Link>
                </motion.div>

                <motion.div
                    className="flex flex-col md:flex-row items-start gap-8 mb-12"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="w-28 h-28 md:w-36 md:h-36 rounded-2xl bg-gradient-to-br from-[var(--color-purple-500)] to-[var(--color-purple-800)] flex items-center justify-center text-4xl md:text-5xl font-bold text-white flex-shrink-0 glow-purple overflow-hidden">
                        {member.avatar_url ? (
                            <img
                                src={member.avatar_url}
                                alt={member.name}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            member.name.charAt(0)
                        )}
                    </div>

                    <div className="flex-1">
                        <h1 className="text-3xl md:text-5xl font-bold gradient-text mb-2">
                            {member.name}
                        </h1>
                        {member.nickname && (
                            <p className="text-lg text-[var(--color-text-muted)] mb-4">
                                @{member.nickname}
                            </p>
                        )}
                        <p className="category-pill mb-4">{t("member")}</p>

                        <div className="flex items-center gap-3">
                            {member.github_url && (
                                <a
                                    href={member.github_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2.5 rounded-xl bg-[var(--color-accent-subtle)] border border-[var(--color-border)] hover:border-[var(--color-border-hover)] transition-all"
                                    aria-label="GitHub"
                                >
                                    <GitFork size={18} className="text-[var(--color-purple-400)]" />
                                </a>
                            )}
                            {member.linkedin_url && (
                                <a
                                    href={member.linkedin_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2.5 rounded-xl bg-[var(--color-accent-subtle)] border border-[var(--color-border)] hover:border-[var(--color-border-hover)] transition-all"
                                    aria-label="LinkedIn"
                                >
                                    <Link2 size={18} className="text-[var(--color-purple-400)]" />
                                </a>
                            )}
                            {member.website_url && (
                                <a
                                    href={member.website_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2.5 rounded-xl bg-[var(--color-accent-subtle)] border border-[var(--color-border)] hover:border-[var(--color-border-hover)] transition-all"
                                    aria-label="Website"
                                >
                                    <Globe size={18} className="text-[var(--color-purple-400)]" />
                                </a>
                            )}
                        </div>
                    </div>
                </motion.div>

                {bio && (
                    <motion.div
                        className="glass-card rounded-2xl p-8 mb-10"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.15 }}
                    >
                        <p className="text-[var(--color-text-secondary)] leading-relaxed text-lg">
                            {bio}
                        </p>
                    </motion.div>
                )}

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.25 }}
                >
                    <h2 className="text-2xl font-bold mb-6 text-[var(--color-text-primary)]">
                        {t("projects")}
                    </h2>

                    {member.projects.length === 0 ? (
                        <p className="text-[var(--color-text-muted)]">{t("noProjects")}</p>
                    ) : (
                        <div className="space-y-4">
                            {member.projects.map((project) => (
                                <Link
                                    key={project.slug}
                                    href={{ pathname: "/projekt/[slug]", params: { slug: project.slug } }}
                                    className="glass-card rounded-xl p-6 flex items-center justify-between group block"
                                >
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="category-pill">
                                                {tProjects(`categories.${project.category}`)}
                                            </span>
                                        </div>
                                        <h3 className="text-lg font-semibold text-[var(--color-text-primary)] group-hover:text-[var(--color-purple-300)] transition-colors">
                                            {locale === "en" && project.title_en
                                                ? project.title_en
                                                : project.title_pl}
                                        </h3>
                                        <p className="text-sm text-[var(--color-text-secondary)] mt-1">
                                            {locale === "en" && project.short_desc_en
                                                ? project.short_desc_en
                                                : project.short_desc_pl}
                                        </p>
                                        {project.role_in_project && (
                                            <p className="text-xs text-[var(--color-text-muted)] mt-2">
                                                {project.role_in_project}
                                            </p>
                                        )}
                                    </div>
                                    <ArrowRight
                                        size={18}
                                        className="text-[var(--color-purple-400)] ml-4 flex-shrink-0 group-hover:translate-x-1 transition-transform"
                                    />
                                </Link>
                            ))}
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
}
