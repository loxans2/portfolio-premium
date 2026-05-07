"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useScroll, useTransform, useMotionTemplate } from "framer-motion";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";

const links = [
  { href: "/", label: "Accueil" },
  { href: "/projets", label: "Projets" },
  { href: "/services", label: "Services" },
  { href: "/tarifs", label: "Tarifs" },
  { href: "/a-propos", label: "À propos" },
  { href: "/contact", label: "Contact" },
];

export function Navbar({ siteName = "Studio" }: { siteName?: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { scrollY } = useScroll();
  const blur = useTransform(scrollY, [0, 100], [8, 18]);
  const backdrop = useMotionTemplate`blur(${blur}px) saturate(150%)`;

  return (
    <motion.header
      className="fixed inset-x-0 top-0 z-50 px-4 pt-4"
      initial={{ y: -32, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.nav
        style={{ backdropFilter: backdrop, WebkitBackdropFilter: backdrop }}
        className="container glass flex items-center justify-between rounded-full px-6 py-3"
      >
        <Link
          href="/"
          className="font-display text-lg font-semibold tracking-tight"
        >
          {siteName}<span className="text-gold">.</span>
        </Link>

        <ul className="hidden items-center gap-1 md:flex">
          {links.map((l) => {
            const active = pathname === l.href;
            return (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className={cn(
                    "relative rounded-full px-4 py-2 text-sm transition-colors",
                    active
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {active && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 -z-10 rounded-full bg-accent"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  {l.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="hidden md:block">
          <Button asChild size="sm" variant="gold">
            <Link href="/contact">Démarrer un projet</Link>
          </Button>
        </div>

        <button
          aria-label="Menu"
          onClick={() => setOpen((o) => !o)}
          className="cursor-pointer md:hidden"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </motion.nav>

      {open && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="container mt-2 glass rounded-2xl p-4 md:hidden"
        >
          <ul className="flex flex-col gap-1">
            {links.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-lg px-4 py-3 text-sm hover:bg-accent"
                >
                  {l.label}
                </Link>
              </li>
            ))}
            <li className="pt-2">
              <Button asChild variant="gold" className="w-full">
                <Link href="/contact" onClick={() => setOpen(false)}>
                  Démarrer un projet
                </Link>
              </Button>
            </li>
          </ul>
        </motion.div>
      )}
    </motion.header>
  );
}
