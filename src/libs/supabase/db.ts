import * as dotenv from "dotenv";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import * as schema from "../../../migrations/schema";
dotenv.config({ path: ".env" });

if (!process.env.DATABASE_URL) {
  console.log("🔴 Cannot find env var DATABASE_URL url");
}

const client = postgres(process.env.DATABASE_URL!, { max: 1 });

const db = drizzle(client, { schema });

(async () => {
  console.log("🟠 Migrating client!");
  try {
    await migrate(db, { migrationsFolder: "migrations" });
    console.log("🟢 Successfully migrated!");
  } catch (error: any) {
    console.log("🔴 Migration Error:", error.message);
  }
})();

export default db;
