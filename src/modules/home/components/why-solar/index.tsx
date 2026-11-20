/**
 * Section 4: Why Choose Solar?
 * Highlights the practical, environmental, and financial advantages of going solar.
 */
import { TrendingDown, ShieldAlert, LineChart, Leaf, Building, SunMedium, ArrowUpRight } from "lucide-react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const benefits = [
  {
    icon: TrendingDown,
    title: "Cut Bills up to 90%",
    description: "Generate your own power on-site to drastically reduce high recurring electricity bills.",
  },
  {
    icon: ShieldAlert,
    title: "Hedge Against Tariffs",
    description: "Lock in your energy costs for 25 years with zero exposure to rising grid utility tariffs.",
  },
  {
    icon: LineChart,
    title: "3 to 4 Year Payback",
    description: "Achieve fast capital recovery followed by 20+ years of virtually free solar power.",
  },
  {
    icon: SunMedium,
    title: "Govt Subsidies Available",
    description: "Get up to ₹78,000 direct PM Surya Ghar subsidy for homes and 40% depreciation for businesses.",
  },
  {
    icon: Building,
    title: "Value-Generating Asset",
    description: "Turn idle roof space into clean infrastructure that enhances total property valuation.",
  },
  {
    icon: Leaf,
    title: "Clean & Eco-Friendly",
    description: "Eliminate tonnes of carbon emissions every year and foster sustainable green living.",
  },
]

export default function WhySolar() {
  return (
    <section className="bg-white py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-sky-400/30 bg-sky-50 px-4 py-1 text-[13px] font-bold uppercase tracking-wider text-slate-800 shadow-sm">
            <SunMedium className="h-4 w-4 text-amber-500" />
            <span>Smart Energy Switch</span>
          </div>
          <h2 className="mt-4 font-manrope text-[32px] font-extrabold tracking-tight text-slate-900 sm:text-[42px]">
            Why Switch to Rooftop Solar Energy?
          </h2>
          <p className="mt-4 text-[16px] leading-relaxed text-slate-600 sm:text-[18px]">
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
                className="group relative rounded-2xl border border-slate-200/80 bg-slate-50/60 p-8 transition-all duration-300 hover:border-sky-400/50 hover:bg-white hover:shadow-xl hover:-translate-y-1"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-slate-900 to-slate-800 text-amber-400 shadow-md transition-transform group-hover:scale-110">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mt-6 font-manrope text-[20px] font-bold text-slate-900">
                  {item.title}
                </h3>
                <p className="mt-3 text-[14px] leading-relaxed text-slate-600">
                  {item.description}
                </p>
              </div>
            )
          })}
        </div>

        {/* Bottom Banner (Frosted Midnight Blue Glassmorphic Banner) */}
        <div className="relative overflow-hidden mt-12 flex flex-col items-center justify-between gap-6 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 p-8 text-white sm:flex-row sm:p-10 border border-white/10 shadow-2xl backdrop-blur-2xl before:absolute before:inset-0 before:bg-gradient-to-r before:from-sky-500/10 before:via-transparent before:to-amber-500/10 before:pointer-events-none">
          <div className="relative z-10">
            <h4 className="font-manrope text-[22px] font-bold text-white sm:text-[24px]">
              Want to see how much your rooftop can generate?
            </h4>
            <p className="mt-1 text-[14px] text-sky-300">
              Use our quick calculator to estimate your system capacity, savings, and investment.
            </p>
          </div>
          <LocalizedClientLink
            href="/calculator"
            className="relative z-10 inline-flex min-h-[48px] flex-shrink-0 items-center justify-center rounded-xl bg-emerald-600 hover:bg-emerald-500 px-6 font-inter text-[15px] font-bold text-white shadow-lg transition-all hover:scale-105 active:scale-95"
          >
            <span>Open Solar Calculator</span>
            <ArrowUpRight className="ml-1.5 h-4 w-4 text-white" />
          </LocalizedClientLink>
        </div>

      </div>
    </section>
  )
}
