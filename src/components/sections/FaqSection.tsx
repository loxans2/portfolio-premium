"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { cn } from "@/lib/utils";

type Faq = { id: string; question: string; answer: string };

export function FaqSection({
  faqs,
  showHeader = true,
}: {
  faqs: Faq[];
  showHeader?: boolean;
}) {
  const [open, setOpen] = useState<string | null>(faqs[0]?.id ?? null);
  if (faqs.length === 0) return null;

  return (
    <section className="container py-24 md:py-32 border-t border-border/40">
      <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr]">
        {showHeader && (
          <Reveal>
            <p className="text-xs uppercase tracking-widest text-gold mb-3">
              FAQ
            </p>
            <h2 className="font-display text-4xl font-medium tracking-tight md:text-5xl text-balance">
              Les questions les plus fréquentes.
            </h2>
            <p className="mt-4 text-muted-foreground">
              Vous ne trouvez pas votre réponse ? Écrivez-moi, je réponds sous 24h.
            </p>
          </Reveal>
        )}

        <div className="space-y-3">
          {faqs.map((f) => {
            const isOpen = open === f.id;
            return (
              <Reveal key={f.id}>
                <div
                  className={cn(
                    "rounded-2xl border bg-card transition-colors",
                    isOpen ? "border-gold/40" : "border-border/60",
                  )}
                >
                  <button
                    onClick={() => setOpen(isOpen ? null : f.id)}
                    className="w-full flex items-center justify-between gap-4 p-6 text-left cursor-pointer"
                  >
                    <span className="font-display text-lg font-medium">
                      {f.question}
                    </span>
                    <motion.span
                      animate={{ rotate: isOpen ? 45 : 0 }}
                      transition={{ duration: 0.3 }}
                      className="shrink-0 text-gold"
                    >
                      <Plus size={20} />
                    </motion.span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-6 text-muted-foreground leading-relaxed whitespace-pre-line">
                          {f.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
