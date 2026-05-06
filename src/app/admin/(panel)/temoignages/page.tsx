import { prisma } from "@/lib/prisma";
import { TestimonialsEditor } from "./editor";

export const dynamic = "force-dynamic";

export default async function AdminTestimonialsPage() {
  const list = await prisma.testimonial
    .findMany({ orderBy: { order: "asc" } })
    .catch(() => []);

  return (
    <div className="max-w-4xl">
      <h1 className="font-display text-4xl font-medium tracking-tight">
        Témoignages
      </h1>
      <p className="mt-2 text-muted-foreground">
        Avis clients affichés sur la page d'accueil.
      </p>
      <div className="mt-10">
        <TestimonialsEditor items={list} />
      </div>
    </div>
  );
}
