"use client"

import { useState, useMemo } from "react"
import Image from "next/image"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { BlogPost } from "@lib/data/blog-posts"
import { manrope, inter } from "@lib/fonts"
import { Search, BookOpen, Layers, ArrowRight, SunMedium, Sparkles } from "lucide-react"

interface Props {
  initialPosts: BlogPost[]
}

const CATEGORIES = [
  "All",
  "Solar Energy Basics",
  "Residential Solar",
  "Commercial Solar",
  "Solar Panel Technology",
  "Solar Installation Guides",
  "Solar Maintenance",
  "Government Schemes and Subsidies",
  "Solar Savings and ROI",
]

export default function BlogListingClient({ initialPosts }: Props) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All")
  const [search, setSearch] = useState<string>("")

  const filteredPosts = useMemo(() => {
    return initialPosts.filter((post) => {
      const matchesCategory =
        selectedCategory === "All" ||
        (post.category_id && post.category_id.toLowerCase() === selectedCategory.toLowerCase())

      const matchesSearch =
        !search ||
        post.title.toLowerCase().includes(search.toLowerCase()) ||
        (post.excerpt && post.excerpt.toLowerCase().includes(search.toLowerCase())) ||
        (post.category_id && post.category_id.toLowerCase().includes(search.toLowerCase()))

      return matchesCategory && matchesSearch
    })
  }, [initialPosts, selectedCategory, search])

  const featured = filteredPosts[0] || initialPosts[0]
  const rest = filteredPosts.length > 0 ? filteredPosts.slice(1) : []
  const popular = initialPosts.slice(0, 5)

  function formatDate(dateStr: string | null | undefined) {
    if (!dateStr) return ""
    return new Date(dateStr).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className="content-container relative px-4 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-[1320px]">
        
        {/* Header */}
        <div className="max-w-[760px]">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-forest/10 px-3.5 py-1 text-[12px] font-bold uppercase tracking-[0.08em] text-forest">
            <SunMedium className="h-4 w-4 text-gold" />
            <span>Solar Knowledge & Insights</span>
          </span>
          <h1 className={`${manrope.className} mt-3 text-[32px] font-extrabold leading-[1.05] tracking-[-0.03em] text-forest sm:text-[42px] lg:text-[54px]`}>
            Solar Insights & Engineering Guides
          </h1>
          <p className="mt-4 max-w-[620px] text-[15px] leading-relaxed text-charcoal/80 sm:text-[16px]">
            Authoritative guides by AG POWER engineers covering rooftop solar system sizing, PM Surya Ghar subsidy procedures, TOPCon module technologies, DISCOM net-metering, and long-term financial payback in India.
          </p>
        </div>

        {/* Search & Category Filter Navigation */}
        <div className="mt-8 space-y-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal-muted" />
            <input
              type="text"
              placeholder="Search solar guides, subsidies, technologies..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-charcoal/15 bg-white pl-10 pr-4 py-2.5 text-[14px] text-charcoal focus:border-forest focus:outline-none shadow-xs"
            />
          </div>

          {/* Category Filter Pills Bar */}
          <div className="flex flex-wrap items-center gap-2 pt-2">
            {CATEGORIES.map((cat) => {
              const active = selectedCategory.toLowerCase() === cat.toLowerCase()
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`rounded-xl px-3.5 py-1.5 text-[12px] font-bold transition-all ${
                    active
                      ? "bg-forest text-white shadow-sm"
                      : "bg-white text-charcoal hover:bg-sage-mist border border-charcoal/10"
                  }`}
                >
                  {cat}
                </button>
              )
            })}
          </div>
        </div>

        {/* Content Layout */}
        <div className="mt-10 grid gap-8 lg:mt-12 lg:grid-cols-[1fr_360px] lg:items-start lg:gap-10">

          {/* LEFT: ARTICLES LIST */}
          <div>
            {featured && (
              <article className="group">
                <LocalizedClientLink href={`/blog/${featured.slug}`} className="block">
                  <div className="overflow-hidden rounded-[16px] bg-white shadow-sm transition-all duration-500 group-hover:-translate-y-1 group-hover:shadow-md lg:rounded-[18px]">
                    <div className="relative aspect-[16/9] w-full">
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
                  <h2 className={`${manrope.className} mt-2 text-[22px] font-extrabold leading-[1.15] tracking-[-0.02em] text-forest transition-colors hover:text-gold sm:text-[26px] lg:text-[30px]`}>
                    <LocalizedClientLink href={`/blog/${featured.slug}`}>
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
                    Read Complete Guide <ArrowRight className="ml-1.5 h-4 w-4" />
                  </LocalizedClientLink>
                </div>
              </article>
            )}

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
                      <LocalizedClientLink href={`/blog/${post.slug}`}>
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

            {filteredPosts.length === 0 && (
              <div className="rounded-2xl border border-charcoal/10 bg-white p-10 text-center">
                <BookOpen className="mx-auto h-8 w-8 text-charcoal-muted" />
                <h3 className="mt-3 font-manrope text-[18px] font-bold text-forest">
                  No articles found in this category
                </h3>
                <p className="mt-1 text-[14px] text-charcoal-muted">
                  Try selecting &quot;All&quot; or clearing your search term.
                </p>
                <button
                  type="button"
                  onClick={() => { setSelectedCategory("All"); setSearch(""); }}
                  className="mt-4 rounded-xl bg-forest px-5 py-2 text-[13px] font-bold text-white"
                >
                  View All Guides
                </button>
              </div>
            )}
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
                  className={`${manrope.className} flex h-[44px] w-full items-center justify-center rounded-[10px] bg-gold px-4 text-[13px] font-bold text-forest transition-all hover:bg-gold-light active:scale-95`}
                >
                  Calculate Solar Savings →
                </LocalizedClientLink>
                <LocalizedClientLink
                  href="/contact"
                  className={`${manrope.className} flex h-[44px] w-full items-center justify-center rounded-[10px] border border-white/20 bg-white/10 px-4 text-[13px] font-bold text-white transition-all hover:bg-white/20`}
                >
                  Request Free Site Audit
                </LocalizedClientLink>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  )
}
