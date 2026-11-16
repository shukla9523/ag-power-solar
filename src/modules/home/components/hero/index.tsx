"use client"

import Image from "next/image"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { SunMedium, ArrowRight, ShieldCheck, Award, CheckCircle2 } from "lucide-react"

export default function Hero() {
  return (
    <section className="relative min-h-[600px] lg:min-h-[700px] overflow-hidden flex items-center bg-slate-950 text-white">
      {/* Full-Bleed Background Image: Smiling Solar Ambassador with Elevated Pergola */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero-solar-ambassador.webp"
          alt="AG POWER Certified Solar Ambassador Standing with Elevated Rooftop Solar Pergola Structure"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[75%_center] lg:object-[82%_center] filter brightness-[1.03] contrast-[1.02]"
        />
        {/* Soft Left Directional Scrim for Razor-Sharp Text Contrast — Right side remains completely bright & unobstructed */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/92 via-slate-950/60 md:via-slate-950/30 via-50% to-transparent z-10" />
      </div>

      <div className="relative z-20 mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24 w-full">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
          
          {/* Left Column: Bold, Ultra-Clean Headline & Actions (SolarSquare Inspired) */}
          <div className="lg:col-span-8 max-w-2xl">
            
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/50 bg-slate-950/70 px-4 py-1.5 shadow-md backdrop-blur-md">
              <SunMedium className="h-4 w-4 text-amber-400" />
              <span className="text-[12px] font-bold uppercase tracking-wider text-amber-400">
                India&apos;s Trusted Solar EPC Partner
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="mt-5 font-manrope text-[40px] font-black leading-[1.12] tracking-tight text-white sm:text-[52px] lg:text-[60px] drop-shadow-[0_2px_10px_rgba(0,0,0,0.85)]">
              Power Your Home with{" "}
              <span className="relative inline-block text-amber-400">
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
            <p className="mt-5 max-w-xl font-inter text-[18px] leading-relaxed text-white sm:text-[21px] font-medium drop-shadow-[0_2px_6px_rgba(0,0,0,0.85)]">
              Guaranteed savings. Tier-1 solar modules. End-to-end MNRE subsidy care.
            </p>

            {/* Value Highlights */}
            <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
              <div className="flex items-center gap-2 text-[14px] font-bold text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]">
                <CheckCircle2 className="h-4 w-4 text-amber-400 flex-shrink-0" />
                <span>Up to 90% Bill Savings</span>
              </div>
              <div className="flex items-center gap-2 text-[14px] font-bold text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]">
                <CheckCircle2 className="h-4 w-4 text-amber-400 flex-shrink-0" />
                <span>25-Yr Performance Warranty</span>
              </div>
              <div className="flex items-center gap-2 text-[14px] font-bold text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]">
                <CheckCircle2 className="h-4 w-4 text-amber-400 flex-shrink-0" />
                <span>Govt Subsidy Support</span>
              </div>
            </div>

            {/* Call to Actions (Clean SolarSquare Style) */}
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <LocalizedClientLink
                href="/calculator"
                className="inline-flex min-h-[52px] items-center justify-center rounded-xl bg-white px-8 font-inter text-[16px] font-black text-slate-950 shadow-2xl transition-all hover:bg-amber-400 hover:scale-105 active:scale-95"
              >
                <span>Calculate Your Solar Savings</span>
                <ArrowRight className="ml-2 h-5 w-5 text-slate-950" />
              </LocalizedClientLink>

              <LocalizedClientLink
                href="/contact"
                className="inline-flex min-h-[52px] items-center justify-center rounded-xl border border-white/60 bg-slate-950/40 px-7 font-inter text-[16px] font-bold text-white backdrop-blur-md transition-all hover:bg-white/20 active:scale-95 shadow-lg"
              >
                Get Free Consultation
              </LocalizedClientLink>
            </div>

            {/* Trust Footnote */}
            <div className="mt-9 flex items-center gap-6 border-t border-white/20 pt-5 text-[13px] text-white/95 drop-shadow">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-amber-400" />
                <span>MNRE Approved Components</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="h-4 w-4 text-amber-400" />
                <span>Tier-1 Solar Modules</span>
              </div>
            </div>

          </div>

          {/* Right Column: Kept Clear & Open so Ambassador and Elevated Rooftop Pergola are 100% visible, with just one subtle floating pill at bottom */}
          <div className="hidden lg:flex lg:col-span-4 flex-col justify-end items-end h-full pt-48">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-slate-950/40 px-4 py-2 backdrop-blur-xl shadow-lg">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-bold text-white tracking-wide">Elevated Rooftop Pergola</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
