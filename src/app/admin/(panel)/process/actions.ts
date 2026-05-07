"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function requireAuth() {
  const s = await getServerSession(authOptions);
  if (!s) throw new Error("Non autorisé");
}

const schema = z.object({
  title: z.string().min(1).max(120),
  description: z.string().min(1).max(1000),
  icon: z.string().min(1).default("Sparkles"),
  duration: z.string().optional().nullable(),
  order: z.coerce.number().int().default(0),
  published: z.boolean().default(true),
});

function parse(fd: FormData) {
  return schema.parse({
    title: fd.get("title"),
    description: fd.get("description"),
    icon: (fd.get("icon") as string) || "Sparkles",
    duration: (fd.get("duration") as string) || null,
    order: fd.get("order") || 0,
    published: fd.get("published") !== "off",
  });
}

export async function createStep(fd: FormData) {
  await requireAuth();
  await prisma.processStep.create({ data: parse(fd) });
  revalidatePath("/");
  revalidatePath("/admin/process");
}

export async function updateStep(id: string, fd: FormData) {
  await requireAuth();
  await prisma.processStep.update({ where: { id }, data: parse(fd) });
  revalidatePath("/");
  revalidatePath("/admin/process");
}

export async function deleteStep(id: string) {
  await requireAuth();
  await prisma.processStep.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/admin/process");
}
