import { Metadata } from "next"
import Image from "next/image"
import { notFound, permanentRedirect } from "next/navigation"
import { findRedirect } from "@lib/seo/redirects"
import { cookies, draftMode } from "next/headers"
import { PREVIEW_COOKIE, getBlogPostAnyStatus, previewCookieAllows } from "@lib/data/blog-preview"
import { getBlogPost, getBlogPosts } from "@lib/data/blog-posts"
import { getSeoSetting } from "@lib/data/seo"
import { resolveBlogData, buildMetadataFromResolved, cleanCategoryName } from "@lib/schema/resolvers"
import JsonLd from "@modules/common/components/json-ld"
import { manrope, inter } from "@lib/fonts"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import PageFaqSection from "@modules/common/components/page-faq-section"
import { sanitizeRichHtml } from "@lib/util/sanitize"
import { linkKeywords, newLinkState } from "@lib/seo/keyword-links"

/**
 * Published post, or any status while a signed preview link for THIS slug is active
 * (draft mode + a cookie signed for this one post, so one link never unlocks other drafts).
 */
async function loadPost(slug: string) {
  const { isEnabled } = await draftMode()
  const preview = isEnabled && previewCookieAllows((await cookies()).get(PREVIEW_COOKIE)?.value, slug)
  return { preview, post: preview ? await getBlogPostAnyStatus(slug) : await getBlogPost(slug) }
}

export const revalidate = 60

export async function generateStaticParams() {
  const posts = await getBlogPosts()
  return posts.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const [{ post, preview }, seoSetting] = await Promise.all([
    loadPost(slug),
    getSeoSetting(`blog:${slug}`).catch(() => null),
  ])

  if (!post) {
    return {
      title: "Solar Insights | AG POWER",
      description: "Read rooftop solar guides, subsidy breakdowns, and solar technology insights by AG POWER.",
    }
  }

  const resolved = resolveBlogData(post, seoSetting)
  const metadata = buildMetadataFromResolved(resolved)
  // Previews of unpublished posts must never be indexed.
  return preview && post.status !== "published" ? { ...metadata, robots: { index: false, follow: false } } : metadata
}

export default async function BlogPostDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const [{ post, preview }, seoSetting, allPosts] = await Promise.all([
    loadPost(slug),
    getSeoSetting(`blog:${slug}`).catch(() => null),
    getBlogPosts().catch(() => []),
  ])

  // Renamed URLs 301 to their new address; anything else is a real 404 (not a soft redirect).
  if (!post) {
    const target = await findRedirect(`/blog/${slug}`)
    if (target) permanentRedirect(target)
    notFound()
  }

  const formattedDate = post.published_at
    ? new Date(post.published_at).toLocaleDateString("en-IN", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : ""

  // Sanitised article HTML with keyword internal links to the pages that own each keyword.
  const cleanContent = sanitizeRichHtml(post.content)
  const articleHtml = await linkKeywords(
    cleanContent,
    `/blog/${post.slug}`,
    newLinkState(cleanContent.replace(/<[^>]+>/g, " ").split(/\s+/).length)
  )

  const formattedFaqs = (post.faqs || []).map((f, i) => ({
    id: `blog-faq-${i + 1}`,
    question: f.question,
    answer: f.answer,
    category: "Article FAQ",
  }))

  // Related articles (matching category first or other guides, max 3)
  const relatedPosts = allPosts
    .filter((p) => p.slug !== post.slug)
    .sort((a, b) => {
      if (a.category_id === post.category_id && b.category_id !== post.category_id) return -1
      if (b.category_id === post.category_id && a.category_id !== post.category_id) return 1
      return 0
    })
    .slice(0, 3)

  return (
    <>
      {preview && (
        <div className="sticky top-0 z-50 bg-forest px-4 py-2 text-center text-[13px] font-semibold text-white">
          Preview — this post is {post.status === "published" ? "published" : `not public yet (${post.status})`}.{" "}
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- API route, full navigation intended */}
          <a href={`/api/preview/exit?to=/blog/${post.slug}`} className="underline text-gold">Exit preview</a>
        </div>
      )}
      <JsonLd type="blog" data={post} seoSetting={seoSetting} />

      <main className={`min-h-screen bg-ivory text-charcoal pb-24 ${inter.className}`}>
        {/* ─── BREADCRUMBS ─── */}
        <div className="border-b border-charcoal/10 bg-white">
          <div className="content-container mx-auto max-w-[1000px] px-4 py-4 sm:px-6 lg:px-8">
            <nav aria-label="Breadcrumb" className="flex items-center space-x-2 text-xs text-charcoal/60">
              <LocalizedClientLink href="/" className="hover:text-forest transition-colors">
                Home
              </LocalizedClientLink>
              <span>/</span>
              <LocalizedClientLink href="/blog" className="hover:text-forest transition-colors">
                Solar Insights
              </LocalizedClientLink>
              <span>/</span>
              <span className="font-medium text-forest truncate max-w-[200px] sm:max-w-[400px]">
                {post.title}
              </span>
            </nav>
          </div>
        </div>

        {/* ─── ARTICLE HEADER ─── */}
        <article className="content-container mx-auto max-w-[1000px] px-4 pt-10 sm:px-6 lg:px-8">
          <header className="mb-10 text-center sm:text-left">
            <span className="inline-block rounded-full bg-forest/10 px-4 py-1 text-xs font-bold uppercase tracking-wider text-forest border border-forest/15">
              {cleanCategoryName(post.category_id, "Solar Insights")}
            </span>

            <h1 className={`${manrope.className} mt-3 text-2xl sm:text-3xl lg:text-[34px] font-bold tracking-tight text-forest leading-snug`}>
              {post.title}
            </h1>

            <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-charcoal/70">
              <span className="font-medium text-forest">By {post.author_name || "AG POWER Solar Engineering Team"}</span>
              {formattedDate && (
                <>
                  <span>•</span>
                  <time dateTime={post.published_at || undefined}>{formattedDate}</time>
                </>
              )}
              <span>•</span>
              <span className="font-medium text-slate-600">
                {Math.max(1, Math.ceil((post.content || "").replace(/<[^>]+>/g, " ").trim().split(/\s+/).length / 200))} min read
              </span>
            </div>

            {post.excerpt && (
              <p className="mt-4 text-[15px] sm:text-[16px] leading-relaxed text-charcoal/80 border-l-4 border-gold pl-3.5 italic">
                {post.excerpt}
              </p>
            )}
          </header>

          {/* ─── FEATURED IMAGE (Max 360px height desktop, rounded corners) ─── */}
          {post.featured_image && (
            <div className="relative mb-8 h-[220px] sm:h-[300px] md:h-[350px] max-h-[360px] w-full overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 shadow-xs">
              <Image
                src={post.featured_image}
                alt={post.title}
                fill
                priority
                sizes="(max-width: 1000px) 100vw, 1000px"
                className="object-cover"
              />
            </div>
          )}

          {/* ─── ARTICLE BODY ─── */}
          <div className="rounded-2xl border border-charcoal/10 bg-white p-6 sm:p-10 lg:p-12 shadow-xs">
            <div
              className="prose prose-lg max-w-none prose-headings:font-extrabold prose-headings:text-forest prose-headings:tracking-tight prose-a:text-forest prose-a:font-semibold prose-a:no-underline hover:prose-a:underline prose-img:rounded-xl prose-strong:text-charcoal"
              dangerouslySetInnerHTML={{ __html: articleHtml }}
            />
          </div>

          {/* ─── SUBSIDY CALCULATOR CTA STRIP ─── */}
          <div className="mt-10 rounded-2xl bg-gradient-to-br from-forest-deep via-forest to-forest-deep p-6 sm:p-8 text-white shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-5">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-300">
                PM Surya Ghar Muft Bijli Yojana
              </span>
              <h3 className={`${manrope.className} mt-1 text-xl sm:text-2xl font-bold text-white`}>
                अपनी सोलर सब्सिडी और बचत चेक करें
              </h3>
              <p className="mt-1.5 text-[13px] text-emerald-100/90 max-w-lg leading-relaxed">
                अपने बिजली बिल के आधार पर जानें कि आपको कितनी सरकारी सब्सिडी (₹78,000 तक) मिलेगी और हर महीने कितनी बिजली फ्री होगी।
              </p>
            </div>
            <LocalizedClientLink
              href="/calculator"
              className="inline-flex items-center justify-center rounded-xl bg-amber-400 hover:bg-amber-300 px-5 py-3 text-[13.5px] font-bold text-slate-900 shadow-sm transition-all active:scale-95 flex-shrink-0"
            >
              <span>Check Subsidy &amp; Savings →</span>
            </LocalizedClientLink>
          </div>

          {/* ─── ARTICLE FAQS ─── */}
          {formattedFaqs.length > 0 && (
            <div className="mt-12">
              <PageFaqSection
                faqs={formattedFaqs}
                title="Frequently Asked Questions"
                subtitle="Key technical takeaways and practical advice on this solar topic."
              />
            </div>
          )}

          {/* ─── RELATED ARTICLES ─── */}
          {relatedPosts.length > 0 && (
            <div className="mt-16 border-t border-charcoal/10 pt-10">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[12px] font-bold uppercase tracking-wider text-charcoal-muted">
                    Continue Reading
                  </span>
                  <h3 className={`${manrope.className} mt-1 text-2xl font-extrabold text-forest`}>
                    Related Solar Articles
                  </h3>
                </div>
                <LocalizedClientLink
                  href="/blog"
                  className="text-[13px] font-bold text-forest hover:text-gold transition-colors"
                >
                  View All Guides →
                </LocalizedClientLink>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {relatedPosts.map((rel) => (
                  <article
                    key={rel.slug}
                    className="group flex flex-col justify-between rounded-2xl border border-charcoal/10 bg-white p-5 shadow-xs transition-all hover:border-forest/30 hover:shadow-md"
                  >
                    <div>
                      {rel.featured_image && (
                        <div className="relative mb-3.5 aspect-[16/9] w-full overflow-hidden rounded-xl bg-forest">
                          <Image
                            src={rel.featured_image}
                            alt={rel.title}
                            fill
                            sizes="(max-width: 640px) 100vw, 300px"
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        </div>
                      )}
                      {rel.category_id && (
                        <span className="text-[11px] font-bold uppercase tracking-wider text-forest">
                          {rel.category_id}
                        </span>
                      )}
                      <h4 className={`${manrope.className} mt-1.5 text-[15px] font-bold leading-snug text-forest transition-colors group-hover:text-gold`}>
                        <LocalizedClientLink href={`/blog/${rel.slug}`}>
                          {rel.title}
                        </LocalizedClientLink>
                      </h4>
                      {rel.excerpt && (
                        <p className="mt-2 text-[12.5px] line-clamp-2 text-charcoal/70 leading-relaxed">
                          {rel.excerpt}
                        </p>
                      )}
                    </div>
                    <div className="mt-4 pt-3 border-t border-charcoal/8">
                      <LocalizedClientLink
                        href={`/blog/${rel.slug}`}
                        className="text-[12px] font-bold text-forest hover:text-gold transition-colors inline-flex items-center gap-1"
                      >
                        Read Guide →
                      </LocalizedClientLink>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          )}

          {/* ─── ARTICLE FOOTER CTA ─── */}
          <div className="mt-12 rounded-2xl bg-forest p-8 text-center text-white shadow-md sm:p-12">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-gold/20 text-[24px]">
              ☀️
            </span>
            <h3 className={`${manrope.className} mt-3 text-2xl font-extrabold text-white sm:text-3xl`}>
              Ready to power your rooftop with smarter solar energy?
            </h3>
            <p className="mx-auto mt-3 max-w-xl text-white/80 text-sm sm:text-base leading-relaxed">
              Connect with AG POWER engineers for a free site feasibility survey, shadow analysis, and tailored 25-year financial savings proposal.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-4">
              <LocalizedClientLink
                href="/calculator"
                className={`${manrope.className} rounded-xl bg-emerald-600 hover:bg-emerald-500 px-7 py-3.5 text-sm font-bold text-white shadow-md transition-all active:scale-95`}
              >
                Calculate Solar Savings →
              </LocalizedClientLink>
              <LocalizedClientLink
                href="/contact"
                className={`${manrope.className} rounded-xl bg-white hover:bg-slate-100 px-6 py-3.5 text-sm font-bold text-slate-900 shadow-md transition-all active:scale-95`}
              >
                Request Free Site Survey
              </LocalizedClientLink>
            </div>
          </div>
        </article>
      </main>
    </>
  )
}
