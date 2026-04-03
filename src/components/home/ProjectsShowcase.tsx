"use client";

import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ArrowRight, Users } from "lucide-react";
import { GitHubStats } from "@/components/projects/GitHubStats";
import ImageCarousel from "@/components/projects/ImageCarousel";
import { createClient } from "@/lib/supabase/client";
import type { Project, ProjectMedia, ProjectMember, Member } from "@/types/database";

/* -------------------------------------------------------------------------- */
/* Types                                                                       */
/* -------------------------------------------------------------------------- */

interface ProjectWithRelations extends Project {
  project_media?: ProjectMedia[];
  project_members?: (ProjectMember & { member: Member })[];
}

/* -------------------------------------------------------------------------- */
/* Single project row — alternating image/text                                 */
/* -------------------------------------------------------------------------- */

function ProjectRow({
  project,
  index,
  locale,
  t,
}: {
  project: ProjectWithRelations;
  index: number;
  locale: string;
  t: ReturnType<typeof useTranslations<"projects">>;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const isReversed = index % 2 === 1;

  const title = locale === "en" && project.title_en ? project.title_en : project.title_pl;
  const desc = locale === "en" && project.short_desc_en ? project.short_desc_en : project.short_desc_pl;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: isReversed ? 60 : -60 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.9, ease: [0.4, 0, 0.2, 1] }}
    >
      <Link
        href={{ pathname: "/projekt/[slug]", params: { slug: project.slug } }}
        className={`group grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center ${isReversed ? "lg:direction-rtl" : ""}`}
      >
        {/* Image / Carousel */}
        <div className={`relative rounded-2xl overflow-hidden depth-card ${isReversed ? "lg:order-2" : ""}`}>
          <ImageCarousel
            images={(project.project_media ?? []).filter(m => m.url).map(m => ({ url: m.url, alt: m.alt_text || title }))}
            fallbackLetter={title.charAt(0)}
          />
          {/* Hover overlay */}
          <div className="absolute inset-0 bg-[var(--color-purple-600)]/0 group-hover:bg-[var(--color-purple-600)]/10 transition-colors duration-500 pointer-events-none rounded-2xl" />
        </div>

        {/* Text */}
        <div className={`${isReversed ? "lg:order-1 lg:text-right" : ""}`} style={{ direction: "ltr" }}>
          {/* Category + group badge */}
          <div className={`flex items-center gap-2 mb-4 ${isReversed ? "lg:justify-end" : ""}`}>
            <span className="category-pill">{t(`categories.${project.category}`)}</span>
            {project.is_group_project && (
              <span className="category-pill">
                <Users size={12} />
                {t("groupProject")}
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="text-2xl md:text-3xl lg:text-4xl font-light mb-4 text-[var(--color-text-primary)] group-hover:text-[var(--color-purple-300)] transition-colors duration-500">
            {title}
          </h3>

          {/* Description */}
          <p className="text-base text-[var(--color-text-secondary)] leading-relaxed mb-6 max-w-lg">
            {desc}
          </p>

          {/* Authors */}
          <div className={`flex items-center gap-3 ${isReversed ? "lg:justify-end" : ""}`}>
            {project.project_members?.map((pm) => (
              <div key={pm.member_id} className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--color-purple-500)] to-[var(--color-purple-800)] flex items-center justify-center text-xs font-bold text-white">
                  {pm.member.name.charAt(0)}
                </div>
                <span className="text-sm text-[var(--color-text-secondary)]">
                  {pm.member.name}
                </span>
              </div>
            ))}
          </div>

          {/* GitHub stats */}
          {project.github_repo && (
            <div className={`mt-4 ${isReversed ? "lg:text-left" : ""}`} onClick={(e) => e.preventDefault()}>
              <GitHubStats repoUrl={project.github_repo} />
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */
/* Main component                                                              */
/* -------------------------------------------------------------------------- */

export default function ProjectsShowcase() {
  const t = useTranslations("projects");
  const locale = useLocale();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [projects, setProjects] = useState<ProjectWithRelations[]>([]);

  useEffect(() => {
    let isMounted = true;

    async function loadProjects() {
      try {
        const supabase = createClient();
        const { data } = await supabase
          .from("projects")
          .select(`
            *,
            project_media(*),
            project_members(*, member:members(*))
          `)
          .eq("status", "published")
          .order("display_order", { ascending: true })
          .limit(6);

        if (isMounted) {
          setProjects((data as ProjectWithRelations[]) ?? []);
        }
      } catch {
        if (isMounted) {
          setProjects([]);
        }
      }
    }

    loadProjects();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section
      id="projects"
      ref={ref}
      className="relative py-12 md:py-14 stone-texture"
    >
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        {/* Section header */}
        <motion.div
          className="text-center mb-10 md:mb-12"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, ease: [0.4, 0, 0.2, 1] }}
        >
          <span className="text-sm tracking-[0.2em] uppercase text-[var(--color-purple-400)] font-medium">
            {t("subtitle")}
          </span>
          <h2 className="text-3xl md:text-5xl font-bold mt-3 gradient-text">
            {t("title")}
          </h2>
        </motion.div>

        {/* Alternating project rows */}
        <div className="flex flex-col gap-10 md:gap-12">
          {projects.map((project, index) => (
            <ProjectRow
              key={project.id}
              project={project}
              index={index}
              locale={locale}
              t={t}
            />
          ))}
        </div>

        {/* Empty state */}
        {projects.length === 0 && (
          <motion.p
            className="text-center text-[var(--color-text-muted)] py-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {t("noProjects")}
          </motion.p>
        )}

        {/* View all button */}
        <motion.div
          className="text-center mt-10 md:mt-12"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <Link
            href="/projekty"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full border border-[var(--color-border)] text-[var(--color-purple-300)] hover:bg-[var(--color-accent-subtle)] hover:border-[var(--color-border-hover)] transition-all duration-500 font-medium"
          >
            {t("viewAll")}
            <ArrowRight size={18} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
