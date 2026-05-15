import Link from "next/link";
import {
  ArrowRight,
  Sparkles,
  Gamepad2,
  Film,
  Puzzle,
  AppWindow,
  Music,
  Shirt,
  BookOpen,
  LayoutTemplate,
  Download,
  ShieldCheck,
  Crown,
  Users,
  Star,
} from "lucide-react";
import * as Icons from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Hero } from "@/components/Hero";
import { ResourceCard } from "@/components/ResourceCard";
import { Reveal, Stagger, StaggerItem } from "@/components/Reveal";
import { Button } from "@/components/ui/button";
import { Marquee } from "@/components/Marquee";
import { StatsSection } from "@/components/sections/StatsSection";
import { ProcessSection } from "@/components/sections/ProcessSection";
import { PricingSection } from "@/components/sections/PricingSection";
import { FaqSection } from "@/components/sections/FaqSection";
import { BentoCard, BentoGrid } from "@/components/magicui/bento-grid";
import { GridPattern } from "@/components/magicui/grid-pattern";
import { DotPattern } from "@/components/magicui/dot-pattern";
import { BorderBeam } from "@/components/magicui/border-beam";
import { cn } from "@/lib/utils";

export const revalidate = 60;

async function getData() {
  const [
    settings,
    featured,
    services,
    stats,
    steps,
    plans,
    faqs,
    recent,
    counts,
  ] = await Promise.all([
    prisma.settings.findUnique({ where: { id: "singleton" } }).catch(() => null),
    prisma.resource
      .findMany({
        where: { status: "PUBLISHED", featured: true },
        orderBy: [{ order: "asc" }, { createdAt: "desc" }],
        take: 6,
      })
      .catch(() => []),
    prisma.service
      .findMany({ where: { published: true }, orderBy: { order: "asc" } })
      .catch(() => []),
    prisma.stat
      .findMany({ where: { published: true }, orderBy: { order: "asc" } })
      .catch(() => []),
    prisma.processStep
      .findMany({ where: { published: true }, orderBy: { order: "asc" } })
      .catch(() => []),
    prisma.pricingPlan
      .findMany({ where: { published: true }, orderBy: { order: "asc" } })
      .catch(() => []),
    prisma.faq
      .findMany({ where: { published: true }, orderBy: { order: "asc" }, take: 6 })
      .catch(() => []),
    prisma.resource
      .findMany({
        where: { status: "PUBLISHED" },
        orderBy: { createdAt: "desc" },
        take: 8,
      })
      .catch(() => []),
    prisma.resource
      .groupBy({ by: ["category"], where: { status: "PUBLISHED" }, _count: true })
      .catch(() => [] as { category: string; _count: number }[]),
  ]);
  return {
    settings,
    featured,
    services,
    stats,
    steps,
    plans,
    faqs,
    recent,
    counts,
  };
}

function ServiceIcon({ name }: { name: string }) {
  const Icon = (Icons as any)[name] ?? Sparkles;
  return <Icon size={28} strokeWidth={1.5} />;
}

const BENTO_CATEGORIES = [
  {
    key: "GAMES",
    name: "Jeux & templates",
    description: "Templates Godot, Unity, assets de jeu et démos jouables.",
    Icon: Gamepad2,
    href: "/resources?c=GAMES",
    span: "lg:col-span-2 lg:row-span-2",
    bg: "from-violet-500/10 to-transparent",
  },
  {
    key: "MOVIES",
    name: "Films & vidéos",
    description: "Courts-métrages, séquences 4K, B-roll cinématographique.",
    Icon: Film,
    href: "/resources?c=MOVIES",
    span: "lg:col-span-1 lg:row-span-1",
    bg: "from-rose-500/10 to-transparent",
  },
  {
    key: "PLUGINS",
    name: "Plugins & LUTs",
    description: "LUTs, presets Lightroom, scripts After Effects originaux.",
    Icon: Puzzle,
    href: "/resources?c=PLUGINS",
    span: "lg:col-span-1 lg:row-span-1",
    bg: "from-emerald-500/10 to-transparent",
  },
  {
    key: "TEMPLATES",
    name: "Templates & UI Kits",
    description: "Design systems, kits Figma, templates Next.js & Tailwind.",
    Icon: LayoutTemplate,
    href: "/resources?c=TEMPLATES",
    span: "lg:col-span-1 lg:row-span-1",
    bg: "from-cyan-500/10 to-transparent",
  },
  {
    key: "SOFTWARE",
    name: "Logiciels open-source",
    description: "Utilitaires devs, CLI multi-plateformes, outils libres.",
    Icon: AppWindow,
    href: "/resources?c=SOFTWARE",
    span: "lg:col-span-1 lg:row-span-1",
    bg: "from-amber-500/10 to-transparent",
  },
  {
    key: "MUSIC",
    name: "Musique royalty-free",
    description: "Pistes originales libres de droits pour vidéo & jeux.",
    Icon: Music,
    href: "/resources?c=MUSIC",
    span: "lg:col-span-2 lg:row-span-1",
    bg: "from-fuchsia-500/10 to-transparent",
  },
];

export default async function HomePage() {
  const {
    settings,
    featured,
    services,
    stats,
    steps,
    plans,
    faqs,
    recent,
    counts,
  } = await getData();

  const heroTitle =
    settings?.heroTitle ??
    "Toutes vos ressources premium, au même endroit.";
  const heroSubtitle =
    settings?.heroSubtitle ??
    "Jeux, films, plugins, logiciels, templates. Créés par nous, libres de droits, accessibles aux abonnés.";

  const countMap = new Map(
    counts.map((c: any) => [c.category as string, c._count as number]),
  );

  return (
    <>
      <Hero title={heroTitle} subtitle={heroSubtitle} />

      {/* Marquee */}
      <section className="border-y border-border/40 bg-card/30">
        <Marquee duration={40}>
          {[
            "Jeux indépendants",
            "Templates UI",
            "Plugins After Effects",
            "Musique royalty-free",
            "LUTs cinéma",
            "Logiciels libres",
            "Ebooks design",
            "Assets 3D",
          ].map((w, i) => (
            <span
              key={i}
              className="font-display text-3xl font-medium text-muted-foreground md:text-5xl"
            >
              {w} <span className="text-gold">✦</span>
            </span>
          ))}
        </Marquee>
      </section>

      {/* Stats */}
      <StatsSection stats={stats} />

      {/* Featured resources */}
      <section className="container py-24 md:py-32 border-t border-border/40">
        <Reveal className="mb-12 flex items-end justify-between gap-6 flex-wrap">
          <div>
            <p className="text-xs uppercase tracking-widest text-gold mb-3">
              Sélection
            </p>
            <h2 className="font-display text-4xl font-medium tracking-tight md:text-6xl text-balance">
              Ressources en vedette
            </h2>
          </div>
          <Button asChild variant="outline">
            <Link href="/resources">
              Tout le catalogue <ArrowRight size={16} />
            </Link>
          </Button>
        </Reveal>

        <Stagger className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {featured.length === 0 ? (
            <p className="col-span-full text-muted-foreground">
              Aucune ressource publiée pour le moment.
            </p>
          ) : (
            featured.map((r) => (
              <StaggerItem key={r.id}>
                <ResourceCard
                  slug={r.slug}
                  title={r.title}
                  excerpt={r.excerpt}
                  category={r.category}
                  access={r.access}
                  coverImage={r.coverImage}
                  tags={r.tags}
                  featured={r.featured}
                  downloads={r.downloads}
                  ratingAvg={r.ratingAvg}
                />
              </StaggerItem>
            ))
          )}
        </Stagger>
      </section>

      {/* Bento categories */}
      <section className="container py-24 md:py-32 border-t border-border/40">
        <Reveal className="max-w-3xl mb-16">
          <p className="text-xs uppercase tracking-widest text-gold mb-3">
            Catégories
          </p>
          <h2 className="font-display text-4xl font-medium tracking-tight md:text-6xl text-balance">
            Six univers, des milliers de ressources.
          </h2>
        </Reveal>

        <BentoGrid className="lg:grid-rows-3 lg:auto-rows-[18rem]">
          {BENTO_CATEGORIES.map(({ key, name, description, Icon, href, span, bg }) => {
            const count = countMap.get(key) ?? 0;
            return (
              <BentoCard
                key={key}
                name={`${name}${count ? ` · ${count}` : ""}`}
                description={description}
                Icon={Icon}
                href={href}
                cta="Explorer"
                className={span}
                background={
                  <div className="absolute inset-0 overflow-hidden">
                    <div
                      className={cn(
                        "absolute inset-0 bg-gradient-to-br opacity-70",
                        bg,
                      )}
                    />
                    <GridPattern
                      width={32}
                      height={32}
                      className={cn(
                        "[mask-image:radial-gradient(400px_circle_at_top_right,white,transparent)]",
                      )}
                    />
                    <div className="absolute -top-20 -right-20 h-72 w-72 rounded-full bg-gold/10 blur-3xl" />
                  </div>
                }
              />
            );
          })}
        </BentoGrid>
      </section>

      {/* Why join — premium feature list (reuses services) */}
      <section className="container py-24 md:py-32 border-t border-border/40">
        <Reveal className="max-w-3xl mb-16">
          <p className="text-xs uppercase tracking-widest text-gold mb-3">
            Avantages membres
          </p>
          <h2 className="font-display text-4xl font-medium tracking-tight md:text-6xl text-balance">
            L'abonnement qui change la donne.
          </h2>
        </Reveal>

        <Stagger className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {services.map((s) => (
            <StaggerItem
              key={s.id}
              className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card p-6 transition-colors hover:border-gold/40"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-gold/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              <div className="relative">
                <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-full bg-gold/10 text-gold">
                  <ServiceIcon name={s.icon} />
                </div>
                <h3 className="font-display text-xl font-medium">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  {s.description}
                </p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      {/* Process */}
      <ProcessSection steps={steps} />

      {/* Recent resources */}
      {recent.length > 0 && (
        <section className="container py-24 md:py-32 border-t border-border/40">
          <Reveal className="mb-12 flex items-end justify-between gap-6 flex-wrap">
            <div>
              <p className="text-xs uppercase tracking-widest text-gold mb-3">
                Derniers ajouts
              </p>
              <h2 className="font-display text-4xl font-medium tracking-tight md:text-6xl text-balance">
                Fraîchement publiées
              </h2>
            </div>
            <Button asChild variant="outline">
              <Link href="/resources">
                Tout voir <ArrowRight size={16} />
              </Link>
            </Button>
          </Reveal>

          <Stagger className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {recent.slice(0, 4).map((r) => (
              <StaggerItem key={r.id}>
                <ResourceCard
                  slug={r.slug}
                  title={r.title}
                  excerpt={r.excerpt}
                  category={r.category}
                  access={r.access}
                  coverImage={r.coverImage}
                  tags={r.tags}
                  featured={r.featured}
                  downloads={r.downloads}
                  ratingAvg={r.ratingAvg}
                />
              </StaggerItem>
            ))}
          </Stagger>
        </section>
      )}

      {/* Pricing */}
      <PricingSection plans={plans} />

      {/* FAQ */}
      <FaqSection faqs={faqs} />

      {/* CTA */}
      <section className="container py-24 md:py-32">
        <Reveal className="relative overflow-hidden rounded-3xl border border-border/60 glass p-10 md:p-20 text-center grain">
          <BorderBeam size={300} duration={14} delay={0} />
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute top-0 left-1/4 h-64 w-64 rounded-full bg-gold/20 blur-3xl" />
            <div className="absolute bottom-0 right-1/4 h-64 w-64 rounded-full bg-foreground/5 blur-3xl" />
          </div>
          <h2 className="font-display text-4xl font-medium tracking-tight md:text-6xl text-balance">
            Prêt à explorer ?
          </h2>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto text-lg">
            Créez votre compte gratuit en 30 secondes et débloquez l'accès aux
            ressources libres dès maintenant.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button asChild variant="gold" size="lg">
              <Link href="/auth/register">
                Créer un compte gratuit <ArrowRight size={16} />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/pricing">Voir les plans</Link>
            </Button>
          </div>
        </Reveal>
      </section>
    </>
  );
}
