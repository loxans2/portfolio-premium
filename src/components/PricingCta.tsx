"use client";

import Link from "next/link";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  planKey: "FREE" | "PREMIUM" | "VIP";
  label: string;
  fallbackUrl: string;
  highlighted?: boolean;
}

export function PricingCta({
  planKey,
  label,
  fallbackUrl,
  highlighted,
}: Props) {
  const { data: session } = useSession();
  const user = session?.user as any;
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function handleClick() {
    if (planKey === "FREE") {
      router.push(user ? "/account" : "/auth/register");
      return;
    }
    if (!user) {
      router.push(`/auth/register?plan=${planKey}`);
      return;
    }
    setBusy(true);
    const res = await fetch("/api/stripe/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan: planKey }),
    });
    setBusy(false);
    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data.url) {
      toast.error(data.error ?? "Stripe non disponible — réessayez plus tard.");
      return;
    }
    window.location.href = data.url;
  }

  return (
    <Button
      onClick={handleClick}
      disabled={busy}
      variant={highlighted ? "gold" : "outline"}
      className="w-full"
    >
      {busy ? "Redirection..." : label}
      <ArrowRight size={14} />
    </Button>
  );
}
