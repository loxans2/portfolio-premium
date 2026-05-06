"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { categoryLabel } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface ProjectCardProps {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  coverImage: string;
  tags?: string[];
  featured?: boolean;
  className?: string;
}

export function ProjectCard({
  slug,
  title,
  excerpt,
  category,
  coverImage,
  tags = [],
  featured,
  className,
}: ProjectCardProps) {
  return (
    <Link
      href={`/projets/${slug}`}
      className={cn(
        "group relative block overflow-hidden rounded-2xl bg-card cursor-pointer",
        className
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
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </motion.div>

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-60 transition-opacity duration-500 group-hover:opacity-90" />

        <div className="absolute top-4 left-4 flex items-center gap-2">
          <span className="inline-flex items-center rounded-full glass px-3 py-1 text-xs font-medium text-white border border-white/20">
            {categoryLabel(category)}
          </span>
          {featured && (
            <span className="inline-flex items-center rounded-full bg-gold/90 px-3 py-1 text-xs font-medium text-black">
              ★ Featured
            </span>
          )}
        </div>

        <div className="absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-white text-black opacity-0 transition-all duration-500 group-hover:opacity-100 group-hover:rotate-45">
          <ArrowUpRight size={18} />
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
          <h3 className="font-display text-xl font-medium leading-tight md:text-2xl">
            {title}
          </h3>
          <p className="mt-1 text-sm text-white/70 line-clamp-2">{excerpt}</p>
          {tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-white/30 px-2.5 py-0.5 text-[10px] uppercase tracking-wider text-white/80"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </Link>
  );
}
