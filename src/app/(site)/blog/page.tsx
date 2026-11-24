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

  return (
    <main className={`relative overflow-hidden bg-ivory pt-10 pb-20 lg:pt-14 lg:pb-24 ${inter.className}`}>
      <JsonLd
        type="collection"
        section="blog"
        items={blogPosts}
        seoSetting={seoSetting}
      />

      <div className="content-container relative px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1200px]">

          {/* ── TOP HEADER (Centered) ── */}
          <div className="mx-auto max-w-3xl text-center">
            <h1 className={`${manrope.className} text-[32px] font-extrabold leading-[1.1] tracking-[-0.03em] text-forest sm:text-[42px] lg:text-[48px]`}>
              Solar Insights & Engineering Guides
            </h1>
            <p className="mt-3.5 mx-auto max-w-[680px] text-[15px] leading-relaxed text-charcoal/80 sm:text-[16px]">
              Authoritative guides by AG POWER engineers covering rooftop solar system sizing, PM Surya Ghar subsidy procedures, TOPCon module technologies, DISCOM net-metering, and long-term financial payback in India.
            </p>
          </div>

          <div className="mt-10 grid gap-8 lg:mt-12 lg:grid-cols-[1fr_360px] lg:items-start lg:gap-10">

            {/* LEFT: ARTICLES LIST */}
            <div>
              {/* Featured Post Card (Centered Solar Photo, Clean Alignment, No Date) */}
              <article className="group overflow-hidden rounded-2xl border border-charcoal/10 bg-white shadow-xs transition-all duration-300 hover:shadow-md">
                <LocalizedClientLink href={`/blog/${featured.slug}`} className="block">
                  <div className="relative aspect-[16/9] max-h-[360px] w-full overflow-hidden bg-slate-50 flex items-center justify-center">
                    {featured.featured_image ? (
                      <Image
                        src={featured.featured_image}
                        alt={featured.title}
                        fill
                        priority
                        fetchPriority="high"
                        sizes="(max-width: 1024px) 100vw, 820px"
                        className="object-cover object-center transition-transform duration-500 group-hover:scale-[1.03]"
                      />
                    ) : (
                      <div className="h-full w-full bg-forest" />
                    )}
                    <div className="absolute left-3.5 top-3.5 sm:left-4 sm:top-4 z-10">
                      {featured.category_id && (
                        <span className="rounded-full bg-forest px-3.5 py-1 text-[12px] font-bold text-white shadow-sm">
                          {featured.category_id}
                        </span>
                      )}
                    </div>
                  </div>
                </LocalizedClientLink>

                <div className="p-6 sm:p-7">
                  <h2 className={`${manrope.className} text-xl sm:text-2xl lg:text-[24px] font-bold leading-snug tracking-tight text-forest transition-colors group-hover:text-gold`}>
                    <LocalizedClientLink href={`/blog/${featured.slug}`}>
                      {featured.title}
                    </LocalizedClientLink>
                  </h2>
                  <p className="mt-2.5 text-[14.5px] leading-[1.7] text-charcoal/80 sm:text-[15px]">
                    {featured.excerpt}
                  </p>
                  <div className="mt-4 pt-3 border-t border-charcoal/10 flex items-center justify-between">
                    <LocalizedClientLink
                      href={`/blog/${featured.slug}`}
                      className={`${manrope.className} inline-flex items-center text-[13.5px] font-bold text-forest transition-colors hover:text-gold`}
                    >
                      Read Complete Guide <span className="ml-1.5 text-[16px]">→</span>
                    </LocalizedClientLink>
                  </div>
                </div>
              </article>

              {rest.length > 0 && (
                <div className="my-8 border-t border-charcoal/10 lg:my-10" />
              )}

              {/* Other Posts List (Centered Thumbnails, Clean Spacing, No Dates) */}
              <div className="space-y-5 sm:space-y-6">
                {rest.map((post) => (
                  <article
                    key={post.slug}
                    className="group flex flex-col sm:flex-row gap-4 sm:gap-5 rounded-2xl border border-charcoal/10 bg-white p-4 sm:p-5 shadow-xs transition-all hover:border-forest/30 hover:shadow-md"
                  >
                    <LocalizedClientLink href={`/blog/${post.slug}`} className="shrink-0 self-center sm:self-start">
                      <div className="relative h-[150px] w-full sm:h-[120px] sm:w-[170px] overflow-hidden rounded-xl border border-slate-100 bg-slate-50 flex items-center justify-center">
                        {post.featured_image ? (
                          <Image
                            src={post.featured_image}
                            alt={post.title}
                            fill
                            sizes="(max-width: 640px) 100vw, 170px"
                            className="object-cover object-center transition-transform duration-500 group-hover:scale-[1.04]"
                          />
                        ) : (
                          <div className="h-full w-full bg-forest" />
                        )}
                      </div>
                    </LocalizedClientLink>

                    <div className="flex flex-col justify-between min-w-0 flex-1">
                      <div>
                        {post.category_id && (
                          <span className="inline-block text-[11.5px] font-bold uppercase tracking-wider text-forest">
                            {post.category_id}
                          </span>
                        )}
                        <h3 className={`${manrope.className} mt-1 text-[16px] sm:text-[17.5px] font-bold leading-snug text-forest transition-colors group-hover:text-gold`}>
                          <LocalizedClientLink href={`/blog/${post.slug}`}>
                            {post.title}
                          </LocalizedClientLink>
                        </h3>
                        <p className="mt-1.5 line-clamp-2 text-[13px] sm:text-[13.5px] leading-relaxed text-charcoal/70">
                          {post.excerpt}
                        </p>
                      </div>

                      <div className="mt-3 pt-2">
                        <LocalizedClientLink
                          href={`/blog/${post.slug}`}
                          className="inline-flex items-center text-[12.5px] font-bold text-forest hover:text-gold"
                        >
                          <span>Read Guide</span>
                          <span className="ml-1 text-[14px]">→</span>
                        </LocalizedClientLink>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            {/* RIGHT SIDEBAR */}
            <div className="space-y-6 lg:sticky lg:top-[100px] lg:space-y-7">

              {/* Featured Solar Guides (No Dates) */}
              <div className="rounded-2xl border border-charcoal/10 bg-white p-5 shadow-xs sm:rounded-2xl sm:p-6">
                <h3 className={`${manrope.className} mb-4 text-[17px] font-extrabold tracking-[-0.02em] text-forest sm:mb-5 sm:text-[18px]`}>
                  Featured Solar Guides
                </h3>
                <div className="space-y-3.5 sm:space-y-4">
                  {popular.map((post, i) => (
                    <div key={post.slug} className="flex gap-3 pb-3 border-b border-charcoal/5 last:border-b-0 last:pb-0 items-start">
                      <span className={`${manrope.className} mt-0.5 shrink-0 text-[12px] font-extrabold text-gold sm:text-[13px]`}>
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <div className="min-w-0">
                        {post.category_id && (
                          <span className="text-[10.5px] font-bold text-forest uppercase tracking-wider block mb-0.5">
                            {post.category_id}
                          </span>
                        )}
                        <LocalizedClientLink href={`/blog/${post.slug}`}>
                          <h4 className={`${manrope.className} text-[13px] font-bold leading-[1.35] text-slate-800 transition-colors hover:text-forest sm:text-[13.5px]`}>
                            {post.title}
                          </h4>
                        </LocalizedClientLink>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Solar Consultation Sidebar Card */}
              <div className="rounded-2xl bg-forest p-6 text-white shadow-sm sm:rounded-2xl sm:p-7">
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
                    className={`${manrope.className} flex h-[44px] w-full items-center justify-center rounded-xl bg-emerald-600 hover:bg-emerald-500 px-4 text-[13px] font-bold text-white shadow-md transition-all active:scale-95`}
                  >
                    Calculate Solar Savings →
                  </LocalizedClientLink>
                  <LocalizedClientLink
                    href="/contact"
                    className={`${manrope.className} flex h-[44px] w-full items-center justify-center rounded-xl bg-white hover:bg-slate-100 px-4 text-[13px] font-bold text-slate-900 shadow-md transition-all active:scale-95`}
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
