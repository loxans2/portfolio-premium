"use client";

import { useState, useTransition } from "react";
import { Plus, Trash2, Pencil, Check, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { createFaq, updateFaq, deleteFaq } from "./actions";

type Faq = {
  id: string;
  question: string;
  answer: string;
  order: number;
  published: boolean;
};

export function FaqEditor({ faqs }: { faqs: Faq[] }) {
  const [editing, setEditing] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [pending, start] = useTransition();

  return (
    <div className="space-y-3">
      {faqs.map((f) =>
        editing === f.id ? (
          <FaqForm
            key={f.id}
            faq={f}
            onCancel={() => setEditing(null)}
            onSubmit={(fd) =>
              start(async () => {
                try {
                  await updateFaq(f.id, fd);
                  toast.success("FAQ mise à jour");
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
            key={f.id}
            className="rounded-2xl border border-border/60 bg-card p-5 flex items-start gap-4"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-medium">{f.question}</h3>
                {!f.published && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-muted">
                    Caché
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                {f.answer}
              </p>
            </div>
            <div className="flex gap-1">
              <Button size="icon" variant="ghost" onClick={() => setEditing(f.id)}>
                <Pencil size={14} />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="hover:text-destructive"
                onClick={() => {
                  if (!confirm("Supprimer cette question ?")) return;
                  start(async () => {
                    try {
                      await deleteFaq(f.id);
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
        <FaqForm
          onCancel={() => setCreating(false)}
          onSubmit={(fd) =>
            start(async () => {
              try {
                await createFaq(fd);
                toast.success("FAQ créée");
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
          <Plus size={14} /> Ajouter une question
        </Button>
      )}
    </div>
  );
}

function FaqForm({
  faq,
  onCancel,
  onSubmit,
  pending,
}: {
  faq?: Faq;
  onCancel: () => void;
  onSubmit: (fd: FormData) => void;
  pending: boolean;
}) {
  return (
    <form
      action={onSubmit}
      className="rounded-2xl border border-gold/40 bg-card p-5 space-y-4"
    >
      <div className="space-y-2">
        <Label htmlFor="question">Question</Label>
        <Input id="question" name="question" defaultValue={faq?.question} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="answer">Réponse</Label>
        <Textarea
          id="answer"
          name="answer"
          defaultValue={faq?.answer}
          rows={5}
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
            defaultValue={faq?.order ?? 0}
            className="w-24"
          />
        </div>
        <label className="flex items-center gap-2 mt-7 cursor-pointer">
          <input
            type="checkbox"
            name="published"
            defaultChecked={faq?.published ?? true}
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
