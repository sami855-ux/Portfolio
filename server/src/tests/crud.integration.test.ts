import { describe, it, expect, beforeAll } from "vitest"
import request from "supertest"
import { app } from "../app.js"
import { TEST_ADMIN_EMAIL, TEST_ADMIN_PASSWORD } from "./setup.js"

describe("Full CRUD Integration Tests (Real PostgreSQL Instance)", () => {
  let token = ""

  beforeAll(async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: TEST_ADMIN_EMAIL, password: TEST_ADMIN_PASSWORD })
    token = res.body.data.token
  })

  describe("Projects Resource", () => {
    let createdId = ""

    it("creates a new project via Admin API", async () => {
      const res = await request(app)
        .post("/api/admin/projects")
        .set("Authorization", `Bearer ${token}`)
        .send({
          title: "Negari AI Assistant",
          description: "Full-stack generative AI workflow platform",
          category: "Fullstack",
          tags: ["React", "TypeScript", "PostgreSQL", "TailwindCSS"],
          github: "https://github.com/test/negari",
          live: "https://negari.example.com",
          featured: true,
          architecture: "Microservices architecture on Node.js",
          challenges: ["Low-latency streaming", "High concurrency"],
          solutions: ["SSE streaming", "Connection pooling"],
        })

      expect(res.status).toBe(201)
      expect(res.body.data).toBeDefined()
      const item = Array.isArray(res.body.data) ? res.body.data[0] : res.body.data
      expect(item.id).toBeDefined()
      expect(item.title).toBe("Negari AI Assistant")
      createdId = item.id
    })

    it("retrieves the project via Public API", async () => {
      const res = await request(app).get("/api/public/projects")
      expect(res.status).toBe(200)
      expect(res.body.data).toBeInstanceOf(Array)
      const found = res.body.data.find((p: any) => p.id === createdId)
      expect(found).toBeDefined()
      expect(found.title).toBe("Negari AI Assistant")
      expect(found.featured).toBe(true)
    })

    it("updates the project via Admin API", async () => {
      const res = await request(app)
        .patch(`/api/admin/projects/${createdId}`)
        .set("Authorization", `Bearer ${token}`)
        .send({ title: "Negari AI Platform 2.0", featured: false })

      expect(res.status).toBe(200)
      expect(res.body.data.title).toBe("Negari AI Platform 2.0")
      expect(res.body.data.featured).toBe(false)
    })

    it("deletes the project via Admin API", async () => {
      const res = await request(app)
        .delete(`/api/admin/projects/${createdId}`)
        .set("Authorization", `Bearer ${token}`)

      expect(res.status).toBe(204)

      const check = await request(app).get("/api/public/projects")
      const found = check.body.data.find((p: any) => p.id === createdId)
      expect(found).toBeUndefined()
    })
  })

  describe("Skills Resource", () => {
    let skillId = ""

    it("creates, reads, updates, and deletes a skill", async () => {
      // 1. Create
      const createRes = await request(app)
        .post("/api/admin/skills")
        .set("Authorization", `Bearer ${token}`)
        .send({
          name: "PostgreSQL",
          category: "Database",
          icon_name: "SiPostgresql",
          color: "#336791",
          proficiency: 95,
          display_order: 1,
        })

      expect(createRes.status).toBe(201)
      const created = Array.isArray(createRes.body.data) ? createRes.body.data[0] : createRes.body.data
      skillId = created.id
      expect(created.name).toBe("PostgreSQL")

      // 2. Read public
      const publicRes = await request(app).get("/api/public/skills")
      expect(publicRes.status).toBe(200)
      const found = publicRes.body.data.find((s: any) => s.id === skillId)
      expect(found).toBeDefined()
      expect(found.proficiency).toBe(95)

      // 3. Update
      const patchRes = await request(app)
        .patch(`/api/admin/skills/${skillId}`)
        .set("Authorization", `Bearer ${token}`)
        .send({ proficiency: 98 })

      expect(patchRes.status).toBe(200)
      expect(patchRes.body.data.proficiency).toBe(98)

      // 4. Delete
      const delRes = await request(app)
        .delete(`/api/admin/skills/${skillId}`)
        .set("Authorization", `Bearer ${token}`)

      expect(delRes.status).toBe(204)
    })
  })

  describe("Journey Timeline Resource", () => {
    it("creates, lists, and deletes a journey item", async () => {
      const createRes = await request(app)
        .post("/api/admin/journey_timeline")
        .set("Authorization", `Bearer ${token}`)
        .send({
          title: "Senior Full-Stack Engineer",
          description: "Architecting web systems and cloud databases.",
          date_range: "2024 - Present",
          icon_name: "Briefcase",
          side: "left",
          color: "#3ECF8E",
          display_order: 1,
        })

      expect(createRes.status).toBe(201)
      const item = Array.isArray(createRes.body.data) ? createRes.body.data[0] : createRes.body.data
      const itemId = item.id

      const listRes = await request(app).get("/api/public/journey")
      expect(listRes.status).toBe(200)
      expect(listRes.body.data.some((j: any) => j.id === itemId)).toBe(true)

      const delRes = await request(app)
        .delete(`/api/admin/journey_timeline/${itemId}`)
        .set("Authorization", `Bearer ${token}`)

      expect(delRes.status).toBe(204)
    })
  })

  describe("Contact Links Resource & Filtering", () => {
    it("hides inactive links from public endpoint and shows on admin", async () => {
      const createRes = await request(app)
        .post("/api/admin/contact_links")
        .set("Authorization", `Bearer ${token}`)
        .send({
          name: "Secret Channel",
          url: "https://secret.example.com",
          icon_name: "Lock",
          display_order: 99,
          is_active: false,
        })

      expect(createRes.status).toBe(201)
      const link = Array.isArray(createRes.body.data) ? createRes.body.data[0] : createRes.body.data
      const linkId = link.id

      // Inactive link should NOT appear in public API
      const pubRes = await request(app).get("/api/public/contact-links")
      expect(pubRes.body.data.some((l: any) => l.id === linkId)).toBe(false)

      // Inactive link DOES appear in admin API
      const adminRes = await request(app)
        .get("/api/admin/contact_links")
        .set("Authorization", `Bearer ${token}`)
      expect(adminRes.body.data.some((l: any) => l.id === linkId)).toBe(true)

      // Toggle active
      await request(app)
        .patch(`/api/admin/contact_links/${linkId}`)
        .set("Authorization", `Bearer ${token}`)
        .send({ is_active: true })

      // Now appears in public API
      const pubRes2 = await request(app).get("/api/public/contact-links")
      expect(pubRes2.body.data.some((l: any) => l.id === linkId)).toBe(true)

      // Clean up
      await request(app)
        .delete(`/api/admin/contact_links/${linkId}`)
        .set("Authorization", `Bearer ${token}`)
    })
  })

  describe("Messages Resource", () => {
    it("submits contact message publicly, marks read in admin, and deletes", async () => {
      // 1. Submit public message
      const sendRes = await request(app)
        .post("/api/public/messages")
        .send({
          name: "Jane Doe",
          email: "jane.doe@example.com",
          subject: "Project Collaboration",
          message: "Hi Samuel, let's collaborate on an exciting new project!",
        })

      expect(sendRes.status).toBe(201)
      expect(sendRes.body.data.success).toBe(true)

      // 2. Read inbox as admin
      const inboxRes = await request(app)
        .get("/api/admin/messages")
        .set("Authorization", `Bearer ${token}`)

      expect(inboxRes.status).toBe(200)
      const found = inboxRes.body.data.find((m: any) => m.email === "jane.doe@example.com")
      expect(found).toBeDefined()
      expect(found.is_read).toBe(false)

      // 3. Mark read
      const markRes = await request(app)
        .patch(`/api/admin/messages/${found.id}`)
        .set("Authorization", `Bearer ${token}`)
        .send({ is_read: true })

      expect(markRes.status).toBe(200)
      expect(markRes.body.data.is_read).toBe(true)

      // 4. Delete message
      const delRes = await request(app)
        .delete(`/api/admin/messages/${found.id}`)
        .set("Authorization", `Bearer ${token}`)

      expect(delRes.status).toBe(204)
    })
  })

  describe("Profile Settings Resource", () => {
    it("fetches and updates profile settings", async () => {
      const getRes = await request(app).get("/api/public/profile")
      expect(getRes.status).toBe(200)
      const profile = getRes.body.data
      expect(profile).toBeDefined()

      const patchRes = await request(app)
        .patch(`/api/admin/profile_settings/${profile.id}`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          hero_description: "Expert software engineer specializing in scalable cloud applications.",
          location: "Addis Ababa, Ethiopia",
        })

      expect(patchRes.status).toBe(200)
      expect(patchRes.body.data.hero_description).toBe("Expert software engineer specializing in scalable cloud applications.")

      // Verify on public endpoint
      const verifyRes = await request(app).get("/api/public/profile")
      expect(verifyRes.body.data.location).toBe("Addis Ababa, Ethiopia")
    })
  })
})
