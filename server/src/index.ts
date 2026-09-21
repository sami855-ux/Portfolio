import { app } from "./app.js"
import { config } from "./config.js"
import { registerGracefulShutdown } from "./lifecycle.js"
import { logger } from "./utils/logger.js"

const server = app.listen(config.PORT, () => {
  logger.info(`Portfolio API listening on http://localhost:${config.PORT}`, {
    port: config.PORT,
    env: config.NODE_ENV,
  })
})

registerGracefulShutdown(server)

