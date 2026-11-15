"use client"

import { useState, useMemo } from "react"
import { SolarPanel } from "@lib/data/solar-panels"
import {
  Layers,
  Search,
  Filter,
  Zap,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  X,
  Sparkles,
  PhoneCall,
  Info,
} from "lucide-react"

interface Props {
  initialPanels: SolarPanel[]
}

export default function CatalogueClient({ initialPanels }: Props) {
  const [search, setSearch] = useState("")
  const [techFilter, setTechFilter] = useState<string>("All")
  const [typeFilter, setTypeFilter] = useState<string>("All")
  const [sortBy, setSortBy] = useState<"wattage" | "efficiency">("wattage")

  // Modal detail state
  const [selectedPanel, setSelectedPanel] = useState<SolarPanel | null>(null)

  // Enquiry modal state
  const [enquiryPanel, setEnquiryPanel] = useState<SolarPanel | null>(null)
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [city, setCity] = useState("")
  const [message, setMessage] = useState("")
  const [enquirySent, setEnquirySent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")

  // Filtered & sorted list
  const filteredPanels = useMemo(() => {
    return initialPanels
      .filter((panel) => {
        const matchesSearch =
          panel.brand.toLowerCase().includes(search.toLowerCase()) ||
          panel.modelName.toLowerCase().includes(search.toLowerCase()) ||
          panel.cellTechnology.toLowerCase().includes(search.toLowerCase())

        const matchesTech =
          techFilter === "All" || panel.cellTechnology === techFilter

        const matchesType =
          typeFilter === "All" || panel.moduleType === typeFilter

        return matchesSearch && matchesTech && matchesType
      })
      .sort((a, b) => {
        if (sortBy === "efficiency") {
          return b.efficiency - a.efficiency
        }
        return b.wattage - a.wattage
      })
  }, [initialPanels, search, techFilter, typeFilter, sortBy])

  // Submit panel enquiry
  async function handlePanelEnquiry(e: React.FormEvent) {
    e.preventDefault()
    if (!enquiryPanel) return
    setLoading(true)
    setErrorMsg("")

    try {
      const payload = {
        name,
        phone,
        email,
        city: city || "Not specified",
        service: enquiryPanel.modelName,
        enquiry_type: "Catalogue",
        source_page: "/solar-panels",
        message: `Catalogue Enquiry for ${enquiryPanel.brand} - ${enquiryPanel.modelName} (${enquiryPanel.wattage}W). Additional Note: ${message}`,
      }

      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        setEnquirySent(true)
      } else {
        const data = await res.json().catch(() => ({}))
        setErrorMsg(data.error || "Submission failed. Please check your phone number.")
      }
    } catch (err) {
      setErrorMsg("Network error. Please call +91 95234 67849.")
    } finally {
      setLoading(false)
    }
  }

  function openEnquiry(panel: SolarPanel) {
    setEnquiryPanel(panel)
    setEnquirySent(false)
    setErrorMsg("")
  }

  return (
    <div className="py-12 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-forest/15 bg-sage-mist px-4 py-1 text-[13px] font-bold uppercase tracking-wider text-forest">
            <Layers className="h-4 w-4 text-gold" />
            <span>Product Discovery</span>
          </div>
          <h1 className="mt-4 font-manrope text-[36px] font-extrabold tracking-tight text-forest sm:text-[48px]">
            Tier-1 Solar Panels Catalogue
          </h1>
          <p className="mt-4 text-[16px] leading-relaxed text-charcoal/80 sm:text-[18px]">
            Discover industry-certified N-Type TOPCon and Mono PERC solar modules tested for maximum electrical yield and extreme durability.
          </p>
        </div>

        {/* Filter Controls Bar */}
        <div className="mt-12 rounded-2xl border border-charcoal/10 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            
            {/* Search Box */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal-muted" />
              <input
                type="text"
                placeholder="Search by brand, technology, or model..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-charcoal/15 bg-ivory pl-10 pr-4 py-2.5 text-[14px] text-charcoal focus:border-forest focus:outline-none"
              />
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="flex items-center gap-1.5">
                <span className="text-[12px] font-bold text-charcoal-muted">Tech:</span>
                {["All", "N-Type TOPCon", "Mono PERC"].map((tech) => (
                  <button
                    key={tech}
                    type="button"
                    onClick={() => setTechFilter(tech)}
                    className={`rounded-lg px-3 py-1.5 text-[12px] font-bold transition-all ${
                      techFilter === tech
                        ? "bg-forest text-white shadow-sm"
                        : "bg-ivory text-charcoal hover:bg-sage-mist"
                    }`}
                  >
                    {tech}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-1.5 ml-0 sm:ml-2">
                <span className="text-[12px] font-bold text-charcoal-muted">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="rounded-lg border border-charcoal/15 bg-ivory px-2.5 py-1.5 text-[12px] font-semibold text-forest"
                >
                  <option value="wattage">Highest Wattage</option>
                  <option value="efficiency">Highest Efficiency</option>
                </select>
              </div>

            </div>

          </div>
        </div>

        {/* Panels Grid */}
        <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filteredPanels.map((panel) => (
            <div
              key={panel.id}
              className="group flex flex-col justify-between rounded-3xl border border-charcoal/10 bg-white p-7 shadow-sm transition-all duration-300 hover:border-forest/30 hover:shadow-xl"
            >
              <div>
                {/* Visual Panel Head */}
                <div className="relative flex h-52 w-full flex-col justify-between rounded-2xl bg-forest p-5 text-white overflow-hidden">
                  <div className="absolute inset-0 grid grid-cols-6 grid-rows-3 gap-1 p-2 opacity-20 pointer-events-none">
                    {[...Array(18)].map((_, i) => (
                      <div key={i} className="rounded border border-white/50 bg-white/20" />
                    ))}
                  </div>

                  <div className="relative z-10 flex items-center justify-between">
                    <span className="rounded-full bg-gold px-3 py-0.5 text-[11px] font-extrabold text-forest">
                      {panel.badge || "Tier-1 ALMM"}
                    </span>
                    {panel.dcrCompliant && (
                      <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-[10px] font-bold text-white">
                        DCR Subsidy Approved
                      </span>
                    )}
                  </div>

                  <div className="relative z-10 text-center">
                    <p className="font-manrope text-[36px] font-black tracking-tight text-white">
                      {panel.wattage}W
                    </p>
                    <p className="text-[12px] font-semibold text-sage">{panel.moduleType}</p>
                  </div>

                  <div className="relative z-10 flex items-center justify-between border-t border-white/10 pt-2 text-[11px] text-sage">
                    <span>Eff: <strong>{panel.efficiency}%</strong></span>
                    <span>{panel.cellTechnology}</span>
                  </div>
                </div>

                {/* Model Title */}
                <div className="mt-5">
                  <span className="text-[12px] font-bold uppercase tracking-wider text-charcoal-muted">
                    {panel.brand}
                  </span>
                  <h3 className="mt-1 font-manrope text-[19px] font-bold text-forest">
                    {panel.modelName}
                  </h3>
                </div>

                {/* Specs List */}
                <div className="mt-5 space-y-2 border-t border-charcoal/8 pt-4 text-[13px]">
                  <div className="flex items-center justify-between">
                    <span className="text-charcoal-muted">Dimensions:</span>
                    <span className="font-medium text-charcoal">{panel.dimensions}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-charcoal-muted">Weight:</span>
                    <span className="font-medium text-charcoal">{panel.weightKg} kg</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-charcoal-muted">Linear Warranty:</span>
                    <span className="font-bold text-forest">
                      {panel.performanceWarrantyYears} Years
                    </span>
                  </div>
                </div>

                {/* Benefits Bullet List */}
                <div className="mt-4 border-t border-charcoal/8 pt-3">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-forest">
                    Key Advantages:
                  </p>
                  <ul className="mt-2 space-y-1.5 text-[12px] text-charcoal/90">
                    {panel.keyBenefits.slice(0, 2).map((b, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-forest" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>

              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex items-center gap-2 pt-4 border-t border-charcoal/8">
                <button
                  type="button"
                  onClick={() => setSelectedPanel(panel)}
                  className="flex-1 rounded-xl border border-forest py-2.5 text-[13px] font-bold text-forest transition-colors hover:bg-forest/5"
                >
                  View Full Specs
                </button>
                <button
                  type="button"
                  onClick={() => openEnquiry(panel)}
                  className="flex-1 rounded-xl bg-forest py-2.5 text-[13px] font-bold text-white shadow-sm transition-all hover:bg-forest-deep"
                >
                  Enquire Now
                </button>
              </div>

            </div>
          ))}
        </div>

        {/* Empty Search State */}
        {filteredPanels.length === 0 && (
          <div className="mt-12 rounded-2xl bg-white p-12 text-center border border-charcoal/10">
            <Info className="mx-auto h-10 w-10 text-charcoal-muted" />
            <h3 className="mt-3 font-manrope text-[18px] font-bold text-forest">
              No solar panels match your search
            </h3>
            <p className="mt-1 text-[14px] text-charcoal-muted">
              Try clearing your search filters or browse all modules.
            </p>
            <button
              type="button"
              onClick={() => { setSearch(""); setTechFilter("All"); setTypeFilter("All"); }}
              className="mt-4 rounded-xl bg-forest px-5 py-2 text-[13px] font-bold text-white"
            >
              Reset Filters
            </button>
          </div>
        )}

      </div>

      {/* Modal 1: Full Technical Specifications */}
      {selectedPanel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl sm:p-8">
            <button
              type="button"
              onClick={() => setSelectedPanel(null)}
              className="absolute right-5 top-5 rounded-full p-2 text-charcoal hover:bg-sage-mist"
            >
              <X className="h-6 w-6" />
            </button>

            <div className="flex items-center gap-3">
              <span className="rounded-full bg-gold px-3 py-1 text-[11px] font-bold text-forest">
                {selectedPanel.brand}
              </span>
              <span className="text-[13px] font-bold text-charcoal-muted">
                {selectedPanel.cellTechnology}
              </span>
            </div>

            <h2 className="mt-3 font-manrope text-[24px] font-extrabold text-forest">
              {selectedPanel.modelName}
            </h2>

            <div className="mt-6 grid grid-cols-2 gap-3 rounded-2xl bg-ivory p-4 text-[13px] sm:grid-cols-4">
              <div>
                <p className="text-charcoal-muted">Wattage</p>
                <p className="font-manrope text-[18px] font-bold text-forest">{selectedPanel.wattage}W</p>
              </div>
              <div>
                <p className="text-charcoal-muted">Efficiency</p>
                <p className="font-manrope text-[18px] font-bold text-forest">{selectedPanel.efficiency}%</p>
              </div>
              <div>
                <p className="text-charcoal-muted">Product Warranty</p>
                <p className="font-manrope text-[18px] font-bold text-forest">{selectedPanel.productWarrantyYears} Yrs</p>
              </div>
              <div>
                <p className="text-charcoal-muted">Power Warranty</p>
                <p className="font-manrope text-[18px] font-bold text-forest">{selectedPanel.performanceWarrantyYears} Yrs</p>
              </div>
            </div>

            <div className="mt-6 space-y-4 text-[14px]">
              <div>
                <h4 className="font-bold text-forest">Key Technical Advantages:</h4>
                <ul className="mt-2 space-y-2">
                  {selectedPanel.keyBenefits.map((b, i) => (
                    <li key={i} className="flex items-start gap-2 text-charcoal">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 text-forest" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="border-t border-charcoal/10 pt-4">
                <h4 className="font-bold text-forest">Ideal Applications:</h4>
                <ul className="mt-2 space-y-1.5 text-[13px] text-charcoal/80">
                  {selectedPanel.idealApplications.map((app, i) => (
                    <li key={i}>• {app}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-8 flex gap-3 border-t border-charcoal/10 pt-4">
              <button
                type="button"
                onClick={() => setSelectedPanel(null)}
                className="flex-1 rounded-xl border border-charcoal/20 py-3 text-[14px] font-bold text-charcoal"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  const p = selectedPanel
                  setSelectedPanel(null)
                  openEnquiry(p)
                }}
                className="flex-1 rounded-xl bg-forest py-3 text-[14px] font-bold text-white hover:bg-forest-deep"
              >
                Enquire About This Panel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 2: Direct Panel Enquiry Form */}
      {enquiryPanel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl sm:p-8">
            <button
              type="button"
              onClick={() => setEnquiryPanel(null)}
              className="absolute right-5 top-5 rounded-full p-2 text-charcoal hover:bg-sage-mist"
            >
              <X className="h-6 w-6" />
            </button>

            <span className="text-[12px] font-bold uppercase tracking-wider text-charcoal-muted">
              Product Enquiry
            </span>
            <h2 className="mt-1 font-manrope text-[22px] font-extrabold text-forest">
              Enquire: {enquiryPanel.brand} {enquiryPanel.wattage}W
            </h2>
            <p className="text-[13px] text-charcoal-muted">
              {enquiryPanel.modelName}
            </p>

            {enquirySent ? (
              <div className="mt-6 rounded-2xl bg-forest p-6 text-center text-white">
                <CheckCircle2 className="mx-auto h-10 w-10 text-gold" />
                <h3 className="mt-3 font-manrope text-[18px] font-bold text-white">
                  Enquiry Submitted!
                </h3>
                <p className="mt-2 text-[13px] text-sage">
                  Thank you! Our solar technology consultant will get in touch regarding module availability and pricing.
                </p>
                <button
                  type="button"
                  onClick={() => setEnquiryPanel(null)}
                  className="mt-6 rounded-xl bg-gold px-6 py-2.5 text-[14px] font-bold text-forest"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handlePanelEnquiry} className="mt-6 space-y-3.5">
                <div>
                  <label className="text-[13px] font-bold text-forest">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Kumar"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-charcoal/20 bg-ivory px-4 py-2.5 text-[14px] text-charcoal focus:border-forest focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label className="text-[13px] font-bold text-forest">Phone Number *</label>
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
                    <label className="text-[13px] font-bold text-forest">City</label>
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
                  <label className="text-[13px] font-bold text-forest">Email Address</label>
                  <input
                    type="email"
                    placeholder="email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-charcoal/20 bg-ivory px-4 py-2.5 text-[14px] text-charcoal focus:border-forest focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[13px] font-bold text-forest">Message / Requirements</label>
                  <textarea
                    rows={2}
                    placeholder="Approximate requirement or capacity needed..."
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
                  className="mt-2 w-full rounded-xl bg-forest py-3 text-[14px] font-bold text-white shadow-md transition-all hover:bg-forest-deep disabled:opacity-50"
                >
                  {loading ? "Submitting..." : "Submit Panel Enquiry →"}
                </button>
              </form>
            )}

          </div>
        </div>
      )}

    </div>
  )
}
