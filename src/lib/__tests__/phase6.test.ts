/**
 * Tests for Phase 6: audit diffs, scheduled publishing rules, signed preview links and the
 * 2FA gates.
 */
import { describe, it, expect, beforeAll } from "vitest"
import { changedFields } from "../services/audit"
import { validateSchedule } from "../services/content-admin"
import { createPreviewUrl, verifyPreview } from "../data/blog-preview"
import { needsMfaEnrolment, needsMfaStep } from "../auth/resolve-role"

describe("Audit log diffs", () => {
  it("lists only fields that actually changed (timestamps ignored)", () => {
    const before = { title: "A", slug: "a", updated_at: "1", tags: ["x"] }
    const after = { title: "B", slug: "a", updated_at: "2", tags: ["x"] }
    expect(changedFields(before, after)).toEqual(["title"])
  })

  it("treats create and delete as all fields changed", () => {
    expect(changedFields(null, { title: "A" })).toEqual(["title"])
    expect(changedFields({ title: "A" }, null)).toEqual(["title"])
  })
})

describe("Scheduled publishing rules", () => {
  it("accepts draft / published without a date", () => {
    expect(validateSchedule("draft", null)).toBeNull()
    expect(validateSchedule("published", null)).toBeNull()
    expect(validateSchedule(undefined, null)).toBeNull()
  })

  it("requires a future date for scheduled posts", () => {
    expect(validateSchedule("scheduled", null)).toMatch(/date/)
    expect(validateSchedule("scheduled", "2001-01-01T00:00:00Z")).toMatch(/future/)
    expect(validateSchedule("scheduled", new Date(Date.now() + 3600_000).toISOString())).toBeNull()
  })

  it("rejects unknown statuses", () => {
    expect(validateSchedule("archived", null)).toBe("Invalid status")
  })
})

describe("Signed preview links", () => {
  beforeAll(() => {
    process.env.PREVIEW_SECRET = "preview-secret-for-tests"
  })

  it("verifies its own links and rejects tampering", () => {
    const { url } = createPreviewUrl("my-draft")
    const params = new URL(url, "https://x.test").searchParams
    expect(verifyPreview("my-draft", params.get("exp")!, params.get("sig")!)).toBe(true)
    expect(verifyPreview("other-post", params.get("exp")!, params.get("sig")!)).toBe(false)
    expect(verifyPreview("my-draft", String(Number(params.get("exp")) + 10), params.get("sig")!)).toBe(false)
    expect(verifyPreview("my-draft", params.get("exp")!, "0".repeat(64))).toBe(false)
  })

  it("rejects expired links", () => {
    expect(verifyPreview("my-draft", String(Math.floor(Date.now() / 1000) - 5), "a".repeat(64))).toBe(false)
  })
})

describe("2FA gates", () => {
  const base = { userId: "u", email: "a@b.com", role: "admin" as const, isOwner: false }

  it("asks for a code only when 2FA is on and the session is not aal2", () => {
    expect(needsMfaStep({ ...base, mfaEnabled: true }, "aal1")).toBe(true)
    expect(needsMfaStep({ ...base, mfaEnabled: true }, "aal2")).toBe(false)
    expect(needsMfaStep({ ...base, mfaEnabled: false }, "aal1")).toBe(false)
  })

  it("forces enrolment for owner/admin only when REQUIRE_ADMIN_MFA=true", () => {
    delete process.env.REQUIRE_ADMIN_MFA
    expect(needsMfaEnrolment({ ...base, mfaEnabled: false })).toBe(false)
    process.env.REQUIRE_ADMIN_MFA = "true"
    expect(needsMfaEnrolment({ ...base, mfaEnabled: false })).toBe(true)
    expect(needsMfaEnrolment({ ...base, role: "marketer", mfaEnabled: false })).toBe(false)
    expect(needsMfaEnrolment({ ...base, mfaEnabled: true })).toBe(false)
    delete process.env.REQUIRE_ADMIN_MFA
  })
})
