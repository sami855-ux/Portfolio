import { Router } from "express"
import multer from "multer"
import { v2 as cloudinary } from "cloudinary"
import { config } from "../config.js"
import { requireAdmin } from "../middleware/auth.js"
import { validateImageBuffer } from "../utils/fileValidation.js"

cloudinary.config({ cloud_name: config.CLOUDINARY_CLOUD_NAME, api_key: config.CLOUDINARY_API_KEY, api_secret: config.CLOUDINARY_API_SECRET })
export const uploadRouter = Router()
const upload = multer({
  storage: multer.memoryStorage(), limits: { fileSize: 8 * 1024 * 1024, files: 1 },
  fileFilter: (_, file, done) => done(null, ["image/jpeg", "image/png", "image/webp", "image/avif"].includes(file.mimetype)),
})

uploadRouter.post("/image", requireAdmin, upload.single("image"), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: { message: "A JPEG, PNG, WebP, or AVIF image is required" } })
  
  const validation = validateImageBuffer(req.file.buffer, req.file.mimetype)
  if (!validation.valid) {
    return res.status(400).json({ error: { message: validation.error ?? "Invalid image file format" } })
  }

  const folder = typeof req.body.folder === "string" && /^[a-z0-9/_-]+$/i.test(req.body.folder) ? req.body.folder : "portfolio/uploads"
  const result = await new Promise<{ secure_url: string; public_id: string; width: number; height: number }>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: "image", overwrite: false, transformation: [{ quality: "auto", fetch_format: "auto" }] },
      (error, response) => error || !response ? reject(error ?? new Error("Cloudinary upload failed")) : resolve(response as any),
    )
    stream.end(req.file!.buffer)
  })
  return res.status(201).json({ data: { url: result.secure_url, publicId: result.public_id, width: result.width, height: result.height } })
})
