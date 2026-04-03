"use client";

import { motion } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ArrowLeft, ArrowRight, Users, Shield, Clock } from "lucide-react";

interface GroupViewProps {
    slug: string;
}

const MOCK_GROUP = {
    slug: "web-team",
    name: "Web Team",
    logo_url: null as string | null,
    description_pl:
        "Zespół odpowiedzialny za tworzenie aplikacji webowych i stron internetowych. Specjalizujemy się w React, Next.js i nowoczesnych technologiach frontendowych.",
    description_en:
        "Team responsible for creating web applications and websites. We specialize in React, Next.js, and modern frontend technologies.",
    is_permanent: true,
    members: [
        {
            slug: "Szymon-Sosnowski",
            name: "Szymon Sosnowski",
            nickname: "Kamciosz",
            avatar_url: null as string | null,
            role: "Leader",
        },
    ],
    projects: [
        {
            slug: "teb-app",
            title_pl: "TEB App",
            title_en: "TEB App",
            category: "programowanie" as const,
            short_desc_pl: "Progresywna aplikacja webowa dla szkoły TEB Technikum.",
            short_desc_en: "Progressive web app for TEB Technikum school.",
        },
    ],
};

export default function GroupView({ slug }: GroupViewProps) {
    const t = useTranslations("group");
    const tCommon = useTranslations("common");
    const tProjects = useTranslations("projects");
    const locale = useLocale();

    const group = MOCK_GROUP;
    const desc =
        locale === "en" && group.description_en
            ? group.description_en
            : group.description_pl;

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
                    <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl bg-gradient-to-br from-[var(--color-purple-600)] to-[var(--color-purple-900)] flex items-center justify-center flex-shrink-0 glow-purple overflow-hidden">
                        {group.logo_url ? (
                            <img
                                src={group.logo_url}
                                alt={group.name}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <Users size={40} className="text-white" />
                        )}
                    </div>

                    <div className="flex-1">
                        <h1 className="text-3xl md:text-5xl font-bold gradient-text mb-3">
                            {group.name}
                        </h1>
                        <div className="flex items-center gap-3 mb-4">
                            <span className="category-pill inline-flex items-center gap-1.5">
                                {group.is_permanent ? (
                                    <>
                                        <Shield size={12} />
                                        {t("permanent")}
                                    </>
                                ) : (
                                    <>
                                        <Clock size={12} />
                                        {t("temporary")}
                                    </>
                                )}
                            </span>
                        </div>
                        {desc && (
                            <p className="text-[var(--color-text-secondary)] leading-relaxed">
                                {desc}
                            </p>
                        )}
                    </div>
                </motion.div>

                <motion.div
                    className="mb-12"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.15 }}
                >
                    <h2 className="text-2xl font-bold mb-6 text-[var(--color-text-primary)]">
                        {t("members")}
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {group.members.map((member) => (
                            <Link
                                key={member.slug}
                                href={{ pathname: "/profil/[slug]", params: { slug: member.slug } }}
                                className="glass-card rounded-xl p-5 flex items-center gap-4 group"
                            >
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[var(--color-purple-500)] to-[var(--color-purple-800)] flex items-center justify-center text-lg font-bold text-white flex-shrink-0 overflow-hidden">
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
                                <div>
                                    <p className="font-medium text-[var(--color-text-primary)] group-hover:text-[var(--color-purple-300)] transition-colors">
                                        {member.name}
                                        {member.nickname && (
                                            <span className="text-[var(--color-text-muted)] font-normal">
                                                {" "}
                                                ({member.nickname})
                                            </span>
                                        )}
                                    </p>
                                    {member.role && (
                                        <p className="text-sm text-[var(--color-text-muted)]">
                                            {member.role}
                                        </p>
                                    )}
                                </div>
                            </Link>
                        ))}
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.25 }}
                >
                    <h2 className="text-2xl font-bold mb-6 text-[var(--color-text-primary)]">
                        {t("projects")}
                    </h2>
                    <div className="space-y-4">
                        {group.projects.map((project) => (
                            <Link
                                key={project.slug}
                                href={{ pathname: "/projekt/[slug]", params: { slug: project.slug } }}
                                className="glass-card rounded-xl p-6 flex items-center justify-between group block"
                            >
                                <div className="flex-1">
                                    <span className="category-pill mb-2 inline-block">
                                        {tProjects(`categories.${project.category}`)}
                                    </span>
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
                                </div>
                                <ArrowRight
                                    size={18}
                                    className="text-[var(--color-purple-400)] ml-4 flex-shrink-0 group-hover:translate-x-1 transition-transform"
                                />
                            </Link>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
