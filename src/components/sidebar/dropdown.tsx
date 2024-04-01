"use client";
import { useAppState } from "@/libs/providers/app-state-provider";
import { updateFolder } from "@/libs/supabase/queries";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import clsx from "clsx";
import { EmojiClickData } from "emoji-picker-react";
import { PlusIcon, TrashIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useMemo, useState } from "react";
import { Accordian, CustomTooltip, EmojiPicker } from "..";
import { useToast } from "../ui/use-toast";

interface Props {
  title: string;
  id: string;
  listType: "folder" | "file";
  iconId: string;
  children?: React.ReactNode;
  disabled?: boolean;
}

const Dropdown: React.FC<Props> = ({ iconId, id, listType, title, children, disabled }) => {
  const supabase = createClientComponentClient();
  const { state, dispatch, workspaceId, folderId } = useAppState();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const router = useRouter();
  const { toast } = useToast();

  // file title

  const isFolder = listType === "folder";

  // folder Title synced with server and local
  const folderTitle = useMemo<string | undefined>(() => {
    if (isFolder) {
      const stateTitle = state.workspaces
        .find((workspace) => workspace.id === workspaceId)
        ?.folders.find((folder) => folder.id === id)?.title;

      if (title === stateTitle || !stateTitle) return title;

      return stateTitle;
    }
  }, [state, listType, workspaceId, id, title]);

  const fileTitle: string | undefined = useMemo(() => {
    const fileAndFolderId = id?.split("folder");

    if (!isFolder && fileAndFolderId) {
      const stateTitle = state.workspaces
        .find((workspace) => workspace.id === workspaceId)
        ?.folders.find((folder) => folder.id === fileAndFolderId[0])
        ?.files.find((file) => file.id === fileAndFolderId[1])?.title;

      if (title === stateTitle || !stateTitle) return title;

      return stateTitle;
    }
  }, [state, listType, workspaceId, id, title]);

  const listStyles = useMemo(
    () =>
      clsx("relative", {
        "border-none text-md": isFolder,
        "border-none ml-6 text-[16px] py-1": !isFolder,
      }),
    [listType]
  );

  const groupIdentifies = useMemo(
    () =>
      clsx("dark:text-white whitespace-nowrap flex justify-between items-center w-full relative", {
        "group/folder": isFolder,
        "group/file": !isFolder,
      }),
    []
  );

  const hoverStyles = useMemo(
    () =>
      clsx("h-full hidden rounded-sm absolute right-0 items-center justify-center px-2", {
        "group-hover/file:block": !isFolder,
        "group-hover/folder:block": isFolder,
      }),
    [isFolder]
  );

  // add file
  const addNewFile = () => {};

  // move to trash
  const moveToTrash = () => {};

  // Navigate to different page
  const handleNavigateToPage = (accordianId: string, type: typeof listType) => {
    if (type === "folder") {
      router.push(`dashboard/${workspaceId}/${accordianId}`);
      return;
    }
    router.push(`dashboard/${workspaceId}/${folderId}/${accordianId}`);
  };

  // double click handler
  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  // save on blur
  const handleBlur = async () => {
    setIsEditing(false);
    const fId = id?.split("folder");
    if (!fId.length) return;

    try {
      if (fId.length === 1) {
        if (!folderTitle) return;
        await updateFolder({ title }, fId[0]);
        return;
      }

      // if (fId.length === 2 && fId[1]) {
      //   if (!fileTitle) return;
      //   const { data, error } = await updateFile({ title: fileTitle }, fId[1]);
      //   if (error) {
      //     toast({
      //       title: 'Error',
      //       variant: 'destructive',
      //       description: 'Could not update the title for this file',
      //     });
      //   } else
      //     toast({
      //       title: 'Success',
      //       description: 'File title changed.',
      //     });
      // }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Folder Update Error",
        description: error.message,
      });
    }
  };

  // on changes
  const handleEmojiChange = async (emoji: EmojiClickData) => {
    if (!workspaceId) return;

    if (isFolder) {
      try {
        const { data, error } = await updateFolder({ iconId: emoji.emoji }, id);

        if (error) {
          toast({
            variant: "destructive",
            title: "Folder Update Error",
            description: error,
          });
          return;
        }

        dispatch({
          type: "UPDATE_FOLDER",
          payload: {
            workspaceId,
            folderId: id,
            folder: { iconId: emoji.emoji },
          },
        });

        toast({
          title: "Folder Updated!",
          description: "Folder updated successfully!",
        });
      } catch (error: any) {
        console.log("Folder Update Error:", error.message);
        toast({
          variant: "destructive",
          title: "Folder Update Error",
          description: error.message,
        });
      }
    }
  };

  const handleFolderTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fId = id?.split("folder");
    if (!fId.length || !workspaceId) return;

    if (fId.length === 1) {
      dispatch({
        type: "UPDATE_FOLDER",
        payload: {
          folder: { title },
          folderId: fId[0],
          workspaceId,
        },
      });
    }
  };

  const handleFileTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!workspaceId || !folderId) return;

    const fId = id?.split("folder");

    if (fId.length === 2 && fId[1]) {
      dispatch({
        type: "UPDATE_FILE",
        payload: {
          file: { title: event.target.value },
          folderId,
          workspaceId,
          fileId: fId[1],
        },
      });
    }
  };

  return (
    <Accordian.Item
      className={listStyles}
      value={id}
      onClick={(event) => {
        event.stopPropagation();
        handleNavigateToPage(id, listType);
      }}
    >
      <Accordian.Trigger
        className="
            hover:no-underline
            p-2
            dark:text-muted-foreground
            text-sm"
        id={listType}
        disabled={listType === "file"}
      >
        <div className={groupIdentifies}>
          <div
            className="
                flex 
                gap-4 
                items-center 
                justify-center 
                overflow-hidden"
          >
            <div className="relative">
              <EmojiPicker onEmojiClick={handleEmojiChange}>{iconId}</EmojiPicker>
            </div>

            <input
              className={clsx("outline-none overflow-hidden w-[140px] text-Neutrals/neutrals-7", {
                "bg-muted cursor-text": isEditing,
                "bg-transparent cursor-pointer": !isEditing,
              })}
              type="text"
              value={isFolder ? folderTitle : fileTitle}
              readOnly={!isEditing}
              onDoubleClick={handleDoubleClick}
              onBlur={handleBlur}
              onChange={isFolder ? handleFolderTitleChange : handleFileTitleChange}
            />
          </div>

          <div className={hoverStyles}>
            <CustomTooltip message="Delete file">
              <TrashIcon
                className="
                  hover:dark:text-white
                  dark:text-Neutrals/neutrals-7
                  transition-colors"
                size={15}
                onClick={moveToTrash}
              />
            </CustomTooltip>

            {isFolder && !isEditing && (
              <CustomTooltip message="Add file">
                <PlusIcon
                  className="
                    hover:dark:text-white
                    dark:text-Neutrals/neutrals-7 transition-colors"
                  size={15}
                  onClick={addNewFile}
                />
              </CustomTooltip>
            )}
          </div>
        </div>
      </Accordian.Trigger>
    </Accordian.Item>
  );
};

export default Dropdown;
