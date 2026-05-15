"use client";

import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { toast } from "sonner";
import { Save, ArrowLeft, Trash2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ImageUpload } from "./ImageUpload";
import {
  RESOURCE_ACCESS,
  RESOURCE_CATEGORIES,
  accessLabel,
  categoryLabel,
  slugify,
} from "@/lib/utils";

const schema = z.object({
  slug: z.string().min(2),
  title: z.string().min(2),
  category: z.enum(RESOURCE_CATEGORIES as any),
  access: z.enum(RESOURCE_ACCESS as any),
  excerpt: z.string().min(10),
  description: z.string().min(10),
  coverImage: z.string().min(1, "Image de couverture requise"),
  images: z.array(z.string()).default([]),
  fileUrl: z.string().optional().nullable(),
  fileSize: z.string().optional().nullable(),
  version: z.string().optional().nullable(),
  license: z.string().optional().nullable(),
  tags: z.string(),
  featured: z.boolean().default(false),
  status: z.enum(["DRAFT", "PENDING", "PUBLISHED", "REJECTED"]),
  order: z.coerce.number().int().default(0),
  price: z.coerce.number().optional().nullable(),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  initial?: Partial<FormValues> & { id?: string };
}

export function ResourceForm({ initial }: Props) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const isEdit = Boolean(initial?.id);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema) as any,
    defaultValues: {
      slug: initial?.slug ?? "",
      title: initial?.title ?? "",
      category: (initial?.category as any) ?? "TEMPLATES",
      access: (initial?.access as any) ?? "FREE",
      excerpt: initial?.excerpt ?? "",
      description: initial?.description ?? "",
      coverImage: initial?.coverImage ?? "",
      images: initial?.images ?? [],
      fileUrl: initial?.fileUrl ?? "",
      fileSize: initial?.fileSize ?? "",
      version: initial?.version ?? "",
      license: initial?.license ?? "",
      tags: Array.isArray(initial?.tags)
        ? (initial!.tags as any).join(", ")
        : (initial?.tags as any) ?? "",
      featured: initial?.featured ?? false,
      status: (initial?.status as any) ?? "DRAFT",
      order: initial?.order ?? 0,
      price: initial?.price ?? 0,
    },
  });

  const title = watch("title");

  async function onSubmit(values: FormValues) {
    setSaving(true);
    const payload = {
      ...values,
      tags: values.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    };
    const res = await fetch(
      isEdit
        ? `/api/admin/resources/${initial!.id}`
        : "/api/admin/resources",
      {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      },
    );
    setSaving(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      toast.error(data.error ?? "Sauvegarde échouée");
      return;
    }
    toast.success(isEdit ? "Mis à jour" : "Créé");
    router.push("/admin/resources");
    router.refresh();
  }

  async function handleDelete() {
    if (!initial?.id) return;
    if (!confirm("Supprimer définitivement cette ressource ?")) return;
    setDeleting(true);
    const res = await fetch(`/api/admin/resources/${initial.id}`, {
      method: "DELETE",
    });
    setDeleting(false);
    if (!res.ok) {
      toast.error("Suppression échouée");
      return;
    }
    toast.success("Supprimé");
    router.push("/admin/resources");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-4xl">
      <div>
        <Link
          href="/admin/resources"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft size={14} /> Retour à la liste
        </Link>
        <h1 className="font-display text-4xl font-medium tracking-tight mt-4">
          {isEdit ? "Éditer la ressource" : "Nouvelle ressource"}
        </h1>
      </div>

      <Section title="Informations">
        <Field label="Titre" error={errors.title?.message}>
          <Input
            {...register("title")}
            onBlur={(e) => {
              if (!watch("slug")) setValue("slug", slugify(e.target.value));
            }}
          />
        </Field>
        <Field label="Slug (URL)" error={errors.slug?.message}>
          <Input {...register("slug")} placeholder="ex: lumen-ui-kit" />
        </Field>
        <Field label="Extrait (1-2 phrases)" error={errors.excerpt?.message}>
          <Textarea rows={2} {...register("excerpt")} />
        </Field>
        <Field label="Description complète" error={errors.description?.message}>
          <Textarea rows={8} {...register("description")} />
        </Field>
      </Section>

      <Section title="Classification">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Catégorie">
            <select
              {...register("category")}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
            >
              {RESOURCE_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {categoryLabel(c)}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Niveau d'accès">
            <select
              {...register("access")}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
            >
              {RESOURCE_ACCESS.map((a) => (
                <option key={a} value={a}>
                  {accessLabel(a)}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Tags (séparés par des virgules)">
            <Input {...register("tags")} placeholder="React, Tailwind, UI Kit" />
          </Field>
          <Field label="Ordre d'affichage">
            <Input type="number" {...register("order")} />
          </Field>
        </div>
      </Section>

      <Section title="Média">
        <Field label="Image de couverture" error={errors.coverImage?.message}>
          <Controller
            control={control}
            name="coverImage"
            render={({ field }) => (
              <ImageUpload value={field.value} onChange={field.onChange} />
            )}
          />
        </Field>
        <Field label="Images d'aperçu (facultatif)">
          <Controller
            control={control}
            name="images"
            render={({ field }) => (
              <ImageUpload
                multi
                values={field.value}
                onChangeMulti={field.onChange}
              />
            )}
          />
        </Field>
      </Section>

      <Section title="Fichier & métadonnées">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="URL du fichier à télécharger">
            <Input {...register("fileUrl")} placeholder="https://..." />
          </Field>
          <Field label="Taille du fichier">
            <Input {...register("fileSize")} placeholder="ex: 12.4 MB" />
          </Field>
          <Field label="Version">
            <Input {...register("version")} placeholder="ex: 2.4.0" />
          </Field>
          <Field label="Licence">
            <Input {...register("license")} placeholder="ex: MIT, CC-BY 4.0" />
          </Field>
        </div>
      </Section>

      <Section title="Publication">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Statut">
            <select
              {...register("status")}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="DRAFT">Brouillon</option>
              <option value="PENDING">En attente</option>
              <option value="PUBLISHED">Publié</option>
              <option value="REJECTED">Rejeté</option>
            </select>
          </Field>
          <label className="flex items-center gap-3 pt-7 cursor-pointer">
            <input
              type="checkbox"
              {...register("featured")}
              className="h-4 w-4"
            />
            <span className="text-sm">Mettre en vedette (Featured)</span>
          </label>
        </div>
      </Section>

      <div className="flex items-center justify-between pt-6 border-t border-border/60">
        <Button asChild variant="ghost" type="button">
          <Link href="/admin/resources">Annuler</Link>
        </Button>
        <div className="flex gap-2">
          {isEdit && (
            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
              disabled={deleting}
            >
              <Trash2 size={14} />
              {deleting ? "Suppression..." : "Supprimer"}
            </Button>
          )}
          <Button type="submit" variant="gold" disabled={saving}>
            <Save size={14} />
            {saving ? "Sauvegarde..." : isEdit ? "Mettre à jour" : "Créer"}
          </Button>
        </div>
      </div>
    </form>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-border/60 bg-card p-6 space-y-4">
      <h2 className="font-display text-lg font-medium">{title}</h2>
      {children}
    </section>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
