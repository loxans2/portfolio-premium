import { prisma } from "@/lib/prisma";
import { ProjectCard } from "@/components/ProjectCard";
import { Reveal, Stagger, StaggerItem } from "@/components/Reveal";
import { ProjectsFilter } from "./projects-filter";

export const revalidate = 60;
export const metadata = { title: "Projets" };

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: { c?: string };
}) {
  const category = searchParams.c?.toUpperCase();
  const valid = ["WEBSITE", "BRANDING", "LOGO", "GRAPHIC", "OTHER"];
  const where: any = { published: true };
  if (category && valid.includes(category)) where.category = category;

  const projects = await prisma.project
    .findMany({
      where,
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    })
    .catch(() => []);

  return (
    <div className="container pt-32 pb-24 md:pt-40">
      <Reveal>
        <p className="text-xs uppercase tracking-widest text-gold mb-3">
          Portfolio
        </p>
        <h1 className="font-display text-5xl font-medium tracking-tight md:text-7xl text-balance">
          Tous mes projets.
        </h1>
        <p className="mt-6 text-lg text-muted-foreground max-w-2xl">
          Sites web, identités de marque, logos. Chaque projet est une
          collaboration unique.
        </p>
      </Reveal>

      <ProjectsFilter active={searchParams.c ?? "all"} />

      <Stagger className="grid gap-5 md:grid-cols-2 lg:grid-cols-3 mt-12">
        {projects.length === 0 ? (
          <p className="col-span-full text-muted-foreground">
            Aucun projet pour cette catégorie.
          </p>
        ) : (
          projects.map((p) => (
            <StaggerItem key={p.id}>
              <ProjectCard
                slug={p.slug}
                title={p.title}
                excerpt={p.excerpt}
                category={p.category}
                coverImage={p.coverImage}
                tags={p.tags}
                featured={p.featured}
              />
            </StaggerItem>
          ))
        )}
      </Stagger>
    </div>
  );
}
