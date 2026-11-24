"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { getPanelBySlug } from "@data/panels"
import { Phone, Mail, MapPin, MessageSquare, SunMedium, ShieldCheck, CheckCircle2, ArrowRight, ExternalLink } from "lucide-react"

export default function ContactClient() {
  const searchParams = useSearchParams()
  const panelSlug = searchParams.get("panel")
  const panelsParam = searchParams.get("panels")

  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [category, setCategory] = useState("residential")
  const [city, setCity] = useState("Jaipur")
  const [pincode, setPincode] = useState("302020")
  const [service, setService] = useState("Rooftop Solar Installation")
  const [monthlyBill, setMonthlyBill] = useState("6000")
  const [message, setMessage] = useState("")
  const [consent, setConsent] = useState(true)
  const [honeypot, setHoneypot] = useState("") // anti-bot spam protection

  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")

  // Pre-fill message and enquiry if panel or shortlisted panels search param is provided
  useEffect(() => {
    if (panelsParam) {
      const panelNames = panelsParam.split(",").join(", ")
      setMessage(`I am interested in receiving an official quote and feasibility check for the shortlisted panels: ${panelNames}.`)
      setService("Solar Panel Enquiry")
    } else if (panelSlug) {
      const panel = getPanelBySlug(panelSlug)
      if (panel) {
        setMessage(`I am interested in a quotation and site feasibility assessment for ${panel.name} (${panel.wattageRange}).`)
        setService("Rooftop Solar Installation")
      }
    }
  }, [panelSlug, panelsParam])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!consent) {
      setErrorMsg("Please accept the privacy policy.")
      return
    }

    // Bot detection via honeypot
    if (honeypot) {
      setSubmitted(true)
      return
    }

    setLoading(true)
    setErrorMsg("")

    try {
      const payload = {
        name,
        phone,
        email,
        category,
        city,
        pincode,
        service,
        monthly_bill: monthlyBill,
        message,
        enquiry_type: "Contact",
        source_page: panelSlug ? `/contact?panel=${panelSlug}` : "/contact",
        consent: true,
      }

      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const data = await res.json().catch(() => ({}))

      if (res.ok && data.success) {
        setSubmitted(true)
      } else {
        // Preserves form data when a recoverable submission failure occurs
        setErrorMsg(data.error || "Submission failed. Please check your phone number.")
      }
    } catch {
      setErrorMsg("Network error. Please call +91 95234 67849.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="py-12 sm:py-16 lg:py-20 bg-ivory">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="font-manrope text-[36px] font-extrabold tracking-tight text-forest sm:text-[48px]">
            Get Your Free Solar Feasibility Consultation
          </h1>
          <p className="mt-4 text-[16px] leading-relaxed text-charcoal/80 sm:text-[18px]">
            Speak directly with our solar EPC engineers. We will analyze your monthly electricity bill, inspect rooftop shadow geometry, and provide a customized financial proposal.
          </p>
        </div>

        {/* Main Grid */}
        <div className="mt-14 grid grid-cols-1 gap-10 lg:grid-cols-12">

          {/* Left Column: Direct Contacts (5 cols) */}
          <div className="flex flex-col justify-between rounded-3xl bg-forest p-8 text-white shadow-xl sm:p-10 lg:col-span-5">
            <div>
              <span className="text-[12px] font-bold uppercase tracking-wider text-amber-400">
                Electro Global · AG POWER
              </span>
              <h2 className="mt-2 font-manrope text-[28px] font-extrabold text-white">
                Contact Information
              </h2>
              <p className="mt-3 text-[14px] leading-relaxed text-emerald-100/90">
                Our solar consultation team is available Monday to Saturday to answer technical questions and schedule on-site surveys.
              </p>

              <div className="mt-8 space-y-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-white/15 text-amber-400">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-[12px] font-semibold text-emerald-300">Direct Phone Line</p>
                    <a
                      href="tel:+919523467849"
                      className="font-manrope text-[18px] font-extrabold text-white hover:text-amber-300 transition-colors block mt-0.5"
                    >
                      +91 95234 67849
                    </a>
                    <p className="text-[12px] text-emerald-100/80 mt-0.5">Mon – Sat, 9:00 AM – 7:00 PM</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-white/15 text-amber-400">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-[12px] font-semibold text-emerald-300">Email Inquiries</p>
                    <a
                      href="mailto:akashshukla9523@gmail.com"
                      className="font-manrope text-[16px] font-bold text-white hover:text-amber-300 transition-colors block mt-0.5"
                    >
                      akashshukla9523@gmail.com
                    </a>
                    <p className="text-[12px] text-emerald-100/80 mt-0.5">Verified reply within 2 business hours</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-white/15 text-amber-400">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-[12px] font-semibold text-emerald-300">Corporate Office</p>
                    <p className="font-manrope text-[15.5px] font-bold text-white mt-0.5">
                      Electro Global Solar EPC Division, India
                    </p>
                    <p className="text-[12px] text-emerald-100/80 mt-0.5">Pan-India Solar EPC Execution</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 border-t border-white/15 pt-4 text-[12px] text-emerald-100/85">
              ✓ MNRE compliant vendor · 25-Year performance warranty · 100% turnkey DISCOM net-metering.
            </div>
          </div>

          {/* Right Column: Enquiry Form (7 cols) */}
          <div className="rounded-3xl border border-charcoal/10 bg-white p-8 shadow-sm sm:p-10 lg:col-span-7">
            {submitted ? (
              <div className="py-16 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-sage-mist text-forest">
                  <CheckCircle2 className="h-8 w-8 text-forest" />
                </div>
                <h3 className="mt-4 font-manrope text-[24px] font-bold text-forest">
                  Consultation Request Received!
                </h3>
                <p className="mx-auto mt-2 max-w-md text-[14px] leading-relaxed text-charcoal/70">
                  Thank you, <strong>{name}</strong>. Our solar engineering team has received your details and will call you on <strong>{phone}</strong> to discuss your feasibility assessment.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false)
                    setName("")
                    setPhone("")
                    setEmail("")
                    setMessage("")
                  }}
                  className="mt-6 rounded-xl bg-forest px-6 py-2.5 text-[14px] font-bold text-white transition-colors hover:bg-forest-deep"
                >
                  Submit Another Enquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Honeypot field for bot spam protection */}
                <input
                  type="text"
                  name="website"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                  style={{ display: "none" }}
                  tabIndex={-1}
                  autoComplete="off"
                />

                {/* Progress Header */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[12px] font-bold uppercase tracking-wider text-forest">
                      Step {step} of 3: {step === 1 ? "Property & Bill" : step === 2 ? "Location & Service" : "Contact Details"}
                    </span>
                    <span className="text-[11.5px] font-semibold text-slate-500">
                      {step === 1 ? "33%" : step === 2 ? "66%" : "100%"}
                    </span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-forest transition-all duration-300"
                      style={{ width: `${(step / 3) * 100}%` }}
                    />
                  </div>
                </div>

                {/* ── STEP 1: Property & Monthly Bill ── */}
                {step === 1 && (
                  <div className="space-y-4 pt-1">
                    <div>
                      <label className="text-[13px] font-semibold text-forest">Customer Category *</label>
                      <div className="mt-1.5 grid grid-cols-3 gap-2">
                        {[
                          { id: "residential", label: "Residential" },
                          { id: "commercial", label: "Commercial" },
                          { id: "society", label: "Housing Society" },
                        ].map((cat) => (
                          <button
                            key={cat.id}
                            type="button"
                            onClick={() => setCategory(cat.id)}
                            className={`rounded-xl border py-2.5 text-[13px] font-bold transition-all ${
                              category === cat.id
                                ? "border-forest bg-forest text-white shadow-sm"
                                : "border-charcoal/15 bg-ivory text-charcoal hover:bg-sage-mist"
                            }`}
                          >
                            {cat.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-[13px] font-semibold text-forest">
                        Average Monthly Electricity Bill (₹) *
                      </label>
                      <input
                        type="number"
                        required
                        placeholder="e.g. 6000"
                        value={monthlyBill}
                        onChange={(e) => setMonthlyBill(e.target.value)}
                        className="mt-1 w-full rounded-xl border border-charcoal/20 bg-ivory px-4 py-2.5 text-[14px] text-charcoal focus:border-forest focus:outline-none"
                      />
                      <p className="mt-1 text-[11px] text-slate-500">
                        Helps our engineers determine your solar KW capacity and subsidy slab.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="w-full rounded-xl bg-forest py-3 text-[14.5px] font-bold text-white shadow-md transition-all hover:bg-forest-deep flex items-center justify-center gap-2"
                    >
                      <span>Continue to Location</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                )}

                {/* ── STEP 2: Location & Service ── */}
                {step === 2 && (
                  <div className="space-y-4 pt-1">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label className="text-[13px] font-semibold text-forest">City / Location *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Jaipur, Rajasthan"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          className="mt-1 w-full rounded-xl border border-charcoal/20 bg-ivory px-4 py-2.5 text-[14px] text-charcoal focus:border-forest focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[13px] font-semibold text-forest">Pincode *</label>
                        <input
                          type="text"
                          required
                          placeholder="6-digit pincode"
                          maxLength={6}
                          value={pincode}
                          onChange={(e) => setPincode(e.target.value)}
                          className="mt-1 w-full rounded-xl border border-charcoal/20 bg-ivory px-4 py-2.5 text-[14px] text-charcoal focus:border-forest focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[13px] font-semibold text-forest">Service Required</label>
                      <select
                        value={service}
                        onChange={(e) => setService(e.target.value)}
                        className="mt-1 w-full rounded-xl border border-charcoal/20 bg-ivory px-4 py-2.5 text-[14px] font-medium text-forest focus:border-forest focus:outline-none"
                      >
                        <option value="Rooftop Solar Installation">Rooftop Solar Installation</option>
                        <option value="Commercial Solar Plant">Commercial &amp; Industrial Solar Plant</option>
                        <option value="Housing Society Solar">Housing Society Solar System</option>
                        <option value="Solar Panel Enquiry">Solar Panel Procurement &amp; Inverter</option>
                        <option value="Solar Consultation">General Solar Feasibility Consultation</option>
                      </select>
                    </div>

                    <div className="flex items-center gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="flex-1 rounded-xl border border-slate-300 bg-white py-3 text-[14px] font-bold text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        ← Back
                      </button>
                      <button
                        type="button"
                        onClick={() => setStep(3)}
                        className="flex-1 rounded-xl bg-forest py-3 text-[14px] font-bold text-white shadow-md hover:bg-forest-deep transition-all flex items-center justify-center gap-2"
                      >
                        <span>Continue</span>
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* ── STEP 3: Contact Info & Submission ── */}
                {step === 3 && (
                  <div className="space-y-4 pt-1">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label className="text-[13px] font-semibold text-forest">Full Name *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Ramesh Sharma"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="mt-1 w-full rounded-xl border border-charcoal/20 bg-ivory px-4 py-2.5 text-[14px] text-charcoal focus:border-forest focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[13px] font-semibold text-forest">Phone Number *</label>
                        <input
                          type="tel"
                          required
                          placeholder="10-digit mobile number"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="mt-1 w-full rounded-xl border border-charcoal/20 bg-ivory px-4 py-2.5 text-[14px] text-charcoal focus:border-forest focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[13px] font-semibold text-forest">Email Address (Optional)</label>
                      <input
                        type="email"
                        placeholder="e.g. name@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="mt-1 w-full rounded-xl border border-charcoal/20 bg-ivory px-4 py-2.5 text-[14px] text-charcoal focus:border-forest focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-[13px] font-semibold text-forest">Additional Project Details</label>
                      <textarea
                        rows={2}
                        placeholder="Tell us about your rooftop area, electrical load, or shortlisted panels..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="mt-1 w-full rounded-xl border border-charcoal/20 bg-ivory px-4 py-2.5 text-[14px] text-charcoal focus:border-forest focus:outline-none"
                      />
                    </div>

                    {/* Privacy Consent */}
                    <div className="flex items-start gap-2 pt-1">
                      <input
                        type="checkbox"
                        id="privacy-consent"
                        checked={consent}
                        onChange={(e) => setConsent(e.target.checked)}
                        className="mt-1 h-4 w-4 rounded border-charcoal/30 text-forest focus:ring-forest"
                      />
                      <label htmlFor="privacy-consent" className="text-[12px] text-charcoal-muted leading-relaxed">
                        I authorize AG POWER to contact me via phone or WhatsApp with my solar feasibility proposal.
                      </label>
                    </div>

                    {errorMsg && (
                      <p className="text-[12px] font-semibold text-red-600">{errorMsg}</p>
                    )}

                    <div className="flex items-center gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setStep(2)}
                        className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-[14px] font-bold text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        ← Back
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 rounded-xl bg-forest py-3.5 text-[15px] font-bold text-white shadow-md transition-all hover:bg-forest-deep disabled:opacity-50"
                      >
                        {loading ? "Submitting Request..." : "Submit Feasibility Request →"}
                      </button>
                    </div>
                  </div>
                )}
              </form>
            )}
          </div>

        </div>

        {/* Office Location & Map Section */}
        <div className="mt-16 overflow-hidden rounded-3xl border border-charcoal/10 bg-white p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-charcoal/10 pb-6">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-charcoal-muted">
                Locate Us
              </span>
              <h3 className="mt-1 font-manrope text-[22px] font-bold text-forest">
                Solar EPC Engineering Headquarters
              </h3>
              <p className="mt-1 text-[13px] text-charcoal/80">
                Electro Global Solar EPC Division · Pan-India Service Presence
              </p>
            </div>
            <a
              href="https://maps.google.com/?q=Jaipur,Rajasthan,India"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-forest bg-ivory px-4 py-2.5 text-[13px] font-bold text-forest hover:bg-forest hover:text-white transition-colors"
            >
              <span>Open in Google Maps</span>
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>

          <div className="mt-6 h-64 sm:h-80 w-full rounded-2xl overflow-hidden border border-charcoal/10 bg-sage-mist/30">
            <iframe
              title="AG POWER Solar Location Map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d227748.3825624477!2d75.65046970761273!3d26.88544791796718!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396c4adf4c57e281%3A0xce1c63a0cf22e09!2sJaipur%2C%20Rajasthan!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>

      </div>
    </div>
  )
}
