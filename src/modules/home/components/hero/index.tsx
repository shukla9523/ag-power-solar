"use client"

import Image from "next/image"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { SunMedium, ArrowRight, ShieldCheck, Award, CheckCircle2, Star } from "lucide-react"

export default function Hero() {
  return (
    <section className="relative min-h-[calc(100vh-64px)] lg:min-h-[calc(100vh-72px)] -mt-[64px] sm:-mt-[68px] lg:-mt-[72px] pt-[84px] sm:pt-[92px] lg:pt-[96px] pb-6 sm:pb-8 lg:pb-10 overflow-hidden max-w-full flex items-center bg-gradient-to-b from-white to-green-light md:bg-white text-slate-900">
      {/* ── Full-Bleed Background Image (Desktop Only: Hidden on Mobile as per prompt) ── */}
      <div className="hidden md:block absolute inset-0 z-0">
        <Image
          src="/images/hero-solar-engineer-v3.webp"
          alt="AG POWER Certified Solar Engineer with Yellow Safety Helmet at Elevated Rooftop Solar Pergola Structure"
          fill
          priority
          quality={95}
          sizes="100vw"
          className="object-cover object-[75%_center]"
        />
        {/* Desktop Left White Gradient — Clean fade to 0% at 45% width, leaving the entire engineer side 100% clear with zero haze or blur */}
        <div
          style={{
            background: "linear-gradient(90deg, rgba(255, 255, 255, 0.92) 0%, rgba(255, 255, 255, 0.65) 25%, rgba(255, 255, 255, 0) 45%)",
          }}
          className="hidden lg:block absolute inset-0 z-10 pointer-events-none"
        />

        {/* Tablet Scrim */}
        <div
          style={{
            background: "linear-gradient(180deg, rgba(255, 255, 255, 0.90) 0%, rgba(255, 255, 255, 0.35) 25%, rgba(255, 255, 255, 0) 45%)",
          }}
          className="hidden md:block lg:hidden absolute inset-0 z-10 pointer-events-none"
        />
      </div>

      <div className="relative z-20 mx-auto max-w-7xl px-3.5 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 items-center gap-6 sm:gap-8 lg:gap-10 lg:grid-cols-12">

          {/* Main Column: Enclosed in Card (Solid White with Clean Border/Shadow on Mobile, Translucent on Desktop) */}
          <div className="lg:col-span-8 flex justify-start w-full">
            <div
              style={{
                borderRadius: "24px",
                maxWidth: "570px",
              }}
              className="p-4 sm:p-6 lg:p-7 border border-card-border md:border-white/80 bg-white md:bg-white/70 backdrop-blur-none md:backdrop-blur-md shadow-[0_8px_24px_rgba(11,79,60,0.10)] md:shadow-[0_8px_30px_rgba(0,0,0,0.06),0_2px_8px_rgba(0,0,0,0.04)] w-full"
            >
              {/* 1. Top Badge: Soft Yellow on Mobile (bg-pill-yellow) with Green Dot (bg-green-main), Light Green on Desktop */}
              <div className="inline-flex items-center gap-1.5 sm:gap-2 rounded-xl bg-pill-yellow md:bg-emerald-100 border border-pill-yellow-border md:border-emerald-200/90 px-2.5 py-1 sm:px-3.5 sm:py-1.5 text-[11px] md:text-[13px] font-bold text-green-dark md:text-forest-deep mb-2 sm:mb-3 shadow-xs">
                <span className="h-2 w-2 rounded-full bg-green-main flex-shrink-0 md:hidden" />
                <SunMedium className="hidden md:block h-3.5 w-3.5 text-emerald-600 flex-shrink-0" />
                <span className="line-clamp-1">PM Surya Ghar Subsidy • 25-Yr Performance Warranty</span>
              </div>

              {/* Exactly One Single H1 for SEO: Dark green on mobile, clamp font size */}
              <h1 className="font-manrope text-[clamp(27px,7.2vw,36px)] sm:text-[40px] lg:text-[48px] font-black leading-[1.15] sm:leading-[1.12] tracking-tight text-green-dark md:text-forest-deep">
                Power Your Home with{" "}
                <span className="relative inline-block text-emerald-600">
                  Smarter Solar.
                  <svg
                    className="absolute -bottom-1 sm:-bottom-2.5 left-0 w-full"
                    height="8"
                    viewBox="0 0 200 8"
                    fill="none"
                  >
                    <path
                      d="M1 5.5C50 1.5 150 1.5 199 5.5"
                      stroke="var(--yellow)"
                      strokeWidth="4"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
              </h1>

              {/* Supporting Copy: Dark green-grey on mobile (text-subtext-dark) */}
              <p className="mt-2 sm:mt-3 max-w-[480px] lg:max-w-[440px] font-inter text-[15px] sm:text-[15.5px] lg:text-[16.5px] leading-[1.5] text-subtext-dark md:text-slate-700 font-medium">
                Guaranteed savings. Tier-1 solar modules. End-to-end MNRE subsidy care.
              </p>

              {/* ── Mobile Dedicated Photo Area: Height 195px, Top-Center alignment, Single 4.9 Rating Pill ── */}
              <div className="lg:hidden relative w-full h-[195px] rounded-[16px] overflow-hidden border border-card-border shadow-xs my-3 bg-slate-50">
                <Image
                  src="/images/hero-solar-engineer-mobile-v3.webp"
                  alt="AG POWER Certified Solar Engineer with Yellow Safety Helmet at Rooftop Solar Installation"
                  fill
                  priority
                  quality={95}
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover object-[top_center]"
                />

                {/* Rating pill bottom-right: white bg, yellow star, dark green text */}
                <div className="absolute bottom-2.5 right-2.5 inline-flex items-center gap-1 rounded-lg bg-white px-2.5 py-1 text-[12px] font-extrabold text-green-dark shadow-sm border border-card-border">
                  <Star className="h-3.5 w-3.5 fill-sun-yellow text-sun-yellow flex-shrink-0" />
                  <span>4.9 Rating</span>
                </div>
              </div>

              {/* ── 3. CHIPS: 3 Equal Columns on Mobile Grid (bg-green-light, border-chip-border, text-green-dark, text-green-main icon) ── */}
              <div className="mt-3 sm:mt-4 grid grid-cols-3 gap-[6px] md:flex md:flex-nowrap md:gap-2">
                <div className="inline-flex items-center justify-center gap-1 rounded-lg bg-green-light md:bg-white/95 border border-chip-border md:border-emerald-200/90 py-1.5 px-1 md:px-3 md:py-1.5 text-[11px] sm:text-[12px] md:text-[14.5px] font-bold text-green-dark md:text-slate-800 shadow-xs whitespace-nowrap text-center">
                  <CheckCircle2 className="h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4 text-green-main flex-shrink-0" />
                  <span>90% Savings</span>
                </div>
                <div className="inline-flex items-center justify-center gap-1 rounded-lg bg-green-light md:bg-white/95 border border-chip-border md:border-emerald-200/90 py-1.5 px-1 md:px-3 md:py-1.5 text-[11px] sm:text-[12px] md:text-[14.5px] font-bold text-green-dark md:text-slate-800 shadow-xs whitespace-nowrap text-center">
                  <CheckCircle2 className="h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4 text-green-main flex-shrink-0" />
                  <span>25-Yr Warranty</span>
                </div>
                <div className="inline-flex items-center justify-center gap-1 rounded-lg bg-green-light md:bg-white/95 border border-chip-border md:border-emerald-200/90 py-1.5 px-1 md:px-3 md:py-1.5 text-[11px] sm:text-[12px] md:text-[14.5px] font-bold text-green-dark md:text-slate-800 shadow-xs whitespace-nowrap text-center">
                  <CheckCircle2 className="h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4 text-green-main flex-shrink-0" />
                  <span>Govt Subsidy</span>
                </div>
              </div>

              {/* ── 5. Action Buttons: Height 48px, Radius 12px, Stacked on Mobile, Above Fold ── */}
              <div className="mt-3.5 sm:mt-6 flex flex-col md:flex-row items-stretch md:items-center gap-3 sm:gap-4 w-full md:w-auto">
                <LocalizedClientLink
                  href="/calculator"
                  className="group inline-flex h-[48px] min-h-[48px] md:min-h-[52px] items-center justify-center rounded-xl bg-green-dark md:bg-emerald-600 hover:bg-forest-deep md:hover:bg-emerald-500 hover:shadow-[0_6px_26px_rgba(22,163,74,0.45)] px-5 sm:px-7 font-inter text-[15px] sm:text-[15.5px] font-extrabold text-white transition-all duration-200 active:scale-[0.97] text-center leading-normal whitespace-nowrap w-full md:w-auto shadow-[0_4px_14px_rgba(11,79,60,0.25)]"
                >
                  <span className="leading-none">Calculate Savings</span>
                  <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 text-white flex-shrink-0 transition-transform duration-200 group-hover:translate-x-1" />
                </LocalizedClientLink>

                <LocalizedClientLink
                  href="/contact"
                  className="inline-flex h-[48px] min-h-[48px] md:min-h-[52px] items-center justify-center rounded-xl bg-white hover:bg-emerald-50/70 border-[1.5px] border-green-dark md:border-emerald-600 px-5 sm:px-7 font-inter text-[15px] sm:text-[15.5px] font-extrabold text-green-dark md:text-emerald-700 shadow-xs transition-all duration-200 active:scale-[0.97] text-center leading-normal whitespace-nowrap w-full md:w-auto"
                >
                  <span className="leading-none">Get Free Quote</span>
                </LocalizedClientLink>
              </div>

              {/* ── 6. Footer Pills: 2 Equal Columns on Mobile (bg-green-light, text-green-dark, Green Icons) ── */}
              <div className="mt-3.5 sm:mt-6 grid grid-cols-2 gap-2 md:flex md:flex-wrap md:gap-3 border-t border-card-border md:border-slate-200/80 pt-3 sm:pt-3.5">
                <div className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-green-light md:bg-white/90 border border-card-border md:border-slate-200 px-2 py-1.5 md:px-3 text-[11px] md:text-[12.5px] font-semibold text-green-dark md:text-slate-700 shadow-xs text-center">
                  <ShieldCheck className="h-3.5 w-3.5 text-green-main md:text-amber-500 flex-shrink-0" />
                  <span className="truncate">MNRE Approved</span>
                </div>
                <div className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-green-light md:bg-white/90 border border-card-border md:border-slate-200 px-2 py-1.5 md:px-3 text-[11px] md:text-[12.5px] font-semibold text-green-dark md:text-slate-700 shadow-xs text-center">
                  <Award className="h-3.5 w-3.5 text-green-main md:text-emerald-600 flex-shrink-0" />
                  <span className="truncate">500+ Verified Installs</span>
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
