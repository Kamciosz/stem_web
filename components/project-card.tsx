import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/lib/content";

type ProjectCardProps = {
  project: Project;
};

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <article className="group overflow-hidden rounded-xl border border-[#1e1e2e] bg-[#12121b] transition-all duration-300 hover:-translate-y-1 hover:border-[#7c3aed]/40 hover:shadow-[0_0_40px_rgba(124,58,237,0.1)]">
      <div className="relative h-52 w-full overflow-hidden">
        <Image
          src={project.coverImage}
          alt={project.title}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      <div className="space-y-4 p-6">
        <div>
          <h3 className="text-xl font-bold">{project.title}</h3>
          <p className="mt-2 text-sm text-[#94a3b8]">{project.shortDescription}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-[#1e1b4b] px-3 py-1 text-xs font-medium text-[#c4b5fd]"
            >
              {tag}
            </span>
          ))}
        </div>

        <Link
          href={`/project/${project.slug}`}
          className="inline-flex rounded-full bg-[#7c3aed] px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-[#6d28d9] hover:scale-105"
        >
          Otwórz projekt
        </Link>
      </div>
    </article>
  );
}
