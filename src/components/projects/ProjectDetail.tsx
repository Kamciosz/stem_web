"use client";

import { motion } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
  ArrowLeft,
  ExternalLink,
  GitFork,
  Star,
  GitCommit,
  Users,
  Calendar,
} from "lucide-react";
import { GitHubStats } from "@/components/projects/GitHubStats";
import ImageCarousel from "@/components/projects/ImageCarousel";

interface ProjectDetailProps {
  slug: string;
}

export default function ProjectDetail({ slug }: ProjectDetailProps) {
  const t = useTranslations("projects");
  const tCommon = useTranslations("common");
  const locale = useLocale();

  // Mock data — will be replaced with Supabase fetch
  const project = {
    slug,
    title_pl: "TEB App",
    title_en: "TEB App",
    short_desc_pl:
      "Progresywna aplikacja webowa dla szkoły TEB Technikum.",
    short_desc_en:
      "Progressive web app for TEB Technikum school.",
    full_desc_pl:
      "TEB App to progresywna aplikacja webowa stworzona z myślą o uczniach TEB Technikum w Warszawie. Aplikacja integruje plan lekcji, system ocen i ogłoszenia szkolne w jednym, wygodnym miejscu dostępnym z każdego urządzenia. Zbudowana z użyciem nowoczesnych technologii webowych, zapewnia szybkość działania i możliwość pracy offline.",
    full_desc_en:
      "TEB App is a progressive web application designed for TEB Technikum students in Warsaw. The app integrates class schedules, grades, and school announcements in one convenient place accessible from any device. Built with modern web technologies, it ensures fast performance and offline capability.",
    category: "programowanie" as const,
    github_repo: "https://github.com/Kamciosz/teb-app-production",
    website_url: null,
    is_group_project: false,
    created_at: "2025-09-01",
    updated_at: "2026-03-15",
    project_members: [
      {
        member: {
          slug: "Szymon-Sosnowski",
          name: "Szymon Sosnowski",
          nickname: "Kamciosz",
          avatar_url: null,
          github_url: "https://github.com/Kamciosz",
        },
        role_in_project: "Full-Stack Developer",
      },
    ],
    project_media: [] as { id: string; url: string; alt_text: string }[],
  };

  const title =
    locale === "en" && project.title_en ? project.title_en : project.title_pl;
  const fullDesc =
    locale === "en" && project.full_desc_en
      ? project.full_desc_en
      : project.full_desc_pl;

  return (
    <div className="min-h-screen pt-28 pb-20 stone-texture">
      <div className="mx-auto max-w-4xl px-6 md:px-10">
        {/* Back button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Link
            href="/projekty"
            className="inline-flex items-center gap-2 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-purple-400)] transition-colors mb-8"
          >
            <ArrowLeft size={16} />
            {tCommon("back")}
          </Link>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="category-pill">
              {t(`categories.${project.category}`)}
            </span>
            {project.is_group_project && (
              <span className="category-pill">
                <Users size={12} />
                {t("groupProject")}
              </span>
            )}
          </div>

          <h1 className="text-4xl md:text-6xl font-bold gradient-text mb-6">
            {title}
          </h1>

          {/* Meta info */}
          <div className="flex flex-wrap items-center gap-4 mb-8 text-sm text-[var(--color-text-muted)]">
            <span className="flex items-center gap-1.5">
              <Calendar size={14} />
              {new Date(project.updated_at).toLocaleDateString(
                locale === "en" ? "en-US" : "pl-PL"
              )}
            </span>
            {project.github_repo && (
              <a
                href={project.github_repo}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 hover:text-[var(--color-purple-400)] transition-colors"
              >
                <GitFork size={14} />
                GitHub
                <ExternalLink size={12} />
              </a>
            )}
            {project.website_url && (
              <a
                href={project.website_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 hover:text-[var(--color-purple-400)] transition-colors"
              >
                <ExternalLink size={14} />
                Website
              </a>
            )}
          </div>
        </motion.div>

        {/* Media gallery */}
        <motion.div
          className="mb-10"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <ImageCarousel
            images={project.project_media.map((m) => ({ url: m.url, alt: m.alt_text || title }))}
            fallbackLetter={title.charAt(0)}
          />
        </motion.div>

        {/* Description */}
        <motion.div
          className="glass-card rounded-2xl p-8 mb-10"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <p className="text-[var(--color-text-secondary)] leading-relaxed text-lg">
            {fullDesc}
          </p>

          {/* GitHub repo stats */}
          {project.github_repo && (
            <div className="mt-6 pt-6 border-t border-white/[0.06]">
              <GitHubStats repoUrl={project.github_repo} />
            </div>
          )}
        </motion.div>

        {/* Team */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <h2 className="text-xl font-semibold mb-4 text-[var(--color-text-primary)]">
            {project.is_group_project ? t("groupProject") : t("by")}
          </h2>

          <div className="space-y-3">
            {project.project_members.map((pm) => (
              <Link
                key={pm.member.slug}
                href={{ pathname: "/profil/[slug]", params: { slug: pm.member.slug } }}
                className="glass-card rounded-xl p-4 flex items-center gap-4 group"
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[var(--color-purple-500)] to-[var(--color-purple-800)] flex items-center justify-center text-lg font-bold text-white">
                  {pm.member.name.charAt(0)}
                </div>
                <div>
                  <p className="font-medium text-[var(--color-text-primary)] group-hover:text-[var(--color-purple-300)] transition-colors">
                    {pm.member.name}
                    {pm.member.nickname && (
                      <span className="text-[var(--color-text-muted)] font-normal">
                        {" "}
                        ({pm.member.nickname})
                      </span>
                    )}
                  </p>
                  {pm.role_in_project && (
                    <p className="text-sm text-[var(--color-text-muted)]">
                      {pm.role_in_project}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
