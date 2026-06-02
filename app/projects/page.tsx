import { ProjectCard } from "@/components/project-card";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { projects } from "@/lib/content";

export const metadata = {
  title: "Projekty | Kolko Technologiczne",
};

export default function ProjectsPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="content-wrap py-10 md:py-14">
        <h1 className="text-3xl font-bold md:text-4xl">Projekty uczniow</h1>
        <p className="mt-3 max-w-2xl text-[var(--muted)]">
          Karta kazdego projektu zawiera opis, autorow i wejscie do trybu prezentacji.
        </p>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
