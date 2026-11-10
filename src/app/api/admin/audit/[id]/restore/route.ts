/**
 * Purpose: restore the "before" version recorded in one audit entry (owner / admin).
 */
import { NextRequest } from "next/server"
import { requireSession } from "@lib/auth-helpers"
import { restoreFromAudit } from "@lib/services/audit-restore"
import { fail, failWithStatus, forbidden, ok } from "@lib/util/api-response"

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireSession(req, ["admin"])
  if (!session) return forbidden("Only owner and admins can restore")

  const id = (await params).id
  if (!/^[0-9a-f-]{36}$/i.test(id)) return fail("Invalid id")

  const result = await restoreFromAudit(id, session)
  return result.ok
    ? ok({ ok: true, message: result.message })
    : failWithStatus(result.error, result.status)
}
