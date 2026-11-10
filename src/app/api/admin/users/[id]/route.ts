/**
 * Purpose: update (email, role, status, password) or delete one user.
 * All owner protections live in lib/services/users-admin.ts and are enforced here.
 * Approving a pending account emails the user through Zoho SMTP.
 */

import { NextRequest } from "next/server"
import { z } from "zod"
import { supabaseAdmin } from "@lib/supabase-admin"
import { recordAudit } from "@lib/services/audit"
import { invalidateUserSession, requireSession } from "@lib/auth-helpers"
import { getOwnerEmail } from "@lib/config/owner"
import {
  OWNER_DELETE_PHRASE,
  ProfileRow,
  USER_STATUSES,
  canAssignRole,
  canModifyUser,
  isOwnerProfile,
  parseAssignableRole,
} from "@lib/services/users-admin"
import { brandedEmail, sendMail } from "@lib/services/mailer"
import { fail, forbidden, notFound, ok, serverError, validationFail } from "@lib/util/api-response"

type Params = { params: Promise<{ id: string }> }

const UpdateSchema = z.object({
  email: z.string().trim().toLowerCase().email().max(254).optional(),
  role: z.string().optional(),
  status: z.enum(USER_STATUSES).optional(),
  password: z.string().min(10, "Password must be at least 10 characters").max(200).optional(),
})

async function loadTarget(id: string): Promise<ProfileRow | null> {
  if (!/^[0-9a-f-]{36}$/i.test(id)) return null
  const { data } = await supabaseAdmin.from("profiles").select("id, email, role, status").eq("id", id).maybeSingle()
  return (data as ProfileRow) || null
}

export async function PUT(req: NextRequest, { params }: Params) {
  const actor = await requireSession(req, ["admin"])
  if (!actor) return forbidden()

  const target = await loadTarget((await params).id)
  if (!target) return notFound("User not found")

  const permission = canModifyUser(actor, target)
  if (!permission.allowed) {
    return fail(permission.error, permission.code, permission.status)
  }

  const parsed = UpdateSchema.safeParse(await req.json().catch(() => null))
  if (!parsed.success) {
    return validationFail(parsed.error, "Invalid input")
  }
  const input = parsed.data
  const targetIsOwner = isOwnerProfile(target)
  const profileUpdate: Record<string, unknown> = {}

  if (input.role !== undefined && !targetIsOwner) {
    const role = parseAssignableRole(input.role)
    if (!role) return fail("Invalid role")
    const decision = canAssignRole(actor, role)
    if (!decision.allowed) return fail(decision.error, decision.code, 403)
    profileUpdate.role = role
  }

  if (input.status !== undefined && !targetIsOwner) profileUpdate.status = input.status

  if (input.email && input.email !== target.email.toLowerCase()) {
    if (targetIsOwner) {
      return fail("The owner email is fixed. Change OWNER_EMAIL in the environment instead.", "OWNER_PROTECTED", 403)
    }
    profileUpdate.email = input.email
  }

  if (input.password || profileUpdate.email) {
    const { error } = await supabaseAdmin.auth.admin.updateUserById(target.id, {
      ...(input.password ? { password: input.password } : {}),
      ...(profileUpdate.email ? { email: profileUpdate.email as string, email_confirm: true } : {}),
    })
    if (error) return serverError("Could not update sign-in details")
  }

  if (Object.keys(profileUpdate).length) {
    const { error } = await supabaseAdmin.from("profiles").update(profileUpdate).eq("id", target.id)
    if (error) return serverError("Could not update the user")
  }

  invalidateUserSession(target.id)
  await recordAudit({
    actor,
    action: profileUpdate.role ? "user.role" : profileUpdate.status ? "user.status" : "user.update",
    entityType: "user",
    entityKey: target.id,
    before: { email: target.email, role: target.role, status: target.status },
    after: { email: target.email, role: target.role, status: target.status, ...profileUpdate, ...(input.password ? { password_changed: true } : {}) },
  })

  if (profileUpdate.status === "approved" && target.status !== "approved") {
    await sendMail({
      to: (profileUpdate.email as string) || target.email,
      subject: "Your Mommantum admin access was approved",
      text: "Your access request was approved. You can now sign in to the Mommantum admin panel.",
      html: brandedEmail(
        "Access approved",
        `<p style="font-size:14px;line-height:1.6">Your access request was approved. You can now sign in to the Mommantum admin panel with Google or your password.</p>`
      ),
    })
  }

  return ok({ ok: true })
}

export async function DELETE(req: NextRequest, { params }: Params) {
  const actor = await requireSession(req, ["admin"])
  if (!actor) return forbidden()

  const target = await loadTarget((await params).id)
  if (!target) return notFound("User not found")

  const permission = canModifyUser(actor, target)
  if (!permission.allowed) {
    return fail(permission.error, permission.code, permission.status)
  }

  if (isOwnerProfile(target)) {
    const body = (await req.json().catch(() => null)) as { confirm_email?: string; confirm_text?: string } | null
    if (body?.confirm_email?.trim().toLowerCase() !== getOwnerEmail() || body?.confirm_text !== OWNER_DELETE_PHRASE) {
      return fail(`To delete the owner account, type the owner email and "${OWNER_DELETE_PHRASE}".`, "CONFIRMATION_REQUIRED", 400)
    }
  } else if (actor.userId === target.id) {
    return fail("You cannot delete your own account here.")
  }

  if (isOwnerProfile(target)) {
    // The database trigger only lets the owner row go through this confirmed path.
    const { error: ownerError } = await supabaseAdmin.rpc("delete_owner_profile", { p_id: target.id })
    if (ownerError) return serverError("Could not delete the owner profile")
  } else {
    await supabaseAdmin.from("profiles").delete().eq("id", target.id)
  }
  const { error } = await supabaseAdmin.auth.admin.deleteUser(target.id)
  if (error) return serverError("Could not delete the sign-in account")
  invalidateUserSession(target.id)
  await recordAudit({ actor, action: "user.delete", entityType: "user", entityKey: target.id, before: { email: target.email, role: target.role, status: target.status }, after: null })
  return ok({ ok: true })
}
