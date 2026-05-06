import * as Icons from "lucide-react";
import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Reveal, Stagger, StaggerItem } from "@/components/Reveal";
import { Button } from "@/components/ui/button";

export const revalidate = 60;
export const metadata = { title: "Services" };

function ServiceIcon({ name }: { name: string }) {
  const Icon = (Icons as any)[name] ?? Sparkles;
  return <Icon size={32} strokeWidth={1.5} />;
}

export default async function ServicesPage() {
  const services = await prisma.service
    .findMany({ where: { published: true }, orderBy: { order: "asc" } })
    .catch(() => []);

  return (
    <div className="pt-32 md:pt-40">
      <div className="container">
        <Reveal>
          <p className="text-xs uppercase tracking-widest text-gold mb-3">
            Services
          </p>
          <h1 className="font-display text-5xl font-medium tracking-tight md:text-7xl text-balance max-w-4xl">
            Une approche sur mesure pour chaque projet.
          </h1>
        </Reveal>
      </div>

      <div className="container mt-16 md:mt-24">
        <Stagger className="grid gap-5 md:grid-cols-2">
          {services.map((s) => (
            <StaggerItem
              key={s.id}
              className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card p-8 md:p-10 transition-colors hover:border-gold/40"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-gold/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              <div className="relative">
                <div className="mb-8 inline-flex h-14 w-14 items-center justify-center rounded-full bg-gold/10 text-gold">
                  <ServiceIcon name={s.icon} />
                </div>
                <h3 className="font-display text-2xl font-medium md:text-3xl">
                  {s.title}
                </h3>
                <p className="mt-3 text-muted-foreground leading-relaxed">
                  {s.description}
                </p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>

      <section className="container py-24 md:py-32">
        <Reveal className="text-center max-w-2xl mx-auto">
          <h2 className="font-display text-4xl font-medium tracking-tight md:text-5xl">
            Prêt à concrétiser votre projet ?
          </h2>
          <Button asChild variant="gold" size="lg" className="mt-8">
            <Link href="/contact">
              Démarrer maintenant <ArrowRight size={16} />
            </Link>
          </Button>
        </Reveal>
      </section>
    </div>
  );
}
