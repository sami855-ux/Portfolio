import type { NextFunction, Request, Response } from "express"
import jwt from "jsonwebtoken"
import { config } from "../config.js"

export interface AuthRequest extends Request {
  admin?: { id: string; email: string }
}

export function requireAdmin(req: AuthRequest, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.startsWith("Bearer ")
    ? req.headers.authorization.slice(7)
    : undefined
  if (!token) return res.status(401).json({ error: { message: "Authentication required" } })

  try {
    const payload = jwt.verify(token, config.JWT_SECRET) as { sub: string; email: string }
    req.admin = { id: payload.sub, email: payload.email }
    next()
  } catch {
    return res.status(401).json({ error: { message: "Session expired or invalid" } })
  }
}
