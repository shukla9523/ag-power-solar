/**
 * Section 11: Final Enquiry CTA Section
 */
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { SunMedium, ArrowRight, Calculator, PhoneCall, ShieldCheck } from "lucide-react"

export default function FinalCta() {
  return (
    <section
      style={{ backgroundColor: "#14532D" }}
      className="relative overflow-hidden py-[72px] text-white"
    >
      <div className="relative z-10 mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
        
        {/* Heading: clamp(30px, 3.2vw, 42px), line-height 1.2 */}
        <h2 className="font-manrope text-[clamp(30px,3.2vw,42px)] font-black tracking-tight text-white leading-[1.2]">
          Your Solar Journey Starts Here.
        </h2>

        {/* Supporting Copy: 17px, max-width 680px */}
        <p className="mx-auto mt-4 max-w-[680px] font-inter text-[17px] leading-relaxed text-emerald-100">
          Make the shift to clean, reliable solar energy today. Reduce your electricity expenses by up to 90% and secure your energy future with AG POWER.
        </p>

        {/* Action Buttons: Yellow Primary + White Secondary */}
        <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 w-full sm:w-auto">
          <LocalizedClientLink
            href="/contact"
            className="group inline-flex min-h-[52px] w-full sm:w-auto items-center justify-center rounded-xl bg-amber-400 hover:bg-amber-300 px-7 sm:px-8 font-inter text-[15px] sm:text-[16px] font-extrabold text-forest-deep shadow-[0_4px_20px_rgba(245,158,11,0.35)] transition-all duration-300 hover:-translate-y-0.5 active:scale-95 text-center"
          >
            <span>Get Your Free Solar Consultation</span>
            <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 text-forest-deep transition-transform duration-200 group-hover:translate-x-1" />
          </LocalizedClientLink>

          <LocalizedClientLink
            href="/calculator"
            className="inline-flex min-h-[52px] w-full sm:w-auto items-center justify-center rounded-xl bg-white hover:bg-slate-100 px-6 sm:px-7 font-inter text-[15px] sm:text-[16px] font-bold text-forest-deep shadow-md border border-emerald-300/40 transition-all duration-300 hover:-translate-y-0.5 active:scale-95 text-center"
          >
            <Calculator className="mr-2 h-4 w-4 sm:h-5 sm:w-5 text-emerald-700" />
            <span>Calculate Savings First</span>
          </LocalizedClientLink>
        </div>

        {/* Quick Contacts Bar */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-6 border-t border-emerald-700/60 pt-8 text-[14px] text-emerald-100">
          <div className="flex items-center gap-2">
            <PhoneCall className="h-4 w-4 text-amber-400" />
            <span>Direct Call: <strong className="text-white">+91 95234 67849</strong></span>
          </div>
          <span className="hidden text-emerald-600 sm:inline">|</span>
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-amber-400" />
            <span className="text-white">No Obligation Rooftop Assessment</span>
          </div>
        </div>

      </div>
    </section>
  )
}
