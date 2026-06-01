import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getProfileBySlug, getProjectsForProfile, profiles } from "@/lib/content";

type GroupPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return profiles.filter((profile) => profile.type === "group").map((profile) => ({ slug: profile.slug }));
}

export default async function GroupPage({ params }: GroupPageProps) {
  const { slug } = await params;
  const group = getProfileBySlug(slug);

  if (!group || group.type !== "group") {
    notFound();
  }

  const projects = getProjectsForProfile(group.slug);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="content-wrap py-10 md:py-14">
        <section className="grid gap-8 md:grid-cols-[220px_1fr] md:items-start">
          <div className="relative h-56 overflow-hidden rounded-2xl border border-[#d7e4df] md:h-64">
            <Image src={group.image} alt={group.name} fill className="object-cover" sizes="220px" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">{group.name}</h1>
            <p className="mt-4 text-[var(--muted)]">{group.bio}</p>
            <h2 className="mt-8 text-xl font-bold">Realizowane projekty</h2>
            <ul className="mt-3 space-y-2">
              {projects.map((project) => (
                <li key={project.slug}>
                  <Link href={`/project/${project.slug}`} className="font-semibold text-[var(--accent)]">
                    {project.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
