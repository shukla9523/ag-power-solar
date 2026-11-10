/**
 * Security regression tests for the 2026-11-09 review fixes: open redirect (S2), sheet
 * formula injection (S4), sanitiser (S10), slug-bound preview cookie (S8), lead e-mail
 * progress (C5), rate limiting and the TTL cache.
 */
import { describe, it, expect, beforeAll, vi, afterEach } from "vitest"
import { safeReturnUrl } from "../util/safe-redirect"
import { neutralizeFormula } from "../services/google-sheets"
import { isOwnSite, sanitizeRichHtml } from "../util/sanitize"
import { rateLimit, resetRateLimit, hashIp } from "../util/rate-limit"
import { TtlCache } from "../util/ttl-cache"

vi.mock("@lib/supabase-admin", () => ({ supabaseAdmin: {}, supabaseAnon: {} }))

const BASE = "https://www.mommantum.com/api/preview/exit"

describe("safeReturnUrl (S2 open redirect)", () => {
  it("keeps same-site paths", () => {
    expect(safeReturnUrl("/blog/my-post", BASE).href).toBe("https://www.mommantum.com/blog/my-post")
    expect(safeReturnUrl("/blog?page=2#top", BASE).pathname).toBe("/blog")
  })

  it.each(["/\\evil.com", "//evil.com", "/\\/evil.com", "https://evil.com", "javascript:alert(1)", "/%0d%0aevil", "", null])(
    "sends %s back to /blog",
    (to) => {
      const url = safeReturnUrl(to as string | null, BASE)
      expect(url.origin).toBe("https://www.mommantum.com")
    }
  )

  it("rejects backslash and control characters outright", () => {
    expect(safeReturnUrl("/\\evil.com", BASE).pathname).toBe("/blog")
    expect(safeReturnUrl("/a\tb", BASE).pathname).toBe("/blog")
  })
})

describe("neutralizeFormula (S4 sheet injection)", () => {
  it("prefixes values a spreadsheet would run as a formula", () => {
    expect(neutralizeFormula("=IMPORTXML(\"x\")")).toBe("'=IMPORTXML(\"x\")")
    expect(neutralizeFormula("+91 98765")).toBe("'+91 98765")
    expect(neutralizeFormula("-5")).toBe("'-5")
    expect(neutralizeFormula("@SUM(A1)")).toBe("'@SUM(A1)")
  })

  it("leaves normal text alone", () => {
    expect(neutralizeFormula("Rahul Sharma")).toBe("Rahul Sharma")
    expect(neutralizeFormula("rahul@example.com")).toBe("rahul@example.com")
  })
})

describe("sanitizeRichHtml (S10)", () => {
  it("drops style and id attributes", () => {
    const out = sanitizeRichHtml('<p id="login" style="position:fixed;inset:0" class="lead">Hi</p>')
    expect(out).toBe('<p class="lead">Hi</p>')
  })

  it("removes scripts, handlers and javascript: links", () => {
    const out = sanitizeRichHtml('<img src="x" onerror="alert(1)"><script>alert(1)</script><a href="javascript:alert(1)">x</a>')
    expect(out).not.toMatch(/onerror|<script|javascript:/i)
  })

  it("treats only mommantum.com as internal", () => {
    expect(isOwnSite("https://www.mommantum.com/services")).toBe(true)
    expect(isOwnSite("https://mommantum.com")).toBe(true)
    expect(isOwnSite("https://mommantum.com.evil.com/x")).toBe(false)
    expect(isOwnSite("https://evilmommantum.com")).toBe(false)
    const out = sanitizeRichHtml('<a href="https://mommantum.com.evil.com">x</a>')
    expect(out).toContain('rel="noopener noreferrer"')
  })
})

describe("preview cookie (S8)", () => {
  beforeAll(() => {
    process.env.PREVIEW_SECRET = "test-preview-secret"
  })

  it("unlocks only the slug it was signed for", async () => {
    const { createPreviewUrl, previewCookieAllows, previewCookieValue } = await import("../data/blog-preview")
    const params = new URL(createPreviewUrl("post-a").url, "https://x.test").searchParams
    const cookie = previewCookieValue("post-a", params.get("exp")!, params.get("sig")!)
    expect(previewCookieAllows(cookie, "post-a")).toBe(true)
    expect(previewCookieAllows(cookie, "post-b")).toBe(false)
    expect(previewCookieAllows(cookie.replace(/.$/, (c) => (c === "0" ? "1" : "0")), "post-a")).toBe(false)
    expect(previewCookieAllows(undefined, "post-a")).toBe(false)
  })

  it("has no fallback secret", async () => {
    const saved = process.env.PREVIEW_SECRET
    delete process.env.PREVIEW_SECRET
    const { createPreviewUrl } = await import("../data/blog-preview")
    expect(() => createPreviewUrl("post-a")).toThrow(/PREVIEW_SECRET/)
    process.env.PREVIEW_SECRET = saved
  })
})

describe("lead e-mail progress (C5)", () => {
  it("never re-sends the team e-mail once it went out", async () => {
    const { emailProgress } = await import("../services/leads-service")
    expect(emailProgress("pending")).toEqual({ teamDone: false, replyDone: false })
    expect(emailProgress("failed")).toEqual({ teamDone: false, replyDone: false })
    expect(emailProgress("team_sent")).toEqual({ teamDone: true, replyDone: false })
    expect(emailProgress("sent")).toEqual({ teamDone: true, replyDone: true })
  })
})

describe("rateLimit", () => {
  afterEach(() => resetRateLimit("t:key"))

  it("allows up to the limit, then blocks with a retry time", () => {
    for (let i = 0; i < 3; i++) expect(rateLimit("t:key", 3, 60_000).allowed).toBe(true)
    const blocked = rateLimit("t:key", 3, 60_000)
    expect(blocked.allowed).toBe(false)
    expect(blocked.retryAfterSeconds).toBeGreaterThan(0)
  })

  it("reset clears the bucket", () => {
    for (let i = 0; i < 4; i++) rateLimit("t:key", 3, 60_000)
    resetRateLimit("t:key")
    expect(rateLimit("t:key", 3, 60_000).allowed).toBe(true)
  })

  it("hashes IPs without storing them", async () => {
    const a = await hashIp("1.2.3.4")
    expect(a).toMatch(/^[0-9a-f]{64}$/)
    expect(a).not.toContain("1.2.3.4")
    expect(await hashIp("1.2.3.4")).toBe(a)
  })
})

describe("TtlCache", () => {
  it("expires entries after their TTL", () => {
    vi.useFakeTimers()
    const cache = new TtlCache<number>(1000)
    cache.set("a", 1)
    expect(cache.get("a")).toBe(1)
    vi.advanceTimersByTime(1001)
    expect(cache.get("a")).toBeUndefined()
    vi.useRealTimers()
  })

  it("getOrSet shares one load and does not cache failures", async () => {
    const cache = new TtlCache<number>(60_000)
    let calls = 0
    const loader = async () => ++calls
    const [x, y] = await Promise.all([cache.getOrSet("k", loader), cache.getOrSet("k", loader)])
    expect([x, y, calls]).toEqual([1, 1, 1])
    await expect(cache.getOrSet("bad", async () => { throw new Error("boom") })).rejects.toThrow("boom")
    expect(cache.get("bad")).toBeUndefined()
  })
})

describe("lead PII masking for marketers (S12)", () => {
  it("masks email and phone but keeps the rest", async () => {
    const { maskLeadPii, maskEmail, maskPhone } = await import("../util/mask-pii")
    expect(maskEmail("rahul.sharma@gmail.com")).toBe("r***@gmail.com")
    expect(maskPhone("+91 98765 43210")).toMatch(/^•+10$/)
    expect(maskPhone(null)).toBeNull()
    const lead = maskLeadPii({ name: "Rahul", email: "rahul@x.in", phone: "9876543210", subject: "SEO" })
    expect(lead).toMatchObject({ name: "Rahul", subject: "SEO", email: "r***@x.in" })
    expect(lead.phone).not.toContain("98765")
  })
})
