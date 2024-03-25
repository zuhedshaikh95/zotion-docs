"use client";
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
  const [selectedOption, setSelectedOption] = useState<WorkspaceI | undefined>(defaultValue);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  useEffect(() => {}, [privateWorkspaces, sharedWorkspaces, collaboratingWorkspaces]);

  return <div>WorkspaceDropdown</div>;
};

export default WorkspaceDropdown;
