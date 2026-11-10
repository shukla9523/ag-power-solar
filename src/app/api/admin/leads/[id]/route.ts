/**
 * Purpose: update a lead's status / notes (owner, admin) or erase it on request (DPDP).
 */
import { NextRequest } from "next/server"
import { recordAudit } from "@lib/services/audit"
import { z } from "zod"
import { supabaseAdmin } from "@lib/supabase-admin"
import { requireSession, verifyUserRole } from "@lib/auth-helpers"
import { LEAD_STATUSES } from "@lib/config/leads"
import { fail, forbidden, ok, serverError } from "@lib/util/api-response"

type Params = { params: Promise<{ id: string }> }

const PatchSchema = z.object({
  status: z.enum(LEAD_STATUSES).optional(),
  notes: z.string().max(5000).optional(),
})

export async function PATCH(req: NextRequest, { params }: Params) {
  const session = await requireSession(req, ["admin"])
  if (!session) {
    return forbidden("Only admins can update leads")
  }
  const parsed = PatchSchema.safeParse(await req.json().catch(() => null))
  if (!parsed.success) return fail("Invalid update")

  const id = (await params).id
  const { data: before } = await supabaseAdmin.from("contact_leads").select("id, status, notes").eq("id", id).maybeSingle()
  const { error } = await supabaseAdmin
    .from("contact_leads")
    .update({ ...parsed.data, updated_at: new Date().toISOString() })
    .eq("id", id)
  if (error) return serverError("Could not update the lead")
  await recordAudit({ actor: session, action: "lead.update", entityType: "lead", entityKey: id, before, after: { ...(before || {}), ...parsed.data } })
  return ok({ ok: true })
}

export async function DELETE(req: NextRequest, { params }: Params) {
  const session = await requireSession(req, ["admin"])
  if (!session) {
    return forbidden("Only admins can delete leads")
  }
  const id = (await params).id
  const { error } = await supabaseAdmin.from("contact_leads").delete().eq("id", id)
  if (error) return serverError("Could not delete the lead")
  // Personal data is not copied into the audit log (DPDP erasure).
  await recordAudit({ actor: session, action: "lead.erase", entityType: "lead", entityKey: id, before: { erased: false }, after: { erased: true } })
  return ok({ ok: true })
}
