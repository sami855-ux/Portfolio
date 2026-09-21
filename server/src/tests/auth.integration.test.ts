import { describe, it, expect } from "vitest"
import request from "supertest"
import { app } from "../app.js"
import { TEST_ADMIN_EMAIL, TEST_ADMIN_PASSWORD } from "./setup.js"

describe("Authentication & Authorization Integration Tests (Real PostgreSQL)", () => {
  let authToken = ""

  it("should fail login with invalid password", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: TEST_ADMIN_EMAIL, password: "WrongPassword123!" })

    expect(res.status).toBe(401)
    expect(res.body.error).toBeDefined()
    expect(res.body.error.message).toMatch(/invalid email or password/i)
  })

  it("should fail login with non-existent email", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "doesnotexist@example.com", password: "Password123!" })

    expect(res.status).toBe(401)
  })

  it("should succeed login with valid credentials and return JWT token", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: TEST_ADMIN_EMAIL, password: TEST_ADMIN_PASSWORD })

    expect(res.status).toBe(200)
    expect(res.body.data).toBeDefined()
    expect(res.body.data.token).toBeDefined()
    expect(res.body.data.user.email).toBe(TEST_ADMIN_EMAIL)

    authToken = res.body.data.token
  })

  it("should reject access to protected admin route without token", async () => {
    const res = await request(app).get("/api/admin/projects")
    expect(res.status).toBe(401)
    expect(res.body.error.message).toMatch(/authentication required/i)
  })

  it("should allow access to protected /api/auth/me with valid Bearer token", async () => {
    const res = await request(app)
      .get("/api/auth/me")
      .set("Authorization", `Bearer ${authToken}`)

    expect(res.status).toBe(200)
    expect(res.body.data.user.email).toBe(TEST_ADMIN_EMAIL)
  })

  it("should update password via /api/auth/password", async () => {
    const newPassword = "BrandNewPassword12345!"

    // 1. Wrong current password fails
    const badAttempt = await request(app)
      .patch("/api/auth/password")
      .set("Authorization", `Bearer ${authToken}`)
      .send({ currentPassword: "IncorrectPassword", password: newPassword })

    expect(badAttempt.status).toBe(401)

    // 2. Correct current password succeeds
    const goodAttempt = await request(app)
      .patch("/api/auth/password")
      .set("Authorization", `Bearer ${authToken}`)
      .send({ currentPassword: TEST_ADMIN_PASSWORD, password: newPassword })

    expect(goodAttempt.status).toBe(204)

    // 3. Login with old password now fails
    const oldLogin = await request(app)
      .post("/api/auth/login")
      .send({ email: TEST_ADMIN_EMAIL, password: TEST_ADMIN_PASSWORD })

    expect(oldLogin.status).toBe(401)

    // 4. Login with new password succeeds
    const newLogin = await request(app)
      .post("/api/auth/login")
      .send({ email: TEST_ADMIN_EMAIL, password: newPassword })

    expect(newLogin.status).toBe(200)
    expect(newLogin.body.data.token).toBeDefined()

    // 5. Restore original password for any subsequent tests
    const restoreAttempt = await request(app)
      .patch("/api/auth/password")
      .set("Authorization", `Bearer ${newLogin.body.data.token}`)
      .send({ currentPassword: newPassword, password: TEST_ADMIN_PASSWORD })

    expect(restoreAttempt.status).toBe(204)
  })
})
