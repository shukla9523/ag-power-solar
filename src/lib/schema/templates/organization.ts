import { getEntityId } from "../config"
import { OrganizationProfile } from "../site"

export interface OrganizationTemplateOptions {
  baseUrl: string
  profile: OrganizationProfile
  full?: boolean
  keywords?: string[]
}

/** Maps profile place names to valid schema.org Place nodes (Country / City / Place). */
export function toAreaServed(names: unknown): Array<Record<string, string>> | undefined {
  if (!Array.isArray(names)) return undefined
  const seen = new Set<string>()
  const places: Array<Record<string, string>> = []
  for (const raw of names) {
    if (raw && typeof raw === "object" && typeof (raw as any).name === "string") {
      const node = raw as Record<string, string>
      const key = node.name.trim().toLowerCase()
      if (key && !seen.has(key)) {
        seen.add(key)
        places.push({ "@type": node["@type"] || "Place", name: node.name.trim() })
      }
      continue
    }
    if (typeof raw !== "string" || !raw.trim()) continue
    let name = raw.trim()
    let type = "Place"
    if (/^india$/i.test(name)) type = "Country"
    else if (/^jaipur$/i.test(name)) type = "City"
    else if (/^worldwide/i.test(name)) name = "Worldwide"
    const key = name.toLowerCase()
    if (seen.has(key)) continue
    seen.add(key)
    places.push({ "@type": type, name })
  }
  return places.length ? places : undefined
}

function buildContactPoints(profile: OrganizationProfile): Array<Record<string, any>> | undefined {
  const source =
    profile.contactPoints && profile.contactPoints.length
      ? profile.contactPoints
      : profile.whatsapp?.telephone
        ? [profile.whatsapp]
        : []
  const seen = new Set<string>()
  const points: Array<Record<string, any>> = []
  for (const cp of source) {
    const telephone = cp?.telephone?.trim()
    if (!telephone || seen.has(telephone)) continue
    seen.add(telephone)
    points.push({
      "@type": "ContactPoint",
      telephone,
      contactType: cp.contactType || "customer support",
      email: (cp as { email?: string }).email || undefined,
      areaServed: "IN",
      availableLanguage: cp.availableLanguage?.length ? cp.availableLanguage : ["English", "Hindi"],
    })
  }
  return points.length ? points : undefined
}

function buildOpeningHours(profile: OrganizationProfile): Array<Record<string, any>> | undefined {
  const specs = (profile.openingHours || [])
    .filter((h) => h && Array.isArray(h.days) && h.days.length && h.opens && h.closes)
    .map((h) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: h.days,
      opens: h.opens,
      closes: h.closes,
    }))
  return specs.length ? specs : undefined
}

function logoNode(baseUrl: string, profile: OrganizationProfile): Record<string, any> {
  return {
    "@type": "ImageObject",
    "@id": getEntityId(baseUrl, "#logo"),
    url: profile.logo.url,
    contentUrl: profile.logo.url,
    width: profile.logo.width,
    height: profile.logo.height,
  }
}

/**
 * Compact Organization node for every non-home page (@id, name, url, logo), so each page
 * names its publisher without repeating the full business profile.
 */
export function createCompactOrganizationSchema(options: { baseUrl: string; profile: OrganizationProfile }): Record<string, any> {
  const { baseUrl, profile } = options
  return {
    "@type": "Organization",
    "@id": getEntityId(baseUrl, "#organization"),
    name: profile.name,
    url: profile.url || baseUrl,
    logo: logoNode(baseUrl, profile),
  }
}

/**
 * Creates the full Organization schema (homepage only, @id #organization).
 * Typed ["Organization", "ProfessionalService"] (a LocalBusiness subtype) with the visible
 * NAP data: address, telephone, contact points, opening hours and served areas.
 * The founder is referenced by @id (#founder); the Person node is emitted separately.
 * No review / aggregateRating (D-07), no priceRange or geo unless real data exists.
 */
export function createOrganizationSchema(options: OrganizationTemplateOptions): Record<string, any> {
  const { baseUrl, profile } = options
  if (options.full === false) return createCompactOrganizationSchema({ baseUrl, profile })
  const orgId = getEntityId(baseUrl, "#organization")
  const hasGeo =
    typeof profile.geo?.latitude === "number" && typeof profile.geo?.longitude === "number"

  const fullOrg: Record<string, any> = {
    "@type": ["Organization", "ProfessionalService"],
    "@id": orgId,
    name: profile.name,
    legalName: profile.legalName || profile.name,
    alternateName: profile.alternateName || profile.name,
    url: profile.url || baseUrl,
    logo: logoNode(baseUrl, profile),
    image: profile.logo.url,
    foundingDate: profile.foundingDate || undefined,
    numberOfEmployees: profile.numberOfEmployees?.value
      ? {
          "@type": "QuantitativeValue",
          value: profile.numberOfEmployees.value,
        }
      : undefined,
    taxID: profile.taxID || undefined,
    email: profile.email || undefined,
    telephone: profile.telephone || undefined,
    contactPoint: buildContactPoints(profile),
    address: profile.address?.streetAddress
      ? {
          "@type": "PostalAddress",
          streetAddress: profile.address.streetAddress,
          addressLocality: profile.address.addressLocality,
          addressRegion: profile.address.addressRegion,
          postalCode: profile.address.postalCode,
          addressCountry: profile.address.addressCountry,
        }
      : undefined,
    geo: hasGeo
      ? { "@type": "GeoCoordinates", latitude: profile.geo!.latitude, longitude: profile.geo!.longitude }
      : undefined,
    openingHoursSpecification: buildOpeningHours(profile),
    priceRange: profile.priceRange || undefined,
    knowsAbout: [
      "Performance Marketing",
      "Digital Marketing",
      "SEO",
      "D2C Brand Growth",
      "E-commerce Growth",
      "Video Editing",
    ],
    areaServed: toAreaServed(profile.areaServed),
    sameAs: profile.sameAs?.length ? Array.from(new Set(profile.sameAs)) : undefined,
    founder: profile.founder?.name ? { "@id": getEntityId(baseUrl, "#founder") } : undefined,
  }

  if (options.keywords && options.keywords.length > 0) {
    const cleanKeywords = Array.from(new Set(options.keywords.map((k) => k.trim()).filter(Boolean))).slice(0, 6)
    if (cleanKeywords.length > 0) {
      fullOrg.keywords = cleanKeywords.join(", ")
    }
  }

  return fullOrg
}
