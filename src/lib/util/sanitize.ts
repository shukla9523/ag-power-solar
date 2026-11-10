/**
 * Purpose: allowlist HTML sanitiser for stored rich content (blog posts, service copy).
 *
 * Why: blog HTML is rendered with dangerouslySetInnerHTML. Content arrives from the admin
 * editor and from the external publishing API, so scripts, event handlers, javascript:
 * URLs and iframes from untrusted sources are stripped both when saving and when rendering.
 * Normal article markup (headings, lists, tables, images, links, figures) is preserved.
 */

import sanitizeHtml from "sanitize-html"

const OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: [
    "h1", "h2", "h3", "h4", "h5", "h6", "p", "br", "hr", "blockquote", "pre", "code",
    "strong", "b", "em", "i", "u", "s", "mark", "small", "sub", "sup", "span", "div",
    "ul", "ol", "li", "dl", "dt", "dd", "a", "img", "figure", "figcaption", "picture", "source",
    "table", "thead", "tbody", "tfoot", "tr", "th", "td", "caption", "colgroup", "col",
    "section", "article", "aside", "details", "summary", "iframe",
  ],
  allowedAttributes: {
    // No style (CSS-based UI spoofing / data exfiltration) and no id (DOM clobbering).
    "*": ["class", "title", "aria-label", "aria-hidden", "role", "dir", "lang"],
    a: ["href", "name", "target", "rel"],
    img: ["src", "srcset", "sizes", "alt", "width", "height", "loading", "decoding"],
    source: ["srcset", "type", "media", "sizes"],
    iframe: ["src", "width", "height", "allow", "allowfullscreen", "loading", "title", "frameborder"],
    td: ["colspan", "rowspan"],
    th: ["colspan", "rowspan", "scope"],
    ol: ["start", "type"],
  },
  allowedSchemes: ["http", "https", "mailto", "tel"],
  allowedSchemesByTag: { img: ["http", "https", "data"] },
  allowProtocolRelative: false,
  // Only video embeds from trusted hosts may use iframes.
  allowedIframeHostnames: ["www.youtube.com", "www.youtube-nocookie.com", "player.vimeo.com", "www.loom.com"],
  transformTags: {
    a: (tagName, attribs) => {
      const href = attribs.href || ""
      const external = /^https?:\/\//i.test(href) && !isOwnSite(href)
      return {
        tagName,
        attribs: external ? { ...attribs, target: "_blank", rel: "noopener noreferrer" } : attribs,
      }
    },
  },
}

/** True only for mommantum.com itself (not look-alikes such as mommantum.com.evil.com). */
export function isOwnSite(href: string): boolean {
  try {
    return /^(www\.)?mommantum\.com$/i.test(new URL(href).hostname)
  } catch {
    return false
  }
}

export function sanitizeRichHtml(html: string | null | undefined): string {
  if (!html) return ""
  return sanitizeHtml(html, OPTIONS)
}
