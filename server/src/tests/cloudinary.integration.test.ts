import { describe, it, expect } from "vitest"
import { v2 as cloudinary } from "cloudinary"
import { config } from "../config.js"

describe("Cloudinary Real Credentials Integration Test", () => {
  // Ensure real credentials are configured
  const cloudName = config.CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME
  const apiKey = config.CLOUDINARY_API_KEY || process.env.CLOUDINARY_API_KEY
  const apiSecret = config.CLOUDINARY_API_SECRET || process.env.CLOUDINARY_API_SECRET

  beforeAll(() => {
    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
    })
  })

  it("verifies Cloudinary API connection and authentication using real credentials", async () => {
    const pingResult = await cloudinary.api.ping()
    expect(pingResult.status).toBe("ok")
  })

  it("performs real image upload, verifies response payload, and performs cleanup deletion", async () => {
    // 1x1 valid transparent PNG test buffer
    const testPngBuffer = Buffer.from(
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
      "base64"
    )

    // 1. Upload buffer
    const uploadResult = await new Promise<any>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "portfolio/automated_tests",
          tags: ["test", "automated"],
          resource_type: "image",
        },
        (error, result) => {
          if (error || !result) reject(error || new Error("Upload failed"))
          else resolve(result)
        }
      )
      stream.end(testPngBuffer)
    })

    expect(uploadResult).toBeDefined()
    expect(uploadResult.public_id).toBeDefined()
    expect(uploadResult.secure_url).toMatch(/^https:\/\/res\.cloudinary\.com\//)
    expect(uploadResult.format).toBe("png")

    const publicId = uploadResult.public_id

    // 2. Clean up / destroy uploaded test asset
    const destroyResult = await cloudinary.uploader.destroy(publicId)
    expect(destroyResult.result).toBe("ok")
  }, 20_000)
})
