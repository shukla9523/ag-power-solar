import { describe, it, expect } from "vitest"
import { toSlug } from "../util/slug"
import { normalizeSlug } from "../services/content-admin"

describe("Admin Lead Date-Range & Timezone Calculations", () => {
  it("computes Asia/Kolkata midnight correctly", () => {
    const now = new Date("2026-11-24T12:00:00.000Z")
    const kolkataFormatter = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Kolkata",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
    const kolkataDateStr = kolkataFormatter.format(now) // YYYY-MM-DD
    const [year, month, day] = kolkataDateStr.split("-").map(Number)
    // Asia/Kolkata is UTC+5:30. Midnight in Kolkata corresponds to 18:30 UTC of previous day.
    const kolkataMidnightUtc = new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0) - 5.5 * 60 * 60 * 1000)

    expect(kolkataMidnightUtc.toISOString()).toBe("2026-11-23T18:30:00.000Z")
    expect(kolkataMidnightUtc.getTime()).toBeLessThan(now.getTime())
  })

  it("enforces week <= month lead count invariant", () => {
    // Generate simulated leads
    const baseTime = Date.now()
    const leads = [
      { created_at: new Date(baseTime - 1 * 3600 * 1000).toISOString() }, // today
      { created_at: new Date(baseTime - 2 * 24 * 3600 * 1000).toISOString() }, // 2 days ago
      { created_at: new Date(baseTime - 5 * 24 * 3600 * 1000).toISOString() }, // 5 days ago
      { created_at: new Date(baseTime - 15 * 24 * 3600 * 1000).toISOString() }, // 15 days ago
      { created_at: new Date(baseTime - 25 * 24 * 3600 * 1000).toISOString() }, // 25 days ago
    ]

    const sevenDaysAgo = baseTime - 7 * 24 * 3600 * 1000
    const thirtyDaysAgo = baseTime - 30 * 24 * 3600 * 1000

    const weekCount = leads.filter((l) => new Date(l.created_at).getTime() >= sevenDaysAgo).length
    const monthCount = leads.filter((l) => new Date(l.created_at).getTime() >= thirtyDaysAgo).length

    expect(weekCount).toBe(3)
    expect(monthCount).toBe(5)
    expect(weekCount).toBeLessThanOrEqual(monthCount)
  })
})

describe("Slug Generation and Normalization", () => {
  it("normalizes basic strings into clean kebab-case slugs", () => {
    expect(toSlug("Solar Rooftop 5kW Installation")).toBe("solar-rooftop-5kw-installation")
    expect(toSlug("  PM Surya Ghar Muft Bijli Yojana  ")).toBe("pm-surya-ghar-muft-bijli-yojana")
  })

  it("handles special characters and accents cleanly", () => {
    expect(toSlug("Save 80% on Electricity Bills in Bihar & UP!")).toBe("save-80-on-electricity-bills-in-bihar-up")
    expect(toSlug("What's Next for Solar in 2026?")).toBe("what-s-next-for-solar-in-2026")
  })

  it("returns null for empty or unusable inputs in normalizeSlug", () => {
    expect(normalizeSlug("")).toBeNull()
    expect(normalizeSlug("   ")).toBeNull()
    expect(normalizeSlug("!!!@@@###")).toBeNull()
    expect(normalizeSlug("Valid-Title")).toBe("valid-title")
  })
})

describe("SEO Audit Score Calculation Algorithm", () => {
  function computeWeightedScore(errorsCount: number, warningsCount: number): number {
    return Math.max(0, Math.min(100, 100 - (errorsCount * 15 + warningsCount * 5)))
  }

  it("gives 100% for a clean page with 0 errors and 0 warnings", () => {
    expect(computeWeightedScore(0, 0)).toBe(100)
  })

  it("deducts 15 points per error and 5 points per warning", () => {
    expect(computeWeightedScore(1, 0)).toBe(85)
    expect(computeWeightedScore(0, 2)).toBe(90)
    expect(computeWeightedScore(2, 3)).toBe(55) // 100 - 30 - 15 = 55
  })

  it("clamps lowest score to 0 and never returns negative numbers", () => {
    expect(computeWeightedScore(10, 10)).toBe(0)
    expect(computeWeightedScore(20, 0)).toBe(0)
  })
})
