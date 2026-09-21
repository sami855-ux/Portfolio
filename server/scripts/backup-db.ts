import fs from "node:fs"
import path from "node:path"
import crypto from "node:crypto"
import { db } from "../src/db.js"
import { logger } from "../src/utils/logger.js"

interface BackupManifest {
  version: string
  timestamp: string
  checksum: string
  tables: Record<string, number>
}

interface BackupFile {
  manifest: BackupManifest
  data: Record<string, unknown[]>
}

export async function createDatabaseBackup(backupDir = path.resolve(process.cwd(), "backups")) {
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true })
  }

  logger.info("Starting automated database backup...")

  const timestamp = new Date().toISOString().replace(/[:.]/g, "-")
  const backupPath = path.join(backupDir, `backup-${timestamp}.json`)

  // Export all tables
  const [
    admins,
    projects,
    skills,
    journeyItems,
    contactLinks,
    floatingCards,
    messages,
    profileSettings,
  ] = await Promise.all([
    db.admin.findMany({ select: { id: true, email: true, passwordHash: true, createdAt: true, updatedAt: true } }),
    db.project.findMany(),
    db.skill.findMany(),
    db.journeyItem.findMany(),
    db.contactLink.findMany(),
    db.floatingCard.findMany(),
    db.message.findMany(),
    db.profileSettings.findMany(),
  ])

  const tablesData: Record<string, unknown[]> = {
    admins,
    projects,
    skills,
    journeyItems,
    contactLinks,
    floatingCards,
    messages,
    profileSettings,
  }

  const tableCounts = Object.fromEntries(
    Object.entries(tablesData).map(([key, list]) => [key, list.length])
  )

  const dataPayload = JSON.stringify(tablesData)
  const checksum = crypto.createHash("sha256").update(dataPayload).digest("hex")

  const backupContent: BackupFile = {
    manifest: {
      version: "1.0.0",
      timestamp: new Date().toISOString(),
      checksum,
      tables: tableCounts,
    },
    data: tablesData,
  }

  fs.writeFileSync(backupPath, JSON.stringify(backupContent, null, 2), "utf8")
  logger.info(`Database backup created successfully: ${backupPath}`, {
    tables: tableCounts,
    checksum,
  })

  // Retention cleanup: retain backups for last 30 days
  cleanOldBackups(backupDir, 30)

  return backupPath
}

function cleanOldBackups(backupDir: string, maxDays = 30) {
  try {
    const files = fs.readdirSync(backupDir).filter((f) => f.startsWith("backup-") && f.endsWith(".json"))
    const cutoff = Date.now() - maxDays * 24 * 60 * 60 * 1000

    for (const file of files) {
      const filePath = path.join(backupDir, file)
      const stats = fs.statSync(filePath)
      if (stats.mtimeMs < cutoff) {
        fs.unlinkSync(filePath)
        logger.info(`Pruned old backup file: ${file}`)
      }
    }
  } catch (err) {
    logger.warn("Failed to prune old backups", { error: String(err) })
  }
}

if (process.argv[1]?.endsWith("backup-db.ts")) {
  createDatabaseBackup()
    .then((filePath) => {
      console.log(`Backup completed: ${filePath}`)
      process.exit(0)
    })
    .catch((err) => {
      console.error("Backup failed:", err)
      process.exit(1)
    })
    .finally(() => db.$disconnect())
}
