/**
 * Tests for the 2026-11-08 platform rules: token verification, owner protection, meta-object
 * field locks, keyword internal linking, theme validation, upload validation and sitemaps.
 */
import { describe, it, expect, beforeAll } from "vitest"
import { injectInternalLinks } from "../util/linker"
import { buildHumanMetaUpdate, isEmptyValue } from "../seo/meta-fields"
import { validateThemeTokens, buildThemeCss, contrastOnWhite } from "../theme/theme-tokens"
import { detectImageType, validateImageBytes, SAFE_OBJECT_NAME } from "../util/image-validation"
import { normalizeRole, isPathAllowed, rolesConfig } from "../config/roles"
import { isOwnerEmail } from "../config/owner"
import { canModifyUser, canAssignRole } from "../services/users-admin"
import { escapeXml } from "../seo/sitemap"
import { verifyAccessToken } from "../auth/verify-token"

const b64url = (input: string | Uint8Array) =>
  Buffer.from(input).toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "")

async function signHs256(payload: Record<string, unknown>, secret: string): Promise<string> {
  const header = b64url(JSON.stringify({ alg: "HS256", typ: "JWT" }))
  const body = b64url(JSON.stringify(payload))
  const key = await globalThis.crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"])
  const sig = new Uint8Array(await globalThis.crypto.subtle.sign("HMAC", key, new TextEncoder().encode(`${header}.${body}`)))
  return `${header}.${body}.${b64url(sig)}`
}

describe("Access token verification", () => {
  beforeAll(() => {
    process.env.SUPABASE_JWT_SECRET = "test-secret-for-unit-tests-only"
  })

  it("accepts a correctly signed, unexpired token", async () => {
    const token = await signHs256({ sub: "11111111-1111-1111-1111-111111111111", email: "a@b.com", exp: Math.floor(Date.now() / 1000) + 600 }, "test-secret-for-unit-tests-only")
    const result = await verifyAccessToken(token)
    expect(result?.userId).toBe("11111111-1111-1111-1111-111111111111")
  })

  it("rejects a forged token (wrong signature) — the original auth bypass", async () => {
    const forged = await signHs256({ sub: "22222222-2222-2222-2222-222222222222", exp: Math.floor(Date.now() / 1000) + 600 }, "attacker-secret")
    expect(await verifyAccessToken(forged)).toBeNull()
  })

  it("rejects an expired token and garbage input", async () => {
    const expired = await signHs256({ sub: "33333333-3333-3333-3333-333333333333", exp: Math.floor(Date.now() / 1000) - 10 }, "test-secret-for-unit-tests-only")
    expect(await verifyAccessToken(expired)).toBeNull()
    expect(await verifyAccessToken("not-a-jwt")).toBeNull()
    expect(await verifyAccessToken(undefined)).toBeNull()
  })
})

describe("Roles and owner", () => {
  it("maps legacy roles to the 4-role model", () => {
    expect(normalizeRole("manager")).toBe("marketer")
    expect(normalizeRole("seo")).toBe("marketer")
    expect(normalizeRole("admin")).toBe("admin")
    expect(normalizeRole("anything")).toBe("customer")
  })

  it("customers cannot open the admin; marketers cannot open users/settings", () => {
    expect(isPathAllowed("/admin", rolesConfig.customer.allowedFrontendPaths)).toBe(false)
    expect(isPathAllowed("/admin/users", rolesConfig.marketer.allowedFrontendPaths)).toBe(false)
    expect(isPathAllowed("/admin/settings", rolesConfig.marketer.allowedFrontendPaths)).toBe(false)
    expect(isPathAllowed("/admin/blog", rolesConfig.marketer.allowedFrontendPaths)).toBe(true)
  })

  it("recognises the owner email case-insensitively", () => {
    expect(isOwnerEmail("AkashShukla9523@gmail.com")).toBe(true)
    expect(isOwnerEmail("admin@mommantum.com")).toBe(false)
  })

  it("nobody but the owner can modify the owner account", () => {
    const owner = { id: "o", email: "akashshukla9523@gmail.com", role: "owner", status: "approved" }
    const admin = { userId: "a", email: "a@x.com", role: "admin" as const, isOwner: false, mfaEnabled: false }
    const self = { userId: "o", email: owner.email, role: "owner" as const, isOwner: true, mfaEnabled: false }
    expect(canModifyUser(admin, owner).allowed).toBe(false)
    expect(canModifyUser(self, owner).allowed).toBe(true)
    expect(canAssignRole(admin, "owner").allowed).toBe(false)
    expect(canAssignRole(admin, "admin").allowed).toBe(false)
    expect(canAssignRole(self, "admin").allowed).toBe(true)
  })
})

describe("Meta-object field locks", () => {
  it("never erases a stored value with an empty one and marks human edits", () => {
    const stored = { meta_title: "Saved title", og_title: "Saved OG", field_sources: { og_title: "ai" } }
    const { update, sources } = buildHumanMetaUpdate({ meta_title: "", og_title: "Human fixed OG", primary_keyword: "seo agency jaipur" }, stored)
    expect(update.meta_title).toBeUndefined()
    expect(update.og_title).toBe("Human fixed OG")
    expect(sources.og_title).toBe("human")
    expect(sources.primary_keyword).toBe("human")
  })

  it("clears a field only when explicitly asked", () => {
    const { update } = buildHumanMetaUpdate({ meta_title: "" }, { meta_title: "x" }, ["meta_title"])
    expect(update.meta_title).toBeNull()
  })

  it("treats empty strings and arrays as empty", () => {
    expect(isEmptyValue("  ")).toBe(true)
    expect(isEmptyValue([])).toBe(true)
    expect(isEmptyValue("x")).toBe(false)
  })
})

describe("Keyword internal linking", () => {
  const links = [
    { keyword: "performance marketing", target_url: "/services/performance-marketing" },
    { keyword: "seo", target_url: "/services/search-engine-optimization" },
    { keyword: "seo agency in jaipur", target_url: "/" },
  ]

  it("links the first occurrence with the keyword as anchor text", () => {
    const html = "<p>Our performance marketing team. More performance marketing.</p>"
    const out = injectInternalLinks(html, links, { currentPath: "/blog/x" })
    expect(out).toBe('<p>Our <a href="/services/performance-marketing">performance marketing</a> team. More performance marketing.</p>')
  })

  it("never links inside headings, existing links, or to the current page", () => {
    const html = '<h2>SEO tips</h2><p><a href="/x">seo</a> and seo again</p>'
    expect(injectInternalLinks(html, links, { currentPath: "/services/search-engine-optimization" })).toBe(html)
    const out = injectInternalLinks(html, links, { currentPath: "/blog/x" })
    expect(out).toContain("<h2>SEO tips</h2>")
    expect(out).toContain('and <a href="/services/search-engine-optimization">seo</a> again')
  })

  it("prefers the longest keyword and respects word boundaries", () => {
    const out = injectInternalLinks("<p>Best seo agency in jaipur. Also seoul.</p>", links, { currentPath: "/blog/x" })
    expect(out).toContain('<a href="/">seo agency in jaipur</a>')
    expect(out).toContain("seoul")
    expect(out).not.toContain(">seoul<")
  })

  it("skips targets the author already linked and honours the cap", () => {
    const html = '<p><a href="/services/performance-marketing">PM</a> performance marketing and seo</p>'
    const out = injectInternalLinks(html, links, { currentPath: "/blog/x", maxLinks: 1 })
    expect(out.match(/href="\/services\/performance-marketing"/g)?.length).toBe(1)
    expect((out.match(/<a /g) || []).length).toBe(2)
  })
})

describe("Theme tokens", () => {
  it("accepts valid colours and builds :root overrides", () => {
    expect(buildThemeCss({ brand: "#d01a66" })).toBe(":root{--color-brand:208 26 102;}")
  })

  it("rejects unknown tokens, bad hex and low-contrast text colours", () => {
    expect(validateThemeTokens({ nope: "#000000" })).toEqual({ tokens: {} })
    expect("error" in validateThemeTokens({ brand: "pink" })).toBe(true)
    expect("error" in validateThemeTokens({ navy: "#f0f0f0" })).toBe(true)
    expect(contrastOnWhite("#0e2547")).toBeGreaterThan(4.5)
  })
})

describe("Uploads and sitemaps", () => {
  it("detects real image types from magic bytes and rejects SVG/HTML", () => {
    const png = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0, 0, 0, 0])
    expect(detectImageType(png)?.mime).toBe("image/png")
    const svg = new TextEncoder().encode('<svg xmlns="http://www.w3.org/2000/svg"><script/></svg>')
    expect(validateImageBytes(svg).ok).toBe(false)
    expect(SAFE_OBJECT_NAME.test("../secret.png")).toBe(false)
    expect(SAFE_OBJECT_NAME.test("hero-1731000000000-ab12c.webp")).toBe(true)
  })

  it("escapes XML in sitemap values", () => {
    expect(escapeXml("/a?b=1&c=<2>")).toBe("/a?b=1&amp;c=&lt;2&gt;")
  })
})
