"use client";
import { TOOLBAR_OPTIONS } from "@/configs/quill-editor.config";
import { useAppState } from "@/libs/providers/app-state-provider";
import { useAuth } from "@/libs/providers/auth-provider";
import { useSocket } from "@/libs/providers/socket-provider";
import {
  deleteFile,
  deleteFolder,
  getFileDetails,
  getFolderDetails,
  getUser,
  getWorkspaceDetails,
  updateFile,
  updateFolder,
  updateWorkspace,
} from "@/libs/supabase/queries";
import { CollaboratorI, FileI, FolderI, WorkspaceI } from "@/libs/supabase/supabase.types";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { EmojiClickData } from "emoji-picker-react";
import { XCircleIcon } from "lucide-react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import type { Quill } from "quill";
import "quill/dist/quill.snow.css";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Avatar, Badge, BannerUpload, Button, EmojiPicker, Tooltip } from "../";
import { useToast } from "../ui/use-toast";

interface Props {
  dirDetails: FileI | FolderI | WorkspaceI;
  fileId: string;
  dirType: "workspace" | "folder" | "file";
}

const QuillEditor: React.FC<Props> = ({ dirDetails, dirType, fileId }) => {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const pathName = usePathname();
  const { toast } = useToast();
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { user } = useAuth();
  const { socket, isConnected } = useSocket();
  const { state, dispatch, workspaceId, folderId } = useAppState();
  const [quill, setQuill] = useState<Quill | null>(null);
  const [collaborators, setCollaborators] = useState<{ id: string; email: string; avatarUrl: string }[]>([]);
  const [saving, setSaving] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [localCursors, setLocalCursors] = useState<any[]>([]);

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

  // update and sync server client states
  useEffect(() => {
    (async () => {
      if (!workspaceId || !fileId || quill === null) return;

      if (dirType === "file") {
        const { data: fileData, error: fileError } = await getFileDetails(fileId);

        if (fileError || !fileData) {
          return router.replace(`/dashboard/${workspaceId}`);
        }

        quill.setContents(JSON.parse(`${fileData.data}`));

        dispatch({
          type: "UPDATE_FILE",
          payload: { file: { data: fileData.data }, fileId, folderId: fileData.folderId, workspaceId },
        });
      }

      if (dirType === "folder") {
        const { data: folderData, error: folderError } = await getFolderDetails(fileId);

        if (folderError || !folderData) {
          return router.replace(`/dashboard/${workspaceId}`);
        }

        quill.setContents(JSON.parse(`${folderData.data}`));

        dispatch({
          type: "UPDATE_FOLDER",
          payload: { folder: { data: folderData.data }, folderId: fileId, workspaceId },
        });
      }

      if (dirType === "workspace") {
        const { data: workspaceData, error: workspaceError } = await getWorkspaceDetails(fileId);

        if (workspaceError || !workspaceData) {
          return router.replace("/dashboard");
        }

        quill.setContents(JSON.parse(`${workspaceData.data}`));

        dispatch({
          type: "UPDATE_WORKSPACE",
          payload: { workspace: { data: workspaceData.data }, workspaceId: fileId },
        });
      }
    })();
  }, [fileId, workspaceId, quill, dirType]);

  // create/join room
  useEffect(() => {
    if (socket === null || quill === null || !fileId) return;

    socket.emit("create-room", fileId);
  }, [socket, quill, fileId]);

  // send quill changes to all clients
  useEffect(() => {
    if (quill === null || socket === null || !fileId || !user) return;

    // cursor updates
    const selectionChangeHandler = (cursorId: string) => {
      return (range: any, prevRange: any, source: any) => {
        if (source === "user" && cursorId) {
          socket.emit("send-cursor-move", range, fileId, cursorId);
        }
      };
    };

    // quill change
    const quillChangeHandler = (delta: any, prevDelta: any, source: any) => {
      if (source !== "user") return;

      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);

      setSaving(true);
      const contents = quill.getContents();

      saveTimerRef.current = setTimeout(async () => {
        if (fileId) {
          if (dirType == "workspace") {
            await updateWorkspace({ data: JSON.stringify(contents) }, fileId);

            dispatch({
              type: "UPDATE_WORKSPACE",
              payload: { workspace: { data: JSON.stringify(contents) }, workspaceId: fileId },
            });
          }
          if (dirType == "folder") {
            if (!workspaceId) return;

            await updateFolder({ data: JSON.stringify(contents) }, fileId);

            dispatch({
              type: "UPDATE_FOLDER",
              payload: { folder: { data: JSON.stringify(contents) }, workspaceId, folderId: fileId },
            });
          }
          if (dirType == "file") {
            if (!workspaceId || !folderId) return;

            await updateFile({ data: JSON.stringify(contents) }, fileId);

            dispatch({
              type: "UPDATE_FILE",
              payload: { file: { data: JSON.stringify(contents) }, workspaceId, folderId: folderId, fileId },
            });
          }
        }
        setSaving(false);
      }, 850);

      socket.emit("send-changes", delta, fileId);
    };

    quill.on("text-change", quillChangeHandler);
    quill.on("selection-change", selectionChangeHandler(user.id));

    return () => {
      quill.off("text-change", quillChangeHandler);
      quill.off("selection-change", selectionChangeHandler(user.id));

      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, [quill, socket, fileId, user, details, workspaceId, dispatch, folderId]);

  // receive quill changes from server
  useEffect(() => {
    if (quill === null || socket === null) return;

    const socketHandler = (deltas: any, id: string) => {
      if (id === fileId) {
        quill.updateContents(deltas);
      }
    };

    socket.on("receive-changes", socketHandler);

    return () => {
      socket.off("receive-changes", socketHandler);
    };
  }, [quill, socket, fileId]);

  useEffect(() => {
    if (quill === null || socket === null || !fileId || !localCursors.length) return;

    const socketHandler = (range: any, roomId: string, cursorId: string) => {
      if (roomId === fileId) {
        const cursorToMove = localCursors.find((c: any) => c.cursors()?.[0].id === cursorId);
        if (cursorToMove) {
          cursorToMove.moveCursor(cursorId, range);
        }
      }
    };

    socket.on("receive-cursor-move", socketHandler);

    return () => {
      socket.off("receive-cursor-move", socketHandler);
    };
  }, [quill, socket, fileId, localCursors]);

  useEffect(() => {
    if (!fileId || quill === null) return;

    const room = supabase.channel(fileId);

    const subscription = room
      .on("presence", { event: "sync" }, () => {
        const newState = room.presenceState();
        const newCollaborators = Object.values(newState).flat() as any;
        setCollaborators(newCollaborators);

        if (user) {
          const allCursors: any = [];
          newCollaborators.forEach((collaborator: { id: string; email: string; avatar: string }) => {
            if (collaborator.id !== user.id) {
              const userCursor = quill.getModule("cursors");
              userCursor.createCursor(
                collaborator.id,
                collaborator.email.split("@")[0].slice(0, 2).toUpperCase(),
                `#${Math.random().toString().slice(2, 8)}`
              );
              allCursors.push(userCursor);
            }
          });

          setLocalCursors(allCursors);
        }
      })
      .subscribe(async (status) => {
        if (status !== "SUBSCRIBED" || !user) return;
        const { data, error } = await getUser(user.id);
        if (error) return;

        room.track({
          id: user.id,
          email: user.email?.split("@")[0].slice(0, 2).toUpperCase(),
          avatarUrl: data?.avatarUrl
            ? supabase.storage.from("avatars").getPublicUrl(data.avatarUrl).data.publicUrl
            : "",
        });
      });

    return () => {
      supabase.removeChannel(room);
    };
  }, [quill, fileId, supabase, user]);

  const wrapperRef = useCallback(async (wrapper: HTMLDivElement) => {
    if (typeof window !== "undefined") {
      if (wrapper === null) return;
      wrapper.innerHTML = "";

      const editor = document.createElement("div");
      wrapper.append(editor);

      const Quill = (await import("quill")).default;
      const QuillCursors = (await import("quill-cursors")).default;

      Quill.register("modules/cursors", QuillCursors);

      const q = new Quill(editor, {
        theme: "snow",
        modules: {
          toolbar: TOOLBAR_OPTIONS,
          cursors: {
            transformOnTextChange: true,
          },
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

      router.replace(`/dashboard/${workspaceId}`);
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

      router.replace(`/dashboard/${workspaceId}`);
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
