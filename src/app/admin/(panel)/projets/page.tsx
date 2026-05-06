import Link from "next/link";
import Image from "next/image";
import { Plus, Pencil, Eye, EyeOff } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { categoryLabel } from "@/lib/utils";
import { DeleteProjectButton } from "./delete-button";
import { TogglePublishedButton } from "./toggle-published";

export const dynamic = "force-dynamic";

export default async function AdminProjectsPage() {
  const projects = await prisma.project
    .findMany({ orderBy: [{ order: "asc" }, { createdAt: "desc" }] })
    .catch(() => []);

  return (
    <div className="max-w-6xl">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="font-display text-4xl font-medium tracking-tight">
            Projets
          </h1>
          <p className="mt-2 text-muted-foreground">
            Gérez votre portfolio.
          </p>
        </div>
        <Button asChild variant="gold">
          <Link href="/admin/projets/new">
            <Plus size={16} /> Nouveau projet
          </Link>
        </Button>
      </div>

      {projects.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-12 text-center">
          <p className="text-muted-foreground">Aucun projet pour le moment.</p>
          <Button asChild className="mt-4" variant="gold">
            <Link href="/admin/projets/new">Créer le premier</Link>
          </Button>
        </div>
      ) : (
        <div className="rounded-2xl border border-border/60 bg-card overflow-hidden">
          <ul className="divide-y divide-border/60">
            {projects.map((p) => (
              <li
                key={p.id}
                className="flex items-center gap-4 p-4 hover:bg-accent/50 transition-colors"
              >
                <div className="relative h-16 w-24 rounded-lg overflow-hidden bg-muted shrink-0">
                  <Image
                    src={p.coverImage}
                    alt={p.title}
                    fill
                    sizes="96px"
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-medium truncate">{p.title}</h3>
                    <Badge variant="outline">{categoryLabel(p.category)}</Badge>
                    {p.featured && <Badge variant="gold">Featured</Badge>}
                    {!p.published && (
                      <Badge variant="secondary">Brouillon</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground truncate mt-0.5">
                    {p.excerpt}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <TogglePublishedButton id={p.id} published={p.published} />
                  <Button asChild size="icon" variant="ghost">
                    <Link href={`/admin/projets/${p.id}`}>
                      <Pencil size={14} />
                    </Link>
                  </Button>
                  <DeleteProjectButton id={p.id} title={p.title} />
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
