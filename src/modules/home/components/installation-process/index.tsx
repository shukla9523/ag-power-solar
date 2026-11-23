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
    <section
      className="py-[72px] transition-colors"
      style={{ backgroundColor: "#F0FDF4" }}
      id="process"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200/80 bg-emerald-100 px-3.5 py-1 text-[11px] sm:text-[12px] font-bold uppercase tracking-wider text-forest-deep mb-3">
            <CheckCheck className="h-3.5 w-3.5 text-amber-500" />
            <span>Step-by-Step Process</span>
          </div>
          <h2 className="font-manrope text-[clamp(30px,3.2vw,42px)] font-extrabold tracking-tight text-forest-deep leading-[1.2]">
            Your Seamless Solar Journey in <span className="text-emerald-600">6 Steps</span>
          </h2>
          <p className="mt-4 max-w-[680px] mx-auto text-[17px] leading-relaxed text-slate-600">
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
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-emerald-200/80 bg-white p-[28px] shadow-sm transition-all duration-300 hover:border-emerald-400 hover:shadow-[0_12px_32px_rgba(22,163,74,0.12)] hover:-translate-y-1"
              >
                {/* 3px Yellow Top Border on Card Hover */}
                <div className="absolute top-0 inset-x-0 h-[3px] bg-amber-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-t-2xl z-10 pointer-events-none" />

                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-manrope text-[26px] font-black text-amber-500 tracking-tight transition-transform duration-300 group-hover:scale-110">
                      {step.num}
                    </span>
                    <div className="flex h-[56px] w-[56px] min-h-[56px] min-w-[56px] items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 transition-all duration-300 group-hover:scale-105">
                      <Icon className="h-7 w-7" />
                    </div>
                  </div>

                  <h3 className="mt-5 font-manrope text-[24px] font-bold text-forest-deep">
                    {step.title}
                  </h3>
                  <p className="mt-2.5 text-[16px] leading-relaxed text-slate-600">
                    {step.description}
                  </p>
                </div>

                <div className="mt-6 h-1 w-12 rounded-full bg-emerald-100 transition-all duration-500 group-hover:w-full group-hover:bg-emerald-600" />
              </div>
            )
          })}
        </div>

      </div>
    </section>
  )
}
