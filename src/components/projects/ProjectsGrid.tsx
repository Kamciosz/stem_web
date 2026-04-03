"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
  ArrowRight,
  Star,
  GitCommit,
  Users,
  Search,
  Filter,
} from "lucide-react";
import type { Project, ProjectMember, Member, ProjectMedia } from "@/types/database";

interface ProjectWithRelations extends Project {
  project_media?: ProjectMedia[];
  project_members?: (ProjectMember & { member: Member })[];
}

const categories = ["all", "robotyka", "mechatronika", "programowanie", "inne"] as const;

// Mock data — same as on homepage. In production fetched from Supabase
const MOCK_PROJECTS: ProjectWithRelations[] = [
  {
    id: "1",
    slug: "teb-app",
    title_pl: "TEB App",
    title_en: "TEB App",
    short_desc_pl:
      "Progresywna aplikacja webowa dla szkoły TEB Technikum — plan lekcji, oceny, ogłoszenia w jednym miejscu.",
    short_desc_en:
      "Progressive web app for TEB Technikum school — schedule, grades, announcements in one place.",
    full_desc_pl: null,
    full_desc_en: null,
    category: "programowanie",
    github_repo: "https://github.com/Kamciosz/teb-app-production",
    website_url: null,
    is_featured: true,
    display_order: 1,
    popularity: 100,
    is_group_project: false,
    group_id: null,
    status: "published",
    created_at: "2025-09-01",
    updated_at: "2026-03-15",
    project_media: [],
    project_members: [
      {
        id: "pm1",
        project_id: "1",
        member_id: "u1",
        role_in_project: "Full-Stack Developer",
        display_order: 1,
        member: {
          id: "u1",
          slug: "Szymon-Sosnowski",
          name: "Szymon Sosnowski",
          nickname: "Kamciosz",
          avatar_url: null,
          bio_pl: null,
          bio_en: null,
          github_url: "https://github.com/Kamciosz",
          linkedin_url: null,
          website_url: null,
          email: null,
          role: "member",
          display_order: 1,
          is_visible: true,
          created_at: "",
        },
      },
    ],
  },
];

export default function ProjectsGrid() {
  const t = useTranslations("projects");
  const locale = useLocale();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [search, setSearch] = useState("");

  const filtered = MOCK_PROJECTS.filter((p) => {
    const matchesCategory =
      activeCategory === "all" || p.category === activeCategory;
    const title = locale === "en" && p.title_en ? p.title_en : p.title_pl;
    const matchesSearch = title
      .toLowerCase()
      .includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div ref={ref} className="min-h-screen pt-28 pb-20 stone-texture">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        {/* Header */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-6xl font-bold gradient-text mb-4">
            {t("title")}
          </h1>
          <p className="text-lg text-[var(--color-text-secondary)]">
            {t("subtitle")}
          </p>
        </motion.div>

        {/* Filters bar */}
        <motion.div
          className="flex flex-col md:flex-row gap-4 mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Szukaj projektu..."
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-[var(--color-bg-card)] border border-[var(--color-border)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-purple-500)] transition-colors"
            />
          </div>

          {/* Category pills */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`category-pill ${activeCategory === cat
                    ? "!bg-[var(--color-purple-600)] !text-white !border-[var(--color-purple-600)]"
                    : ""
                  }`}
              >
                {t(`categories.${cat}`)}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((project, index) => (
            <motion.article
              key={project.id}
              className="glass-card rounded-2xl overflow-hidden group"
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              whileHover={{ y: -6 }}
            >
              {/* Thumbnail */}
              <div className="aspect-video bg-gradient-to-br from-[var(--color-purple-950)] to-[var(--color-bg-card)] flex items-center justify-center">
                <span className="text-4xl font-bold text-[var(--color-purple-800)]/20">
                  {(locale === "en" && project.title_en ? project.title_en : project.title_pl).charAt(0)}
                </span>
              </div>

              <div className="p-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="category-pill">{t(`categories.${project.category}`)}</span>
                  {project.is_group_project && (
                    <span className="category-pill">
                      <Users size={12} />
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-bold text-[var(--color-text-primary)] group-hover:text-[var(--color-purple-300)] transition-colors mb-2">
                  {locale === "en" && project.title_en ? project.title_en : project.title_pl}
                </h3>

                <p className="text-sm text-[var(--color-text-secondary)] line-clamp-2 mb-4">
                  {locale === "en" && project.short_desc_en
                    ? project.short_desc_en
                    : project.short_desc_pl}
                </p>

                {/* Authors */}
                <div className="flex items-center justify-between">
                  <div className="flex -space-x-2">
                    {project.project_members?.slice(0, 3).map((pm) => (
                      <div
                        key={pm.member_id}
                        className="w-7 h-7 rounded-full bg-gradient-to-br from-[var(--color-purple-500)] to-[var(--color-purple-800)] flex items-center justify-center text-[10px] font-bold text-white border-2 border-[var(--color-bg-card)]"
                        title={pm.member.name}
                      >
                        {pm.member.name.charAt(0)}
                      </div>
                    ))}
                  </div>

                  <Link
                    href={{ pathname: "/projekt/[slug]", params: { slug: project.slug } }}
                    className="flex items-center gap-1 text-sm text-[var(--color-purple-400)] hover:text-[var(--color-purple-300)] transition-colors"
                  >
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="text-center text-[var(--color-text-muted)] py-20">
            {t("noProjects")}
          </p>
        )}
      </div>
    </div>
  );
}
