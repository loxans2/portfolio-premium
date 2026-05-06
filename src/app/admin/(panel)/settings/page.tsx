import { prisma } from "@/lib/prisma";
import { SettingsForm } from "./form";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const s = await prisma.settings
    .findUnique({ where: { id: "singleton" } })
    .catch(() => null);

  return (
    <div className="max-w-4xl">
      <h1 className="font-display text-4xl font-medium tracking-tight">
        Paramètres du site
      </h1>
      <p className="mt-2 text-muted-foreground">
        Tout ce qui apparaît dans le hero, le footer, la page À propos.
      </p>
      <div className="mt-10">
        <SettingsForm settings={s} />
      </div>
    </div>
  );
}
