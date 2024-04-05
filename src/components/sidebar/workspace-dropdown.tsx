"use client";
import { useAppState } from "@/libs/providers/app-state-provider";
import { WorkspaceI } from "@/libs/supabase/supabase.types";
import { Plus } from "lucide-react";
import React, { useEffect, useState } from "react";
import { CustomDialogTrigger, Scroll, SelectedWorkspace, WorkspaceCreator } from "..";

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

  useEffect(() => {
    const findSelectedWorkspace = state.workspaces.find((workspace) => workspace.id === defaultValue?.id);

    if (findSelectedWorkspace) setSelectedOption(findSelectedWorkspace);
  }, [state, defaultValue]);

  const handleSelect = (option: WorkspaceI) => {
    setSelectedOption(option);
    setIsOpen(false);
  };

  return (
    <div
      className="
        relative
        inline-block
        text-left"
    >
      <div>
        <span onClick={() => setIsOpen((prev) => !prev)}>
          {selectedOption ? <SelectedWorkspace workspace={selectedOption} /> : "Select a workspace"}
        </span>
      </div>

      {isOpen && (
        <div
          className="
            py-2
            origin-top-right
            absolute
            w-full
            rounded-md
            shadow-md
            z-50
            bg-black/10
            backdrop-blur-lg
            group
            border-[1px]
            border-muted"
        >
          <Scroll.Area className="rounded-md flex flex-col max-h-[250px]">
            {!!privateWorkspaces.length && (
              <>
                <p className="text-sm text-muted-foreground p-2">Private</p>
                {privateWorkspaces.map((option) => (
                  <SelectedWorkspace key={option.id} workspace={option} onClick={handleSelect} />
                ))}
              </>
            )}

            {!!sharedWorkspaces.length && (
              <>
                <hr />
                <p className="text-sm text-muted-foreground p-2">Shared</p>
                {sharedWorkspaces.map((option) => (
                  <SelectedWorkspace key={option.id} workspace={option} onClick={handleSelect} />
                ))}
              </>
            )}

            {!!collaboratingWorkspaces.length && (
              <>
                <hr />
                <p className="text-sm text-muted-foreground p-2">Shared</p>
                {collaboratingWorkspaces.map((option) => (
                  <SelectedWorkspace key={option.id} workspace={option} onClick={handleSelect} />
                ))}
              </>
            )}
          </Scroll.Area>
        </div>
      )}
      <CustomDialogTrigger
        header="Create a Workspace"
        content={<WorkspaceCreator />}
        description="Workspaces give you the power to collaborate with others. You can change your workspace privacy settings after creating the workspace too."
        className="w-full"
      >
        <div
          className="
            flex
            transition-all
            hover:bg-muted
            justify-center
            rounded-md
            items-center
            gap-2
            p-2
            my-1"
        >
          <article
            className="
              rounded-full
              bg-slate-800
              flex
              w-5
              h-5
              items-center
              justify-center"
          >
            <Plus width={16} height={16} className="text-slate-500" />
          </article>
          Create workspace
        </div>
      </CustomDialogTrigger>
    </div>
  );
};

export default WorkspaceDropdown;
