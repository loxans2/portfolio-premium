"use client";

import { useState, useTransition } from "react";
import { Plus, Trash2, Pencil, Check, X, Star } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { createPlan, updatePlan, deletePlan } from "./actions";

type Plan = {
  id: string;
  name: string;
  price: string;
  priceSuffix?: string | null;
  description: string;
  features: string[];
  cta: string;
  ctaUrl: string;
  highlighted: boolean;
  order: number;
  published: boolean;
};

export function PricingEditor({ plans }: { plans: Plan[] }) {
  const [editing, setEditing] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [pending, start] = useTransition();

  return (
    <div className="space-y-3">
      {plans.map((p) =>
        editing === p.id ? (
          <PlanForm
            key={p.id}
            plan={p}
            onCancel={() => setEditing(null)}
            onSubmit={(fd) =>
              start(async () => {
                try {
                  await updatePlan(p.id, fd);
                  toast.success("Forfait mis à jour");
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
            key={p.id}
            className="rounded-2xl border border-border/60 bg-card p-5 flex items-start gap-4"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-medium">{p.name}</h3>
                <span className="text-gold font-display">
                  {p.price}
                  {p.priceSuffix}
                </span>
                {p.highlighted && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-gold/20 text-gold flex items-center gap-1">
                    <Star size={10} /> Populaire
                  </span>
                )}
                {!p.published && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-muted">
                    Caché
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {p.description}
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                {p.features.length} feature(s)
              </p>
            </div>
            <div className="flex gap-1">
              <Button size="icon" variant="ghost" onClick={() => setEditing(p.id)}>
                <Pencil size={14} />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="hover:text-destructive"
                onClick={() => {
                  if (!confirm(`Supprimer "${p.name}" ?`)) return;
                  start(async () => {
                    try {
                      await deletePlan(p.id);
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
        <PlanForm
          onCancel={() => setCreating(false)}
          onSubmit={(fd) =>
            start(async () => {
              try {
                await createPlan(fd);
                toast.success("Forfait créé");
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
          <Plus size={14} /> Ajouter un forfait
        </Button>
      )}
    </div>
  );
}

function PlanForm({
  plan,
  onCancel,
  onSubmit,
  pending,
}: {
  plan?: Plan;
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
        <div className="space-y-2">
          <Label htmlFor="name">Nom</Label>
          <Input id="name" name="name" defaultValue={plan?.name} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="price">Prix</Label>
          <Input
            id="price"
            name="price"
            defaultValue={plan?.price}
            placeholder="2 500 €"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="priceSuffix">Suffixe prix</Label>
          <Input
            id="priceSuffix"
            name="priceSuffix"
            defaultValue={plan?.priceSuffix ?? ""}
            placeholder="/ projet"
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description courte</Label>
        <Input
          id="description"
          name="description"
          defaultValue={plan?.description}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="features">Features (une par ligne)</Label>
        <Textarea
          id="features"
          name="features"
          defaultValue={(plan?.features ?? []).join("\n")}
          rows={6}
          placeholder={"Logo principal\nDéclinaisons couleurs\nFichiers source"}
        />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="cta">Texte du bouton</Label>
          <Input
            id="cta"
            name="cta"
            defaultValue={plan?.cta ?? "Démarrer"}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="ctaUrl">URL du bouton</Label>
          <Input
            id="ctaUrl"
            name="ctaUrl"
            defaultValue={plan?.ctaUrl ?? "/contact"}
          />
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-6">
        <div className="space-y-2">
          <Label htmlFor="order">Ordre</Label>
          <Input
            id="order"
            name="order"
            type="number"
            defaultValue={plan?.order ?? 0}
            className="w-24"
          />
        </div>
        <label className="flex items-center gap-2 mt-7 cursor-pointer">
          <input
            type="checkbox"
            name="highlighted"
            defaultChecked={plan?.highlighted ?? false}
            className="h-4 w-4"
          />
          <span className="text-sm">Mettre en avant</span>
        </label>
        <label className="flex items-center gap-2 mt-7 cursor-pointer">
          <input
            type="checkbox"
            name="published"
            defaultChecked={plan?.published ?? true}
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
