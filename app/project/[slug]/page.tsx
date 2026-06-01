import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getProjectBySlug, getProfilesForProject, projects } from "@/lib/content";

type ProjectPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const authors = getProfilesForProject(project);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="content-wrap py-10 md:py-14">
        <section className="grid gap-8 md:grid-cols-[1.2fr_1fr] md:items-start">
          <div>
            <h1 className="text-3xl font-bold md:text-5xl">{project.title}</h1>
            <p className="mt-4 text-lg text-[var(--muted)]">{project.longDescription}</p>
            <div className="mt-6 flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <span key={tag} className="rounded-full bg-[#e8f3ef] px-3 py-1 text-xs font-semibold text-[var(--accent)]">
                  {tag}
                </span>
              ))}
            </div>
            <div className="mt-8 rounded-2xl border border-[#d7e4df] bg-white p-5">
              <h2 className="text-xl font-bold">Autorzy projektu</h2>
              <ul className="mt-3 space-y-2 text-[var(--muted)]">
                {authors.map((author) => (
                  <li key={author.slug}>
                    <Link href={`/${author.type === "group" ? "group" : "profile"}/${author.slug}`} className="font-semibold text-[var(--accent)]">
                      {author.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="relative min-h-72 overflow-hidden rounded-3xl">
            <Image src={project.coverImage} alt={project.title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 40vw" />
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
