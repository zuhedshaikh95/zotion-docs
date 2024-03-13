import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as dotenv from "dotenv";
import * as schema from "../../../migrations/schema";
import { migrate } from "drizzle-orm/postgres-js/migrator";
dotenv.config({ path: ".env" });

if (!process.env.DATABASE_URL) {
  console.log("🔴 Cannot find env var DATABASE_URL url");
}

const client = postgres(process.env.DATABASE_URL!, { max: 1 });

const db = drizzle(client, { schema });

(async () => {
  console.log("🟠 Migrating client!");
  await migrate(db, { migrationsFolder: "migrations" });
  console.log("🟢 Successfully migrated!");
  try {
  } catch (error: any) {
    console.log("🔴 Migration Error:", error.message);
  }
})();

export default db;
