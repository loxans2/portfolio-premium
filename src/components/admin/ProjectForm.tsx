"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ImageUpload } from "./ImageUpload";
import { slugify } from "@/lib/utils";

type Project = {
  id?: string;
  title?: string;
  slug?: string;
  category?: string;
  excerpt?: string;
  description?: string;
  coverImage?: string;
  client?: string | null;
  year?: string | null;
  liveUrl?: string | null;
  tags?: string[];
  images?: string[];
  featured?: boolean;
  published?: boolean;
  order?: number;
};

const categories = [
  { value: "WEBSITE", label: "Site web" },
  { value: "BRANDING", label: "Identité de marque" },
  { value: "LOGO", label: "Logo" },
  { value: "GRAPHIC", label: "Graphisme" },
  { value: "OTHER", label: "Autre" },
];

export function ProjectForm({
  project,
  action,
}: {
  project?: Project;
  action: (fd: FormData) => Promise<void>;
}) {
  const [title, setTitle] = useState(project?.title ?? "");
  const [slug, setSlug] = useState(project?.slug ?? "");
  const [coverImage, setCoverImage] = useState(project?.coverImage ?? "");
  const [images, setImages] = useState<string[]>(project?.images ?? []);
  const [pending, setPending] = useState(false);

  return (
    <form
      action={async (fd) => {
        setPending(true);
        fd.set("coverImage", coverImage);
        fd.set("images", images.join("\n"));
        try {
          await action(fd);
        } catch (err: any) {
          // Next.js redirect throws NEXT_REDIRECT — must re-throw
          if (err?.digest?.startsWith("NEXT_REDIRECT")) throw err;
          setPending(false);
          toast.error(err?.message ?? "Erreur");
        }
      }}
      className="grid gap-8 lg:grid-cols-3 max-w-6xl"
    >
      <div className="lg:col-span-2 space-y-6">
        <div className="rounded-2xl border border-border/60 bg-card p-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Titre *</Label>
            <Input
              id="title"
              name="title"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (!project?.slug) setSlug(slugify(e.target.value));
              }}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="slug">Slug (URL)</Label>
            <Input
              id="slug"
              name="slug"
              value={slug}
              onChange={(e) => setSlug(slugify(e.target.value))}
              placeholder="auto"
            />
            <p className="text-xs text-muted-foreground">
              URL : /projets/{slug || "..."}
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="excerpt">Accroche courte *</Label>
            <Input
              id="excerpt"
              name="excerpt"
              defaultValue={project?.excerpt}
              maxLength={300}
              required
              placeholder="Une phrase qui résume le projet"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description complète *</Label>
            <Textarea
              id="description"
              name="description"
              defaultValue={project?.description}
              required
              rows={8}
              placeholder="Décrivez le projet, le brief, la solution apportée…"
            />
          </div>
        </div>

        <div className="rounded-2xl border border-border/60 bg-card p-6 space-y-4">
          <h3 className="font-display text-lg font-medium">Image de couverture *</h3>
          <ImageUpload value={coverImage} onChange={setCoverImage} />
        </div>

        <div className="rounded-2xl border border-border/60 bg-card p-6 space-y-4">
          <h3 className="font-display text-lg font-medium">Galerie</h3>
          <p className="text-sm text-muted-foreground">
            Images supplémentaires affichées dans la page projet.
          </p>
          <ImageUpload multi values={images} onChangeMulti={setImages} />
        </div>
      </div>

      <div className="space-y-6">
        <div className="rounded-2xl border border-border/60 bg-card p-6 space-y-4">
          <h3 className="font-display text-lg font-medium">Réglages</h3>
          <div className="space-y-2">
            <Label htmlFor="category">Catégorie *</Label>
            <select
              id="category"
              name="category"
              defaultValue={project?.category ?? "WEBSITE"}
              className="flex h-11 w-full rounded-lg border border-input bg-background px-4 py-2 text-sm cursor-pointer"
              required
            >
              {categories.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
          <label className="flex items-center gap-3 p-3 rounded-lg border border-border/60 cursor-pointer hover:bg-accent">
            <input
              type="checkbox"
              name="featured"
              defaultChecked={project?.featured}
              className="h-4 w-4 cursor-pointer"
            />
            <span className="text-sm">Mettre en avant</span>
          </label>
          <label className="flex items-center gap-3 p-3 rounded-lg border border-border/60 cursor-pointer hover:bg-accent">
            <input
              type="checkbox"
              name="published"
              defaultChecked={project?.published ?? true}
              className="h-4 w-4 cursor-pointer"
            />
            <span className="text-sm">Publié</span>
          </label>
          <div className="space-y-2">
            <Label htmlFor="order">Ordre d'affichage</Label>
            <Input
              id="order"
              name="order"
              type="number"
              defaultValue={project?.order ?? 0}
            />
          </div>
        </div>

        <div className="rounded-2xl border border-border/60 bg-card p-6 space-y-4">
          <h3 className="font-display text-lg font-medium">Métadonnées</h3>
          <div className="space-y-2">
            <Label htmlFor="client">Client</Label>
            <Input
              id="client"
              name="client"
              defaultValue={project?.client ?? ""}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="year">Année</Label>
            <Input id="year" name="year" defaultValue={project?.year ?? ""} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="liveUrl">URL du site (si site live)</Label>
            <Input
              id="liveUrl"
              name="liveUrl"
              type="url"
              defaultValue={project?.liveUrl ?? ""}
              placeholder="https://..."
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tags">Tags (séparés par des virgules)</Label>
            <Input
              id="tags"
              name="tags"
              defaultValue={project?.tags?.join(", ") ?? ""}
              placeholder="Next.js, Branding, Print"
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Button type="submit" variant="gold" disabled={pending}>
            {pending ? "Enregistrement..." : project?.id ? "Mettre à jour" : "Créer le projet"}
          </Button>
          <Button asChild variant="outline">
            <Link href="/admin/projets">Annuler</Link>
          </Button>
        </div>
      </div>
    </form>
  );
}
