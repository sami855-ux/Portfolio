import bcrypt from "bcryptjs"
import { PrismaClient } from "@prisma/client"

const db = new PrismaClient()

async function main() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase()
  const password = process.env.ADMIN_PASSWORD
  if (!email || !password || password.length < 10) {
    throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD (minimum 10 characters) are required")
  }

  const passwordHash = await bcrypt.hash(password, 12)
  await db.admin.upsert({ where: { email }, update: { passwordHash }, create: { email, passwordHash } })

  if (!(await db.profileSettings.findFirst())) {
    await db.profileSettings.create({
      data: {
        fullName: "Samuel Tale",
        heroTitle: "Full Stack Web and Mobile Developer",
        heroDescription: "Turning ideas into sleek, fast, and responsive websites for web and mobile.",
        aboutBio: "Full-stack developer building scalable web and mobile applications.",
        email,
        location: "Debre Berhan / Addis Ababa, Ethiopia",
      },
    })
  }
}

main().finally(() => db.$disconnect())
