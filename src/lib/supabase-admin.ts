/**
 * Purpose: server-side Supabase clients. Credentials come only from the validated env module
 * (@lib/env, no hardcoded keys). supabaseAdmin bypasses RLS and must only be used inside
 * route handlers / server code.
 *
 * The clients are created on first use, not at import, so a missing env value on the
 * production deployment fails the request with a clear error (fail closed) while
 * `next build` and the test suite still import this module without any env.
 */
import "server-only"
import { createClient } from "@supabase/supabase-js"
import { getServerEnv } from "@lib/env"

const SERVER_AUTH = { auth: { persistSession: false, autoRefreshToken: false } }

function createAdminClient() {
  const env = getServerEnv()
  return createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, SERVER_AUTH)
}

function createAnonClient() {
  const env = getServerEnv()
  return createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY, SERVER_AUTH)
}

/** Wraps a client factory so the client is built on the first property access. */
function lazyClient<T extends object>(factory: () => T): T {
  let instance: T | null = null
  const get = () => (instance ??= factory())
  return new Proxy({} as T, {
    get(_target, prop) {
      const client = get()
      const value: unknown = Reflect.get(client, prop, client)
      return typeof value === "function" ? value.bind(client) : value
    },
    has(_target, prop) {
      return prop in get()
    },
  })
}

// Admin client — bypasses RLS, only used in server-side API routes
export const supabaseAdmin = lazyClient(createAdminClient)

// Server-side anonymous client - used for token verification on server side
export const supabaseAnon = lazyClient(createAnonClient)
