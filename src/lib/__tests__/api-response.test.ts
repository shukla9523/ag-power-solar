/**
 * Tests for the standard API response helpers (review item C3) and the unique-violation
 * → 409 SLUG_TAKEN mapping used by admin content writes (review item C8).
 */
import { describe, it, expect } from "vitest"
import { z } from "zod"
import { fail, failWithStatus, forbidden, ok, okList, pageMeta, serverError, validationFail } from "../util/api-response"
import { writeFailure } from "../services/content-admin"

describe("api-response helpers", () => {
  it("ok() keeps every existing top-level key and adds success: true", async () => {
    const res = ok({ leads: [1, 2], meta: { page: 1 } })
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ success: true, leads: [1, 2], meta: { page: 1 } })
  })

  it("okList() wraps an array in data", async () => {
    expect(await okList([{ id: 1 }]).json()).toEqual({ success: true, data: [{ id: 1 }] })
  })

  it("fail() keeps error as a string the admin UI can show", async () => {
    const res = fail("Slug taken", "SLUG_TAKEN", 409)
    expect(res.status).toBe(409)
    expect(await res.json()).toEqual({ success: false, error: "Slug taken", code: "SLUG_TAKEN" })
  })

  it("extra keys cannot override success, error or code", async () => {
    const body = await fail("Invalid payload", "VALIDATION_ERROR", 400, { details: ["a"], success: true, error: "x" }).json()
    expect(body).toEqual({ success: false, error: "Invalid payload", code: "VALIDATION_ERROR", details: ["a"] })
  })

  it("shortcuts use the right status and code", async () => {
    expect(forbidden().status).toBe(403)
    expect((await forbidden().json()).error).toBe("Unauthorized")
    expect(serverError("Could not save").status).toBe(500)
    expect((await failWithStatus("Run migration", 503).json()).code).toBe("UNAVAILABLE")
    expect((await failWithStatus("Odd", 418).json()).code).toBe("BAD_REQUEST")
  })

  it("validationFail() returns the first readable issue", async () => {
    const schema = z.object({ faqs: z.array(z.object({ answer: z.string().min(1, "FAQ answer is required") })) })
    const parsed = schema.safeParse({ faqs: [{ answer: "" }] })
    expect(parsed.success).toBe(false)
    if (parsed.success) return
    const res = validationFail(parsed.error)
    expect(res.status).toBe(400)
    expect(await res.json()).toMatchObject({ success: false, code: "VALIDATION_ERROR", error: "faqs.0.answer: FAQ answer is required" })
  })

  it("validationFail() drops the path when the message already names the field", async () => {
    const parsed = z.object({ title: z.string().min(1, "Title is required") }).safeParse({ title: "" })
    if (parsed.success) throw new Error("expected failure")
    expect((await validationFail(parsed.error).json()).error).toBe("Title is required")
  })

  it("pageMeta() adds totalPages", () => {
    expect(pageMeta(2, 25, 51)).toEqual({ page: 2, limit: 25, total: 51, totalPages: 3 })
    expect(pageMeta(1, 25, 0).totalPages).toBe(1)
  })
})

describe("writeFailure (unique violation → 409)", () => {
  it("maps Postgres 23505 to 409 SLUG_TAKEN", async () => {
    const res = writeFailure({ code: "23505", message: "duplicate key value violates unique constraint" }, "my-post", "Could not save")
    expect(res.status).toBe(409)
    const body = await res.json()
    expect(body).toEqual({ success: false, error: "Slug 'my-post' is already used", code: "SLUG_TAKEN" })
  })

  it("never leaks the raw database message on other errors", async () => {
    const res = writeFailure({ code: "XX000", message: "internal secret detail" }, "my-post", "Could not save the post")
    expect(res.status).toBe(500)
    expect(JSON.stringify(await res.json())).not.toContain("secret")
  })
})
