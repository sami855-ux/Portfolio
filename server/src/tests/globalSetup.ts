import { execSync } from "node:child_process"
import path from "node:path"
import bcrypt from "bcryptjs"
import { startEmbeddedPg, stopEmbeddedPg } from "../../scripts/pg-server.js"
import { PrismaClient } from "@prisma/client"

export const TEST_ADMIN_EMAIL = "admin.test@example.com"
export const TEST_ADMIN_PASSWORD = "testPassword123!"

export default async function globalSetup() {
  process.env.NODE_ENV = "test"
  process.env.PORT = "4001"
  process.env.SKIP_RATE_LIMIT = "false"
  process.env.JWT_SECRET = "super-secret-test-jwt-token-key-must-be-32-chars-long"

  const dbPort = 54329
  const dbName = "portfolio_test"
  const databaseUrl = `postgresql://postgres:postgres@localhost:${dbPort}/${dbName}?schema=public`
  process.env.DATABASE_URL = databaseUrl

  console.log(`\n[GlobalSetup] Starting real native PostgreSQL without Docker on port ${dbPort}...`)
  await startEmbeddedPg({
    port: dbPort,
    database: dbName,
    user: "postgres",
    password: "postgres",
  })

  // Wait until PostgreSQL port is accepting connections
  const net = await import("node:net")
  const startWait = Date.now()
  while (Date.now() - startWait < 10000) {
    try {
      await new Promise<void>((resolve, reject) => {
        const socket = net.createConnection({ host: "127.0.0.1", port: dbPort }, () => {
          socket.end()
          resolve()
        })
        socket.on("error", reject)
      })
      break
    } catch {
      await new Promise((r) => setTimeout(r, 250))
    }
  }
  await new Promise((r) => setTimeout(r, 600))

  console.log(`[GlobalSetup] PostgreSQL started. Applying Prisma migrations...`)

  const serverDir = path.resolve(__dirname, "../..")
  execSync("npx prisma migrate deploy", {
    cwd: serverDir,
    env: { ...process.env, DATABASE_URL: databaseUrl },
    stdio: "inherit",
  })
  console.log(`[GlobalSetup] Migrations applied. Seeding test admin...`)

  const db = new PrismaClient({
    datasources: { db: { url: databaseUrl } },
  })

  const passwordHash = await bcrypt.hash(TEST_ADMIN_PASSWORD, 10)
  await db.admin.upsert({
    where: { email: TEST_ADMIN_EMAIL },
    update: { passwordHash },
    create: {
      email: TEST_ADMIN_EMAIL,
      passwordHash,
    },
  })

  await db.profileSettings.upsert({
    where: { id: "00000000-0000-0000-0000-000000000001" },
    update: { email: TEST_ADMIN_EMAIL },
    create: {
      id: "00000000-0000-0000-0000-000000000001",
      fullName: "Test Samuel",
      heroTitle: "Test Full Stack Engineer",
      email: TEST_ADMIN_EMAIL,
      location: "Test Location",
    },
  })

  await db.$disconnect()
  console.log(`[GlobalSetup] Test database initialized and ready for integration tests!\n`)

  // Return teardown hook executed after all test files complete
  return async () => {
    console.log(`\n[GlobalSetup] Stopping PostgreSQL instance...`)
    await stopEmbeddedPg()
    console.log(`[GlobalSetup] PostgreSQL instance stopped cleanly.`)
  }
}
