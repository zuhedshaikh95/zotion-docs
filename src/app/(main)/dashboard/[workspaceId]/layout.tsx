import { MobileSidebar, Sidebar } from "@/components";
import React from "react";

export default async function WorkspaceLayout({ children, params }: { children: React.ReactNode; params: any }) {
  return (
    <div
      className="
        flex
        overflow-hidden
        h-screen
        w-screen"
    >
      <Sidebar params={params} />

      <MobileSidebar>
        <Sidebar className="w-screen inline-block sm:hidden" params={params} />
      </MobileSidebar>

      <div
        className="
            dark:border-Neutrals/neutrals-12/70
            border-l-[1px]
            w-full
            relative
            overflow-auto"
      >
        {children}
      </div>
    </div>
  );
}
