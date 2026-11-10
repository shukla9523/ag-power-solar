/**
 * Purpose: HTML-aware keyword → internal-link injection.
 *
 * Rules (SEO / AEO best practice):
 * - Only text nodes are changed; tags and attributes are never touched.
 * - Never inside <a>, headings, <button>, <code>, <pre>, <script>, <style>, <figcaption>, <summary>.
 * - First occurrence of each keyword only; at most one link per target URL per page.
 * - No self-links (target === current page); a page-level cap on total links.
 * - Longest keywords are matched first so "seo services jaipur" wins over "seo".
 * - The anchor text is the keyword exactly as written on the page.
 * - Anchor variety: a target may list alternative phrases (its secondary keywords, its
 *   title). Whichever of the target's phrases appears first in the text becomes the anchor,
 *   so links to the same page do not all use the exact primary keyword.
 */

export interface KeywordLink {
  keyword: string
  target_url: string
  max_matches_per_page?: number
  /** Other phrases that may anchor a link to the same target (earliest one found wins). */
  alternatives?: string[]
}

export interface LinkOptions {
  /** Path of the page being rendered (to skip self-links), e.g. "/services/seo". */
  currentPath?: string
  /** Total links this call may add. */
  maxLinks?: number
  /** Shared across several calls on one page so targets are linked only once. */
  usedTargets?: Set<string>
  usedKeywords?: Set<string>
  className?: string
}

const BLOCKED_TAGS = new Set(["a", "h1", "h2", "h3", "h4", "h5", "h6", "button", "code", "pre", "script", "style", "figcaption", "summary", "label", "select", "option", "textarea"])
const VOID_TAGS = new Set(["br", "hr", "img", "input", "meta", "link", "source", "wbr", "col", "area", "base", "embed", "param", "track"])

function normalizePath(url: string): string {
  const clean = url.replace(/^https?:\/\/(www\.)?mommantum\.com/i, "").split("#")[0].split("?")[0]
  const path = clean.startsWith("/") ? clean : `/${clean}`
  return path.length > 1 ? path.replace(/\/+$/, "") : path
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

function escapeAttr(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;")
}

export function injectInternalLinks(html: string, keywords: KeywordLink[], options: LinkOptions = {}): string {
  if (!html || !keywords?.length) return html

  const currentPath = options.currentPath ? normalizePath(options.currentPath) : null
  const usedTargets = options.usedTargets || new Set<string>()
  const usedKeywords = options.usedKeywords || new Set<string>()
  let budget = options.maxLinks ?? 6
  const classAttr = options.className ? ` class="${escapeAttr(options.className)}"` : ""

  // One candidate per target; its phrases are the keyword plus any alternatives.
  const byPath = new Map<string, { path: string; phrases: string[] }>()
  for (const k of keywords) {
    if (!k?.target_url?.trim()) continue
    const path = normalizePath(k.target_url.trim())
    if (path === currentPath) continue
    const entry = byPath.get(path) || { path, phrases: [] }
    for (const raw of [k.keyword, ...(k.alternatives || [])]) {
      const phrase = typeof raw === "string" ? raw.trim() : ""
      if (phrase.length < 3) continue
      if (!entry.phrases.some((p) => p.toLowerCase() === phrase.toLowerCase())) entry.phrases.push(phrase)
    }
    if (entry.phrases.length) byPath.set(path, entry)
  }
  const candidates = Array.from(byPath.values())
    .map((c) => ({ path: c.path, phrases: [...c.phrases].sort((a, b) => b.length - a.length) }))
    .sort((a, b) => b.phrases[0].length - a.phrases[0].length)

  if (!candidates.length || budget <= 0) return html

  // Targets the author already linked by hand count as used.
  for (const m of Array.from(html.matchAll(/<a\s[^>]*href=["']([^"'#?]+)/gi))) {
    if (m[1].startsWith("/") || /mommantum\.com/i.test(m[1])) usedTargets.add(normalizePath(m[1]))
  }

  // Split into tags and text, tracking which blocked elements we are inside.
  const parts = html.split(/(<[^>]+>)/g)
  const stack: string[] = []

  for (let i = 0; i < parts.length; i++) {
    const part = parts[i]
    if (!part) continue

    if (part.startsWith("<")) {
      const match = /^<\s*(\/)?\s*([a-zA-Z0-9-]+)/.exec(part)
      if (!match) continue
      const tag = match[2].toLowerCase()
      const closing = Boolean(match[1])
      if (VOID_TAGS.has(tag) || part.endsWith("/>")) continue
      if (closing) {
        const idx = stack.lastIndexOf(tag)
        if (idx >= 0) stack.splice(idx)
      } else {
        stack.push(tag)
      }
      continue
    }

    if (budget <= 0) break
    if (stack.some((t) => BLOCKED_TAGS.has(t))) continue

    let text = part
    // Inserted anchors are held as placeholders so later keywords never match inside them.
    const anchors: string[] = []
    for (const candidate of candidates) {
      if (budget <= 0) break
      if (usedTargets.has(candidate.path)) continue

      // Earliest occurrence among this target's phrases (the longer phrase wins a tie).
      let best: { start: number; original: string } | null = null
      for (const phrase of candidate.phrases) {
        if (usedKeywords.has(phrase.toLowerCase())) continue
        const regex = new RegExp(`(^|[^\\p{L}\\p{N}\\u0000])(${escapeRegExp(phrase)})(?=$|[^\\p{L}\\p{N}\\u0000])`, "iu")
        const found = regex.exec(text)
        if (!found) continue
        const start = found.index + found[1].length
        if (!best || start < best.start) best = { start, original: found[2] }
      }
      if (!best) continue

      const { start, original } = best
      const keyLower = original.toLowerCase()
      anchors.push(`<a href="${escapeAttr(candidate.path)}"${classAttr}>${original}</a>`)
      text = `${text.slice(0, start)}\u0000${anchors.length - 1}\u0000${text.slice(start + original.length)}`

      usedKeywords.add(keyLower)
      usedTargets.add(candidate.path)
      budget--
    }

    parts[i] = anchors.length ? text.replace(/\u0000(\d+)\u0000/g, (_m, n: string) => anchors[Number(n)]) : text
  }

  return parts.join("")
}
