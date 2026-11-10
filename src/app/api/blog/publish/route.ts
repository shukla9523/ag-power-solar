/**
 * Purpose: publishing endpoint for the external blog pipeline (n8n / Blog-AI engine).
 *
 * - Bearer PUBLISH_API_KEY (constant-time check).
 * - Zod-validated payload; HTML is sanitised before it is stored.
 * - Slug collisions return 409 SLUG_TAKEN instead of a raw database error (also when a
 *   concurrent insert wins the race: Postgres 23505 is mapped to 409).
 * - Responses follow @lib/util/api-response: `{ success, post }` or
 *   `{ success: false, error, code, details? }`.
 * - Published posts revalidate the blog caches and notify admins. Search engines pick
 *   the post up from the sitemap (the Google Indexing API is not used: it only supports
 *   JobPosting / BroadcastEvent pages).
 */

import { NextRequest } from "next/server"
import { z } from "zod"
import { supabaseAdmin } from "@lib/supabase-admin"
import { recordAudit } from "@lib/services/audit"
import { revalidateContent } from "@lib/revalidate"
import { isPublishRequest } from "@lib/util/api-key"
import { sanitizeRichHtml } from "@lib/util/sanitize"
import { toSlug } from "@lib/util/slug"
import { notifyAdmins } from "@lib/services/notifications"
import { webpifyPost } from "@lib/services/webp-storage"
import { isUniqueViolation } from "@lib/util/db-write"
import { fail, ok, serverError, slugTakenFail, unauthorized } from "@lib/util/api-response"

const PublishSchema = z.object({
  title: z.string().trim().min(3).max(200),
  slug: z.string().trim().max(120).nullish(),
  status: z.enum(["draft", "published"]).nullish(),
  content: z.string().min(50).max(500_000),
  category_id: z.string().trim().max(100).nullish(),
  meta_title: z.string().trim().max(120).nullish(),
  meta_description: z.string().trim().max(320).nullish(),
  excerpt: z.string().trim().max(1000).nullish(),
  featured_image: z.string().trim().url().max(1000).nullish(),
  image_urls: z.array(z.string().trim().url().max(1000)).max(20).nullish(),
  author_name: z.string().trim().max(100).nullish(),
  faqs: z
    .array(z.object({ question: z.string().trim().min(1).max(300), answer: z.string().trim().min(1).max(2000) }))
    .max(20)
    .nullish(),
})

export async function POST(req: NextRequest) {
  if (!isPublishRequest(req)) return unauthorized()

  const parsed = PublishSchema.safeParse(await req.json().catch(() => null))
  if (!parsed.success) {
    return fail("Invalid payload", "VALIDATION_ERROR", 400, {
      details: parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`),
    })
  }
  const input = parsed.data

  const slug = toSlug(input.slug || input.title)
  if (!slug) return fail("Could not derive a slug", "VALIDATION_ERROR")

  const { data: existing } = await supabaseAdmin.from("post").select("id").eq("slug", slug).maybeSingle()
  if (existing) return fail(`A post with slug '${slug}' already exists`, "SLUG_TAKEN", 409)

  // Images that live in our storage but are not WebP are converted and the URLs swapped.
  const images = await webpifyPost({
    featured_image: input.featured_image || null,
    image_urls: input.image_urls || [],
    content: sanitizeRichHtml(input.content),
  })

  const status = input.status === "draft" ? "draft" : "published"
  const now = new Date().toISOString()

  const { data, error } = await supabaseAdmin
    .from("post")
    .insert({
      id: `post_${crypto.randomUUID().replace(/-/g, "")}`,
      title: input.title,
      slug,
      content: images.content,
      category_id: input.category_id || null,
      meta_title: input.meta_title || input.title,
      meta_description: input.meta_description || input.excerpt || "",
      excerpt: input.excerpt || "",
      featured_image: images.featured_image,
      image_urls: images.image_urls,
      author_name: input.author_name || "Mommantum Team",
      faqs: input.faqs || [],
      status,
      published_at: status === "published" ? now : null,
      created_at: now,
      updated_at: now,
    })
    .select()
    .single()

  if (isUniqueViolation(error)) return slugTakenFail(slug)
  if (error || !data) return serverError("Could not save the post")

  await recordAudit({ actorType: "api", action: `blog.${status === "published" ? "publish" : "create"}`, entityType: "post", entityKey: String(data.id), before: null, after: data })

  if (status === "published") {
    await revalidateContent({ type: "blog", slug })
    await notifyAdmins({
      type: "system",
      title: "New blog post published",
      body: `"${input.title}" was published by the publishing API.`,
      link: "/admin/blog",
    })
  }

  return ok({ post: data })
}
