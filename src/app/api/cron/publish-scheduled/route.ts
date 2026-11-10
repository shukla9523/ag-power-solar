/**
 * Purpose: Vercel Cron — publishes scheduled blog posts whose publish time has passed.
 * Bearer CRON_SECRET. Runs daily on Vercel Hobby (hourly is possible on Pro).
 * Failures notify admins and return a generic 500 (runCronJob).
 */
import { NextRequest } from "next/server"
import { isCronRequest } from "@lib/util/api-key"
import { publishDuePosts } from "@lib/data/blog-preview"
import { revalidateContent } from "@lib/revalidate"
import { recordAudit } from "@lib/services/audit"
import { notifyAdmins } from "@lib/services/notifications"
import { ok, unauthorized } from "@lib/util/api-response"
import { runCronJob } from "../_lib/run-job"

export async function GET(req: NextRequest) {
  return runCronJob("Publish scheduled posts", async () => {
    if (!isCronRequest(req)) return unauthorized()

    const published = await publishDuePosts()
    for (const post of published) {
      await revalidateContent({ type: "blog", slug: post.slug })
      await recordAudit({ actorType: "cron", action: "blog.published", entityType: "post", entityKey: post.id, before: { status: "scheduled" }, after: { status: "published" } })
    }
    if (published.length) {
      await notifyAdmins({
        type: "system",
        title: "Scheduled posts published",
        body: published.map((p) => `"${p.title}"`).join(", "),
        link: "/admin/blog",
      })
    }
    return ok({ published: published.map((p) => p.slug) })
  })
}
