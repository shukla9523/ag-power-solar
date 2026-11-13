/**
 * Purpose: Update or delete a specific client by ID.
 */

import { NextRequest } from "next/server"
import { requireSession } from "@lib/auth-helpers"
import { forbidden, ok, notFound, serverError } from "@lib/util/api-response"
import { updateClient, deleteClient } from "@lib/services/clients-service"

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireSession(req, ["admin", "marketer"])
  if (!session) return forbidden()

  const { id } = await params
  if (!id) return notFound("Client not found")

  try {
    const patch = await req.json()
    const updated = await updateClient(id, patch)
    if (!updated) return notFound("Client not found")

    return ok({ client: updated, data: { client: updated } })
  } catch (err) {
    return serverError(err instanceof Error ? err.message : "Failed to update client")
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireSession(req, ["admin", "marketer"])
  if (!session) return forbidden()

  const { id } = await params
  if (!id) return notFound("Client not found")

  try {
    await deleteClient(id)
    return ok({ success: true })
  } catch (err) {
    return serverError(err instanceof Error ? err.message : "Failed to delete client")
  }
}

