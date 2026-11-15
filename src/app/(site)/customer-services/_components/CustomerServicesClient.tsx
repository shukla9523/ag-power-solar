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

export default function CustomerServicesClient() {
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [serviceType, setServiceType] = useState("Solar Consultation")
  const [city, setCity] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")

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
          <div className="inline-flex items-center gap-2 rounded-full border border-forest/15 bg-sage-mist px-4 py-1 text-[13px] font-bold uppercase tracking-wider text-forest">
            <HeadphonesIcon className="h-4 w-4 text-gold" />
            <span>Dedicated Engineering Support</span>
          </div>
          <h1 className="mt-4 font-manrope text-[36px] font-extrabold tracking-tight text-forest sm:text-[48px]">
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
                Whether you need a new rooftop feasibility survey, AMC panel maintenance, or inverter repair, our engineers are ready to assist.
              </p>

              <div className="mt-8 space-y-4 border-t border-white/10 pt-6 text-[14px] text-sage">
                <div className="flex items-center gap-3">
                  <PhoneCall className="h-5 w-5 text-gold" />
                  <span>Helpline: <strong>+91 95234 67849</strong> (Mon - Sat, 9am - 7pm)</span>
                </div>
                <div className="flex items-center gap-3">
                  <ShieldCheck className="h-5 w-5 text-gold" />
                  <span>Certified Solar PV Technicians</span>
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
                  className="mt-6 rounded-xl bg-forest px-6 py-2.5 text-[14px] font-bold text-white"
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
                    className="mt-1 w-full rounded-xl border border-charcoal/20 bg-ivory px-4 py-2.5 text-[14px] focus:border-forest focus:outline-none"
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
                      className="mt-1 w-full rounded-xl border border-charcoal/20 bg-ivory px-4 py-2.5 text-[14px] focus:border-forest focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[13px] font-semibold text-forest">City</label>
                    <input
                      type="text"
                      placeholder="e.g. Jaipur"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-charcoal/20 bg-ivory px-4 py-2.5 text-[14px] focus:border-forest focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[13px] font-semibold text-forest">Service Required *</label>
                  <select
                    value={serviceType}
                    onChange={(e) => setServiceType(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-charcoal/20 bg-ivory px-4 py-2.5 text-[14px] focus:border-forest focus:outline-none"
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
                    className="mt-1 w-full rounded-xl border border-charcoal/20 bg-ivory px-4 py-2.5 text-[14px] focus:border-forest focus:outline-none"
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

      </div>
    </div>
  )
}
