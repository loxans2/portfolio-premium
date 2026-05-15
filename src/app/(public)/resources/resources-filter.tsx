"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";
import { useState, useTransition } from "react";
import {
  RESOURCE_ACCESS,
  RESOURCE_CATEGORIES,
  accessLabel,
  categoryLabel,
  cn,
} from "@/lib/utils";

interface FilterProps {
  activeCategory: string;
  activeAccess: string;
  activeSort: string;
  query: string;
}

const SORTS = [
  { key: "recent", label: "Récents" },
  { key: "popular", label: "Populaires" },
  { key: "rating", label: "Mieux notés" },
];

export function ResourcesFilter({
  activeCategory,
  activeAccess,
  activeSort,
  query,
}: FilterProps) {
  const router = useRouter();
  const params = useSearchParams();
  const [search, setSearch] = useState(query);
  const [, startTransition] = useTransition();

  function setParam(key: string, value: string | null) {
    const next = new URLSearchParams(params.toString());
    if (!value || value === "all") next.delete(key);
    else next.set(key, value);
    startTransition(() => {
      router.push(`/resources${next.toString() ? `?${next.toString()}` : ""}`);
    });
  }

  function submitSearch(e: React.FormEvent) {
    e.preventDefault();
    setParam("q", search.trim() || null);
  }

  return (
    <div className="mt-12 space-y-5">
      <form
        onSubmit={submitSearch}
        className="relative max-w-xl"
      >
        <Search
          size={16}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
        />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher une ressource, un tag..."
          className="w-full rounded-full glass border border-border/60 pl-11 pr-12 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40"
        />
        {search && (
          <button
            type="button"
            onClick={() => {
              setSearch("");
              setParam("q", null);
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 hover:bg-accent cursor-pointer"
            aria-label="Effacer"
          >
            <X size={14} />
          </button>
        )}
      </form>

      <div className="flex flex-wrap gap-2">
        <Pill
          active={activeCategory === "all"}
          onClick={() => setParam("c", null)}
        >
          Toutes
        </Pill>
        {RESOURCE_CATEGORIES.map((c) => (
          <Pill
            key={c}
            active={activeCategory === c}
            onClick={() => setParam("c", c)}
          >
            {categoryLabel(c)}
          </Pill>
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-border/40">
        <div className="flex flex-wrap gap-2">
          <Pill
            active={activeAccess === "all"}
            onClick={() => setParam("a", null)}
            small
          >
            Tous accès
          </Pill>
          {RESOURCE_ACCESS.map((a) => (
            <Pill
              key={a}
              active={activeAccess === a}
              onClick={() => setParam("a", a)}
              small
            >
              {accessLabel(a)}
            </Pill>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Trier :</span>
          {SORTS.map((s) => (
            <Pill
              key={s.key}
              active={activeSort === s.key}
              onClick={() => setParam("sort", s.key === "recent" ? null : s.key)}
              small
            >
              {s.label}
            </Pill>
          ))}
        </div>
      </div>
    </div>
  );
}

function Pill({
  children,
  active,
  onClick,
  small,
}: {
  children: React.ReactNode;
  active?: boolean;
  onClick: () => void;
  small?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full border transition-colors cursor-pointer",
        small ? "px-3 py-1 text-xs" : "px-4 py-1.5 text-sm",
        active
          ? "bg-gold/15 text-gold border-gold/40"
          : "border-border/60 text-muted-foreground hover:text-foreground hover:border-border",
      )}
    >
      {children}
    </button>
  );
}
