import { defineConfig } from "drizzle-kit";

export default defineConfig({
    schema: "./app/db/schema.server.ts",
    dialect: "sqlite",
    out: "./app/db/migrations",
    migrations: {
        prefix: "index"
    }
})