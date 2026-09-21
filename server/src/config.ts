import path from "path"
import { fileURLToPath } from "url"
import dotenv from "dotenv"
import { z } from "zod"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.resolve(__dirname, "../.env") })
dotenv.config()

const nodeEnv = process.env.NODE_ENV ?? "development"
const developmentDefaults = nodeEnv === "production" ? {} : {
  DATABASE_URL: "postgresql://postgres:postgres@localhost:5432/portfolio?schema=public",
  JWT_SECRET: "local-development-secret-change-before-production",
}

const schema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(4000),
  DATABASE_URL: z.string().min(1),
  JWT_SECRET: z.string().min(32),
  CORS_ORIGINS: z.string().default("http://localhost:5173"),
  CLIENT_URL: z.string().url().default("http://localhost:5173"),
  PUBLIC_API_URL: z.string().url().default("http://localhost:4000/api"),
  CLOUDINARY_CLOUD_NAME: z.string().default(""),
  CLOUDINARY_API_KEY: z.string().default(""),
  CLOUDINARY_API_SECRET: z.string().default(""),
  GOOGLE_CLIENT_ID: z.string().default(""),
  GOOGLE_CLIENT_SECRET: z.string().default(""),
  GITHUB_CLIENT_ID: z.string().default(""),
  GITHUB_CLIENT_SECRET: z.string().default(""),
}).superRefine((env, ctx) => {
  for (const [idKey, secretKey] of [["GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_SECRET"], ["GITHUB_CLIENT_ID", "GITHUB_CLIENT_SECRET"]] as const) {
    if (Boolean(env[idKey]) !== Boolean(env[secretKey])) {
      ctx.addIssue({ code: "custom", path: [idKey], message: `${idKey} and ${secretKey} must be configured together` })
    }
  }
  if (env.NODE_ENV === "production") {
    for (const key of ["CLOUDINARY_CLOUD_NAME", "CLOUDINARY_API_KEY", "CLOUDINARY_API_SECRET"] as const) {
      if (!env[key]) ctx.addIssue({ code: "custom", path: [key], message: `${key} is required in production` })
    }
  }
})

const parsed = schema.safeParse({ ...developmentDefaults, ...process.env })
if (!parsed.success) {
  throw new Error(`Invalid server environment: ${parsed.error.issues.map((issue) => issue.path.join(".")).join(", ")}`)
}

export const config = {
  ...parsed.data,
  corsOrigins: parsed.data.CORS_ORIGINS.split(",").map((origin) => origin.trim()).filter(Boolean),
  cloudinaryConfigured: Boolean(parsed.data.CLOUDINARY_CLOUD_NAME && parsed.data.CLOUDINARY_API_KEY && parsed.data.CLOUDINARY_API_SECRET),
}
