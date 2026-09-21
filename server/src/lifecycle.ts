import type { Server } from "node:http"
import { db } from "./db.js"
import { logger } from "./utils/logger.js"

let shuttingDown = false

export function isShuttingDown(): boolean {
  return shuttingDown
}

export function registerGracefulShutdown(server: Server) {
  const shutdown = async (signal: string) => {
    if (shuttingDown) return
    shuttingDown = true

    logger.info(`Received ${signal}. Starting graceful shutdown...`)

    // Stop accepting new connections
    const closePromise = new Promise<void>((resolve, reject) => {
      server.close((err) => {
        if (err) {
          logger.error("Error closing HTTP server", err)
          reject(err)
        } else {
          logger.info("HTTP server closed to new connections")
          resolve()
        }
      })
    })

    // Force exit timeout after 10 seconds
    const timeout = setTimeout(() => {
      logger.error("Graceful shutdown timed out after 10s. Forcefully terminating process.")
      process.exit(1)
    }, 10_000)
    timeout.unref()

    try {
      await closePromise

      logger.info("Disconnecting database client...")
      await db.$disconnect()
      logger.info("Database connection closed successfully")

      clearTimeout(timeout)
      logger.info("Graceful shutdown completed successfully")
      process.exit(0)
    } catch (err) {
      logger.error("Error during graceful shutdown", err)
      process.exit(1)
    }
  }

  process.on("SIGTERM", () => shutdown("SIGTERM"))
  process.on("SIGINT", () => shutdown("SIGINT"))

  process.on("unhandledRejection", (reason) => {
    logger.error("Unhandled Promise Rejection", reason)
  })

  process.on("uncaughtException", (error) => {
    logger.error("Uncaught Exception", error)
    shutdown("uncaughtException")
  })
}
