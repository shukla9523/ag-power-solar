"use client"

import Image from "next/image"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { SunMedium, ArrowRight, ShieldCheck, Award, CheckCircle2 } from "lucide-react"

export default function Hero() {
  return (
    <section className="relative min-h-[660px] lg:min-h-[760px] -mt-[68px] sm:-mt-[72px] lg:-mt-[76px] pt-[76px] sm:pt-[84px] lg:pt-[96px] overflow-hidden flex items-center bg-slate-950 text-white">
      {/* Full-Bleed Background Image: Smiling Solar Engineer with Engineering Hard Hat & Elevated Pergola */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero-solar-engineer-v2.webp"
          alt="AG POWER Certified Solar Engineer with Yellow Safety Helmet at Elevated Rooftop Solar Pergola Structure"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[75%_center] lg:object-[82%_center] filter brightness-[1.03] contrast-[1.02]"
        />
        {/* Soft Left Directional Scrim for Razor-Sharp Text Contrast — Right side remains completely bright & unobstructed */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/75 via-45% md:via-slate-950/45 md:via-58% to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/45 via-transparent to-slate-950/50 z-10 pointer-events-none" />
      </div>

      <div className="relative z-20 mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24 w-full">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
          
          {/* Left Column: Bold, Ultra-Clean Headline & Actions */}
          <div className="lg:col-span-8 max-w-2xl">
            
            {/* Main Headline */}
            <h1 className="font-manrope text-[40px] font-black leading-[1.12] tracking-tight text-white sm:text-[52px] lg:text-[62px] drop-shadow-[0_3px_14px_rgba(0,0,0,0.95)]">
              Power Your Home with{" "}
              <span className="relative inline-block text-emerald-400">
                Smarter Solar.
                <svg
                  className="absolute -bottom-2 left-0 w-full"
                  height="8"
                  viewBox="0 0 200 8"
                  fill="none"
                >
                  <path
                    d="M1 5.5C50 1.5 150 1.5 199 5.5"
                    stroke="#10B981"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </h1>

            {/* Supporting Copy */}
            <p className="mt-5 max-w-xl font-inter text-[18px] leading-relaxed text-white sm:text-[21px] font-semibold drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]">
              Guaranteed savings. Tier-1 solar modules. End-to-end MNRE subsidy care.
            </p>

            {/* Value Highlights (Frosted Glass Chips for 100% Sharp Readability Over Photo) */}
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center gap-2 rounded-xl bg-slate-950/55 px-3.5 py-2 backdrop-blur-md border border-white/20 text-[14px] font-bold text-white shadow-lg">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                <span>Up to 90% Bill Savings</span>
              </div>
              <div className="inline-flex items-center gap-2 rounded-xl bg-slate-950/55 px-3.5 py-2 backdrop-blur-md border border-white/20 text-[14px] font-bold text-white shadow-lg">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                <span>25-Yr Performance Warranty</span>
              </div>
              <div className="inline-flex items-center gap-2 rounded-xl bg-slate-950/55 px-3.5 py-2 backdrop-blur-md border border-white/20 text-[14px] font-bold text-white shadow-lg">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                <span>Govt Subsidy Support</span>
              </div>
            </div>

            {/* Call to Actions: Main Button Green + Secondary Button White */}
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <LocalizedClientLink
                href="/calculator"
                className="inline-flex min-h-[52px] items-center justify-center rounded-xl bg-emerald-600 hover:bg-emerald-500 px-8 font-inter text-[16px] font-extrabold text-white shadow-2xl transition-all hover:scale-105 active:scale-95"
              >
                <span>Calculate Your Solar Savings</span>
                <ArrowRight className="ml-2 h-5 w-5 text-white" />
              </LocalizedClientLink>

              <LocalizedClientLink
                href="/contact"
                className="inline-flex min-h-[52px] items-center justify-center rounded-xl bg-white hover:bg-slate-100 px-7 font-inter text-[16px] font-bold text-slate-950 shadow-xl transition-all hover:scale-105 active:scale-95"
              >
                Get Free Consultation
              </LocalizedClientLink>
            </div>

            {/* Trust Footnote */}
            <div className="mt-9 flex items-center gap-6 border-t border-white/25 pt-5 text-[13.5px] font-semibold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
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

          {/* Right Column: Kept Clear & Open so Ambassador and Elevated Rooftop Pergola are 100% visible */}
          <div className="hidden lg:flex lg:col-span-4 flex-col justify-end items-end h-full pt-48" />

        </div>
      </div>
    </section>
  )
}
