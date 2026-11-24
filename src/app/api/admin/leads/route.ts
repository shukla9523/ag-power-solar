/**
 * Purpose: Leads inbox — paginated list with search and filters, plus total counts.
 * GET ?page=1&limit=25&status=new&q=acme
 */
import { NextRequest } from "next/server"
import { supabaseAdmin } from "@lib/supabase-admin"
import { requireSession } from "@lib/auth-helpers"
import { maskLeadPii } from "@lib/util/mask-pii"
import { forbidden, ok, pageMeta, serverError } from "@lib/util/api-response"

export async function GET(req: NextRequest) {
  const session = await requireSession(req, ["owner", "editor", "admin", "marketer"])
  if (!session) {
    return forbidden()
  }
  const fullAccess = session.role === "owner" || session.role === "admin" || session.role === "editor"

  const params = req.nextUrl.searchParams
  const page = Math.max(1, Number(params.get("page")) || 1)
  const limit = Math.min(100, Math.max(1, Number(params.get("limit")) || 25))
  const status = params.get("status")
  const source = params.get("source")
  const q = (params.get("q") || "").trim().slice(0, 100)

  // Query `leads` table first
  let query = supabaseAdmin
    .from("leads")
    .select("id, name, email, phone, message, source_page, status, is_read, notes, created_at", { count: "exact" })
    .order("created_at", { ascending: false })
    .range((page - 1) * limit, page * limit - 1)

  if (status && status !== "all") query = query.eq("status", status)
  if (source && source !== "all") query = query.eq("source_page", source)
  if (q) {
    const safe = q.replace(/[%,()]/g, " ")
    query = query.or(`name.ilike.%${safe}%,email.ilike.%${safe}%,message.ilike.%${safe}%`)
  }

  let { data, count, error } = await query

  // Fallback to legacy contact_leads table if leads table has not been populated yet
  if (error || !data || data.length === 0) {
    let legacyQuery = supabaseAdmin
      .from("contact_leads")
      .select("id, name, email, phone, subject, message, source, source_page, status, notes, sheet_status, email_status, created_at", { count: "exact" })
      .order("created_at", { ascending: false })
      .range((page - 1) * limit, page * limit - 1)

    if (status && status !== "all") legacyQuery = legacyQuery.eq("status", status)
    if (source && source !== "all") legacyQuery = legacyQuery.eq("source", source)
    if (q) {
      const safe = q.replace(/[%,()]/g, " ")
      legacyQuery = legacyQuery.or(`name.ilike.%${safe}%,email.ilike.%${safe}%,subject.ilike.%${safe}%`)
    }

    const legacyRes = await legacyQuery
    if (!legacyRes.error && legacyRes.data && legacyRes.data.length > 0) {
      data = legacyRes.data.map((l: any) => ({ ...l, is_read: false }))
      count = legacyRes.count
    }
  }

  const { data: setting } = await supabaseAdmin.from("site_settings").select("base_url").limit(1)

  return ok({
    leads: fullAccess ? data || [] : (data || []).map(maskLeadPii),
    piiMasked: !fullAccess,
    meta: pageMeta(page, limit, count || 0),
    sheetUrl: process.env.GOOGLE_SHEET_WEBHOOK_URL || null,
  })
}
