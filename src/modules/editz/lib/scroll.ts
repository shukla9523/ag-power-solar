export const EDITZ_SECTION_IDS = [
  "services",
  "benefits",
  "projects",
  "process",
  "contact",
] as const

export type EditzSectionId = (typeof EDITZ_SECTION_IDS)[number]

const EDITZ_SECTION_SET = new Set<string>(EDITZ_SECTION_IDS)

export function isEditzSectionId(value: string): value is EditzSectionId {
  return EDITZ_SECTION_SET.has(value)
}

/** Extracts an EDITZ section ID from `/editz/<section>`, `/editz#<section>`, or `#<section>`. */
export function getEditzSectionFromHref(href: string): EditzSectionId | null {
  const clean = href.trim()
  let candidate: string | null = null
  if (clean.startsWith("#")) {
    candidate = clean.slice(1)
  } else if (clean.startsWith("/editz/")) {
    candidate = clean.slice("/editz/".length).split(/[/?#]/)[0] || null
  } else if (clean.startsWith("/editz#")) {
    candidate = clean.slice("/editz#".length).split(/[/?#]/)[0] || null
  }
  return candidate && isEditzSectionId(candidate) ? candidate : null
}

/** Rewrites legacy `#section` or `/editz#section` hrefs to clean `/editz/section` paths. */
export function normalizeEditzHref(href: string): string {
  const clean = href.trim()
  if (clean.startsWith("#")) {
    const slug = clean.slice(1)
    return slug ? `/editz/${slug}` : "/editz"
  }
  if (clean.startsWith("/editz#")) {
    const slug = clean.slice("/editz#".length)
    return slug ? `/editz/${slug}` : "/editz"
  }
  return clean
}

/** Smooth-scrolls to a section on the EDITZ page without adding a #fragment to the browser URL. */
export function scrollToEditzSection(sectionId: string): boolean {
  const target = document.getElementById(sectionId)
  if (!target) return false
  target.scrollIntoView({ behavior: "smooth", block: "start" })
  if (window.location.hash) {
    window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}`)
  }
  return true
}
