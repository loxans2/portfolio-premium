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
  name: z.string().min(1).max(120),
  role: z.string().max(120).optional(),
  content: z.string().min(1).max(1500),
  image: z.string().optional(),
  rating: z.coerce.number().int().min(1).max(5).default(5),
  order: z.coerce.number().int().default(0),
  published: z.boolean().default(true),
});

function parse(fd: FormData) {
  return schema.parse({
    name: fd.get("name"),
    role: (fd.get("role") as string) || undefined,
    content: fd.get("content"),
    image: (fd.get("image") as string) || undefined,
    rating: fd.get("rating") || 5,
    order: fd.get("order") || 0,
    published: fd.get("published") !== "off",
  });
}

export async function createTestimonial(fd: FormData) {
  await requireAuth();
  await prisma.testimonial.create({ data: parse(fd) });
  revalidatePath("/");
  revalidatePath("/admin/temoignages");
}

export async function updateTestimonial(id: string, fd: FormData) {
  await requireAuth();
  await prisma.testimonial.update({ where: { id }, data: parse(fd) });
  revalidatePath("/");
  revalidatePath("/admin/temoignages");
}

export async function deleteTestimonial(id: string) {
  await requireAuth();
  await prisma.testimonial.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/admin/temoignages");
}
