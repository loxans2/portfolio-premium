import Link from "next/link";
import { ArrowRight, Code2, Palette, Sparkles, Wand2 } from "lucide-react";
import * as Icons from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Hero } from "@/components/Hero";
import { ProjectCard } from "@/components/ProjectCard";
import { Reveal, Stagger, StaggerItem } from "@/components/Reveal";
import { Button } from "@/components/ui/button";
import { Marquee } from "@/components/Marquee";

export const revalidate = 60;

async function getData() {
  const [settings, featured, services, testimonials] = await Promise.all([
    prisma.settings.findUnique({ where: { id: "singleton" } }).catch(() => null),
    prisma.project
      .findMany({
        where: { published: true, featured: true },
        orderBy: [{ order: "asc" }, { createdAt: "desc" }],
        take: 6,
      })
      .catch(() => []),
    prisma.service
      .findMany({
        where: { published: true },
        orderBy: { order: "asc" },
      })
      .catch(() => []),
    prisma.testimonial
      .findMany({
        where: { published: true },
        orderBy: { order: "asc" },
        take: 6,
      })
      .catch(() => []),
  ]);
  return { settings, featured, services, testimonials };
}

function ServiceIcon({ name }: { name: string }) {
  const Icon = (Icons as any)[name] ?? Sparkles;
  return <Icon size={28} strokeWidth={1.5} />;
}

export default async function HomePage() {
  const { settings, featured, services, testimonials } = await getData();
  const heroTitle =
    settings?.heroTitle ?? "Création digitale & identité de marque.";
  const heroSubtitle =
    settings?.heroSubtitle ??
    "Je conçois des sites web sur mesure, des chartes graphiques et des logos qui racontent votre histoire.";

  return (
    <>
      <Hero title={heroTitle} subtitle={heroSubtitle} />

      {/* Marquee */}
      <section className="border-y border-border/40 bg-card/30">
        <Marquee duration={40}>
          {[
            "Design éditorial",
            "Sites premium",
            "Identité de marque",
            "Logo design",
            "Direction artistique",
            "Motion design",
            "UX/UI",
            "Branding complet",
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

      {/* Featured projects */}
      <section className="container py-24 md:py-32">
        <Reveal className="mb-12 flex items-end justify-between gap-6 flex-wrap">
          <div>
            <p className="text-xs uppercase tracking-widest text-gold mb-3">
              Sélection
            </p>
            <h2 className="font-display text-4xl font-medium tracking-tight md:text-6xl text-balance">
              Projets récents
            </h2>
          </div>
          <Button asChild variant="outline">
            <Link href="/projets">
              Tous les projets <ArrowRight size={16} />
            </Link>
          </Button>
        </Reveal>

        <Stagger className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {featured.length === 0 ? (
            <p className="col-span-full text-muted-foreground">
              Aucun projet publié pour le moment. Connecte-toi à{" "}
              <Link href="/admin" className="text-gold underline">
                /admin
              </Link>{" "}
              pour en ajouter.
            </p>
          ) : (
            featured.map((p) => (
              <StaggerItem key={p.id}>
                <ProjectCard
                  slug={p.slug}
                  title={p.title}
                  excerpt={p.excerpt}
                  category={p.category}
                  coverImage={p.coverImage}
                  tags={p.tags}
                  featured={p.featured}
                />
              </StaggerItem>
            ))
          )}
        </Stagger>
      </section>

      {/* Services */}
      <section className="container py-24 md:py-32 border-t border-border/40">
        <Reveal className="max-w-3xl mb-16">
          <p className="text-xs uppercase tracking-widest text-gold mb-3">
            Services
          </p>
          <h2 className="font-display text-4xl font-medium tracking-tight md:text-6xl text-balance">
            Ce que je crée pour vous.
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

      {/* About teaser */}
      {settings && (
        <section className="container py-24 md:py-32 border-t border-border/40">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <Reveal>
              <p className="text-xs uppercase tracking-widest text-gold mb-3">
                {settings.aboutTitle}
              </p>
              <h2 className="font-display text-4xl font-medium tracking-tight md:text-5xl text-balance gradient-text">
                {settings.tagline}
              </h2>
            </Reveal>
            <Reveal delay={0.15}>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {settings.aboutBody}
              </p>
              <Button asChild className="mt-8" variant="outline">
                <Link href="/a-propos">
                  En savoir plus <ArrowRight size={16} />
                </Link>
              </Button>
            </Reveal>
          </div>
        </section>
      )}

      {/* Testimonials */}
      {testimonials.length > 0 && (
        <section className="container py-24 md:py-32 border-t border-border/40">
          <Reveal className="max-w-3xl mb-16">
            <p className="text-xs uppercase tracking-widest text-gold mb-3">
              Témoignages
            </p>
            <h2 className="font-display text-4xl font-medium tracking-tight md:text-6xl text-balance">
              Ils m'ont fait confiance.
            </h2>
          </Reveal>

          <Stagger className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((t) => (
              <StaggerItem
                key={t.id}
                className="rounded-2xl border border-border/60 bg-card p-6"
              >
                <div className="text-gold mb-4">
                  {"★".repeat(t.rating)}
                  <span className="text-muted-foreground/30">
                    {"★".repeat(5 - t.rating)}
                  </span>
                </div>
                <p className="text-foreground leading-relaxed">"{t.content}"</p>
                <div className="mt-6 pt-4 border-t border-border/50">
                  <p className="font-medium">{t.name}</p>
                  {t.role && (
                    <p className="text-sm text-muted-foreground">{t.role}</p>
                  )}
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </section>
      )}

      {/* CTA */}
      <section className="container py-24 md:py-32">
        <Reveal className="relative overflow-hidden rounded-3xl border border-border/60 glass p-10 md:p-20 text-center grain">
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute top-0 left-1/4 h-64 w-64 rounded-full bg-gold/20 blur-3xl" />
            <div className="absolute bottom-0 right-1/4 h-64 w-64 rounded-full bg-foreground/5 blur-3xl" />
          </div>
          <h2 className="font-display text-4xl font-medium tracking-tight md:text-6xl text-balance">
            Un projet en tête ?
          </h2>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto text-lg">
            Discutons de votre vision. Je réponds sous 24h.
          </p>
          <Button asChild variant="gold" size="lg" className="mt-8">
            <Link href="/contact">
              Démarrer un projet <ArrowRight size={16} />
            </Link>
          </Button>
        </Reveal>
      </section>
    </>
  );
}
