"use client"

import { useState } from "react"
import { manrope, inter } from "@lib/fonts"
import { PageFAQ } from "@lib/data/page-faqs"

interface PageFaqSectionProps {
  faqs: PageFAQ[]
  badge?: string
  heading?: string
  title?: string
  subheading?: string
  subtitle?: string
  className?: string
}

export default function PageFaqSection({
  faqs,
  badge = "Frequently Asked",
  heading,
  title,
  subheading,
  subtitle,
  className = "",
}: PageFaqSectionProps) {
  const displayHeading = title || heading || "Frequently Asked Questions"
  const displaySubheading =
    subtitle !== undefined
      ? subtitle
      : subheading !== undefined
      ? subheading
      : "Clear, verified answers to common questions about our solar EPC solutions and technical processes."
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  if (!faqs || faqs.length === 0) return null

  const handleToggle = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index))
  }

  return (
    <section aria-labelledby="page-faqs-heading" className={`border-t border-charcoal/10 bg-ivory py-14 sm:py-18 ${inter.className} ${className}`}>
      <div className="content-container px-4 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-[960px]">
          {/* Header */}
          <div className="mb-8 text-center sm:mb-12">
            <h2
              id="page-faqs-heading"
              className={`${manrope.className} text-[26px] font-extrabold tracking-[-0.03em] text-forest sm:text-[32px] lg:text-[36px]`}
            >
              {displayHeading}
            </h2>
            {displaySubheading && (
              <p className="mx-auto mt-2.5 max-w-xl text-[14.5px] leading-relaxed text-charcoal/70 sm:text-[15.5px]">
                {displaySubheading}
              </p>
            )}
          </div>

          {/* Accordion */}
          <div className="space-y-3.5">
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index
              const answerId = `page-faq-answer-${index}`
              const buttonId = `page-faq-button-${index}`

              return (
                <div
                  key={index}
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
                    onClick={() => handleToggle(index)}
                    className="flex w-full items-center justify-between gap-4 p-4.5 text-left transition-colors sm:p-5 cursor-pointer group"
                  >
                    <div className="flex items-center gap-3.5">
                      <span
                        className={`flex h-[28px] w-[28px] shrink-0 items-center justify-center rounded-full text-[11px] font-extrabold transition-colors ${
                          isOpen
                            ? "bg-forest text-gold"
                            : "bg-sage-mist text-forest/70 group-hover:bg-forest/10"
                        }`}
                      >
                        {String(index + 1).padStart(2, "0")}
                      </span>

                      <span className={`${manrope.className} text-[15px] font-bold text-forest transition-colors group-hover:text-gold sm:text-[16px]`}>
                        {faq.question}
                      </span>
                    </div>

                    <div
                      className={`flex h-[28px] w-[28px] shrink-0 items-center justify-center rounded-full transition-transform duration-200 ${
                        isOpen ? "rotate-180 bg-forest/10 text-forest" : "bg-sage-mist text-charcoal/60"
                      }`}
                    >
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  </button>

                  <div
                    id={answerId}
                    role="region"
                    aria-labelledby={buttonId}
                    className={`grid transition-all duration-300 ease-in-out ${
                      isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div className="border-t border-charcoal/10 px-4.5 pb-5 pt-3.5 sm:px-5">
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
      </div>
    </section>
  )
}
