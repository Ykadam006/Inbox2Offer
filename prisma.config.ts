import { defineConfig, env } from "prisma/config";

// Load .env.local for local development (Vercel injects env vars directly)
try {
  const { config } = await import("dotenv");
  const { expand } = await import("dotenv-expand");
  expand(config({ path: ".env.local" }));
  expand(config({ path: ".env" }));
} catch {
  // dotenv not available or files don't exist — env vars come from the host
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  engine: "classic",
  datasource: {
    url: env("DATABASE_URL"),
  },
});
