import { SubscriptionModalProvider } from "@/libs/providers/subscription-modal-provider";
import { getActiveProductsWithPrice } from "@/libs/supabase/queries";
import React from "react";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { data: products, error } = await getActiveProductsWithPrice();

  if (error) throw new Error("Something went wrong! Try again later");

  return (
    <main className="flex overflow-hidden h-screen">
      <SubscriptionModalProvider products={products}>{children}</SubscriptionModalProvider>
    </main>
  );
}
