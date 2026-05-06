"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { updateSettings } from "./actions";

type Settings = {
  siteName: string;
  tagline: string;
  bio: string;
  email: string;
  phone: string | null;
  location: string | null;
  instagram: string | null;
  linkedin: string | null;
  github: string | null;
  behance: string | null;
  heroTitle: string;
  heroSubtitle: string;
  aboutTitle: string;
  aboutBody: string;
} | null;

export function SettingsForm({ settings }: { settings: Settings }) {
  const [pending, setPending] = useState(false);

  return (
    <form
      action={async (fd) => {
        setPending(true);
        try {
          await updateSettings(fd);
          toast.success("Paramètres enregistrés");
        } catch (err: any) {
          if (err?.digest?.startsWith("NEXT_REDIRECT")) throw err;
          toast.error("Erreur lors de l'enregistrement");
        } finally {
          setPending(false);
        }
      }}
      className="space-y-8"
    >
      <Section title="Identité du site">
        <Field
          label="Nom du studio / portfolio"
          name="siteName"
          defaultValue={settings?.siteName ?? "Studio"}
          required
        />
        <Field
          label="Tagline"
          name="tagline"
          defaultValue={settings?.tagline ?? ""}
          required
        />
        <FieldArea
          label="Bio courte"
          name="bio"
          defaultValue={settings?.bio ?? ""}
          rows={3}
          required
        />
      </Section>

      <Section title="Hero (page d'accueil)">
        <Field
          label="Titre principal"
          name="heroTitle"
          defaultValue={settings?.heroTitle ?? ""}
          required
        />
        <FieldArea
          label="Sous-titre"
          name="heroSubtitle"
          defaultValue={settings?.heroSubtitle ?? ""}
          rows={3}
          required
        />
      </Section>

      <Section title="À propos">
        <Field
          label="Titre de la section"
          name="aboutTitle"
          defaultValue={settings?.aboutTitle ?? "À propos"}
          required
        />
        <FieldArea
          label="Texte"
          name="aboutBody"
          defaultValue={settings?.aboutBody ?? ""}
          rows={6}
          required
        />
      </Section>

      <Section title="Contact">
        <Field
          label="Email"
          name="email"
          type="email"
          defaultValue={settings?.email ?? ""}
          required
        />
        <Field
          label="Téléphone"
          name="phone"
          defaultValue={settings?.phone ?? ""}
        />
        <Field
          label="Localisation"
          name="location"
          defaultValue={settings?.location ?? ""}
          placeholder="Paris, France"
        />
      </Section>

      <Section title="Réseaux sociaux">
        <Field
          label="Instagram (URL)"
          name="instagram"
          type="url"
          defaultValue={settings?.instagram ?? ""}
        />
        <Field
          label="LinkedIn (URL)"
          name="linkedin"
          type="url"
          defaultValue={settings?.linkedin ?? ""}
        />
        <Field
          label="GitHub (URL)"
          name="github"
          type="url"
          defaultValue={settings?.github ?? ""}
        />
        <Field
          label="Behance (URL)"
          name="behance"
          type="url"
          defaultValue={settings?.behance ?? ""}
        />
      </Section>

      <div className="sticky bottom-4 flex justify-end">
        <Button type="submit" variant="gold" size="lg" disabled={pending}>
          {pending ? "Enregistrement..." : "Enregistrer les paramètres"}
        </Button>
      </div>
    </form>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-border/60 bg-card p-6 space-y-4">
      <h2 className="font-display text-lg font-medium">{title}</h2>
      {children}
    </div>
  );
}

function Field({ label, ...props }: any) {
  return (
    <div className="space-y-2">
      <Label htmlFor={props.name}>{label}</Label>
      <Input id={props.name} {...props} />
    </div>
  );
}

function FieldArea({ label, ...props }: any) {
  return (
    <div className="space-y-2">
      <Label htmlFor={props.name}>{label}</Label>
      <Textarea id={props.name} {...props} />
    </div>
  );
}
