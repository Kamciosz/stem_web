import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import ProjectDetail from "@/components/projects/ProjectDetail";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const title = slug.replace(/-/g, " ");
  return {
    title,
    description: `Projekt ${title} — STEM x TEB Technikum`,
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  return <ProjectDetail slug={slug} />;
}
