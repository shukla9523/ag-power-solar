/**
 * Purpose: the single read/write path for `seo_setting` rows (the per-page meta objects).
 *
 * Why: admin saves, the AI fill job and the publishing API must apply the same rules
 * (whitelist, no blank overwrites, field ownership). Writes also tolerate databases where
 * the 2026-11-08 migration (field_sources, image_alt, ...) has not run yet by retrying
 * without those optional columns.
 */

import "server-only"
import { supabaseAdmin } from "@lib/supabase-admin"
import { recordAudit } from "@lib/services/audit"
import { OPTIONAL_META_COLUMNS } from "./meta-fields"

export type SeoRow = Record<string, unknown> & { id?: string; page_key: string }

const TABLE = "seo_setting"

function isMissingColumnError(error: { code?: string; message?: string } | null): boolean {
  if (!error) return false
  return error.code === "42703" || error.code === "PGRST204" || /column .* does not exist|Could not find the '.*' column/i.test(error.message || "")
}

function withoutOptional(payload: Record<string, unknown>): Record<string, unknown> {
  const copy = { ...payload }
  for (const column of OPTIONAL_META_COLUMNS) delete copy[column]
  return copy
}

export async function getSeoRow(pageKey: string): Promise<SeoRow | null> {
  const { data } = await supabaseAdmin.from(TABLE).select("*").eq("page_key", pageKey).maybeSingle()
  return (data as SeoRow) || null
}

export async function listSeoRows(): Promise<SeoRow[]> {
  const { data, error } = await supabaseAdmin.from(TABLE).select("*").order("page_key", { ascending: true })
  if (error) throw new Error("Could not load SEO settings")
  return (data as SeoRow[]) || []
}

/** Inserts or updates the row for pageKey with an already-validated payload. */
export async function writeSeoRow(pageKey: string, payload: Record<string, unknown>): Promise<SeoRow> {
  const existing = await getSeoRow(pageKey)
  const body = { ...payload, page_key: pageKey, updated_at: new Date().toISOString() }

  const run = async (data: Record<string, unknown>) =>
    existing?.id
      ? supabaseAdmin.from(TABLE).update(data).eq("id", existing.id).select().single()
      : supabaseAdmin.from(TABLE).insert({ page_label: pageKey, ...data }).select().single()

  let result = await run(body)
  if (isMissingColumnError(result.error)) result = await run(withoutOptional(body))
  if (result.error || !result.data) throw new Error("Could not save SEO settings")
  return result.data as SeoRow
}

/**
 * Writes only the given fields and only where the stored value is still empty
 * (re-checked against the database at write time). Used by AI jobs.
 */
export async function fillEmptySeoFields(
  pageKey: string,
  values: Record<string, unknown>,
  isEmpty: (v: unknown) => boolean
): Promise<string[]> {
  const current = await getSeoRow(pageKey)
  const filled: string[] = []
  const update: Record<string, unknown> = {}
  const sources = { ...((current?.field_sources as Record<string, string>) || {}) }

  for (const [field, value] of Object.entries(values)) {
    if (isEmpty(value)) continue
    if (current && !isEmpty(current[field])) continue // never overwrite an existing value
    if (sources[field] === "human") continue
    update[field] = value
    sources[field] = "ai"
    filled.push(field)
  }

  if (filled.length === 0) return []
  const saved = await writeSeoRow(pageKey, { ...update, field_sources: sources, ai_filled_at: new Date().toISOString() })
  await recordAudit({ actorType: "ai", action: "seo.ai_fill", entityType: "seo", entityKey: pageKey, before: current, after: saved })
  return filled
}
