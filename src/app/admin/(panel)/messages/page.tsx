import { prisma } from "@/lib/prisma";
import { MessagesList } from "./list";

export const dynamic = "force-dynamic";

export default async function AdminMessagesPage() {
  const messages = await prisma.message
    .findMany({ orderBy: { createdAt: "desc" } })
    .catch(() => []);

  return (
    <div className="max-w-5xl">
      <h1 className="font-display text-4xl font-medium tracking-tight">
        Messages
      </h1>
      <p className="mt-2 text-muted-foreground">
        Demandes reçues via le formulaire de contact.
      </p>
      <div className="mt-10">
        <MessagesList messages={messages} />
      </div>
    </div>
  );
}
