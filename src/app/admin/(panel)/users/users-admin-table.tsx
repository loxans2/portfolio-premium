"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Trash2, Heart, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn, formatNumber } from "@/lib/utils";

interface Row {
  id: string;
  email: string;
  name: string | null;
  role: "USER" | "CONTRIBUTOR" | "MODERATOR" | "ADMIN";
  plan: "FREE" | "PREMIUM" | "VIP";
  createdAt: string;
  _count: { downloads: number; favorites: number };
}

const ROLES = ["USER", "CONTRIBUTOR", "MODERATOR", "ADMIN"] as const;
const PLANS = ["FREE", "PREMIUM", "VIP"] as const;

export function UsersAdminTable({ users }: { users: Row[] }) {
  const router = useRouter();
  const [updating, setUpdating] = useState<string | null>(null);

  async function update(id: string, body: Record<string, unknown>) {
    setUpdating(id);
    const res = await fetch(`/api/admin/users/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    setUpdating(null);
    if (!res.ok) {
      toast.error("Mise à jour échouée");
      return;
    }
    toast.success("Mis à jour");
    router.refresh();
  }

  async function remove(id: string, email: string) {
    if (!confirm(`Supprimer définitivement ${email} ?`)) return;
    setUpdating(id);
    const res = await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
    setUpdating(null);
    if (!res.ok) {
      toast.error("Suppression échouée");
      return;
    }
    toast.success("Supprimé");
    router.refresh();
  }

  if (users.length === 0) {
    return (
      <div className="mt-10 rounded-2xl border border-dashed border-border/60 p-12 text-center">
        <p className="text-muted-foreground">Aucun utilisateur.</p>
      </div>
    );
  }

  return (
    <div className="mt-8 rounded-2xl border border-border/60 bg-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-secondary/50 border-b border-border/60">
            <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground">
              <th className="p-4">Utilisateur</th>
              <th className="p-4">Rôle</th>
              <th className="p-4">Plan</th>
              <th className="p-4 text-right">Activité</th>
              <th className="p-4">Inscrit</th>
              <th className="p-4 w-0"></th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr
                key={u.id}
                className="border-b border-border/40 last:border-0 hover:bg-accent/30 transition-colors"
              >
                <td className="p-4 min-w-0">
                  <p className="font-medium truncate">{u.name ?? u.email}</p>
                  {u.name && (
                    <p className="text-xs text-muted-foreground truncate">
                      {u.email}
                    </p>
                  )}
                </td>
                <td className="p-4">
                  <select
                    value={u.role}
                    disabled={updating === u.id}
                    onChange={(e) => update(u.id, { role: e.target.value })}
                    className="rounded border border-border/60 bg-background px-2 py-1 text-xs"
                  >
                    {ROLES.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-4">
                  <select
                    value={u.plan}
                    disabled={updating === u.id}
                    onChange={(e) => update(u.id, { plan: e.target.value })}
                    className={cn(
                      "rounded border px-2 py-1 text-xs",
                      u.plan === "VIP"
                        ? "border-gold/40 bg-gold/10 text-gold"
                        : u.plan === "PREMIUM"
                          ? "border-foreground/30 bg-foreground/10"
                          : "border-border/60 bg-background",
                    )}
                  >
                    {PLANS.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-4 text-right">
                  <div className="inline-flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <Download size={11} />
                      {formatNumber(u._count.downloads)}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Heart size={11} />
                      {formatNumber(u._count.favorites)}
                    </span>
                  </div>
                </td>
                <td className="p-4 text-xs text-muted-foreground whitespace-nowrap">
                  {new Date(u.createdAt).toLocaleDateString("fr-FR")}
                </td>
                <td className="p-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => remove(u.id, u.email)}
                    disabled={updating === u.id}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 size={14} />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
