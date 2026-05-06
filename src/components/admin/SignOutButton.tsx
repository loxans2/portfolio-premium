"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/" })}
      className="flex items-center gap-2 text-xs text-muted-foreground hover:text-destructive transition-colors cursor-pointer"
    >
      <LogOut size={14} /> Déconnexion
    </button>
  );
}
