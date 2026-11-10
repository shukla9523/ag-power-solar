/**
 * Purpose: server-side validation for image uploads.
 *
 * Why: the browser-supplied MIME type and filename can be forged, and SVG can carry
 * scripts. The real type is detected from magic bytes, only PNG / JPEG / WebP / GIF
 * are accepted, and size is capped before anything reaches Storage.
 */

export const MAX_IMAGE_BYTES = 5 * 1024 * 1024
export const MAX_FILES_PER_REQUEST = 10

export type ImageKind = { mime: "image/png" | "image/jpeg" | "image/webp" | "image/gif"; ext: "png" | "jpg" | "webp" | "gif" }

export function detectImageType(bytes: Uint8Array): ImageKind | null {
  if (bytes.length < 12) return null
  if (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47) {
    return { mime: "image/png", ext: "png" }
  }
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
    return { mime: "image/jpeg", ext: "jpg" }
  }
  if (
    bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46 &&
    bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50
  ) {
    return { mime: "image/webp", ext: "webp" }
  }
  if (bytes[0] === 0x47 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x38) {
    return { mime: "image/gif", ext: "gif" }
  }
  return null
}

export type ImageCheck =
  | { ok: true; kind: ImageKind }
  | { ok: false; status: 400 | 413 | 415; error: string }

export function validateImageBytes(bytes: Uint8Array): ImageCheck {
  if (bytes.byteLength === 0) return { ok: false, status: 400, error: "Empty file" }
  if (bytes.byteLength > MAX_IMAGE_BYTES) {
    return { ok: false, status: 413, error: "Image is larger than 5 MB" }
  }
  const kind = detectImageType(bytes)
  if (!kind) return { ok: false, status: 415, error: "Only PNG, JPEG, WebP or GIF images are allowed" }
  return { ok: true, kind }
}

/** Builds a safe storage object name: lowercase slug + timestamp + entropy + real extension. */
export function safeObjectName(originalName: string, ext: string): string {
  const base = originalName
    .replace(/\.[^/.]+$/, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60)
  return `${base || "image"}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}.${ext}`
}

/** Names produced by safeObjectName (used to validate delete requests). */
export const SAFE_OBJECT_NAME = /^[a-z0-9-]{1,80}\.(png|jpe?g|webp|gif)$/
