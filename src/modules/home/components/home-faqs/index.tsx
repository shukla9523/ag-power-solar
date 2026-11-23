"use client"

import { useState } from "react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { ChevronDown, HelpCircle, ArrowRight } from "lucide-react"

const defaultFaqs = [
  {
    q: "How much can I actually save on my monthly electricity bill?",
    a: "Depending on your sanctioned load and roof area, a properly sized on-grid solar system offsets between 80% to 90% of your grid electricity consumption. Any surplus generation during peak daylight hours is fed back into the grid via net-metering and credited against your night-time usage.",
  },
  {
    q: "How does the PM Surya Ghar Muft Bijli Yojana subsidy work?",
    a: "Under the central PM Surya Ghar scheme, individual residential homeowners can receive up to ₹30,000 for a 1 kW system, ₹60,000 for a 2 kW system, and a maximum of ₹78,000 for 3 kW and larger systems. The subsidy amount is directly deposited into your bank account after DISCOM inspection and commissioning.",
  },
  {
    q: "How much rooftop area do I need to install a solar plant?",
    a: "As a rule of thumb, every 1 kW of solar requires approximately 80 to 100 square feet of shadow-free rooftop space. For instance, a standard 3 kW residential setup requires roughly 250 to 300 sq.ft. of clear roof.",
  },
  {
    q: "What happens during cloudy or monsoon days and at night?",
    a: "On-grid solar systems remain connected to the DISCOM utility grid. At night or on heavily overcast days when generation dips, electricity seamlessly flows from the grid without interruption. You never experience power blackouts due to solar weather fluctuations.",
  },
  {
    q: "What is the warranty and expected lifespan of AG POWER solar systems?",
    a: "Our Tier-1 solar panels carry a 10 to 12-year product manufacturing warranty and a 25 to 30-year linear power generation warranty. Grid-tie inverters typically carry 5 to 10-year warranties with extended options.",
  },
  {
    q: "What maintenance is required for a rooftop solar system?",
    a: "Solar PV systems have no moving mechanical parts and require minimal maintenance. Rinsing the panels with plain water every 10 to 15 days to remove surface dust is usually sufficient to maintain optimal generation efficiency.",
  },
]

export default function HomeFaqs() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section
      className="py-[72px] transition-colors"
      style={{ backgroundColor: "#F0FDF4" }}
      id="faqs"
    >
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200/80 bg-emerald-100 px-3.5 py-1 text-[11px] sm:text-[12px] font-bold uppercase tracking-wider text-forest-deep mb-3">
            <HelpCircle className="h-3.5 w-3.5 text-amber-500" />
            <span>Frequently Asked Questions</span>
          </div>
          <h2 className="font-manrope text-[clamp(30px,3.2vw,42px)] font-extrabold tracking-tight text-forest-deep leading-[1.2]">
            Everything You Need to Know <span className="text-emerald-600">About Solar</span>
          </h2>
          <p className="mt-4 max-w-[680px] mx-auto text-[17px] text-slate-600 leading-relaxed">
            Clear, straightforward answers about rooftop solar investment, net-metering, and installation.
          </p>
        </div>

        {/* Accordion List */}
        <div className="mt-12 divide-y divide-emerald-100 rounded-2xl border border-emerald-200/80 border-t-[3px] border-t-transparent hover:border-t-amber-400 bg-white p-[28px] shadow-sm transition-all duration-300">
          {defaultFaqs.map((faq, idx) => {
            const isOpen = openIndex === idx
            return (
              <div key={idx} className="py-4 first:pt-0 last:pb-0">
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className="flex w-full items-center justify-between text-left focus:outline-none group"
                  aria-expanded={isOpen}
                >
                  <span className="font-manrope text-[16px] sm:text-[18px] font-bold text-forest-deep group-hover:text-emerald-600 transition-colors">
                    {faq.q}
                  </span>
                  <span className="ml-4 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-emerald-50 text-forest-deep shadow-xs transition-all group-hover:bg-emerald-600 group-hover:text-white">
                    <ChevronDown
                      className={`h-4 w-4 transition-transform duration-200 ${isOpen ? "rotate-180 text-emerald-600 group-hover:text-white" : ""}`}
                    />
                  </span>
                </button>
                {isOpen && (
                  <div className="mt-3 text-[14px] sm:text-[15px] leading-relaxed text-slate-600 pr-8">
                    {faq.a}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* More FAQs Link */}
        <div className="mt-10 text-center">
          <LocalizedClientLink
            href="/faq"
            className="inline-flex items-center gap-1.5 font-inter text-[15px] font-bold text-forest-deep hover:text-emerald-600 transition-colors"
          >
            <span>Have more questions? Browse all FAQs</span>
            <ArrowRight className="h-4 w-4 text-emerald-600" />
          </LocalizedClientLink>
        </div>

      </div>
    </section>
  )
}
