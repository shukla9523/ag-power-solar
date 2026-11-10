/**
 * Purpose: admin notification bell — latest notifications + unread count; mark as read.
 * GET → { notifications, unread }   POST { ids?: string[], all?: true } → mark read
 */
import { NextRequest } from "next/server"
import { z } from "zod"
import { supabaseAdmin } from "@lib/supabase-admin"
import { verifyUserRole } from "@lib/auth-helpers"
import { fail, forbidden, ok, serverError } from "@lib/util/api-response"

export async function GET(req: NextRequest) {
  if (!(await verifyUserRole(req, ["admin", "marketer"]))) {
    return forbidden()
  }
  const [list, unread] = await Promise.all([
    supabaseAdmin.from("admin_notifications").select("*").order("created_at", { ascending: false }).limit(30),
    supabaseAdmin.from("admin_notifications").select("id", { count: "exact", head: true }).is("read_at", null),
  ])
  if (list.error) return ok({ notifications: [], unread: 0, unavailable: true })
  return ok({ notifications: list.data || [], unread: unread.count || 0 })
}

export async function POST(req: NextRequest) {
  if (!(await verifyUserRole(req, ["admin", "marketer"]))) {
    return forbidden()
  }
  const parsed = z
    .object({ ids: z.array(z.string().uuid()).max(100).optional(), all: z.boolean().optional() })
    .safeParse(await req.json().catch(() => null))
  if (!parsed.success) return fail("Invalid request")

  let query = supabaseAdmin.from("admin_notifications").update({ read_at: new Date().toISOString() }).is("read_at", null)
  if (!parsed.data.all) query = query.in("id", parsed.data.ids || [])
  const { error } = await query
  if (error) return serverError("Could not update notifications")
  return ok({ ok: true })
}
