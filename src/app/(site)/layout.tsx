import { Navbar } from "@/components";
import React from "react";

interface Props {
  children: React.ReactNode;
}

export default async function IndexRootLayout({ children }: Props) {
  return (
    <main>
      <Navbar />
      {children}
    </main>
  );
}
