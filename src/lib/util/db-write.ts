/**
 * Purpose: tolerant Supabase writes for tables whose optional columns may not exist yet
 * (migrations are run by a human from db-proposals/, decision D-09).
 *
 * If PostgREST reports an unknown column, the write is retried once without the listed
 * optional columns, so the admin keeps working before and after a migration.
 */

import "server-only"
import { supabaseAdmin } from "@lib/supabase-admin"

type DbError = { code?: string; message?: string } | null

export function isMissingColumnError(error: DbError): boolean {
  if (!error) return false
  return (
    error.code === "42703" ||
    error.code === "PGRST204" ||
    /column .* does not exist|Could not find the '.*' column/i.test(error.message || "")
  )
}

export function isUniqueViolation(error: DbError): boolean {
  return error?.code === "23505"
}

function strip(payload: Record<string, unknown>, optional: string[]): Record<string, unknown> {
  const copy = { ...payload }
  for (const key of optional) delete copy[key]
  return copy
}

export async function updateRow(
  table: string,
  match: Record<string, string>,
  payload: Record<string, unknown>,
  optionalColumns: string[] = []
) {
  const run = (data: Record<string, unknown>) => {
    let query = supabaseAdmin.from(table).update(data)
    for (const [column, value] of Object.entries(match)) query = query.eq(column, value)
    return query.select().maybeSingle()
  }
  let result = await run(payload)
  if (isMissingColumnError(result.error) && optionalColumns.length) result = await run(strip(payload, optionalColumns))
  return result
}

export async function insertRow(table: string, payload: Record<string, unknown>, optionalColumns: string[] = []) {
  const run = (data: Record<string, unknown>) => supabaseAdmin.from(table).insert(data).select().single()
  let result = await run(payload)
  if (isMissingColumnError(result.error) && optionalColumns.length) result = await run(strip(payload, optionalColumns))
  return result
}

/** Picks only the allowed keys that are present in the body. */
export function pick(body: Record<string, unknown>, keys: readonly string[]): Record<string, unknown> {
  const out: Record<string, unknown> = {}
  for (const key of keys) if (body[key] !== undefined) out[key] = body[key]
  return out
}
