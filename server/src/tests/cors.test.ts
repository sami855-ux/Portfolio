import { describe, it, expect } from "vitest"
import request from "supertest"
import { app } from "../app.js"
import { isOriginAllowed } from "../utils/cors.js"

describe("isOriginAllowed", () => {
  it("allows requests without origin (server-to-server, curl, mobile)", () => {
    expect(isOriginAllowed(undefined, ["http://localhost:5173"], "production")).toBe(true)
    expect(isOriginAllowed("", ["http://localhost:5173"], "production")).toBe(true)
  })

  it("allows exact matches from allowedOrigins", () => {
    const allowed = ["http://localhost:5173", "https://samueltale.dev"]
    expect(isOriginAllowed("http://localhost:5173", allowed, "production")).toBe(true)
    expect(isOriginAllowed("https://samueltale.dev", allowed, "production")).toBe(true)
  })

  it("handles trailing slashes gracefully", () => {
    const allowed = ["http://localhost:5173"]
    expect(isOriginAllowed("http://localhost:5173/", allowed, "production")).toBe(true)
  })

  it("allows all localhost and 127.0.0.1 ports when NODE_ENV is development or test", () => {
    const allowed = ["http://localhost:5173"]
    expect(isOriginAllowed("http://localhost:5174", allowed, "development")).toBe(true)
    expect(isOriginAllowed("http://localhost:3000", allowed, "test")).toBe(true)
    expect(isOriginAllowed("http://127.0.0.1:5174", allowed, "development")).toBe(true)
    expect(isOriginAllowed("http://127.0.0.1:8080", allowed, "test")).toBe(true)
  })

  it("does not automatically allow arbitrary localhost in production unless in allowedOrigins", () => {
    const allowed = ["http://localhost:5173"]
    expect(isOriginAllowed("http://localhost:5174", allowed, "production")).toBe(false)
    expect(isOriginAllowed("http://localhost:5173", allowed, "production")).toBe(true)
  })

  it("supports wildcard patterns like https://*.vercel.app", () => {
    const allowed = ["https://*.vercel.app", "https://samueltale.dev"]
    expect(isOriginAllowed("https://portfolio-abc123.vercel.app", allowed, "production")).toBe(true)
    expect(isOriginAllowed("https://my-app.vercel.app", allowed, "production")).toBe(true)
    expect(isOriginAllowed("https://maliciousvercel.app", allowed, "production")).toBe(false)
    expect(isOriginAllowed("https://otherdomain.com", allowed, "production")).toBe(false)
  })

  it("supports global wildcard *", () => {
    const allowed = ["*"]
    expect(isOriginAllowed("https://any-domain.com", allowed, "production")).toBe(true)
    expect(isOriginAllowed("http://random-origin:9999", allowed, "production")).toBe(true)
  })

  it("rejects untrusted domains in production", () => {
    const allowed = ["https://samueltale.dev"]
    expect(isOriginAllowed("https://evil-site.com", allowed, "production")).toBe(false)
    expect(isOriginAllowed("http://localhost:5174", allowed, "production")).toBe(false)
  })
})

describe("CORS Express Middleware Integration", () => {
  it("allows preflight OPTIONS request from localhost:5174 in development/test environment", async () => {
    const res = await request(app)
      .options("/api/public/messages")
      .set("Origin", "http://localhost:5174")
      .set("Access-Control-Request-Method", "POST")

    expect(res.status).toBe(204)
    expect(res.headers["access-control-allow-origin"]).toBe("http://localhost:5174")
  })

  it("does not throw 500 error on disallowed origin preflight request", async () => {
    const res = await request(app)
      .options("/api/public/messages")
      .set("Origin", "https://unauthorized-domain.com")
      .set("Access-Control-Request-Method", "POST")

    expect(res.status).not.toBe(500)
    expect(res.headers["access-control-allow-origin"]).toBeUndefined()
  })
})
