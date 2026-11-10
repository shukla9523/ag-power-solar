/**
 * Purpose: 301 redirects for renamed URLs (slug changes) without touching middleware
 * (public routes keep zero DB work in middleware, decision D-11).
 *
 * Detail pages call findRedirect() only when a slug is not found, then either
 * permanentRedirect() to the new URL or return a real 404 — never a soft redirect to a
 * listing page. Lookups are cached for 10 minutes.
 */

import "server-only"
import { supabaseAdmin } from "@lib/supabase-admin"
import { namedCache } from "@lib/util/ttl-cache"

const cache = namedCache<string | null>("redirects", 10 * 60 * 1000, 2000)

export async function findRedirect(path: string): Promise<string | null> {
  return cache.getOrSet(path, async () => {
    try {
      const { data } = await supabaseAdmin
        .from("redirects")
        .select("to_path")
        .eq("from_path", path)
        .eq("is_active", true)
        .maybeSingle()
      if (data?.to_path) {
        // Count hits without slowing the response.
        void supabaseAdmin.rpc("increment_redirect_hits", { p_from_path: path })
      }
      return (data?.to_path as string) || null
    } catch {
      return null // table not migrated yet
    }
  })
}

/** Records old → new after a slug rename and collapses chains (a → b, b → c ⇒ a → c). */
export async function recordRedirect(fromPath: string, toPath: string): Promise<void> {
  if (!fromPath || !toPath || fromPath === toPath) return
  try {
    await supabaseAdmin.from("redirects").update({ to_path: toPath }).eq("to_path", fromPath)
    await supabaseAdmin.from("redirects").delete().eq("from_path", toPath)
    await supabaseAdmin
      .from("redirects")
      .upsert({ from_path: fromPath, to_path: toPath, status_code: 301, is_active: true }, { onConflict: "from_path" })
  } catch {
    // redirects table exists after the 2026-11-08 migration
  }
  cache.clear()
}
