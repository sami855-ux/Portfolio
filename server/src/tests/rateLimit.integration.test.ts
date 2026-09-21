import { describe, it, expect } from "vitest"
import express from "express"
import request from "supertest"
import rateLimit from "express-rate-limit"

describe("Rate Limiting Specificity Tests", () => {
  it("enforces login-specific rate limiting with standard headers and JSON error", async () => {
    const testApp = express()
    testApp.use(express.json())

    // Mock tight login limiter
    const limiter = rateLimit({
      windowMs: 60_000,
      limit: 3,
      standardHeaders: "draft-8",
      legacyHeaders: false,
      message: {
        error: {
          message: "Too many login attempts from this IP, please try again after 15 minutes.",
        },
      },
    })

    testApp.post("/login", limiter, (_req, res) => res.json({ ok: true }))

    // First 3 requests succeed
    for (let i = 0; i < 3; i++) {
      const res = await request(testApp).post("/login").send({})
      expect(res.status).toBe(200)
    }

    // 4th request must be blocked with 429
    const blockedRes = await request(testApp).post("/login").send({})
    expect(blockedRes.status).toBe(429)
    const hasRateLimitHeader = Boolean(
      blockedRes.headers["ratelimit"] ||
      blockedRes.headers["ratelimit-limit"] ||
      blockedRes.headers["ratelimit-policy"]
    )
    expect(hasRateLimitHeader).toBe(true)
    expect(blockedRes.body.error).toBeDefined()
    expect(blockedRes.body.error.message).toMatch(/too many login attempts/i)
  })
})
