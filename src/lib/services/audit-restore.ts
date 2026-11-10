/**
 * Purpose: one-click restore from the audit log.
 *
 * Restoring an entry writes the entry's `before` snapshot back to the entity (posts,
 * services, case studies, meta objects). A deleted service or case study is re-created.
 * The restore itself is audited (restored_from = original entry) and the page revalidated.
 * Only whitelisted columns are written.
 */

import "server-only"
import { supabaseAdmin } from "@lib/supabase-admin"
import { revalidateContent } from "@lib/revalidate"
import type { UserSession } from "@lib/auth-helpers"
import { RESTORE_TARGETS, recordAudit } from "./audit"

export type RestoreResult = { ok: true; message: string } | { ok: false; status: number; error: string }

export async function restoreFromAudit(entryId: string, actor: UserSession): Promise<RestoreResult> {
  const { data: entry, error } = await supabaseAdmin.from("audit_log").select("*").eq("id", entryId).maybeSingle()
  if (error || !entry) return { ok: false, status: 404, error: "Audit entry not found" }

  const target = RESTORE_TARGETS[entry.entity_type as string]
  if (!target) return { ok: false, status: 400, error: "This kind of change cannot be restored" }

  const before = entry.before as Record<string, unknown> | null
  if (!before) {
    return { ok: false, status: 400, error: "This entry created the item — delete it instead of restoring" }
  }

  const values: Record<string, unknown> = {}
  for (const column of target.columns) if (column in before) values[column] = before[column]
  const key = String(before[target.keyColumn] ?? entry.entity_key)

  const { data: current } = await supabaseAdmin.from(target.table).select("*").eq(target.keyColumn, key).maybeSingle()

  const write = current
    ? await supabaseAdmin.from(target.table).update(values).eq(target.keyColumn, key).select().maybeSingle()
    : await supabaseAdmin.from(target.table).insert({ ...values, [target.keyColumn]: key }).select().maybeSingle()
  if (write.error) return { ok: false, status: 500, error: "Restore failed — the item may have changed shape" }

  await recordAudit({
    actor,
    action: `${entry.entity_type}.restore`,
    entityType: entry.entity_type,
    entityKey: key,
    before: current || null,
    after: write.data as Record<string, unknown>,
    restoredFrom: entryId,
  })

  const slug = typeof values.slug === "string" ? values.slug : undefined
  if (target.revalidate === "seo") await revalidateContent({ type: "seo", pageKey: key })
  else await revalidateContent({ type: target.revalidate, slug })

  return { ok: true, message: current ? "Restored the previous version" : "Re-created the deleted item" }
}
