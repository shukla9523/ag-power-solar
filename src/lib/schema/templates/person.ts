import { getEntityId, normalizeUrl } from "../config"
import { OrganizationProfile } from "../site"

export interface PersonTemplateOptions {
  baseUrl: string
  profile: OrganizationProfile
}

/** Stable @id of the founder Person node: {base}/#founder. */
export function getFounderId(baseUrl: string): string {
  return getEntityId(baseUrl, "#founder")
}

/** True when a byline name is the founder's name (case and whitespace insensitive). */
export function isFounderName(name: string | undefined | null, profile: OrganizationProfile): boolean {
  const a = (name || "").trim().replace(/\s+/g, " ").toLowerCase()
  const b = (profile.founder?.name || "").trim().replace(/\s+/g, " ").toLowerCase()
  return Boolean(a && b && a === b)
}

/**
 * Creates the founder Person node (Electro Global Leadership) with stable @id {base}/#founder.
 * Only real data from the organization profile; sameAs only when profile URLs exist.
 * Never fabricate unconfirmed team members.
 */
export function createFounderPersonSchema(options: PersonTemplateOptions): Record<string, any> | null {
  const { baseUrl, profile } = options
  if (!profile.founder?.name) return null

  const sameAs = (profile.founder.sameAs || []).filter((u) => typeof u === "string" && /^https:\/\//.test(u))

  return {
    "@type": "Person",
    "@id": getFounderId(baseUrl),
    name: profile.founder.name,
    jobTitle: profile.founder.jobTitle || "Founder",
    // The About page is where the founder is introduced.
    url: normalizeUrl("/about", baseUrl),
    image: profile.founder.image ? normalizeUrl(profile.founder.image, baseUrl) : undefined,
    worksFor: {
      "@id": getEntityId(baseUrl, "#organization"),
    },
    sameAs: sameAs.length ? sameAs : undefined,
  }
}
