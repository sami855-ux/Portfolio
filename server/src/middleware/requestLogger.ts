import type { Request, Response, NextFunction } from "express"
import crypto from "node:crypto"
import { logger } from "../utils/logger.js"

export interface RequestWithId extends Request {
  id?: string
  startTime?: number
}

export function requestLogger(req: RequestWithId, res: Response, next: NextFunction) {
  const reqId = (req.headers["x-request-id"] as string) || crypto.randomUUID()
  req.id = reqId
  req.startTime = Date.now()

  res.setHeader("x-request-id", reqId)

  res.on("finish", () => {
    const duration = req.startTime ? Date.now() - req.startTime : 0
    const statusCode = res.statusCode

    // Skip verbose logging of test health checks during test runs
    if (req.path === "/api/health" && process.env.NODE_ENV === "test") {
      return
    }

    const logData = {
      requestId: reqId,
      method: req.method,
      url: req.originalUrl || req.url,
      status: statusCode,
      durationMs: duration,
      ip: req.ip || req.socket.remoteAddress,
    }

    if (statusCode >= 500) {
      logger.error("HTTP Request Failed", undefined, logData)
    } else if (statusCode >= 400) {
      logger.warn("HTTP Client Warning", logData)
    } else {
      logger.info("HTTP Request Completed", logData)
    }
  })

  next()
}
