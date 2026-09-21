import { describe, it, expect } from "vitest"
import request from "supertest"
import { app } from "../app.js"

describe("Health & Readiness Checks Integration Tests", () => {
  it("verifies liveness check at /api/health", async () => {
    const res = await request(app).get("/api/health")
    expect(res.status).toBe(200)
    expect(res.body.status).toBe("ok")
    expect(res.body.timestamp).toBeDefined()
    expect(typeof res.body.uptime).toBe("number")
  })

  it("verifies database-aware readiness check at /api/health/ready", async () => {
    const res = await request(app).get("/api/health/ready")
    expect(res.status).toBe(200)
    expect(res.body.status).toBe("ready")
    expect(res.body.database).toBeDefined()
    expect(res.body.database.status).toBe("connected")
    expect(typeof res.body.database.latencyMs).toBe("number")
    expect(res.body.memory).toBeDefined()
    expect(typeof res.body.memory.rssMb).toBe("number")
    expect(typeof res.body.memory.heapUsedMb).toBe("number")
  })

  it("verifies alias /api/ready responds with readiness status", async () => {
    const res = await request(app).get("/api/ready")
    expect(res.status).toBe(200)
    expect(res.body.status).toBe("ready")
    expect(res.body.database.status).toBe("connected")
  })
})
