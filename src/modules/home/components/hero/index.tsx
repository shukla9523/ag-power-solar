"use client"

import Image from "next/image"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { SunMedium, ArrowRight, ShieldCheck, Award, CheckCircle2, Star } from "lucide-react"

export default function Hero() {
  return (
    <section className="relative min-h-[calc(100vh-64px)] lg:min-h-[calc(100vh-72px)] -mt-[64px] sm:-mt-[68px] lg:-mt-[72px] pt-[88px] sm:pt-[92px] lg:pt-[96px] pb-6 sm:pb-8 lg:pb-10 overflow-hidden flex items-center bg-white text-slate-900">
      {/* ── Full-Bleed Background Image (Clear, Unfiltered, 75% Center Position for Full Engineer Visibility) ── */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero-solar-engineer-v2.webp"
          alt="AG POWER Certified Solar Engineer with Yellow Safety Helmet at Elevated Rooftop Solar Pergola Structure"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[75%_center]"
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
        <div className="grid grid-cols-1 items-center gap-6 sm:gap-8 lg:gap-10 lg:grid-cols-12">

          {/* Main Column: Enclosed in Soft Translucent White Card (rgba(255,255,255,0.70), blur 8px, 24px radius, max-width 570px) */}
          <div className="lg:col-span-8 flex justify-start">
            <div
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.70)",
                backdropFilter: "blur(8px)",
                WebkitBackdropFilter: "blur(8px)",
                borderRadius: "24px",
                maxWidth: "570px",
              }}
              className="p-5 sm:p-6 lg:p-7 border border-white/70 shadow-[0_8px_30px_rgba(0,0,0,0.06),0_2px_8px_rgba(0,0,0,0.04)] w-full"
            >
              {/* 1. Top Badge: Light Green Background and Dark Green Text */}
              <div className="inline-flex items-center gap-2 rounded-xl bg-emerald-100 border border-emerald-200/90 px-3.5 py-1.5 text-[12px] sm:text-[13px] font-bold text-forest-deep mb-2.5 sm:mb-3 shadow-xs">
                <SunMedium className="h-3.5 w-3.5 text-emerald-600 flex-shrink-0" />
                <span>PM Surya Ghar Subsidy • 25-Yr Performance Warranty</span>
              </div>

              {/* Exactly One Single H1 for SEO: "Power Your Home with" Dark Green (text-forest-deep) + "Smarter Solar." Bright Green (text-emerald-600) with Thick Yellow Underline */}
              <h1 className="font-manrope text-[26px] xs:text-[32px] sm:text-[40px] lg:text-[48px] font-black leading-[1.15] sm:leading-[1.12] tracking-tight text-forest-deep">
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

              {/* Supporting Copy (Dark Grey, Max-Width 480px) */}
              <p className="mt-2.5 sm:mt-3 max-w-[480px] font-inter text-[14px] sm:text-[15.5px] lg:text-[16.5px] leading-relaxed text-slate-700 font-medium">
                Guaranteed savings. Tier-1 solar modules. End-to-end MNRE subsidy care.
              </p>

              {/* ── Mobile Dedicated Engineer Spotlight Card (Bright Sunlight feel) ── */}
              <div className="lg:hidden relative w-full aspect-[4/3] xs:aspect-[16/11] rounded-2xl overflow-hidden border border-slate-200/90 shadow-md bg-slate-100 my-3.5 group">
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
                  <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-amber-600">
                    <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                    <span>4.9 Rating</span>
                  </span>
                </div>
              </div>

              {/* ── 4. Tick-Point Items: Compact Pills on Single Line (Font 15px, Nowrap) ── */}
              <div className="mt-3.5 sm:mt-4 flex items-center gap-1.5 sm:gap-2 flex-nowrap overflow-x-auto sm:overflow-visible">
                <div className="inline-flex items-center gap-1 sm:gap-1.5 rounded-xl bg-white/90 border border-emerald-200/90 px-2.5 py-1 sm:px-3 sm:py-1.5 text-[13px] sm:text-[15px] font-semibold text-slate-800 shadow-xs whitespace-nowrap">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                  <span>Up to 90% Savings</span>
                </div>
                <div className="inline-flex items-center gap-1 sm:gap-1.5 rounded-xl bg-white/90 border border-emerald-200/90 px-2.5 py-1 sm:px-3 sm:py-1.5 text-[13px] sm:text-[15px] font-semibold text-slate-800 shadow-xs whitespace-nowrap">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                  <span>25-Yr Warranty</span>
                </div>
                <div className="inline-flex items-center gap-1 sm:gap-1.5 rounded-xl bg-white/90 border border-emerald-200/90 px-2.5 py-1 sm:px-3 sm:py-1.5 text-[13px] sm:text-[15px] font-semibold text-slate-800 shadow-xs whitespace-nowrap">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                  <span>Govt Subsidy</span>
                </div>
              </div>

              {/* ── 5. Action Buttons: Primary Green (#16A34A) + Secondary White with Green 1.5px Border ── */}
              <div className="mt-4 sm:mt-6 grid grid-cols-2 sm:flex sm:flex-row items-center gap-3 sm:gap-4 w-full sm:w-auto">
                <LocalizedClientLink
                  href="/calculator"
                  style={{
                    boxShadow: "0 4px 18px rgba(22, 163, 74, 0.35)",
                  }}
                  className="group inline-flex min-h-[48px] sm:min-h-[52px] items-center justify-center rounded-xl bg-emerald-600 hover:bg-emerald-500 hover:shadow-[0_6px_26px_rgba(22,163,74,0.45)] px-4 sm:px-7 font-inter text-[14px] sm:text-[15.5px] font-extrabold text-white transition-all duration-300 hover:-translate-y-0.5 active:scale-95 text-center leading-tight"
                >
                  <span>Calculate Savings</span>
                  <ArrowRight className="ml-1.5 sm:ml-2 h-4 w-4 sm:h-5 sm:w-5 text-white flex-shrink-0 transition-transform duration-200 group-hover:translate-x-1" />
                </LocalizedClientLink>

                <LocalizedClientLink
                  href="/contact"
                  className="inline-flex min-h-[48px] sm:min-h-[52px] items-center justify-center rounded-xl bg-white hover:bg-emerald-50/70 border-[1.5px] border-emerald-600 px-4 sm:px-7 font-inter text-[14px] sm:text-[15.5px] font-extrabold text-emerald-700 shadow-xs transition-all duration-300 hover:-translate-y-0.5 hover:border-emerald-700 active:scale-95 text-center leading-tight"
                >
                  Get Free Quote
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
