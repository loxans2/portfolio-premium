"use client";

import { Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { OAuthButtons } from "@/components/OAuthButtons";

function LoginContent() {
  const router = useRouter();
  const params = useSearchParams();
  const callbackUrl = params.get("callbackUrl") || "/";
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const res = await signIn("credentials", {
      email: fd.get("email") as string,
      password: fd.get("password") as string,
      redirect: false,
    });
    setLoading(false);
    if (res?.error) {
      toast.error("Identifiants invalides");
      return;
    }
    router.push(callbackUrl);
    router.refresh();
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
          Connexion
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Accédez à votre espace membre.
        </p>
        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="vous@email.com"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Mot de passe</Label>
            <Input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              placeholder="••••••••"
            />
          </div>
          <Button
            type="submit"
            variant="gold"
            size="lg"
            disabled={loading}
            className="w-full"
          >
            {loading ? "Connexion..." : "Se connecter"}
          </Button>
        </form>
        <OAuthButtons callbackUrl={callbackUrl} />
        <p className="mt-6 text-sm text-muted-foreground text-center">
          Pas encore de compte ?{" "}
          <Link href="/auth/register" className="text-gold hover:underline">
            Créer un compte
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 grain relative">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-1/3 left-1/3 h-[400px] w-[400px] rounded-full bg-gold/15 blur-3xl" />
      </div>
      <Suspense>
        <LoginContent />
      </Suspense>
    </div>
  );
}
