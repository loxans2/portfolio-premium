import Link from "next/link";
import {
  ArrowRight,
  Package,
  Users,
  CreditCard,
  Download,
  TrendingUp,
  Flag,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatNumber } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [
    resourceCount,
    publishedResources,
    pendingResources,
    userCount,
    premiumUsers,
    vipUsers,
    activeSubs,
    totalDownloads,
    unresolvedReports,
    unreadMessages,
    recentResources,
    recentUsers,
  ] = await Promise.all([
    prisma.resource.count().catch(() => 0),
    prisma.resource.count({ where: { status: "PUBLISHED" } }).catch(() => 0),
    prisma.resource.count({ where: { status: "PENDING" } }).catch(() => 0),
    prisma.user.count().catch(() => 0),
    prisma.user.count({ where: { plan: "PREMIUM" } }).catch(() => 0),
    prisma.user.count({ where: { plan: "VIP" } }).catch(() => 0),
    prisma.subscription
      .count({ where: { status: "ACTIVE" } })
      .catch(() => 0),
    prisma.download.count().catch(() => 0),
    prisma.report.count({ where: { resolved: false } }).catch(() => 0),
    prisma.message.count({ where: { read: false } }).catch(() => 0),
    prisma.resource
      .findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        select: {
          id: true,
          title: true,
          category: true,
          status: true,
          createdAt: true,
        },
      })
      .catch(() => []),
    prisma.user
      .findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        select: {
          id: true,
          email: true,
          name: true,
          plan: true,
          createdAt: true,
        },
      })
      .catch(() => []),
  ]);

  // Revenue estimation (mocked from active subs since no Stripe yet)
  const monthlyRevenueEur = premiumUsers * 9.99 + vipUsers * 24.99;

  const stats = [
    {
      label: "Ressources publiées",
      value: formatNumber(publishedResources),
      hint: pendingResources ? `${pendingResources} en attente` : "Tout est validé",
      href: "/admin/resources",
      icon: Package,
    },
    {
      label: "Utilisateurs",
      value: formatNumber(userCount),
      hint: `${premiumUsers} Premium · ${vipUsers} VIP`,
      href: "/admin/users",
      icon: Users,
    },
    {
      label: "Abonnements actifs",
      value: formatNumber(activeSubs),
      hint: `~${monthlyRevenueEur.toFixed(0)} € / mois`,
      href: "/admin/subscriptions",
      icon: CreditCard,
    },
    {
      label: "Téléchargements",
      value: formatNumber(totalDownloads),
      hint: "Tous temps confondus",
      href: "/admin/resources",
      icon: Download,
    },
  ];

  return (
    <div className="max-w-6xl">
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-display text-4xl font-medium tracking-tight">
            Tableau de bord
          </h1>
          <p className="mt-2 text-muted-foreground">
            Vue d'ensemble de ResourceHub.
          </p>
        </div>
        <div className="flex gap-2">
          {unresolvedReports > 0 && (
            <Link
              href="/admin/reports"
              className="inline-flex items-center gap-2 rounded-full bg-destructive/10 text-destructive px-4 py-2 text-sm hover:bg-destructive/15 transition-colors"
            >
              <Flag size={14} />
              {unresolvedReports} signalement{unresolvedReports > 1 && "s"}
            </Link>
          )}
          {unreadMessages > 0 && (
            <Link
              href="/admin/messages"
              className="inline-flex items-center gap-2 rounded-full bg-gold/10 text-gold px-4 py-2 text-sm hover:bg-gold/15 transition-colors"
            >
              {unreadMessages} message{unreadMessages > 1 && "s"} non lu
              {unreadMessages > 1 && "s"}
            </Link>
          )}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mt-10">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <Link
              key={s.label}
              href={s.href}
              className="group rounded-2xl border border-border/60 bg-card p-6 hover:border-gold/40 transition-colors cursor-pointer"
            >
              <div className="flex items-start justify-between">
                <Icon size={20} className="text-muted-foreground" />
                <ArrowRight
                  size={16}
                  className="text-muted-foreground group-hover:text-gold transition-colors"
                />
              </div>
              <p className="mt-6 font-display text-4xl font-medium">
                {s.value}
              </p>
              <p className="mt-1 text-sm">{s.label}</p>
              <p className="mt-1 text-xs text-muted-foreground">{s.hint}</p>
            </Link>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-3 mt-10">
        <div className="lg:col-span-2 rounded-2xl border border-border/60 bg-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-xl font-medium">
              Dernières ressources
            </h2>
            <Link
              href="/admin/resources"
              className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
            >
              Tout voir <ArrowRight size={12} />
            </Link>
          </div>
          {recentResources.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Aucune ressource. <Link href="/admin/resources/new" className="text-gold hover:underline">+ Ajouter la première</Link>
            </p>
          ) : (
            <ul className="space-y-2">
              {recentResources.map((r) => (
                <li
                  key={r.id}
                  className="flex items-center justify-between gap-3 py-2 border-b border-border/40 last:border-0"
                >
                  <div className="min-w-0">
                    <Link
                      href={`/admin/resources/${r.id}`}
                      className="font-medium text-sm hover:text-gold transition-colors"
                    >
                      {r.title}
                    </Link>
                    <p className="text-xs text-muted-foreground">
                      {r.category} ·{" "}
                      <span
                        className={
                          r.status === "PUBLISHED"
                            ? "text-emerald-400"
                            : r.status === "PENDING"
                              ? "text-amber-400"
                              : "text-muted-foreground"
                        }
                      >
                        {r.status}
                      </span>
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {new Date(r.createdAt).toLocaleDateString("fr-FR")}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-2xl border border-border/60 bg-card p-6">
          <h2 className="font-display text-xl font-medium mb-4">
            Derniers inscrits
          </h2>
          {recentUsers.length === 0 ? (
            <p className="text-sm text-muted-foreground">Aucun utilisateur.</p>
          ) : (
            <ul className="space-y-3">
              {recentUsers.map((u) => (
                <li
                  key={u.id}
                  className="flex items-start justify-between gap-3 pb-3 border-b border-border/40 last:border-0"
                >
                  <div className="min-w-0">
                    <p className="font-medium text-sm truncate">
                      {u.name ?? u.email}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {u.plan}
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {new Date(u.createdAt).toLocaleDateString("fr-FR")}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-border/60 bg-card p-6">
          <h2 className="font-display text-xl font-medium mb-4">
            Actions rapides
          </h2>
          <div className="space-y-1">
            {[
              { href: "/admin/resources/new", label: "+ Nouvelle ressource" },
              { href: "/admin/resources?status=PENDING", label: "Modérer en attente" },
              { href: "/admin/pricing", label: "Configurer les plans" },
              { href: "/admin/settings", label: "Modifier les infos du site" },
            ].map((a) => (
              <Link
                key={a.href}
                href={a.href}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-accent transition-colors"
              >
                <span>{a.label}</span>
                <ArrowRight size={14} />
              </Link>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-border/60 bg-card p-6">
          <h2 className="font-display text-xl font-medium mb-2 inline-flex items-center gap-2">
            <TrendingUp size={18} className="text-gold" />
            Revenu mensuel estimé
          </h2>
          <p className="text-xs text-muted-foreground mb-4">
            Basé sur les utilisateurs actuels Premium/VIP.
          </p>
          <p className="font-display text-5xl font-medium tracking-tight">
            {monthlyRevenueEur.toFixed(0)} €
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            {premiumUsers} × 9,99 € + {vipUsers} × 24,99 €
          </p>
          <p className="text-xs text-muted-foreground mt-3 italic">
            Connectez Stripe pour les chiffres réels.
          </p>
        </div>
      </div>
    </div>
  );
}
