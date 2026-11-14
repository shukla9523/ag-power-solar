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
  const [{ post, preview }, seoSetting] = await Promise.all([
    loadPost(slug),
    getSeoSetting(`blog:${slug}`).catch(() => null),
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

            <h1 className={`${manrope.className} mt-4 text-3xl font-extrabold tracking-[-0.03em] text-forest sm:text-4xl lg:text-5xl lg:leading-[1.15]`}>
              {post.title}
            </h1>

            <div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-charcoal/70">
              <span className="font-medium text-forest">By {post.author_name || "AG POWER Solar Engineering Team"}</span>
              {formattedDate && (
                <>
                  <span>•</span>
                  <time dateTime={post.published_at || undefined}>{formattedDate}</time>
                </>
              )}
            </div>

            {post.excerpt && (
              <p className="mt-6 text-lg leading-relaxed text-charcoal/80 border-l-4 border-gold pl-4 italic">
                {post.excerpt}
              </p>
            )}
          </header>

          {/* ─── FEATURED IMAGE ─── */}
          {post.featured_image && (
            <div className="relative mb-12 aspect-[16/9] w-full overflow-hidden rounded-2xl border border-charcoal/10 bg-white shadow-sm">
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
                className={`${manrope.className} rounded-xl bg-gold px-7 py-3.5 text-sm font-bold text-forest transition-all hover:bg-gold-light active:scale-95`}
              >
                Calculate Solar Savings →
              </LocalizedClientLink>
              <LocalizedClientLink
                href="/contact"
                className={`${manrope.className} rounded-xl border border-white/20 bg-white/10 px-6 py-3.5 text-sm font-semibold text-white transition-all hover:bg-white/20`}
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
