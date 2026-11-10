import { getSiteSetting, SiteSetting } from "@lib/data/seo"
import { DEFAULT_BASE_URL, normalizeBaseUrl } from "./config"

export interface OrganizationProfile {
  legalName: string
  name: string
  alternateName: string
  url: string
  logo: {
    url: string
    width: number
    height: number
  }
  foundingDate: string
  founder: {
    name: string
    image: string
    jobTitle: string
    /** Profile URLs for the founder; only ones linked on the site (none today). */
    sameAs?: string[]
  }
  numberOfEmployees: {
    value: number
  }
  taxID: string
  email: string
  telephone: string
  whatsapp: {
    telephone: string
    contactType: string
    availableLanguage: string[]
  }
  /**
   * Every phone line shown on the site, each emitted as its own ContactPoint.
   * When empty, a single ContactPoint is derived from `whatsapp`.
   */
  contactPoints?: Array<{
    telephone: string
    contactType: string
    email?: string
    availableLanguage?: string[]
  }>
  address: {
    streetAddress: string
    addressLocality: string
    addressRegion: string
    postalCode: string
    addressCountry: string
  }
  clientsCanVisitOffice: boolean
  openingHours: Array<{
    days: string[]
    opens: string
    closes: string
  }>
  /** Place names; mapped to Country / City / Place nodes by the Organization template. */
  areaServed: string[]
  /** Google Business Profile map link. Omitted until the correct Jaipur listing is confirmed. */
  hasMap?: string
  /** Price range shown to customers; omitted because the site publishes none. */
  priceRange?: string
  geo?: {
    latitude: number
    longitude: number
  }
  sameAs: string[]
}

export const DEFAULT_ORGANIZATION_PROFILE: OrganizationProfile = {
  legalName: "Mommantum",
  name: "Mommantum",
  alternateName: "Mommantum",
  url: "https://www.mommantum.com/",
  logo: {
    url: "https://www.mommantum.com/logo.png",
    width: 500,
    height: 500,
  },
  foundingDate: "2025-12-15",
  founder: {
    name: "Kuldeep Ahir",
    image: "https://www.mommantum.com/team/kuldeep.webp",
    // Matches the visible About page caption and teamMember.role in case-studies.ts.
    jobTitle: "Founder & Creative Director",
  },
  numberOfEmployees: {
    value: 15,
  },
  taxID: "08CTJPA2104B1ZI",
  // Matches the address shown on /contact and in the EDITZ footer.
  email: "kuldeep@mommantum.com",
  // Primary line = the "General Inquiries" phone shown on /contact.
  telephone: "+919588973492",
  whatsapp: {
    telephone: "+917742276031",
    contactType: "customer support",
    availableLanguage: ["English", "Hindi"],
  },
  contactPoints: [
    {
      // Shown on /contact under "General Inquiries".
      telephone: "+919588973492",
      contactType: "customer service",
      email: "kuldeep@mommantum.com",
      availableLanguage: ["English", "Hindi"],
    },
    {
      // Shown in the contact / FAQ answers as the call and WhatsApp line.
      telephone: "+917742276031",
      contactType: "customer support",
      availableLanguage: ["English", "Hindi"],
    },
  ],
  address: {
    // Official Mommantum headquarters office address (as shown on /contact)
    streetAddress: "B-147, Anand Vihar, Jagatpura",
    addressLocality: "Jaipur",
    addressRegion: "Rajasthan",
    postalCode: "302017",
    addressCountry: "IN",
  },
  clientsCanVisitOffice: true,
  // "Open Monday to Saturday, 9:00 AM – 9:00 PM" on /contact.
  openingHours: [
    {
      days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      opens: "09:00",
      closes: "21:00",
    },
  ],
  areaServed: ["Jaipur", "India", "Worldwide"],
  // hasMap and geo are intentionally omitted: the old map shortlink resolved to Cochin, not
  // the Jaipur office, and no verified coordinates exist.
  // Social profiles actually linked in the site header, footer and /contact page.
  sameAs: [
    "https://www.instagram.com/mommantummedia/",
    "https://www.instagram.com/mommantumeditz/",
    "https://www.linkedin.com/company/mommantum-media/",
    "https://www.facebook.com/profile.php?id=61594685770172",
    "https://x.com/mommantum",
  ],
}

export interface SchemaSiteInfo {
  baseUrl: string
  profile: OrganizationProfile
  siteSetting: SiteSetting | null
}

/**
 * Returns canonical site information for schema generation.
 * Always returns production https://www.mommantum.com base URL.
 * Cached via getSiteSetting (tag 'site_setting').
 */
export async function getSchemaSite(): Promise<SchemaSiteInfo> {
  const siteSetting = await getSiteSetting().catch(() => null)
  const baseUrl = normalizeBaseUrl(DEFAULT_BASE_URL)

  // Merge organization_profile if stored in DB site_setting column
  const dbProfile = (siteSetting as any)?.organization_profile
  const profile: OrganizationProfile = {
    ...DEFAULT_ORGANIZATION_PROFILE,
    ...(dbProfile && typeof dbProfile === "object" ? dbProfile : {}),
    logo: {
      ...DEFAULT_ORGANIZATION_PROFILE.logo,
      ...(dbProfile?.logo || {}),
    },
    founder: {
      ...DEFAULT_ORGANIZATION_PROFILE.founder,
      ...(dbProfile?.founder || {}),
    },
    address: {
      ...DEFAULT_ORGANIZATION_PROFILE.address,
      ...(dbProfile?.address || {}),
    },
    whatsapp: {
      ...DEFAULT_ORGANIZATION_PROFILE.whatsapp,
      ...(dbProfile?.whatsapp || {}),
    },
  }

  return {
    baseUrl,
    profile,
    siteSetting,
  }
}
