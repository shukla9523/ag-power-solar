/**
 * Purpose: integration health for Admin → Settings (owner / admin).
 * GET → which integrations are configured (never returns secret values).
 * POST { action: "test-email" } → sends a Zoho SMTP test email to the signed-in user.
 */
import { NextRequest } from "next/server"
import { requireSession } from "@lib/auth-helpers"
import { isMailerConfigured, sendMail, brandedEmail } from "@lib/services/mailer"
import { sheetTarget } from "@lib/services/google-sheets"
import { isAiEnabled } from "@lib/services/ai-provider"
import { getOwnerEmail } from "@lib/config/owner"
import { fail, forbidden, ok } from "@lib/util/api-response"

export async function GET(req: NextRequest) {
  if (!(await requireSession(req, ["admin"]))) {
    return forbidden()
  }
  const env = process.env
  return ok({
    ownerEmail: getOwnerEmail(),
    integrations: [
      { key: "smtp", label: "Zoho SMTP (emails)", ok: isMailerConfigured(), detail: env.ZOHO_SMTP_HOST || "smtp.zoho.in" },
      { key: "sheets", label: "Google Sheet copy of leads", ok: true, detail: sheetTarget() === "sheets-api" ? "Sheets API (service account)" : "Google Form fallback" },
      { key: "ai", label: "AI (meta fill)", ok: isAiEnabled(), detail: env.CLOUDFLARE_ACCOUNT_ID ? "Cloudflare Workers AI" : env.OPENAI_API_KEY ? "OpenAI" : "Not configured" },
      { key: "ai-images", label: "AI images", ok: Boolean(env.CLOUDFLARE_ACCOUNT_ID && env.CLOUDFLARE_API_TOKEN) && env.AI_ENABLED !== "false", detail: "Cloudflare Workers AI (FLUX)" },
      { key: "gateway", label: "Cloudflare AI Gateway", ok: Boolean(env.CLOUDFLARE_AI_GATEWAY), detail: env.CLOUDFLARE_AI_GATEWAY ? "Enabled" : "Direct API (optional)" },
      { key: "turnstile", label: "Spam protection (Turnstile)", ok: Boolean(env.TURNSTILE_SECRET_KEY && env.NEXT_PUBLIC_TURNSTILE_SITE_KEY), detail: "Optional" },
      { key: "cron", label: "Scheduled jobs (CRON_SECRET)", ok: Boolean(env.CRON_SECRET), detail: "Required for monthly AI fill and daily lead retry" },
      { key: "publish", label: "Blog publishing API key", ok: Boolean(env.PUBLISH_API_KEY || env.N8N_API_KEY), detail: env.PUBLISH_API_KEY ? "PUBLISH_API_KEY" : "N8N_API_KEY (legacy)" },
      { key: "jwt", label: "Local JWT verification", ok: Boolean(env.SUPABASE_JWT_SECRET), detail: env.SUPABASE_JWT_SECRET ? "Fast path enabled" : "Verifying via Supabase Auth" },
    ],
  })
}

export async function POST(req: NextRequest) {
  const session = await requireSession(req, ["admin"])
  if (!session) return forbidden()
  const body = (await req.json().catch(() => null)) as { action?: string } | null
  if (body?.action !== "test-email") return fail("Unknown action")

  const result = await sendMail({
    to: session.email,
    subject: "Mommantum SMTP test",
    text: "Zoho SMTP is working for the Mommantum admin panel.",
    html: brandedEmail("SMTP is working", `<p style="font-size:14px">Zoho SMTP is configured correctly for the Mommantum admin panel.</p>`),
  })
  return result.sent
    ? ok({ ok: true, message: `Test email sent to ${session.email}` })
    : fail(
        result.error === "SMTP not configured"
          ? "Email failed: SMTP is not configured"
          : "Email failed. Check the Zoho SMTP settings and the server logs.",
        "UPSTREAM_ERROR",
        502
      )
}
