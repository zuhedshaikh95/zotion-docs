"use client";
import { useAppState } from "@/libs/providers/app-state-provider";
import { useAuth } from "@/libs/providers/auth-provider";
import { FolderI } from "@/libs/supabase/supabase.types";
import { PlusIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Accordian, CustomTooltip, Dropdown } from "..";
import { v4 as uuidv4 } from "uuid";
import { useToast } from "../ui/use-toast";
import { createFolder } from "@/libs/supabase/queries";
import { useSupabaseRealtime } from "@/hooks";
import { useSubscriptionModal } from "@/libs/providers/subscription-modal-provider";

interface Props {
  workspaceFolders: FolderI[] | null;
  workspaceId: string;
}

const FoldersDropdownList: React.FC<Props> = ({ workspaceFolders, workspaceId }) => {
  //WIP local state for folders

  //WIP set real time updates
  useSupabaseRealtime();
  const { state, dispatch, folderId } = useAppState();
  const { subscription } = useAuth();
  const { open, setOpen } = useSubscriptionModal();
  const { toast } = useToast();
  const [folders, setFolders] = useState(workspaceFolders);

  // effect to set initial on server data
  useEffect(() => {
    if (workspaceFolders?.length) {
      dispatch({
        type: "SET_FOLDERS",
        payload: {
          workspaceId,
          folders: workspaceFolders.map((workspaceFolder) => ({
            ...workspaceFolder,
            files:
              state.workspaces
                .find((workspace) => workspace.id === workspaceId)
                ?.folders.find((folder) => folder.id === workspaceFolder.id)?.files || [],
          })),
        },
      });
    }
  }, [workspaceFolders, workspaceId]);

  useEffect(() => {
    setFolders(state.workspaces.find((workspace) => workspace.id === workspaceId)?.folders || []);
  }, [state, workspaceId]);

  // update state

  // add folder
  const handleAddFolder = async () => {
    if (folders?.length! >= 3 && !subscription) {
      setOpen(true);
      return;
    }

    const newFolder: FolderI = {
      bannerUrl: null,
      createdAt: new Date().toISOString(),
      data: null,
      id: uuidv4(),
      title: "Untitled",
      iconId: "📁",
      inTrash: null,
      workspaceId,
    };

    try {
      const { data, error } = await createFolder(newFolder);

      if (error) {
        toast({
          variant: "destructive",
          title: "Folder Create Error",
          description: error,
        });
        return;
      }

      toast({
        title: "Folder Created",
        description: "New folder created successfully!",
      });

      dispatch({
        type: "ADD_FOLDER",
        payload: {
          workspaceId,
          folder: { ...newFolder, files: [] },
        },
      });
    } catch (error: any) {
      console.log("Create Folder Error:", error.message);
      toast({
        variant: "destructive",
        title: "Folder Create Error",
        description: error.message,
      });
    }
  };

  return (
    <>
      <div
        className="
          flex
          justify-between
          items-center
          sticky
          z-20
          top-0
          bg-background
          w-full
          h-10
          group/title
          p-4
          text-Neutrals/neutrals-8"
      >
        <span
          className="
            text-Neutrals/neutrals-8
            font-bold
            text-xs"
        >
          FOLDERS
        </span>
        <CustomTooltip message="Create folder">
          <PlusIcon
            className="
              hidden
              group-hover/title:inline-block
              cursor-pointer
            hover:dark:text-white"
            onClick={handleAddFolder}
            size={16}
          />
        </CustomTooltip>
      </div>

      <Accordian.Root className="pb-20" type="multiple" defaultValue={[folderId || ""]}>
        {folders
          ?.filter((folder) => !folder.inTrash)
          .map((folder) => (
            <Dropdown key={folder.id} title={folder.title} listType="folder" id={folder.id} iconId={folder.iconId} />
          ))}
      </Accordian.Root>
    </>
  );
};

export default FoldersDropdownList;
