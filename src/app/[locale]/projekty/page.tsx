import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import ProjectsGrid from "@/components/projects/ProjectsGrid";

export const metadata: Metadata = {
  title: "Projekty",
  description: "Przeglądaj projekty uczniów TEB Technikum — robotyka, mechatronika, programowanie.",
};

export default async function ProjectsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <ProjectsGrid />;
}
