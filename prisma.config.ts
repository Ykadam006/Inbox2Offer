import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  engine: "classic",
  datasource: {
    // Use process.env directly (not Prisma's env() which throws if missing).
    // prisma generate doesn't connect to the DB, so a fallback is safe.
    url: process.env.DATABASE_URL ?? "postgresql://localhost/placeholder",
  },
});
