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
    <section
      className="py-[72px] transition-colors"
      style={{ backgroundColor: "#F0FDF4" }}
      id="why-solar"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-manrope text-[clamp(30px,3.2vw,42px)] font-extrabold tracking-tight text-forest-deep leading-[1.2]">
            Why Switch to <span className="text-emerald-600">Rooftop Solar</span> Energy?
          </h2>
          <p className="mt-4 max-w-[680px] mx-auto text-[17px] leading-relaxed text-slate-600">
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
                className="group relative overflow-hidden rounded-2xl border border-emerald-200/80 bg-white p-[28px] transition-all duration-300 hover:border-emerald-400 hover:shadow-[0_12px_32px_rgba(22,163,74,0.12)] hover:-translate-y-1"
              >
                {/* 3px Yellow Top Border on Card Hover */}
                <div className="absolute top-0 inset-x-0 h-[3px] bg-amber-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-t-2xl z-10 pointer-events-none" />

                <div className="flex h-[56px] w-[56px] min-h-[56px] min-w-[56px] items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 shadow-sm transition-transform duration-300 group-hover:scale-105">
                  <Icon className="h-7 w-7" />
                </div>
                <h3 className="mt-6 font-manrope text-[24px] font-bold text-forest-deep">
                  {item.title}
                </h3>
                <p className="mt-3 text-[16px] leading-relaxed text-slate-600">
                  {item.description}
                </p>
              </div>
            )
          })}
        </div>

        {/* Bottom Banner in Deep Green Gradient */}
        <div
          style={{
            background: "linear-gradient(135deg, #14532D 0%, #166534 100%)",
          }}
          className="relative overflow-hidden mt-12 flex flex-col items-center justify-between gap-6 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 text-white sm:flex-row border border-emerald-500/20 shadow-xl"
        >
          <div className="relative z-10 text-center sm:text-left">
            <h4 className="font-manrope text-[20px] font-bold text-white sm:text-[24px]">
              Want to see how much your rooftop can generate?
            </h4>
            <p className="mt-1.5 text-[13.5px] sm:text-[14px] text-emerald-100">
              Use our quick calculator to estimate your system capacity, savings, and investment.
            </p>
          </div>
          <LocalizedClientLink
            href="/calculator"
            className="relative z-10 inline-flex min-h-[48px] w-full sm:w-auto flex-shrink-0 items-center justify-center rounded-xl bg-amber-400 hover:bg-amber-300 px-6 font-inter text-[15px] font-extrabold text-forest-deep shadow-md transition-all hover:-translate-y-0.5 active:scale-95 text-center"
          >
            <span>Open Solar Calculator</span>
            <ArrowUpRight className="ml-1.5 h-4 w-4 text-forest-deep" />
          </LocalizedClientLink>
        </div>

      </div>
    </section>
  )
}
