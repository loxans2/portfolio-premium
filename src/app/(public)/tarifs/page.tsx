import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Reveal } from "@/components/Reveal";
import { Button } from "@/components/ui/button";
import { PricingSection } from "@/components/sections/PricingSection";
import { FaqSection } from "@/components/sections/FaqSection";

export const revalidate = 60;

export const metadata = {
  title: "Tarifs",
  description: "Forfaits transparents pour vos projets digitaux et identité de marque.",
};

export default async function TarifsPage() {
  const [plans, faqs] = await Promise.all([
    prisma.pricingPlan
      .findMany({ where: { published: true }, orderBy: { order: "asc" } })
      .catch(() => []),
    prisma.faq
      .findMany({ where: { published: true }, orderBy: { order: "asc" } })
      .catch(() => []),
  ]);

  return (
    <>
      <section className="container pt-40 pb-12">
        <Reveal>
          <p className="text-xs uppercase tracking-widest text-gold mb-3">
            Tarifs
          </p>
          <h1 className="font-display text-5xl font-medium tracking-tight md:text-7xl text-balance max-w-4xl gradient-text">
            Investissez dans votre image.
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl">
            Trois formules pensées pour s'adapter à votre projet — du logo
            standalone au site complet avec branding. Devis sur mesure
            possible, n'hésitez pas à m'écrire.
          </p>
        </Reveal>
      </section>

      <PricingSection plans={plans} showHeader={false} />

      <FaqSection faqs={faqs} />

      <section className="container py-24 md:py-32">
        <Reveal className="rounded-3xl border border-border/60 glass p-10 md:p-16 text-center">
          <h2 className="font-display text-3xl font-medium tracking-tight md:text-5xl text-balance">
            Un besoin spécifique ?
          </h2>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
            Chaque projet est unique. Parlons-en — je vous prépare un devis
            personnalisé sous 24h.
          </p>
          <Button asChild variant="gold" size="lg" className="mt-8">
            <Link href="/contact">
              Demander un devis <ArrowRight size={16} />
            </Link>
          </Button>
        </Reveal>
      </section>
    </>
  );
}
