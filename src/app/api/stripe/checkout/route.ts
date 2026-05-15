import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { isStripeConfigured, priceIdForPlan, stripe } from "@/lib/stripe";

const schema = z.object({ plan: z.enum(["PREMIUM", "VIP"]) });

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const user = session?.user as any;
  if (!user)
    return NextResponse.json({ error: "Connexion requise" }, { status: 401 });

  if (!stripe || !isStripeConfigured()) {
    return NextResponse.json(
      {
        error:
          "Stripe non configuré. Définissez STRIPE_SECRET_KEY, STRIPE_PRICE_PREMIUM, STRIPE_PRICE_VIP, STRIPE_WEBHOOK_SECRET.",
      },
      { status: 503 },
    );
  }

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success)
    return NextResponse.json({ error: "Plan invalide" }, { status: 400 });

  const price = priceIdForPlan(parsed.data.plan);
  if (!price)
    return NextResponse.json({ error: "Prix indisponible" }, { status: 500 });

  const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
  if (!dbUser)
    return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 });

  // Récupère ou crée le customer Stripe
  const existingSub = await prisma.subscription.findFirst({
    where: { userId: user.id, stripeCustomerId: { not: null } },
    select: { stripeCustomerId: true },
  });

  let customerId = existingSub?.stripeCustomerId ?? undefined;
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: dbUser.email,
      name: dbUser.name ?? undefined,
      metadata: { userId: user.id },
    });
    customerId = customer.id;
  }

  const origin =
    req.headers.get("origin") ??
    process.env.NEXTAUTH_URL ??
    "http://localhost:3000";

  const checkout = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: customerId,
    line_items: [{ price, quantity: 1 }],
    success_url: `${origin}/account?checkout=success`,
    cancel_url: `${origin}/pricing?checkout=cancel`,
    allow_promotion_codes: true,
    subscription_data: { metadata: { userId: user.id, plan: parsed.data.plan } },
    metadata: { userId: user.id, plan: parsed.data.plan },
  });

  return NextResponse.json({ url: checkout.url });
}
