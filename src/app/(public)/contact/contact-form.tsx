"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { sendMessage } from "./actions";

export function ContactForm() {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    try {
      const result = await sendMessage(formData);
      if (result.ok) {
        toast.success("Message envoyé. Je reviens vers vous très vite.");
        const form = document.querySelector("form") as HTMLFormElement | null;
        form?.reset();
      } else {
        toast.error(result.error ?? "Une erreur est survenue.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <form action={handleSubmit} className="rounded-2xl border border-border/60 bg-card p-6 md:p-8 space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Nom</Label>
          <Input id="name" name="name" required placeholder="Votre nom" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" required placeholder="vous@email.com" />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="subject">Sujet</Label>
        <Input id="subject" name="subject" placeholder="Site web pour mon entreprise" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="body">Message</Label>
        <Textarea
          id="body"
          name="body"
          required
          rows={6}
          placeholder="Parlez-moi de votre projet, vos contraintes, votre vision..."
        />
      </div>
      <Button type="submit" variant="gold" size="lg" disabled={loading} className="w-full">
        {loading ? "Envoi..." : "Envoyer le message"}
      </Button>
    </form>
  );
}
