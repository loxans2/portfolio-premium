import Link from "next/link";
import { Check, X, ArrowRight, Crown, Lock, Download } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Reveal, Stagger, StaggerItem } from "@/components/Reveal";
import { Button } from "@/components/ui/button";
import { PricingCta } from "@/components/PricingCta";
import { BorderBeam } from "@/components/magicui/border-beam";
import { FaqSection } from "@/components/sections/FaqSection";
import { cn } from "@/lib/utils";

export const revalidate = 60;
export const metadata = {
  title: "Abonnements — ResourceHub",
  description:
    "Trois plans : Gratuit, Premium et VIP. Téléchargements illimités, zéro publicité, ressources exclusives.",
};

async function getData() {
  const [plans, faqs] = await Promise.all([
    prisma.pricingPlan
      .findMany({ where: { published: true }, orderBy: { order: "asc" } })
      .catch(() => []),
    prisma.faq
      .findMany({ where: { published: true }, orderBy: { order: "asc" }, take: 6 })
      .catch(() => []),
  ]);
  return { plans, faqs };
}

const COMPARISON: Array<{ feature: string; free: boolean; premium: boolean; vip: boolean }> = [
  { feature: "Ressources gratuites", free: true, premium: true, vip: true },
  { feature: "Ressources Premium", free: false, premium: true, vip: true },
  { feature: "Ressources VIP exclusives", free: false, premium: false, vip: true },
  { feature: "Téléchargements illimités", free: false, premium: true, vip: true },
  { feature: "Zéro publicité", free: false, premium: true, vip: true },
  { feature: "Accès anticipé (7 jours)", free: false, premium: false, vip: true },
  { feature: "Support prioritaire", free: false, premium: true, vip: true },
  { feature: "Discord privé", free: false, premium: false, vip: true },
  { feature: "Licence commerciale étendue", free: false, premium: false, vip: true },
];

const PLAN_ICONS: Record<string, any> = {
  Gratuit: Download,
  Premium: Lock,
  VIP: Crown,
};

export default async function PricingPage() {
  const { plans, faqs } = await getData();

  return (
    <div className="pt-32 pb-24 md:pt-40">
      <div className="container">
        <Reveal>
          <p className="text-xs uppercase tracking-widest text-gold mb-3">
            Tarifs
          </p>
          <h1 className="font-display text-5xl font-medium tracking-tight md:text-7xl text-balance max-w-3xl">
            L'abonnement qui débloque tout.
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl">
            Sans engagement, annulable à tout moment depuis votre compte.
            Paiement sécurisé via Stripe.
          </p>
        </Reveal>

        <Stagger className="mt-16 grid gap-5 max-w-6xl mx-auto md:grid-cols-3">
          {plans.map((p) => {
            const Icon = PLAN_ICONS[p.name] ?? Download;
            return (
              <StaggerItem
                key={p.id}
                className={cn(
                  "relative flex flex-col rounded-3xl border bg-card p-8 overflow-hidden",
                  p.highlighted
                    ? "border-gold/50 shadow-[0_0_60px_-15px_hsl(var(--gold)/0.4)]"
                    : "border-border/60",
                )}
              >
                {p.highlighted && (
                  <>
                    <BorderBeam size={250} duration={12} delay={0} />
                    <div className="absolute top-5 right-5 rounded-full bg-gold/15 text-gold text-[10px] uppercase tracking-widest px-3 py-1">
                      Populaire
                    </div>
                  </>
                )}

                <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-gold/10 text-gold">
                  <Icon size={18} />
                </div>

                <h3 className="mt-5 font-display text-2xl font-medium">
                  {p.name}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {p.description}
                </p>

                <div className="mt-6 mb-6 flex items-baseline gap-1">
                  <span className="font-display text-5xl font-medium tracking-tight">
                    {p.price}
                  </span>
                  {p.priceSuffix && (
                    <span className="text-sm text-muted-foreground">
                      {p.priceSuffix}
                    </span>
                  )}
                </div>

                <ul className="space-y-3 text-sm mb-8 flex-1">
                  {p.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check
                        size={14}
                        className="mt-0.5 text-gold shrink-0"
                      />
                      <span className="text-foreground/90">{f}</span>
                    </li>
                  ))}
                </ul>

                <PricingCta
                  planKey={p.name.toUpperCase() === "GRATUIT" ? "FREE" : (p.name.toUpperCase() as any)}
                  label={p.cta}
                  fallbackUrl={p.ctaUrl}
                  highlighted={p.highlighted}
                />
              </StaggerItem>
            );
          })}
        </Stagger>

        {/* Comparison table */}
        <Reveal className="mt-24 max-w-5xl mx-auto">
          <h2 className="font-display text-3xl font-medium tracking-tight md:text-4xl text-center mb-12">
            Comparaison détaillée
          </h2>

          <div className="rounded-2xl border border-border/60 bg-card overflow-hidden">
            <div className="grid grid-cols-4 border-b border-border/60 bg-secondary/50">
              <div className="p-4 text-sm font-medium">Fonctionnalité</div>
              <div className="p-4 text-sm font-medium text-center">Gratuit</div>
              <div className="p-4 text-sm font-medium text-center bg-gold/5 text-gold">Premium</div>
              <div className="p-4 text-sm font-medium text-center">VIP</div>
            </div>
            {COMPARISON.map((row, i) => (
              <div
                key={i}
                className="grid grid-cols-4 border-b border-border/40 last:border-0"
              >
                <div className="p-4 text-sm">{row.feature}</div>
                <Cell active={row.free} />
                <Cell active={row.premium} highlighted />
                <Cell active={row.vip} />
              </div>
            ))}
          </div>
        </Reveal>
      </div>

      <FaqSection faqs={faqs} />
    </div>
  );
}

function Cell({ active, highlighted }: { active: boolean; highlighted?: boolean }) {
  return (
    <div
      className={cn(
        "p-4 flex items-center justify-center",
        highlighted && "bg-gold/5",
      )}
    >
      {active ? (
        <Check size={16} className="text-gold" />
      ) : (
        <X size={16} className="text-muted-foreground/40" />
      )}
    </div>
  );
}
