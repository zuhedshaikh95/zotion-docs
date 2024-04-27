import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { PriceI } from "./supabase/supabase.types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export class CustomException extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export const formatPrice = (price: PriceI) => {
  const priceString = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: price.currency ?? undefined,
    minimumFractionDigits: 0,
  }).format((price.unitAmount || 0) / 100);

  return priceString;
};

export const toDateTime = (seconds: number) => {
  const dateTime = new Date("1970-01-01T00:30:00Z");
  dateTime.setSeconds(seconds);

  return dateTime;
};

export const getUrl = () => {
  let url = process.env.NEXT_PUBLIC_SITE_URL ?? process.env.NEXT_PUBLIC_RAILWAY_URL ?? "http://localhost:3000";

  url = url.startsWith("http") ? url : `https://${url}`;
  url = url.charAt(url.length - 1) === "/" ? url : `${url}/`;

  return url;
};

export const postData = async ({ url, data }: { url: string; data?: { price?: PriceI; origin?: string } }) => {
  const response = await fetch(url, {
    method: "POST",
    headers: new Headers({ "Content-Type": "application/json" }),
    credentials: "same-origin",
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    console.log("Error in postData", { url, data, response });
    throw Error(response.statusText);
  }

  return response.json();
};
