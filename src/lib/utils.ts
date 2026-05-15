import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function slugify(input: string) {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export const RESOURCE_CATEGORIES = [
  "GAMES",
  "MOVIES",
  "PLUGINS",
  "SOFTWARE",
  "FASHION",
  "MUSIC",
  "EBOOKS",
  "TEMPLATES",
  "OTHER",
] as const;

export type ResourceCategoryKey = (typeof RESOURCE_CATEGORIES)[number];

export const RESOURCE_ACCESS = ["FREE", "PREMIUM", "VIP"] as const;
export type ResourceAccessKey = (typeof RESOURCE_ACCESS)[number];

export function categoryLabel(category: string) {
  switch (category) {
    case "GAMES":
      return "Jeux";
    case "MOVIES":
      return "Films & Séries";
    case "PLUGINS":
      return "Plugins";
    case "SOFTWARE":
      return "Logiciels";
    case "FASHION":
      return "Mode & Lifestyle";
    case "MUSIC":
      return "Musique";
    case "EBOOKS":
      return "Ebooks";
    case "TEMPLATES":
      return "Templates";
    case "OTHER":
      return "Autre";
    default:
      return category;
  }
}

export function categoryIcon(category: string): string {
  switch (category) {
    case "GAMES":
      return "Gamepad2";
    case "MOVIES":
      return "Film";
    case "PLUGINS":
      return "Puzzle";
    case "SOFTWARE":
      return "AppWindow";
    case "FASHION":
      return "Shirt";
    case "MUSIC":
      return "Music";
    case "EBOOKS":
      return "BookOpen";
    case "TEMPLATES":
      return "LayoutTemplate";
    default:
      return "Sparkles";
  }
}

export function accessLabel(access: string) {
  switch (access) {
    case "FREE":
      return "Gratuit";
    case "PREMIUM":
      return "Premium";
    case "VIP":
      return "VIP";
    default:
      return access;
  }
}

export function accessRank(access: string) {
  return access === "VIP" ? 2 : access === "PREMIUM" ? 1 : 0;
}

export function canAccess(userPlan: string | undefined, resourceAccess: string) {
  return accessRank(userPlan ?? "FREE") >= accessRank(resourceAccess);
}

export function formatNumber(n: number) {
  return new Intl.NumberFormat("fr-FR").format(n);
}
