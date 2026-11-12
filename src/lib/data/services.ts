import { supabase } from "@lib/supabase"
import { unstable_cache } from "next/cache"
import { FALLBACK_SERVICES, getFallbackService } from "./fallback-services"
import GENERATED_HERO_IMAGES from "./service-images.json"

const HERO_SLUGS = new Set<string>(GENERATED_HERO_IMAGES as string[])

function isDefaultServiceBanner(url: string, slug: string): boolean {
  return (
    url.startsWith("/og/services/") ||
    url.endsWith(`/services/${slug}.jpg`) ||
    url.includes(`/og/services/${slug}.jpg`)
  )
}

/**
 * Hero illustration for the service page: an image uploaded in the admin wins (unless it is the
 * legacy default text-card banner); otherwise the generated 1200x630 WebP illustration under
 * /images/services/<slug>.webp; otherwise the share card.
 */
export function resolveHeroImage(slug: string, dbImage?: string | null): string {
  const uploaded = dbImage?.trim()
  if (uploaded && !isDefaultServiceBanner(uploaded, slug)) return uploaded
  if (HERO_SLUGS.has(slug)) return `/images/services/${slug}.webp`
  return uploaded || `/og/services/${slug}.jpg`
}

export type FAQ = {
  question: string
  answer: string
}

export type Service = {
  id?: string
  slug: string
  title: string
  shortLabel: string
  description: string
  intro: string
  image: string
  /** Illustration shown in the page hero (see resolveHeroImage). */
  heroImage?: string
  points: string[]
  outcomes: string[]
  whyItMatters: string[]
  faqs: FAQ[]
}

type ServiceRow = {
  id: string
  slug: string
  title: string
  short_label: string
  description: string
  intro: string
  image: string
  points: string[]
  outcomes: string[]
  why_it_matters?: string[]
  faqs: { question: string; answer: string }[]
  created_at: string
}

export const getServices = unstable_cache(
  async (): Promise<Service[]> => {
    try {
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .order("created_at", { ascending: true })

      if (!error && data && data.length > 0) {
        return (data as ServiceRow[]).map((s) => ({
          id: s.id,
          slug: s.slug,
          title: s.title,
          shortLabel: s.short_label,
          description: s.description,
          intro: s.intro,
          image: s.image?.trim() ? s.image.trim() : `/og/services/${s.slug}.jpg`,
          heroImage: resolveHeroImage(s.slug, s.image),
          points: s.points || [],
          outcomes: s.outcomes || [],
          whyItMatters: s.why_it_matters || [],
          faqs: s.faqs || [],
        }))
      }
    } catch {
      // Fall through to fallback services
    }

    return Object.values(FALLBACK_SERVICES)
  },
  ["services-list"],
  { revalidate: 60, tags: ["services"] }
)

export async function getService(slug: string): Promise<Service | null> {
  if (!slug) return null
  const cleanSlug = slug.toLowerCase().trim()

  try {
    const { data, error } = await supabase
      .from("services")
      .select("*")
      .eq("slug", cleanSlug)
      .single()

    if (!error && data) {
      const s = data as ServiceRow
      return {
        id: s.id,
        slug: s.slug,
        title: s.title,
        shortLabel: s.short_label,
        description: s.description,
        intro: s.intro,
        image: s.image?.trim() ? s.image.trim() : `/og/services/${s.slug}.jpg`,
        heroImage: resolveHeroImage(s.slug, s.image),
        points: s.points || [],
        outcomes: s.outcomes || [],
        whyItMatters: s.why_it_matters || [],
        faqs: s.faqs || [],
      }
    }
  } catch {
    // Fallback if network or Supabase query fails
  }

  // Fallback to client-approved authentic service definition
  return getFallbackService(cleanSlug)
}
