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

export function categoryLabel(category: string) {
  switch (category) {
    case "WEBSITE":
      return "Site web";
    case "BRANDING":
      return "Identité";
    case "LOGO":
      return "Logo";
    case "GRAPHIC":
      return "Graphisme";
    default:
      return "Autre";
  }
}
