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
  question: z.string().min(1).max(300),
  answer: z.string().min(1).max(4000),
  order: z.coerce.number().int().default(0),
  published: z.boolean().default(true),
});

function parse(fd: FormData) {
  return schema.parse({
    question: fd.get("question"),
    answer: fd.get("answer"),
    order: fd.get("order") || 0,
    published: fd.get("published") !== "off",
  });
}

export async function createFaq(fd: FormData) {
  await requireAuth();
  await prisma.faq.create({ data: parse(fd) });
  revalidatePath("/");
  revalidatePath("/faq");
  revalidatePath("/tarifs");
  revalidatePath("/admin/faq");
}

export async function updateFaq(id: string, fd: FormData) {
  await requireAuth();
  await prisma.faq.update({ where: { id }, data: parse(fd) });
  revalidatePath("/");
  revalidatePath("/faq");
  revalidatePath("/tarifs");
  revalidatePath("/admin/faq");
}

export async function deleteFaq(id: string) {
  await requireAuth();
  await prisma.faq.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/faq");
  revalidatePath("/tarifs");
  revalidatePath("/admin/faq");
}
