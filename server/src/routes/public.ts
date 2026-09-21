import { Router } from "express"
import rateLimit from "express-rate-limit"
import { db } from "../db.js"
import { contactMessageSchema } from "../validation.js"
import { keysToSnake } from "../utils/records.js"

export const publicRouter = Router()

publicRouter.use((_, res, next) => {
  res.setHeader("Cache-Control", "public, max-age=60, stale-while-revalidate=300")
  next()
})

publicRouter.get("/projects", async (_, res) => res.json({ data: keysToSnake(await db.project.findMany({ orderBy: { createdAt: "desc" } })) }))
publicRouter.get("/skills", async (_, res) => res.json({ data: keysToSnake(await db.skill.findMany({ orderBy: { displayOrder: "asc" } })) }))
publicRouter.get("/journey", async (_, res) => res.json({ data: keysToSnake(await db.journeyItem.findMany({ orderBy: { displayOrder: "asc" } })) }))
publicRouter.get("/contact-links", async (_, res) => res.json({ data: keysToSnake(await db.contactLink.findMany({ where: { isActive: true }, orderBy: { displayOrder: "asc" } })) }))
publicRouter.get("/floating-cards", async (_, res) => res.json({ data: keysToSnake(await db.floatingCard.findMany({ where: { isActive: true }, orderBy: { displayOrder: "asc" } })) }))
publicRouter.get("/profile", async (_, res) => res.json({ data: keysToSnake(await db.profileSettings.findFirst({ orderBy: { createdAt: "asc" } })) }))
publicRouter.get("/services", async (_, res) => res.json({ data: keysToSnake(await db.service.findMany({ where: { isActive: true }, orderBy: { displayOrder: "asc" } })) }))

const contactLimiter = rateLimit({ windowMs: 15 * 60_000, limit: 5, standardHeaders: "draft-8", legacyHeaders: false })
publicRouter.post("/messages", contactLimiter, async (req, res) => {
  const parsed = contactMessageSchema.safeParse(req.body)
  if (!parsed.success) return res.status(400).json({ error: { message: parsed.error.issues[0]?.message ?? "Invalid message" } })
  await db.message.create({ data: parsed.data })
  res.setHeader("Cache-Control", "no-store")
  return res.status(201).json({ data: { success: true } })
})
