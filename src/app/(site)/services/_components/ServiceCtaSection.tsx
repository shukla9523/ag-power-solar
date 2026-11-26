import React from "react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { ArrowRight, Calculator, Phone, MessageSquare } from "lucide-react"

interface ServiceCtaSectionProps {
  slug: string
}

/**
 * ServiceCtaSection - Reusable high-conversion bottom CTA for Services pages.
 * Features identical .btn-primary and .btn-secondary styles as Hero, plus Call & WhatsApp buttons.
 * 
 * TODO: REPLACE PLACEHOLDER PHONE & WHATSAPP NUMBERS WITH YOUR REAL COMPANY CONTACT DETAILS
 */
export default function ServiceCtaSection({ slug }: ServiceCtaSectionProps) {
  // TODO: Replace with your verified company phone number
  const phoneNumber = "+919523467849"
  // TODO: Replace with your verified WhatsApp business phone number
  const whatsappNumber = "919523467849"
  const whatsappMessage = encodeURIComponent(
    `Hello AG POWER, I would like to request a solar feasibility assessment for my property.`
  )

  return (
    <section className="relative overflow-hidden bg-forest py-16 text-white sm:py-20 lg:py-24">
      {/* Background glow styling */}
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-gold/10 blur-3xl" />
      <div className="pointer-events-none absolute -top-24 -left-24 h-80 w-80 rounded-full bg-forest-deep/60 blur-2xl" />

      <div className="relative z-10 mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <span className="inline-block rounded-full bg-gold/20 border border-gold/30 px-3.5 py-1 text-[12px] font-bold uppercase tracking-wider text-cream">
          Get Started Today
        </span>

        <h2 className="mt-4 font-manrope text-[clamp(1.85rem,3.5vw,2.75rem)] font-extrabold leading-tight tracking-tight text-white">
          Ready to Power Your Rooftop with Solar?
        </h2>

        <p className="mx-auto mt-4 max-w-2xl text-[16px] sm:text-[18px] leading-relaxed text-white/85">
          Contact our certified solar engineers for a free site assessment, 3D shadow analysis, and customized financial yield proposal.
        </p>

        {/* Action Buttons: Stacked full-width on mobile (<640px) with 12px gap, inline on desktop */}
        <div className="mt-9 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4">
          <LocalizedClientLink
            href={`/contact?service=${slug}`}
            className="btn-primary w-full sm:w-auto"
          >
            <span>Request Feasibility Assessment</span>
            <ArrowRight className="ml-2 h-4 w-4" />
          </LocalizedClientLink>

          <LocalizedClientLink
            href="/calculator"
            className="btn-secondary w-full sm:w-auto"
          >
            <Calculator className="mr-2 h-4 w-4 text-forest" />
            <span>Calculate Savings</span>
          </LocalizedClientLink>
        </div>

        {/* Quick Contact Strip: WhatsApp + Direct Call */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 pt-6 border-t border-white/10">
          {/* WhatsApp Button (wa.me) */}
          <a
            href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[44px] w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-social-whatsapp px-5 text-[14px] font-bold text-slate-950 transition-all hover:opacity-90 hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-white"
            aria-label="Chat with AG POWER Solar Engineer on WhatsApp"
          >
            <MessageSquare className="h-4 w-4 fill-slate-950 text-slate-950" />
            {/* TODO: Update WhatsApp button label if needed */}
            <span>Chat on WhatsApp (+91 95234 67849)</span>
          </a>

          {/* Direct Phone Call Button (tel:) */}
          <a
            href={`tel:${phoneNumber}`}
            className="inline-flex min-h-[44px] w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-white/10 border border-white/20 px-5 text-[14px] font-bold text-white transition-all hover:bg-white/20 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-gold"
            aria-label="Call AG POWER Solar Desk Directly"
          >
            <Phone className="h-4 w-4 text-gold" />
            {/* TODO: Update phone number label if needed */}
            <span>Call +91 95234 67849</span>
          </a>
        </div>

        <p className="mt-4 text-[13px] text-white/70">
          Free site visit available across Uttar Pradesh &amp; Delhi NCR. Zero obligation quote.
        </p>
      </div>
    </section>
  )
}
