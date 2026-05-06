"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  name: z.string().min(1).max(120),
  email: z.string().email(),
  subject: z.string().max(200).optional(),
  body: z.string().min(5).max(5000),
});

export async function sendMessage(formData: FormData) {
  const parsed = schema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    subject: formData.get("subject") || undefined,
    body: formData.get("body"),
  });

  if (!parsed.success) {
    return { ok: false, error: "Champs invalides." };
  }

  try {
    await prisma.message.create({ data: parsed.data });
    return { ok: true };
  } catch {
    return { ok: false, error: "Impossible d'enregistrer le message." };
  }
}
