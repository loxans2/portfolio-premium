import { prisma } from "@/lib/prisma";
import { ResourceCard } from "@/components/ResourceCard";
import { Reveal, Stagger, StaggerItem } from "@/components/Reveal";
import { ResourcesFilter } from "./resources-filter";
import {
  RESOURCE_ACCESS,
  RESOURCE_CATEGORIES,
  categoryLabel,
} from "@/lib/utils";

export const revalidate = 30;
export const metadata = {
  title: "Catalogue de ressources — ResourceHub",
  description:
    "Parcourez toutes les ressources : jeux, films, plugins, logiciels, templates, musique. Filtrez par catégorie et niveau d'accès.",
};

type SearchParams = {
  c?: string;
  a?: string;
  q?: string;
  sort?: "recent" | "popular" | "rating";
};

export default async function ResourcesPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const category = searchParams.c?.toUpperCase();
  const access = searchParams.a?.toUpperCase();
  const q = searchParams.q?.trim();
  const sort = searchParams.sort ?? "recent";

  const where: any = { status: "PUBLISHED" };
  if (category && (RESOURCE_CATEGORIES as readonly string[]).includes(category)) {
    where.category = category;
  }
  if (access && (RESOURCE_ACCESS as readonly string[]).includes(access)) {
    where.access = access;
  }
  if (q) {
    where.OR = [
      { title: { contains: q, mode: "insensitive" } },
      { excerpt: { contains: q, mode: "insensitive" } },
      { tags: { has: q } },
    ];
  }

  const orderBy =
    sort === "popular"
      ? [{ downloads: "desc" as const }, { createdAt: "desc" as const }]
      : sort === "rating"
        ? [{ ratingAvg: "desc" as const }, { ratingCount: "desc" as const }]
        : [{ createdAt: "desc" as const }];

  const resources = await prisma.resource
    .findMany({ where, orderBy, take: 60 })
    .catch(() => []);

  const heading = category
    ? `Catégorie : ${categoryLabel(category)}`
    : "Toutes les ressources";

  return (
    <div className="container pt-32 pb-24 md:pt-40">
      <Reveal>
        <p className="text-xs uppercase tracking-widest text-gold mb-3">
          Catalogue
        </p>
        <h1 className="font-display text-5xl font-medium tracking-tight md:text-7xl text-balance">
          {heading}
        </h1>
        <p className="mt-6 text-lg text-muted-foreground max-w-2xl">
          Jeux, films, plugins, logiciels, templates et plus encore.
          Chaque ressource est créée par nous ou libre de droits.
        </p>
      </Reveal>

      <ResourcesFilter
        activeCategory={searchParams.c ?? "all"}
        activeAccess={searchParams.a ?? "all"}
        activeSort={sort}
        query={q ?? ""}
      />

      <Stagger className="grid gap-5 md:grid-cols-2 lg:grid-cols-3 mt-10">
        {resources.length === 0 ? (
          <div className="col-span-full text-center py-20">
            <p className="text-muted-foreground">
              Aucune ressource ne correspond à ces filtres.
            </p>
          </div>
        ) : (
          resources.map((r) => (
            <StaggerItem key={r.id}>
              <ResourceCard
                slug={r.slug}
                title={r.title}
                excerpt={r.excerpt}
                category={r.category}
                access={r.access}
                coverImage={r.coverImage}
                tags={r.tags}
                featured={r.featured}
                downloads={r.downloads}
                ratingAvg={r.ratingAvg}
              />
            </StaggerItem>
          ))
        )}
      </Stagger>
    </div>
  );
}
