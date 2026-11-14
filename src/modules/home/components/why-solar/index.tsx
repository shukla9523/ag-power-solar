/**
 * Section 4: Why Choose Solar?
 * Highlights the practical, environmental, and financial advantages of going solar.
 */
import { TrendingDown, ShieldAlert, LineChart, Leaf, Building, SunMedium, ArrowUpRight } from "lucide-react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const benefits = [
  {
    icon: TrendingDown,
    title: "Cut Electricity Bills up to 90%",
    description:
      "Generate clean solar units directly on your roof to offset grid consumption. Drastically reduce or virtually eliminate high recurring electricity bills.",
  },
  {
    icon: ShieldAlert,
    title: "Hedge Against Rising Grid Tariffs",
    description:
      "Commercial and domestic electricity rates consistently increase year-on-year. Solar locks in your energy generation cost for the next 25 years.",
  },
  {
    icon: LineChart,
    title: "Compelling ROI & Rapid Payback",
    description:
      "Most rooftop solar installations achieve complete capital payback within 3 to 5 years, followed by 20+ years of virtually free solar power.",
  },
  {
    icon: Leaf,
    title: "Eco-Friendly Clean Energy",
    description:
      "Every 5 kW solar plant eliminates approximately 6 to 8 tonnes of carbon emissions annually, equivalent to planting over 100 mature trees.",
  },
  {
    icon: Building,
    title: "Turn Empty Roofs Into Generating Assets",
    description:
      "Transform idle rooftop space into a high-yielding infrastructure asset that increases property valuation and promotes green building standards.",
  },
  {
    icon: SunMedium,
    title: "Government Incentives & Subsidies",
    description:
      "Benefit from nationwide incentives including PM Surya Ghar Muft Bijli Yojana subsidies for homes, and 40% accelerated depreciation for businesses.",
  },
]

export default function WhySolar() {
  return (
    <section className="bg-white py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-forest/15 bg-sage-mist px-4 py-1 text-[13px] font-bold uppercase tracking-wider text-forest">
            Smart Energy Switch
          </div>
          <h2 className="mt-4 font-manrope text-[32px] font-extrabold tracking-tight text-forest sm:text-[42px]">
            Why Switch to Rooftop Solar Energy?
          </h2>
          <p className="mt-4 text-[16px] leading-relaxed text-charcoal/80 sm:text-[18px]">
            Solar energy isn&apos;t just an environmental statement — it is one of the most reliable, high-yield financial investments you can make for your home or business.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="mt-14 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map((item, index) => {
            const Icon = item.icon
            return (
              <div
                key={index}
                className="group relative rounded-2xl border border-charcoal/10 bg-ivory p-8 transition-all duration-300 hover:border-forest/25 hover:bg-sage-mist/60 hover:shadow-lg"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-forest text-gold shadow-sm transition-transform group-hover:scale-110">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mt-6 font-manrope text-[20px] font-bold text-forest">
                  {item.title}
                </h3>
                <p className="mt-3 text-[14px] leading-relaxed text-charcoal/80">
                  {item.description}
                </p>
              </div>
            )
          })}
        </div>

        {/* Bottom Banner */}
        <div className="mt-12 flex flex-col items-center justify-between gap-6 rounded-2xl bg-forest p-8 text-white sm:flex-row sm:p-10">
          <div>
            <h4 className="font-manrope text-[22px] font-bold text-white sm:text-[24px]">
              Want to see how much your rooftop can generate?
            </h4>
            <p className="mt-1 text-[14px] text-sage">
              Use our quick calculator to estimate your system capacity, savings, and investment.
            </p>
          </div>
          <LocalizedClientLink
            href="/calculator"
            className="inline-flex min-h-[48px] flex-shrink-0 items-center justify-center rounded-xl bg-gold px-6 font-inter text-[15px] font-bold text-forest transition-all hover:bg-gold-hover"
          >
            <span>Open Solar Calculator</span>
            <ArrowUpRight className="ml-1.5 h-4 w-4" />
          </LocalizedClientLink>
        </div>

      </div>
    </section>
  )
}
