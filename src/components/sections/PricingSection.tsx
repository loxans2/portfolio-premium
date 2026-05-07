"use client";

import Link from "next/link";
import { Check } from "lucide-react";
import { Reveal, Stagger, StaggerItem } from "@/components/Reveal";
import { Button } from "@/components/ui/button";
import { BorderBeam } from "@/components/magicui/border-beam";
import { cn } from "@/lib/utils";

type Plan = {
  id: string;
  name: string;
  price: string;
  priceSuffix?: string | null;
  description: string;
  features: string[];
  cta: string;
  ctaUrl: string;
  highlighted: boolean;
};

export function PricingSection({
  plans,
  showHeader = true,
}: {
  plans: Plan[];
  showHeader?: boolean;
}) {
  if (plans.length === 0) return null;

  return (
    <section className="container py-24 md:py-32 border-t border-border/40">
      {showHeader && (
        <Reveal className="max-w-3xl mb-16">
          <p className="text-xs uppercase tracking-widest text-gold mb-3">
            Tarifs
          </p>
          <h2 className="font-display text-4xl font-medium tracking-tight md:text-6xl text-balance">
            Des forfaits transparents.
          </h2>
          <p className="mt-4 text-muted-foreground text-lg max-w-2xl">
            Trois formules pour s'adapter à votre projet. Devis sur mesure
            possible — discutons-en.
          </p>
        </Reveal>
      )}

      <Stagger
        className={cn(
          "grid gap-5 max-w-6xl mx-auto",
          plans.length === 2 && "md:grid-cols-2",
          plans.length === 3 && "md:grid-cols-3",
          plans.length >= 4 && "md:grid-cols-2 lg:grid-cols-4",
        )}
      >
        {plans.map((p) => (
          <StaggerItem
            key={p.id}
            className={cn(
              "relative rounded-3xl border bg-card p-8 flex flex-col overflow-hidden",
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
            <h3 className="font-display text-2xl font-medium">{p.name}</h3>
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
            <ul className="space-y-3 mb-8 flex-1">
              {p.features.map((f, i) => (
                <li key={i} className="flex items-start gap-3 text-sm">
                  <Check
                    size={16}
                    className="mt-0.5 shrink-0 text-gold"
                    strokeWidth={2.4}
                  />
                  <span className="text-foreground/90">{f}</span>
                </li>
              ))}
            </ul>
            <Button
              asChild
              variant={p.highlighted ? "gold" : "outline"}
              className="w-full"
              size="lg"
            >
              <Link href={p.ctaUrl}>{p.cta}</Link>
            </Button>
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  );
}
