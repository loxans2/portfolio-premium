import { prisma } from "@/lib/prisma";
import { ProcessEditor } from "./editor";

export const dynamic = "force-dynamic";

export default async function AdminProcessPage() {
  const steps = await prisma.processStep
    .findMany({ orderBy: { order: "asc" } })
    .catch(() => []);

  return (
    <div className="max-w-4xl">
      <h1 className="font-display text-4xl font-medium tracking-tight">Process</h1>
      <p className="mt-2 text-muted-foreground">
        Étapes de votre méthode, affichées sur la home.
      </p>
      <div className="mt-10">
        <ProcessEditor steps={steps} />
      </div>
    </div>
  );
}
