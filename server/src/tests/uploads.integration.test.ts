import { describe, it, expect, beforeAll } from "vitest"
import request from "supertest"
import { app } from "../app.js"
import { TEST_ADMIN_EMAIL, TEST_ADMIN_PASSWORD } from "./setup.js"

describe("Upload Content Validation Integration Tests", () => {
  let token = ""

  beforeAll(async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: TEST_ADMIN_EMAIL, password: TEST_ADMIN_PASSWORD })
    token = res.body.data.token
  })

  it("rejects file uploads without admin authentication", async () => {
    const fakePng = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==", "base64")
    const res = await request(app)
      .post("/api/uploads/image")
      .attach("image", fakePng, "photo.png")

    expect(res.status).toBe(401)
  })

  it("rejects spoofed file with image/png MIME header but plaintext content", async () => {
    // Malicious text or HTML script claiming to be an image
    const spoofedContent = Buffer.from("<script>alert('malicious script execution')</script>")

    const res = await request(app)
      .post("/api/uploads/image")
      .set("Authorization", `Bearer ${token}`)
      .attach("image", spoofedContent, {
        filename: "avatar.png",
        contentType: "image/png",
      })

    expect(res.status).toBe(400)
    expect(res.body.error).toBeDefined()
    expect(res.body.error.message).toMatch(/signature|script|invalid/i)
  })

  it("rejects executable binary file disguised as image/jpeg", async () => {
    // Windows PE header MZ
    const executablePayload = Buffer.from("MZ\x90\x00\x03\x00\x00\x00\x04\x00\x00\x00\xff\xff\x00\x00")

    const res = await request(app)
      .post("/api/uploads/image")
      .set("Authorization", `Bearer ${token}`)
      .attach("image", executablePayload, {
        filename: "update.jpeg",
        contentType: "image/jpeg",
      })

    expect(res.status).toBe(400)
    expect(res.body.error.message).toMatch(/executable|signature|invalid/i)
  })

  it("successfully validates and uploads authentic PNG image buffer", async () => {
    const validPng = Buffer.from(
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
      "base64"
    )

    const res = await request(app)
      .post("/api/uploads/image")
      .set("Authorization", `Bearer ${token}`)
      .attach("image", validPng, {
        filename: "valid.png",
        contentType: "image/png",
      })

    expect(res.status).toBe(201)
    expect(res.body.data.url).toMatch(/^https:\/\/res\.cloudinary\.com\//)
  }, 20_000)

  it("successfully uploads multiple authentic PNG images via /api/uploads/images", async () => {
    const validPng1 = Buffer.from(
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
      "base64"
    )
    const validPng2 = Buffer.from(
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==",
      "base64"
    )

    const res = await request(app)
      .post("/api/uploads/images")
      .set("Authorization", `Bearer ${token}`)
      .attach("images", validPng1, { filename: "screenshot1.png", contentType: "image/png" })
      .attach("images", validPng2, { filename: "screenshot2.png", contentType: "image/png" })

    expect(res.status).toBe(201)
    expect(Array.isArray(res.body.data)).toBe(true)
    expect(res.body.data.length).toBe(2)
    expect(res.body.data[0].url).toMatch(/^https:\/\/res\.cloudinary\.com\//)
    expect(res.body.data[1].url).toMatch(/^https:\/\/res\.cloudinary\.com\//)
  }, 30_000)

  it("rejects /api/uploads/images without admin authentication", async () => {
    const validPng = Buffer.from(
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
      "base64"
    )
    const res = await request(app)
      .post("/api/uploads/images")
      .attach("images", validPng, { filename: "screenshot.png", contentType: "image/png" })

    expect(res.status).toBe(401)
  })
})
