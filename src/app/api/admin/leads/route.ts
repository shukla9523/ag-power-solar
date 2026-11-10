/**
 * Purpose: leads inbox — paginated list with search and filters, plus counters.
 * GET ?page=1&limit=25&status=new&source=editz&q=acme
 * Marketers see leads with the email and phone masked (review S12: least privilege for
 * personal data); owner and admin see full details.
 */
import { NextRequest } from "next/server"
import { supabaseAdmin } from "@lib/supabase-admin"
import { requireSession } from "@lib/auth-helpers"
import { maskLeadPii } from "@lib/util/mask-pii"
import { LEAD_SOURCES, LEAD_STATUSES } from "@lib/config/leads"
import { sheetTarget } from "@lib/services/google-sheets"
import { forbidden, ok, pageMeta, serverError } from "@lib/util/api-response"

export async function GET(req: NextRequest) {
  const session = await requireSession(req, ["admin", "marketer"])
  if (!session) {
    return forbidden()
  }
  const fullAccess = session.role === "owner" || session.role === "admin"

  const params = req.nextUrl.searchParams
  const page = Math.max(1, Number(params.get("page")) || 1)
  const limit = Math.min(100, Math.max(1, Number(params.get("limit")) || 25))
  const status = params.get("status")
  const source = params.get("source")
  const q = (params.get("q") || "").trim().slice(0, 100)

  let query = supabaseAdmin
    .from("contact_leads")
    .select("id, name, email, phone, subject, message, source, source_page, status, notes, sheet_status, email_status, created_at", { count: "exact" })
    .order("created_at", { ascending: false })
    .range((page - 1) * limit, page * limit - 1)

  if (status && (LEAD_STATUSES as readonly string[]).includes(status)) query = query.eq("status", status)
  if (source && (LEAD_SOURCES as readonly string[]).includes(source)) query = query.eq("source", source)
  if (q) {
    const safe = q.replace(/[%,()]/g, " ")
    query = query.or(`name.ilike.%${safe}%,email.ilike.%${safe}%,subject.ilike.%${safe}%`)
  }

  const { data, count, error } = await query
  if (error) {
    return serverError("Leads are unavailable. Run the 2026-11-08 database migration if this is a new setup.")
  }

  const { data: setting } = await supabaseAdmin.from("site_setting").select("leads_sheet_url").limit(1)
  return ok({
    leads: fullAccess ? data || [] : (data || []).map(maskLeadPii),
    piiMasked: !fullAccess,
    meta: pageMeta(page, limit, count || 0),
    sheetUrl: fullAccess ? setting?.[0]?.leads_sheet_url || process.env.LEADS_SHEET_URL || null : null,
    sheetTarget: sheetTarget(),
  })
}
