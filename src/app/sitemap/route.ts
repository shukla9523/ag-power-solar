/**
 * Purpose: sitemap index (served at /sitemap.xml via the rewrite in next.config.js).
 */
import { buildSitemapIndex, SITEMAP_HEADERS } from "@lib/seo/sitemap"

export const revalidate = 3600

export async function GET() {
  return new Response(await buildSitemapIndex(), { status: 200, headers: SITEMAP_HEADERS })
}
