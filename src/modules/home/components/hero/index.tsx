"use client"

import Image from "next/image"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { SunMedium, ArrowRight, ShieldCheck, Zap, Award, Sparkles, CheckCircle2 } from "lucide-react"

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-emerald-50/60 via-white to-white text-charcoal">
      {/* Background glow effects */}
      <div className="pointer-events-none absolute -top-40 right-0 h-96 w-96 rounded-full bg-gold/15 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-10 h-80 w-80 rounded-full bg-emerald-500/10 blur-3xl" />

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-8">
          
          {/* Left Column: Messaging */}
          <div className="lg:col-span-7">
            
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-forest/20 bg-emerald-50 px-4 py-1.5 shadow-sm">
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
                className="inline-flex min-h-[52px] items-center justify-center rounded-xl border-2 border-forest/20 bg-white px-6 font-inter text-[16px] font-bold text-forest shadow-sm transition-all hover:bg-emerald-50 hover:border-forest/40 active:scale-95"
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

          {/* Right Column: Hero Visual Showcase */}
          <div className="lg:col-span-5">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Glass Card Visual Wrapper */}
              <div className="relative overflow-hidden rounded-3xl border border-charcoal/10 bg-white p-6 shadow-2xl">
                
                {/* Real Happy Customer Photo with Floating Badges */}
                <div className="relative h-80 w-full overflow-hidden rounded-2xl border border-charcoal/10 group shadow-lg">
                  <Image
                    src="/images/hero-solar-customer.webp"
                    alt="Happy AG POWER Solar Homeowner with Rooftop Solar Panels"
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 450px"
                    className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent pointer-events-none" />

                  {/* Top-Left Floating Badge: Zero Electricity Bill */}
                  <div className="absolute top-3.5 left-3.5 z-20 flex items-center gap-2 rounded-full border border-emerald-400/50 bg-emerald-900/90 px-3 py-1 shadow-md backdrop-blur-md">
                    <span className="h-2 w-2 rounded-full bg-gold animate-pulse" />
                    <span className="text-[11px] font-bold text-white tracking-wide">
                      Zero Power Bill!
                    </span>
                  </div>

                  {/* Top-Right Floating Badge: Subsidy Credited */}
                  <div className="absolute top-3.5 right-3.5 z-20 rounded-full border border-white/20 bg-slate-900/90 px-3 py-1 text-[11px] font-bold text-gold shadow-md backdrop-blur-md">
                    ₹78,000 Subsidy Credited
                  </div>

                  {/* Bottom Overlay Live Metric Pill */}
                  <div className="absolute bottom-3 left-3 right-3 z-20 flex items-center justify-between rounded-xl bg-slate-900/95 border border-gold/40 p-3.5 backdrop-blur-md shadow-xl">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-emerald-400">
                        Daily Solar Generation
                      </p>
                      <p className="font-manrope text-[20px] font-bold text-white">
                        24.5 kWh <span className="text-[12px] font-normal text-gold">/ Day avg</span>
                      </p>
                    </div>
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold text-forest shadow-sm">
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
