import { createHash, randomBytes } from "node:crypto"
import type { Admin } from "@prisma/client"
import { config } from "../config.js"
import { db } from "../db.js"

export type OAuthProvider = "google" | "github"

interface OAuthIdentity {
  provider: OAuthProvider
  subject: string
  email: string
}

const callbackUrl = (provider: OAuthProvider) => `${config.PUBLIC_API_URL}/auth/oauth/${provider}/callback`
const base64Url = (value: Buffer) => value.toString("base64url")

export function configuredProviders() {
  return {
    google: Boolean(config.GOOGLE_CLIENT_ID && config.GOOGLE_CLIENT_SECRET),
    github: Boolean(config.GITHUB_CLIENT_ID && config.GITHUB_CLIENT_SECRET),
  }
}

export function createPkce() {
  const verifier = base64Url(randomBytes(48))
  const challenge = base64Url(createHash("sha256").update(verifier).digest())
  return { verifier, challenge }
}

export function authorizationUrl(provider: OAuthProvider, state: string, challenge: string) {
  if (!configuredProviders()[provider]) throw Object.assign(new Error(`${provider} login is not configured`), { status: 503 })
  if (provider === "google") {
    const query = new URLSearchParams({
      client_id: config.GOOGLE_CLIENT_ID,
      redirect_uri: callbackUrl(provider),
      response_type: "code",
      scope: "openid email profile",
      state,
      code_challenge: challenge,
      code_challenge_method: "S256",
      prompt: "select_account",
    })
    return `https://accounts.google.com/o/oauth2/v2/auth?${query}`
  }
  const query = new URLSearchParams({
    client_id: config.GITHUB_CLIENT_ID,
    redirect_uri: callbackUrl(provider),
    scope: "read:user user:email",
    state,
    code_challenge: challenge,
    code_challenge_method: "S256",
  })
  return `https://github.com/login/oauth/authorize?${query}`
}

async function fetchJson<T>(url: string, init: RequestInit): Promise<T> {
  const response = await fetch(url, { ...init, signal: AbortSignal.timeout(10_000) })
  const payload = await response.json().catch(() => null)
  if (!response.ok) throw Object.assign(new Error("OAuth provider request failed"), { status: 502 })
  return payload as T
}

async function googleIdentity(code: string, verifier: string): Promise<OAuthIdentity> {
  const token = await fetchJson<{ access_token?: string }>("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: config.GOOGLE_CLIENT_ID,
      client_secret: config.GOOGLE_CLIENT_SECRET,
      redirect_uri: callbackUrl("google"),
      grant_type: "authorization_code",
      code_verifier: verifier,
    }),
  })
  if (!token.access_token) throw Object.assign(new Error("Google did not return an access token"), { status: 502 })
  const profile = await fetchJson<{ sub?: string; email?: string; email_verified?: boolean }>(
    "https://openidconnect.googleapis.com/v1/userinfo",
    { headers: { Authorization: `Bearer ${token.access_token}` } },
  )
  if (!profile.sub || !profile.email || !profile.email_verified) {
    throw Object.assign(new Error("A verified Google email is required"), { status: 403 })
  }
  return { provider: "google", subject: profile.sub, email: profile.email.trim().toLowerCase() }
}

async function githubIdentity(code: string, verifier: string): Promise<OAuthIdentity> {
  const token = await fetchJson<{ access_token?: string }>("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: { Accept: "application/json", "Content-Type": "application/json" },
    body: JSON.stringify({
      client_id: config.GITHUB_CLIENT_ID,
      client_secret: config.GITHUB_CLIENT_SECRET,
      code,
      redirect_uri: callbackUrl("github"),
      code_verifier: verifier,
    }),
  })
  if (!token.access_token) throw Object.assign(new Error("GitHub did not return an access token"), { status: 502 })
  const headers = { Authorization: `Bearer ${token.access_token}`, Accept: "application/vnd.github+json", "User-Agent": "portfolio-api" }
  const [profile, emails] = await Promise.all([
    fetchJson<{ id?: number }>("https://api.github.com/user", { headers }),
    fetchJson<Array<{ email: string; primary: boolean; verified: boolean }>>("https://api.github.com/user/emails", { headers }),
  ])
  const email = emails.find((item) => item.primary && item.verified)?.email ?? emails.find((item) => item.verified)?.email
  if (!profile.id || !email) throw Object.assign(new Error("A verified GitHub email is required"), { status: 403 })
  return { provider: "github", subject: String(profile.id), email: email.trim().toLowerCase() }
}

export async function authenticateOAuth(provider: OAuthProvider, code: string, verifier: string): Promise<Admin> {
  const identity = provider === "google" ? await googleIdentity(code, verifier) : await githubIdentity(code, verifier)
  const linked = provider === "google"
    ? await db.admin.findUnique({ where: { googleSubject: identity.subject } })
    : await db.admin.findUnique({ where: { githubUserId: identity.subject } })
  if (linked) return linked

  const admin = await db.admin.findUnique({ where: { email: identity.email } })
  if (!admin) throw Object.assign(new Error("This account is not authorized for the admin dashboard"), { status: 403 })
  if (provider === "google" && admin.googleSubject && admin.googleSubject !== identity.subject) {
    throw Object.assign(new Error("This Google identity does not match the linked admin account"), { status: 403 })
  }
  if (provider === "github" && admin.githubUserId && admin.githubUserId !== identity.subject) {
    throw Object.assign(new Error("This GitHub identity does not match the linked admin account"), { status: 403 })
  }
  return db.admin.update({
    where: { id: admin.id },
    data: provider === "google" ? { googleSubject: identity.subject } : { githubUserId: identity.subject },
  })
}

export function hashExchangeCode(code: string) {
  return createHash("sha256").update(code).digest("hex")
}

export function newExchangeCode() {
  return base64Url(randomBytes(32))
}
