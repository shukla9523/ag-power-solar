/**
 * Purpose: admin media library for blog images (list / upload / delete) in Storage.
 * Uploads are Zod-validated (BlogImageUploadSchema) and checked by magic bytes
 * (PNG/JPEG/WebP/GIF, ≤ 5 MB); deletes accept only object names produced by our own
 * naming rule, so no other path can be removed.
 */

import { NextRequest } from "next/server"
import { supabaseAdmin } from "@lib/supabase-admin"
import { verifyUserRole } from "@lib/auth-helpers"
import { MAX_IMAGE_BYTES, SAFE_OBJECT_NAME, safeObjectName, validateImageBytes } from "@lib/util/image-validation"
import { toWebp } from "@lib/util/to-webp"
import { fail, forbidden, ok, serverError, validationFail } from "@lib/util/api-response"
import { BlogImageUploadSchema } from "@lib/validation/admin"

const BUCKET = "blog-images"
const ROLES = ["admin", "marketer"]
const MAX_BASE64_CHARS = Math.ceil((MAX_IMAGE_BYTES * 4) / 3) + 16

function publicUrl(name: string): string {
  return supabaseAdmin.storage.from(BUCKET).getPublicUrl(name).data.publicUrl
}

export async function GET(req: NextRequest) {
  if (!(await verifyUserRole(req, ROLES))) return forbidden()
  const { data, error } = await supabaseAdmin.storage
    .from(BUCKET)
    .list("", { limit: 200, offset: 0, sortBy: { column: "created_at", order: "desc" } })
  if (error) return serverError("Could not load images")

  const images = (data || [])
    .filter((f) => /\.(jpe?g|png|webp|gif)$/i.test(f.name))
    .map((f) => ({ name: f.name, url: publicUrl(f.name), created_at: f.created_at }))
  return ok({ images })
}

export async function POST(req: NextRequest) {
  if (!(await verifyUserRole(req, ROLES))) return forbidden()

  const body = (await req.json().catch(() => null)) as { data?: unknown } | null
  // base64 is ~4/3 of the binary size; reject oversize payloads before parsing or decoding.
  if (typeof body?.data === "string" && body.data.length > MAX_BASE64_CHARS) {
    return fail("Image is larger than 5 MB", "PAYLOAD_TOO_LARGE", 413)
  }
  const parsed = BlogImageUploadSchema.safeParse(body)
  if (!parsed.success) return validationFail(parsed.error, "Image file is required")

  const bytes = new Uint8Array(Buffer.from(parsed.data.data, "base64"))
  const check = validateImageBytes(bytes)
  if (!check.ok) return fail(check.error, check.status === 413 ? "PAYLOAD_TOO_LARGE" : "VALIDATION_ERROR", check.status)

  // Every stored image is WebP.
  const webp = await toWebp(bytes)
  const name = safeObjectName(parsed.data.name, "webp")
  const { error } = await supabaseAdmin.storage
    .from(BUCKET)
    .upload(name, webp.buffer, { contentType: "image/webp", upsert: false, cacheControl: "31536000" })
  if (error) return serverError("Upload failed")

  return ok({ name, url: publicUrl(name), created_at: new Date().toISOString() })
}

export async function DELETE(req: NextRequest) {
  if (!(await verifyUserRole(req, ROLES))) return forbidden()
  const name = req.nextUrl.searchParams.get("name") || ""
  if (!SAFE_OBJECT_NAME.test(name)) return fail("Invalid image name", "VALIDATION_ERROR")
  const { error } = await supabaseAdmin.storage.from(BUCKET).remove([name])
  if (error) return serverError("Delete failed")
  return ok({ ok: true })
}
