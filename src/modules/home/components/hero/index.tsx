"use client"

import Image from "next/image"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { SunMedium, ArrowRight, ShieldCheck, Award, CheckCircle2, Star } from "lucide-react"

export default function Hero() {
  return (
    <section className="relative min-h-[calc(100vh-64px)] lg:min-h-[calc(100vh-72px)] -mt-[64px] sm:-mt-[68px] lg:-mt-[72px] pt-[84px] sm:pt-[92px] lg:pt-[96px] pb-6 sm:pb-8 lg:pb-10 overflow-hidden max-w-full flex items-center bg-white text-slate-900">
      {/* ── Full-Bleed Background Image (Ultra-Sharp 2K Crystal-Clear WebP with Quality 95) ── */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero-solar-engineer-v3.webp"
          alt="AG POWER Certified Solar Engineer with Yellow Safety Helmet at Elevated Rooftop Solar Pergola Structure"
          fill
          priority
          quality={95}
          sizes="100vw"
          className="object-cover max-sm:object-left sm:object-[75%_center]"
        />
        {/* Desktop Left White Gradient — Clean fade to 0% at 45% width, leaving the entire engineer side 100% clear with zero haze or blur */}
        <div
          style={{
            background: "linear-gradient(90deg, rgba(255, 255, 255, 0.92) 0%, rgba(255, 255, 255, 0.65) 25%, rgba(255, 255, 255, 0) 45%)",
          }}
          className="hidden lg:block absolute inset-0 z-10 pointer-events-none"
        />

        {/* Mobile Scrim — Subtle ambient gradient without washing out the photo */}
        <div
          style={{
            background: "linear-gradient(180deg, rgba(255, 255, 255, 0.90) 0%, rgba(255, 255, 255, 0.35) 25%, rgba(255, 255, 255, 0) 45%)",
          }}
          className="lg:hidden absolute inset-0 z-10 pointer-events-none"
        />
      </div>

      <div className="relative z-20 mx-auto max-w-7xl px-3.5 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 items-center gap-6 sm:gap-8 lg:gap-10 lg:grid-cols-12">

          {/* Main Column: Enclosed in Soft Translucent White Card (Crisp on Mobile, Translucent on Desktop) */}
          <div className="lg:col-span-8 flex justify-start w-full">
            <div
              style={{
                borderRadius: "24px",
                maxWidth: "570px",
              }}
              className="p-4 sm:p-6 lg:p-7 border border-white/80 bg-white/94 sm:bg-white/70 backdrop-blur-md shadow-[0_8px_30px_rgba(0,0,0,0.06),0_2px_8px_rgba(0,0,0,0.04)] w-full"
            >
              {/* 1. Top Badge: Light Green Background and Dark Green Text */}
              <div className="inline-flex items-center gap-1.5 sm:gap-2 rounded-xl bg-emerald-100 border border-emerald-200/90 px-2.5 py-1 sm:px-3.5 sm:py-1.5 text-[11px] xs:text-[12px] sm:text-[13px] font-bold text-forest-deep mb-2 sm:mb-3 shadow-xs">
                <SunMedium className="h-3.5 w-3.5 text-emerald-600 flex-shrink-0" />
                <span className="line-clamp-1">PM Surya Ghar Subsidy • 25-Yr Performance Warranty</span>
              </div>

              {/* Exactly One Single H1 for SEO: Clamp font size for mobile, desktop unchanged */}
              <h1 className="font-manrope text-[clamp(28px,7.5vw,38px)] sm:text-[40px] lg:text-[48px] font-black leading-[1.15] sm:leading-[1.12] tracking-tight text-forest-deep">
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

              {/* Supporting Copy (Dark Grey, Max-Width 440px on Desktop to prevent orphan word 'care.') */}
              <p className="mt-2.5 sm:mt-3 max-w-[480px] lg:max-w-[440px] font-inter text-[15px] sm:text-[15.5px] lg:text-[16.5px] leading-[1.5] text-slate-700 font-medium">
                Guaranteed savings. Tier-1 solar modules. End-to-end MNRE subsidy care.
              </p>

              {/* ── Mobile Dedicated Engineer Spotlight Card (Ultra-Sharp Crystal-Clear Mobile v3) ── */}
              <div className="lg:hidden relative w-full aspect-[16/9] xs:aspect-[16/10] max-h-[190px] rounded-xl overflow-hidden border border-slate-200/90 shadow-sm bg-slate-100 my-3 group">
                <Image
                  src="/images/hero-solar-engineer-mobile-v3.webp"
                  alt="AG POWER Certified Solar Engineer with Yellow Safety Helmet at Rooftop Solar Installation"
                  fill
                  priority
                  quality={95}
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover object-center"
                />
                {/* Compact Chip at Top-Left Edge (12px, leaves engineer face 100% unobstructed) */}
                <div className="absolute top-1.5 left-1.5 inline-flex items-center gap-1 rounded-md bg-white/95 backdrop-blur-md border border-white/70 px-2 py-0.5 text-[12px] font-extrabold text-slate-900 shadow-xs">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 flex-shrink-0" />
                  <span>Certified Engineer</span>
                </div>

                {/* Compact Rating Strip at Bottom Edge (12px) */}
                <div className="absolute bottom-1.5 inset-x-1.5 flex items-center justify-between rounded-md bg-white/95 backdrop-blur-md border border-slate-200/80 px-2.5 py-1 text-slate-900 shadow-xs">
                  <div className="flex items-center gap-1.5">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse flex-shrink-0" />
                    <span className="text-[12px] font-bold text-slate-800">On-Site EPC Team</span>
                  </div>
                  <span className="inline-flex items-center gap-1 text-[12px] font-extrabold text-amber-600">
                    <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500 flex-shrink-0" />
                    <span>4.9 Rating</span>
                  </span>
                </div>
              </div>

              {/* ── 4. Tick-Point Items: 2 rows flex-wrap on mobile, text never cut off ── */}
              <div className="mt-3 sm:mt-4 flex flex-wrap sm:flex-nowrap items-center gap-1.5 sm:gap-2">
                <div className="inline-flex items-center gap-1.5 rounded-xl bg-white/95 border border-emerald-200/90 px-2.5 py-1 sm:px-3 sm:py-1.5 text-[12.5px] sm:text-[14.5px] font-semibold text-slate-800 shadow-xs whitespace-nowrap">
                  <CheckCircle2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-emerald-600 flex-shrink-0" />
                  <span>Up to 90% Savings</span>
                </div>
                <div className="inline-flex items-center gap-1.5 rounded-xl bg-white/95 border border-emerald-200/90 px-2.5 py-1 sm:px-3 sm:py-1.5 text-[12.5px] sm:text-[14.5px] font-semibold text-slate-800 shadow-xs whitespace-nowrap">
                  <CheckCircle2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-emerald-600 flex-shrink-0" />
                  <span>25-Yr Warranty</span>
                </div>
                <div className="inline-flex items-center gap-1.5 rounded-xl bg-white/95 border border-emerald-200/90 px-2.5 py-1 sm:px-3 sm:py-1.5 text-[12.5px] sm:text-[14.5px] font-semibold text-slate-800 shadow-xs whitespace-nowrap">
                  <CheckCircle2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-emerald-600 flex-shrink-0" />
                  <span>Govt Subsidy</span>
                </div>
              </div>

              {/* ── 5. Action Buttons: Stacked on mobile with 12px gap, side-by-side on tablet/desktop ── */}
              <div className="mt-3.5 sm:mt-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 w-full sm:w-auto">
                <LocalizedClientLink
                  href="/calculator"
                  style={{
                    boxShadow: "0 4px 18px rgba(22, 163, 74, 0.35)",
                  }}
                  className="group inline-flex min-h-[48px] sm:min-h-[52px] items-center justify-center rounded-xl bg-emerald-600 hover:bg-emerald-500 hover:shadow-[0_6px_26px_rgba(22,163,74,0.45)] px-5 sm:px-7 py-3 sm:py-3.5 font-inter text-[15px] sm:text-[15.5px] font-extrabold text-white transition-all duration-300 hover:-translate-y-0.5 active:scale-95 text-center leading-normal whitespace-nowrap w-full sm:w-auto"
                >
                  <span className="leading-none">Calculate Savings</span>
                  <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 text-white flex-shrink-0 transition-transform duration-200 group-hover:translate-x-1" />
                </LocalizedClientLink>

                <LocalizedClientLink
                  href="/contact"
                  className="inline-flex min-h-[48px] sm:min-h-[52px] items-center justify-center rounded-xl bg-white hover:bg-emerald-50/70 border-[1.5px] border-emerald-600 px-5 sm:px-7 py-3 sm:py-3.5 font-inter text-[15px] sm:text-[15.5px] font-extrabold text-emerald-700 shadow-xs transition-all duration-300 hover:-translate-y-0.5 hover:border-emerald-700 active:scale-95 text-center leading-normal whitespace-nowrap w-full sm:w-auto"
                >
                  <span className="leading-none">Get Free Quote</span>
                </LocalizedClientLink>
              </div>

              {/* ── Trust Footnote Streamlined ── */}
              <div className="mt-4 sm:mt-6 flex flex-wrap items-center gap-2.5 sm:gap-3 border-t border-slate-200/80 pt-3 sm:pt-3.5">
                <div className="inline-flex items-center gap-1.5 rounded-xl bg-white/90 border border-slate-200 px-3 py-1.5 text-[11.5px] sm:text-[12.5px] font-semibold text-slate-700 shadow-xs">
                  <ShieldCheck className="h-4 w-4 text-amber-500 flex-shrink-0" />
                  <span>MNRE Approved Partner</span>
                </div>
                <div className="inline-flex items-center gap-1.5 rounded-xl bg-white/90 border border-slate-200 px-3 py-1.5 text-[11.5px] sm:text-[12.5px] font-semibold text-slate-700 shadow-xs">
                  <Award className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                  <span>500+ Verified Installations</span>
                </div>
              </div>

            </div>
          </div>

          {/* Right Column: Small White Floating Card Near Engineer with Yellow Star and '4.9 Rating' */}
          <div className="hidden lg:flex lg:col-span-4 flex-col justify-end items-end h-full pb-10 pr-6">
            <div
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.95)",
                backdropFilter: "blur(8px)",
                WebkitBackdropFilter: "blur(8px)",
                borderRadius: "14px",
              }}
              className="inline-flex items-center gap-2 px-3.5 py-2 border border-slate-100 shadow-[0_8px_24px_rgba(0,0,0,0.12)] transition-transform duration-300 hover:scale-105"
            >
              <Star className="h-4 w-4 text-amber-400 fill-amber-400 flex-shrink-0" />
              <span className="font-manrope text-[14px] font-extrabold text-slate-900 whitespace-nowrap">
                4.9 Rating
              </span>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
