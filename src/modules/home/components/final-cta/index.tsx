/**
 * Section 11: Final Enquiry CTA Section
 */
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { SunMedium, ArrowRight, Calculator, PhoneCall, ShieldCheck } from "lucide-react"

export default function FinalCta() {
  return (
    <section className="relative overflow-hidden bg-forest py-16 text-white sm:py-20 lg:py-24">
      {/* Decorative solar glow */}
      <div className="pointer-events-none absolute -bottom-20 -right-20 h-80 w-80 rounded-full bg-gold/20 blur-3xl" />
      <div className="pointer-events-none absolute top-0 left-0 h-60 w-60 rounded-full bg-sage/10 blur-3xl" />

      <div className="relative mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
        
        {/* Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-forest-deep px-4 py-1.5 shadow-sm">
          <SunMedium className="h-4 w-4 text-gold" />
          <span className="text-[12px] font-bold uppercase tracking-wider text-gold">
            Zero-Cost Feasibility Consultation
          </span>
        </div>

        {/* Heading */}
        <h2 className="mt-6 font-manrope text-[34px] font-extrabold tracking-tight text-white sm:text-[46px] lg:text-[52px]">
          Your Solar Journey Starts Here.
        </h2>

        {/* Supporting Copy */}
        <p className="mx-auto mt-4 max-w-2xl font-inter text-[16px] leading-relaxed text-sage-mist/90 sm:text-[18px]">
          Make the shift to clean, reliable solar energy today. Reduce your electricity expenses by up to 90% and secure your energy future with AG POWER.
        </p>

        {/* Action Buttons */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <LocalizedClientLink
            href="/contact"
            className="inline-flex min-h-[52px] items-center justify-center rounded-xl bg-gold px-8 font-inter text-[16px] font-bold text-forest shadow-md transition-all hover:bg-gold-hover hover:shadow-lg active:scale-95"
          >
            <span>Get Your Free Solar Consultation</span>
            <ArrowRight className="ml-2 h-5 w-5" />
          </LocalizedClientLink>

          <LocalizedClientLink
            href="/calculator"
            className="inline-flex min-h-[52px] items-center justify-center rounded-xl border border-white/30 bg-white/10 px-6 font-inter text-[16px] font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/20 active:scale-95"
          >
            <Calculator className="mr-2 h-5 w-5 text-gold" />
            <span>Calculate Savings First</span>
          </LocalizedClientLink>
        </div>

        {/* Quick Contacts Bar */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-6 border-t border-white/10 pt-8 text-[14px] text-sage">
          <div className="flex items-center gap-2">
            <PhoneCall className="h-4 w-4 text-gold" />
            <span>Direct Call: <strong>+91 98765 43210</strong></span>
          </div>
          <span className="hidden text-white/20 sm:inline">|</span>
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-gold" />
            <span>No Obligation Rooftop Assessment</span>
          </div>
        </div>

      </div>
    </section>
  )
}
