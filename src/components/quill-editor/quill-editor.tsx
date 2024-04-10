"use client";
import { TOOLBAR_OPTIONS } from "@/configs/quill-editor.config";
import { useAppState } from "@/libs/providers/app-state-provider";
import { deleteFile, deleteFolder, updateFile, updateFolder, updateWorkspace } from "@/libs/supabase/queries";
import { FileI, FolderI, WorkspaceI } from "@/libs/supabase/supabase.types";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Image from "next/image";
import { usePathname } from "next/navigation";
import type { Quill } from "quill";
import "quill/dist/quill.snow.css";
import React, { useCallback, useMemo, useState } from "react";
import { Avatar, Badge, BannerUpload, Button, EmojiPicker, Tooltip } from "../";
import { useToast } from "../ui/use-toast";
import { EmojiClickData } from "emoji-picker-react";
import { XCircleIcon } from "lucide-react";
import dynamic from "next/dynamic";

interface Props {
  dirDetails: FileI | FolderI | WorkspaceI;
  fileId: string;
  dirType: "workspace" | "folder" | "file";
}

const QuillEditor: React.FC<Props> = ({ dirDetails, dirType, fileId }) => {
  const supabase = createClientComponentClient();
  const pathName = usePathname();
  const { toast } = useToast();
  const { state, dispatch, workspaceId, folderId } = useAppState();
  const [quill, setQuill] = useState<Quill | null>(null);
  const [collaborators, setCollaborators] = useState<{ id: string; email: string; avatarUrl: string }[]>([
    { avatarUrl: "/avatars/5.png", email: "lassan", id: "1" },
    { avatarUrl: "/avatars/6.png", email: "lassan", id: "2" },
    { avatarUrl: "/avatars/7.png", email: "lassan", id: "3" },
  ]);
  const [saving, setSaving] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const breadCrumbs = useMemo(() => {
    if (!pathName || !state.workspaces || !workspaceId) return;
    const segments = pathName.split("/").filter((val) => val !== "dashboard" && val);
    const workspaceDetails = state.workspaces.find((workspace) => workspace.id === workspaceId);
    const workspaceBreadCrumb = workspaceDetails ? `${workspaceDetails.iconId} ${workspaceDetails.title}` : "";
    if (segments.length === 1) {
      return workspaceBreadCrumb;
    }

    const folderSegment = segments[1];
    const folderDetails = workspaceDetails?.folders.find((folder) => folder.id === folderSegment);
    const folderBreadCrumb = folderDetails ? `/ ${folderDetails.iconId} ${folderDetails.title}` : "";

    if (segments.length === 2) {
      return `${workspaceBreadCrumb} ${folderBreadCrumb}`;
    }

    const fileSegment = segments[2];
    const fileDetails = folderDetails?.files.find((file) => file.id === fileSegment);
    const fileBreadCrumb = fileDetails ? `/ ${fileDetails.iconId} ${fileDetails.title}` : "";

    return `${workspaceBreadCrumb} ${folderBreadCrumb} ${fileBreadCrumb}`;
  }, [state, pathName, workspaceId]);

  const details = useMemo(() => {
    let selectedDir;

    if (dirType === "file") {
      selectedDir = state.workspaces
        .find((workspace) => workspace.id === workspaceId)
        ?.folders.find((folder) => folder.id === folderId)
        ?.files.find((file) => file.id === fileId);
    }
    if (dirType === "folder") {
      selectedDir = state.workspaces
        .find((workspace) => workspace.id === workspaceId)
        ?.folders.find((folder) => folder.id === fileId);
    }
    if (dirType === "workspace") {
      selectedDir = state.workspaces.find((workspace) => workspace.id === workspaceId);
    }

    if (selectedDir) return selectedDir;

    return {
      title: dirDetails.title,
      iconId: dirDetails.iconId,
      createdAt: dirDetails.createdAt,
      data: dirDetails.data,
      inTrash: dirDetails.inTrash,
      bannerUrl: dirDetails.bannerUrl,
    } as WorkspaceI | FileI | FolderI;
  }, [state, workspaceId, folderId]);

  const wrapperRef = useCallback(async (wrapper: HTMLDivElement) => {
    if (typeof window !== "undefined") {
      if (wrapper === null) return;
      wrapper.innerHTML = "";

      const editor = document.createElement("div");
      wrapper.append(editor);

      const Quill = (await import("quill")).default;

      const q = new Quill(editor, {
        theme: "snow",
        modules: {
          toolbar: TOOLBAR_OPTIONS,
        },
      });

      setQuill(q);
    }
  }, []);

  const handleRestoreFile = async () => {
    if (!folderId || !workspaceId) return;

    if (dirType === "file") {
      const { error } = await updateFile({ inTrash: "" }, fileId);

      if (error) {
        toast({
          variant: "destructive",
          title: "File Restore Error",
          description: error,
        });
        return;
      }

      dispatch({
        type: "UPDATE_FILE",
        payload: { file: { inTrash: "" }, fileId, folderId, workspaceId },
      });

      toast({
        title: "File restored!",
        description: "File restored successfully!",
      });
    }

    if (dirType === "folder") {
      const { data, error } = await updateFolder({ inTrash: "" }, folderId);

      if (error) {
        toast({
          variant: "destructive",
          title: "Folder Restore Error",
          description: error,
        });
        return;
      }

      dispatch({
        type: "UPDATE_FOLDER",
        payload: { folder: { inTrash: "" }, folderId: fileId, workspaceId },
      });

      toast({
        title: "Folder Restored",
        description: "Folder restored successfully!",
      });
    }
  };

  const handleDeleteFile = async () => {
    if (!folderId || !workspaceId) return;

    if (dirType === "file") {
      const { error } = await deleteFile(fileId);

      if (error) {
        toast({
          variant: "destructive",
          title: "File Delete Error",
          description: error,
        });
        return;
      }

      dispatch({
        type: "DELETE_FILE",
        payload: { fileId, folderId, workspaceId },
      });

      toast({
        title: "File deleted!",
        description: "File deleted successfully!",
      });
    }

    if (dirType === "folder") {
      // WIP, when folder is deleted, delete files as well with client-server sync

      const { error } = await deleteFolder(folderId);

      if (error) {
        toast({
          variant: "destructive",
          title: "Folder Delete Error",
          description: error,
        });
        return;
      }

      dispatch({
        type: "DELETE_FOLDER",
        payload: { folderId, workspaceId },
      });

      toast({
        title: "Folder deleted",
        description: "Folder deleted successfully!",
      });
    }
  };

  const handleIconChange = async (emoji: EmojiClickData) => {
    if (!fileId) return;

    if (dirType === "workspace") {
      const { error } = await updateWorkspace({ iconId: emoji.emoji }, fileId);

      if (error) {
        toast({
          variant: "destructive",
          title: "Workspace Icon Error",
          description: error,
        });
        return;
      }

      dispatch({
        type: "UPDATE_WORKSPACE",
        payload: { workspace: { iconId: emoji.emoji }, workspaceId: fileId },
      });
    }

    if (dirType === "folder") {
      if (!workspaceId) return;

      const { error } = await updateFolder({ iconId: emoji.emoji }, fileId);

      if (error) {
        toast({
          variant: "destructive",
          title: "Folder Icon Error",
          description: error,
        });
        return;
      }

      dispatch({
        type: "UPDATE_FOLDER",
        payload: { folder: { iconId: emoji.emoji }, folderId: fileId, workspaceId },
      });
    }

    if (dirType === "file") {
      if (!folderId || !workspaceId) return;

      const { error } = await updateFile({ iconId: emoji.emoji }, fileId);

      if (error) {
        toast({
          variant: "destructive",
          title: "File Icon Error",
          description: error,
        });
        return;
      }

      dispatch({
        type: "UPDATE_FILE",
        payload: { file: { iconId: emoji.emoji }, fileId, folderId, workspaceId },
      });
    }
  };

  const handleRemoveBanner = async () => {
    if (!fileId || !workspaceId) return;

    setIsDeleting(true);

    try {
      const { error } = await supabase.storage.from("banners").remove([`banner-${fileId}`]);

      if (error) {
        toast({
          variant: "destructive",
          title: "Banner Remove Error",
          description: error.message,
        });
        return;
      }

      if (dirType === "file") {
        if (!folderId) return;

        await updateFile({ bannerUrl: "" }, fileId);

        dispatch({
          type: "UPDATE_FILE",
          payload: { file: { bannerUrl: "" }, fileId, folderId, workspaceId },
        });
      }

      if (dirType === "folder") {
        await updateFolder({ bannerUrl: "" }, fileId);

        dispatch({
          type: "UPDATE_FOLDER",
          payload: { folder: { bannerUrl: "" }, folderId: fileId, workspaceId },
        });
      }

      if (dirType === "workspace") {
        await updateWorkspace({ bannerUrl: "" }, fileId);

        dispatch({
          type: "UPDATE_WORKSPACE",
          payload: { workspace: { bannerUrl: "" }, workspaceId },
        });
      }
    } catch (error: any) {
      console.log("Banner Remove Error:", error.message);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      {/* Header */}
      <div className="relative">
        {details.inTrash && (
          <article
            className="
              py-2
              bg-[#EB5757]
              flex
              md:flex-row
              flex-col
              justify-center
              items-center
              gap-2
              flex-wrap"
          >
            <div
              className="
                flex
                flex-col
                md:flex-row
                gap-2
                justify-center
                items-center"
            >
              <span className="text-white">This {dirType} is in the trash.</span>
              <div className="space-x-4">
                <Button
                  className="
                  bg-transparent
                  border-white
                  text-white
                  hover:bg-white
                  hover:text-[#EB5757]"
                  size="sm"
                  variant="outline"
                  onClick={handleRestoreFile}
                >
                  Restore
                </Button>

                <Button
                  className="
                  bg-transparent
                  border-white
                  text-white
                  hover:bg-white
                  hover:text-[#EB5757]"
                  size="sm"
                  variant="outline"
                  onClick={handleDeleteFile}
                >
                  Delete
                </Button>
              </div>
            </div>
            <span className="text-sm text-white">{details.inTrash}</span>
          </article>
        )}

        <div
          className="
            flex
            flex-col-reverse
            p-8
            justify-center
            sm:items-center
            sm:justify-between
            sm:flex-row
            sm:p-2
            "
        >
          <div>{breadCrumbs}</div>
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center h-10">
              {collaborators.map((collaborator, index) => (
                <Tooltip.Provider key={collaborator.id}>
                  <Tooltip.Root>
                    <Tooltip.Trigger>
                      <Avatar.Root
                        className={`
                          -ml-3
                          bg-background
                          border-2
                          flex
                          items-center
                          justify-center
                          border-white
                          h-8
                          w-8
                          rounded-full`}
                      >
                        <Avatar.Image className="rounded-full" src={collaborator.avatarUrl} alt="avatar" />
                        <Avatar.Fallback>
                          <Image src="/placeholder.jpg" alt="avatar-fallback" fill />
                        </Avatar.Fallback>
                      </Avatar.Root>
                    </Tooltip.Trigger>

                    <Tooltip.Content>{collaborator.email}</Tooltip.Content>
                  </Tooltip.Root>
                </Tooltip.Provider>
              ))}
            </div>
            {saving ? (
              <Badge
                className="
                  bg-orange-600
                  top-4
                  text-white
                  right-4
                  z-50"
                variant="secondary"
              >
                Saving...
              </Badge>
            ) : (
              <Badge
                className="
                bg-emerald-600
                top-4
                text-white
                right-4
                z-50"
                variant="secondary"
              >
                Saved
              </Badge>
            )}
          </div>
        </div>
      </div>
      {/* Header */}

      {details.bannerUrl && (
        <div className="relative w-full h-[30vh]">
          <Image
            className="w-full md:h-[20vh] object-cover"
            src={supabase.storage.from("banners").getPublicUrl(details.bannerUrl).data.publicUrl}
            fetchPriority="high"
            alt="banner"
            fill
          />
        </div>
      )}

      <div
        className="
          flex
          justify-center
          items-center
          flex-col
          mt-2"
      >
        <div
          className="
            w-full
            self-center
            max-w-[800px]
            flex
            flex-col
            px-6
            lg:my-4"
        >
          <div className="text-7xl">
            <EmojiPicker onEmojiClick={handleIconChange}>
              <div
                className="
                  w-[100px]
                  cursor-pointer
                  transition-colors
                  h-[100px]
                  flex
                  items-center
                  justify-center
                  hover:bg-muted
                  rounded-xl"
              >
                {details.iconId}
              </div>
            </EmojiPicker>
          </div>
          <div className="flex">
            <BannerUpload
              details={details}
              id={fileId}
              dirType={dirType}
              className="
                mt-2
                text-sm
                text-muted-foreground
                p-2
                hover:text-card-foreground
                transition-all
                rounded-md"
            >
              {details.bannerUrl ? "Update Banner" : "Add Banner"}
            </BannerUpload>

            {details.bannerUrl && (
              <Button
                variant="ghost"
                className="
                  flex
                  gap-2
                  items-center
                  mt-2
                  text-sm
                  text-muted-foreground
                  w-36
                  p-2
                  rounded-md
                  hover:bg-background"
                onClick={handleRemoveBanner}
                disabled={isDeleting}
              >
                <XCircleIcon size={16} />
                <span className="whitespace-nowrap font-normal">Remove Banner</span>
              </Button>
            )}
          </div>

          <span
            className="
              text-muted-foreground
              text-3xl
              font-bold
              h-9"
          >
            {details.title}
          </span>

          <span className="text-muted-foreground text-sm">{dirType.toUpperCase()}</span>
        </div>
        <div className="max-w-[800px]" id="container" ref={wrapperRef}></div>
      </div>
    </>
  );
};

export default QuillEditor;
