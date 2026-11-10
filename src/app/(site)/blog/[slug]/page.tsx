import { Metadata } from "next"
import Image from "next/image"
import { notFound, permanentRedirect } from "next/navigation"
import { findRedirect } from "@lib/seo/redirects"
import { cookies, draftMode } from "next/headers"
import { PREVIEW_COOKIE, getBlogPostAnyStatus, previewCookieAllows } from "@lib/data/blog-preview"

/**
 * Published post, or any status while a signed preview link for THIS slug is active
 * (draft mode + a cookie signed for this one post, so one link never unlocks other drafts).
 */
async function loadPost(slug: string) {
  const { isEnabled } = await draftMode()
  const preview = isEnabled && previewCookieAllows((await cookies()).get(PREVIEW_COOKIE)?.value, slug)
  return { preview, post: preview ? await getBlogPostAnyStatus(slug) : await getBlogPost(slug) }
}
import { getBlogPost, getBlogPosts } from "@lib/data/blog-posts"
import { getSeoSetting } from "@lib/data/seo"
import { resolveBlogData, buildMetadataFromResolved, cleanCategoryName } from "@lib/schema/resolvers"
import JsonLd from "@modules/common/components/json-ld"
import { epilogue, outfit, mansalva } from "@lib/fonts"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import PageFaqSection from "@modules/common/components/page-faq-section"
import { sanitizeRichHtml } from "@lib/util/sanitize"
import { linkKeywords, newLinkState } from "@lib/seo/keyword-links"

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
      title: "Blog | Mommantum",
      description: "Read marketing, SEO, and AI growth strategies by Mommantum.",
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
        <div className="sticky top-0 z-50 bg-navy px-4 py-2 text-center text-[13px] font-semibold text-white">
          Preview — this post is {post.status === "published" ? "published" : `not public yet (${post.status})`}.{" "}
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- API route, full navigation intended */}
          <a href={`/api/preview/exit?to=/blog/${post.slug}`} className="underline">Exit preview</a>
        </div>
      )}
      <JsonLd type="blog" data={post} seoSetting={seoSetting} />

      <main className="min-h-screen bg-paper text-navy pb-24">
        {/* ─── BREADCRUMBS ─── */}
        <div className="border-b border-neutral-200 bg-white">
          <div className="content-container mx-auto max-w-[1000px] px-4 py-4 sm:px-6 lg:px-8">
            <nav aria-label="Breadcrumb" className="flex items-center space-x-2 text-xs text-neutral-500">
              <LocalizedClientLink href="/" className="hover:text-brand transition-colors">
                Home
              </LocalizedClientLink>
              <span>/</span>
              <LocalizedClientLink href="/blog" className="hover:text-brand transition-colors">
                Blog
              </LocalizedClientLink>
              <span>/</span>
              <span className="font-medium text-navy truncate max-w-[200px] sm:max-w-[400px]">
                {post.title}
              </span>
            </nav>
          </div>
        </div>

        {/* ─── ARTICLE HEADER ─── */}
        <article className="content-container mx-auto max-w-[1000px] px-4 pt-10 sm:px-6 lg:px-8">
          <header className="mb-10 text-center sm:text-left">
            <span className={`${mansalva.className} inline-block rounded-full bg-brand-tint px-4 py-1 text-sm font-semibold text-brand border border-brand-pale`}>
              {cleanCategoryName(post.category_id, "Growth Marketing")}
            </span>

            <h1 className={`${epilogue.className} mt-4 text-3xl font-extrabold tracking-[-0.04em] text-navy sm:text-4xl lg:text-5xl lg:leading-[1.15]`}>
              {post.title}
            </h1>

            <div className={`${outfit.className} mt-6 flex flex-wrap items-center gap-4 text-sm text-neutral-500`}>
              <span>By {post.author_name || "Mommantum Team"}</span>
              {formattedDate && (
                <>
                  <span>•</span>
                  <time dateTime={post.published_at || undefined}>{formattedDate}</time>
                </>
              )}
            </div>

            {post.excerpt && (
              <p className={`${outfit.className} mt-6 text-lg leading-relaxed text-neutral-600 border-l-4 border-brand pl-4 italic`}>
                {post.excerpt}
              </p>
            )}
          </header>

          {/* ─── FEATURED IMAGE ─── */}
          {post.featured_image && (
            <div className="relative mb-12 aspect-[16/9] w-full overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-100 shadow-md">
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
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 sm:p-10 lg:p-12 shadow-sm">
            <div
              className={`${outfit.className} prose prose-lg max-w-none prose-headings:font-extrabold prose-headings:text-navy prose-a:text-brand prose-a:no-underline hover:prose-a:underline prose-img:rounded-xl`}
              dangerouslySetInnerHTML={{ __html: articleHtml }}
            />
          </div>

          {/* ─── ARTICLE FAQS ─── */}
          {formattedFaqs.length > 0 && (
            <div className="mt-12">
              <PageFaqSection
                faqs={formattedFaqs}
                title="Frequently Asked Questions"
                subtitle="Key takeaways and practical details on this topic."
              />
            </div>
          )}

          {/* ─── ARTICLE FOOTER CTA ─── */}
          <div className="mt-12 rounded-2xl bg-navy p-8 text-center text-white sm:p-12">
            <h3 className={`${epilogue.className} text-2xl font-bold sm:text-3xl`}>
              Ready to implement this for your brand?
            </h3>
            <p className={`${outfit.className} mx-auto mt-3 max-w-xl text-neutral-300 text-sm sm:text-base`}>
              Connect with our Jaipur growth studio to turn these strategies into revenue for your D2C or ecommerce business.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-4">
              <LocalizedClientLink
                href="/contact"
                className={`${epilogue.className} rounded-xl bg-brand px-7 py-3.5 text-sm font-bold text-white transition-all hover:bg-brand-deep`}
              >
                Book a Consultation →
              </LocalizedClientLink>
              <LocalizedClientLink
                href="/blog"
                className={`${epilogue.className} rounded-xl border border-neutral-600 bg-transparent px-6 py-3.5 text-sm font-semibold text-white transition-all hover:bg-white/10`}
              >
                Back to Blog
              </LocalizedClientLink>
            </div>
          </div>
        </article>
      </main>
    </>
  )
}
