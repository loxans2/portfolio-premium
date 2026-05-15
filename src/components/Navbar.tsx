"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useScroll, useTransform, useMotionTemplate } from "framer-motion";
import { useState } from "react";
import { Menu, X, Sparkles } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";

const links = [
  { href: "/", label: "Accueil" },
  { href: "/resources", label: "Ressources" },
  { href: "/pricing", label: "Abonnements" },
  { href: "/faq", label: "FAQ" },
  { href: "/a-propos", label: "À propos" },
  { href: "/contact", label: "Contact" },
];

export function Navbar({ siteName = "ResourceHub" }: { siteName?: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { scrollY } = useScroll();
  const blur = useTransform(scrollY, [0, 100], [8, 18]);
  const backdrop = useMotionTemplate`blur(${blur}px) saturate(150%)`;
  const { data: session } = useSession();
  const user = session?.user as any;

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
          className="flex items-center gap-2 font-display text-lg font-semibold tracking-tight"
        >
          <Sparkles size={18} className="text-gold" />
          {siteName}
        </Link>

        <ul className="hidden items-center gap-1 lg:flex">
          {links.map((l) => {
            const active = pathname === l.href || (l.href !== "/" && pathname?.startsWith(l.href));
            return (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className={cn(
                    "relative rounded-full px-4 py-2 text-sm transition-colors",
                    active
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground",
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

        <div className="hidden items-center gap-2 lg:flex">
          {user ? (
            <>
              {(user.role === "ADMIN" || user.role === "MODERATOR") && (
                <Button asChild size="sm" variant="ghost">
                  <Link href="/admin">Admin</Link>
                </Button>
              )}
              <Button asChild size="sm" variant="ghost">
                <Link href="/account">Mon compte</Link>
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => signOut({ callbackUrl: "/" })}
              >
                Déconnexion
              </Button>
            </>
          ) : (
            <>
              <Button asChild size="sm" variant="ghost">
                <Link href="/auth/login">Connexion</Link>
              </Button>
              <Button asChild size="sm" variant="gold">
                <Link href="/auth/register">S'inscrire</Link>
              </Button>
            </>
          )}
        </div>

        <button
          aria-label="Menu"
          onClick={() => setOpen((o) => !o)}
          className="cursor-pointer lg:hidden"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </motion.nav>

      {open && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="container mt-2 glass rounded-2xl p-4 lg:hidden"
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
            <li className="pt-2 grid grid-cols-2 gap-2">
              {user ? (
                <>
                  {(user.role === "ADMIN" || user.role === "MODERATOR") && (
                    <Button asChild variant="outline">
                      <Link href="/admin" onClick={() => setOpen(false)}>
                        Admin
                      </Link>
                    </Button>
                  )}
                  <Button
                    variant="gold"
                    onClick={() => {
                      setOpen(false);
                      signOut({ callbackUrl: "/" });
                    }}
                  >
                    Déconnexion
                  </Button>
                </>
              ) : (
                <>
                  <Button asChild variant="outline">
                    <Link href="/auth/login" onClick={() => setOpen(false)}>
                      Connexion
                    </Link>
                  </Button>
                  <Button asChild variant="gold">
                    <Link href="/auth/register" onClick={() => setOpen(false)}>
                      S'inscrire
                    </Link>
                  </Button>
                </>
              )}
            </li>
          </ul>
        </motion.div>
      )}
    </motion.header>
  );
}
