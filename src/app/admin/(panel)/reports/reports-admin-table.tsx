"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Check, X, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Row {
  id: string;
  reason: string;
  details: string | null;
  resolved: boolean;
  createdAt: string;
  user: { email: string; name: string | null };
  resource: { id: string; slug: string; title: string };
}

const FILTERS = [
  { key: "open", label: "À traiter" },
  { key: "resolved", label: "Résolus" },
  { key: "all", label: "Tous" },
];

export function ReportsAdminTable({
  reports,
  filter,
}: {
  reports: Row[];
  filter: string;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);

  async function resolve(id: string, resolved: boolean) {
    setBusy(id);
    const res = await fetch(`/api/admin/reports/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resolved }),
    });
    setBusy(null);
    if (!res.ok) {
      toast.error("Mise à jour échouée");
      return;
    }
    toast.success(resolved ? "Marqué résolu" : "Rouvert");
    router.refresh();
  }

  async function removeResource(id: string, slug: string) {
    if (!confirm(`Dépublier la ressource "${slug}" ?`)) return;
    setBusy(id);
    const res = await fetch(`/api/admin/resources/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "DRAFT" }),
    });
    setBusy(null);
    if (!res.ok) {
      toast.error("Dépublication échouée");
      return;
    }
    toast.success("Ressource dépubliée");
    router.refresh();
  }

  return (
    <>
      <div className="mt-6 flex gap-2">
        {FILTERS.map((f) => (
          <Link
            key={f.key}
            href={`/admin/reports?filter=${f.key}`}
            className={cn(
              "rounded-full px-4 py-1.5 text-sm border transition-colors",
              filter === f.key
                ? "bg-gold/15 text-gold border-gold/40"
                : "border-border/60 text-muted-foreground hover:text-foreground",
            )}
          >
            {f.label}
          </Link>
        ))}
      </div>

      <div className="mt-8 rounded-2xl border border-border/60 bg-card overflow-hidden">
        {reports.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground">
            Aucun signalement à traiter.
          </div>
        ) : (
          <ul className="divide-y divide-border/40">
            {reports.map((r) => (
              <li key={r.id} className="p-4">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Link
                        href={`/resources/${r.resource.slug}`}
                        target="_blank"
                        className="font-medium hover:text-gold transition-colors inline-flex items-center gap-1"
                      >
                        {r.resource.title}
                        <ExternalLink size={11} />
                      </Link>
                      <span
                        className={cn(
                          "rounded-full px-2 py-0.5 text-xs",
                          r.resolved
                            ? "bg-emerald-500/15 text-emerald-500"
                            : "bg-amber-500/15 text-amber-500",
                        )}
                      >
                        {r.resolved ? "Résolu" : "Ouvert"}
                      </span>
                    </div>
                    <p className="text-sm mt-2">
                      <span className="text-muted-foreground">Motif : </span>
                      <span className="font-medium">{r.reason}</span>
                    </p>
                    {r.details && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {r.details}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground mt-2">
                      Par {r.user.name ?? r.user.email} ·{" "}
                      {new Date(r.createdAt).toLocaleString("fr-FR")}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {!r.resolved ? (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => removeResource(r.resource.id, r.resource.slug)}
                          disabled={busy === r.id}
                          className="text-destructive border-destructive/30"
                        >
                          Dépublier
                        </Button>
                        <Button
                          size="sm"
                          variant="gold"
                          onClick={() => resolve(r.id, true)}
                          disabled={busy === r.id}
                        >
                          <Check size={14} />
                          Résolu
                        </Button>
                      </>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => resolve(r.id, false)}
                        disabled={busy === r.id}
                      >
                        <X size={14} />
                        Rouvrir
                      </Button>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
