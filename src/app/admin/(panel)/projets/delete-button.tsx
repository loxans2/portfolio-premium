"use client";

import { useTransition } from "react";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { deleteProject } from "./actions";

export function DeleteProjectButton({
  id,
  title,
}: {
  id: string;
  title: string;
}) {
  const [pending, start] = useTransition();
  return (
    <Button
      size="icon"
      variant="ghost"
      onClick={() => {
        if (!confirm(`Supprimer "${title}" ?`)) return;
        start(async () => {
          try {
            await deleteProject(id);
            toast.success("Projet supprimé");
          } catch {
            toast.error("Échec de suppression");
          }
        });
      }}
      disabled={pending}
      className="hover:text-destructive"
    >
      <Trash2 size={14} />
    </Button>
  );
}
