import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Reveal } from "@/components/Reveal";
import { Button } from "@/components/ui/button";
import { FaqSection } from "@/components/sections/FaqSection";

export const revalidate = 60;

export const metadata = {
  title: "FAQ",
  description: "Réponses aux questions les plus fréquentes sur mes services et ma méthode.",
};

export default async function FaqPage() {
  const faqs = await prisma.faq
    .findMany({ where: { published: true }, orderBy: { order: "asc" } })
    .catch(() => []);

  return (
    <>
      <section className="container pt-40 pb-12">
        <Reveal>
          <p className="text-xs uppercase tracking-widest text-gold mb-3">
            FAQ
          </p>
          <h1 className="font-display text-5xl font-medium tracking-tight md:text-7xl text-balance max-w-4xl">
            On répond à <span className="gradient-text">tout</span>.
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl">
            Délais, méthode, tarifs, propriété — les questions les plus
            fréquentes avant de démarrer un projet.
          </p>
        </Reveal>
      </section>

      <FaqSection faqs={faqs} showHeader={false} />

      <section className="container py-24 md:py-32">
        <Reveal className="rounded-3xl border border-border/60 glass p-10 md:p-16 text-center">
          <h2 className="font-display text-3xl font-medium tracking-tight md:text-5xl text-balance">
            Une autre question ?
          </h2>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
            Écrivez-moi, je vous réponds personnellement sous 24h.
          </p>
          <Button asChild variant="gold" size="lg" className="mt-8">
            <Link href="/contact">
              Me contacter <ArrowRight size={16} />
            </Link>
          </Button>
        </Reveal>
      </section>
    </>
  );
}
