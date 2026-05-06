"use client";

import { useTransition } from "react";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { toggleProjectPublished } from "./actions";

export function TogglePublishedButton({
  id,
  published,
}: {
  id: string;
  published: boolean;
}) {
  const [pending, start] = useTransition();
  return (
    <Button
      size="icon"
      variant="ghost"
      title={published ? "Dépublier" : "Publier"}
      onClick={() => {
        start(async () => {
          try {
            await toggleProjectPublished(id, !published);
            toast.success(published ? "Dépublié" : "Publié");
          } catch {
            toast.error("Erreur");
          }
        });
      }}
      disabled={pending}
    >
      {published ? <Eye size={14} /> : <EyeOff size={14} />}
    </Button>
  );
}
