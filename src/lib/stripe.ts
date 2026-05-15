import Stripe from "stripe";

const key = process.env.STRIPE_SECRET_KEY;

export const stripe = key
  ? new Stripe(key, { apiVersion: "2024-12-18.acacia" as any })
  : null;

export function planFromPriceId(priceId: string): "PREMIUM" | "VIP" | null {
  if (priceId === process.env.STRIPE_PRICE_PREMIUM) return "PREMIUM";
  if (priceId === process.env.STRIPE_PRICE_VIP) return "VIP";
  return null;
}

export function priceIdForPlan(plan: "PREMIUM" | "VIP"): string | undefined {
  return plan === "VIP"
    ? process.env.STRIPE_PRICE_VIP
    : process.env.STRIPE_PRICE_PREMIUM;
}

export function isStripeConfigured() {
  return Boolean(
    stripe &&
      process.env.STRIPE_PRICE_PREMIUM &&
      process.env.STRIPE_PRICE_VIP &&
      process.env.STRIPE_WEBHOOK_SECRET,
  );
}
