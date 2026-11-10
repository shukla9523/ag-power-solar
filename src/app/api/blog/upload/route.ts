/**
 * Purpose: image upload endpoint for the external blog pipeline (n8n / auto-blog engine).
 *
 * - Bearer PUBLISH_API_KEY (constant-time check).
 * - multipart/form-data under `files` (or `file`), max 10 files, 5 MB each.
 * - Real type detected from magic bytes; PNG/JPEG/WebP/GIF only (no SVG).
 * - Every image is converted to WebP before it is stored.
 * - Returns { success: true, files: [{ url }] } with public Storage URLs.
 */

import { NextRequest } from "next/server"
import { supabaseAdmin } from "@lib/supabase-admin"
import { isPublishRequest } from "@lib/util/api-key"
import { MAX_FILES_PER_REQUEST, safeObjectName, validateImageBytes } from "@lib/util/image-validation"
import { toWebp } from "@lib/util/to-webp"
import { fail, failWithStatus, ok, serverError, unauthorized } from "@lib/util/api-response"

const BLOG_IMAGES_BUCKET = "blog-images"
let isBucketReady = false

async function ensureBucket(): Promise<void> {
  if (isBucketReady) return
  const { data: bucket } = await supabaseAdmin.storage.getBucket(BLOG_IMAGES_BUCKET)
  if (!bucket) {
    const { error } = await supabaseAdmin.storage.createBucket(BLOG_IMAGES_BUCKET, {
      public: true,
      fileSizeLimit: "5MB",
      allowedMimeTypes: ["image/png", "image/jpeg", "image/webp", "image/gif"],
    })
    if (error && !/exists|duplicate/i.test(error.message || "")) {
      throw new Error("Storage bucket unavailable")
    }
  } else if (!bucket.public) {
    await supabaseAdmin.storage.updateBucket(BLOG_IMAGES_BUCKET, { public: true })
  }
  isBucketReady = true
}

export async function POST(req: NextRequest) {
  if (!isPublishRequest(req)) return unauthorized()

  try {
    const formData = await req.formData()
    let entries = formData.getAll("files")
    if (entries.length === 0) {
      const single = formData.get("file")
      if (single) entries = [single]
    }

    const files = entries.filter((e): e is File => typeof e !== "string")
    if (files.length === 0) {
      return fail("Attach images under the 'files' field", "VALIDATION_ERROR")
    }
    if (files.length > MAX_FILES_PER_REQUEST) {
      return fail(`At most ${MAX_FILES_PER_REQUEST} files per request`, "VALIDATION_ERROR")
    }

    await ensureBucket()
    const uploaded: Array<{ url: string }> = []

    for (const file of files) {
      if (file.size > 5 * 1024 * 1024) {
        return fail(`'${file.name}' is larger than 5 MB`, "PAYLOAD_TOO_LARGE", 413)
      }
      const bytes = new Uint8Array(await file.arrayBuffer())
      const check = validateImageBytes(bytes)
      if (!check.ok) {
        return failWithStatus(`'${file.name}': ${check.error}`, check.status)
      }

      // Every stored image is WebP (smaller, same quality).
      const webp = await toWebp(bytes)
      const path = safeObjectName(file.name || "upload", "webp")
      const { error } = await supabaseAdmin.storage
        .from(BLOG_IMAGES_BUCKET)
        .upload(path, webp.buffer, { contentType: "image/webp", upsert: false, cacheControl: "31536000" })
      if (error) {
        return serverError("Upload failed")
      }
      uploaded.push({ url: supabaseAdmin.storage.from(BLOG_IMAGES_BUCKET).getPublicUrl(path).data.publicUrl })
    }

    return ok({ files: uploaded })
  } catch {
    return serverError("Upload failed")
  }
}
