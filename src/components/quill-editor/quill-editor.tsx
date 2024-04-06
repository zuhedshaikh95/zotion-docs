"use client";
import { TOOLBAR_OPTIONS } from "@/configs/quill-editor.config";
import { useAppState } from "@/libs/providers/app-state-provider";
import { deleteFile, deleteFolder, updateFile, updateFolder } from "@/libs/supabase/queries";
import { FileI, FolderI, WorkspaceI } from "@/libs/supabase/supabase.types";
import type { Quill } from "quill";
import React, { useCallback, useMemo, useState } from "react";
import { Button } from "../";
import { useToast } from "../ui/use-toast";
import "quill/dist/quill.snow.css";
import { usePathname, useRouter } from "next/navigation";

interface Props {
  dirDetails: FileI | FolderI | WorkspaceI;
  fileId: string;
  dirType: "workspace" | "folder" | "file";
}

const QuillEditor: React.FC<Props> = ({ dirDetails, dirType, fileId }) => {
  const pathName = usePathname();
  const { toast } = useToast();
  const { state, dispatch, workspaceId, folderId } = useAppState();
  const [quill, setQuill] = useState<Quill | null>(null);

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

  return (
    <>
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
              gap-4
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
        </div>
      </div>
      <div
        className="
          flex
          justify-center
          items-center
          flex-col
          mt-2"
      >
        <div className="max-w-[800px]" id="container" ref={wrapperRef}></div>
      </div>
    </>
  );
};

export default QuillEditor;
