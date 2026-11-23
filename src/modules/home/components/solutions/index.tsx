/**
 * Section 3: Solar Solutions Cards
 * Showcases Residential, Commercial, and Housing Society solar solutions.
 */
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { Home, Building2, Users2, ArrowRight, CheckCircle2, Sparkles, TrendingUp, ShieldCheck } from "lucide-react"

const solutions = [
  {
    id: "residential",
    title: "Residential Solar",
    subtitle: "Homes & Villas",
    description: "Slash electricity bills by up to 90% and claim direct central government subsidies.",
    icon: Home,
    href: "/services/residential-solar",
    badge: "PM Surya Ghar Eligible",
    benefits: [
      "1 kW to 10 kW custom rooftop setups",
      "Up to ₹78,000 direct central subsidy",
      "Net-metering & 25-yr panel warranty",
    ],
    ctaText: "Explore Home Solar",
  },
  {
    id: "commercial",
    title: "Commercial & Industrial",
    subtitle: "Offices & Factories",
    description: "Drastically reduce business operational costs and hedge against rising power tariffs.",
    icon: Building2,
    href: "/services/commercial-solar",
    badge: "Accelerated Depreciation",
    benefits: [
      "10 kW to 500+ kW engineered EPC plants",
      "Rapid ROI in 2.5 to 4 years",
      "40% tax benefits & remote monitoring",
    ],
    ctaText: "Explore Commercial Solar",
  },
  {
    id: "society",
    title: "Housing Society Solar",
    subtitle: "Apartments & RWAs",
    description: "Power lifts, water pumps, and common lighting without burdening resident maintenance.",
    icon: Users2,
    href: "/services/housing-society-solar",
    badge: "RWA Cost Reducer",
    benefits: [
      "Cut common electricity bills by 80%",
      "Complete DISCOM & RWA liaison",
      "Wind-tested rooftop installation",
    ],
    ctaText: "Explore Society Solar",
  },
]

export default function SolarSolutions() {
  return (
    <section className="bg-white py-[72px]" id="solutions">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200/80 bg-emerald-100 px-3.5 py-1 text-[11px] sm:text-[12px] font-bold uppercase tracking-wider text-forest-deep mb-3">
            <Sparkles className="h-3.5 w-3.5 text-amber-500" />
            <span>Our Capabilities</span>
          </div>
          <h2 className="font-manrope text-[clamp(30px,3.2vw,42px)] font-extrabold tracking-tight text-forest-deep leading-[1.2]">
            Engineered Solar Solutions for <span className="text-emerald-600">Every Need</span>
          </h2>
          <p className="mt-4 max-w-[680px] mx-auto text-[17px] leading-relaxed text-slate-600">
            From individual rooftops to massive industrial sheds, AG POWER provides precision-engineered solar installations designed for maximum generational output.
          </p>
        </div>

        {/* 3 Visual Service Cards */}
        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {solutions.map((sol) => {
            const Icon = sol.icon
            return (
              <div
                key={sol.id}
                className="group relative flex flex-col justify-between rounded-2xl border border-emerald-200/80 border-t-[3px] border-t-transparent hover:border-t-amber-400 bg-white p-[28px] shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-400 hover:shadow-[0_12px_32px_rgba(22,163,74,0.12)]"
              >
                <div>
                  {/* Top Bar with Icon & Badge */}
                  <div className="flex items-center justify-between">
                    <div className="flex h-[56px] w-[56px] items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 shadow-sm transition-all duration-300 group-hover:scale-105">
                      <Icon className="h-7 w-7" />
                    </div>
                    <span className="rounded-xl border border-emerald-200/80 bg-emerald-50/80 px-3 py-1 text-[11px] font-bold text-forest-deep shadow-xs">
                      {sol.badge}
                    </span>
                  </div>

                  {/* Title & Subtitle */}
                  <h3 className="mt-6 font-manrope text-[24px] font-bold text-forest-deep">
                    {sol.title}
                  </h3>
                  <p className="text-[13px] font-semibold text-slate-500">
                    {sol.subtitle}
                  </p>

                  {/* Description: 16px */}
                  <p className="mt-3 text-[16px] leading-relaxed text-slate-600">
                    {sol.description}
                  </p>

                  {/* Benefit Points: 16px */}
                  <div className="mt-6 border-t border-slate-100 pt-5">
                    <p className="text-[12px] font-bold uppercase tracking-wider text-forest-deep">
                      Key Highlights:
                    </p>
                    <ul className="mt-3 flex flex-col gap-2.5">
                      {sol.benefits.map((benefit, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-[16px] text-slate-700">
                          <CheckCircle2 className="mt-1 h-4 w-4 flex-shrink-0 text-emerald-600" />
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Bottom Action */}
                <div className="mt-8 pt-4">
                  <LocalizedClientLink
                    href={sol.href}
                    className="inline-flex min-h-[46px] w-full items-center justify-center rounded-xl bg-emerald-600 hover:bg-emerald-500 px-5 font-inter text-[14px] font-bold text-white shadow-[0_4px_16px_rgba(22,163,74,0.3)] transition-all duration-200 hover:shadow-[0_6px_22px_rgba(22,163,74,0.45)] hover:-translate-y-0.5 active:scale-95"
                  >
                    <span>{sol.ctaText}</span>
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1 text-white" />
                  </LocalizedClientLink>
                </div>

              </div>
            )
          })}
        </div>

      </div>
    </section>
  )
}
