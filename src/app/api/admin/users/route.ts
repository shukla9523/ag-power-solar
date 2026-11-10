/**
 * Purpose: list users and create new admin-panel users (owner / admin only).
 * Creation is compensated: if the profile update fails, the auth user is deleted again.
 */

import { NextRequest } from "next/server"
import { z } from "zod"
import { supabaseAdmin } from "@lib/supabase-admin"
import { recordAudit } from "@lib/services/audit"
import { requireSession } from "@lib/auth-helpers"
import { canAssignRole, isOwnerProfile, parseAssignableRole } from "@lib/services/users-admin"
import { normalizeRole } from "@lib/config/roles"
import { brandedEmail, escapeHtml, sendMail } from "@lib/services/mailer"
import { fail, forbidden, ok, okList, serverError, validationFail } from "@lib/util/api-response"

const CreateSchema = z.object({
  email: z.string().trim().toLowerCase().email().max(254),
  password: z.string().min(10, "Password must be at least 10 characters").max(200),
  role: z.string(),
})

export async function GET(req: NextRequest) {
  if (!(await requireSession(req, ["admin"]))) return forbidden()

  const { data, error } = await supabaseAdmin
    .from("profiles")
    .select("id, email, role, status, created_at")
    .order("email", { ascending: true })
    .limit(1000)
  if (error) return serverError("Could not load users")

  return okList(
    (data || []).map((p) => ({
      ...p,
      role: isOwnerProfile(p) ? "owner" : normalizeRole(p.role),
      is_owner: isOwnerProfile(p),
    }))
  )
}

export async function POST(req: NextRequest) {
  const actor = await requireSession(req, ["admin"])
  if (!actor) return forbidden()

  const parsed = CreateSchema.safeParse(await req.json().catch(() => null))
  if (!parsed.success) {
    return validationFail(parsed.error, "Invalid input")
  }

  const role = parseAssignableRole(parsed.data.role)
  if (!role) return fail("Invalid role")
  const decision = canAssignRole(actor, role)
  if (!decision.allowed) return fail(decision.error, decision.code, 403)

  const { data: created, error: authError } = await supabaseAdmin.auth.admin.createUser({
    email: parsed.data.email,
    password: parsed.data.password,
    email_confirm: true,
  })
  if (authError || !created.user) {
    const exists = /already/i.test(authError?.message || "")
    return exists ? fail("A user with this email already exists", "CONFLICT", 409) : serverError("Could not create the user")
  }

  const { error: profileError } = await supabaseAdmin
    .from("profiles")
    .upsert({ id: created.user.id, email: parsed.data.email, role, status: "approved" })
  if (profileError) {
    await supabaseAdmin.auth.admin.deleteUser(created.user.id) // keep auth and profiles consistent
    return serverError("Could not create the user profile")
  }

  await recordAudit({ actor, action: "user.create", entityType: "user", entityKey: created.user.id, before: null, after: { email: parsed.data.email, role, status: "approved" } })

  await sendMail({
    to: parsed.data.email,
    subject: "Your Mommantum admin access",
    text: `An account was created for you on the Mommantum admin panel with the role "${role}". Sign in with this email address.`,
    html: brandedEmail(
      "Your admin access is ready",
      `<p style="font-size:14px;line-height:1.6">An account was created for <strong>${escapeHtml(parsed.data.email)}</strong> with the role <strong>${escapeHtml(role)}</strong>. Sign in with this email or with Google.</p>`
    ),
  })

  return ok({ ok: true, user: { id: created.user.id, email: parsed.data.email, role } })
}
