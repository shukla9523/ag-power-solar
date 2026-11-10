/**
 * Purpose: read / update the site-wide settings row (`site_setting`).
 * Only whitelisted columns can be written (no mass assignment). Owner/admin only.
 * The admin URL itself is configured with the CUSTOM_ADMIN_PATH env variable.
 */

import { NextRequest } from "next/server"
import { recordAudit } from "@lib/services/audit"
import { z } from "zod"
import { supabaseAdmin } from "@lib/supabase-admin"
import { requireSession, verifyUserRole } from "@lib/auth-helpers"
import { revalidateContent } from "@lib/revalidate"
import { validateThemeTokens } from "@lib/theme/theme-tokens"
import { fail, forbidden, ok, serverError } from "@lib/util/api-response"

const SiteSchema = z
  .object({
    site_name: z.string().trim().max(120).nullish(),
    brand_name: z.string().trim().max(120).nullish(),
    site_url: z.string().trim().url().max(200).nullish(),
    logo_url: z.string().trim().max(500).nullish(),
    favicon_url: z.string().trim().max(500).nullish(),
    default_og_image: z.string().trim().max(500).nullish(),
    twitter_handle: z.string().trim().max(50).nullish(),
    google_site_verification: z.string().trim().max(200).nullish(),
    leads_sheet_url: z.string().trim().url().max(500).nullish(),
    theme_tokens: z.record(z.string(), z.string()).nullish(),
  })
  .strict()

export async function GET(req: NextRequest) {
  if (!(await verifyUserRole(req, ["admin", "marketer"]))) {
    return forbidden()
  }
  const { data, error } = await supabaseAdmin.from("site_setting").select("*").limit(1)
  if (error) return serverError("Could not load site settings")
  return ok({ setting: data?.[0] || null })
}

export async function POST(req: NextRequest) {
  const session = await requireSession(req, ["admin"])
  if (!session) {
    return forbidden("Only admins can change site settings")
  }

  const raw = ((await req.json().catch(() => null)) || {}) as Record<string, unknown>
  delete raw.id
  delete raw.custom_admin_path
  delete raw.created_at
  delete raw.updated_at
  const parsed = SiteSchema.safeParse(raw)
  if (!parsed.success) {
    return fail(`Invalid field: ${parsed.error.issues[0]?.path.join(".") || "payload"}`, "VALIDATION_ERROR")
  }

  if (parsed.data.theme_tokens) {
    const theme = validateThemeTokens(parsed.data.theme_tokens)
    if ("error" in theme) return fail(theme.error)
    parsed.data.theme_tokens = theme.tokens
  }

  const { data: existing } = await supabaseAdmin.from("site_setting").select("*").limit(1)
  const result = existing?.[0]?.id
    ? await supabaseAdmin.from("site_setting").update(parsed.data).eq("id", existing[0].id).select().single()
    : await supabaseAdmin.from("site_setting").insert({ id: crypto.randomUUID(), ...parsed.data }).select().single()

  if (result.error) {
    return serverError("Could not save site settings (is the column migrated?)")
  }

  await recordAudit({ actor: session, action: "site.update", entityType: "site", entityKey: "site_setting", before: existing?.[0] || null, after: result.data })
  await revalidateContent({ type: "site_setting" })
  return ok({ setting: result.data })
}
