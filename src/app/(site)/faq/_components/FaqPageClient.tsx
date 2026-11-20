/**
 * Dedicated FAQ Page Interactive Client Component
 * 
 * Purpose:
 * Renders the complete, categorized FAQ knowledge base for AG POWER.
 * Includes real-time search, category pill filtering, expand/collapse all controls,
 * and accessible accordion items for solar topics.
 * 
 * Brand styling:
 * - Forest Green (#173F32), Solar Gold (#E9B949), Warm Ivory (#F7F6EF), Charcoal (#26332C)
 * - Manrope headings, Inter body
 */

"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { manrope, inter } from "@lib/fonts"
import { ALL_FAQ_CATEGORIES as DEFAULT_FAQ_CATEGORIES, FAQCategory } from "@lib/data/all-faqs"

export default function FaqPageClient({ categories }: { categories?: FAQCategory[] }) {
  // Categories come from the server (same list as the FAQPage schema on /faq).
  const ALL_FAQ_CATEGORIES = categories && categories.length ? categories : DEFAULT_FAQ_CATEGORIES
  
  // Selected category filter ("all" or category id)
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  
  // Real-time keyword search query
  const [searchQuery, setSearchQuery] = useState<string>("")
  
  // Set of currently expanded FAQ item IDs for flexible multi-accordion support
  const [expandedIds, setExpandedIds] = useState<Set<string>>(
    () => new Set([ALL_FAQ_CATEGORIES[0]?.faqs[0]?.id, "home-1"].filter(Boolean) as string[])
  )

  // Toggle expansion state for an individual question
  const toggleItem = (id: string) => {
    setExpandedIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  // Filter categories and FAQs based on active category and search keyword
  const filteredCategories = useMemo(() => {
    const q = searchQuery.toLowerCase().trim()

    return ALL_FAQ_CATEGORIES.map(category => {
      // If a specific category is selected, skip others
      if (selectedCategory !== "all" && category.id !== selectedCategory) {
        return null
      }

      // Filter FAQs by search query against question, answer, and category name
      const matchingFaqs = category.faqs.filter(faq => {
        if (!q) return true
        return (
          faq.question.toLowerCase().includes(q) ||
          faq.answer.toLowerCase().includes(q) ||
          faq.category.toLowerCase().includes(q)
        )
      })

      if (matchingFaqs.length === 0) return null

      return {
        ...category,
        faqs: matchingFaqs,
      }
    }).filter(Boolean) as typeof ALL_FAQ_CATEGORIES
  }, [selectedCategory, searchQuery, ALL_FAQ_CATEGORIES])

  // Compute total questions visible under current filter
  const totalVisibleCount = useMemo(() => {
    return filteredCategories.reduce((acc, cat) => acc + cat.faqs.length, 0)
  }, [filteredCategories])

  // Total count of all FAQs across entire database
  const totalFaqsCount = useMemo(() => {
    return ALL_FAQ_CATEGORIES.reduce((acc, cat) => acc + cat.faqs.length, 0)
  }, [ALL_FAQ_CATEGORIES])

  // Toggle all visible FAQs open or closed
  const toggleAll = () => {
    if (expandedIds.size > 0) {
      setExpandedIds(new Set())
    } else {
      const allIds = new Set<string>()
      filteredCategories.forEach(cat => cat.faqs.forEach(f => allIds.add(f.id)))
      setExpandedIds(allIds)
    }
  }

  return (
    <div className={`bg-ivory pb-24 pt-12 sm:pb-32 sm:pt-16 ${inter.className}`}>
      <div className="content-container px-4 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-[1100px]">
          
          {/* ── Page Hero Header ── */}
          <div className="mb-12 text-center sm:mb-16">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-forest/10 px-4 py-1 text-[12px] font-bold uppercase tracking-[0.08em] text-forest">
              <span>Solar Knowledge & Help Center</span>
            </span>

            <h1 className={`${manrope.className} mt-4 text-[32px] font-extrabold tracking-[-0.03em] text-forest sm:text-[44px] lg:text-[50px]`}>
              Frequently Asked Questions
            </h1>

            <p className="mx-auto mt-4 max-w-2xl text-[15px] leading-relaxed text-charcoal/80 sm:text-[16px]">
              Find clear, verified answers about residential and commercial rooftop solar, PM Surya Ghar subsidy, net metering, Tier-1 solar panels, and system maintenance from AG POWER engineers.
            </p>

            {/* ── Search Input ── */}
            <div className="mx-auto mt-8 max-w-xl">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search questions (e.g. subsidy, net metering, TOPCon, ROI, warranty)..."
                  className="w-full rounded-[14px] border border-charcoal/15 bg-white py-3.5 pl-12 pr-10 text-[14px] text-charcoal shadow-sm outline-none transition-all placeholder:text-charcoal/40 focus:border-forest focus:ring-2 focus:ring-forest/20"
                />
                <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-charcoal/40">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"/>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                  </svg>
                </div>
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 rounded-full p-1 text-charcoal/40 hover:bg-sage-mist hover:text-charcoal"
                    aria-label="Clear search"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18"/>
                      <line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* ── Category Filter Pills ── */}
          <div className="mb-8 flex flex-wrap items-center justify-center gap-2 sm:mb-10">
            <button
              type="button"
              onClick={() => setSelectedCategory("all")}
              className={`rounded-full px-4 py-2 text-[12.5px] font-bold transition-all cursor-pointer ${
                selectedCategory === "all"
                  ? "bg-forest text-white shadow-sm"
                  : "bg-white text-charcoal border border-charcoal/15 hover:border-forest/30 hover:bg-sage-mist/50"
              }`}
            >
              All Topics ({totalFaqsCount})
            </button>
            {ALL_FAQ_CATEGORIES.map(cat => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-[12.5px] font-bold transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? "bg-forest text-gold shadow-sm"
                    : "bg-white text-charcoal border border-charcoal/15 hover:border-forest/30 hover:bg-sage-mist/50"
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.name}</span>
                <span className={`text-[11px] ${selectedCategory === cat.id ? "text-gold/80" : "text-charcoal/50"}`}>
                  ({cat.faqs.length})
                </span>
              </button>
            ))}
          </div>

          {/* ── Toolbar: Results summary & Expand All button ── */}
          <div className="mb-6 flex items-center justify-between border-b border-charcoal/10 pb-3.5">
            <p className="text-[13px] text-charcoal/70">
              Showing <span className="font-bold text-forest">{totalVisibleCount}</span> questions
              {searchQuery && (
                <span> for &quot;<span className="font-semibold text-forest">{searchQuery}</span>&quot;</span>
              )}
            </p>
            <button
              type="button"
              onClick={toggleAll}
              className={`${manrope.className} text-[13px] font-bold text-forest hover:text-gold transition-colors cursor-pointer`}
            >
              {expandedIds.size > 0 ? "Collapse All" : "Expand All"}
            </button>
          </div>

          {/* ── FAQ Categorized Sections ── */}
          {filteredCategories.length === 0 ? (
            <div className="rounded-[16px] border border-charcoal/10 bg-white p-12 text-center shadow-xs">
              <span className="text-[32px]">🔍</span>
              <h3 className={`${manrope.className} mt-3 text-[18px] font-extrabold text-forest`}>
                No matching solar questions found
              </h3>
              <p className="mx-auto mt-2 max-w-md text-[14px] text-charcoal/70">
                We couldn&apos;t find any questions matching &quot;{searchQuery}&quot;. Try adjusting your search term or clearing the filter.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("")
                  setSelectedCategory("all")
                }}
                className={`${manrope.className} mt-5 inline-flex items-center gap-2 rounded-[10px] bg-forest px-5 py-2.5 text-[13px] font-bold text-gold hover:bg-forest/90 transition-all`}
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="space-y-10 sm:space-y-12">
              {filteredCategories.map(cat => (
                <div key={cat.id} className="scroll-mt-24">
                  {/* Category Header */}
                  <div className="mb-4 flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-[12px] bg-sage-mist text-[20px]">
                      {cat.icon}
                    </span>
                    <div>
                      <h2 className={`${manrope.className} text-[20px] font-extrabold tracking-[-0.02em] text-forest sm:text-[22px]`}>
                        {cat.name}
                      </h2>
                      <p className="text-[13px] text-charcoal/70">
                        {cat.description}
                      </p>
                    </div>
                  </div>

                  {/* Category Questions List */}
                  <div className="space-y-3">
                    {cat.faqs.map((faq, index) => {
                      const isOpen = expandedIds.has(faq.id)
                      const answerId = `faq-answer-${faq.id}`
                      const buttonId = `faq-button-${faq.id}`

                      return (
                        <div
                          key={faq.id}
                          className={`overflow-hidden rounded-[14px] border bg-white transition-all duration-200 ${
                            isOpen
                              ? "border-forest/40 shadow-sm"
                              : "border-charcoal/10 shadow-xs hover:border-forest/20"
                          }`}
                        >
                          <button
                            id={buttonId}
                            type="button"
                            aria-expanded={isOpen}
                            aria-controls={answerId}
                            onClick={() => toggleItem(faq.id)}
                            className="flex w-full items-center justify-between gap-4 p-4 sm:p-5 text-left transition-colors cursor-pointer group"
                          >
                            <div className="flex items-center gap-3.5">
                              {/* Number Badge */}
                              <span
                                className={`flex h-[28px] w-[28px] shrink-0 items-center justify-center rounded-full text-[11px] font-extrabold transition-colors ${
                                  isOpen
                                    ? "bg-forest text-gold"
                                    : "bg-sage-mist text-forest/70 group-hover:bg-forest/10"
                                }`}
                              >
                                {String(index + 1).padStart(2, "0")}
                              </span>

                              {/* Question Heading */}
                              <h3 className={`${manrope.className} text-[15px] font-bold text-forest transition-colors group-hover:text-gold sm:text-[16px]`}>
                                {faq.question}
                              </h3>
                            </div>

                            {/* Chevron Toggle */}
                            <div
                              className={`flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full transition-transform duration-200 ${
                                isOpen ? "rotate-180 bg-forest/10 text-forest" : "bg-sage-mist text-charcoal/60"
                              }`}
                            >
                              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            </div>
                          </button>

                          {/* Collapsible Answer */}
                          <div
                            id={answerId}
                            role="region"
                            aria-labelledby={buttonId}
                            className={`grid transition-all duration-300 ease-in-out ${
                              isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                            }`}
                          >
                            <div className="overflow-hidden">
                              <div className="border-t border-charcoal/10 px-4 pb-6 pt-4 sm:px-6">
                                <p className="pl-[42px] text-[14.5px] leading-[1.8] text-charcoal/80 sm:text-[15px]">
                                  {faq.answer}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── Contact CTA Support Card ── */}
          <div className="mt-16 rounded-[18px] border border-charcoal/10 bg-forest p-8 text-center text-white shadow-md sm:mt-20 sm:p-12">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-gold/20 text-[24px]">
              ☀️
            </span>
            <h3 className={`${manrope.className} mt-4 text-[22px] font-extrabold text-white sm:text-[28px]`}>
              Still have questions about your rooftop solar setup?
            </h3>
            <p className="mx-auto mt-2 max-w-xl text-[15px] leading-relaxed text-white/80">
              Our solar engineers are available Monday to Saturday to analyze your electricity bill, evaluate your shadow-free roof area, and calculate your exact ROI.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/calculator"
                className={`${manrope.className} inline-flex items-center gap-2 rounded-[12px] bg-emerald-600 hover:bg-emerald-500 px-6 py-3.5 text-[14px] font-bold text-white shadow-md transition-all active:scale-95`}
              >
                <span>Calculate Your Solar Savings</span>
                <span>→</span>
              </Link>
              <Link
                href="/contact"
                className={`${manrope.className} inline-flex items-center gap-2 rounded-[12px] bg-white hover:bg-slate-100 px-6 py-3.5 text-[14px] font-bold text-slate-900 shadow-md transition-all active:scale-95`}
              >
                <span>Schedule Free Site Survey</span>
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
