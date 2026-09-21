import { Router } from "express"
import type { PrismaClient } from "@prisma/client"
import { db } from "../db.js"
import { requireAdmin } from "../middleware/auth.js"
import { schemas } from "../validation.js"
import { keysToCamel, keysToSnake } from "../utils/records.js"

export const adminRouter = Router()
adminRouter.use(requireAdmin)

type Resource = keyof typeof schemas
const delegates: Record<Resource, keyof PrismaClient> = {
  projects: "project", skills: "skill", journey_timeline: "journeyItem", contact_links: "contactLink",
  floating_cards: "floatingCard", messages: "message", profile_settings: "profileSettings",
  services: "service",
}
const resourceNames = new Set(Object.keys(delegates))

function getDelegate(resource: string): any {
  if (!resourceNames.has(resource)) return null
  return (db as any)[delegates[resource as Resource]]
}

adminRouter.get("/:resource", async (req, res) => {
  const delegate = getDelegate(req.params.resource)
  if (!delegate) return res.status(404).json({ error: { message: "Unknown resource" } })
  const where = req.query.field && req.query.value ? { [String(req.query.field).replace(/_([a-z])/g, (_, c) => c.toUpperCase())]: String(req.query.value) === "true" ? true : String(req.query.value) === "false" ? false : req.query.value } : undefined
  const orderBy = req.params.resource === "projects" || req.params.resource === "messages"
    ? { createdAt: "desc" }
    : req.params.resource === "profile_settings"
      ? { createdAt: "asc" }
      : { displayOrder: "asc" }
  const rows = await delegate.findMany({ where, orderBy })
  return res.json({ data: keysToSnake(rows), count: rows.length })
})

adminRouter.post("/:resource", async (req, res) => {
  const resource = req.params.resource as Resource
  const delegate = getDelegate(resource)
  if (!delegate) return res.status(404).json({ error: { message: "Unknown resource" } })
  const values = Array.isArray(req.body) ? req.body : [req.body]
  const parsedValues = values.map((value) => schemas[resource].safeParse(value))
  const invalid = parsedValues.find((result) => !result.success)
  if (invalid && !invalid.success) return res.status(400).json({ error: { message: invalid.error.issues[0]?.message ?? "Invalid data" } })
  const created = await db.$transaction(parsedValues.map((result) => delegate.create({ data: keysToCamel((result as any).data) })))
  return res.status(201).json({ data: keysToSnake(created) })
})

adminRouter.patch("/:resource/:id", async (req, res) => {
  const resource = req.params.resource as Resource
  const delegate = getDelegate(resource)
  if (!delegate) return res.status(404).json({ error: { message: "Unknown resource" } })
  const parsed = schemas[resource].partial().safeParse(req.body)
  if (!parsed.success) return res.status(400).json({ error: { message: parsed.error.issues[0]?.message ?? "Invalid data" } })
  const updated = await delegate.update({ where: { id: req.params.id }, data: keysToCamel(parsed.data) })
  return res.json({ data: keysToSnake(updated) })
})

adminRouter.delete("/:resource/:id", async (req, res) => {
  const delegate = getDelegate(req.params.resource)
  if (!delegate) return res.status(404).json({ error: { message: "Unknown resource" } })
  await delegate.delete({ where: { id: req.params.id } })
  return res.status(204).send()
})
