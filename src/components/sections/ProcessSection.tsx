"use client";

import * as Icons from "lucide-react";
import { Sparkles } from "lucide-react";
import { Reveal, Stagger, StaggerItem } from "@/components/Reveal";

type Step = {
  id: string;
  title: string;
  description: string;
  icon: string;
  duration?: string | null;
};

function StepIcon({ name }: { name: string }) {
  const Icon = (Icons as any)[name] ?? Sparkles;
  return <Icon size={22} strokeWidth={1.6} />;
}

export function ProcessSection({ steps }: { steps: Step[] }) {
  if (steps.length === 0) return null;
  return (
    <section className="container py-24 md:py-32 border-t border-border/40">
      <Reveal className="max-w-3xl mb-16">
        <p className="text-xs uppercase tracking-widest text-gold mb-3">
          Méthode
        </p>
        <h2 className="font-display text-4xl font-medium tracking-tight md:text-6xl text-balance">
          Un process clair, pas à pas.
        </h2>
        <p className="mt-4 text-muted-foreground text-lg max-w-2xl">
          De la première discussion à la mise en ligne, chaque étape est
          pensée pour livrer un résultat à la hauteur.
        </p>
      </Reveal>

      <Stagger className="relative grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {steps.map((s, i) => (
          <StaggerItem
            key={s.id}
            className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card p-6 transition-colors hover:border-gold/40"
          >
            <div className="absolute -top-6 -right-6 font-display text-[7rem] leading-none text-gold/10 select-none">
              {String(i + 1).padStart(2, "0")}
            </div>
            <div className="relative">
              <div className="mb-5 inline-flex h-10 w-10 items-center justify-center rounded-full bg-gold/10 text-gold">
                <StepIcon name={s.icon} />
              </div>
              <h3 className="font-display text-xl font-medium">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                {s.description}
              </p>
              {s.duration && (
                <p className="mt-4 text-xs uppercase tracking-widest text-gold/80">
                  {s.duration}
                </p>
              )}
            </div>
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  );
}
