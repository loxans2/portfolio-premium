"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, Download, Lock, Crown, Star } from "lucide-react";
import { accessLabel, categoryLabel, cn, formatNumber } from "@/lib/utils";

interface ResourceCardProps {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  access: string;
  coverImage: string;
  tags?: string[];
  featured?: boolean;
  downloads?: number;
  ratingAvg?: number;
  className?: string;
}

export function ResourceCard({
  slug,
  title,
  excerpt,
  category,
  access,
  coverImage,
  tags = [],
  featured,
  downloads = 0,
  ratingAvg = 0,
  className,
}: ResourceCardProps) {
  const accessIcon =
    access === "VIP" ? Crown : access === "PREMIUM" ? Lock : Download;
  const AccessIcon = accessIcon;

  return (
    <Link
      href={`/resources/${slug}`}
      className={cn(
        "group relative block overflow-hidden rounded-2xl bg-card cursor-pointer",
        className,
      )}
    >
      <motion.div
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative aspect-[4/3] w-full overflow-hidden bg-muted"
      >
        <motion.div
          className="absolute inset-0"
          whileHover={{ scale: 1.08 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <Image
            src={coverImage}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </motion.div>

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-70 transition-opacity duration-500 group-hover:opacity-95" />

        <div className="absolute top-4 left-4 flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center rounded-full glass px-3 py-1 text-xs font-medium text-white border border-white/20">
            {categoryLabel(category)}
          </span>
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium border",
              access === "VIP"
                ? "bg-gold/90 text-black border-gold"
                : access === "PREMIUM"
                  ? "bg-foreground/90 text-background border-foreground/50"
                  : "bg-emerald-500/90 text-white border-emerald-400/50",
            )}
          >
            <AccessIcon size={11} />
            {accessLabel(access)}
          </span>
        </div>

        {featured && (
          <span className="absolute top-4 right-4 inline-flex items-center gap-1 rounded-full bg-gold/90 px-3 py-1 text-[10px] font-medium text-black uppercase tracking-wider">
            <Star size={10} className="fill-black" />
            Vedette
          </span>
        )}

        <div className="absolute top-1/2 right-4 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white text-black opacity-0 transition-all duration-500 group-hover:opacity-100 group-hover:rotate-45">
          <ArrowUpRight size={18} />
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
          <h3 className="font-display text-xl font-medium leading-tight md:text-2xl line-clamp-2">
            {title}
          </h3>
          <p className="mt-1 text-sm text-white/70 line-clamp-2">{excerpt}</p>

          <div className="mt-3 flex items-center justify-between gap-2">
            <div className="flex flex-wrap gap-1.5">
              {tags.slice(0, 2).map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-white/25 px-2 py-0.5 text-[10px] uppercase tracking-wider text-white/80"
                >
                  {tag}
                </span>
              ))}
            </div>
            <div className="flex items-center gap-3 text-[11px] text-white/70 whitespace-nowrap">
              {ratingAvg > 0 && (
                <span className="inline-flex items-center gap-1">
                  <Star size={11} className="fill-gold text-gold" />
                  {ratingAvg.toFixed(1)}
                </span>
              )}
              {downloads > 0 && (
                <span className="inline-flex items-center gap-1">
                  <Download size={11} />
                  {formatNumber(downloads)}
                </span>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
