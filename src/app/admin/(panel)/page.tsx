import Link from "next/link";
import {
  ArrowRight,
  FolderKanban,
  Briefcase,
  Star,
  MessageSquare,
} from "lucide-react";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [projects, services, testimonials, messages, unread] =
    await Promise.all([
      prisma.project.count().catch(() => 0),
      prisma.service.count().catch(() => 0),
      prisma.testimonial.count().catch(() => 0),
      prisma.message.count().catch(() => 0),
      prisma.message.count({ where: { read: false } }).catch(() => 0),
    ]);

  const recent = await prisma.message
    .findMany({ orderBy: { createdAt: "desc" }, take: 5 })
    .catch(() => []);

  const stats = [
    {
      label: "Projets",
      value: projects,
      href: "/admin/projets",
      icon: FolderKanban,
    },
    {
      label: "Services",
      value: services,
      href: "/admin/services",
      icon: Briefcase,
    },
    {
      label: "Témoignages",
      value: testimonials,
      href: "/admin/temoignages",
      icon: Star,
    },
    {
      label: `Messages${unread ? ` (${unread} non lus)` : ""}`,
      value: messages,
      href: "/admin/messages",
      icon: MessageSquare,
    },
  ];

  return (
    <div className="max-w-6xl">
      <h1 className="font-display text-4xl font-medium tracking-tight">
        Tableau de bord
      </h1>
      <p className="mt-2 text-muted-foreground">
        Vue d'ensemble de votre contenu.
      </p>

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
              <p className="mt-1 text-sm text-muted-foreground">{s.label}</p>
            </Link>
          );
        })}
      </div>

      <div className="grid gap-6 md:grid-cols-2 mt-10">
        <div className="rounded-2xl border border-border/60 bg-card p-6">
          <h2 className="font-display text-xl font-medium mb-4">
            Actions rapides
          </h2>
          <div className="space-y-2">
            <Link
              href="/admin/projets/new"
              className="flex items-center justify-between p-3 rounded-lg hover:bg-accent transition-colors"
            >
              <span>+ Nouveau projet</span>
              <ArrowRight size={14} />
            </Link>
            <Link
              href="/admin/services"
              className="flex items-center justify-between p-3 rounded-lg hover:bg-accent transition-colors"
            >
              <span>Gérer les services</span>
              <ArrowRight size={14} />
            </Link>
            <Link
              href="/admin/settings"
              className="flex items-center justify-between p-3 rounded-lg hover:bg-accent transition-colors"
            >
              <span>Modifier les infos du site</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        <div className="rounded-2xl border border-border/60 bg-card p-6">
          <h2 className="font-display text-xl font-medium mb-4">
            Derniers messages
          </h2>
          {recent.length === 0 ? (
            <p className="text-sm text-muted-foreground">Aucun message.</p>
          ) : (
            <ul className="space-y-3">
              {recent.map((m) => (
                <li
                  key={m.id}
                  className="flex items-start justify-between gap-3 pb-3 border-b border-border/40 last:border-0"
                >
                  <div className="min-w-0">
                    <p className="font-medium text-sm truncate">
                      {m.name}{" "}
                      {!m.read && (
                        <span className="ml-2 inline-block h-2 w-2 rounded-full bg-gold" />
                      )}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {m.subject ?? m.body.slice(0, 60)}
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {new Date(m.createdAt).toLocaleDateString("fr-FR")}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
