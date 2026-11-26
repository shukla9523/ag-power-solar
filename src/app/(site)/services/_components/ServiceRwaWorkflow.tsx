import React from "react"
import { ClipboardCheck, FileSpreadsheet, Users2, Wrench, LineChart } from "lucide-react"

/**
 * ServiceRwaWorkflow - 5-step roadmap specifically for Housing Society (RWA) solar adoption.
 * Helps RWAs align managing committees, residents, and DISCOM procedures smoothly.
 */
export default function ServiceRwaWorkflow() {
  const steps = [
    {
      num: "01",
      icon: ClipboardCheck,
      title: "Site Survey & Load Audit",
      description:
        "Comprehensive structural roof inspection, shadow analysis via 3D mapping, and past 12-month common utility bill analysis for lifts, common lighting, and pump motors.",
    },
    {
      num: "02",
      icon: FileSpreadsheet,
      title: "Proposal for Committee",
      description:
        "Customized Capex/Opex comparison report, estimated payback timeline, common maintenance savings projections, and DISCOM net-metering feasibility for the executive committee.",
    },
    {
      num: "03",
      icon: Users2,
      title: "AGM Approval Support",
      description:
        "AG POWER engineering presentation for General Body Meetings, clear Q&A resolution for residents, safety certifications, and structural clearance documentation.",
    },
    {
      num: "04",
      icon: Wrench,
      title: "Installation & Net-Metering",
      description:
        "Tier-1 TOPCon bifacial module erection, hot-dip galvanized elevated structures, chemical earthing pits, and turnkey DISCOM bi-directional net-meter synchronization.",
    },
    {
      num: "05",
      icon: LineChart,
      title: "Savings Tracking & O&M",
      description:
        "IoT cloud-based live energy monitoring app access for committee members, quarterly maintenance schedules, and guaranteed annual generation uptime.",
    },
  ]

  return (
    <section className="border-b border-charcoal/10 bg-ivory py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <span className="text-[13px] font-bold uppercase tracking-wider text-forest">
            Housing Society Roadmap
          </span>
          <h2 className="mt-2 font-manrope text-[28px] font-extrabold text-forest-deep sm:text-[36px] lg:text-[40px] tracking-tight">
            How It Works for RWAs &amp; Housing Societies
          </h2>
          <p className="mt-3 text-[15px] sm:text-[16px] text-charcoal/80">
            A structured, democratic 5-step process designed to simplify RWA committee decisions, ensure transparent resident buy-in, and streamline DISCOM approvals.
          </p>
        </div>

        {/* 5 Steps Grid */}
        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-5">
          {steps.map((step, idx) => {
            const Icon = step.icon
            return (
              <div
                key={idx}
                className="relative flex flex-col justify-between rounded-2xl border border-charcoal/10 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-forest/40 hover:shadow-md"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-manrope text-[24px] font-black text-forest/40">
                      {step.num}
                    </span>
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-forest/10 text-forest">
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>

                  <h3 className="mt-4 font-manrope text-[17px] font-bold text-forest-deep leading-snug">
                    {step.title}
                  </h3>
                  <p className="mt-2.5 text-[14px] leading-relaxed text-charcoal/75">
                    {step.description}
                  </p>
                </div>

                <div className="mt-5 border-t border-charcoal/5 pt-3">
                  <span className="text-[12px] font-semibold text-forest">
                    Step {idx + 1} of 5
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
