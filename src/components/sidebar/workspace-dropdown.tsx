"use client";
import { useAppState } from "@/libs/providers/app-state-provider";
import { WorkspaceI } from "@/libs/supabase/supabase.types";
import React, { useEffect, useState } from "react";
import { CustomDialogTrigger, SelectedWorkspace, WorkspaceCreator } from "..";

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
            origin-top-right
            absolute
            w-full
            rounded-md
            shadow-md
            z-50
            h-[190px]
            bg-black/10
            backdrop-blur-lg
            group
            border-[1px]
            border-muted"
        >
          <div className="rounded-md flex flex-col">
            <div className="">
              {!!privateWorkspaces.length && (
                <>
                  <p className="text-sm text-muted-foreground p-2">Private</p>
                  <hr />
                  {privateWorkspaces.map((option) => (
                    <SelectedWorkspace key={option.id} workspace={option} onClick={handleSelect} />
                  ))}
                </>
              )}

              {!!sharedWorkspaces.length && (
                <>
                  <p className="text-muted-foreground p-2">Shared</p>
                  <hr />
                  {sharedWorkspaces.map((option) => (
                    <SelectedWorkspace key={option.id} workspace={option} onClick={handleSelect} />
                  ))}
                </>
              )}

              {!!collaboratingWorkspaces.length && (
                <>
                  <p className="text-muted-foreground p-2">Shared</p>
                  <hr />
                  {collaboratingWorkspaces.map((option) => (
                    <SelectedWorkspace key={option.id} workspace={option} onClick={handleSelect} />
                  ))}
                </>
              )}
            </div>

            <CustomDialogTrigger
              header="Create a Workspace"
              content={<WorkspaceCreator />}
              description="Workspaces give you the power to collaborate with others. You can change your workspace privacy settings after creating the workspace too."
            >
              <div
                className="
                  flex
                  transition-all
                  hover:bg-muted
                  justify-center
                  items-center
                  gap-2
                  p-2
                  w-full"
              >
                <article
                  className="
                    text-slate-500
                    rounded-full
                    bg-slate-800
                    w-4
                    h-4
                    flex
                    items-center
                    justify-center"
                >
                  +
                </article>
                Create workspace
              </div>
            </CustomDialogTrigger>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkspaceDropdown;
