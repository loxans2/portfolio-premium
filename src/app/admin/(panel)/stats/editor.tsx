"use client";

import { useState, useTransition } from "react";
import { Plus, Trash2, Pencil, Check, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createStat, updateStat, deleteStat } from "./actions";

type Stat = {
  id: string;
  label: string;
  value: number;
  suffix?: string | null;
  order: number;
  published: boolean;
};

export function StatsEditor({ stats }: { stats: Stat[] }) {
  const [editing, setEditing] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [pending, start] = useTransition();

  return (
    <div className="space-y-3">
      {stats.map((s) =>
        editing === s.id ? (
          <StatForm
            key={s.id}
            stat={s}
            onCancel={() => setEditing(null)}
            onSubmit={(fd) =>
              start(async () => {
                try {
                  await updateStat(s.id, fd);
                  toast.success("Stat mise à jour");
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
            className="rounded-2xl border border-border/60 bg-card p-5 flex items-center gap-4"
          >
            <div className="font-display text-3xl tabular-nums">
              {s.value}
              <span className="text-gold">{s.suffix}</span>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium">{s.label}</h3>
              {!s.published && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-muted">
                  Caché
                </span>
              )}
            </div>
            <div className="flex gap-1">
              <Button size="icon" variant="ghost" onClick={() => setEditing(s.id)}>
                <Pencil size={14} />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="hover:text-destructive"
                onClick={() => {
                  if (!confirm(`Supprimer "${s.label}" ?`)) return;
                  start(async () => {
                    try {
                      await deleteStat(s.id);
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
        ),
      )}

      {creating ? (
        <StatForm
          onCancel={() => setCreating(false)}
          onSubmit={(fd) =>
            start(async () => {
              try {
                await createStat(fd);
                toast.success("Stat créée");
                setCreating(false);
              } catch {
                toast.error("Erreur");
              }
            })
          }
          pending={pending}
        />
      ) : (
        <Button variant="outline" className="w-full" onClick={() => setCreating(true)}>
          <Plus size={14} /> Ajouter une statistique
        </Button>
      )}
    </div>
  );
}

function StatForm({
  stat,
  onCancel,
  onSubmit,
  pending,
}: {
  stat?: Stat;
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
          <Label htmlFor="label">Label</Label>
          <Input
            id="label"
            name="label"
            defaultValue={stat?.label}
            placeholder="Projets livrés"
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-2">
            <Label htmlFor="value">Valeur</Label>
            <Input
              id="value"
              name="value"
              type="number"
              defaultValue={stat?.value}
              placeholder="42"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="suffix">Suffixe</Label>
            <Input
              id="suffix"
              name="suffix"
              defaultValue={stat?.suffix ?? ""}
              placeholder="+"
            />
          </div>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="space-y-2">
          <Label htmlFor="order">Ordre</Label>
          <Input
            id="order"
            name="order"
            type="number"
            defaultValue={stat?.order ?? 0}
            className="w-24"
          />
        </div>
        <label className="flex items-center gap-2 mt-7 cursor-pointer">
          <input
            type="checkbox"
            name="published"
            defaultChecked={stat?.published ?? true}
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
