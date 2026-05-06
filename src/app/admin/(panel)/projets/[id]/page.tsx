import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { ProjectForm } from "@/components/admin/ProjectForm";
import { updateProject } from "../actions";

export default async function EditProjectPage({
  params,
}: {
  params: { id: string };
}) {
  const project = await prisma.project
    .findUnique({ where: { id: params.id } })
    .catch(() => null);

  if (!project) notFound();

  const update = updateProject.bind(null, project.id);

  return (
    <div>
      <Link
        href="/admin/projets"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft size={14} /> Retour
      </Link>
      <h1 className="font-display text-4xl font-medium tracking-tight mb-8">
        Modifier le projet
      </h1>
      <ProjectForm project={project} action={update} />
    </div>
  );
}
