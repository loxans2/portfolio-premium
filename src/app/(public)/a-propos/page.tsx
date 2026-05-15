import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Reveal } from "@/components/Reveal";
import { Button } from "@/components/ui/button";

export const revalidate = 60;
export const metadata = { title: "À propos" };

export default async function AboutPage() {
  const settings = await prisma.settings
    .findUnique({ where: { id: "singleton" } })
    .catch(() => null);

  return (
    <div className="container pt-32 md:pt-40 pb-24">
      <Reveal>
        <p className="text-xs uppercase tracking-widest text-gold mb-3">
          {settings?.aboutTitle ?? "À propos"}
        </p>
        <h1 className="font-display text-5xl font-medium tracking-tight md:text-7xl text-balance max-w-4xl gradient-text">
          {settings?.tagline ?? "Designer indépendant."}
        </h1>
      </Reveal>

      <Reveal delay={0.1} className="mt-16 max-w-3xl">
        <p className="text-xl leading-relaxed text-muted-foreground whitespace-pre-line">
          {settings?.aboutBody ?? settings?.bio ?? ""}
        </p>
      </Reveal>

      <Reveal delay={0.2} className="mt-16 grid gap-8 md:grid-cols-3 max-w-3xl">
        {settings?.email && (
          <div>
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">
              Email
            </p>
            <a
              href={`mailto:${settings.email}`}
              className="font-medium hover:text-gold transition-colors"
            >
              {settings.email}
            </a>
          </div>
        )}
        {settings?.phone && (
          <div>
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">
              Téléphone
            </p>
            <p className="font-medium">{settings.phone}</p>
          </div>
        )}
        {settings?.location && (
          <div>
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">
              Localisation
            </p>
            <p className="font-medium">{settings.location}</p>
          </div>
        )}
      </Reveal>

      <Reveal delay={0.3} className="mt-16 flex flex-wrap gap-3">
        <Button asChild variant="gold" size="lg">
          <Link href="/resources">
            Explorer le catalogue <ArrowRight size={16} />
          </Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link href="/contact">Nous écrire</Link>
        </Button>
      </Reveal>
    </div>
  );
}
