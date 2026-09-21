import { config } from "../config.js"

export type LogLevel = "debug" | "info" | "warn" | "error"

const SENSITIVE_KEYS = new Set([
  "password",
  "passwordhash",
  "token",
  "authorization",
  "cookie",
  "secret",
  "jwt_secret",
  "cloudinary_api_secret",
  "google_client_secret",
  "github_client_secret",
])

function maskSensitive(obj: unknown, depth = 0): unknown {
  if (depth > 5 || obj === null || obj === undefined) return obj
  if (typeof obj !== "object") return obj

  if (Array.isArray(obj)) {
    return obj.map((item) => maskSensitive(item, depth + 1))
  }

  const masked: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
    if (SENSITIVE_KEYS.has(key.toLowerCase())) {
      masked[key] = "[REDACTED]"
    } else if (typeof value === "object" && value !== null) {
      masked[key] = maskSensitive(value, depth + 1)
    } else {
      masked[key] = value
    }
  }
  return masked
}

class Logger {
  private formatLog(level: LogLevel, message: string, context?: Record<string, unknown>) {
    const timestamp = new Date().toISOString()
    const sanitizedContext = context ? (maskSensitive(context) as Record<string, unknown>) : undefined

    if (config.NODE_ENV === "production") {
      return JSON.stringify({
        timestamp,
        level,
        message,
        ...sanitizedContext,
      })
    }

    const levelColor = {
      debug: "\x1b[34m[DEBUG]\x1b[0m",
      info: "\x1b[32m[INFO]\x1b[0m",
      warn: "\x1b[33m[WARN]\x1b[0m",
      error: "\x1b[31m[ERROR]\x1b[0m",
    }[level]

    const ctxStr = sanitizedContext && Object.keys(sanitizedContext).length > 0
      ? ` ${JSON.stringify(sanitizedContext)}`
      : ""
    return `${timestamp} ${levelColor} ${message}${ctxStr}`
  }

  debug(message: string, context?: Record<string, unknown>) {
    if (config.NODE_ENV !== "production") {
      console.debug(this.formatLog("debug", message, context))
    }
  }

  info(message: string, context?: Record<string, unknown>) {
    console.info(this.formatLog("info", message, context))
  }

  warn(message: string, context?: Record<string, unknown>) {
    console.warn(this.formatLog("warn", message, context))
  }

  error(message: string, err?: unknown, context?: Record<string, unknown>) {
    const errorDetails: Record<string, unknown> = { ...context }
    if (err instanceof Error) {
      errorDetails.error = {
        name: err.name,
        message: err.message,
        stack: config.NODE_ENV === "production" ? err.stack?.split("\n").slice(0, 5).join("\n") : err.stack,
      }
    } else if (err) {
      errorDetails.error = String(err)
    }
    console.error(this.formatLog("error", message, errorDetails))
  }
}

export const logger = new Logger()
