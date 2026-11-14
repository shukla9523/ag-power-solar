/**
 * Section 5: Why AG POWER?
 * Clear, verifiable company differentiators and engineering standards.
 */
import { Compass, Cpu, Wrench, FileCheck2, HeadphonesIcon, ShieldCheck } from "lucide-react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const differentiators = [
  {
    icon: Compass,
    title: "Precision Shadow & Solar Mapping",
    description:
      "We perform 3D shadow analysis and seasonal solar path modeling to orient panels for peak irradiance and year-round maximum energy generation.",
  },
  {
    icon: Cpu,
    title: "Tier-1 Tested Components",
    description:
      "We exclusively deploy high-efficiency Mono PERC and TOPCon modules paired with top-rated grid-tie inverters designed for Indian climatic conditions.",
  },
  {
    icon: Wrench,
    title: "Engineered Heavy-Duty Structures",
    description:
      "Galvanized iron and anodized aluminum mounting structures engineered to withstand wind speeds up to 150 km/h without roof penetration or leakage.",
  },
  {
    icon: FileCheck2,
    title: "Hassle-Free Approvals & Subsidies",
    description:
      "From state DISCOM net-metering approvals to national PM Surya Ghar subsidy application processing, our dedicated liaison team manages everything.",
  },
  {
    icon: ShieldCheck,
    title: "25-Year Performance Assurance",
    description:
      "Backed by a 25-year linear power warranty from Tier-1 manufacturers plus AG POWER's 5-year workmanship guarantee.",
  },
  {
    icon: HeadphonesIcon,
    title: "Local On-Ground Service & Support",
    description:
      "Prompt service response with proactive remote generation monitoring so your solar system stays at peak operational health.",
  },
]

export default function WhyAgPower() {
  return (
    <section className="bg-ivory py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-forest/15 bg-sage-mist px-4 py-1 text-[13px] font-bold uppercase tracking-wider text-forest">
            The AG POWER Advantage
          </div>
          <h2 className="mt-4 font-manrope text-[32px] font-extrabold tracking-tight text-forest sm:text-[42px]">
            Why Property Owners Trust AG POWER
          </h2>
          <p className="mt-4 text-[16px] leading-relaxed text-charcoal/80 sm:text-[18px]">
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
                className="group flex flex-col rounded-2xl border border-charcoal/10 bg-white p-7 shadow-sm transition-all duration-300 hover:border-forest/30 hover:shadow-md"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sage-mist text-forest transition-colors group-hover:bg-forest group-hover:text-gold">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mt-5 font-manrope text-[19px] font-bold text-forest">
                  {diff.title}
                </h3>
                <p className="mt-2.5 text-[14px] leading-relaxed text-charcoal/80">
                  {diff.description}
                </p>
              </div>
            )
          })}
        </div>

        {/* Stats Strip */}
        <div className="mt-16 grid grid-cols-2 gap-4 rounded-2xl bg-forest p-8 text-white sm:grid-cols-4 sm:p-10">
          <div className="text-center">
            <p className="font-manrope text-[32px] font-extrabold text-gold sm:text-[40px]">
              25+
            </p>
            <p className="mt-1 text-[13px] text-sage">Years Warranty</p>
          </div>
          <div className="text-center">
            <p className="font-manrope text-[32px] font-extrabold text-white sm:text-[40px]">
              90%
            </p>
            <p className="mt-1 text-[13px] text-sage">Bill Reduction</p>
          </div>
          <div className="text-center">
            <p className="font-manrope text-[32px] font-extrabold text-gold sm:text-[40px]">
              100%
            </p>
            <p className="mt-1 text-[13px] text-sage">Tier-1 Hardware</p>
          </div>
          <div className="text-center">
            <p className="font-manrope text-[32px] font-extrabold text-white sm:text-[40px]">
              3-4 Yrs
            </p>
            <p className="mt-1 text-[13px] text-sage">Typical Payback</p>
          </div>
        </div>

      </div>
    </section>
  )
}
