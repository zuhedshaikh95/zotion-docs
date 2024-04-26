import { SubscriptionModalProvider } from "@/libs/providers/subscription-modal-provider";
import React from "react";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <main
      className="
        flex
        overflow-hidden
        h-screen"
    >
      <SubscriptionModalProvider>{children}</SubscriptionModalProvider>
    </main>
  );
}
