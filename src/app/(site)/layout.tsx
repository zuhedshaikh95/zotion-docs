import { Navbar } from "@/components";
import React from "react";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <main>
      <Navbar />
      {children}
    </main>
  );
}
