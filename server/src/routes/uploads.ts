import { Router } from "express"
import multer from "multer"
import { v2 as cloudinary } from "cloudinary"
import { config } from "../config.js"
import { requireAdmin } from "../middleware/auth.js"
import { validateImageBuffer } from "../utils/fileValidation.js"

cloudinary.config({
  cloud_name: config.CLOUDINARY_CLOUD_NAME,
  api_key: config.CLOUDINARY_API_KEY,
  api_secret: config.CLOUDINARY_API_SECRET,
})

export const uploadRouter = Router()

const fileFilter: multer.Options["fileFilter"] = (_, file, done) => {
  const allowed = ["image/jpeg", "image/png", "image/webp", "image/avif"]
  done(null, allowed.includes(file.mimetype))
}

const uploadSingle = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024, files: 1 },
  fileFilter,
})

const uploadMultiple = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024, files: 20 },
  fileFilter,
})

async function uploadBufferToCloudinary(buffer: Buffer, mimetype: string, folder: string) {
  const validation = validateImageBuffer(buffer, mimetype)
  if (!validation.valid) {
    throw new Error(validation.error ?? "Invalid image file format")
  }

  return new Promise<{ secure_url: string; public_id: string; width: number; height: number }>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
        overwrite: false,
        transformation: [{ quality: "auto", fetch_format: "auto" }],
      },
      (error, response) => {
        if (error || !response) reject(error ?? new Error("Cloudinary upload failed"))
        else resolve(response as any)
      },
    )
    stream.end(buffer)
  })
}

// Single image upload
uploadRouter.post("/image", requireAdmin, uploadSingle.single("image"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: { message: "A JPEG, PNG, WebP, or AVIF image is required" } })
  }

  const folder = typeof req.body.folder === "string" && /^[a-z0-9/_-]+$/i.test(req.body.folder)
    ? req.body.folder
    : "portfolio/uploads"

  try {
    const result = await uploadBufferToCloudinary(req.file.buffer, req.file.mimetype, folder)
    return res.status(201).json({
      data: {
        url: result.secure_url,
        publicId: result.public_id,
        width: result.width,
        height: result.height,
      },
    })
  } catch (err: any) {
    return res.status(400).json({ error: { message: err?.message || "Failed to upload image" } })
  }
})

// Multiple images upload (up to 20 images at once for project galleries)
uploadRouter.post(
  "/images",
  requireAdmin,
  uploadMultiple.fields([
    { name: "images", maxCount: 20 },
    { name: "image", maxCount: 20 },
  ]),
  async (req, res) => {
    const filesMap = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined
    const files = [
      ...(filesMap?.images || []),
      ...(filesMap?.image || []),
    ]

    if (!files || files.length === 0) {
      return res.status(400).json({ error: { message: "At least one JPEG, PNG, WebP, or AVIF image is required" } })
    }

    const folder = typeof req.body.folder === "string" && /^[a-z0-9/_-]+$/i.test(req.body.folder)
      ? req.body.folder
      : "portfolio/uploads"

    try {
      const uploadPromises = files.map(async (file) => {
        const result = await uploadBufferToCloudinary(file.buffer, file.mimetype, folder)
        return {
          url: result.secure_url,
          publicId: result.public_id,
          width: result.width,
          height: result.height,
          originalName: file.originalname,
        }
      })

      const results = await Promise.all(uploadPromises)
      return res.status(201).json({ data: results })
    } catch (err: any) {
      return res.status(400).json({ error: { message: err?.message || "Failed to upload images" } })
    }
  }
)
