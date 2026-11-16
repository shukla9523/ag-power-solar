"use client"

import Image from "next/image"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { SunMedium, ArrowRight, ShieldCheck, Zap, Award, Sparkles, CheckCircle2 } from "lucide-react"

export default function Hero() {
  return (
    <section className="relative min-h-[620px] lg:min-h-[720px] overflow-hidden flex items-center bg-slate-950 text-white">
      {/* Full-Bleed Background Image: Solar Ambassador on Rooftop Solar Pergola */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero-solar-ambassador.webp"
          alt="AG POWER Certified Solar Ambassador Standing with Elevated Rooftop Solar Pergola Structure"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[center_right] md:object-center filter brightness-[0.98]"
        />
        {/* Directional Cinematic Gradient: Darker on left 55% for razor-sharp text readability, transparent on right so the smiling ambassador & rooftop pergola are completely clear */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/70 md:via-slate-950/40 via-50% to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-slate-950/20 z-10" />
      </div>

      <div className="relative z-20 mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24 w-full">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-8">
          
          {/* Left Column: Bold Headline & Actions (SolarSquare Style) */}
          <div className="lg:col-span-7">
            
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-slate-900/80 px-4 py-1.5 shadow-lg backdrop-blur-md">
              <SunMedium className="h-4 w-4 text-gold" />
              <span className="text-[12px] font-bold uppercase tracking-wider text-gold">
                India&apos;s Trusted Solar EPC Partner
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="mt-6 font-manrope text-[40px] font-black leading-[1.12] tracking-tight text-white sm:text-[54px] lg:text-[62px] drop-shadow-lg">
              Power Your Home with{" "}
              <span className="relative inline-block text-gold">
                Smarter Solar.
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
              </span>
            </h1>

            {/* Supporting Copy */}
            <p className="mt-6 max-w-xl font-inter text-[18px] leading-relaxed text-slate-100 sm:text-[21px] font-medium drop-shadow">
              Guaranteed savings. Tier-1 solar modules. End-to-end MNRE subsidy care.
            </p>

            {/* Value Highlights */}
            <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 max-w-lg">
              <div className="flex items-center gap-2 text-[14px] font-semibold text-slate-100 drop-shadow">
                <CheckCircle2 className="h-4 w-4 text-gold" />
                <span>Up to 90% Bill Savings</span>
              </div>
              <div className="flex items-center gap-2 text-[14px] font-semibold text-slate-100 drop-shadow">
                <CheckCircle2 className="h-4 w-4 text-gold" />
                <span>25-Yr Performance Warranty</span>
              </div>
              <div className="flex items-center gap-2 text-[14px] font-semibold text-slate-100 drop-shadow">
                <CheckCircle2 className="h-4 w-4 text-gold" />
                <span>Govt Subsidy Support</span>
              </div>
            </div>

            {/* Call to Actions */}
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <LocalizedClientLink
                href="/calculator"
                className="inline-flex min-h-[54px] items-center justify-center rounded-xl bg-white px-8 font-inter text-[16px] font-bold text-slate-950 shadow-2xl transition-all hover:bg-gold hover:scale-105 active:scale-95"
              >
                <span>Calculate Your Solar Savings</span>
                <ArrowRight className="ml-2 h-5 w-5 text-forest" />
              </LocalizedClientLink>

              <LocalizedClientLink
                href="/contact"
                className="inline-flex min-h-[54px] items-center justify-center rounded-xl border-2 border-white/40 bg-slate-900/40 px-7 font-inter text-[16px] font-bold text-white backdrop-blur-md transition-all hover:bg-white/20 active:scale-95 shadow-lg"
              >
                Get Free Consultation
              </LocalizedClientLink>
            </div>

            {/* Trust Footnote */}
            <div className="mt-10 flex items-center gap-6 border-t border-white/20 pt-6 text-[13px] text-slate-200">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-gold" />
                <span>MNRE Approved Components</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5 text-gold" />
                <span>Tier-1 Solar Modules</span>
              </div>
            </div>

          </div>

          {/* Right Column: Interactive Floating Live Metric Cards (Unobtrusive so the smiling man is 100% visible) */}
          <div className="lg:col-span-5 flex flex-col justify-end gap-4 lg:pl-8">
            
            {/* Top Floating Badge */}
            <div className="self-end inline-flex items-center gap-2 bg-slate-950/80 border border-emerald-400/40 backdrop-blur-md rounded-full px-4 py-2 shadow-2xl">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-bold text-white">⚡ Zero Electricity Bill</span>
              <span className="bg-gold text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">Verified</span>
            </div>

            {/* Floating Glass Live Metric Pill */}
            <div className="bg-slate-950/75 backdrop-blur-xl border border-gold/30 rounded-2xl p-4 shadow-2xl flex justify-between items-center max-w-sm ml-auto w-full">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                  Daily Solar Generation
                </p>
                <p className="font-manrope text-[24px] font-extrabold text-white">
                  24.5 kWh <span className="text-xs font-normal text-gold">/ Day avg</span>
                </p>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gold text-forest shadow-md font-bold text-xl">
                <Zap className="h-5 w-5 fill-current" />
              </div>
            </div>

            {/* Two Compact Stats Glass Cards */}
            <div className="grid grid-cols-2 gap-3 max-w-sm ml-auto w-full">
              <div className="bg-slate-950/75 backdrop-blur-lg border border-white/20 rounded-xl p-3.5 shadow-xl">
                <p className="text-xs text-emerald-300 font-medium">Estimated Savings</p>
                <p className="font-manrope font-extrabold text-gold text-xl mt-0.5">80 - 90%</p>
                <p className="text-[10px] text-slate-300">on monthly power bills</p>
              </div>
              <div className="bg-slate-950/75 backdrop-blur-lg border border-white/20 rounded-xl p-3.5 shadow-xl">
                <p className="text-xs text-emerald-300 font-medium">System Payback</p>
                <p className="font-manrope font-extrabold text-white text-xl mt-0.5">3 - 4 Yrs</p>
                <p className="text-[10px] text-slate-300">free solar for 25+ yrs</p>
              </div>
            </div>

            {/* PM Surya Ghar Central Subsidy Banner */}
            <div className="bg-emerald-950/80 border border-emerald-400/30 backdrop-blur-md rounded-xl p-3 flex items-center justify-between text-xs max-w-sm ml-auto w-full shadow-xl">
              <div className="flex items-center gap-2 text-slate-200">
                <Sparkles className="h-4 w-4 text-gold" />
                <span>Get up to <strong className="text-gold">₹78,000</strong> Central Subsidy</span>
              </div>
              <LocalizedClientLink
                href="/services/residential-solar"
                className="font-bold text-gold hover:underline"
              >
                Details →
              </LocalizedClientLink>
            </div>

          </div>

        </div>
      </div>
    </section>
  )
}
