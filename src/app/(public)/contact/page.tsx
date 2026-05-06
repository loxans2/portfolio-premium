import { prisma } from "@/lib/prisma";
import { Reveal } from "@/components/Reveal";
import { ContactForm } from "./contact-form";

export const metadata = { title: "Contact" };

export default async function ContactPage() {
  const settings = await prisma.settings
    .findUnique({ where: { id: "singleton" } })
    .catch(() => null);

  return (
    <div className="container pt-32 md:pt-40 pb-24">
      <div className="grid gap-16 lg:grid-cols-2">
        <Reveal>
          <p className="text-xs uppercase tracking-widest text-gold mb-3">
            Contact
          </p>
          <h1 className="font-display text-5xl font-medium tracking-tight md:text-6xl text-balance">
            Parlons de votre projet.
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-md">
            Envoyez-moi un message et je reviens vers vous sous 24h ouvrées.
          </p>

          <div className="mt-12 space-y-6">
            {settings?.email && (
              <div>
                <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">
                  Email
                </p>
                <a
                  href={`mailto:${settings.email}`}
                  className="text-xl font-medium hover:text-gold transition-colors"
                >
                  {settings.email}
                </a>
              </div>
            )}
            {settings?.phone && (
              <div>
                <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">
                  Téléphone
                </p>
                <p className="text-xl font-medium">{settings.phone}</p>
              </div>
            )}
          </div>
        </Reveal>

        <Reveal delay={0.15}>
          <ContactForm />
        </Reveal>
      </div>
    </div>
  );
}
