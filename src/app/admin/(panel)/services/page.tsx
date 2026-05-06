import * as Icons from "lucide-react";
import { Sparkles } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { ServicesEditor } from "./editor";

export const dynamic = "force-dynamic";

export default async function AdminServicesPage() {
  const services = await prisma.service
    .findMany({ orderBy: { order: "asc" } })
    .catch(() => []);

  return (
    <div className="max-w-4xl">
      <h1 className="font-display text-4xl font-medium tracking-tight">
        Services
      </h1>
      <p className="mt-2 text-muted-foreground">
        Ajoutez, modifiez ou supprimez les services proposés.
      </p>
      <div className="mt-10">
        <ServicesEditor services={services} />
      </div>
    </div>
  );
}
