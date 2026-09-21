/**
 * Validates file content using magic byte signatures to prevent MIME-spoofing attacks.
 */

export interface ValidationResult {
  valid: boolean
  detectedType?: "image/jpeg" | "image/png" | "image/webp" | "image/avif"
  error?: string
}

export function detectImageFormat(buffer: Buffer): "image/jpeg" | "image/png" | "image/webp" | "image/avif" | null {
  if (!buffer || buffer.length < 12) {
    return null
  }

  // 1. JPEG: FF D8 FF
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return "image/jpeg"
  }

  // 2. PNG: 89 50 4E 47 0D 0A 1A 0A
  if (
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a
  ) {
    return "image/png"
  }

  // 3. WebP: "RIFF" .... "WEBP"
  if (
    buffer[0] === 0x52 && // R
    buffer[1] === 0x49 && // I
    buffer[2] === 0x46 && // F
    buffer[3] === 0x46 && // F
    buffer[8] === 0x57 && // W
    buffer[9] === 0x45 && // E
    buffer[10] === 0x42 && // B
    buffer[11] === 0x50 // P
  ) {
    return "image/webp"
  }

  // 4. AVIF: Offset 4-7 has "ftyp" and brand is "avif" or "avis"
  const ftyp = buffer.subarray(4, 8).toString("ascii")
  if (ftyp === "ftyp") {
    const brand = buffer.subarray(8, 12).toString("ascii")
    if (brand === "avif" || brand === "avis" || brand === "mif1") {
      return "image/avif"
    }
  }

  return null
}

export function validateImageBuffer(buffer: Buffer, claimedMimeType?: string): ValidationResult {
  if (!buffer || buffer.length === 0) {
    return { valid: false, error: "Empty file buffer" }
  }

  if (buffer.length < 12) {
    return { valid: false, error: "File too small to be a valid image" }
  }

  // Check for suspicious script injections or executable headers
  const prefixAscii = buffer.subarray(0, Math.min(buffer.length, 512)).toString("ascii").toLowerCase()
  if (
    prefixAscii.includes("<script") ||
    prefixAscii.includes("<?php") ||
    prefixAscii.includes("<html") ||
    prefixAscii.includes("<!doctype html")
  ) {
    return { valid: false, error: "Executable script or markup detected in image file" }
  }

  // Windows PE (MZ) or Linux ELF
  if (buffer[0] === 0x4d && buffer[1] === 0x5a) {
    return { valid: false, error: "Executable PE binary detected" }
  }
  if (buffer[0] === 0x7f && buffer[1] === 0x45 && buffer[2] === 0x4c && buffer[3] === 0x46) {
    return { valid: false, error: "Executable ELF binary detected" }
  }

  const detected = detectImageFormat(buffer)
  if (!detected) {
    return {
      valid: false,
      error: "File signature does not match any allowed image format (JPEG, PNG, WebP, AVIF)",
    }
  }

  if (claimedMimeType && claimedMimeType !== detected) {
    // Note: Some clients send image/jpg instead of image/jpeg
    const normalizedClaimed = claimedMimeType === "image/jpg" ? "image/jpeg" : claimedMimeType
    if (normalizedClaimed !== detected) {
      return {
        valid: false,
        error: `MIME type mismatch: claimed '${claimedMimeType}', but file contents are '${detected}'`,
      }
    }
  }

  return { valid: true, detectedType: detected }
}
