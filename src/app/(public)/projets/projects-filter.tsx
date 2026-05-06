"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const filters = [
  { key: "all", label: "Tous", href: "/projets" },
  { key: "website", label: "Sites web", href: "/projets?c=website" },
  { key: "branding", label: "Identités", href: "/projets?c=branding" },
  { key: "logo", label: "Logos", href: "/projets?c=logo" },
  { key: "graphic", label: "Graphisme", href: "/projets?c=graphic" },
];

export function ProjectsFilter({ active }: { active: string }) {
  return (
    <div className="mt-12 flex flex-wrap gap-2">
      {filters.map((f) => {
        const isActive = active === f.key;
        return (
          <Link
            key={f.key}
            href={f.href}
            className={cn(
              "relative rounded-full border border-border px-5 py-2 text-sm transition-colors cursor-pointer",
              isActive
                ? "text-primary-foreground border-transparent"
                : "text-muted-foreground hover:text-foreground hover:bg-accent"
            )}
          >
            {isActive && (
              <motion.span
                layoutId="filter-pill"
                className="absolute inset-0 -z-10 rounded-full bg-primary"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            {f.label}
          </Link>
        );
      })}
    </div>
  );
}
