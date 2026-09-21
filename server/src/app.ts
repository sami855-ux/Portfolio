import express from "express"
import cors from "cors"
import helmet from "helmet"
import compression from "compression"
import rateLimit from "express-rate-limit"
import { config } from "./config.js"
import { authRouter } from "./routes/auth.js"
import { publicRouter } from "./routes/public.js"
import { adminRouter } from "./routes/admin.js"
import { uploadRouter } from "./routes/uploads.js"
import { healthRouter } from "./routes/health.js"
import { requestLogger } from "./middleware/requestLogger.js"
import { logger } from "./utils/logger.js"

import { isOriginAllowed } from "./utils/cors.js"

export const app = express()
app.set("trust proxy", 1)
app.disable("x-powered-by")
app.use(requestLogger)
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }))
app.use(
  cors({
    origin: (origin, done) => {
      if (isOriginAllowed(origin, config.corsOrigins, config.NODE_ENV)) {
        done(null, true)
      } else {
        logger.warn("CORS origin not allowed", {
          origin,
          allowedOrigins: config.corsOrigins,
        })
        done(null, false)
      }
    },
    credentials: false,
  })
)
app.use(compression())
app.use(express.json({ limit: "50mb" }))
app.use(express.urlencoded({ limit: "50mb", extended: true }))
app.use("/api", rateLimit({
  windowMs: 60_000,
  limit: process.env.NODE_ENV === "test" ? 1000 : 120,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  skip: () => process.env.SKIP_RATE_LIMIT === "true",
}))

app.use("/api/health", healthRouter)
app.get("/api/ready", (req, res, next) => {
  req.url = "/ready"
  healthRouter(req, res, next)
})
app.use("/api/auth", authRouter)
app.use("/api/public", publicRouter)
app.use("/api/admin", adminRouter)
app.use("/api/uploads", uploadRouter)
app.use((_, res) => res.status(404).json({ error: { message: "Route not found" } }))

app.use((error: any, req: express.Request, res: express.Response, _next: express.NextFunction) => {
  logger.error("Unhandled express error", error, {
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    origin: req.headers.origin,
  })

  if (error?.code === "LIMIT_FILE_SIZE") {
    return res.status(413).json({ error: { message: "Image must be 8 MB or smaller" } })
  }

  if (error?.code === "LIMIT_FILE_COUNT") {
    return res.status(400).json({ error: { message: "Too many files uploaded in a single request (maximum 20 files)" } })
  }

  if (error?.code === "LIMIT_UNEXPECTED_FILE") {
    return res.status(400).json({ error: { message: "Unexpected file field encountered in upload request" } })
  }

  const status = typeof error?.status === "number" ? error.status : 500
  const message = config.NODE_ENV === "production"
    ? "Unexpected server error"
    : (error?.message ?? "Unexpected server error")

  return res.status(status).json({ error: { message } })
})
