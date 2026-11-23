"use client"

import Image from "next/image"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { SunMedium, ArrowRight, ShieldCheck, Award, CheckCircle2 } from "lucide-react"

export default function Hero() {
  return (
    <section className="relative min-h-[580px] sm:min-h-[640px] lg:min-h-[720px] pt-8 sm:pt-12 lg:pt-16 pb-12 sm:pb-20 lg:pb-24 overflow-hidden flex items-center bg-white text-slate-900">
      {/* ── Full-Bleed Background Image (Clear, Unfiltered, 85% Center Position for Full Engineer Face Visibility) ── */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero-solar-engineer-v2.webp"
          alt="AG POWER Certified Solar Engineer with Yellow Safety Helmet at Elevated Rooftop Solar Pergola Structure"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[85%_center]"
        />
        {/* Desktop Left White Gradient — Fades from 95% white at 0% to fully transparent at 55% width, leaving right 45% (engineer) 100% clear with zero overlay */}
        <div
          style={{
            background: "linear-gradient(90deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.85) 30%, rgba(255, 255, 255, 0) 55%)",
          }}
          className="hidden lg:block absolute inset-0 z-10 pointer-events-none"
        />

        {/* Mobile Scrim — Soft ambient top gradient for mobile text clarity */}
        <div
          style={{
            background: "linear-gradient(180deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.6) 50%, rgba(255, 255, 255, 0) 80%)",
          }}
          className="lg:hidden absolute inset-0 z-10 pointer-events-none"
        />
      </div>

      <div className="relative z-20 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 items-center gap-6 sm:gap-10 lg:gap-12 lg:grid-cols-12">

          {/* Main Column: Enclosed in Soft Translucent White Card (rgba(255,255,255,0.55), blur 6px, 20px radius, max-width 620px) */}
          <div className="lg:col-span-8 flex justify-start">
            <div
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.55)",
                backdropFilter: "blur(6px)",
                WebkitBackdropFilter: "blur(6px)",
                borderRadius: "20px",
                maxWidth: "620px",
              }}
              className="p-5 sm:p-7 lg:p-8 border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.06)] w-full"
            >
              {/* 1. Top Badge: Light Green Background and Dark Green Text */}
              <div className="inline-flex items-center gap-2 rounded-xl bg-emerald-100 border border-emerald-200/90 px-3.5 py-1.5 text-[12px] sm:text-[13px] font-bold text-forest-deep mb-3 sm:mb-4 shadow-xs">
                <SunMedium className="h-3.5 w-3.5 text-emerald-600 flex-shrink-0" />
                <span>PM Surya Ghar Subsidy • 25-Yr Performance Warranty</span>
              </div>

              {/* Exactly One Single H1 for SEO: "Power Your Home with" Dark Green (text-forest-deep) + "Smarter Solar." Bright Green (text-emerald-600) with Thick Yellow Underline */}
              <h1 className="font-manrope text-[28px] xs:text-[34px] sm:text-[44px] lg:text-[54px] font-black leading-[1.14] sm:leading-[1.12] tracking-tight text-forest-deep">
                Power Your Home with{" "}
                <span className="relative inline-block text-emerald-600">
                  Smarter Solar.
                  <svg
                    className="absolute -bottom-1.5 sm:-bottom-2.5 left-0 w-full"
                    height="8"
                    viewBox="0 0 200 8"
                    fill="none"
                  >
                    <path
                      d="M1 5.5C50 1.5 150 1.5 199 5.5"
                      stroke="#F59E0B"
                      strokeWidth="5.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
              </h1>

              {/* Supporting Copy (Dark Grey, optimal reading width) */}
              <p className="mt-3 sm:mt-4 max-w-lg font-inter text-[14px] sm:text-[16px] lg:text-[18px] leading-relaxed text-slate-700 font-medium">
                Guaranteed savings. Tier-1 solar modules. End-to-end MNRE subsidy care.
              </p>

              {/* ── Mobile Dedicated Engineer Spotlight Card (Bright Sunlight feel) ── */}
              <div className="lg:hidden relative w-full aspect-[4/3] xs:aspect-[16/11] rounded-2xl overflow-hidden border border-slate-200/90 shadow-md bg-slate-100 my-4 group">
                <Image
                  src="/images/hero-solar-engineer-mobile.webp"
                  alt="AG POWER Certified Solar Engineer with Yellow Safety Helmet at Rooftop Solar Installation"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover object-[center_15%]"
                />
                {/* Floating Badges over mobile photo */}
                <div className="absolute top-2.5 right-2.5 inline-flex items-center gap-1.5 rounded-xl bg-white/90 backdrop-blur-md border border-white/60 px-2.5 py-1 text-[11px] font-extrabold text-slate-900 shadow-md">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Certified Engineer</span>
                </div>

                <div className="absolute bottom-2.5 inset-x-2.5 flex items-center justify-between rounded-xl bg-white/95 backdrop-blur-md border border-slate-200/80 px-3 py-2 text-slate-900 shadow-md">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[11.5px] font-bold text-slate-800">On-Site EPC Installation Team</span>
                  </div>
                  <span className="text-[11px] font-extrabold text-amber-600">★ 4.9/5 Rating</span>
                </div>
              </div>

              {/* ── 4. Tick-Point Pills: White Background, Light Green Border, Green Tick Icon, Soft Shadow (Single Row) ── */}
              <div className="mt-5 sm:mt-6 flex flex-wrap sm:flex-nowrap items-center gap-2 sm:gap-2.5">
                <div className="inline-flex items-center gap-1.5 sm:gap-2 rounded-xl bg-white border border-emerald-200/90 px-3 py-1.5 sm:px-3 sm:py-2 text-[12px] sm:text-[13px] font-semibold text-slate-800 shadow-xs transition-transform duration-200 hover:-translate-y-0.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                  <span>Up to 90% Bill Savings</span>
                </div>
                <div className="inline-flex items-center gap-1.5 sm:gap-2 rounded-xl bg-white border border-emerald-200/90 px-3 py-1.5 sm:px-3 sm:py-2 text-[12px] sm:text-[13px] font-semibold text-slate-800 shadow-xs transition-transform duration-200 hover:-translate-y-0.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                  <span>25-Yr Performance Warranty</span>
                </div>
                <div className="inline-flex items-center gap-1.5 sm:gap-2 rounded-xl bg-white border border-emerald-200/90 px-3 py-1.5 sm:px-3 sm:py-2 text-[12px] sm:text-[13px] font-semibold text-slate-800 shadow-xs transition-transform duration-200 hover:-translate-y-0.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                  <span>Govt Subsidy Support</span>
                </div>
              </div>

              {/* ── 5. Action Buttons: Green Filled + Yellow Filled Pair with Hover Lift Effect ── */}
              <div className="mt-5 sm:mt-7 grid grid-cols-2 sm:flex sm:flex-row items-center gap-3 sm:gap-4 w-full sm:w-auto">
                <LocalizedClientLink
                  href="/calculator"
                  className="group inline-flex min-h-[50px] sm:min-h-[54px] items-center justify-center rounded-xl bg-emerald-600 hover:bg-emerald-500 px-4 sm:px-7 font-inter text-[14px] sm:text-[15.5px] font-extrabold text-white shadow-[0_4px_16px_rgba(16,185,129,0.3)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(16,185,129,0.45)] active:scale-95 text-center leading-tight"
                >
                  <span>Calculate Savings</span>
                  <ArrowRight className="ml-1.5 sm:ml-2 h-4 w-4 sm:h-5 sm:w-5 text-white flex-shrink-0 transition-transform duration-200 group-hover:translate-x-1" />
                </LocalizedClientLink>

                <LocalizedClientLink
                  href="/contact"
                  className="inline-flex min-h-[50px] sm:min-h-[54px] items-center justify-center rounded-xl bg-amber-400 hover:bg-amber-300 px-4 sm:px-7 font-inter text-[14px] sm:text-[15.5px] font-extrabold text-forest-deep shadow-[0_4px_16px_rgba(245,158,11,0.25)] border border-amber-300 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(245,158,11,0.4)] active:scale-95 text-center leading-tight"
                >
                  Get Free Quote
                </LocalizedClientLink>
              </div>

              {/* ── Trust Footnote Streamlined ── */}
              <div className="mt-6 sm:mt-7 flex flex-wrap items-center gap-2.5 sm:gap-3 border-t border-slate-200/80 pt-3.5 sm:pt-4">
                <div className="inline-flex items-center gap-1.5 rounded-xl bg-white/90 border border-slate-200 px-3 py-1.5 text-[11.5px] sm:text-[12.5px] font-semibold text-slate-700 shadow-xs">
                  <ShieldCheck className="h-4 w-4 text-amber-500 flex-shrink-0" />
                  <span>MNRE Approved Partner</span>
                </div>
                <div className="inline-flex items-center gap-1.5 rounded-xl bg-white/90 border border-slate-200 px-3 py-1.5 text-[11.5px] sm:text-[12.5px] font-semibold text-slate-700 shadow-xs">
                  <Award className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                  <span>500+ Verified Rooftop Installations</span>
                </div>
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
