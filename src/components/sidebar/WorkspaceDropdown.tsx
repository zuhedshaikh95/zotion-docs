"use client";
import { useAppState } from "@/libs/providers/app-state-provider";
import { WorkspaceI } from "@/libs/supabase/supabase.types";
import React, { useEffect, useState } from "react";

interface Props {
  privateWorkspaces: WorkspaceI[];
  sharedWorkspaces: WorkspaceI[];
  collaboratingWorkspaces: WorkspaceI[];
  defaultValue: WorkspaceI | undefined;
}

const WorkspaceDropdown: React.FC<Props> = ({
  collaboratingWorkspaces,
  defaultValue,
  privateWorkspaces,
  sharedWorkspaces,
}) => {
  const { state, dispatch } = useAppState();
  const [selectedOption, setSelectedOption] = useState<WorkspaceI | undefined>(defaultValue);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  useEffect(() => {
    if (!state.workspaces.length) {
      dispatch({
        type: "SET_WORKSPACES",
        payload: {
          workspaces: privateWorkspaces
            .concat(collaboratingWorkspaces, sharedWorkspaces)
            .map((workspace) => ({ ...workspace, folders: [] })),
        },
      });
    }
  }, [privateWorkspaces, sharedWorkspaces, collaboratingWorkspaces]);

  const handleSelect = (option: WorkspaceI) => {
    setSelectedOption(option);
    setIsOpen(false);
  };

  return <div></div>;
};

export default WorkspaceDropdown;
