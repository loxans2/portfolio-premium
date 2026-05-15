import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { stripe } from "@/lib/stripe";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const user = session?.user as any;
  if (!user)
    return NextResponse.redirect(new URL("/auth/login", req.url));

  if (!stripe)
    return NextResponse.json({ error: "Stripe non configuré" }, { status: 503 });

  const sub = await prisma.subscription.findFirst({
    where: { userId: user.id, stripeCustomerId: { not: null } },
    select: { stripeCustomerId: true },
  });

  if (!sub?.stripeCustomerId)
    return NextResponse.redirect(new URL("/pricing", req.url));

  const origin =
    req.headers.get("origin") ?? process.env.NEXTAUTH_URL ?? "http://localhost:3000";

  const portal = await stripe.billingPortal.sessions.create({
    customer: sub.stripeCustomerId,
    return_url: `${origin}/account`,
  });

  return NextResponse.redirect(portal.url);
}
