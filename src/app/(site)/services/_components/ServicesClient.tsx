"use client"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { SunMedium, Home, Building2, Users2, ArrowRight, ShieldCheck, Zap, Calculator, CheckCircle2 } from "lucide-react"
import type { Service } from "@lib/data/services"

interface Props {
  services: Service[]
}

const solarCategories = [
  {
    title: "Residential Solar",
    slug: "residential-solar",
    icon: Home,
    badge: "1 kW to 10 kW · PM Surya Ghar Subsidy",
    headline: "Clean Energy Independence for Homeowners",
    desc: "Engineered rooftop solar installations for independent homes, kothis, and villas. Cut electricity bills by up to 90% and claim up to ₹78,000 central subsidy directly.",
    highlights: [
      "Custom 3D shadow analysis to maximize rooftop irradiance",
      "PM Surya Ghar subsidy filing and bank account disbursement",
      "Bi-directional DISCOM net-metering synchronization",
      "25-year performance warranty with zero roof damage",
    ],
    cta: "Explore Residential Solar",
    calcCta: "Calculate Home Savings",
    calcUrl: "/calculator?cat=residential",
  },
  {
    title: "Commercial & Industrial Solar",
    slug: "commercial-solar",
    icon: Building2,
    badge: "10 kW to 500+ kW · 40% Tax Depreciation",
    headline: "High-Yield Solar Power for Enterprises",
    desc: "Capitalize on high commercial power tariffs with turnkey rooftop solar plants. Achieve full capital payback in 2.5 to 4 years and claim 40% accelerated depreciation.",
    highlights: [
      "Designed for factories, warehouses, cold storage & office buildings",
      "Non-penetrating mounting clamps for trapezoidal & curved tin roofs",
      "Significant tax savings via Section 32 Accelerated Depreciation",
      "Remote SCADA string monitoring with real-time generation tracking",
    ],
    cta: "Explore Commercial Solar",
    calcCta: "Calculate Commercial ROI",
    calcUrl: "/calculator?cat=commercial",
  },
  {
    title: "Housing Society Solar",
    slug: "housing-society-solar",
    icon: Users2,
    badge: "15 kW to 100+ kW · Common Area Offsetting",
    headline: "Solar Energy for RWAs & Apartment Complexes",
    desc: "Power elevators, water pumping systems, basement lighting, and clubhouses with clean energy. Slash common monthly maintenance fees without burdening residents.",
    highlights: [
      "Powers heavy inductive loads including lifts and water pumps",
      "Turnkey assistance for RWA General Body presentations & voting",
      "Elevated structure designs retaining 100% usable terrace space",
      "Bulk DISCOM net-metering documentation and approvals",
    ],
    cta: "Explore Society Solar",
    calcCta: "Calculate Society Savings",
    calcUrl: "/calculator?cat=society",
  },
]

export default function ServicesClient({ services }: Props) {
  return (
    <div className="bg-ivory min-h-screen">
      
      {/* Services Hero Banner */}
      <section className="relative overflow-hidden bg-forest py-16 text-white sm:py-20 lg:py-24">
        <div className="pointer-events-none absolute -top-40 right-0 h-96 w-96 rounded-full bg-gold/15 blur-3xl" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="font-manrope text-[36px] font-extrabold tracking-tight sm:text-[50px] lg:text-[56px]">
              Turnkey Solar Energy Solutions
            </h1>
            <p className="mt-5 text-[17px] leading-relaxed text-sage-mist/90 sm:text-[19px]">
              AG POWER delivers high-yield rooftop and ground-mounted solar installations for residences, commercial enterprises, and housing societies across India.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4">
              <LocalizedClientLink
                href="/calculator"
                className="btn-primary w-full sm:w-auto"
              >
                <span>Calculate Solar Potential</span>
                <ArrowRight className="ml-2 h-4 w-4" />
              </LocalizedClientLink>
              <LocalizedClientLink
                href="/contact"
                className="btn-secondary w-full sm:w-auto"
              >
                Get Free Consultation
              </LocalizedClientLink>
            </div>
          </div>
        </div>
      </section>

      {/* Solutions Cards Section */}
      <section className="py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="space-y-12">
            {solarCategories.map((cat, idx) => {
              const Icon = cat.icon
              const isEven = idx % 2 === 1
              return (
                <div
                  key={cat.slug}
                  className={`flex flex-col gap-10 rounded-3xl border border-charcoal/10 bg-white p-8 shadow-sm transition-all hover:shadow-xl sm:p-12 lg:items-center ${
                    isEven ? "lg:flex-row-reverse" : "lg:flex-row"
                  }`}
                >
                  {/* Left Column: Details */}
                  <div className="flex-1">
                    <span className="rounded-full bg-sage-mist px-3.5 py-1 text-[12px] font-bold text-forest">
                      {cat.badge}
                    </span>

                    <h2 className="mt-4 font-manrope text-[28px] font-extrabold text-forest sm:text-[34px]">
                      {cat.title}
                    </h2>
                    <p className="mt-1 font-semibold text-charcoal-muted">
                      {cat.headline}
                    </p>

                    <p className="mt-4 text-[15px] leading-relaxed text-charcoal/80">
                      {cat.desc}
                    </p>

                    <div className="mt-6 space-y-2.5">
                      {cat.highlights.map((h, i) => (
                        <div key={i} className="flex items-start gap-2.5 text-[14px] text-charcoal">
                          <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-forest" />
                          <span>{h}</span>
                        </div>
                      ))}
                    </div>

                    <div className="mt-8 flex flex-wrap items-center gap-4">
                      <LocalizedClientLink
                        href={`/services/${cat.slug}`}
                        className="inline-flex min-h-[46px] items-center justify-center rounded-xl bg-forest px-6 font-inter text-[14px] font-bold text-white shadow-sm transition-all hover:bg-forest-deep"
                      >
                        <span>{cat.cta}</span>
                        <ArrowRight className="ml-2 h-4 w-4 text-gold" />
                      </LocalizedClientLink>

                      <LocalizedClientLink
                        href={cat.calcUrl}
                        className="inline-flex min-h-[46px] items-center justify-center rounded-xl border border-slate-200 bg-white hover:bg-slate-50 px-5 font-inter text-[14px] font-bold text-slate-800 shadow-sm"
                      >
                        <Calculator className="mr-2 h-4 w-4 text-emerald-600" />
                        <span>{cat.calcCta}</span>
                      </LocalizedClientLink>
                    </div>
                  </div>

                  {/* Right Column: Visual Feature Box */}
                  <div className="w-full lg:w-[420px]">
                    <div className="rounded-2xl border border-forest/15 bg-forest p-8 text-white shadow-lg">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gold text-forest">
                        <Icon className="h-6 w-6" />
                      </div>

                      <h3 className="mt-6 font-manrope text-[20px] font-bold text-white">
                        Why Choose AG POWER {cat.title}?
                      </h3>

                      <div className="mt-5 space-y-3 text-[13px] text-sage-mist">
                        <div className="flex items-center justify-between border-b border-white/10 pb-2">
                          <span className="text-sage">Bill Offset:</span>
                          <span className="font-bold text-white">
                            {cat.slug === "housing-society-solar" ? "Up to 80%" : "Up to 90%"}
                          </span>
                        </div>
                        <div className="flex items-center justify-between border-b border-white/10 pb-2">
                          <span className="text-sage">Warranty:</span>
                          <span className="font-bold text-white">25-Year Linear Power</span>
                        </div>
                        <div className="flex items-center justify-between border-b border-white/10 pb-2">
                          <span className="text-sage">DISCOM Liaison:</span>
                          <span className="font-bold text-gold">100% Handled</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sage">Payback:</span>
                          <span className="font-bold text-white">2.5 to 4 Years</span>
                        </div>
                      </div>

                      <div className="mt-6 rounded-xl bg-white/10 p-3 text-[12px] text-sage">
                        ✓ On-site structural engineering & shadow simulation included with every proposal.
                      </div>
                    </div>
                  </div>

                </div>
              )
            })}
          </div>

        </div>
      </section>

    </div>
  )
}
