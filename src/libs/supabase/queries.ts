"use server";
import { and, eq, notExists } from "drizzle-orm";
import { validate as validateUUID } from "uuid";
import { collaborators, folders, users, workspaces } from "../../../migrations/schema";
import db from "./db";
import { FolderI, SubscriptionI, WorkspaceI } from "./supabase.types";

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

    return { data: null, error: null };
  } catch (error: any) {
    console.log("Create Workspace Error:", error.message);
    return { data: null, error: "Error" };
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
      workspaceOwner: workspaces.workspaceOwner,
      title: workspaces.title,
      iconId: workspaces.iconId,
      data: workspaces.data,
      inTrash: workspaces.inTrash,
      logo: workspaces.logo,
      createdAt: workspaces.createdAt,
    })
    .from(workspaces)
    .where(
      and(
        notExists(db.select().from(collaborators).where(eq(collaborators.workspaceId, workspaces.id))),
        eq(workspaces.id, userId)
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
