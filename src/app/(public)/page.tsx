import Link from "next/link";
import { ArrowRight, Sparkles, Code2, Palette, Wand2, Star } from "lucide-react";
import * as Icons from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Hero } from "@/components/Hero";
import { ProjectCard } from "@/components/ProjectCard";
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
    testimonials,
    stats,
    steps,
    plans,
    faqs,
    projectsByCategory,
  ] = await Promise.all([
    prisma.settings.findUnique({ where: { id: "singleton" } }).catch(() => null),
    prisma.project
      .findMany({
        where: { published: true, featured: true },
        orderBy: [{ order: "asc" }, { createdAt: "desc" }],
        take: 6,
      })
      .catch(() => []),
    prisma.service
      .findMany({ where: { published: true }, orderBy: { order: "asc" } })
      .catch(() => []),
    prisma.testimonial
      .findMany({
        where: { published: true },
        orderBy: { order: "asc" },
        take: 6,
      })
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
      .findMany({
        where: { published: true },
        orderBy: { order: "asc" },
        take: 6,
      })
      .catch(() => []),
    prisma.project
      .findMany({
        where: { published: true },
        orderBy: { createdAt: "desc" },
        take: 12,
      })
      .catch(() => []),
  ]);
  return {
    settings,
    featured,
    services,
    testimonials,
    stats,
    steps,
    plans,
    faqs,
    projectsByCategory,
  };
}

function ServiceIcon({ name }: { name: string }) {
  const Icon = (Icons as any)[name] ?? Sparkles;
  return <Icon size={28} strokeWidth={1.5} />;
}

export default async function HomePage() {
  const {
    settings,
    featured,
    services,
    testimonials,
    stats,
    steps,
    plans,
    faqs,
    projectsByCategory,
  } = await getData();

  const heroTitle =
    settings?.heroTitle ?? "Création digitale & identité de marque.";
  const heroSubtitle =
    settings?.heroSubtitle ??
    "Je conçois des sites web sur mesure, des chartes graphiques et des logos qui racontent votre histoire.";

  const websites = projectsByCategory.filter((p) => p.category === "WEBSITE").slice(0, 1)[0];
  const brandings = projectsByCategory.filter((p) => p.category === "BRANDING").slice(0, 1)[0];
  const logos = projectsByCategory.filter((p) => p.category === "LOGO").slice(0, 1)[0];

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

      {/* Stats */}
      <StatsSection stats={stats} />

      {/* Featured projects */}
      <section className="container py-24 md:py-32 border-t border-border/40">
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
              Aucun projet publié pour le moment.
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

      {/* Bento expertise */}
      {(websites || brandings || logos) && (
        <section className="container py-24 md:py-32 border-t border-border/40">
          <Reveal className="max-w-3xl mb-16">
            <p className="text-xs uppercase tracking-widest text-gold mb-3">
              Expertise
            </p>
            <h2 className="font-display text-4xl font-medium tracking-tight md:text-6xl text-balance">
              Trois savoir-faire, une vision.
            </h2>
          </Reveal>

          <BentoGrid className="lg:grid-rows-3 lg:auto-rows-[18rem]">
            <BentoCard
              name="Sites web sur mesure"
              description="Vitrines, e-commerce, plateformes — pensés pour convertir et animés avec soin."
              Icon={Code2}
              href="/projets?cat=WEBSITE"
              cta="Voir les sites"
              className="lg:col-span-2 lg:row-span-2"
              background={
                <div className="absolute inset-0 overflow-hidden">
                  {websites?.coverImage && (
                    <img
                      src={websites.coverImage}
                      alt=""
                      className="absolute inset-0 h-full w-full object-cover opacity-50 transition-all duration-500 group-hover:scale-105 group-hover:opacity-70 [mask-image:linear-gradient(to_top,transparent_30%,#000_100%)]"
                    />
                  )}
                  <GridPattern
                    width={32}
                    height={32}
                    className={cn(
                      "[mask-image:radial-gradient(400px_circle_at_top_right,white,transparent)]",
                    )}
                  />
                </div>
              }
            />
            <BentoCard
              name="Identité de marque"
              description="Charte complète : logo, typographie, palette, déclinaisons."
              Icon={Palette}
              href="/projets?cat=BRANDING"
              cta="Voir les chartes"
              className="lg:col-span-1 lg:row-span-1"
              background={
                <div className="absolute inset-0 overflow-hidden opacity-60">
                  {brandings?.coverImage && (
                    <img
                      src={brandings.coverImage}
                      alt=""
                      className="absolute inset-0 h-full w-full object-cover transition-all duration-500 group-hover:scale-110 [mask-image:radial-gradient(circle_at_top_right,#000,transparent_70%)]"
                    />
                  )}
                </div>
              }
            />
            <BentoCard
              name="Logos & symboles"
              description="Logos uniques, modulaires, déclinables print et digital."
              Icon={Sparkles}
              href="/projets?cat=LOGO"
              cta="Voir les logos"
              className="lg:col-span-1 lg:row-span-1"
              background={
                <div className="absolute inset-0">
                  <DotPattern
                    className={cn(
                      "[mask-image:radial-gradient(300px_circle_at_center,white,transparent)]",
                    )}
                  />
                  {logos?.coverImage && (
                    <img
                      src={logos.coverImage}
                      alt=""
                      className="absolute right-0 bottom-0 h-32 w-32 object-cover rounded-2xl opacity-60 transition-all duration-500 group-hover:scale-110"
                    />
                  )}
                </div>
              }
            />
            <BentoCard
              name="Direction artistique"
              description="Conseil et accompagnement créatif pour aligner univers visuel et stratégie."
              Icon={Wand2}
              href="/services"
              cta="En savoir plus"
              className="lg:col-span-2 lg:row-span-1"
              background={
                <div className="absolute inset-0">
                  <GridPattern
                    width={20}
                    height={20}
                    className={cn(
                      "[mask-image:linear-gradient(to_right,white,transparent_70%)]",
                    )}
                  />
                  <div className="absolute -top-20 -right-20 h-72 w-72 rounded-full bg-gold/15 blur-3xl" />
                </div>
              }
            />
          </BentoGrid>
        </section>
      )}

      {/* Services list */}
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

      {/* Process */}
      <ProcessSection steps={steps} />

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

      {/* Pricing */}
      <PricingSection plans={plans} />

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
                <div className="text-gold mb-4 flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      className={
                        i < t.rating
                          ? "fill-gold"
                          : "fill-transparent text-muted-foreground/30"
                      }
                    />
                  ))}
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
