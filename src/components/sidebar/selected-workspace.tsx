"use client";
import { WorkspaceI } from "@/libs/supabase/supabase.types";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";

interface Props {
  workspace: WorkspaceI;
  onClick?: (option: WorkspaceI) => void;
}

const SelectedWorkspace: React.FC<Props> = ({ onClick, workspace }) => {
  const supabase = createClientComponentClient();
  const [workspaceLogo, setWorkspaceLogo] = useState("/zotion-logo.png");

  useEffect(() => {
    if (workspace.logo) {
      const { data } = supabase.storage.from("workspace-logos").getPublicUrl(workspace.logo!);
      if (data) setWorkspaceLogo(data.publicUrl);
    }
  }, [workspace]);

  return (
    <Link
      className="
        rounded-md
        text-sm
        flex
        justify-center
        items-center
        hover:bg-muted
        transition-all
        p-2
        gap-3
        cursor-pointer"
      href={`/dashboard/${workspace.id}`}
      onClick={() => {
        if (onClick) onClick(workspace);
      }}
      passHref
    >
      <Image src={workspaceLogo} width={26} height={26} alt="workspace-logo" />

      <div className="flex flex-col">
        <p
          className="
            w-[170px]
            overflow-hidden
            overflow-ellipsis
            whitespace-nowrap"
        >
          {workspace.title}
        </p>
      </div>
    </Link>
  );
};

export default SelectedWorkspace;
