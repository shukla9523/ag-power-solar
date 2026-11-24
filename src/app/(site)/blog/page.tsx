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
            <span className="inline-block rounded-full bg-forest/10 px-4 py-1 text-xs font-bold uppercase tracking-wider text-forest border border-forest/15">
              Engineering &amp; Subsidy Guides
            </span>
            <h1 className={`${manrope.className} mt-3 text-[32px] font-extrabold leading-[1.1] tracking-[-0.03em] text-forest sm:text-[42px] lg:text-[48px]`}>
              Solar Insights &amp; Engineering Guides
            </h1>
            <p className="mt-3.5 mx-auto max-w-[680px] text-[15px] leading-relaxed text-charcoal/80 sm:text-[16px]">
              Authoritative guides by AG POWER engineers covering rooftop solar system sizing, PM Surya Ghar subsidy procedures, TOPCon module technologies, DISCOM net-metering, and long-term financial payback in India.
            </p>
          </div>

          {/* ── FEATURED POST (Photo Centered, Headings & Text Centered) ── */}
          <section className="mt-10 sm:mt-12">
            <article className="group mx-auto max-w-[1100px] overflow-hidden rounded-3xl border border-charcoal/10 bg-white shadow-xs transition-all duration-300 hover:shadow-lg">
              <LocalizedClientLink href={`/blog/${featured.slug}`} className="block">
                <div className="relative aspect-[16/9] max-h-[460px] w-full overflow-hidden bg-slate-100 flex items-center justify-center">
                  {featured.featured_image ? (
                    <Image
                      src={featured.featured_image}
                      alt={featured.title}
                      fill
                      priority
                      fetchPriority="high"
                      sizes="(max-width: 1200px) 100vw, 1100px"
                      className="object-cover object-center transition-transform duration-700 group-hover:scale-[1.03]"
                    />
                  ) : (
                    <div className="h-full w-full bg-forest" />
                  )}
                  {featured.category_id && (
                    <div className="absolute top-4 left-4 sm:top-5 sm:left-5 z-10">
                      <span className="rounded-full bg-forest px-4 py-1 text-[12px] font-bold text-white shadow-md">
                        {featured.category_id}
                      </span>
                    </div>
                  )}
                </div>
              </LocalizedClientLink>

              {/* Centered Content Below Photo */}
              <div className="p-6 text-center sm:p-8 lg:p-10">
                {featured.category_id && (
                  <span className="inline-block text-[12px] font-bold uppercase tracking-wider text-forest/90 mb-2">
                    {featured.category_id}
                  </span>
                )}
                <h2 className={`${manrope.className} mx-auto max-w-3xl text-2xl sm:text-3xl lg:text-[30px] font-extrabold leading-snug tracking-tight text-forest transition-colors group-hover:text-gold`}>
                  <LocalizedClientLink href={`/blog/${featured.slug}`}>
                    {featured.title}
                  </LocalizedClientLink>
                </h2>
                <p className="mt-3.5 mx-auto max-w-2xl text-[15px] leading-relaxed text-charcoal/80 sm:text-[16px]">
                  {featured.excerpt}
                </p>
                <div className="mt-6 flex justify-center">
                  <LocalizedClientLink
                    href={`/blog/${featured.slug}`}
                    className={`${manrope.className} inline-flex items-center justify-center rounded-xl bg-forest hover:bg-forest-deep px-6 py-3 text-[14px] font-bold text-white shadow-md transition-all active:scale-95`}
                  >
                    <span>Read Complete Guide</span>
                    <span className="ml-2 text-[16px]">→</span>
                  </LocalizedClientLink>
                </div>
              </div>
            </article>
          </section>

          {/* ── ALL OTHER SOLAR ARTICLES (Centered 3-Column Grid) ── */}
          {rest.length > 0 && (
            <section className="mt-14 sm:mt-16 lg:mt-20">
              <div className="text-center mb-8 sm:mb-10">
                <span className="inline-block text-[12px] font-bold uppercase tracking-wider text-forest/80">
                  Solar Knowledge Library
                </span>
                <h3 className={`${manrope.className} mt-1.5 text-2xl sm:text-3xl font-extrabold text-forest`}>
                  More Engineering &amp; Subsidy Guides
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
                {rest.map((post) => (
                  <article
                    key={post.slug}
                    className="group flex flex-col overflow-hidden rounded-2xl border border-charcoal/10 bg-white shadow-xs transition-all duration-300 hover:border-forest/40 hover:shadow-lg"
                  >
                    <LocalizedClientLink href={`/blog/${post.slug}`} className="block">
                      <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100 flex items-center justify-center">
                        {post.featured_image ? (
                          <Image
                            src={post.featured_image}
                            alt={post.title}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 380px"
                            className="object-cover object-center transition-transform duration-500 group-hover:scale-[1.05]"
                          />
                        ) : (
                          <div className="h-full w-full bg-forest" />
                        )}
                        {post.category_id && (
                          <div className="absolute top-3 left-3 z-10">
                            <span className="rounded-full bg-forest/90 backdrop-blur-xs px-3 py-0.5 text-[11px] font-bold text-white shadow-sm">
                              {post.category_id}
                            </span>
                          </div>
                        )}
                      </div>
                    </LocalizedClientLink>

                    {/* Centered Card Content */}
                    <div className="p-5 sm:p-6 flex flex-col justify-between flex-1 text-center">
                      <div>
                        {post.category_id && (
                          <span className="block text-[11px] font-bold uppercase tracking-wider text-forest/80 mb-1">
                            {post.category_id}
                          </span>
                        )}
                        <h4 className={`${manrope.className} text-[17px] sm:text-[18px] font-bold leading-snug text-forest transition-colors group-hover:text-gold`}>
                          <LocalizedClientLink href={`/blog/${post.slug}`}>
                            {post.title}
                          </LocalizedClientLink>
                        </h4>
                        <p className="mt-2.5 line-clamp-3 text-[13.5px] leading-relaxed text-charcoal/70">
                          {post.excerpt}
                        </p>
                      </div>

                      <div className="mt-5 pt-3 border-t border-charcoal/5 flex justify-center">
                        <LocalizedClientLink
                          href={`/blog/${post.slug}`}
                          className="inline-flex items-center justify-center text-[13px] font-bold text-forest hover:text-gold transition-colors"
                        >
                          <span>Read Guide</span>
                          <span className="ml-1.5 text-[14px]">→</span>
                        </LocalizedClientLink>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}

          {/* ── SOLAR CONSULTATION BANNER (Centered in 1200px) ── */}
          <section className="mt-14 sm:mt-16 lg:mt-20">
            <div className="mx-auto max-w-[1100px] rounded-3xl bg-forest p-8 sm:p-12 text-center text-white shadow-md">
              <span className="inline-block rounded-full bg-gold/20 px-4 py-1 text-[11px] font-bold uppercase tracking-wider text-gold">
                Free Feasibility Audit
              </span>
              <h3 className={`${manrope.className} mt-3 text-2xl sm:text-3xl lg:text-[32px] font-extrabold leading-snug`}>
                Ready to cut your electricity bill by 80%?
              </h3>
              <p className="mt-2.5 mx-auto max-w-xl text-[14px] sm:text-[15px] leading-relaxed text-white/85">
                Get a personalized rooftop solar sizing report, 25-year financial cash flow, and PM Surya Ghar subsidy estimate from AG POWER.
              </p>
              <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3.5">
                <LocalizedClientLink
                  href="/calculator"
                  className={`${manrope.className} flex h-[46px] w-full sm:w-auto items-center justify-center rounded-xl bg-emerald-600 hover:bg-emerald-500 px-6 text-[13.5px] font-bold text-white shadow-md transition-all active:scale-95`}
                >
                  Calculate Solar Savings →
                </LocalizedClientLink>
                <LocalizedClientLink
                  href="/contact"
                  className={`${manrope.className} flex h-[46px] w-full sm:w-auto items-center justify-center rounded-xl bg-white hover:bg-slate-100 px-6 text-[13.5px] font-bold text-slate-900 shadow-md transition-all active:scale-95`}
                >
                  Request Free Site Audit
                </LocalizedClientLink>
              </div>
            </div>
          </section>

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
