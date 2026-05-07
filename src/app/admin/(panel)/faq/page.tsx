import { prisma } from "@/lib/prisma";
import { FaqEditor } from "./editor";

export const dynamic = "force-dynamic";

export default async function AdminFaqPage() {
  const faqs = await prisma.faq.findMany({ orderBy: { order: "asc" } }).catch(() => []);

  return (
    <div className="max-w-4xl">
      <h1 className="font-display text-4xl font-medium tracking-tight">FAQ</h1>
      <p className="mt-2 text-muted-foreground">
        Questions / réponses affichées sur la home, /tarifs et /faq.
      </p>
      <div className="mt-10">
        <FaqEditor faqs={faqs} />
      </div>
    </div>
  );
}
