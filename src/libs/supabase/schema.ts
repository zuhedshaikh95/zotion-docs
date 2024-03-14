import { pgTable, uuid, timestamp, text } from "drizzle-orm/pg-core";

export const Workspaces = pgTable("workspaces", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  workspaceOwner: uuid("workspace_owner").notNull(),
  title: text("title").notNull(),
  iconId: text("icon_id").notNull(),
  data: text("data"),
  inTrash: text("in_trash"),
  logo: text("logo"),
  bannerUrl: text("banner_url"),
  createdAt: timestamp("created_at", { mode: "string", withTimezone: true }).defaultNow(),
});

export const Folders = pgTable("folders", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  workspaceId: uuid("workspace_id").references(() => Workspaces.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  iconId: text("icon_id").notNull(),
  data: text("data"),
  inTrash: text("in_trash"),
  logo: text("logo"),
  bannerUrl: text("banner_url"),
  createdAt: timestamp("created_at", { mode: "string", withTimezone: true }).defaultNow(),
});

export const Files = pgTable("files", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  workspaceId: uuid("workspace_id").references(() => Workspaces.id, { onDelete: "cascade" }),
  folderId: uuid("folder_id").references(() => Folders.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  iconId: text("icon_id").notNull(),
  data: text("data"),
  inTrash: text("in_trash"),
  logo: text("logo"),
  bannerUrl: text("banner_url"),
  createdAt: timestamp("created_at", { mode: "string", withTimezone: true }).defaultNow(),
});
