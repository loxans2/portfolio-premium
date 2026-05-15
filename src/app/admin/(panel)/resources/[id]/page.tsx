import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ResourceForm } from "@/components/admin/ResourceForm";

export const dynamic = "force-dynamic";

export default async function EditResourcePage({
  params,
}: {
  params: { id: string };
}) {
  const r = await prisma.resource
    .findUnique({ where: { id: params.id } })
    .catch(() => null);
  if (!r) notFound();

  return (
    <ResourceForm
      initial={{
        id: r.id,
        slug: r.slug,
        title: r.title,
        category: r.category as any,
        access: r.access as any,
        excerpt: r.excerpt,
        description: r.description,
        coverImage: r.coverImage,
        images: r.images,
        fileUrl: r.fileUrl,
        fileSize: r.fileSize,
        version: r.version,
        license: r.license,
        tags: r.tags as any,
        featured: r.featured,
        status: r.status as any,
        order: r.order,
        price: r.price ?? 0,
      }}
    />
  );
}
