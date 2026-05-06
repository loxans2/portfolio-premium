"use client";

import { useState, useTransition } from "react";
import { Trash2, MailOpen, Mail } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { markRead, deleteMessage } from "./actions";

type M = {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  body: string;
  read: boolean;
  createdAt: Date;
};

export function MessagesList({ messages }: { messages: M[] }) {
  const [open, setOpen] = useState<string | null>(null);
  const [pending, start] = useTransition();

  if (messages.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border p-12 text-center text-muted-foreground">
        Aucun message pour le moment.
      </div>
    );
  }

  return (
    <ul className="space-y-2">
      {messages.map((m) => (
        <li
          key={m.id}
          className="rounded-2xl border border-border/60 bg-card overflow-hidden"
        >
          <button
            onClick={() => {
              setOpen(open === m.id ? null : m.id);
              if (!m.read) {
                start(async () => {
                  try {
                    await markRead(m.id, true);
                  } catch {}
                });
              }
            }}
            className="w-full p-5 flex items-start gap-4 text-left hover:bg-accent/40 transition-colors cursor-pointer"
          >
            {!m.read ? (
              <Mail size={16} className="text-gold mt-1 shrink-0" />
            ) : (
              <MailOpen size={16} className="text-muted-foreground mt-1 shrink-0" />
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline justify-between gap-3 flex-wrap">
                <p className="font-medium">
                  {m.name}{" "}
                  <span className="text-sm text-muted-foreground font-normal">
                    · {m.email}
                  </span>
                </p>
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  {new Date(m.createdAt).toLocaleString("fr-FR")}
                </span>
              </div>
              {m.subject && (
                <p className="text-sm font-medium mt-1">{m.subject}</p>
              )}
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                {m.body}
              </p>
            </div>
          </button>
          {open === m.id && (
            <div className="px-5 pb-5 pl-14 -mt-2 space-y-3">
              <p className="whitespace-pre-line text-sm leading-relaxed">
                {m.body}
              </p>
              <div className="flex gap-2 pt-2">
                <Button asChild variant="outline" size="sm">
                  <a href={`mailto:${m.email}?subject=Re: ${m.subject ?? ""}`}>
                    Répondre par email
                  </a>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    start(async () => {
                      try {
                        await markRead(m.id, !m.read);
                        toast.success(m.read ? "Marqué non lu" : "Marqué lu");
                      } catch {
                        toast.error("Erreur");
                      }
                    })
                  }
                >
                  {m.read ? "Marquer non lu" : "Marquer lu"}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="hover:text-destructive ml-auto"
                  onClick={() => {
                    if (!confirm("Supprimer ce message ?")) return;
                    start(async () => {
                      try {
                        await deleteMessage(m.id);
                        toast.success("Supprimé");
                      } catch {
                        toast.error("Erreur");
                      }
                    });
                  }}
                >
                  <Trash2 size={14} /> Supprimer
                </Button>
              </div>
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}
