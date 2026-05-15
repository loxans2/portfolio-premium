"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Pencil, Trash2, Star, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { accessLabel, categoryLabel, cn, formatNumber } from "@/lib/utils";

interface Row {
  id: string;
  slug: string;
  title: string;
  coverImage: string;
  category: string;
  access: string;
  status: string;
  featured: boolean;
  downloads: number;
  createdAt: string;
}

export function ResourcesAdminTable({ resources }: { resources: Row[] }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState<string | null>(null);

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Supprimer "${title}" ?`)) return;
    setDeleting(id);
    const res = await fetch(`/api/admin/resources/${id}`, { method: "DELETE" });
    setDeleting(null);
    if (!res.ok) {
      toast.error("Suppression échouée");
      return;
    }
    toast.success("Ressource supprimée");
    router.refresh();
  }

  async function togglePublish(id: string, status: string) {
    const next = status === "PUBLISHED" ? "DRAFT" : "PUBLISHED";
    const res = await fetch(`/api/admin/resources/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: next }),
    });
    if (!res.ok) {
      toast.error("Mise à jour échouée");
      return;
    }
    toast.success(next === "PUBLISHED" ? "Publié" : "Dépublié");
    router.refresh();
  }

  if (resources.length === 0) {
    return (
      <div className="mt-10 rounded-2xl border border-dashed border-border/60 p-12 text-center">
        <p className="text-muted-foreground">Aucune ressource.</p>
        <Button asChild variant="gold" className="mt-4">
          <Link href="/admin/resources/new">+ Créer la première ressource</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mt-8 rounded-2xl border border-border/60 bg-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-secondary/50 border-b border-border/60">
            <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground">
              <th className="p-4">Ressource</th>
              <th className="p-4">Catégorie</th>
              <th className="p-4">Accès</th>
              <th className="p-4">Statut</th>
              <th className="p-4 text-right">DL</th>
              <th className="p-4 w-0"></th>
            </tr>
          </thead>
          <tbody>
            {resources.map((r) => (
              <tr
                key={r.id}
                className="border-b border-border/40 last:border-0 hover:bg-accent/30 transition-colors"
              >
                <td className="p-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative h-12 w-16 rounded overflow-hidden bg-muted shrink-0">
                      {r.coverImage && (
                        <Image
                          src={r.coverImage}
                          alt=""
                          fill
                          sizes="64px"
                          className="object-cover"
                        />
                      )}
                    </div>
                    <div className="min-w-0">
                      <Link
                        href={`/admin/resources/${r.id}`}
                        className="font-medium hover:text-gold transition-colors block truncate"
                      >
                        {r.title}
                        {r.featured && (
                          <Star size={12} className="inline ml-1 fill-gold text-gold" />
                        )}
                      </Link>
                      <p className="text-xs text-muted-foreground truncate">
                        /{r.slug}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="p-4 text-muted-foreground">
                  {categoryLabel(r.category)}
                </td>
                <td className="p-4">
                  <span
                    className={cn(
                      "inline-flex rounded-full px-2 py-0.5 text-xs",
                      r.access === "VIP"
                        ? "bg-gold/15 text-gold"
                        : r.access === "PREMIUM"
                          ? "bg-foreground/10 text-foreground"
                          : "bg-emerald-500/15 text-emerald-500",
                    )}
                  >
                    {accessLabel(r.access)}
                  </span>
                </td>
                <td className="p-4">
                  <span
                    className={cn(
                      "inline-flex rounded-full px-2 py-0.5 text-xs",
                      r.status === "PUBLISHED"
                        ? "bg-emerald-500/15 text-emerald-500"
                        : r.status === "PENDING"
                          ? "bg-amber-500/15 text-amber-500"
                          : r.status === "REJECTED"
                            ? "bg-destructive/15 text-destructive"
                            : "bg-muted text-muted-foreground",
                    )}
                  >
                    {r.status}
                  </span>
                </td>
                <td className="p-4 text-right text-muted-foreground">
                  {formatNumber(r.downloads)}
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-1 justify-end">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => togglePublish(r.id, r.status)}
                      title={r.status === "PUBLISHED" ? "Dépublier" : "Publier"}
                    >
                      {r.status === "PUBLISHED" ? (
                        <EyeOff size={14} />
                      ) : (
                        <Eye size={14} />
                      )}
                    </Button>
                    <Button asChild variant="ghost" size="sm" title="Éditer">
                      <Link href={`/admin/resources/${r.id}`}>
                        <Pencil size={14} />
                      </Link>
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(r.id, r.title)}
                      disabled={deleting === r.id}
                      title="Supprimer"
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
