import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ProjectForm } from "@/components/admin/ProjectForm";
import { createProject } from "../actions";

export default function NewProjectPage() {
  return (
    <div>
      <Link
        href="/admin/projets"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft size={14} /> Retour
      </Link>
      <h1 className="font-display text-4xl font-medium tracking-tight mb-8">
        Nouveau projet
      </h1>
      <ProjectForm action={createProject} />
    </div>
  );
}
