/**
 * Purpose: list (GET) and create (POST) blog posts in the `post` table (admin, marketer).
 * POST is Zod-validated (BlogCreateSchema), HTML is sanitised, images become WebP, and slug
 * collisions — including a race after the slugTaken check — return 409 SLUG_TAKEN.
 * Responses follow @lib/util/api-response; GET returns `{ success, data: Post[] }`.
 */

import { NextRequest } from "next/server"
import { recordAudit } from "@lib/services/audit"
import { webpifyPost } from "@lib/services/webp-storage"
import { supabaseAdmin } from "@lib/supabase-admin"
import { requireSession, verifyUserRole } from "@lib/auth-helpers"
import { revalidateContent } from "@lib/revalidate"
import { normalizeSlug, slugTaken, validateSchedule, writeFailure } from "@lib/services/content-admin"
import { sanitizeRichHtml } from "@lib/util/sanitize"
import { fail, forbidden, ok, okList, serverError, slugTakenFail, validationFail } from "@lib/util/api-response"
import { BlogCreateSchema } from "@lib/validation/admin"

const ROLES = ["admin", "marketer"]

function generateId(prefix: string) {
  return `${prefix}_${crypto.randomUUID().replace(/-/g, "")}`
}

// GET /api/admin/blog - List posts from 'post' table
export async function GET(req: NextRequest) {
  try {
    if (!(await verifyUserRole(req, ROLES))) return forbidden()

    const { data, error } = await supabaseAdmin
      .from("post")
      .select("*")
      .is("deleted_at", null)
      .order("created_at", { ascending: false })
      .limit(500)

    if (error) return serverError("Could not load posts")
    return okList(data || [])
  } catch {
    return serverError("Could not load posts")
  }
}

// POST /api/admin/blog - Create new post in 'post' table
export async function POST(req: NextRequest) {
  try {
    const session = await requireSession(req, ROLES)
    if (!session) return forbidden()

    const parsed = BlogCreateSchema.safeParse(await req.json().catch(() => null))
    if (!parsed.success) return validationFail(parsed.error, "Invalid post")
    const input = parsed.data

    const cleanSlug = normalizeSlug(input.slug || input.title)
    if (!cleanSlug) return fail("Title and slug are required")
    const scheduleError = validateSchedule(input.status, input.publish_at)
    if (scheduleError) return fail(scheduleError, "VALIDATION_ERROR")
    if (await slugTaken("post", cleanSlug)) return slugTakenFail(cleanSlug)

    // Images in our storage are converted to WebP before the post is saved.
    const images = await webpifyPost({ featured_image: input.featured_image, image_urls: input.image_urls, content: input.content })
    const status = input.status || "draft"
    const now = new Date().toISOString()

    const { data, error } = await supabaseAdmin
      .from("post")
      .insert({
        id: generateId("post"),
        title: input.title,
        slug: cleanSlug,
        category_id: input.category_id || null,
        featured_image: images.featured_image || "",
        image_urls: images.image_urls || [],
        excerpt: input.excerpt || "",
        content: sanitizeRichHtml(images.content || ""),
        author_name: input.author_name || "Mommantum Team",
        meta_title: input.meta_title || input.title,
        meta_description: input.meta_description || input.excerpt || "",
        status,
        faqs: input.faqs || [],
        published_at: status === "published" ? now : null,
        ...(status === "scheduled" ? { publish_at: input.publish_at } : {}),
        created_at: now,
        updated_at: now,
      })
      .select()
      .single()

    if (error) return writeFailure(error, cleanSlug, "Could not create the post")

    await recordAudit({ actor: session, action: "blog.create", entityType: "post", entityKey: String(data?.id), before: null, after: data })
    await revalidateContent({ type: "blog", slug: cleanSlug })
    return ok({ ok: true, data })
  } catch {
    return serverError("Could not create the post")
  }
}
