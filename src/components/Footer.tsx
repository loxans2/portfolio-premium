import Link from "next/link";
import { Instagram, Linkedin, Github, Sparkles } from "lucide-react";

interface FooterProps {
  siteName?: string;
  email?: string;
  instagram?: string | null;
  linkedin?: string | null;
  github?: string | null;
}

export function Footer({
  siteName = "ResourceHub",
  email = "",
  instagram,
  linkedin,
  github,
}: FooterProps) {
  return (
    <footer className="border-t border-border/50 mt-24">
      <div className="container py-12">
        <div className="grid gap-12 md:grid-cols-4">
          <div className="md:col-span-2">
            <Link
              href="/"
              className="inline-flex items-center gap-2 font-display text-2xl font-semibold tracking-tight"
            >
              <Sparkles size={20} className="text-gold" />
              {siteName}
            </Link>
            <p className="mt-3 text-sm text-muted-foreground max-w-md leading-relaxed">
              La plateforme premium qui centralise vos ressources créatives :
              jeux, films, plugins, logiciels, templates. Tout est légal,
              soit créé en interne, soit libre de droits.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-4">Plateforme</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/resources" className="hover:text-foreground transition-colors">Ressources</Link></li>
              <li><Link href="/pricing" className="hover:text-foreground transition-colors">Abonnements</Link></li>
              <li><Link href="/faq" className="hover:text-foreground transition-colors">FAQ</Link></li>
              <li><Link href="/a-propos" className="hover:text-foreground transition-colors">À propos</Link></li>
              <li><Link href="/contact" className="hover:text-foreground transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-4">Contact</h4>
            {email && (
              <a
                href={`mailto:${email}`}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                {email}
              </a>
            )}
            <div className="flex gap-3 mt-4">
              {instagram && (
                <a
                  href={instagram}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Instagram"
                  className="rounded-full p-2 hover:bg-accent transition-colors cursor-pointer"
                >
                  <Instagram size={18} />
                </a>
              )}
              {linkedin && (
                <a
                  href={linkedin}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="LinkedIn"
                  className="rounded-full p-2 hover:bg-accent transition-colors cursor-pointer"
                >
                  <Linkedin size={18} />
                </a>
              )}
              {github && (
                <a
                  href={github}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="GitHub"
                  className="rounded-full p-2 hover:bg-accent transition-colors cursor-pointer"
                >
                  <Github size={18} />
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-border/50 flex flex-col sm:flex-row justify-between gap-2 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} {siteName}. Toutes les ressources sont créées en interne ou libres de droits.</p>
          <div className="flex gap-4">
            <Link href="/mentions-legales" className="hover:text-foreground transition-colors">Mentions légales</Link>
            <Link href="/cgu" className="hover:text-foreground transition-colors">CGU</Link>
            <Link href="/dmca" className="hover:text-foreground transition-colors">DMCA</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
