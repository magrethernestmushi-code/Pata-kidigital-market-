import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

declare global {
  var __pgClient: ReturnType<typeof postgres> | undefined;
}

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  // Don't throw at import time during build steps that don't need the DB.
  console.warn(
    "DATABASE_URL is not set. Database calls will fail until it is configured."
  );
}

const client =
  global.__pgClient ??
  postgres(connectionString ?? "", {
    max: 10,
    ssl: connectionString?.includes("localhost") ? false : "require",
  });

if (process.env.NODE_ENV !== "production") {
  global.__pgClient = client;
}

export const db = drizzle(client, { schema });
