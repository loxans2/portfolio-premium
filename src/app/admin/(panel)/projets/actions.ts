"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";

async function requireAuth() {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Non autorisé");
}

const baseSchema = z.object({
  title: z.string().min(1).max(200),
  slug: z.string().min(1).max(200),
  category: z.enum(["WEBSITE", "BRANDING", "LOGO", "GRAPHIC", "OTHER"]),
  excerpt: z.string().min(1).max(300),
  description: z.string().min(1),
  coverImage: z.string().min(1),
  client: z.string().optional().or(z.literal("")),
  year: z.string().optional().or(z.literal("")),
  liveUrl: z.string().url().optional().or(z.literal("")),
  tags: z.string().optional(),
  images: z.string().optional(),
  featured: z.boolean().default(false),
  published: z.boolean().default(true),
  order: z.coerce.number().int().default(0),
});

function parseFormData(fd: FormData) {
  const raw = {
    title: fd.get("title") as string,
    slug: (fd.get("slug") as string) || slugify(fd.get("title") as string),
    category: fd.get("category") as string,
    excerpt: fd.get("excerpt") as string,
    description: fd.get("description") as string,
    coverImage: fd.get("coverImage") as string,
    client: (fd.get("client") as string) || "",
    year: (fd.get("year") as string) || "",
    liveUrl: (fd.get("liveUrl") as string) || "",
    tags: (fd.get("tags") as string) || "",
    images: (fd.get("images") as string) || "",
    featured: fd.get("featured") === "on",
    published: fd.get("published") !== "off",
    order: fd.get("order") || 0,
  };
  const parsed = baseSchema.parse(raw);
  return {
    title: parsed.title,
    slug: parsed.slug,
    category: parsed.category,
    excerpt: parsed.excerpt,
    description: parsed.description,
    coverImage: parsed.coverImage,
    client: parsed.client || null,
    year: parsed.year || null,
    liveUrl: parsed.liveUrl || null,
    tags: parsed.tags
      ? parsed.tags.split(",").map((t) => t.trim()).filter(Boolean)
      : [],
    images: parsed.images
      ? parsed.images.split(/\n|,/).map((s) => s.trim()).filter(Boolean)
      : [],
    featured: parsed.featured,
    published: parsed.published,
    order: parsed.order,
  };
}

export async function createProject(fd: FormData) {
  await requireAuth();
  const data = parseFormData(fd);
  await prisma.project.create({ data });
  revalidatePath("/");
  revalidatePath("/projets");
  redirect("/admin/projets");
}

export async function updateProject(id: string, fd: FormData) {
  await requireAuth();
  const data = parseFormData(fd);
  await prisma.project.update({ where: { id }, data });
  revalidatePath("/");
  revalidatePath("/projets");
  revalidatePath(`/projets/${data.slug}`);
  redirect("/admin/projets");
}

export async function deleteProject(id: string) {
  await requireAuth();
  await prisma.project.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/projets");
}

export async function toggleProjectPublished(id: string, published: boolean) {
  await requireAuth();
  await prisma.project.update({ where: { id }, data: { published } });
  revalidatePath("/");
  revalidatePath("/projets");
}
