/**
 * Section 5: Why AG POWER?
 * Clear, verifiable company differentiators and engineering standards.
 */
import { Compass, Cpu, Wrench, FileCheck2, HeadphonesIcon, ShieldCheck } from "lucide-react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const differentiators = [
  {
    icon: Compass,
    title: "Precision Shadow Analysis",
    description: "3D rooftop simulation to eliminate shadow loss and maximize annual unit generation.",
  },
  {
    icon: Cpu,
    title: "Tier-1 Tested Modules",
    description: "High-efficiency Mono PERC & TOPCon panels engineered for harsh Indian weather.",
  },
  {
    icon: Wrench,
    title: "Wind-Rated Structures",
    description: "Corrosion-resistant galvanized structures certified for wind speeds up to 150 km/h.",
  },
  {
    icon: FileCheck2,
    title: "Complete Liaison & Subsidies",
    description: "End-to-end DISCOM net-metering approvals and PM Surya Ghar subsidy handling.",
  },
  {
    icon: ShieldCheck,
    title: "25-Year Performance Assurance",
    description: "Backed by 25-year linear power output guarantee and 5-year workmanship warranty.",
  },
  {
    icon: HeadphonesIcon,
    title: "Local On-Ground Support",
    description: "Rapid service response paired with remote app monitoring for peak system health.",
  },
]

export default function WhyAgPower() {
  return (
    <section className="bg-slate-50/70 py-16 sm:py-20 lg:py-24 border-y border-slate-200/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-manrope text-[32px] font-extrabold tracking-tight text-slate-900 sm:text-[42px]">
            Why Property Owners Trust AG POWER
          </h2>
          <p className="mt-4 text-[16px] leading-relaxed text-slate-600 sm:text-[18px]">
            Solar is a 25-year commitment. We approach every installation with uncompromised engineering precision, certified components, and transparent execution.
          </p>
        </div>

        {/* 6 Feature Pillars */}
        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {differentiators.map((diff, i) => {
            const Icon = diff.icon
            return (
              <div
                key={i}
                className="group flex flex-col rounded-2xl border border-slate-200/80 bg-white p-7 shadow-sm transition-all duration-300 hover:border-emerald-500/50 hover:shadow-xl hover:-translate-y-1"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-800 transition-colors group-hover:bg-emerald-800 group-hover:text-amber-400 group-hover:shadow-md">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mt-5 font-manrope text-[19px] font-bold text-slate-900">
                  {diff.title}
                </h3>
                <p className="mt-2.5 text-[14px] leading-relaxed text-slate-600">
                  {diff.description}
                </p>
              </div>
            )
          })}
        </div>

        {/* Stats Strip (Frosted Glassmorphic Emerald & Midnight Container) */}
        <div className="relative overflow-hidden mt-16 grid grid-cols-2 gap-4 rounded-3xl bg-gradient-to-br from-emerald-950 via-slate-950 to-emerald-950 p-8 text-white sm:grid-cols-4 sm:p-10 border border-emerald-500/20 shadow-2xl backdrop-blur-2xl before:absolute before:inset-0 before:bg-gradient-to-r before:from-emerald-400/10 before:via-transparent before:to-amber-500/10 before:pointer-events-none">
          <div className="relative z-10 text-center">
            <p className="font-manrope text-[34px] font-black text-amber-400 sm:text-[44px] tracking-tight">
              25+
            </p>
            <p className="mt-1 text-[13px] font-medium text-emerald-300">Years Warranty</p>
          </div>
          <div className="relative z-10 text-center">
            <p className="font-manrope text-[34px] font-black text-white sm:text-[44px] tracking-tight">
              90%
            </p>
            <p className="mt-1 text-[13px] font-medium text-emerald-300">Bill Reduction</p>
          </div>
          <div className="relative z-10 text-center">
            <p className="font-manrope text-[34px] font-black text-amber-400 sm:text-[44px] tracking-tight">
              100%
            </p>
            <p className="mt-1 text-[13px] font-medium text-emerald-300">Tier-1 Hardware</p>
          </div>
          <div className="relative z-10 text-center">
            <p className="font-manrope text-[34px] font-black text-white sm:text-[44px] tracking-tight">
              3-4 Yrs
            </p>
            <p className="mt-1 text-[13px] font-medium text-emerald-300">Typical Payback</p>
          </div>
        </div>

      </div>
    </section>
  )
}
