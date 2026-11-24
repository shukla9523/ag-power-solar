import Image from "next/image"
import { Metadata } from "next"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import JsonLd from "@modules/common/components/json-ld"
import { getBlogPosts } from "@lib/data/blog-posts"
import { getSeoSetting } from "@lib/data/seo"
import { resolveCollectionData, buildMetadataFromResolved } from "@lib/schema/resolvers"
import { manrope, inter } from "@lib/fonts"
import { getPageFaqs } from "@lib/data/page-faqs"
import PageFaqSection from "@modules/common/components/page-faq-section"

export const revalidate = 60

export async function generateMetadata(): Promise<Metadata> {
  const [blogPosts, seoSetting] = await Promise.all([
    getBlogPosts(),
    getSeoSetting("blog").catch(() => null),
  ])
  const resolved = resolveCollectionData({
    section: "blog",
    items: blogPosts,
    seoSetting,
  })
  return buildMetadataFromResolved(resolved)
}

export default async function BlogPage() {
  const [blogPosts, seoSetting] = await Promise.all([
    getBlogPosts(),
    getSeoSetting("blog").catch(() => null),
  ])

  const [featured, ...rest] = blogPosts

  if (!featured) {
    return (
      <main className={`flex min-h-[60vh] items-center justify-center bg-ivory ${inter.className}`}>
        <div className="text-center">
          <h1 className="sr-only">Solar Insights & Engineering Guides</h1>
          <p className="text-charcoal/60 text-lg">No solar articles published yet.</p>
        </div>
      </main>
    )
  }

  const popular = blogPosts.slice(0, 5)

  function formatDate(dateStr: string | null | undefined) {
    if (!dateStr) return ""
    return new Date(dateStr).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <main className={`relative overflow-hidden bg-ivory pt-12 pb-20 lg:pt-16 lg:pb-24 ${inter.className}`}>
      <JsonLd
        type="collection"
        section="blog"
        items={blogPosts}
        seoSetting={seoSetting}
      />

      <div className="content-container relative px-4 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-[1320px]">

          <div className="max-w-[760px]">
            <h1 className={`${manrope.className} text-[32px] font-extrabold leading-[1.05] tracking-[-0.03em] text-forest sm:text-[42px] lg:text-[54px]`}>
              Solar Insights & Engineering Guides
            </h1>
            <p className="mt-4 max-w-[620px] text-[15px] leading-relaxed text-charcoal/80 sm:text-[16px]">
              Authoritative guides by AG POWER engineers covering rooftop solar system sizing, PM Surya Ghar subsidy procedures, TOPCon module technologies, DISCOM net-metering, and long-term financial payback in India.
            </p>
          </div>

          <div className="mt-10 grid gap-8 lg:mt-12 lg:grid-cols-[1fr_360px] lg:items-start lg:gap-10">

            {/* LEFT: ARTICLES LIST */}
            <div>
              {/* Featured Post */}
              <article className="group">
                <LocalizedClientLink href={`/blog/${featured.slug}`} className="block">
                  <div className="overflow-hidden rounded-[16px] bg-white shadow-sm transition-all duration-500 group-hover:-translate-y-1 group-hover:shadow-md lg:rounded-[18px]">
                    <div className="relative h-[220px] sm:h-[300px] lg:h-[340px] max-h-[360px] w-full overflow-hidden rounded-[16px] lg:rounded-[18px]">
                      {featured.featured_image ? (
                        <Image
                          src={featured.featured_image}
                          alt={featured.title}
                          fill
                          priority
                          fetchPriority="high"
                          sizes="(max-width: 1024px) 100vw, 820px"
                          className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                        />
                      ) : (
                        <div className="h-full w-full bg-forest" />
                      )}
                      <div className="absolute left-3 top-3 sm:left-4 sm:top-4">
                        {featured.category_id && (
                          <span className="rounded-full bg-forest px-3 py-1 text-[12px] font-bold text-gold shadow-sm sm:px-3.5 sm:py-1.5">
                            {featured.category_id}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </LocalizedClientLink>
                <div className="mt-4 sm:mt-5">
                  <p className="text-[12px] font-semibold uppercase tracking-[0.04em] text-charcoal/60 sm:text-[13px]">
                    {formatDate(featured.published_at)}
                  </p>
                  <h2 className={`${manrope.className} mt-2 text-xl sm:text-2xl lg:text-[26px] font-bold leading-snug tracking-tight text-forest transition-colors hover:text-gold`}>
                    <LocalizedClientLink
                      href={`/blog/${featured.slug}`}
                    >
                      {featured.title}
                    </LocalizedClientLink>
                  </h2>
                  <p className="mt-2.5 text-[14.5px] leading-[1.7] text-charcoal/80 sm:mt-3 sm:text-[15px]">
                    {featured.excerpt}
                  </p>
                  <LocalizedClientLink
                    href={`/blog/${featured.slug}`}
                    className={`${manrope.className} mt-3.5 inline-flex items-center text-[13px] font-bold text-forest transition-colors hover:text-gold sm:mt-4`}
                  >
                    Read Complete Guide <span className="ml-1.5 text-[16px]">→</span>
                  </LocalizedClientLink>
                </div>
              </article>

              {rest.length > 0 && (
                <div className="my-8 border-t border-charcoal/10 lg:my-10" />
              )}

              {/* Other Posts */}
              <div className="space-y-6 sm:space-y-8">
                {rest.map((post) => (
                  <article key={post.slug} className="group flex gap-4 sm:gap-5">
                    <LocalizedClientLink href={`/blog/${post.slug}`} className="shrink-0">
                      <div className="overflow-hidden rounded-[12px] shadow-xs sm:rounded-[14px]">
                        <div className="relative h-[90px] w-[130px] sm:h-[110px] sm:w-[160px]">
                          {post.featured_image ? (
                            <Image
                              src={post.featured_image}
                              alt={post.title}
                              fill
                              sizes="(max-width: 640px) 130px, 160px"
                              className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                            />
                          ) : (
                            <div className="h-full w-full bg-forest" />
                          )}
                        </div>
                      </div>
                    </LocalizedClientLink>
                    <div className="flex flex-col justify-center min-w-0">
                      <div className="flex items-center gap-2 sm:gap-3">
                        {post.category_id && (
                          <p className="text-[12px] font-bold text-forest sm:text-[13px]">
                            {post.category_id}
                          </p>
                        )}
                        {post.category_id && post.published_at && (
                          <span className="h-1 w-1 rounded-full bg-charcoal/30" />
                        )}
                        <p className="text-[11px] font-semibold uppercase tracking-[0.04em] text-charcoal/50 sm:text-[12px]">
                          {formatDate(post.published_at)}
                        </p>
                      </div>
                      <h3 className={`${manrope.className} mt-1 text-[16px] font-bold leading-[1.2] tracking-[-0.02em] text-forest transition-colors group-hover:text-gold sm:mt-1.5 sm:text-[18px]`}>
                        <LocalizedClientLink
                          href={`/blog/${post.slug}`}
                        >
                          {post.title}
                        </LocalizedClientLink>
                      </h3>
                      <p className="mt-1 line-clamp-2 text-[13px] leading-[1.6] text-charcoal/70 sm:mt-1.5 sm:text-[14px]">
                        {post.excerpt}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            {/* RIGHT SIDEBAR */}
            <div className="space-y-6 lg:sticky lg:top-[100px] lg:space-y-7">

              {/* Popular Articles */}
              <div className="rounded-[16px] border border-charcoal/10 bg-white p-5 shadow-xs sm:rounded-[18px] sm:p-6">
                <h3 className={`${manrope.className} mb-4 text-[17px] font-extrabold tracking-[-0.02em] text-forest sm:mb-5 sm:text-[18px]`}>
                  Featured Solar Guides
                </h3>
                <div className="space-y-4 sm:space-y-5">
                  {popular.map((post, i) => (
                    <div key={post.slug} className="flex gap-2.5 sm:gap-3">
                      <span className={`${manrope.className} mt-0.5 shrink-0 text-[12px] font-extrabold text-gold sm:text-[13px]`}>
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <div className="min-w-0">
                        <LocalizedClientLink href={`/blog/${post.slug}`}>
                          <h4 className={`${manrope.className} text-[13px] font-bold leading-[1.35] text-forest transition-colors hover:text-gold sm:text-[14px]`}>
                            {post.title}
                          </h4>
                        </LocalizedClientLink>
                        <p className="mt-0.5 text-[11px] text-charcoal/50 sm:mt-1 sm:text-[12px]">
                          {formatDate(post.published_at)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Solar Consultation Sidebar Card */}
              <div className="rounded-[16px] bg-forest p-6 text-white shadow-sm sm:rounded-[18px] sm:p-7">
                <span className="inline-block rounded-full bg-gold/20 px-3 py-0.5 text-[11px] font-bold uppercase tracking-wider text-gold">
                  Free Feasibility
                </span>
                <h3 className={`${manrope.className} mt-3 text-[19px] font-extrabold leading-snug sm:text-[21px]`}>
                  Ready to cut your electricity bill by 80%?
                </h3>
                <p className="mt-2 text-[13px] leading-relaxed text-white/80">
                  Get a personalized rooftop solar sizing report, 25-year financial cash flow, and PM Surya Ghar subsidy estimate from AG POWER.
                </p>
                <div className="mt-5 space-y-2.5">
                  <LocalizedClientLink
                    href="/calculator"
                    className={`${manrope.className} flex h-[44px] w-full items-center justify-center rounded-[10px] bg-emerald-600 hover:bg-emerald-500 px-4 text-[13px] font-bold text-white shadow-md transition-all active:scale-95`}
                  >
                    Calculate Solar Savings →
                  </LocalizedClientLink>
                  <LocalizedClientLink
                    href="/contact"
                    className={`${manrope.className} flex h-[44px] w-full items-center justify-center rounded-[10px] bg-white hover:bg-slate-100 px-4 text-[13px] font-bold text-slate-900 shadow-md transition-all active:scale-95`}
                  >
                    Request Free Site Audit
                  </LocalizedClientLink>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      {getPageFaqs("blog", seoSetting) && getPageFaqs("blog", seoSetting).length > 0 && (
        <PageFaqSection
          faqs={getPageFaqs("blog", seoSetting)}
          title="Solar Knowledge FAQs"
          subtitle="Answers to common questions regarding our solar engineering research, subsidy guides, and technology comparisons."
        />
      )}
    </main>
  )
}
