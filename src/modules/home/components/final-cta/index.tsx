/**
 * Section 11: Final Enquiry CTA Section
 */
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { SunMedium, ArrowRight, Calculator, PhoneCall, ShieldCheck } from "lucide-react"

export default function FinalCta() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-emerald-950 via-slate-950 to-emerald-950 py-20 text-white sm:py-24 border-t border-emerald-500/20">
      {/* Decorative ambient glass light orbs */}
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-emerald-500/15 blur-3xl" />
      <div className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-amber-500/15 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
        
        {/* Badge (30% Green + 10% Gold) */}
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/40 bg-emerald-950/70 px-4 py-1.5 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] backdrop-blur-xl">
          <SunMedium className="h-4 w-4 text-amber-400" />
          <span className="text-[12px] font-bold uppercase tracking-wider text-emerald-300">
            Zero-Cost Feasibility Consultation
          </span>
        </div>

        {/* Heading */}
        <h2 className="mt-6 font-manrope text-[34px] font-black tracking-tight text-white sm:text-[46px] lg:text-[54px] drop-shadow-md">
          Your Solar Journey Starts Here.
        </h2>

        {/* Supporting Copy */}
        <p className="mx-auto mt-4 max-w-2xl font-inter text-[16px] leading-relaxed text-slate-200 sm:text-[19px]">
          Make the shift to clean, reliable solar energy today. Reduce your electricity expenses by up to 90% and secure your energy future with AG POWER.
        </p>

        {/* Action Buttons (10% Gold CTA) */}
        <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 w-full sm:w-auto">
          <LocalizedClientLink
            href="/contact"
            className="inline-flex min-h-[50px] sm:min-h-[52px] w-full sm:w-auto items-center justify-center rounded-xl bg-emerald-600 hover:bg-emerald-500 px-6 sm:px-8 font-inter text-[15px] sm:text-[16px] font-extrabold text-white shadow-xl transition-all hover:scale-105 active:scale-95 text-center"
          >
            <span>Get Your Free Solar Consultation</span>
            <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 text-white" />
          </LocalizedClientLink>

          <LocalizedClientLink
            href="/calculator"
            className="inline-flex min-h-[50px] sm:min-h-[52px] w-full sm:w-auto items-center justify-center rounded-xl bg-white hover:bg-slate-100 px-6 sm:px-7 font-inter text-[15px] sm:text-[16px] font-bold text-slate-950 shadow-lg transition-all hover:scale-105 active:scale-95 text-center"
          >
            <Calculator className="mr-2 h-4 w-4 sm:h-5 sm:w-5 text-emerald-700" />
            <span>Calculate Savings First</span>
          </LocalizedClientLink>
        </div>

        {/* Quick Contacts Bar */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-6 border-t border-white/10 pt-8 text-[14px] text-slate-300">
          <div className="flex items-center gap-2">
            <PhoneCall className="h-4 w-4 text-amber-400" />
            <span>Direct Call: <strong className="text-white">+91 95234 67849</strong></span>
          </div>
          <span className="hidden text-white/20 sm:inline">|</span>
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-amber-400" />
            <span className="text-white">No Obligation Rooftop Assessment</span>
          </div>
        </div>

      </div>
    </section>
  )
}
