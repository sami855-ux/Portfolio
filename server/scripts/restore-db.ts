import fs from "node:fs"
import path from "node:path"
import crypto from "node:crypto"
import { db } from "../src/db.js"
import { logger } from "../src/utils/logger.js"

export async function restoreDatabaseBackup(backupFilePath: string) {
  if (!fs.existsSync(backupFilePath)) {
    throw new Error(`Backup file not found at path: ${backupFilePath}`)
  }

  logger.info(`Starting database restoration from: ${backupFilePath}`)
  const rawContent = fs.readFileSync(backupFilePath, "utf8")
  const parsed = JSON.parse(rawContent)

  if (!parsed.manifest || !parsed.data) {
    throw new Error("Invalid backup format: missing manifest or data payload")
  }

  // Verify checksum
  const computedChecksum = crypto.createHash("sha256").update(JSON.stringify(parsed.data)).digest("hex")
  if (computedChecksum !== parsed.manifest.checksum) {
    throw new Error("Backup integrity check failed: checksum mismatch! Data may be corrupted.")
  }

  logger.info("Backup checksum verified successfully. Beginning transactional restoration...")

  const {
    admins = [],
    profileSettings = [],
    skills = [],
    journeyItems = [],
    contactLinks = [],
    floatingCards = [],
    projects = [],
    messages = [],
  } = parsed.data

  // Restore within transaction
  await db.$transaction(async (tx) => {
    // 1. Admins
    for (const a of admins) {
      await tx.admin.upsert({
        where: { id: a.id },
        update: { email: a.email, passwordHash: a.passwordHash },
        create: { id: a.id, email: a.email, passwordHash: a.passwordHash },
      })
    }

    // 2. Profile
    for (const p of profileSettings) {
      const { createdAt: _c, updatedAt: _u, ...rest } = p
      await tx.profileSettings.upsert({
        where: { id: p.id },
        update: rest,
        create: { id: p.id, ...rest },
      })
    }

    // 3. Skills
    for (const s of skills) {
      const { createdAt: _c, updatedAt: _u, ...rest } = s
      await tx.skill.upsert({
        where: { id: s.id },
        update: rest,
        create: { id: s.id, ...rest },
      })
    }

    // 4. Journey
    for (const j of journeyItems) {
      const { createdAt: _c, updatedAt: _u, ...rest } = j
      await tx.journeyItem.upsert({
        where: { id: j.id },
        update: rest,
        create: { id: j.id, ...rest },
      })
    }

    // 5. Contact links
    for (const l of contactLinks) {
      const { createdAt: _c, updatedAt: _u, ...rest } = l
      await tx.contactLink.upsert({
        where: { id: l.id },
        update: rest,
        create: { id: l.id, ...rest },
      })
    }

    // 6. Floating cards
    for (const f of floatingCards) {
      const { createdAt: _c, updatedAt: _u, ...rest } = f
      await tx.floatingCard.upsert({
        where: { id: f.id },
        update: rest,
        create: { id: f.id, ...rest },
      })
    }

    // 7. Projects
    for (const pr of projects) {
      const { createdAt: _c, updatedAt: _u, ...rest } = pr
      await tx.project.upsert({
        where: { id: pr.id },
        update: rest,
        create: { id: pr.id, ...rest },
      })
    }

    // 8. Messages
    for (const m of messages) {
      const { createdAt: _c, ...rest } = m
      await tx.message.upsert({
        where: { id: m.id },
        update: rest,
        create: { id: m.id, ...rest },
      })
    }
  })

  logger.info("Database restoration completed successfully!")
}

if (process.argv[1]?.endsWith("restore-db.ts")) {
  const targetFile = process.argv[2]
  if (!targetFile) {
    console.error("Usage: tsx scripts/restore-db.ts <path-to-backup.json>")
    process.exit(1)
  }

  restoreDatabaseBackup(path.resolve(process.cwd(), targetFile))
    .then(() => {
      console.log("Restoration successful.")
      process.exit(0)
    })
    .catch((err) => {
      console.error("Restoration failed:", err)
      process.exit(1)
    })
    .finally(() => db.$disconnect())
}
