import { defineConfig } from "vitest/config"
import dotenv from "dotenv"
import path from "node:path"

dotenv.config({ path: path.resolve(__dirname, ".env") })

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    globalSetup: ["./src/tests/globalSetup.ts"],
    env: {
      NODE_ENV: "test",
      DATABASE_URL: "postgresql://postgres:postgres@localhost:54329/portfolio_test?schema=public",
      JWT_SECRET: "super-secret-test-jwt-token-key-must-be-32-chars-long",
      SKIP_RATE_LIMIT: "false",
      CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || "dxxovha85",
      CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY || "253875477551871",
      CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET || "WUyEAsjplIdnHM5QDvsYAEgc-Fw",
    },
    testTimeout: 45_000,
    hookTimeout: 45_000,
    fileParallelism: false,
    include: ["src/tests/**/*.test.ts"],
  },
})
