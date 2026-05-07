import { prisma } from "@/lib/prisma";
import { PricingEditor } from "./editor";

export const dynamic = "force-dynamic";

export default async function AdminPricingPage() {
  const plans = await prisma.pricingPlan
    .findMany({ orderBy: { order: "asc" } })
    .catch(() => []);

  return (
    <div className="max-w-4xl">
      <h1 className="font-display text-4xl font-medium tracking-tight">Tarifs</h1>
      <p className="mt-2 text-muted-foreground">
        Forfaits affichés sur la home et la page /tarifs.
      </p>
      <div className="mt-10">
        <PricingEditor plans={plans} />
      </div>
    </div>
  );
}
