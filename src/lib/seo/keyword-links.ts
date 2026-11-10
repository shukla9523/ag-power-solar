/**
 * Purpose: keyword ownership map for automatic internal linking across mommantum.com.
 *
 * Every page's meta object has 1 primary + up to 4 secondary keywords. Each keyword is
 * "owned" by the page it belongs to (taken from the same page registry the sitemap uses),
 * so when that phrase appears in another page's content it becomes an internal link to its
 * owner, with the keyword itself as anchor text.
 *
 * Priority when two pages claim the same phrase:
 *   manual rule (site_keywords table) > primary keyword > secondary keyword > page title.
 * All phrases owned by one page are alternatives for the same target: the linker links that
 * target once per page, using whichever of its phrases appears first (anchor variety).
 * Ties on primary keywords are reported as keyword cannibalization in the SEO report.
 */

import "server-only"
import { supabaseAdmin } from "@lib/supabase-admin"
import { namedCache } from "@lib/util/ttl-cache"
import { KeywordLink, LinkOptions, injectInternalLinks } from "@lib/util/linker"
import { NON_LINKABLE_KEYS, getPageRegistry } from "./page-registry"
import { listSeoRows } from "./seo-store"

type Owner = { keyword: string; path: string; priority: number; pageKey: string }

export interface KeywordMap {
  links: KeywordLink[]
  conflicts: { keyword: string; pages: string[] }[]
}

const cache = namedCache<KeywordMap>("keyword-links", 10 * 60 * 1000, 2)

function asList(value: unknown): string[] {
  if (Array.isArray(value)) return value.map(String)
  if (typeof value === "string") return value.split(",")
  return []
}

async function loadKeywordMap(): Promise<KeywordMap> {
  const [pages, rows, manual] = await Promise.all([
    getPageRegistry(),
    listSeoRows().catch(() => []),
    supabaseAdmin
      .from("site_keywords")
      .select("keyword, target_url, max_matches_per_page")
      .then((r) => r.data || [], () => []),
  ])

  const pathByKey = new Map<string, string>()
  for (const p of pages) {
    pathByKey.set(p.pageKey, p.path)
    for (const legacy of p.legacyKeys || []) pathByKey.set(legacy, p.path)
  }

  const owners = new Map<string, Owner>()
  const primaryClaims = new Map<string, Set<string>>()

  const claim = (keyword: string, path: string, priority: number, pageKey: string) => {
    const phrase = keyword.trim()
    if (phrase.length < 3) return
    const key = phrase.toLowerCase()
    const current = owners.get(key)
    if (!current || priority > current.priority) owners.set(key, { keyword: phrase, path, priority, pageKey })
  }

  for (const row of rows) {
    const pageKey = String(row.page_key)
    const path = pathByKey.get(pageKey)
    if (!path || NON_LINKABLE_KEYS.has(pageKey) || row.robots_index === false) continue

    const primary = typeof row.primary_keyword === "string" ? row.primary_keyword : ""
    if (primary.trim()) {
      claim(primary, path, 2, pageKey)
      const k = primary.trim().toLowerCase()
      if (!primaryClaims.has(k)) primaryClaims.set(k, new Set())
      primaryClaims.get(k)!.add(path)
    }
    for (const secondary of asList(row.secondary_keywords).slice(0, 4)) claim(secondary, path, 1, pageKey)
  }

  // Anchor variety: a service / case-study / post title (before any " | " or " - " suffix) is
  // a lowest-priority alternative phrase for its own page. The linker groups every phrase
  // by target and uses whichever appears first on the page, so anchors vary naturally.
  const noindexKeys = new Set(rows.filter((r) => r.robots_index === false).map((r) => String(r.page_key)))
  for (const p of pages) {
    if (p.kind === "static" || NON_LINKABLE_KEYS.has(p.pageKey) || noindexKeys.has(p.pageKey)) continue
    const short = String(p.title || "").split(" | ")[0].split(" - ")[0].trim()
    if (short.length <= 60 && short.split(/\s+/).length >= 2) claim(short, p.path, 0, p.pageKey)
  }

  for (const rule of manual as { keyword?: string; target_url?: string }[]) {
    if (rule.keyword && rule.target_url) claim(rule.keyword, rule.target_url, 3, "manual")
  }

  const conflicts = Array.from(primaryClaims.entries())
    .filter(([, paths]) => paths.size > 1)
    .map(([keyword, paths]) => ({ keyword, pages: Array.from(paths) }))

  return {
    links: Array.from(owners.values()).map((o) => ({ keyword: o.keyword, target_url: o.path })),
    conflicts,
  }
}

export function getKeywordMap(): Promise<KeywordMap> {
  return cache.getOrSet("map", () => loadKeywordMap().catch(() => ({ links: [], conflicts: [] })))
}

/**
 * Adds keyword links to a block of page HTML. Pass the same `state` for several blocks on
 * one page so each target is linked once and the page-wide cap holds.
 */
export async function linkKeywords(
  html: string,
  currentPath: string,
  state: { usedTargets: Set<string>; usedKeywords: Set<string>; remaining: number },
  className?: string
): Promise<string> {
  if (!html || state.remaining <= 0) return html
  const { links } = await getKeywordMap()
  const before = state.usedTargets.size
  const options: LinkOptions = {
    currentPath,
    maxLinks: state.remaining,
    usedTargets: state.usedTargets,
    usedKeywords: state.usedKeywords,
    className,
  }
  const result = injectInternalLinks(html, links, options)
  state.remaining -= state.usedTargets.size - before
  return result
}

/** Link budget: ~1 automatic link per 150 words, between 2 and 8 per page. */
export function newLinkState(wordCount: number) {
  return {
    usedTargets: new Set<string>(),
    usedKeywords: new Set<string>(),
    remaining: Math.max(2, Math.min(8, Math.round(wordCount / 150))),
  }
}
