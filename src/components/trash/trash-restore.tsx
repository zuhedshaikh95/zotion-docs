"use client";
import { useAppState, appFoldersType } from "@/libs/providers/app-state-provider";
import { FileI } from "@/libs/supabase/supabase.types";
import { FileIcon, Folder } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";

interface Props {}

const TrashRestore: React.FC<Props> = ({}) => {
  const { state, dispatch, workspaceId, folderId } = useAppState();
  const [folders, setFolders] = useState<appFoldersType[]>([]);
  const [files, setFiles] = useState<FileI[]>([]);

  useEffect(() => {
    if (!workspaceId) return;

    const stateFolders =
      state.workspaces.find((workspace) => workspace.id === workspaceId)?.folders.filter((folder) => folder.inTrash) ||
      [];
    setFolders(stateFolders);

    let stateFiles: FileI[] = [];
    state.workspaces
      .find((workspace) => workspace.id === workspaceId)
      ?.folders.forEach((folder) => {
        folder.files.forEach((file) => {
          if (file.inTrash) {
            stateFiles.push(file);
          }
        });
      });

    setFiles(stateFiles);
  }, [state, workspaceId]);

  return (
    <section>
      {!!folders.length && (
        <>
          <h3>Folders</h3>
          {folders.map((folder) => (
            <Link
              key={folder.id}
              className="
                hover:bg-muted
                rounded-md
                p-2
                flex
                items-center
                justify-between"
              href={`/dashboard/${folder.workspaceId}/${folder.id}`}
            >
              <article>
                <aside className="flex items-center gap-2">
                  <Folder />
                  {folder.title}
                </aside>
              </article>
            </Link>
          ))}
        </>
      )}

      {!!files.length && (
        <>
          <h3>Files</h3>
          {files.map((file) => (
            <Link
              key={file.id}
              className="hover:bg-muted rounded-md p-2 flex items-center justify-between"
              href={`/dashboard/${file.workspaceId}/${file.folderId}/${file.id}`}
            >
              <article>
                <aside className="flex items-center gap-2">
                  <FileIcon />
                  {file.title}
                </aside>
              </article>
            </Link>
          ))}
        </>
      )}

      {!files.length && !folders.length && (
        <p
          className="
            text-muted-foreground
            absolute
            top-[50%]
            left-[50%]
            transform
            -translate-x-1/2
            -translate-y-1/2"
        >
          No Items in trash
        </p>
      )}
    </section>
  );
};

export default TrashRestore;
