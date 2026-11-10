/**
 * Purpose: admin notifications (bell in the admin header) with optional email to the owner.
 *
 * Why: new leads, access requests, finished AI jobs and failed deliveries need to reach
 * the team without anyone polling a table. Notifications are stored in
 * `admin_notifications`; email goes through the Zoho mailer. Never throws.
 */

import "server-only"
import { supabaseAdmin } from "@lib/supabase-admin"
import { getOwnerEmail } from "@lib/config/owner"
import { brandedEmail, escapeHtml, sendMail } from "./mailer"

export type NotificationType =
  | "lead"
  | "access_request"
  | "ai_job"
  | "delivery_failed"
  | "seo_report"
  | "system"

export interface NotifyInput {
  type: NotificationType
  title: string
  body: string
  link?: string
  /** Also email the owner (and NOTIFY_EMAILS) through Zoho SMTP. */
  email?: boolean
}

export async function notifyAdmins(input: NotifyInput): Promise<void> {
  try {
    await supabaseAdmin.from("admin_notifications").insert({
      type: input.type,
      title: input.title.slice(0, 200),
      body: input.body.slice(0, 2000),
      link: input.link || null,
    })
  } catch {
    // Table may not exist before the migration runs; email below still works.
  }

  if (!input.email) return

  const recipients = new Set<string>([getOwnerEmail()])
  for (const extra of (process.env.NOTIFY_EMAILS || "").split(",")) {
    if (extra.trim()) recipients.add(extra.trim().toLowerCase())
  }

  const base = (process.env.NEXT_PUBLIC_BASE_URL || "https://www.mommantum.com").replace(/\/+$/, "")
  const adminBase = `${base}/${process.env.CUSTOM_ADMIN_PATH || "admin"}`
  const href = input.link ? `${adminBase}${input.link.replace(/^\/admin/, "")}` : adminBase

  await sendMail({
    to: Array.from(recipients),
    subject: `[Mommantum] ${input.title}`,
    text: `${input.body}\n\nOpen: ${href}`,
    html: brandedEmail(
      input.title,
      `<p style="font-size:14px;line-height:1.6">${escapeHtml(input.body)}</p>
       <p><a href="${escapeHtml(href)}" style="display:inline-block;background:#e61e73;color:#ffffff;padding:10px 18px;border-radius:999px;text-decoration:none;font-size:14px">Open admin panel</a></p>`
    ),
  })
}
