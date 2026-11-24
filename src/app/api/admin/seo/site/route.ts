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
    legal_name: z.string().trim().max(200).nullish(),
    tagline: z.string().trim().max(300).nullish(),
    phone: z.string().trim().max(30).nullish(),
    whatsapp: z.string().trim().max(30).nullish(),
    email: z.string().trim().max(150).nullish(),
    address: z.string().trim().max(500).nullish(),
    google_maps_url: z.string().trim().max(500).nullish(),
    instagram_url: z.string().trim().max(500).nullish(),
    facebook_url: z.string().trim().max(500).nullish(),
    linkedin_url: z.string().trim().max(500).nullish(),
    youtube_url: z.string().trim().max(500).nullish(),
    site_url: z.string().trim().max(200).nullish(),
    logo_url: z.string().trim().max(500).nullish(),
    favicon_url: z.string().trim().max(500).nullish(),
    default_og_image: z.string().trim().max(500).nullish(),
    twitter_handle: z.string().trim().max(50).nullish(),
    google_site_verification: z.string().trim().max(200).nullish(),
    leads_sheet_url: z.string().trim().max(500).nullish(),
    theme_tokens: z.record(z.string(), z.string()).nullish(),
  })

export async function GET(req: NextRequest) {
  if (!(await verifyUserRole(req, ["admin", "owner", "editor", "marketer"]))) {
    return forbidden()
  }
  let { data, error } = await supabaseAdmin.from("site_settings").select("*").limit(1)
  if (error || !data || data.length === 0) {
    const fallback = await supabaseAdmin.from("site_setting").select("*").limit(1)
    data = fallback.data
    error = fallback.error
  }
  if (error) return serverError("Could not load site settings")
  return ok({ setting: data?.[0] || null })
}

export async function POST(req: NextRequest) {
  const session = await requireSession(req, ["admin", "owner"])
  if (!session) {
    return forbidden("Only admins and owners can change site settings")
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

  // Determine target table (site_settings first, then site_setting)
  let targetTable = "site_settings"
  let { data: existing, error: checkErr } = await supabaseAdmin.from("site_settings").select("*").limit(1)
  if (checkErr || !existing) {
    targetTable = "site_setting"
    const fb = await supabaseAdmin.from("site_setting").select("*").limit(1)
    existing = fb.data
  }

  const result = existing?.[0]?.id
    ? await supabaseAdmin.from(targetTable).update(parsed.data).eq("id", existing[0].id).select().single()
    : await supabaseAdmin.from(targetTable).insert({ id: crypto.randomUUID(), ...parsed.data }).select().single()

  if (result.error) {
    // If saving with new columns failed on site_setting, strip non-existent columns and retry
    if (targetTable === "site_setting") {
      const { legal_name, tagline, phone, whatsapp, email, address, google_maps_url, instagram_url, facebook_url, linkedin_url, youtube_url, ...legacyData } = parsed.data
      const retry = existing?.[0]?.id
        ? await supabaseAdmin.from("site_setting").update(legacyData).eq("id", existing[0].id).select().single()
        : await supabaseAdmin.from("site_setting").insert({ id: crypto.randomUUID(), ...legacyData }).select().single()
      if (retry.error) {
        return serverError("Could not save site settings: " + retry.error.message)
      }
      result.data = retry.data
    } else {
      return serverError("Could not save site settings: " + result.error.message)
    }
  }

  await recordAudit({ actor: session, action: "site.update", entityType: "site", entityKey: targetTable, before: existing?.[0] || null, after: result.data })
  await revalidateContent({ type: "site_setting" })
  return ok({ setting: result.data })
}
