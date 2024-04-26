import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { PriceI } from "./supabase/supabase.types";
import { prices } from "../../migrations/schema";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatPrice = (price: PriceI) => {
  const priceString = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: price.currency ?? undefined,
    minimumFractionDigits: 0,
  }).format((price.unitAmount || 0) / 100);

  return priceString;
};
