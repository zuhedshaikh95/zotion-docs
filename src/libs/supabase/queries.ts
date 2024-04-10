"use server";
import { and, eq, ilike, notExists } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { validate as validateUUID } from "uuid";
import { collaborators, files, folders, users, workspaces } from "../../../migrations/schema";
import db from "./db";
import { FileI, FolderI, SubscriptionI, UserI, WorkspaceI } from "./supabase.types";

export const getUserSubscription = async (userId: string) => {
  try {
    const data = await db.query.subscriptions.findFirst({
      where: (subscription, { eq }) => eq(subscription.userId, userId),
    });

    return { data: data as SubscriptionI | null, error: null };
  } catch (error: any) {
    console.log("getUserSubscription Error:", error.message);
    return { data: null, error: error.message };
  }
};

export const createNewWorkspace = async (workspace: WorkspaceI) => {
  try {
    const response = await db.insert(workspaces).values(workspace);

    return { data: response, error: null };
  } catch (error: any) {
    console.log("Create Workspace Error:", error.message);
    return { data: null, error: error.message };
  }
};

export const getFolders = async (workspaceId: string) => {
  const isValidId = validateUUID(workspaceId);

  if (!isValidId) return { data: null, error: "Invalid ID" };

  try {
    const data: FolderI[] = await db
      .select()
      .from(folders)
      .orderBy(folders.createdAt)
      .where(eq(folders.workspaceId, workspaceId));

    return { data, error: null };
  } catch (error: any) {
    console.log("Folders Get Error:", error.message);
    return { data: [], error: error.message };
  }
};

export const getPrivateWorkspaces = async (userId: string) => {
  if (!userId) return [];

  const privateWorkspaces = (await db
    .select({
      id: workspaces.id,
      createdAt: workspaces.createdAt,
      workspaceOwner: workspaces.workspaceOwner,
      title: workspaces.title,
      iconId: workspaces.iconId,
      data: workspaces.data,
      inTrash: workspaces.inTrash,
      logo: workspaces.logo,
      bannerUrl: workspaces.bannerUrl,
    })
    .from(workspaces)
    .where(
      and(
        notExists(db.select().from(collaborators).where(eq(collaborators.workspaceId, workspaces.id))),
        eq(workspaces.workspaceOwner, userId)
      )
    )) as WorkspaceI[];

  return privateWorkspaces;
};

export const getCollaboratingWorkspaces = async (userId: string) => {
  if (!userId) return [];

  const collaboratedWorkspaces = (await db
    .select({
      id: workspaces.id,
      workspaceOwner: workspaces.workspaceOwner,
      title: workspaces.title,
      iconId: workspaces.iconId,
      data: workspaces.data,
      inTrash: workspaces.inTrash,
      logo: workspaces.logo,
      createdAt: workspaces.createdAt,
      bannerUrl: workspaces.bannerUrl,
    })
    .from(users)
    .innerJoin(collaborators, eq(users.id, collaborators.userId))
    .innerJoin(workspaces, eq(collaborators.workspaceId, workspaces.id))
    .where(eq(users.id, userId))) as WorkspaceI[];

  return collaboratedWorkspaces;
};

export const getSharedWorkspaces = async (userId: string) => {
  if (!userId) return [];

  const sharedWorkspaces = (await db
    .selectDistinct({
      id: workspaces.id,
      createdAt: workspaces.createdAt,
      workspaceOwner: workspaces.workspaceOwner,
      title: workspaces.title,
      iconId: workspaces.iconId,
      data: workspaces.data,
      inTrash: workspaces.inTrash,
      logo: workspaces.logo,
      bannerUrl: workspaces.bannerUrl,
    })
    .from(workspaces)
    .orderBy(workspaces.createdAt)
    .innerJoin(collaborators, eq(workspaces.id, collaborators.workspaceId))
    .where(eq(workspaces.workspaceOwner, userId))) as WorkspaceI[];

  return sharedWorkspaces;
};

export const getFiles = async (folderId: string) => {
  const isValidId = validateUUID(folderId);
  if (!isValidId) return { data: null, error: "Get Files Error" };

  try {
    const results = (await db.select().from(files).orderBy(files.createdAt).where(eq(files.folderId, folderId))) as
      | FileI[]
      | [];
    return { data: results, error: null };
  } catch (error: any) {
    return { data: null, error: "Get Files Error: " + error.messge };
  }
};

export const addCollaborators = async (users: UserI[], workspaceId: string) => {
  try {
    users.forEach(async (user) => {
      const userExists = await db.query.collaborators.findFirst({
        where: (dbUser, { eq, and }) => and(eq(dbUser.userId, user.id), eq(dbUser.workspaceId, workspaceId)),
      });

      if (!userExists) await db.insert(collaborators).values({ workspaceId, userId: user.id });
    });

    return { data: "Collaborators updated!", error: null };
  } catch (error: any) {
    return { data: null, error: error.message };
  }
};

export const searchUsers = async (email: string) => {
  try {
    if (!email) return [];

    const accounts = await db
      .select()
      .from(users)
      .where(ilike(users.email, `${email}%`));

    return accounts;
  } catch (error: any) {
    console.log("Search Error:", error.message);
    return [];
  }
};

export const createFolder = async (folder: FolderI) => {
  try {
    const result = await db.insert(folders).values(folder);
    return { data: result, error: false };
  } catch (error: any) {
    console.log("Folder Query Error:", error.message);
    return { data: null, error: error.message };
  }
};

export const createFile = async (file: FileI) => {
  try {
    const response = await db.insert(files).values(file);
    return { data: response, error: null };
  } catch (error: any) {
    console.log("File Create Action Error:", error.message);
    return { data: null, error: error.message };
  }
};

export const updateFolder = async (folder: Partial<FolderI>, folderId: string) => {
  try {
    await db.update(folders).set(folder).where(eq(folders.id, folderId));

    return { data: "Success", error: null };
  } catch (error: any) {
    console.log("Update Folder Error:", error.message);
    return { data: null, error: error.message };
  }
};

export const updateFile = async (file: Partial<FileI>, fileId: string) => {
  try {
    const response = await db.update(files).set(file).where(eq(files.id, fileId));

    return { data: response, error: null };
  } catch (error: any) {
    console.log("Update File Error:", error.message);
    return { data: null, error: error.message };
  }
};

export const updateWorkspace = async (workspace: Partial<WorkspaceI>, workspaceId: string) => {
  try {
    const response = await db.update(workspaces).set(workspace).where(eq(workspaces.id, workspaceId));

    revalidatePath(`/dashboard/${workspaceId}`);

    return { data: response, error: null };
  } catch (error: any) {
    console.log("Workspace Update Error:", error.message);
    return { data: null, error: error.message };
  }
};

export const removeCollaborators = async (users: UserI[], workspaceId: string) => {
  try {
    users.forEach(async (user) => {
      const userExists = await db.query.collaborators.findFirst({
        where: (dbUser, { eq, and }) => and(eq(dbUser.userId, user.id), eq(dbUser.workspaceId, workspaceId)),
      });

      if (userExists)
        await db
          .delete(collaborators)
          .where(and(eq(collaborators.workspaceId, workspaceId), eq(collaborators.userId, user.id)));
    });

    return { data: "Collaborators updated!", error: null };
  } catch (error: any) {
    console.log("Remove Collaborators Error:", error.message);
    return { data: null, error: error.message };
  }
};

export const deleteWorkspace = async (workspaceId: string) => {
  try {
    const response = await db.delete(workspaces).where(eq(workspaces.id, workspaceId));

    return { data: response, error: null };
  } catch (error: any) {
    console.log("Delete Workspace Error:", error.message);
    return { data: null, error: error.message };
  }
};

export const getWorkspaceDetails = async (workspaceId: string) => {
  const isValid = validateUUID(workspaceId);

  if (!isValid) return { data: null, error: "Invalid Id!" };

  try {
    const workspace: WorkspaceI | undefined = await db.query.workspaces.findFirst({
      where: (dbWorspace, { eq }) => eq(dbWorspace.id, workspaceId),
    });

    return { data: workspace, error: null };
  } catch (error: any) {
    console.log("Wokspace Create Error:", error.message);
    return { data: null, error: error.message };
  }
};

export const deleteFile = async (fileId: string) => {
  const isValidId = validateUUID(fileId);

  if (!isValidId) return { data: null, error: "Invalid Id!" };

  try {
    const response = await db.delete(files).where(eq(files.id, fileId));

    return { data: response, error: null };
  } catch (error: any) {
    console.log("File Delete Error:", error.message);
    return { data: null, error: error.message };
  }
};

export const deleteFolder = async (folderId: string) => {
  const isValidId = validateUUID(folderId);

  if (!isValidId) return { data: null, error: "Invalid Id!" };

  try {
    const response = await db.delete(folders).where(eq(folders.id, folderId));

    return { data: response, error: null };
  } catch (error: any) {
    console.log("Folder Delete Error:", error.message);
    return { data: null, error: error.message };
  }
};

export const getFolderDetails = async (folderId: string) => {
  const isValid = validateUUID(folderId);

  if (!isValid) return { data: null, error: "Invalid Id" };

  try {
    const response: FolderI | undefined = await db.query.folders.findFirst({
      where: (dbFolder, { eq }) => eq(dbFolder.id, folderId),
    });

    return { data: response, error: null };
  } catch (error: any) {
    console.log("Folder Details Error:", error.message);
    return { data: null, error: "Error" };
  }
};

export const getFileDetails = async (fileId: string) => {
  const isValidId = validateUUID(fileId);

  if (!isValidId) return { data: null, error: "Invalid Id!" };

  try {
    const response: FileI | undefined = await db.query.files.findFirst({
      where: (dbFile, { eq }) => eq(dbFile.id, fileId),
    });

    return { data: response, error: null };
  } catch (error: any) {
    console.log("File Details Error:", error.message);
    return { data: null, error: error.message };
  }
};
