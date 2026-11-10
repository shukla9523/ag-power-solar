/**
 * Purpose: child sitemaps — /sitemap/pages.xml, /sitemap/services.xml, /sitemap/blogs.xml,
 * /sitemap/work.xml — generated from the database.
 */
import { buildChildSitemap, SITEMAP_HEADERS, SITEMAP_NAMES, SitemapName } from "@lib/seo/sitemap"

export const revalidate = 3600

export async function GET(_req: Request, { params }: { params: Promise<{ name: string }> }) {
  const name = (await params).name.replace(/\.xml$/, "") as SitemapName
  if (!SITEMAP_NAMES.includes(name)) {
    return new Response("Not Found", { status: 404 })
  }
  return new Response(await buildChildSitemap(name), { status: 200, headers: SITEMAP_HEADERS })
}
