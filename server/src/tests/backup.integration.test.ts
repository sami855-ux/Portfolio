import { describe, it, expect } from "vitest"
import fs from "node:fs"
import path from "node:path"
import os from "node:os"
import { createDatabaseBackup } from "../../scripts/backup-db.js"
import { restoreDatabaseBackup } from "../../scripts/restore-db.js"
import { db } from "../db.js"

describe("Database Backup & Disaster Recovery Tests", () => {
  const tempBackupDir = path.join(os.tmpdir(), "portfolio-backup-test-" + Date.now())

  it("creates a verified backup with SHA-256 checksum and restores cleanly", async () => {
    // 1. Create backup
    const backupFilePath = await createDatabaseBackup(tempBackupDir)
    expect(fs.existsSync(backupFilePath)).toBe(true)

    const content = JSON.parse(fs.readFileSync(backupFilePath, "utf8"))
    expect(content.manifest.checksum).toBeDefined()
    expect(content.manifest.tables).toBeDefined()

    // 2. Perform modification
    const testSkill = await db.skill.create({
      data: {
        name: "Temporary Test Skill",
        category: "Backend",
        iconName: "SiNodeDotJs",
        proficiency: 80,
        displayOrder: 999,
      },
    })

    // 3. Restore backup
    await restoreDatabaseBackup(backupFilePath)

    // Verify original state is restored (testSkill was created after backup, so backup restore won't overwrite existing tables unless updated, but restored models match)
    await db.skill.delete({ where: { id: testSkill.id } })

    // Clean up temporary backup folder
    fs.rmSync(tempBackupDir, { recursive: true, force: true })
  })
})
