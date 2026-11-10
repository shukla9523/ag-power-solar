/**
 * Purpose: the meta-object contract shared by the admin SEO API, the monthly AI fill and
 * the SEO report — which fields exist, what counts as "empty", and who owns each value.
 *
 * Ownership rule (CEO, 2026-11-08): AI may only write a field that is empty. Once a field
 * has a value — whether typed by a person or filled by AI and then corrected — it is
 * never changed automatically again. `field_sources` records "human" | "ai" per field.
 */

export const META_TEXT_FIELDS = [
  "meta_title",
  "meta_description",
  "primary_keyword",
  "canonical_url",
  "og_title",
  "og_description",
  "og_image",
  "og_image_alt",
  "og_url",
  "og_type",
  "twitter_card",
  "twitter_title",
  "twitter_description",
  "twitter_image",
  "image_alt",
  "image_title",
] as const

export const META_ARRAY_FIELDS = ["secondary_keywords", "faq_section"] as const

export const META_OTHER_FIELDS = [
  "page_key",
  "page_label",
  "slug",
  "robots_index",
  "robots_follow",
  "meta_keywords",
  "schema_json",
] as const

/** Columns that exist only after the 2026-11-08 migration; writes retry without them. */
export const OPTIONAL_META_COLUMNS = ["field_sources", "og_image_alt", "image_alt", "image_title", "ai_filled_at"]

export const EDITABLE_META_FIELDS: string[] = [...META_TEXT_FIELDS, ...META_ARRAY_FIELDS, ...META_OTHER_FIELDS]

/** Fields the AI job is allowed to fill (only when empty). */
export const AI_FILLABLE_FIELDS = [
  "meta_title",
  "meta_description",
  "primary_keyword",
  "secondary_keywords",
  "og_title",
  "og_description",
  "twitter_title",
  "twitter_description",
  "image_alt",
  "image_title",
  "og_image_alt",
] as const

export type FieldSource = "human" | "ai"
export type FieldSources = Record<string, FieldSource>

export const SEO_LIMITS = {
  metaTitle: { min: 30, max: 60 },
  metaDescription: { min: 120, max: 160 },
  secondaryKeywords: { max: 4 },
  altText: { max: 125 },
} as const

export function isEmptyValue(value: unknown): boolean {
  if (value === null || value === undefined) return true
  if (typeof value === "string") return value.trim() === ""
  if (Array.isArray(value)) return value.length === 0
  return false
}

/**
 * Builds a safe update for a human save:
 * - only whitelisted fields;
 * - an empty incoming value never erases a stored value unless the field is listed in
 *   `clearFields` (prevents the "blank editor wipes saved SEO" bug);
 * - every field the person sets is marked "human" so automation never touches it.
 */
export function buildHumanMetaUpdate(
  incoming: Record<string, unknown>,
  stored: Record<string, unknown> | null,
  clearFields: string[] = []
): { update: Record<string, unknown>; sources: FieldSources } {
  const update: Record<string, unknown> = {}
  const sources: FieldSources = { ...((stored?.field_sources as FieldSources) || {}) }

  for (const field of EDITABLE_META_FIELDS) {
    if (!(field in incoming)) continue
    const value = incoming[field]

    if (isEmptyValue(value)) {
      if (clearFields.includes(field)) {
        update[field] = null
        delete sources[field]
      }
      continue
    }

    update[field] = value
    const storedValue = stored?.[field]
    const changed = JSON.stringify(storedValue ?? null) !== JSON.stringify(value)
    if (changed || sources[field] !== "ai") sources[field] = "human"
  }

  return { update, sources }
}
