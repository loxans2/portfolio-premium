import Link from "next/link";
import { redirect } from "next/navigation";
import Image from "next/image";
import { getServerSession } from "next-auth";
import {
  Crown,
  Lock,
  Download,
  Heart,
  CreditCard,
  ArrowRight,
  Calendar,
  Sparkles,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import {
  accessLabel,
  categoryLabel,
  cn,
  formatNumber,
} from "@/lib/utils";
import { Reveal } from "@/components/Reveal";
import { Button } from "@/components/ui/button";
import { BorderBeam } from "@/components/magicui/border-beam";

export const dynamic = "force-dynamic";
export const metadata = { title: "Mon compte — ResourceHub" };

export default async function AccountPage() {
  const session = await getServerSession(authOptions);
  const sessUser = session?.user as any;
  if (!sessUser) redirect("/auth/login?callbackUrl=/account");

  const [user, favorites, downloads, subscription] = await Promise.all([
    prisma.user.findUnique({
      where: { id: sessUser.id },
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
        plan: true,
        role: true,
        createdAt: true,
        _count: { select: { downloads: true, favorites: true, comments: true } },
      },
    }),
    prisma.favorite.findMany({
      where: { userId: sessUser.id },
      orderBy: { createdAt: "desc" },
      take: 12,
      include: {
        resource: {
          select: {
            id: true,
            slug: true,
            title: true,
            category: true,
            access: true,
            coverImage: true,
          },
        },
      },
    }),
    prisma.download.findMany({
      where: { userId: sessUser.id },
      orderBy: { createdAt: "desc" },
      take: 12,
      include: {
        resource: {
          select: { slug: true, title: true, category: true, coverImage: true },
        },
      },
    }),
    prisma.subscription.findFirst({
      where: { userId: sessUser.id, status: "ACTIVE" },
      orderBy: { currentPeriodEnd: "desc" },
    }),
  ]);

  if (!user) redirect("/auth/login");

  const PlanIcon =
    user.plan === "VIP" ? Crown : user.plan === "PREMIUM" ? Lock : Download;

  return (
    <div className="pt-32 pb-24 md:pt-40">
      <div className="container max-w-6xl">
        <Reveal>
          <p className="text-xs uppercase tracking-widest text-gold mb-3">
            Mon compte
          </p>
          <h1 className="font-display text-5xl font-medium tracking-tight md:text-6xl text-balance">
            Bonjour {user.name ?? user.email.split("@")[0]}
          </h1>
        </Reveal>

        {/* Plan card */}
        <Reveal delay={0.1}>
          <div
            className={cn(
              "relative mt-12 overflow-hidden rounded-3xl border p-8",
              user.plan === "VIP"
                ? "border-gold/50 bg-card"
                : user.plan === "PREMIUM"
                  ? "border-foreground/30 bg-card"
                  : "border-border/60 bg-card",
            )}
          >
            {user.plan !== "FREE" && <BorderBeam size={250} duration={14} />}
            <div className="flex items-start justify-between gap-6 flex-wrap">
              <div className="flex items-center gap-4">
                <div
                  className={cn(
                    "inline-flex h-14 w-14 items-center justify-center rounded-full",
                    user.plan === "VIP"
                      ? "bg-gold/15 text-gold"
                      : user.plan === "PREMIUM"
                        ? "bg-foreground/10 text-foreground"
                        : "bg-muted text-muted-foreground",
                  )}
                >
                  <PlanIcon size={24} />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-muted-foreground">
                    Plan actuel
                  </p>
                  <p className="font-display text-3xl font-medium">
                    {accessLabel(user.plan)}
                  </p>
                  {subscription && (
                    <p className="text-xs text-muted-foreground mt-1 inline-flex items-center gap-1">
                      <Calendar size={11} />
                      Renouvellement{" "}
                      {new Date(subscription.currentPeriodEnd).toLocaleDateString(
                        "fr-FR",
                      )}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex gap-2 flex-wrap">
                {user.plan === "FREE" ? (
                  <Button asChild variant="gold">
                    <Link href="/pricing">
                      <Sparkles size={14} />
                      Passer Premium
                    </Link>
                  </Button>
                ) : (
                  <form action="/api/stripe/portal" method="POST">
                    <Button type="submit" variant="outline">
                      <CreditCard size={14} />
                      Gérer mon abonnement
                    </Button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </Reveal>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-3 mt-10">
          <StatCard
            icon={Download}
            label="Téléchargements"
            value={user._count.downloads}
          />
          <StatCard
            icon={Heart}
            label="Favoris"
            value={user._count.favorites}
          />
          <StatCard
            icon={Sparkles}
            label="Avis publiés"
            value={user._count.comments}
          />
        </div>

        {/* Favorites */}
        <section className="mt-16">
          <div className="flex items-end justify-between gap-4 mb-6 flex-wrap">
            <h2 className="font-display text-2xl font-medium tracking-tight md:text-3xl">
              Mes favoris
            </h2>
            <Link
              href="/resources"
              className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
            >
              Tout le catalogue <ArrowRight size={12} />
            </Link>
          </div>
          {favorites.length === 0 ? (
            <p className="text-muted-foreground text-sm rounded-2xl border border-dashed border-border/60 p-8 text-center">
              Aucun favori. Cliquez sur ♥ sur une ressource pour la sauvegarder.
            </p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {favorites.map((f) => (
                <Link
                  key={f.id}
                  href={`/resources/${f.resource.slug}`}
                  className="group flex gap-3 rounded-2xl border border-border/60 bg-card p-3 hover:border-gold/40 transition-colors cursor-pointer"
                >
                  <div className="relative h-20 w-20 rounded-lg overflow-hidden bg-muted shrink-0">
                    <Image
                      src={f.resource.coverImage}
                      alt=""
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex flex-col justify-center">
                    <p className="font-medium text-sm group-hover:text-gold transition-colors line-clamp-2">
                      {f.resource.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {categoryLabel(f.resource.category)} ·{" "}
                      {accessLabel(f.resource.access)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Downloads */}
        <section className="mt-16">
          <h2 className="font-display text-2xl font-medium tracking-tight md:text-3xl mb-6">
            Historique des téléchargements
          </h2>
          {downloads.length === 0 ? (
            <p className="text-muted-foreground text-sm rounded-2xl border border-dashed border-border/60 p-8 text-center">
              Aucun téléchargement encore.
            </p>
          ) : (
            <div className="rounded-2xl border border-border/60 bg-card overflow-hidden">
              <ul className="divide-y divide-border/40">
                {downloads.map((d) => (
                  <li key={d.id}>
                    <Link
                      href={`/resources/${d.resource.slug}`}
                      className="flex items-center gap-3 p-4 hover:bg-accent/40 transition-colors"
                    >
                      <div className="relative h-12 w-16 rounded overflow-hidden bg-muted shrink-0">
                        <Image
                          src={d.resource.coverImage}
                          alt=""
                          fill
                          sizes="64px"
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">
                          {d.resource.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {categoryLabel(d.resource.category)}
                        </p>
                      </div>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {new Date(d.createdAt).toLocaleDateString("fr-FR")}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: any;
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-2xl border border-border/60 bg-card p-6">
      <Icon size={18} className="text-muted-foreground" />
      <p className="mt-4 font-display text-3xl font-medium">
        {formatNumber(value)}
      </p>
      <p className="text-sm text-muted-foreground mt-1">{label}</p>
    </div>
  );
}
