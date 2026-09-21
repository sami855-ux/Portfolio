export function isOriginAllowed(
  origin: string | undefined,
  allowedOrigins: string[],
  nodeEnv: string = process.env.NODE_ENV ?? "development"
): boolean {
  // Allow requests with no origin (such as mobile apps, curl, or server-to-server)
  if (!origin) return true

  const normalizedOrigin = origin.trim().replace(/\/+$/, "")

  // Global wildcard allows all
  if (allowedOrigins.includes("*")) {
    return true
  }

  // Check against configured origins (with wildcard pattern support)
  for (const pattern of allowedOrigins) {
    if (pattern === normalizedOrigin) {
      return true
    }
    if (pattern.includes("*")) {
      const regexPattern = `^${pattern.replace(/[.+?^${}()|[\]\\]/g, "\\$&").replace(/\*/g, ".*")}$`
      if (new RegExp(regexPattern).test(normalizedOrigin)) {
        return true
      }
    }
  }

  // In non-production environments (development & test), automatically allow all localhost & 127.0.0.1 origins
  if (nodeEnv !== "production") {
    const isLocalhost = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(normalizedOrigin)
    if (isLocalhost) {
      return true
    }
  }

  return false
}
