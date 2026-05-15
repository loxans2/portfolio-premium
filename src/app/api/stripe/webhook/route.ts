import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { planFromPriceId, stripe } from "@/lib/stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  if (!stripe)
    return NextResponse.json({ error: "Stripe non configuré" }, { status: 503 });

  const sig = req.headers.get("stripe-signature");
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!sig || !secret)
    return NextResponse.json({ error: "Signature manquante" }, { status: 400 });

  const rawBody = await req.text();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, secret);
  } catch (err: any) {
    console.error("Webhook signature error", err.message);
    return NextResponse.json({ error: "Signature invalide" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutCompleted(session);
        break;
      }
      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const sub = event.data.object as Stripe.Subscription;
        await handleSubscriptionUpsert(sub);
        break;
      }
      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        await handleSubscriptionDeleted(sub);
        break;
      }
      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice;
        await handlePaymentSucceeded(invoice);
        break;
      }
      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        await handlePaymentFailed(invoice);
        break;
      }
      default:
        // ignore
        break;
    }
    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Webhook handler error", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  if (!session.subscription || !session.customer) return;
  const userId = session.metadata?.userId as string | undefined;
  if (!userId) return;

  await prisma.user.update({
    where: { id: userId },
    data: {
      // plan sera précisé par subscription.updated avec le price exact
    },
  });
}

async function handleSubscriptionUpsert(sub: Stripe.Subscription) {
  const customerId = sub.customer as string;
  const userId =
    (sub.metadata?.userId as string | undefined) ??
    (await userIdFromCustomer(customerId));
  if (!userId) return;

  const priceId = sub.items.data[0]?.price.id;
  const plan = priceId ? planFromPriceId(priceId) : null;

  const status: any =
    sub.status === "active"
      ? "ACTIVE"
      : sub.status === "canceled"
        ? "CANCELED"
        : sub.status === "past_due"
          ? "PAST_DUE"
          : sub.status === "incomplete_expired"
            ? "EXPIRED"
            : "ACTIVE";

  const periodStart = new Date(sub.current_period_start * 1000);
  const periodEnd = new Date(sub.current_period_end * 1000);

  await prisma.subscription.upsert({
    where: { stripeSubId: sub.id },
    update: {
      status,
      plan: plan ?? "PREMIUM",
      currentPeriodStart: periodStart,
      currentPeriodEnd: periodEnd,
      cancelAtPeriodEnd: sub.cancel_at_period_end,
      stripeCustomerId: customerId,
    },
    create: {
      userId,
      plan: plan ?? "PREMIUM",
      status,
      currentPeriodStart: periodStart,
      currentPeriodEnd: periodEnd,
      cancelAtPeriodEnd: sub.cancel_at_period_end,
      stripeSubId: sub.id,
      stripeCustomerId: customerId,
    },
  });

  // Synchronise le plan utilisateur
  if (plan) {
    await prisma.user.update({
      where: { id: userId },
      data: { plan: status === "ACTIVE" ? plan : "FREE" },
    });
  }
}

async function handleSubscriptionDeleted(sub: Stripe.Subscription) {
  await prisma.subscription.updateMany({
    where: { stripeSubId: sub.id },
    data: { status: "CANCELED" },
  });
  const customerId = sub.customer as string;
  const userId = await userIdFromCustomer(customerId);
  if (userId) {
    await prisma.user.update({
      where: { id: userId },
      data: { plan: "FREE" },
    });
  }
}

async function handlePaymentSucceeded(invoice: Stripe.Invoice) {
  if (!invoice.subscription) return;
  const sub = await prisma.subscription.findUnique({
    where: { stripeSubId: invoice.subscription as string },
    select: { id: true, userId: true },
  });
  if (!sub) return;
  await prisma.payment.create({
    data: {
      userId: sub.userId,
      subscriptionId: sub.id,
      amount: (invoice.amount_paid ?? 0) / 100,
      currency: invoice.currency.toUpperCase(),
      status: "SUCCEEDED",
      description: invoice.description ?? `Facture ${invoice.number ?? ""}`,
      stripePaymentId: invoice.payment_intent as string | undefined,
    },
  });
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
  if (!invoice.subscription) return;
  const sub = await prisma.subscription.findUnique({
    where: { stripeSubId: invoice.subscription as string },
    select: { id: true, userId: true },
  });
  if (!sub) return;
  await prisma.payment.create({
    data: {
      userId: sub.userId,
      subscriptionId: sub.id,
      amount: (invoice.amount_due ?? 0) / 100,
      currency: invoice.currency.toUpperCase(),
      status: "FAILED",
      description: "Échec de paiement",
    },
  });
}

async function userIdFromCustomer(customerId: string) {
  const sub = await prisma.subscription.findFirst({
    where: { stripeCustomerId: customerId },
    select: { userId: true },
  });
  return sub?.userId ?? null;
}
