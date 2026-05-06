import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Reveal } from "@/components/Reveal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { categoryLabel } from "@/lib/utils";

export const revalidate = 60;

export async function generateStaticParams() {
  try {
    const projects = await prisma.project.findMany({
      where: { published: true },
      select: { slug: true },
    });
    return projects.map((p) => ({ slug: p.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const p = await prisma.project
    .findUnique({ where: { slug: params.slug } })
    .catch(() => null);
  if (!p) return { title: "Projet" };
  return { title: p.title, description: p.excerpt };
}

export default async function ProjectPage({
  params,
}: {
  params: { slug: string };
}) {
  const project = await prisma.project
    .findUnique({ where: { slug: params.slug } })
    .catch(() => null);

  if (!project || !project.published) notFound();

  const others = await prisma.project
    .findMany({
      where: { published: true, slug: { not: params.slug } },
      orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
      take: 3,
    })
    .catch(() => []);

  return (
    <article className="pt-32 md:pt-40">
      <div className="container">
        <Reveal>
          <Link
            href="/projets"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-12"
          >
            <ArrowLeft size={14} /> Retour aux projets
          </Link>
        </Reveal>

        <Reveal>
          <div className="flex items-center gap-2 mb-6">
            <Badge variant="gold">{categoryLabel(project.category)}</Badge>
            {project.year && <Badge variant="outline">{project.year}</Badge>}
          </div>
          <h1 className="font-display text-5xl font-medium tracking-tight md:text-7xl text-balance">
            {project.title}
          </h1>
          <p className="mt-6 text-xl text-muted-foreground max-w-3xl">
            {project.excerpt}
          </p>
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-6 pb-12 border-b border-border/40">
            {project.client && (
              <div>
                <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">
                  Client
                </p>
                <p className="font-medium">{project.client}</p>
              </div>
            )}
            {project.year && (
              <div>
                <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">
                  Année
                </p>
                <p className="font-medium">{project.year}</p>
              </div>
            )}
            <div>
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">
                Catégorie
              </p>
              <p className="font-medium">{categoryLabel(project.category)}</p>
            </div>
            {project.liveUrl && (
              <div>
                <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">
                  Lien
                </p>
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="font-medium inline-flex items-center gap-1 text-gold hover:underline"
                >
                  Voir le site <ExternalLink size={12} />
                </a>
              </div>
            )}
          </div>
        </Reveal>
      </div>

      <Reveal className="container my-12">
        <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-muted">
          <Image
            src={project.coverImage}
            alt={project.title}
            fill
            priority
            sizes="(max-width: 1280px) 100vw, 1280px"
            className="object-cover"
          />
        </div>
      </Reveal>

      <Reveal className="container py-12">
        <div className="prose prose-neutral dark:prose-invert max-w-3xl mx-auto">
          <p className="text-lg leading-relaxed whitespace-pre-line">
            {project.description}
          </p>
        </div>
      </Reveal>

      {project.images.length > 0 && (
        <div className="container py-12">
          <div className="grid gap-5 md:grid-cols-2">
            {project.images.map((src, i) => (
              <Reveal key={i} delay={i * 0.05}>
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-muted">
                  <Image
                    src={src}
                    alt={`${project.title} — image ${i + 1}`}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      )}

      {project.tags.length > 0 && (
        <div className="container py-12">
          <Reveal className="flex flex-wrap gap-2">
            {project.tags.map((t) => (
              <Badge key={t} variant="outline">
                {t}
              </Badge>
            ))}
          </Reveal>
        </div>
      )}

      {others.length > 0 && (
        <section className="container py-24 border-t border-border/40">
          <Reveal>
            <h2 className="font-display text-3xl font-medium tracking-tight md:text-5xl mb-12">
              D'autres projets
            </h2>
          </Reveal>
          <div className="grid gap-5 md:grid-cols-3">
            {others.map((o) => (
              <Link
                key={o.id}
                href={`/projets/${o.slug}`}
                className="group block rounded-2xl overflow-hidden cursor-pointer"
              >
                <div className="relative aspect-[4/3] bg-muted overflow-hidden">
                  <Image
                    src={o.coverImage}
                    alt={o.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <h3 className="mt-3 font-display text-xl font-medium group-hover:text-gold transition-colors">
                  {o.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {categoryLabel(o.category)}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="container py-24">
        <Reveal className="text-center">
          <Button asChild variant="gold" size="lg">
            <Link href="/contact">Discuter de votre projet</Link>
          </Button>
        </Reveal>
      </section>
    </article>
  );
}
