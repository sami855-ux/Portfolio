import path from "node:path"
import os from "node:os"
import fs from "node:fs"
import pgModule from "embedded-postgres"

const EmbeddedPostgres = (pgModule as any).default || pgModule

let pgInstance: any = null

export interface PgServerOptions {
  port?: number
  user?: string
  password?: string
  database?: string
  dataDir?: string
}

export function getDefaultPgOptions(): Required<PgServerOptions> {
  const port = parseInt(process.env.TEST_DB_PORT || "54329", 10)
  const user = process.env.TEST_DB_USER || "postgres"
  const password = process.env.TEST_DB_PASSWORD || "postgres"
  const database = process.env.TEST_DB_NAME || "portfolio_test"
  const dataDir = process.env.TEST_DB_DATA_DIR || path.join(os.homedir(), ".portfolio-test-pgdata")

  return { port, user, password, database, dataDir }
}

export async function startEmbeddedPg(options: PgServerOptions = {}) {
  const opts = { ...getDefaultPgOptions(), ...options }

  if (!fs.existsSync(opts.dataDir)) {
    fs.mkdirSync(opts.dataDir, { recursive: true })
  }

  pgInstance = new EmbeddedPostgres({
    port: opts.port,
    databaseDir: opts.dataDir,
    user: opts.user,
    password: opts.password,
  })

  // Only initialise if PG_VERSION does not already exist
  const isInitialised = fs.existsSync(path.join(opts.dataDir, "PG_VERSION"))
  if (!isInitialised) {
    await pgInstance.initialise()
  }

  await pgInstance.start()

  // Ensure database exists
  try {
    await pgInstance.createDatabase(opts.database)
  } catch (err: any) {
    // If database already exists, ignore error
    if (!err?.message?.includes("already exists")) {
      // Non-fatal or already created
    }
  }

  const databaseUrl = `postgresql://${opts.user}:${opts.password}@localhost:${opts.port}/${opts.database}?schema=public`
  return {
    databaseUrl,
    stop: async () => {
      if (pgInstance) {
        await pgInstance.stop()
        pgInstance = null
      }
    },
  }
}

export async function stopEmbeddedPg() {
  if (pgInstance) {
    await pgInstance.stop()
    pgInstance = null
  }
}

// CLI runner if invoked directly
if (process.argv[1]?.endsWith("pg-server.ts")) {
  const { port, user, password, database } = getDefaultPgOptions()
  console.log(`Starting real PostgreSQL without Docker on port ${port}...`)
  startEmbeddedPg()
    .then(({ databaseUrl }) => {
      console.log(`PostgreSQL is running!\nDATABASE_URL=${databaseUrl}`)
      console.log("Press Ctrl+C to stop.")
    })
    .catch((err) => {
      console.error("Failed to start PostgreSQL:", err)
      process.exit(1)
    })
}
