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
    <section className="bg-ivory py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-forest/15 bg-sage-mist px-4 py-1 text-[13px] font-bold uppercase tracking-wider text-forest">
            Tailored Energy Systems
          </div>
          <h2 className="mt-4 font-manrope text-[32px] font-extrabold tracking-tight text-forest sm:text-[42px]">
            Engineered Solar Solutions for Every Need
          </h2>
          <p className="mt-4 text-[16px] leading-relaxed text-charcoal/80 sm:text-[18px]">
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
                className="group flex flex-col justify-between rounded-2xl border border-charcoal/10 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-forest/30 hover:shadow-xl"
              >
                <div>
                  {/* Top Bar with Icon & Badge */}
                  <div className="flex items-center justify-between">
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-forest text-gold shadow-sm transition-transform group-hover:scale-105">
                      <Icon className="h-7 w-7" />
                    </div>
                    <span className="rounded-full bg-sage-mist px-3 py-1 text-[11px] font-bold text-forest">
                      {sol.badge}
                    </span>
                  </div>

                  {/* Title & Subtitle */}
                  <h3 className="mt-6 font-manrope text-[24px] font-bold text-forest">
                    {sol.title}
                  </h3>
                  <p className="text-[13px] font-semibold text-charcoal-muted">
                    {sol.subtitle}
                  </p>

                  {/* Description */}
                  <p className="mt-3 text-[14px] leading-relaxed text-charcoal/80">
                    {sol.description}
                  </p>

                  {/* Benefit Points */}
                  <div className="mt-6 border-t border-charcoal/8 pt-5">
                    <p className="text-[12px] font-bold uppercase tracking-wider text-forest">
                      Key Highlights:
                    </p>
                    <ul className="mt-3 flex flex-col gap-2.5">
                      {sol.benefits.map((benefit, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-[13px] text-charcoal">
                          <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-forest" />
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
                    className="inline-flex min-h-[46px] w-full items-center justify-center rounded-xl bg-forest px-5 font-inter text-[14px] font-bold text-white shadow-sm transition-all hover:bg-forest-deep group-hover:bg-forest"
                  >
                    <span>{sol.ctaText}</span>
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1 text-gold" />
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
