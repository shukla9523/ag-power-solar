"use client"

import Image from "next/image"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { SunMedium, ArrowRight, ShieldCheck, Award, CheckCircle2 } from "lucide-react"

export default function Hero() {
  return (
    <section className="relative min-h-[560px] sm:min-h-[660px] lg:min-h-[760px] -mt-[68px] sm:-mt-[72px] lg:-mt-[76px] pt-[84px] sm:pt-[104px] lg:pt-[124px] pb-10 sm:pb-20 lg:pb-28 overflow-hidden flex items-center bg-slate-950 text-white">
      {/* ── Desktop Full-Bleed Background Image (Clear, unshaded right half for Engineer & Solar Pergola) ── */}
      <div className="hidden lg:block absolute inset-0 z-0">
        <Image
          src="/images/hero-solar-engineer-v2.webp"
          alt="AG POWER Certified Solar Engineer with Yellow Safety Helmet at Elevated Rooftop Solar Pergola Structure"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[80%_center] filter brightness-[1.03] contrast-[1.02]"
        />
        {/* Desktop Left Directional Scrim — Right side remains completely bright & unobstructed */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/75 via-45% md:via-slate-950/45 md:via-58% to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/45 via-transparent to-slate-950/50 z-10 pointer-events-none" />
      </div>

      <div className="relative z-20 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 items-center gap-6 sm:gap-10 lg:gap-12 lg:grid-cols-12">
          
          {/* Main Column: Punchy Headline, Spotlight Visual & Compact CTAs */}
          <div className="lg:col-span-8 max-w-2xl">
            
            {/* Trust Eyebrow Badge */}
            <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 border border-emerald-400/30 px-3 py-1 text-[11.5px] sm:text-[13px] font-bold text-emerald-300 mb-2.5 sm:mb-3 backdrop-blur-md">
              <SunMedium className="h-3.5 w-3.5 text-emerald-400 flex-shrink-0" />
              <span>PM Surya Ghar Subsidy • 25-Yr Performance Warranty</span>
            </div>

            {/* Exactly One Single H1 for SEO & Performance Guards */}
            <h1 className="font-manrope text-[24px] xs:text-[28px] sm:text-[44px] lg:text-[58px] font-black leading-[1.16] sm:leading-[1.12] tracking-tight text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)]">
              Power Your Home with{" "}
              <span className="relative inline-block text-emerald-400">
                Smarter Solar.
                <svg
                  className="absolute -bottom-1 sm:-bottom-2 left-0 w-full"
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
            <p className="mt-2.5 sm:mt-4 max-w-xl font-inter text-[13.5px] sm:text-[17px] lg:text-[20px] leading-relaxed text-slate-200 sm:text-white font-medium sm:font-semibold drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]">
              Guaranteed savings. Tier-1 solar modules. End-to-end MNRE subsidy care.
            </p>

            {/* ── Mobile Dedicated Engineer Spotlight Card (100% VISIBLE, Bright, Sunlit — Builds Immense Trust) ── */}
            <div className="lg:hidden relative w-full aspect-[4/3] xs:aspect-[16/11] rounded-2xl overflow-hidden border border-white/20 shadow-2xl bg-slate-900 my-3.5 group">
              <Image
                src="/images/hero-solar-engineer-mobile.webp"
                alt="AG POWER Certified Solar Engineer with Yellow Safety Helmet at Rooftop Solar Installation"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-[center_15%] brightness-[1.03] contrast-[1.02]"
              />
              {/* Floating Glassmorphic Trust Badges over photo */}
              <div className="absolute top-2.5 right-2.5 inline-flex items-center gap-1.5 rounded-lg bg-slate-950/80 backdrop-blur-md border border-white/20 px-2.5 py-1 text-[11px] font-extrabold text-white shadow-lg">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                <span>Certified Engineer</span>
              </div>

              <div className="absolute bottom-2.5 inset-x-2.5 flex items-center justify-between rounded-xl bg-slate-950/85 backdrop-blur-md border border-white/20 px-3 py-2 text-white shadow-lg">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[11.5px] font-bold text-slate-100">On-Site EPC Installation Team</span>
                </div>
                <span className="text-[11px] font-extrabold text-amber-300">★ 4.9/5 Rating</span>
              </div>
            </div>

            {/* Value Highlights (Clean, Compact Frosted Glass Chips) */}
            <div className="mt-3 sm:mt-7 flex flex-wrap items-center gap-1.5 sm:gap-3">
              <div className="inline-flex items-center gap-1.5 rounded-lg sm:rounded-xl bg-slate-900/80 sm:bg-slate-950/60 px-2.5 py-1 sm:px-3.5 sm:py-2 backdrop-blur-md border border-white/20 text-[11.5px] sm:text-[14px] font-bold text-white shadow-md">
                <CheckCircle2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-emerald-400 flex-shrink-0" />
                <span>Up to 90% Bill Savings</span>
              </div>
              <div className="inline-flex items-center gap-1.5 rounded-lg sm:rounded-xl bg-slate-900/80 sm:bg-slate-950/60 px-2.5 py-1 sm:px-3.5 sm:py-2 backdrop-blur-md border border-white/20 text-[11.5px] sm:text-[14px] font-bold text-white shadow-md">
                <CheckCircle2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-emerald-400 flex-shrink-0" />
                <span>25-Yr Performance Warranty</span>
              </div>
              <div className="inline-flex items-center gap-1.5 rounded-lg sm:rounded-xl bg-slate-900/80 sm:bg-slate-950/60 px-2.5 py-1 sm:px-3.5 sm:py-2 backdrop-blur-md border border-white/20 text-[11.5px] sm:text-[14px] font-bold text-white shadow-md">
                <CheckCircle2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-emerald-400 flex-shrink-0" />
                <span>Govt Subsidy Support</span>
              </div>
            </div>

            {/* Call to Actions: Main Button Green + Secondary Button White (Compact & Mobile-Optimized) */}
            <div className="mt-4 sm:mt-8 grid grid-cols-2 sm:flex sm:flex-row items-center gap-2.5 sm:gap-4 w-full sm:w-auto">
              <LocalizedClientLink
                href="/calculator"
                className="inline-flex min-h-[44px] sm:min-h-[52px] items-center justify-center rounded-xl bg-emerald-600 hover:bg-emerald-500 px-3.5 sm:px-8 font-inter text-[13.5px] sm:text-[16px] font-extrabold text-white shadow-lg transition-all hover:scale-105 active:scale-95 text-center leading-tight"
              >
                <span>Calculate Savings</span>
                <ArrowRight className="ml-1 sm:ml-2 h-3.5 w-3.5 sm:h-5 sm:w-5 text-white flex-shrink-0" />
              </LocalizedClientLink>

              <LocalizedClientLink
                href="/contact"
                className="inline-flex min-h-[44px] sm:min-h-[52px] items-center justify-center rounded-xl bg-white hover:bg-slate-100 px-3 sm:px-7 font-inter text-[13.5px] sm:text-[16px] font-bold text-slate-950 shadow-sm border border-slate-200 transition-all hover:scale-105 active:scale-95 text-center leading-tight"
              >
                Get Free Quote
              </LocalizedClientLink>
            </div>

            {/* Trust Footnote */}
            <div className="mt-4 sm:mt-8 flex flex-wrap items-center gap-3 sm:gap-6 border-t border-white/20 pt-3 sm:pt-4 text-[11.5px] sm:text-[13.5px] font-semibold text-slate-200 sm:text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <ShieldCheck className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-amber-400" />
                <span>MNRE Approved Components</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <Award className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-amber-400" />
                <span>Tier-1 Solar Modules</span>
              </div>
            </div>

          </div>

          {/* Right Column: Kept Clear & Open so Ambassador and Elevated Rooftop Pergola are 100% visible on desktop */}
          <div className="hidden lg:flex lg:col-span-4 flex-col justify-end items-end h-full pt-48" />

        </div>
      </div>
    </section>
  )
}
