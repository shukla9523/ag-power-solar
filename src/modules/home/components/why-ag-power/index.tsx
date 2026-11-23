"use client"

/**
 * Section 5: Why AG POWER?
 * Clear, verifiable company differentiators and engineering standards.
 */
import { useEffect, useState, useRef } from "react"
import { Compass, Cpu, Wrench, FileCheck2, HeadphonesIcon, ShieldCheck, Award } from "lucide-react"

function StatCounter({
  target,
  suffix = "",
  prefix = "",
}: {
  target: number
  suffix?: string
  prefix?: string
}) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    let started = false
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !started) {
          started = true
          let start = 0
          const duration = 1500
          const stepTime = 25
          const totalSteps = duration / stepTime
          const increment = target / totalSteps
          const timer = setInterval(() => {
            start += increment
            if (start >= target) {
              setCount(target)
              clearInterval(timer)
            } else {
              setCount(Math.floor(start))
            }
          }, stepTime)
        }
      },
      { threshold: 0.2 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [target])

  return (
    <span ref={ref}>
      {prefix}
      {count}
      {suffix}
    </span>
  )
}

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
    <section className="bg-white py-[72px]" id="why-ag-power">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200/80 bg-emerald-100 px-3.5 py-1 text-[11px] sm:text-[12px] font-bold uppercase tracking-wider text-forest-deep mb-3">
            <Award className="h-3.5 w-3.5 text-amber-500" />
            <span>The AG Power Advantage</span>
          </div>
          <h2 className="font-manrope text-[clamp(30px,3.2vw,42px)] font-extrabold tracking-tight text-forest-deep leading-[1.2]">
            Why Property Owners <span className="text-emerald-600">Trust AG POWER</span>
          </h2>
          <p className="mt-4 max-w-[680px] mx-auto text-[17px] leading-relaxed text-slate-600">
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
                className="group flex flex-col rounded-2xl border border-emerald-200/80 border-t-[3px] border-t-transparent hover:border-t-amber-400 bg-white p-[28px] shadow-sm transition-all duration-300 hover:border-emerald-400 hover:shadow-[0_12px_32px_rgba(22,163,74,0.12)] hover:-translate-y-1"
              >
                <div className="flex h-[56px] w-[56px] items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 shadow-sm transition-colors group-hover:scale-105">
                  <Icon className="h-7 w-7" />
                </div>
                <h3 className="mt-5 font-manrope text-[24px] font-bold text-forest-deep">
                  {diff.title}
                </h3>
                <p className="mt-2.5 text-[16px] leading-relaxed text-slate-600">
                  {diff.description}
                </p>
              </div>
            )
          })}
        </div>

        {/* Stats Strip with Count-Up Animation in Deep Forest Gradient */}
        <div
          style={{
            background: "linear-gradient(135deg, #14532D 0%, #166534 100%)",
          }}
          className="relative overflow-hidden mt-12 sm:mt-16 grid grid-cols-2 gap-3 sm:gap-4 rounded-2xl sm:rounded-3xl p-5 sm:p-8 lg:p-10 text-white sm:grid-cols-4 border border-emerald-500/20 shadow-xl"
        >
          <div className="relative z-10 text-center">
            <p className="font-manrope text-[28px] sm:text-[38px] lg:text-[44px] font-black text-amber-400 tracking-tight">
              <StatCounter target={25} suffix="+" />
            </p>
            <p className="mt-0.5 sm:mt-1 text-[12px] sm:text-[13px] font-medium text-emerald-100">Years Warranty</p>
          </div>
          <div className="relative z-10 text-center">
            <p className="font-manrope text-[28px] sm:text-[38px] lg:text-[44px] font-black text-white tracking-tight">
              <StatCounter target={90} suffix="%" />
            </p>
            <p className="mt-0.5 sm:mt-1 text-[12px] sm:text-[13px] font-medium text-emerald-100">Bill Reduction</p>
          </div>
          <div className="relative z-10 text-center">
            <p className="font-manrope text-[28px] sm:text-[38px] lg:text-[44px] font-black text-amber-400 tracking-tight">
              <StatCounter target={100} suffix="%" />
            </p>
            <p className="mt-0.5 sm:mt-1 text-[12px] sm:text-[13px] font-medium text-emerald-100">Tier-1 Hardware</p>
          </div>
          <div className="relative z-10 text-center">
            <p className="font-manrope text-[28px] sm:text-[38px] lg:text-[44px] font-black text-white tracking-tight">
              3-4 Yrs
            </p>
            <p className="mt-1 text-[13px] font-medium text-emerald-100">Typical Payback</p>
          </div>
        </div>

      </div>
    </section>
  )
}
