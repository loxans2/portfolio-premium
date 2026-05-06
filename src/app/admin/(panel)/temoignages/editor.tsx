"use client";

import { useState, useTransition } from "react";
import { Plus, Trash2, Pencil, Check, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
} from "./actions";

type T = {
  id: string;
  name: string;
  role: string | null;
  content: string;
  image: string | null;
  rating: number;
  order: number;
  published: boolean;
};

export function TestimonialsEditor({ items }: { items: T[] }) {
  const [editing, setEditing] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [pending, start] = useTransition();

  return (
    <div className="space-y-3">
      {items.map((t) =>
        editing === t.id ? (
          <TForm
            key={t.id}
            item={t}
            pending={pending}
            onCancel={() => setEditing(null)}
            onSubmit={(fd) =>
              start(async () => {
                try {
                  await updateTestimonial(t.id, fd);
                  toast.success("Mis à jour");
                  setEditing(null);
                } catch {
                  toast.error("Erreur");
                }
              })
            }
          />
        ) : (
          <div
            key={t.id}
            className="rounded-2xl border border-border/60 bg-card p-5 flex items-start gap-4"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-medium">{t.name}</h3>
                {t.role && (
                  <span className="text-xs text-muted-foreground">· {t.role}</span>
                )}
                <span className="text-xs text-gold">
                  {"★".repeat(t.rating)}
                </span>
                {!t.published && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-muted">
                    Caché
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                {t.content}
              </p>
            </div>
            <div className="flex gap-1">
              <Button
                size="icon"
                variant="ghost"
                onClick={() => setEditing(t.id)}
              >
                <Pencil size={14} />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="hover:text-destructive"
                onClick={() => {
                  if (!confirm(`Supprimer le témoignage de "${t.name}" ?`)) return;
                  start(async () => {
                    try {
                      await deleteTestimonial(t.id);
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
        <TForm
          pending={pending}
          onCancel={() => setCreating(false)}
          onSubmit={(fd) =>
            start(async () => {
              try {
                await createTestimonial(fd);
                toast.success("Créé");
                setCreating(false);
              } catch {
                toast.error("Erreur");
              }
            })
          }
        />
      ) : (
        <Button
          variant="outline"
          className="w-full"
          onClick={() => setCreating(true)}
        >
          <Plus size={14} /> Ajouter un témoignage
        </Button>
      )}
    </div>
  );
}

function TForm({
  item,
  onCancel,
  onSubmit,
  pending,
}: {
  item?: T;
  onCancel: () => void;
  onSubmit: (fd: FormData) => void;
  pending: boolean;
}) {
  return (
    <form
      action={onSubmit}
      className="rounded-2xl border border-gold/40 bg-card p-5 space-y-4"
    >
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Nom</Label>
          <Input id="name" name="name" defaultValue={item?.name} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="role">Rôle / société</Label>
          <Input id="role" name="role" defaultValue={item?.role ?? ""} />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="content">Témoignage</Label>
        <Textarea
          id="content"
          name="content"
          defaultValue={item?.content}
          rows={4}
          required
        />
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="rating">Note (1-5)</Label>
          <Input
            id="rating"
            name="rating"
            type="number"
            min={1}
            max={5}
            defaultValue={item?.rating ?? 5}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="order">Ordre</Label>
          <Input
            id="order"
            name="order"
            type="number"
            defaultValue={item?.order ?? 0}
          />
        </div>
        <label className="flex items-center gap-2 mt-7 cursor-pointer">
          <input
            type="checkbox"
            name="published"
            defaultChecked={item?.published ?? true}
            className="h-4 w-4"
          />
          <span className="text-sm">Publié</span>
        </label>
      </div>
      <div className="flex gap-2">
        <Button type="submit" variant="gold" disabled={pending}>
          <Check size={14} /> Enregistrer
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          <X size={14} /> Annuler
        </Button>
      </div>
    </form>
  );
}
