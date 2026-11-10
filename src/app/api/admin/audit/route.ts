/**
 * Purpose: audit log listing for owner / admin.
 * GET ?page=&limit=&entity_type=&entity_key=&actor=&action=
 */
import { NextRequest } from "next/server"
import { supabaseAdmin } from "@lib/supabase-admin"
import { requireSession } from "@lib/auth-helpers"
import { fail, forbidden, ok, pageMeta } from "@lib/util/api-response"

export async function GET(req: NextRequest) {
  if (!(await requireSession(req, ["admin"]))) {
    return forbidden("Only owner and admins can view the audit log")
  }
  const p = req.nextUrl.searchParams
  const page = Math.max(1, Number(p.get("page")) || 1)
  const limit = Math.min(100, Math.max(1, Number(p.get("limit")) || 30))

  let query = supabaseAdmin
    .from("audit_log")
    .select("id, actor_email, actor_type, action, entity_type, entity_key, changed_fields, before, after, restored_from, created_at", { count: "exact" })
    .order("created_at", { ascending: false })
    .range((page - 1) * limit, page * limit - 1)

  const entityType = p.get("entity_type")
  const entityKey = p.get("entity_key")
  const actor = p.get("actor")
  const action = p.get("action")
  if (entityType) query = query.eq("entity_type", entityType)
  if (entityKey) query = query.eq("entity_key", entityKey)
  if (actor) query = query.ilike("actor_email", `%${actor.replace(/[%,()]/g, "")}%`)
  if (action) query = query.ilike("action", `${action.replace(/[%,()]/g, "")}%`)

  const { data, count, error } = await query
  if (error) {
    return fail("Audit log unavailable — run database migration M-05.", "UNAVAILABLE", 503)
  }
  return ok({ entries: data || [], meta: pageMeta(page, limit, count || 0) })
}
