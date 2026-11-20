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
    <section className="bg-white py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-manrope text-[32px] font-extrabold tracking-tight text-slate-900 sm:text-[42px]">
            Everything You Need to Know About Solar
          </h2>
          <p className="mt-4 text-[16px] text-slate-600 sm:text-[18px]">
            Clear, straightforward answers about rooftop solar investment, net-metering, and installation.
          </p>
        </div>

        {/* Accordion List */}
        <div className="mt-12 divide-y divide-slate-100 rounded-2xl border border-slate-200/80 bg-slate-50/50 p-4 sm:p-6 shadow-sm">
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
                  <span className="font-manrope text-[16px] font-bold text-slate-900 sm:text-[18px] group-hover:text-amber-600 transition-colors">
                    {faq.q}
                  </span>
                  <span className="ml-4 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-white text-slate-700 shadow-sm transition-all group-hover:bg-slate-900 group-hover:text-white">
                    <ChevronDown
                      className={`h-4 w-4 transition-transform duration-200 ${isOpen ? "rotate-180 text-amber-500" : ""}`}
                    />
                  </span>
                </button>
                {isOpen && (
                  <div className="mt-3 text-[14px] leading-relaxed text-slate-600 sm:text-[15px] pr-8">
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
            className="inline-flex items-center gap-1.5 font-inter text-[15px] font-bold text-slate-900 hover:text-amber-500 transition-colors"
          >
            <span>Have more questions? Browse all FAQs</span>
            <ArrowRight className="h-4 w-4" />
          </LocalizedClientLink>
        </div>

      </div>
    </section>
  )
}
