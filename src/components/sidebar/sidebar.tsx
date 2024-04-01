"use server";
import {
  getCollaboratingWorkspaces,
  getFolders,
  getPrivateWorkspaces,
  getSharedWorkspaces,
  getUserSubscription,
} from "@/libs/supabase/queries";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";
import { twMerge } from "tailwind-merge";
import { FoldersDropdownList, NativeNavigation, PlanUsage, Scroll, WorkspaceDropdown } from "..";

interface Props {
  params: { workspaceId: string };
  className?: string;
}

const Sidebar: React.FC<Props> = async ({ params, className }) => {
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  //   check user
  if (!user) return;

  //   check subscription
  const { data: subscription, error: subscritionError } = await getUserSubscription(user.id);

  //   check folders
  const { data: folders, error: foldersError } = await getFolders(params.workspaceId);

  //   check errors
  if (subscritionError || foldersError) redirect("/dashboard");

  //   get all the different workspaces: pricate, shared, collaborating
  const [privateWorkspaces, collaboratingWorkspaces, sharedWorkspaces] = await Promise.all([
    getPrivateWorkspaces(user.id),
    getCollaboratingWorkspaces(user.id),
    getSharedWorkspaces(user.id),
  ]);

  return (
    <aside className={twMerge("hidden sm:flex sm:flex-col md:gap-4 shrink-0 p-4 !justify-between", className)}>
      <div>
        <WorkspaceDropdown
          collaboratingWorkspaces={collaboratingWorkspaces}
          privateWorkspaces={privateWorkspaces}
          sharedWorkspaces={sharedWorkspaces}
          defaultValue={privateWorkspaces
            .concat(collaboratingWorkspaces, sharedWorkspaces)
            .find((workspace) => workspace.id === params.workspaceId)}
        />

        <PlanUsage foldersLength={folders?.length ?? 0} subscription={subscription} />

        <NativeNavigation workspaceId={params.workspaceId} />

        <Scroll.Area
          className="
            overflow-auto
            relative
            h-[450px]"
        >
          <div
            className="
              pointer-events-none
              w-full
              absolute
              bottom-0
              h-20
              bg-gradient-to-t
              from-background
              to-transparent
              z-40"
          />

          <FoldersDropdownList workspaceFolders={folders} workspaceId={params.workspaceId} />
        </Scroll.Area>
      </div>
    </aside>
  );
};

export default Sidebar;
