/**
 * Purpose: /llms.txt — a plain-text guide for AI answer engines (llmstxt.org format):
 * what Mommantum is, its primary services with absolute URLs, and the key pages.
 * Facts come from the organization profile (src/lib/schema/site.ts), services from the page
 * registry (which falls back to the built-in service list). Cached for an hour.
 * Middleware lets *.txt paths through untouched (STATIC_FILE in src/middleware.ts).
 */
import { DEFAULT_BASE_URL } from "@lib/schema/config"
import { DEFAULT_ORGANIZATION_PROFILE } from "@lib/schema/site"
import { PAGE_META_DEFAULTS } from "@lib/schema/page-defaults"
import { FALLBACK_SERVICES } from "@lib/data/fallback-services"
import { getPageRegistry } from "@lib/seo/page-registry"

export const revalidate = 3600

const KEY_PAGES: { key: string; path: string; label: string }[] = [
  { key: "about", path: "/about", label: "About AG POWER" },
  { key: "calculator", path: "/calculator", label: "Solar Savings Calculator" },
  { key: "solar-panels", path: "/solar-panels", label: "Solar Panel Catalogue" },
  { key: "customer-services", path: "/customer-services", label: "Solar Customer Services & Maintenance" },
  { key: "faq", path: "/faq", label: "Solar FAQs" },
  { key: "blog", path: "/blog", label: "Solar Insights Blog" },
  { key: "contact", path: "/contact", label: "Contact AG POWER" },
]

/** One line, no markdown-breaking newlines. */
function oneLine(value: string | null | undefined): string {
  return String(value || "").replace(/\s+/g, " ").trim()
}

async function loadServices(): Promise<{ title: string; path: string; description: string }[]> {
  const fallback = Object.values(FALLBACK_SERVICES).map((s) => ({
    title: s.title,
    path: `/services/${s.slug}`,
    description: s.description,
  }))
  try {
    const pages = await getPageRegistry()
    const services = pages
      .filter((p) => p.kind === "service")
      .map((p) => ({ title: p.title, path: p.path, description: p.description }))
    return services.length ? services : fallback
  } catch {
    return fallback
  }
}

export async function GET() {
  const p = DEFAULT_ORGANIZATION_PROFILE
  const services = await loadServices()
  const a = p.address

  const lines: string[] = [
    `# ${p.name}`,
    "",
    `> ${oneLine(PAGE_META_DEFAULTS.homepage?.description)}`,
    "",
    `${p.name} is a premier solar energy engineering and EPC solutions company based in ${a.addressLocality}, ${a.addressRegion}, India, owned by Electro Global. It delivers turnkey rooftop solar power plants for residential homes, commercial enterprises, and housing societies with PM Surya Ghar subsidy assistance and DISCOM net-metering synchronization.`,
    "",
    "## Contact",
    "",
    `- Website: ${DEFAULT_BASE_URL}/`,
    `- Email: ${p.email}`,
    `- Phone: ${p.telephone}`,
    `- Address: ${a.streetAddress}, ${a.addressLocality} ${a.postalCode}, ${a.addressRegion}, India`,
    "",
    "## Services",
    "",
    ...services.map((s) => {
      const desc = oneLine(s.description)
      return `- [${oneLine(s.title)}](${DEFAULT_BASE_URL}${s.path})${desc ? `: ${desc}` : ""}`
    }),
    "",
    "## Key pages",
    "",
    `- [Home](${DEFAULT_BASE_URL}/)`,
    `- [All services](${DEFAULT_BASE_URL}/services)`,
    ...KEY_PAGES.map((k) => {
      const desc = oneLine(PAGE_META_DEFAULTS[k.key]?.description)
      return `- [${k.label}](${DEFAULT_BASE_URL}${k.path})${desc ? `: ${desc}` : ""}`
    }),
    "",
    "## Optional",
    "",
    `- [Sitemap](${DEFAULT_BASE_URL}/sitemap.xml)`,
    "",
  ]

  return new Response(lines.join("\n"), {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  })
}
