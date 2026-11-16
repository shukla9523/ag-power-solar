"use client"

import Image from "next/image"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { SunMedium, ArrowRight, ShieldCheck, Zap, Award, Sparkles, CheckCircle2 } from "lucide-react"

export default function Hero() {
  return (
    <section className="relative min-h-[660px] lg:min-h-[740px] overflow-hidden flex items-center bg-white text-charcoal">
      {/* Full-Bleed Background Image of Standing Smiling Solar Engineer with Solar Panels */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero-engineer.webp"
          alt="AG POWER Certified Solar Engineer Standing with Rooftop Solar Panels"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[75%_25%] md:object-[center_20%] filter brightness-[0.97]"
        />
        {/* Soft, crisp white directional gradient overlay for flawless SolarSquare text readability while keeping engineer visible */}
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/92 md:via-white/75 via-45% to-white/20 md:to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-white/40 z-10" />
      </div>

      <div className="relative z-20 mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24 w-full">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-8">
          
          {/* Left Column: Messaging */}
          <div className="lg:col-span-7">
            
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-forest/20 bg-emerald-50/90 px-4 py-1.5 shadow-sm backdrop-blur-sm">
              <SunMedium className="h-4 w-4 text-forest" />
              <span className="text-[12px] font-bold uppercase tracking-wider text-forest">
                India&apos;s Trusted Solar EPC Partner
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="mt-6 font-manrope text-[40px] font-extrabold leading-[1.15] tracking-tight text-charcoal sm:text-[54px] lg:text-[62px]">
              Power Your Home with{" "}
              <span className="relative inline-block text-forest">
                Smarter Solar
                <svg
                  className="absolute -bottom-2 left-0 w-full"
                  height="8"
                  viewBox="0 0 200 8"
                  fill="none"
                >
                  <path
                    d="M1 5.5C50 1.5 150 1.5 199 5.5"
                    stroke="#F59E0B"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
              </span>{" "}
              Energy.
            </h1>

            {/* Supporting Copy */}
            <p className="mt-6 max-w-2xl font-inter text-[17px] leading-relaxed text-charcoal-muted sm:text-[19px]">
              Make the switch to cleaner energy, reduce your electricity expenses by up to 90%, and take control of your energy future with AG POWER.
            </p>

            {/* Value Highlights */}
            <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
              <div className="flex items-center gap-2 text-[14px] font-medium text-charcoal">
                <CheckCircle2 className="h-4 w-4 text-forest" />
                <span>Up to 90% Bill Savings</span>
              </div>
              <div className="flex items-center gap-2 text-[14px] font-medium text-charcoal">
                <CheckCircle2 className="h-4 w-4 text-forest" />
                <span>25-Yr Performance Warranty</span>
              </div>
              <div className="flex items-center gap-2 text-[14px] font-medium text-charcoal">
                <CheckCircle2 className="h-4 w-4 text-forest" />
                <span>Govt Subsidy Support</span>
              </div>
            </div>

            {/* Call to Actions */}
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <LocalizedClientLink
                href="/calculator"
                className="inline-flex min-h-[52px] items-center justify-center rounded-xl bg-forest px-7 font-inter text-[16px] font-bold text-white shadow-md transition-all hover:bg-forest-light hover:shadow-lg active:scale-95"
              >
                <span>Calculate Your Solar Savings</span>
                <ArrowRight className="ml-2 h-5 w-5 text-gold" />
              </LocalizedClientLink>

              <LocalizedClientLink
                href="/contact"
                className="inline-flex min-h-[52px] items-center justify-center rounded-xl border-2 border-forest/20 bg-white/90 px-6 font-inter text-[16px] font-bold text-forest shadow-sm backdrop-blur-sm transition-all hover:bg-emerald-50 hover:border-forest/40 active:scale-95"
              >
                Get Free Consultation
              </LocalizedClientLink>
            </div>

            {/* Trust Footnote */}
            <div className="mt-10 flex items-center gap-6 border-t border-charcoal/10 pt-6 text-[13px] text-charcoal-muted">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-forest" />
                <span>MNRE Approved Components</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5 text-forest" />
                <span>Tier-1 Solar Modules</span>
              </div>
            </div>

          </div>

          {/* Right Column: Hero Visual Showcase (Solar Panel Array + Stats Card, Female Photo Removed) */}
          <div className="lg:col-span-5">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Glass Card Visual Wrapper */}
              <div className="relative overflow-hidden rounded-3xl border border-charcoal/10 bg-white/95 p-6 shadow-2xl backdrop-blur-md">
                
                {/* Solar Installation Graphic Representation (8 Solar Cells + 550W + Live Generation) */}
                <div className="relative h-72 w-full overflow-hidden rounded-2xl bg-forest-deep p-5 border border-forest/20 shadow-inner">
                  <div className="absolute inset-0 bg-gradient-to-t from-forest-deep via-transparent to-transparent z-10" />
                  
                  {/* Solar Panel Cells Pattern Illustration */}
                  <div className="grid grid-cols-4 gap-2.5 h-full opacity-85">
                    {[...Array(8)].map((_, i) => (
                      <div
                        key={i}
                        className="rounded-lg border border-gold/40 bg-gradient-to-br from-forest to-forest-deep p-2 flex flex-col justify-between shadow-inner"
                      >
                        <div className="h-1 w-full bg-gold/50 rounded-full" />
                        <div className="flex justify-between items-center text-[10px] text-sage">
                          <Zap className="h-3 w-3 text-gold" />
                          <span className="font-semibold text-white/90">550W</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Overlay Live Metric Pill */}
                  <div className="absolute bottom-4 left-4 right-4 z-20 flex items-center justify-between rounded-xl bg-forest/95 border border-gold/40 p-3.5 backdrop-blur-md shadow-lg">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-sage">
                        DAILY SOLAR GENERATION
                      </p>
                      <p className="font-manrope text-[20px] font-bold text-white">
                        24.5 kWh <span className="text-[12px] font-normal text-gold">/ Day avg</span>
                      </p>
                    </div>
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold text-forest shadow-md font-bold">
                      <Zap className="h-5 w-5 fill-current" />
                    </div>
                  </div>
                </div>

                {/* Sub Features Inside Hero Card */}
                <div className="mt-5 grid grid-cols-2 gap-4">
                  <div className="rounded-xl border border-charcoal/10 bg-slate-50 p-4">
                    <p className="text-[12px] text-charcoal-muted">Estimated Savings</p>
                    <p className="mt-1 font-manrope text-[22px] font-extrabold text-forest">
                      80 - 90%
                    </p>
                    <p className="text-[11px] text-charcoal-muted">on monthly power bills</p>
                  </div>
                  <div className="rounded-xl border border-charcoal/10 bg-slate-50 p-4">
                    <p className="text-[12px] text-charcoal-muted">System Payback</p>
                    <p className="mt-1 font-manrope text-[22px] font-extrabold text-charcoal">
                      3 - 4 Yrs
                    </p>
                    <p className="text-[11px] text-charcoal-muted">Free electricity for 20+ yrs</p>
                  </div>
                </div>

                {/* PM Surya Ghar Subsidy Banner */}
                <div className="mt-4 flex items-center justify-between rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-3 text-[13px] text-forest">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-gold" />
                    <span>Get up to <strong>₹78,000</strong> Central Subsidy</span>
                  </div>
                  <LocalizedClientLink
                    href="/services/residential-solar"
                    className="font-bold text-forest hover:underline"
                  >
                    Details →
                  </LocalizedClientLink>
                </div>

              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
