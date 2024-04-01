"use server";
import { and, eq, ilike, notExists } from "drizzle-orm";
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
    return { data: null, error: error.message };
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

export const updateFolder = async (folder: Partial<FolderI>, folderId: string) => {
  try {
    await db.update(folders).set(folder).where(eq(folders.id, folderId));

    return { data: "Success", error: null };
  } catch (error: any) {
    console.log("Update Folder Error:", error.message);
    return { data: null, error: error.message };
  }
};
