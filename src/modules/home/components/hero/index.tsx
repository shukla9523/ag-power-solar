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
            
            {/* 1. Glassmorphic Eyebrow Badge (12px radius) */}
            <div
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.08)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                border: "1px solid rgba(255, 255, 255, 0.15)",
              }}
              className="inline-flex items-center gap-2 rounded-xl px-3.5 py-1.5 text-[11.5px] sm:text-[13px] font-bold text-emerald-300 mb-3 shadow-[0_4px_20px_rgba(0,0,0,0.25)]"
            >
              <SunMedium className="h-3.5 w-3.5 text-emerald-400 flex-shrink-0" />
              <span>PM Surya Ghar Subsidy • 25-Yr Performance Warranty</span>
            </div>

            {/* Exactly One Single H1 for SEO & Performance Guards with Soft Glow */}
            <h1 className="font-manrope text-[24px] xs:text-[28px] sm:text-[44px] lg:text-[58px] font-black leading-[1.16] sm:leading-[1.12] tracking-tight text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)]">
              Power Your Home with{" "}
              <span className="relative inline-block text-emerald-400 drop-shadow-[0_0_30px_rgba(16,185,129,0.55)]">
                {/* Soft Emerald Glow Aura behind text */}
                <span
                  className="absolute -inset-x-3 -inset-y-1 bg-emerald-500/25 blur-xl rounded-xl -z-10 pointer-events-none"
                  aria-hidden="true"
                />
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

            {/* ── Mobile Dedicated Engineer Spotlight Card (16px radius, layered shadow) ── */}
            <div className="lg:hidden relative w-full aspect-[4/3] xs:aspect-[16/11] rounded-2xl overflow-hidden border border-white/20 shadow-[0_16px_40px_-6px_rgba(0,0,0,0.7),0_4px_16px_rgba(0,0,0,0.4)] bg-slate-900 my-3.5 group">
              <Image
                src="/images/hero-solar-engineer-mobile.webp"
                alt="AG POWER Certified Solar Engineer with Yellow Safety Helmet at Rooftop Solar Installation"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-[center_15%] brightness-[1.03] contrast-[1.02]"
              />
              {/* Floating Glassmorphic Trust Badges over photo (12px radius) */}
              <div
                style={{
                  backgroundColor: "rgba(2, 6, 23, 0.75)",
                  backdropFilter: "blur(12px)",
                  WebkitBackdropFilter: "blur(12px)",
                  border: "1px solid rgba(255, 255, 255, 0.18)",
                }}
                className="absolute top-2.5 right-2.5 inline-flex items-center gap-1.5 rounded-xl px-2.5 py-1 text-[11px] font-extrabold text-white shadow-lg"
              >
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                <span>Certified Engineer</span>
              </div>

              <div
                style={{
                  backgroundColor: "rgba(2, 6, 23, 0.8)",
                  backdropFilter: "blur(12px)",
                  WebkitBackdropFilter: "blur(12px)",
                  border: "1px solid rgba(255, 255, 255, 0.18)",
                }}
                className="absolute bottom-2.5 inset-x-2.5 flex items-center justify-between rounded-xl px-3 py-2 text-white shadow-lg"
              >
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[11.5px] font-bold text-slate-100">On-Site EPC Installation Team</span>
                </div>
                <span className="text-[11px] font-extrabold text-amber-300">★ 4.9/5 Rating</span>
              </div>
            </div>

            {/* ── 1. Glassmorphism Value Highlights (12px radius, depth & blur) ── */}
            <div className="mt-4 sm:mt-7 flex flex-wrap items-center gap-2 sm:gap-3">
              <div
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.08)",
                  backdropFilter: "blur(12px)",
                  WebkitBackdropFilter: "blur(12px)",
                  border: "1px solid rgba(255, 255, 255, 0.15)",
                }}
                className="inline-flex items-center gap-1.5 sm:gap-2 rounded-xl px-3 py-1.5 sm:px-4 sm:py-2 text-[12px] sm:text-[14px] font-bold text-white shadow-[0_4px_20px_rgba(0,0,0,0.25)] transition-transform duration-200 hover:scale-[1.02]"
              >
                <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                <span>Up to 90% Bill Savings</span>
              </div>
              <div
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.08)",
                  backdropFilter: "blur(12px)",
                  WebkitBackdropFilter: "blur(12px)",
                  border: "1px solid rgba(255, 255, 255, 0.15)",
                }}
                className="inline-flex items-center gap-1.5 sm:gap-2 rounded-xl px-3 py-1.5 sm:px-4 sm:py-2 text-[12px] sm:text-[14px] font-bold text-white shadow-[0_4px_20px_rgba(0,0,0,0.25)] transition-transform duration-200 hover:scale-[1.02]"
              >
                <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                <span>25-Yr Performance Warranty</span>
              </div>
              <div
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.08)",
                  backdropFilter: "blur(12px)",
                  WebkitBackdropFilter: "blur(12px)",
                  border: "1px solid rgba(255, 255, 255, 0.15)",
                }}
                className="inline-flex items-center gap-1.5 sm:gap-2 rounded-xl px-3 py-1.5 sm:px-4 sm:py-2 text-[12px] sm:text-[14px] font-bold text-white shadow-[0_4px_20px_rgba(0,0,0,0.25)] transition-transform duration-200 hover:scale-[1.02]"
              >
                <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                <span>Govt Subsidy Support</span>
              </div>
            </div>

            {/* ── 2 & 4. Action Buttons with Soft Glow & Consistent 12px Radius ── */}
            <div className="mt-5 sm:mt-8 grid grid-cols-2 sm:flex sm:flex-row items-center gap-2.5 sm:gap-4 w-full sm:w-auto">
              <LocalizedClientLink
                href="/calculator"
                style={{
                  boxShadow: "0 0 30px rgba(16, 185, 129, 0.4)",
                }}
                className="group inline-flex min-h-[46px] sm:min-h-[52px] items-center justify-center rounded-xl bg-emerald-600 hover:bg-emerald-500 hover:shadow-[0_0_38px_rgba(16,185,129,0.6)] px-4 sm:px-8 font-inter text-[14px] sm:text-[16px] font-extrabold text-white transition-all duration-300 hover:-translate-y-0.5 active:scale-95 text-center leading-tight"
              >
                <span>Calculate Savings</span>
                <ArrowRight className="ml-1.5 sm:ml-2 h-4 w-4 sm:h-5 sm:w-5 text-white flex-shrink-0 transition-transform duration-200 group-hover:translate-x-1" />
              </LocalizedClientLink>

              <LocalizedClientLink
                href="/contact"
                className="inline-flex min-h-[46px] sm:min-h-[52px] items-center justify-center rounded-xl bg-white hover:bg-slate-100 px-3.5 sm:px-7 font-inter text-[14px] sm:text-[16px] font-bold text-slate-950 shadow-[0_4px_16px_rgba(0,0,0,0.15),0_1px_3px_rgba(0,0,0,0.08)] border border-slate-200/90 transition-all duration-300 hover:-translate-y-0.5 active:scale-95 text-center leading-tight"
              >
                Get Free Quote
              </LocalizedClientLink>
            </div>

            {/* ── 1 & 4. Trust Footnote with Glassmorphism & Consistent 12px Radius ── */}
            <div className="mt-5 sm:mt-8 flex flex-wrap items-center gap-2.5 sm:gap-4 border-t border-white/15 pt-3.5 sm:pt-4">
              <div
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.06)",
                  backdropFilter: "blur(12px)",
                  WebkitBackdropFilter: "blur(12px)",
                  border: "1px solid rgba(255, 255, 255, 0.15)",
                }}
                className="inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-[11.5px] sm:text-[13px] font-semibold text-slate-100 shadow-sm"
              >
                <ShieldCheck className="h-4 w-4 text-amber-400 flex-shrink-0" />
                <span>MNRE Approved Components</span>
              </div>
              <div
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.06)",
                  backdropFilter: "blur(12px)",
                  WebkitBackdropFilter: "blur(12px)",
                  border: "1px solid rgba(255, 255, 255, 0.15)",
                }}
                className="inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-[11.5px] sm:text-[13px] font-semibold text-slate-100 shadow-sm"
              >
                <Award className="h-4 w-4 text-amber-400 flex-shrink-0" />
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
