import { pgTable, uuid, timestamp, text, jsonb, integer, boolean } from "drizzle-orm/pg-core";
import { prices, subscriptionStatus, users } from "../../../migrations/schema";

export const Workspaces = pgTable("workspaces", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  workspaceOwner: uuid("workspace_owner").notNull(),
  title: text("title").notNull(),
  iconId: text("icon_id").notNull(),
  data: text("data"),
  inTrash: text("in_trash"),
  logo: text("logo"),
  bannerUrl: text("banner_url"),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" }).defaultNow().notNull(),
});

export const Folders = pgTable("folders", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  workspaceId: uuid("workspace_id")
    .notNull()
    .references(() => Workspaces.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  iconId: text("icon_id").notNull(),
  data: text("data"),
  inTrash: text("in_trash"),
  logo: text("logo"),
  bannerUrl: text("banner_url"),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" }).defaultNow().notNull(),
});

export const Files = pgTable("files", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  workspaceId: uuid("workspace_id")
    .notNull()
    .references(() => Workspaces.id, { onDelete: "cascade" }),
  folderId: uuid("folder_id")
    .notNull()
    .references(() => Folders.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  iconId: text("icon_id").notNull(),
  data: text("data"),
  inTrash: text("in_trash"),
  logo: text("logo"),
  bannerUrl: text("banner_url"),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" }).defaultNow().notNull(),
});

export const subscriptions = pgTable("subscriptions", {
  id: text("id").primaryKey().notNull(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id),
  status: subscriptionStatus("status"),
  metadata: jsonb("metadata"),
  priceId: text("price_id").references(() => prices.id),
  quantity: integer("quantity"),
  cancelAtPeriodEnd: boolean("cancel_at_period_end"),
  created: timestamp("created", { withTimezone: true, mode: "string" }).defaultNow().notNull(),
  currentPeriodStart: timestamp("current_period_start", { withTimezone: true, mode: "string" }).defaultNow().notNull(),
  currentPeriodEnd: timestamp("current_period_end", { withTimezone: true, mode: "string" }).defaultNow().notNull(),
  endedAt: timestamp("ended_at", { withTimezone: true, mode: "string" }).defaultNow(),
  cancelAt: timestamp("cancel_at", { withTimezone: true, mode: "string" }).defaultNow(),
  canceledAt: timestamp("canceled_at", { withTimezone: true, mode: "string" }).defaultNow(),
  trialStart: timestamp("trial_start", { withTimezone: true, mode: "string" }).defaultNow(),
  trialEnd: timestamp("trial_end", { withTimezone: true, mode: "string" }).defaultNow(),
});
