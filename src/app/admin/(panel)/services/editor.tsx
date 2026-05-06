"use client";

import { useState, useTransition } from "react";
import { Plus, Trash2, Pencil, Check, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { createService, updateService, deleteService } from "./actions";

type Service = {
  id: string;
  title: string;
  description: string;
  icon: string;
  order: number;
  published: boolean;
};

const ICON_HINTS = [
  "Code2",
  "Palette",
  "Sparkles",
  "Wand2",
  "Pen",
  "Brush",
  "Camera",
  "Layout",
  "Globe",
  "Smartphone",
];

export function ServicesEditor({ services }: { services: Service[] }) {
  const [editing, setEditing] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [pending, start] = useTransition();

  return (
    <div className="space-y-3">
      {services.map((s) =>
        editing === s.id ? (
          <ServiceForm
            key={s.id}
            service={s}
            onCancel={() => setEditing(null)}
            onSubmit={(fd) =>
              start(async () => {
                try {
                  await updateService(s.id, fd);
                  toast.success("Service mis à jour");
                  setEditing(null);
                } catch {
                  toast.error("Erreur");
                }
              })
            }
            pending={pending}
          />
        ) : (
          <div
            key={s.id}
            className="rounded-2xl border border-border/60 bg-card p-5 flex items-start gap-4"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-medium">{s.title}</h3>
                <span className="text-xs text-muted-foreground">
                  · {s.icon}
                </span>
                {!s.published && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-muted">
                    Caché
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {s.description}
              </p>
            </div>
            <div className="flex gap-1">
              <Button
                size="icon"
                variant="ghost"
                onClick={() => setEditing(s.id)}
              >
                <Pencil size={14} />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="hover:text-destructive"
                onClick={() => {
                  if (!confirm(`Supprimer "${s.title}" ?`)) return;
                  start(async () => {
                    try {
                      await deleteService(s.id);
                      toast.success("Supprimé");
                    } catch {
                      toast.error("Erreur");
                    }
                  });
                }}
              >
                <Trash2 size={14} />
              </Button>
            </div>
          </div>
        )
      )}

      {creating ? (
        <ServiceForm
          onCancel={() => setCreating(false)}
          onSubmit={(fd) =>
            start(async () => {
              try {
                await createService(fd);
                toast.success("Service créé");
                setCreating(false);
              } catch {
                toast.error("Erreur");
              }
            })
          }
          pending={pending}
        />
      ) : (
        <Button
          variant="outline"
          className="w-full"
          onClick={() => setCreating(true)}
        >
          <Plus size={14} /> Ajouter un service
        </Button>
      )}

      <p className="text-xs text-muted-foreground mt-6">
        Icônes disponibles : {ICON_HINTS.join(", ")} (et toutes les icônes Lucide)
      </p>
    </div>
  );
}

function ServiceForm({
  service,
  onCancel,
  onSubmit,
  pending,
}: {
  service?: Service;
  onCancel: () => void;
  onSubmit: (fd: FormData) => void;
  pending: boolean;
}) {
  return (
    <form
      action={onSubmit}
      className="rounded-2xl border border-gold/40 bg-card p-5 space-y-4"
    >
      <div className="grid gap-4 md:grid-cols-3">
        <div className="md:col-span-2 space-y-2">
          <Label htmlFor="title">Titre</Label>
          <Input
            id="title"
            name="title"
            defaultValue={service?.title}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="icon">Icône (Lucide)</Label>
          <Input
            id="icon"
            name="icon"
            defaultValue={service?.icon ?? "Sparkles"}
            placeholder="Sparkles"
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          defaultValue={service?.description}
          rows={3}
          required
        />
      </div>
      <div className="flex items-center gap-4">
        <div className="space-y-2">
          <Label htmlFor="order">Ordre</Label>
          <Input
            id="order"
            name="order"
            type="number"
            defaultValue={service?.order ?? 0}
            className="w-24"
          />
        </div>
        <label className="flex items-center gap-2 mt-7 cursor-pointer">
          <input
            type="checkbox"
            name="published"
            defaultChecked={service?.published ?? true}
            className="h-4 w-4"
          />
          <span className="text-sm">Publié</span>
        </label>
      </div>
      <div className="flex gap-2">
        <Button type="submit" variant="gold" disabled={pending}>
          <Check size={14} /> {pending ? "..." : "Enregistrer"}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          <X size={14} /> Annuler
        </Button>
      </div>
    </form>
  );
}
