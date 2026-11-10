/**
 * Tests for the central env module (review item C10): placeholders outside production,
 * a clear error on the production runtime, and no failure during `next build`.
 */
import { describe, it, expect, afterEach } from "vitest"
import {
  PLACEHOLDER_ANON_KEY,
  PLACEHOLDER_SERVICE_KEY,
  PLACEHOLDER_SUPABASE_URL,
  getPublicEnv,
  isProductionRuntime,
  readServerEnv,
} from "../env"

const VALID = {
  NEXT_PUBLIC_SUPABASE_URL: "https://abc.supabase.co",
  NEXT_PUBLIC_SUPABASE_ANON_KEY: "anon",
  SUPABASE_SERVICE_ROLE_KEY: "service",
}

describe("readServerEnv", () => {
  it("returns the validated values when everything is set", () => {
    const env = readServerEnv({ ...VALID, VERCEL_ENV: "production", CRON_SECRET: "c" })
    expect(env.NEXT_PUBLIC_SUPABASE_URL).toBe("https://abc.supabase.co")
    expect(env.CRON_SECRET).toBe("c")
  })

  it("falls back to placeholders in dev, test and preview", () => {
    for (const source of [{}, { VERCEL_ENV: "preview" }, { NODE_ENV: "test" }]) {
      const env = readServerEnv(source)
      expect(env.NEXT_PUBLIC_SUPABASE_URL).toBe(PLACEHOLDER_SUPABASE_URL)
      expect(env.NEXT_PUBLIC_SUPABASE_ANON_KEY).toBe(PLACEHOLDER_ANON_KEY)
      expect(env.SUPABASE_SERVICE_ROLE_KEY).toBe(PLACEHOLDER_SERVICE_KEY)
    }
  })

  it("throws a clear error naming the missing keys on the production runtime", () => {
    expect(() => readServerEnv({ VERCEL_ENV: "production", NEXT_PUBLIC_SUPABASE_URL: VALID.NEXT_PUBLIC_SUPABASE_URL })).toThrow(
      /NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY/
    )
  })

  it("treats empty strings and an invalid URL as missing in production", () => {
    expect(() => readServerEnv({ ...VALID, SUPABASE_SERVICE_ROLE_KEY: "  ", VERCEL_ENV: "production" })).toThrow(/SUPABASE_SERVICE_ROLE_KEY/)
    expect(() => readServerEnv({ ...VALID, NEXT_PUBLIC_SUPABASE_URL: "not a url", VERCEL_ENV: "production" })).toThrow(
      /NEXT_PUBLIC_SUPABASE_URL/
    )
  })

  it("does not throw during `next build`, even for a production deployment", () => {
    const env = readServerEnv({ VERCEL_ENV: "production", NEXT_PHASE: "phase-production-build" })
    expect(env.SUPABASE_SERVICE_ROLE_KEY).toBe(PLACEHOLDER_SERVICE_KEY)
  })

  it("never puts secret values in the error message", () => {
    try {
      readServerEnv({ ...VALID, NEXT_PUBLIC_SUPABASE_URL: "secret-not-a-url", VERCEL_ENV: "production" })
    } catch (e) {
      expect(String(e)).not.toContain("secret-not-a-url")
      expect(String(e)).not.toContain("service")
    }
  })
})

describe("isProductionRuntime", () => {
  it("is true only for VERCEL_ENV=production outside the build phase", () => {
    expect(isProductionRuntime({ VERCEL_ENV: "production" })).toBe(true)
    expect(isProductionRuntime({ VERCEL_ENV: "preview" })).toBe(false)
    expect(isProductionRuntime({ VERCEL_ENV: "production", NEXT_PHASE: "phase-production-build" })).toBe(false)
    expect(isProductionRuntime({})).toBe(false)
  })
})

describe("getPublicEnv", () => {
  const saved = { url: process.env.NEXT_PUBLIC_SUPABASE_URL, key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY }

  afterEach(() => {
    if (saved.url === undefined) delete process.env.NEXT_PUBLIC_SUPABASE_URL
    else process.env.NEXT_PUBLIC_SUPABASE_URL = saved.url
    if (saved.key === undefined) delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    else process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = saved.key
  })

  it("uses placeholders when the public values are absent", () => {
    delete process.env.NEXT_PUBLIC_SUPABASE_URL
    delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    expect(getPublicEnv()).toEqual({ supabaseUrl: PLACEHOLDER_SUPABASE_URL, supabaseAnonKey: PLACEHOLDER_ANON_KEY })
  })

  it("returns the configured public values", () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://abc.supabase.co"
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "anon"
    expect(getPublicEnv()).toEqual({ supabaseUrl: "https://abc.supabase.co", supabaseAnonKey: "anon" })
  })
})
