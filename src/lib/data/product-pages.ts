/**
 * Purpose: server data layer for editable product pages (EDITZ, Blog AI).
 *
 * getProductContent(slug) returns the code defaults merged with the admin overrides stored
 * in product_pages.content (anon read, RLS public-select). Reads are cached with the
 * "product-pages" tag (revalidate 300s); the admin API calls revalidateTag after each write.
 * Any read failure — including the table not existing before migration M-05 — silently
 * falls back to the defaults, so the public pages always render.
 */

import "server-only"
import { unstable_cache } from "next/cache"
import { supabaseAnon } from "@lib/supabase-admin"
import {
  mergeProductContent,
  toOverrideObject,
  type ProductContentMap,
  type ProductSlug,
} from "@lib/validation/product-pages"

export const PRODUCT_PAGES_TAG = "product-pages"

async function readOverrides(slug: ProductSlug): Promise<Record<string, unknown>> {
  try {
    const { data, error } = await supabaseAnon.from("product_pages").select("content").eq("slug", slug).maybeSingle()
    if (error || !data) return {}
    return toOverrideObject((data as { content?: unknown }).content)
  } catch {
    return {}
  }
}

const getCachedOverrides = unstable_cache(readOverrides, ["product-pages-overrides"], {
  tags: [PRODUCT_PAGES_TAG],
  revalidate: 300,
})

export async function getProductContent<S extends ProductSlug>(slug: S): Promise<ProductContentMap[S]> {
  const overrides = await getCachedOverrides(slug).catch(() => ({}))
  return mergeProductContent(slug, overrides).content
}
