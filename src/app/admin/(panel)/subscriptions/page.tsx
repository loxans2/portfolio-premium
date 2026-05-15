import { prisma } from "@/lib/prisma";
import { cn, formatNumber } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminSubscriptionsPage() {
  const [subs, totals, payments] = await Promise.all([
    prisma.subscription
      .findMany({
        orderBy: { createdAt: "desc" },
        take: 100,
        include: {
          user: { select: { email: true, name: true } },
          _count: { select: { payments: true } },
        },
      })
      .catch(() => []),
    prisma.subscription
      .groupBy({ by: ["status"], _count: true })
      .catch(() => [] as { status: string; _count: number }[]),
    prisma.payment
      .aggregate({
        where: { status: "SUCCEEDED" },
        _sum: { amount: true },
        _count: true,
      })
      .catch(() => ({ _sum: { amount: 0 }, _count: 0 })),
  ]);

  const totalRevenue = payments?._sum?.amount ?? 0;
  const totalPayments = payments?._count ?? 0;
  const statusMap = new Map(
    (totals as any[]).map((t) => [t.status, t._count as number]),
  );

  return (
    <div className="max-w-7xl">
      <div>
        <h1 className="font-display text-4xl font-medium tracking-tight">
          Abonnements
        </h1>
        <p className="mt-2 text-muted-foreground">
          Suivi des plans actifs et des paiements.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-4 mt-10">
        <Stat label="Actifs" value={statusMap.get("ACTIVE") ?? 0} />
        <Stat label="Annulés" value={statusMap.get("CANCELED") ?? 0} />
        <Stat label="Expirés" value={statusMap.get("EXPIRED") ?? 0} />
        <Stat
          label="Revenu cumulé"
          value={`${totalRevenue.toFixed(0)} €`}
          hint={`${totalPayments} paiement${totalPayments > 1 ? "s" : ""}`}
        />
      </div>

      <div className="mt-10 rounded-2xl border border-border/60 bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-secondary/50 border-b border-border/60">
              <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground">
                <th className="p-4">Utilisateur</th>
                <th className="p-4">Plan</th>
                <th className="p-4">Statut</th>
                <th className="p-4">Période</th>
                <th className="p-4 text-right">Paiements</th>
              </tr>
            </thead>
            <tbody>
              {subs.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="p-12 text-center text-muted-foreground"
                  >
                    Aucun abonnement encore. Connectez Stripe pour activer les
                    paiements.
                  </td>
                </tr>
              ) : (
                subs.map((s: any) => (
                  <tr
                    key={s.id}
                    className="border-b border-border/40 last:border-0 hover:bg-accent/30 transition-colors"
                  >
                    <td className="p-4">
                      <p className="font-medium">
                        {s.user.name ?? s.user.email}
                      </p>
                      {s.user.name && (
                        <p className="text-xs text-muted-foreground">
                          {s.user.email}
                        </p>
                      )}
                    </td>
                    <td className="p-4">
                      <span
                        className={cn(
                          "rounded-full px-2 py-0.5 text-xs",
                          s.plan === "VIP"
                            ? "bg-gold/15 text-gold"
                            : "bg-foreground/10",
                        )}
                      >
                        {s.plan}
                      </span>
                    </td>
                    <td className="p-4">
                      <span
                        className={cn(
                          "rounded-full px-2 py-0.5 text-xs",
                          s.status === "ACTIVE"
                            ? "bg-emerald-500/15 text-emerald-500"
                            : s.status === "PAST_DUE"
                              ? "bg-amber-500/15 text-amber-500"
                              : "bg-muted text-muted-foreground",
                        )}
                      >
                        {s.status}
                      </span>
                    </td>
                    <td className="p-4 text-xs text-muted-foreground">
                      {new Date(s.currentPeriodStart).toLocaleDateString(
                        "fr-FR",
                      )}{" "}
                      →{" "}
                      {new Date(s.currentPeriodEnd).toLocaleDateString("fr-FR")}
                    </td>
                    <td className="p-4 text-right text-muted-foreground">
                      {s._count.payments}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  hint,
}: {
  label: string;
  value: string | number;
  hint?: string;
}) {
  return (
    <div className="rounded-2xl border border-border/60 bg-card p-6">
      <p className="text-xs uppercase tracking-widest text-muted-foreground">
        {label}
      </p>
      <p className="mt-3 font-display text-3xl font-medium">
        {typeof value === "number" ? formatNumber(value) : value}
      </p>
      {hint && <p className="text-xs text-muted-foreground mt-1">{hint}</p>}
    </div>
  );
}
