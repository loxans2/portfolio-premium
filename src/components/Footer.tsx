import Link from "next/link";
import { Instagram, Linkedin, Github } from "lucide-react";

interface FooterProps {
  siteName?: string;
  email?: string;
  instagram?: string | null;
  linkedin?: string | null;
  github?: string | null;
}

export function Footer({
  siteName = "Studio",
  email = "",
  instagram,
  linkedin,
  github,
}: FooterProps) {
  return (
    <footer className="border-t border-border/50 mt-24">
      <div className="container py-12">
        <div className="grid gap-12 md:grid-cols-3">
          <div>
            <Link
              href="/"
              className="font-display text-2xl font-semibold tracking-tight"
            >
              {siteName}<span className="text-gold">.</span>
            </Link>
            <p className="mt-3 text-sm text-muted-foreground max-w-xs">
              Création digitale, identité de marque et logos sur mesure.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-4">Navigation</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/projets" className="hover:text-foreground">Projets</Link></li>
              <li><Link href="/services" className="hover:text-foreground">Services</Link></li>
              <li><Link href="/a-propos" className="hover:text-foreground">À propos</Link></li>
              <li><Link href="/contact" className="hover:text-foreground">Contact</Link></li>
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
          <p>© {new Date().getFullYear()} {siteName}. Tous droits réservés.</p>
          <Link href="/admin" className="hover:text-foreground">Admin</Link>
        </div>
      </div>
    </footer>
  );
}
