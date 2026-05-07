"use client";

import { NumberTicker } from "@/components/magicui/number-ticker";
import { Reveal } from "@/components/Reveal";

type Stat = { id: string; label: string; value: number; suffix?: string | null };

export function StatsSection({ stats }: { stats: Stat[] }) {
  if (stats.length === 0) return null;
  return (
    <section className="container py-20 md:py-28 border-t border-border/40">
      <Reveal className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div
            key={s.id}
            className="relative rounded-2xl border border-border/60 bg-card/50 p-8 text-center"
          >
            <div className="font-display text-5xl md:text-6xl font-medium tracking-tight">
              <NumberTicker value={s.value} />
              {s.suffix && <span className="text-gold">{s.suffix}</span>}
            </div>
            <p className="mt-3 text-sm uppercase tracking-widest text-muted-foreground">
              {s.label}
            </p>
          </div>
        ))}
      </Reveal>
    </section>
  );
}
