/**
 * Purpose: central, Zod-validated environment access (review item C10).
 *
 * getServerEnv() validates the server variables on first use. On the production deployment
 * (VERCEL_ENV=production, outside `next build`) a missing or invalid required value throws a
 * clear error at request time, so the app fails closed instead of talking to a placeholder.
 * In build, test, preview and local dev the old placeholder values are used, so `next build`
 * without env and the vitest suite keep working.
 *
 * getPublicEnv() reads only NEXT_PUBLIC_* values with literal `process.env.X` access, which
 * Next inlines into the browser bundle. It never throws: the public site degrades to its
 * built-in fallbacks, while server writes fail closed through getServerEnv().
 * Never log or return the values themselves.
 */

import { z } from "zod"

export const PLACEHOLDER_SUPABASE_URL = "http://supabase-url-not-configured.invalid"
export const PLACEHOLDER_ANON_KEY = "anon-key-not-configured"
export const PLACEHOLDER_SERVICE_KEY = "service-key-not-configured"

const optional = z.string().trim().min(1).optional()

const ServerEnvSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().trim().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().trim().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().trim().min(1),
  SUPABASE_JWT_SECRET: optional,
  CRON_SECRET: optional,
  PUBLISH_API_KEY: optional,
  PREVIEW_SECRET: optional,
  OWNER_EMAIL: optional,
})

export type ServerEnv = z.infer<typeof ServerEnvSchema>

type EnvSource = Record<string, string | undefined>

/** True only on the live production deployment at runtime (not during `next build`). */
export function isProductionRuntime(source: EnvSource = process.env): boolean {
  return source.VERCEL_ENV === "production" && source.NEXT_PHASE !== "phase-production-build"
}

/** Empty strings count as missing, so `FOO=` in a .env file is reported clearly. */
function clean(source: EnvSource): EnvSource {
  const out: EnvSource = {}
  for (const key of Object.keys(ServerEnvSchema.shape)) {
    const value = source[key]?.trim()
    if (value) out[key] = value
  }
  return out
}

/** Validates `source` without caching (exported for tests). */
export function readServerEnv(source: EnvSource = process.env): ServerEnv {
  const values = clean(source)
  const parsed = ServerEnvSchema.safeParse(values)
  if (parsed.success) return parsed.data

  if (isProductionRuntime(source)) {
    const names = Array.from(new Set(parsed.error.issues.map((issue) => String(issue.path[0]))))
    throw new Error(`Server environment is missing or invalid: ${names.join(", ")}. Set them in the Vercel project settings.`)
  }

  const url = values.NEXT_PUBLIC_SUPABASE_URL
  return {
    ...values,
    NEXT_PUBLIC_SUPABASE_URL: url && z.string().url().safeParse(url).success ? url : PLACEHOLDER_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: values.NEXT_PUBLIC_SUPABASE_ANON_KEY || PLACEHOLDER_ANON_KEY,
    SUPABASE_SERVICE_ROLE_KEY: values.SUPABASE_SERVICE_ROLE_KEY || PLACEHOLDER_SERVICE_KEY,
  }
}

let cached: ServerEnv | null = null

/** Validated server env; cached after the first successful read. */
export function getServerEnv(): ServerEnv {
  if (!cached) cached = readServerEnv()
  return cached
}

/** Clears the cache (tests only). */
export function resetServerEnvCache(): void {
  cached = null
}

export interface PublicEnv {
  supabaseUrl: string
  supabaseAnonKey: string
}

/** NEXT_PUBLIC_* values, safe for the browser; placeholders when absent. */
export function getPublicEnv(): PublicEnv {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim()
  return {
    supabaseUrl: url && /^https?:\/\/\S+$/i.test(url) ? url : PLACEHOLDER_SUPABASE_URL,
    supabaseAnonKey: anonKey || PLACEHOLDER_ANON_KEY,
  }
}
