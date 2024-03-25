import React from "react";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <main
      className="
        flex
        overflow-hidden
        h-screen"
    >
      {children}
    </main>
  );
}
