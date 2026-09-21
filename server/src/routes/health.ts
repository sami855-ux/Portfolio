import { Router } from "express"
import { db } from "../db.js"
import { isShuttingDown } from "../lifecycle.js"

export const healthRouter = Router()

healthRouter.get("/", async (_req, res) => {
  return res.json({
    status: "ok",
    uptime: Math.round(process.uptime()),
    timestamp: new Date().toISOString(),
  })
})

healthRouter.get("/ready", async (_req, res) => {
  if (isShuttingDown()) {
    return res.status(503).json({
      status: "shutting_down",
      message: "Server is gracefully terminating",
      timestamp: new Date().toISOString(),
    })
  }

  const startTime = Date.now()
  try {
    // Run real database check
    await db.$queryRaw`SELECT 1`
    const latencyMs = Date.now() - startTime

    const mem = process.memoryUsage()
    return res.status(200).json({
      status: "ready",
      timestamp: new Date().toISOString(),
      uptime: Math.round(process.uptime()),
      database: {
        status: "connected",
        latencyMs,
      },
      memory: {
        rssMb: Math.round((mem.rss / (1024 * 1024)) * 100) / 100,
        heapUsedMb: Math.round((mem.heapUsed / (1024 * 1024)) * 100) / 100,
      },
    })
  } catch (err) {
    const latencyMs = Date.now() - startTime
    return res.status(503).json({
      status: "unhealthy",
      timestamp: new Date().toISOString(),
      uptime: Math.round(process.uptime()),
      database: {
        status: "disconnected",
        latencyMs,
        error: err instanceof Error ? err.message : "Database check failed",
      },
    })
  }
})
