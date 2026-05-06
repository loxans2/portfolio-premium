import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <p className="font-display text-7xl md:text-9xl text-gold">404</p>
      <h1 className="mt-4 font-display text-3xl md:text-4xl font-medium">
        Cette page n'existe pas.
      </h1>
      <p className="mt-2 text-muted-foreground max-w-md">
        Le contenu que vous cherchez a peut-être été déplacé ou supprimé.
      </p>
      <Button asChild variant="gold" className="mt-8">
        <Link href="/">Retour à l'accueil</Link>
      </Button>
    </div>
  );
}
