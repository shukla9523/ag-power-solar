"use client"

import { useState } from "react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import {
  Wrench,
  HeadphonesIcon,
  SunMedium,
  CheckCircle2,
  CalendarCheck,
  ShieldCheck,
  Zap,
  Activity,
  ArrowRight,
  PhoneCall,
  ChevronDown,
  MessageSquare,
  HelpCircle,
} from "lucide-react"

const servicesList = [
  {
    icon: SunMedium,
    title: "Zero-Cost Solar Consultation",
    desc: "Comprehensive energy audit and 3D shadow analysis by certified solar engineers to determine optimal system capacity and financial payback.",
  },
  {
    icon: Wrench,
    title: "Installation & Commissioning Assistance",
    desc: "Complete end-to-end execution: structural assembly, dual-glass panel placement, grid-tie inverter cabling, and dual safety earthing.",
  },
  {
    icon: Activity,
    title: "Annual Maintenance Contracts (AMC)",
    desc: "Scheduled periodic panel washing, electrical string diagnostics, torque checks, and thermal imaging to guarantee peak kWh generation.",
  },
  {
    icon: Zap,
    title: "Inverter Diagnostics & Technical Support",
    desc: "Rapid on-ground troubleshooting for solar inverters, bi-directional net-meters, surge protection devices (SPDs), and DC distribution boxes.",
  },
  {
    icon: ShieldCheck,
    title: "Net-Metering & DISCOM Liaison",
    desc: "Complete facilitation for DISCOM net-meter inspection, transformer capacity verification, CEIG approvals, and PM Surya Ghar subsidy portals.",
  },
  {
    icon: HeadphonesIcon,
    title: "Dedicated After-Sales Assistance",
    desc: "Lifetime technical assistance, warranty claim handling with Tier-1 manufacturers, and continuous monitoring app support.",
  },
]

const serviceFaqs = [
  {
    q: "How often does a rooftop solar plant require cleaning and maintenance?",
    a: "Under typical Indian environmental conditions, solar panels should be washed with soft, clean water once every 10 to 15 days in dry seasons. Regular washing removes airborne dust and bird droppings, restoring 8% to 12% generation that would otherwise be lost to soiling.",
  },
  {
    q: "What is included in an AG POWER Annual Maintenance Contract (AMC)?",
    a: "Our AMC packages include scheduled professional cleaning, electrical junction box inspections, DC/AC wiring terminal tightening, inverter error-log audits, string Voc/Isc health diagnostics, and priority on-call technician dispatch for unexpected grid faults.",
  },
  {
    q: "What should I do if my solar inverter displays an error code or red light?",
    a: "First check if your home grid power is active (grid-tied inverters automatically pause during grid outages for lineman safety). If grid power is available but generation remains halted, note the fault code on the inverter screen and call our technical support line at +91 95234 67849 for remote diagnosis or same-day technician dispatch.",
  },
  {
    q: "How does AG POWER handle manufacturer warranty claims?",
    a: "You do not have to struggle with third-party manufacturer portals. AG POWER facilitates all 10-15 year product warranty and 25-30 year linear output claims directly with Tier-1 brands (Waaree, Adani, Tata Power, Sungrow, Growatt), including module testing and RMA replacements.",
  },
  {
    q: "Do you provide assistance with DISCOM net-metering and government subsidies?",
    a: "Yes. Our operations team manages the entire administrative workflow: applying on the National PM Surya Ghar portal, liaisoning with your local DISCOM for transformer feasibility, coordinating bi-directional meter testing, and expediting Direct Benefit Transfer (DBT) subsidy disbursement.",
  },
  {
    q: "Is the initial rooftop feasibility survey truly zero cost?",
    a: "Yes. Our solar engineers visit your residential or commercial site, measure shadow-free rooftop area, evaluate electrical sanction load, and provide a 3D layout simulation and generation report completely free with no obligation to buy.",
  },
]

export default function CustomerServicesClient() {
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [serviceType, setServiceType] = useState("Solar Consultation")
  const [city, setCity] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")

  // FAQ Accordion State
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0)

  async function handleServiceSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setErrorMsg("")

    try {
      const payload = {
        name,
        phone,
        service: serviceType,
        city: city || "Not specified",
        enquiry_type: "Customer Service",
        source_page: "/customer-services",
        message: `Service Request: ${serviceType}. Customer note: ${message}`,
      }

      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        setSubmitted(true)
      } else {
        const data = await res.json().catch(() => ({}))
        setErrorMsg(data.error || "Submission failed. Please check your phone number.")
      }
    } catch {
      setErrorMsg("Network error. Please call +91 95234 67849.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="py-12 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="font-manrope text-[36px] font-extrabold tracking-tight text-forest sm:text-[48px]">
            Comprehensive Solar Customer Services
          </h1>
          <p className="mt-4 text-[16px] leading-relaxed text-charcoal/80 sm:text-[18px]">
            From pre-installation rooftop feasibility audits to lifelong maintenance contracts, AG POWER ensures your solar asset operates at peak generational efficiency.
          </p>
        </div>

        {/* 6 Services Grid */}
        <div className="mt-14 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {servicesList.map((svc, i) => {
            const Icon = svc.icon
            return (
              <div
                key={i}
                className="group flex flex-col justify-between rounded-3xl border border-charcoal/10 bg-white p-8 shadow-sm transition-all duration-300 hover:border-forest/30 hover:shadow-xl"
              >
                <div>
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-sage-mist text-forest transition-colors group-hover:bg-forest group-hover:text-gold">
                    <Icon className="h-7 w-7" />
                  </div>
                  <h3 className="mt-6 font-manrope text-[20px] font-bold text-forest">
                    {svc.title}
                  </h3>
                  <p className="mt-3 text-[14px] leading-relaxed text-charcoal/80">
                    {svc.desc}
                  </p>
                </div>
                <div className="mt-6 flex items-center gap-1.5 text-[13px] font-bold text-forest">
                  <CheckCircle2 className="h-4 w-4 text-gold" />
                  <span>Guaranteed SLA response</span>
                </div>
              </div>
            )
          })}
        </div>

        {/* Service Booking Request Section */}
        <div className="mt-16 overflow-hidden rounded-3xl bg-forest text-white shadow-2xl lg:grid lg:grid-cols-12">
          
          <div className="p-8 sm:p-12 lg:col-span-6 flex flex-col justify-between">
            <div>
              <span className="text-[12px] font-bold uppercase tracking-wider text-gold">
                Quick Assistance
              </span>
              <h2 className="mt-2 font-manrope text-[30px] font-extrabold sm:text-[38px]">
                Book a Solar Service or Site Inspection
              </h2>
              <p className="mt-4 text-[15px] leading-relaxed text-sage-mist/85">
                Whether you need a new rooftop feasibility survey, AMC panel maintenance, or inverter repair, our certified technicians are ready to assist.
              </p>

              <div className="mt-8 space-y-4 border-t border-white/10 pt-6 text-[14px] text-sage">
                <div className="flex items-center gap-3">
                  <PhoneCall className="h-5 w-5 text-gold flex-shrink-0" />
                  <span>Helpline: <strong className="text-white">+91 95234 67849</strong> (Mon - Sat, 9am - 7pm)</span>
                </div>
                <div className="flex items-center gap-3">
                  <ShieldCheck className="h-5 w-5 text-gold flex-shrink-0" />
                  <span>Certified Solar PV Technicians & Guaranteed Safety Norms</span>
                </div>
                <div className="flex items-center gap-3">
                  <CalendarCheck className="h-5 w-5 text-gold flex-shrink-0" />
                  <span>Rapid 24-48 Hour On-Ground Ticket Resolution</span>
                </div>
              </div>
            </div>

            <div className="mt-8 rounded-2xl bg-white/10 p-4 text-[13px] text-sage-mist">
              💡 <strong>Pro Tip:</strong> Regular panel washing every 15 days can restore up to 8-12% generation lost to ambient dust.
            </div>
          </div>

          <div className="bg-white p-8 sm:p-12 lg:col-span-6 text-charcoal">
            {submitted ? (
              <div className="py-12 text-center">
                <CheckCircle2 className="mx-auto h-12 w-12 text-forest" />
                <h3 className="mt-4 font-manrope text-[22px] font-bold text-forest">
                  Service Request Registered!
                </h3>
                <p className="mt-2 text-[14px] text-charcoal-muted">
                  Thank you, {name}. Our service manager will contact you within 2 business hours to confirm your appointment.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="mt-6 rounded-xl bg-forest px-6 py-2.5 text-[14px] font-bold text-white transition-colors hover:bg-forest-deep"
                >
                  Book Another Service
                </button>
              </div>
            ) : (
              <form onSubmit={handleServiceSubmit} className="space-y-4">
                <h3 className="font-manrope text-[20px] font-bold text-forest">
                  Request Service Consultation
                </h3>

                <div>
                  <label className="text-[13px] font-semibold text-forest">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Anil Verma"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-charcoal/20 bg-ivory px-4 py-2.5 text-[14px] text-charcoal focus:border-forest focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="text-[13px] font-semibold text-forest">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      placeholder="10-digit mobile"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-charcoal/20 bg-ivory px-4 py-2.5 text-[14px] text-charcoal focus:border-forest focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[13px] font-semibold text-forest">City</label>
                    <input
                      type="text"
                      placeholder="e.g. Jaipur"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-charcoal/20 bg-ivory px-4 py-2.5 text-[14px] text-charcoal focus:border-forest focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[13px] font-semibold text-forest">Service Required *</label>
                  <select
                    value={serviceType}
                    onChange={(e) => setServiceType(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-charcoal/20 bg-ivory px-4 py-2.5 text-[14px] font-medium text-forest focus:border-forest focus:outline-none"
                  >
                    <option value="Solar Consultation">Free Rooftop Solar Consultation</option>
                    <option value="Installation Feasibility">Installation & Feasibility Assessment</option>
                    <option value="AMC Maintenance">AMC & Panel Cleaning Package</option>
                    <option value="Inverter Support">Inverter Diagnostics & Technical Repair</option>
                    <option value="Net Metering Support">Net-Metering & Subsidy Assistance</option>
                  </select>
                </div>

                <div>
                  <label className="text-[13px] font-semibold text-forest">Requirement Details</label>
                  <textarea
                    rows={2}
                    placeholder="Tell us about your rooftop type or issue..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-charcoal/20 bg-ivory px-4 py-2.5 text-[14px] text-charcoal focus:border-forest focus:outline-none"
                  />
                </div>

                {errorMsg && (
                  <p className="text-[12px] font-semibold text-red-600">{errorMsg}</p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl bg-forest py-3 text-[14px] font-bold text-white shadow-md transition-all hover:bg-forest-deep disabled:opacity-50"
                >
                  {loading ? "Registering..." : "Submit Service Request →"}
                </button>
              </form>
            )}
          </div>

        </div>

        {/* Section: Contextual FAQs */}
        <div className="mt-20">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="font-manrope text-[30px] font-extrabold text-forest sm:text-[38px]">
              Frequently Asked Questions About Solar Services
            </h2>
            <p className="mt-3 text-[15px] text-charcoal/80">
              Clear answers regarding our maintenance protocols, inverter support, and warranty coverage.
            </p>
          </div>

          <div className="mx-auto mt-10 max-w-3xl space-y-4">
            {serviceFaqs.map((faq, index) => {
              const isOpen = openFaqIndex === index
              return (
                <div
                  key={index}
                  className="overflow-hidden rounded-2xl border border-charcoal/10 bg-white transition-all duration-200"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                    className="flex w-full items-center justify-between p-5 sm:p-6 text-left transition-colors hover:bg-sage-mist/20"
                  >
                    <span className="font-manrope text-[16px] sm:text-[17px] font-bold text-forest pr-4">
                      {faq.q}
                    </span>
                    <ChevronDown
                      className={`h-5 w-5 flex-shrink-0 text-forest transition-transform duration-300 ${
                        isOpen ? "rotate-180 text-gold" : ""
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="border-t border-charcoal/8 px-5 pb-6 pt-3 sm:px-6 text-[14px] leading-relaxed text-charcoal/85">
                      {faq.a}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Section: Final Contact CTA */}
        <div className="mt-16 rounded-3xl bg-sage-mist/50 p-8 sm:p-12 text-center border border-charcoal/10">
          <h3 className="font-manrope text-[24px] sm:text-[30px] font-extrabold text-forest">
            Need Immediate Technical Support?
          </h3>
          <p className="mx-auto mt-3 max-w-2xl text-[15px] leading-relaxed text-charcoal/80">
            Our solar engineers and customer support desk are available Monday through Saturday to answer any technical queries or dispatch maintenance teams.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="tel:+919523467849"
              className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-forest px-7 py-3 text-[14px] font-bold text-white shadow-sm transition-all hover:bg-forest-deep"
            >
              <PhoneCall className="h-4 w-4 text-gold" />
              <span>Call Helpline: +91 95234 67849</span>
            </a>
            <LocalizedClientLink
              href="/contact"
              className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl border border-forest bg-white px-7 py-3 text-[14px] font-bold text-forest transition-all hover:bg-ivory"
            >
              <span>Visit Contact Page</span>
              <ArrowRight className="h-4 w-4" />
            </LocalizedClientLink>
          </div>
        </div>

      </div>
    </div>
  )
}
