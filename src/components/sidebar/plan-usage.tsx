"use client";
import { MAX_FOLDERS_FREE_PLAN } from "@/constants";
import { useAppState } from "@/libs/providers/app-state-provider";
import { SubscriptionI } from "@/libs/supabase/supabase.types";
import React, { useEffect, useState } from "react";
import { Progress } from "..";

interface Props {
  foldersLength: number;
  subscription: SubscriptionI | null;
}

const PlanUsage: React.FC<Props> = ({ foldersLength, subscription }) => {
  const { workspaceId, state } = useAppState();
  const [usagePercentage, setUsagePercentage] = useState((foldersLength / MAX_FOLDERS_FREE_PLAN) * 100);

  useEffect(() => {
    const stateFoldersLength = state.workspaces.find((workspace) => workspace.id === workspaceId)?.folders.length;

    if (stateFoldersLength) setUsagePercentage((stateFoldersLength / MAX_FOLDERS_FREE_PLAN) * 100);
  }, [state, workspaceId]);

  return (
    <article className="mb-4">
      {subscription?.status !== "active" && (
        <div
          className="
            flex
            gap-2
            text-muted-foreground
            mb-2
            items-center"
        >
          <div className="h-4 w-4"></div>
          <div
            className="
              flex
              justify-between
              w-full
              items-center"
          >
            <p>Free Plan</p>
            <small>{usagePercentage.toFixed(0)}% / 100%</small>
          </div>
        </div>
      )}

      {subscription?.status !== "active" && <Progress className="h-1" value={usagePercentage} />}
    </article>
  );
};

export default PlanUsage;
