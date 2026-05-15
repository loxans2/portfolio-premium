"use client";

import { Suspense, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { OAuthButtons } from "@/components/OAuthButtons";

function RegisterContent() {
  const router = useRouter();
  const params = useSearchParams();
  const requestedPlan = params.get("plan") ?? "FREE";
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const email = fd.get("email") as string;
    const password = fd.get("password") as string;
    const name = fd.get("name") as string;

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        toast.error(data.error ?? "Inscription impossible");
        setLoading(false);
        return;
      }
      const signed = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      setLoading(false);
      if (signed?.error) {
        toast.error("Connexion auto échouée — connectez-vous manuellement.");
        router.push("/auth/login");
        return;
      }
      toast.success("Bienvenue !");
      router.push(requestedPlan !== "FREE" ? "/pricing" : "/");
      router.refresh();
    } catch (err) {
      setLoading(false);
      toast.error("Une erreur est survenue");
    }
  }

  return (
    <div className="w-full max-w-md">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8"
      >
        <ArrowLeft size={14} /> Retour au site
      </Link>
      <div className="rounded-2xl border border-border/60 glass p-8">
        <div className="inline-flex items-center gap-2 text-gold">
          <Sparkles size={18} />
          <span className="font-display text-lg font-semibold">ResourceHub</span>
        </div>
        <h1 className="font-display text-3xl font-medium tracking-tight mt-4">
          Créer un compte
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Gratuit, 30 secondes, sans carte bancaire.
          {requestedPlan !== "FREE" && (
            <span className="block mt-1 text-gold">
              Votre plan {requestedPlan} sera activé à la prochaine étape.
            </span>
          )}
        </p>
        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nom (facultatif)</Label>
            <Input id="name" name="name" type="text" autoComplete="name" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Mot de passe</Label>
            <Input
              id="password"
              name="password"
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              placeholder="Au moins 8 caractères"
            />
          </div>
          <Button
            type="submit"
            variant="gold"
            size="lg"
            disabled={loading}
            className="w-full"
          >
            {loading ? "Création..." : "Créer mon compte"}
          </Button>
        </form>
        <OAuthButtons callbackUrl="/" />
        <p className="mt-6 text-sm text-muted-foreground text-center">
          Déjà un compte ?{" "}
          <Link href="/auth/login" className="text-gold hover:underline">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 grain relative">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-1/3 left-1/3 h-[400px] w-[400px] rounded-full bg-gold/15 blur-3xl" />
      </div>
      <Suspense>
        <RegisterContent />
      </Suspense>
    </div>
  );
}
