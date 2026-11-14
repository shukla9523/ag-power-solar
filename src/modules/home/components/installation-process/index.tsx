/**
 * Section 7: 6-Step Installation Process Timeline
 */
import { PhoneCall, Compass, Cpu, FileCheck, Wrench, CheckCheck } from "lucide-react"

const steps = [
  {
    num: "01",
    title: "Initial Consultation",
    description: "We review your historical electricity bills, sanctioned load, and energy reduction targets.",
    icon: PhoneCall,
  },
  {
    num: "02",
    title: "Site Feasibility & Shadow Mapping",
    description: "Comprehensive 3D drone/laser rooftop assessment to ensure zero shadow interference.",
    icon: Compass,
  },
  {
    num: "03",
    title: "Precision System Engineering",
    description: "CAD-designed string planning, electrical safety layout, and structural load calculations.",
    icon: Cpu,
  },
  {
    num: "04",
    title: "DISCOM & Subsidy Filings",
    description: "We handle all paperwork for DISCOM net-metering approvals and PM Surya Ghar subsidy claims.",
    icon: FileCheck,
  },
  {
    num: "05",
    title: "Certified Installation",
    description: "Heavy-duty wind-rated mounting structures, micro-cracking inspection, and dual safety earthing.",
    icon: Wrench,
  },
  {
    num: "06",
    title: "Commissioning & Sync",
    description: "Bi-directional net-meter installation, remote app monitoring setup, and generation kickoff.",
    icon: CheckCheck,
  },
]

export default function InstallationProcess() {
  return (
    <section className="bg-ivory py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-forest/15 bg-sage-mist px-4 py-1 text-[13px] font-bold uppercase tracking-wider text-forest">
            Turnkey Execution
          </div>
          <h2 className="mt-4 font-manrope text-[32px] font-extrabold tracking-tight text-forest sm:text-[42px]">
            Your Seamless Solar Journey in 6 Steps
          </h2>
          <p className="mt-4 text-[16px] leading-relaxed text-charcoal/80 sm:text-[18px]">
            From initial enquiry to net-metering commissioning, AG POWER delivers a transparent, fully managed experience without DISCOM hassles.
          </p>
        </div>

        {/* 6 Steps Grid / Timeline */}
        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {steps.map((step) => {
            const Icon = step.icon
            return (
              <div
                key={step.num}
                className="group relative flex flex-col justify-between rounded-2xl border border-charcoal/10 bg-white p-7 shadow-sm transition-all duration-300 hover:border-forest/30 hover:shadow-md"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-manrope text-[24px] font-black text-gold">
                      {step.num}
                    </span>
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sage-mist text-forest transition-colors group-hover:bg-forest group-hover:text-gold">
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>

                  <h3 className="mt-5 font-manrope text-[18px] font-bold text-forest">
                    {step.title}
                  </h3>
                  <p className="mt-2.5 text-[14px] leading-relaxed text-charcoal/80">
                    {step.description}
                  </p>
                </div>

                <div className="mt-6 h-1 w-12 rounded-full bg-forest/20 transition-all group-hover:w-full group-hover:bg-gold" />
              </div>
            )
          })}
        </div>

      </div>
    </section>
  )
}
