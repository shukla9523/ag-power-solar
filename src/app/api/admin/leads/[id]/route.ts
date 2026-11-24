/**
 * Purpose: Update a lead's status / is_read / notes (owner, editor, admin) or delete it.
 */
import { NextRequest } from "next/server"
import { recordAudit } from "@lib/services/audit"
import { z } from "zod"
import { supabaseAdmin } from "@lib/supabase-admin"
import { requireSession } from "@lib/auth-helpers"
import { fail, forbidden, ok, serverError } from "@lib/util/api-response"

type Params = { params: Promise<{ id: string }> }

const PatchSchema = z.object({
  status: z.enum(["new", "contacted", "closed", "qualified", "spam"]).optional(),
  is_read: z.boolean().optional(),
  notes: z.string().max(5000).optional(),
})

export async function PATCH(req: NextRequest, { params }: Params) {
  const session = await requireSession(req, ["owner", "editor", "admin"])
  if (!session) {
    return forbidden("Only admins can update leads")
  }
  const parsed = PatchSchema.safeParse(await req.json().catch(() => null))
  if (!parsed.success) return fail("Invalid update payload")

  const id = (await params).id
  
  // Try `leads` table first
  let { data: before } = await supabaseAdmin.from("leads").select("id, status, is_read, notes").eq("id", id).maybeSingle()
  let targetTable = "leads"

  if (!before) {
    const fb = await supabaseAdmin.from("contact_leads").select("id, status, notes").eq("id", id).maybeSingle()
    if (fb.data) {
      before = { ...fb.data, is_read: false }
      targetTable = "contact_leads"
    }
  }

  const { error } = await supabaseAdmin
    .from(targetTable)
    .update({ ...parsed.data, ...(targetTable === "leads" ? {} : { updated_at: new Date().toISOString() }) })
    .eq("id", id)

  if (error) return serverError("Could not update the lead")

  await recordAudit({
    actor: session,
    action: "lead.update",
    entityType: "lead",
    entityKey: id,
    before,
    after: { ...(before || {}), ...parsed.data },
  })

  return ok({ ok: true })
}

export async function DELETE(req: NextRequest, { params }: Params) {
  const session = await requireSession(req, ["owner", "editor", "admin"])
  if (!session) {
    return forbidden("Only admins can delete leads")
  }
  const id = (await params).id
  
  let { error } = await supabaseAdmin.from("leads").delete().eq("id", id)
  if (error) {
    const fb = await supabaseAdmin.from("contact_leads").delete().eq("id", id)
    error = fb.error
  }

  if (error) return serverError("Could not delete the lead")

  await recordAudit({
    actor: session,
    action: "lead.erase",
    entityType: "lead",
    entityKey: id,
    before: { erased: false },
    after: { erased: true },
  })

  return ok({ ok: true })
}
