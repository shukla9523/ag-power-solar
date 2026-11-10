/**
 * Purpose: append-only audit log of every admin and automated write.
 *
 * Each entry stores who did what to which entity, the changed field names and the full
 * before/after rows, so any change can be restored with one click (see restoreFromAudit).
 * Recording never blocks or fails the write it describes. Secrets are never stored.
 */

import "server-only"
import { supabaseAdmin } from "@lib/supabase-admin"
import type { UserSession } from "@lib/auth-helpers"

export type AuditEntity = "post" | "service" | "case_study" | "seo" | "site" | "user" | "lead" | "keyword" | "product"

export interface AuditInput {
  actor?: UserSession | null
  actorType?: "user" | "system" | "ai" | "cron" | "api"
  action: string
  entityType: AuditEntity
  entityKey: string
  before?: Record<string, unknown> | null
  after?: Record<string, unknown> | null
  restoredFrom?: string
}

const SECRET_KEYS = /password|token|secret|key$/i
const IGNORED = new Set(["updated_at", "created_at"])

function scrub(row: Record<string, unknown> | null | undefined): Record<string, unknown> | null {
  if (!row) return null
  const out: Record<string, unknown> = {}
  for (const [k, v] of Object.entries(row)) if (!SECRET_KEYS.test(k)) out[k] = v
  return out
}

export function changedFields(before: Record<string, unknown> | null | undefined, after: Record<string, unknown> | null | undefined): string[] {
  const keys = new Set([...Object.keys(before || {}), ...Object.keys(after || {})])
  return Array.from(keys).filter(
    (k) => !IGNORED.has(k) && JSON.stringify(before?.[k] ?? null) !== JSON.stringify(after?.[k] ?? null)
  )
}

export async function recordAudit(input: AuditInput): Promise<void> {
  const before = scrub(input.before)
  const after = scrub(input.after)
  const fields = changedFields(before, after)
  if (before && after && fields.length === 0) return // nothing actually changed

  try {
    await supabaseAdmin.from("audit_log").insert({
      actor_id: input.actor?.userId || null,
      actor_email: input.actor?.email || null,
      actor_type: input.actorType || (input.actor ? "user" : "system"),
      action: input.action,
      entity_type: input.entityType,
      entity_key: input.entityKey,
      changed_fields: fields,
      before,
      after,
      restored_from: input.restoredFrom || null,
    })
  } catch {
    // audit_log exists after migration M-05; never fail the original write.
  }
}

/** Where each restorable entity lives and which columns a restore may write. */
export const RESTORE_TARGETS: Record<
  string,
  { table: string; keyColumn: string; columns: string[]; revalidate: "blog" | "service" | "case-study" | "seo" }
> = {
  post: {
    table: "post",
    keyColumn: "id",
    columns: ["title", "slug", "category_id", "featured_image", "image_urls", "excerpt", "content", "author_name", "meta_title", "meta_description", "status", "faqs", "published_at", "publish_at", "deleted_at"],
    revalidate: "blog",
  },
  service: {
    table: "services",
    keyColumn: "slug",
    columns: ["title", "slug", "short_label", "description", "intro", "image", "points", "outcomes", "why_it_matters", "faqs"],
    revalidate: "service",
  },
  case_study: {
    table: "case_studies",
    keyColumn: "id",
    columns: ["title", "slug", "category", "tagline", "about", "challenge", "overview", "solution", "insights", "image", "accent", "what_we_did", "results", "metrics", "faqs"],
    revalidate: "case-study",
  },
  seo: {
    table: "seo_setting",
    keyColumn: "page_key",
    columns: [
      "page_key", "page_label", "slug", "meta_title", "meta_description", "primary_keyword", "secondary_keywords", "meta_keywords",
      "canonical_url", "robots_index", "robots_follow", "og_title", "og_description", "og_image", "og_url", "og_type",
      "twitter_card", "twitter_title", "twitter_description", "twitter_image", "schema_json", "faq_section",
      "image_alt", "image_title", "og_image_alt", "field_sources",
    ],
    revalidate: "seo",
  },
}
