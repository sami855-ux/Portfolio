import { Router, type Response } from "express"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { loginLimiter, oauthLimiter } from "../middleware/rateLimiter.js"
import { z } from "zod"
import { db } from "../db.js"
import { config } from "../config.js"
import { requireAdmin, type AuthRequest } from "../middleware/auth.js"
import {
  authenticateOAuth,
  authorizationUrl,
  configuredProviders,
  createPkce,
  hashExchangeCode,
  newExchangeCode,
  type OAuthProvider,
} from "../services/oauth.js"

export const authRouter = Router()
const loginSchema = z.object({ email: z.string().email(), password: z.string().min(6).max(200) })
const providerSchema = z.enum(["google", "github"])
const oauthCookieOptions = {
  httpOnly: true,
  secure: config.NODE_ENV === "production",
  sameSite: "lax" as const,
  maxAge: 10 * 60_000,
  path: "/api/auth/oauth",
}

function sessionToken(admin: { id: string; email: string }) {
  return jwt.sign({ email: admin.email }, config.JWT_SECRET, {
    subject: admin.id,
    issuer: "portfolio-api",
    audience: "portfolio-admin",
    expiresIn: "8h",
  })
}

function cookieValue(header: string | undefined, name: string) {
  const item = header?.split(";").map((part) => part.trim()).find((part) => part.startsWith(`${name}=`))
  return item ? decodeURIComponent(item.slice(name.length + 1)) : undefined
}

function clearOAuthCookies(res: Response) {
  res.clearCookie("oauth_state", { path: oauthCookieOptions.path })
  res.clearCookie("oauth_verifier", { path: oauthCookieOptions.path })
}

function oauthFailure(res: Response, reason: string) {
  clearOAuthCookies(res)
  const url = new URL("/admin/login", config.CLIENT_URL)
  url.hash = new URLSearchParams({ oauth_error: reason }).toString()
  return res.redirect(url.toString())
}

authRouter.get("/providers", (_req, res) => res.json({ data: configuredProviders() }))

authRouter.post("/login", loginLimiter, async (req, res) => {
  const parsed = loginSchema.safeParse(req.body)
  if (!parsed.success) return res.status(400).json({ error: { message: "Valid email and password are required" } })
  const email = parsed.data.email.trim().toLowerCase()
  const admin = await db.admin.findUnique({ where: { email } })
  if (!admin || !(await bcrypt.compare(parsed.data.password, admin.passwordHash))) {
    return res.status(401).json({ error: { message: "Invalid email or password" } })
  }
  return res.json({ data: { token: sessionToken(admin), user: { id: admin.id, email: admin.email } } })
})

authRouter.get("/oauth/:provider", oauthLimiter, (req, res) => {
  const parsed = providerSchema.safeParse(req.params.provider)
  if (!parsed.success) return res.status(404).json({ error: { message: "Unknown OAuth provider" } })
  const { verifier, challenge } = createPkce()
  const state = jwt.sign({ provider: parsed.data }, config.JWT_SECRET, {
    issuer: "portfolio-api",
    audience: "portfolio-oauth",
    expiresIn: "10m",
  })
  res.cookie("oauth_state", state, oauthCookieOptions)
  res.cookie("oauth_verifier", verifier, oauthCookieOptions)
  return res.redirect(authorizationUrl(parsed.data, state, challenge))
})

authRouter.get("/oauth/:provider/callback", async (req, res) => {
  const parsedProvider = providerSchema.safeParse(req.params.provider)
  if (!parsedProvider.success) return oauthFailure(res, "unknown_provider")
  if (typeof req.query.error === "string") return oauthFailure(res, "access_denied")
  const code = typeof req.query.code === "string" ? req.query.code : undefined
  const state = typeof req.query.state === "string" ? req.query.state : undefined
  const cookieState = cookieValue(req.headers.cookie, "oauth_state")
  const verifier = cookieValue(req.headers.cookie, "oauth_verifier")
  if (!code || !state || !cookieState || !verifier || state !== cookieState) return oauthFailure(res, "invalid_state")

  try {
    const payload = jwt.verify(state, config.JWT_SECRET, { issuer: "portfolio-api", audience: "portfolio-oauth" }) as { provider?: OAuthProvider }
    if (payload.provider !== parsedProvider.data) return oauthFailure(res, "invalid_state")
    const admin = await authenticateOAuth(parsedProvider.data, code, verifier)
    const exchangeCode = newExchangeCode()
    await db.$transaction([
      db.oAuthCode.deleteMany({ where: { expiresAt: { lt: new Date() } } }),
      db.oAuthCode.create({ data: { codeHash: hashExchangeCode(exchangeCode), adminId: admin.id, expiresAt: new Date(Date.now() + 2 * 60_000) } }),
    ])
    clearOAuthCookies(res)
    const callback = new URL("/admin/oauth/callback", config.CLIENT_URL)
    callback.hash = new URLSearchParams({ code: exchangeCode }).toString()
    return res.redirect(callback.toString())
  } catch (error) {
    console.error("OAuth callback failed", error instanceof Error ? error.message : "unknown error")
    return oauthFailure(res, "login_failed")
  }
})

authRouter.post("/oauth/exchange", oauthLimiter, async (req, res) => {
  const parsed = z.object({ code: z.string().min(32).max(200) }).safeParse(req.body)
  if (!parsed.success) return res.status(400).json({ error: { message: "Invalid OAuth exchange code" } })
  const record = await db.oAuthCode.findUnique({ where: { codeHash: hashExchangeCode(parsed.data.code) }, include: { admin: true } })
  if (!record || record.expiresAt <= new Date()) {
    if (record) await db.oAuthCode.delete({ where: { id: record.id } })
    return res.status(401).json({ error: { message: "OAuth exchange code is invalid or expired" } })
  }
  const consumed = await db.oAuthCode.deleteMany({ where: { id: record.id } })
  if (consumed.count !== 1) return res.status(401).json({ error: { message: "OAuth exchange code was already used" } })
  const admin = record.admin
  return res.json({ data: { token: sessionToken(admin), user: { id: admin.id, email: admin.email } } })
})

authRouter.get("/me", requireAdmin, (req: AuthRequest, res) => res.json({ data: { user: req.admin } }))

authRouter.patch("/password", requireAdmin, async (req: AuthRequest, res) => {
  const parsed = z.object({ currentPassword: z.string().min(8), password: z.string().min(10).max(200) }).safeParse(req.body)
  if (!parsed.success) return res.status(400).json({ error: { message: "Current password and a new password of at least 10 characters are required" } })
  const admin = await db.admin.findUnique({ where: { id: req.admin!.id } })
  if (!admin || !(await bcrypt.compare(parsed.data.currentPassword, admin.passwordHash))) {
    return res.status(401).json({ error: { message: "Current password is incorrect" } })
  }
  await db.admin.update({ where: { id: admin.id }, data: { passwordHash: await bcrypt.hash(parsed.data.password, 12) } })
  return res.status(204).send()
})
