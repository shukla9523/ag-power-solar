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
  legalName: "AG POWER (Electro Global)",
  name: "AG POWER",
  alternateName: "AG POWER Solar",
  url: "https://www.agpower.in/",
  logo: {
    url: "https://www.agpower.in/logo.png",
    width: 500,
    height: 500,
  },
  foundingDate: "2024-01-01",
  founder: {
    name: "Electro Global Leadership",
    image: "https://www.agpower.in/team/leadership.webp",
    jobTitle: "Founder & Solar Energy Lead",
  },
  numberOfEmployees: {
    value: 30,
  },
  taxID: "",
  email: "akashshukla9523@gmail.com",
  telephone: "+919523467849",
  whatsapp: {
    telephone: "+919523467849",
    contactType: "customer support",
    availableLanguage: ["English", "Hindi"],
  },
  contactPoints: [
    {
      telephone: "+919523467849",
      contactType: "customer service",
      email: "akashshukla9523@gmail.com",
      availableLanguage: ["English", "Hindi"],
    },
  ],
  address: {
    streetAddress: "Electro Global, Corporate Office",
    addressLocality: "Patna",
    addressRegion: "Bihar",
    postalCode: "800001",
    addressCountry: "IN",
  },
  clientsCanVisitOffice: true,
  openingHours: [
    {
      days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      opens: "09:00",
      closes: "19:00",
    },
  ],
  areaServed: ["India"],
  sameAs: [],
}

export interface SchemaSiteInfo {
  baseUrl: string
  profile: OrganizationProfile
  siteSetting: SiteSetting | null
}

/**
 * Returns canonical site information for schema generation.
 * Always returns production https://agpower.in base URL (or env override).
 * Cached via getSiteSetting (tag 'site_setting').
 */
export async function getSchemaSite(): Promise<SchemaSiteInfo> {
  const siteSetting = await getSiteSetting().catch(() => null)
  const baseUrl = normalizeBaseUrl(DEFAULT_BASE_URL)

  // Merge organization_profile if stored in DB site_setting column
  const dbProfile = (siteSetting as any)?.organization_profile
  const profile: OrganizationProfile = {
    ...DEFAULT_ORGANIZATION_PROFILE,
    legalName: siteSetting?.legal_name || siteSetting?.site_name || DEFAULT_ORGANIZATION_PROFILE.legalName,
    name: siteSetting?.site_name || DEFAULT_ORGANIZATION_PROFILE.name,
    alternateName: siteSetting?.site_name ? `${siteSetting.site_name} Solar` : DEFAULT_ORGANIZATION_PROFILE.alternateName,
    email: siteSetting?.email || DEFAULT_ORGANIZATION_PROFILE.email,
    telephone: siteSetting?.phone || DEFAULT_ORGANIZATION_PROFILE.telephone,
    logo: {
      url: siteSetting?.logo_url || DEFAULT_ORGANIZATION_PROFILE.logo.url,
      width: 500,
      height: 500,
    },
    ...(dbProfile && typeof dbProfile === "object" ? dbProfile : {}),
    founder: {
      ...DEFAULT_ORGANIZATION_PROFILE.founder,
      ...(dbProfile?.founder || {}),
    },
    address: {
      ...DEFAULT_ORGANIZATION_PROFILE.address,
      ...(siteSetting?.address ? { streetAddress: siteSetting.address } : {}),
      ...(dbProfile?.address || {}),
    },
    whatsapp: {
      ...DEFAULT_ORGANIZATION_PROFILE.whatsapp,
      ...(siteSetting?.whatsapp ? { telephone: siteSetting.whatsapp } : {}),
      ...(dbProfile?.whatsapp || {}),
    },
  }

  const socials = [
    siteSetting?.instagram_url,
    siteSetting?.facebook_url,
    siteSetting?.linkedin_url,
    siteSetting?.youtube_url,
  ].filter(Boolean) as string[]

  if (socials.length > 0) {
    profile.sameAs = socials
  }

  return {
    baseUrl,
    profile,
    siteSetting,
  }
}
