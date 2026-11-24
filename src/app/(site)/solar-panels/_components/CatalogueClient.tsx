"use client"

import { useState, useMemo } from "react"
import Image from "next/image"
import { SolarPanel } from "@lib/data/solar-panels"
import {
  Layers,
  Search,
  Zap,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  X,
  Sparkles,
  Info,
  Scale,
  Check,
  SlidersHorizontal,
} from "lucide-react"

interface Props {
  initialPanels: SolarPanel[]
}

function getPanelImage(brand: string, model: string): string {
  const b = (brand || "").toLowerCase()
  const m = (model || "").toLowerCase()
  if (b.includes("waaree") || m.includes("topcon") || m.includes("bifacial")) {
    return "/images/panels/waaree-topcon-bifacial.webp"
  }
  if (b.includes("adani") || m.includes("perc")) {
    return "/images/panels/adani-mono-perc.webp"
  }
  if (b.includes("tata") || m.includes("black")) {
    return "/images/panels/tata-power-all-black.webp"
  }
  return "/images/panels/waaree-topcon-bifacial.webp"
}

export default function CatalogueClient({ initialPanels }: Props) {
  const [search, setSearch] = useState("")
  const [techFilter, setTechFilter] = useState<string>("All")
  const [wattageFilter, setWattageFilter] = useState<string>("All")
  const [typeFilter, setTypeFilter] = useState<string>("All")
  const [dcrFilter, setDcrFilter] = useState<boolean>(false)
  const [sortBy, setSortBy] = useState<"wattage" | "efficiency">("wattage")

  // Modal detail state
  const [selectedPanel, setSelectedPanel] = useState<SolarPanel | null>(null)

  // Comparison state (up to 3 panels)
  const [compareIds, setCompareIds] = useState<string[]>([])
  const [showCompareModal, setShowCompareModal] = useState<boolean>(false)

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

        const matchesDcr = !dcrFilter || panel.dcrCompliant

        let matchesWattage = true
        if (wattageFilter === "<500W") {
          matchesWattage = panel.wattage < 500
        } else if (wattageFilter === "500W-550W") {
          matchesWattage = panel.wattage >= 500 && panel.wattage <= 550
        } else if (wattageFilter === ">550W") {
          matchesWattage = panel.wattage > 550
        }

        return matchesSearch && matchesTech && matchesType && matchesDcr && matchesWattage
      })
      .sort((a, b) => {
        if (sortBy === "efficiency") {
          return b.efficiency - a.efficiency
        }
        return b.wattage - a.wattage
      })
  }, [initialPanels, search, techFilter, wattageFilter, typeFilter, dcrFilter, sortBy])

  // Compare helpers
  function toggleCompare(panelId: string) {
    setCompareIds((prev) => {
      if (prev.includes(panelId)) {
        return prev.filter((id) => id !== panelId)
      }
      if (prev.length >= 3) {
        alert("You can compare up to 3 panels at once.")
        return prev
      }
      return [...prev, panelId]
    })
  }

  const comparedPanels = useMemo(() => {
    return initialPanels.filter((p) => compareIds.includes(p.id))
  }, [initialPanels, compareIds])

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
    } catch {
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

  function resetAllFilters() {
    setSearch("")
    setTechFilter("All")
    setWattageFilter("All")
    setTypeFilter("All")
    setDcrFilter(false)
  }

  return (
    <div className="py-12 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="font-manrope text-[36px] font-extrabold tracking-tight text-forest sm:text-[48px]">
            Solar Panels Catalogue
          </h1>
          <p className="mt-4 text-[16px] leading-relaxed text-charcoal/80 sm:text-[18px]">
            Explore verified solar modules from leading Indian manufacturers. Compare N-Type TOPCon and Mono PERC technologies designed for maximum rooftop yield and 25 to 30 years durability.
          </p>
        </div>

        {/* Filter Controls Bar */}
        <div className="mt-10 rounded-2xl border border-charcoal/10 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-4">
            
            {/* Search Box & Sort */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal-muted" />
                <input
                  type="text"
                  placeholder="Search by brand, technology, or model name..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-xl border border-charcoal/15 bg-ivory pl-10 pr-4 py-2.5 text-[14px] text-charcoal focus:border-forest focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[12px] font-bold text-charcoal-muted">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as "wattage" | "efficiency")}
                  className="rounded-lg border border-charcoal/15 bg-ivory px-3 py-2 text-[12px] font-semibold text-forest focus:outline-none"
                >
                  <option value="wattage">Highest Wattage</option>
                  <option value="efficiency">Highest Efficiency</option>
                </select>
              </div>
            </div>

            {/* Filter Pills Groups */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-charcoal/10 pt-4">
              {/* Tech Filter */}
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[12px] font-bold text-charcoal-muted">Tech:</span>
                {["All", "N-Type TOPCon", "Mono PERC"].map((tech) => (
                  <button
                    key={tech}
                    type="button"
                    onClick={() => setTechFilter(tech)}
                    className={`rounded-lg px-3 py-1 text-[12px] font-bold transition-all ${
                      techFilter === tech
                        ? "bg-forest text-white shadow-sm"
                        : "bg-ivory text-charcoal hover:bg-sage-mist"
                    }`}
                  >
                    {tech}
                  </button>
                ))}
              </div>

              {/* Wattage Filter */}
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[12px] font-bold text-charcoal-muted">Wattage:</span>
                {[
                  { label: "All", val: "All" },
                  { label: "< 500W", val: "<500W" },
                  { label: "500W - 550W", val: "500W-550W" },
                  { label: "> 550W", val: ">550W" },
                ].map((item) => (
                  <button
                    key={item.val}
                    type="button"
                    onClick={() => setWattageFilter(item.val)}
                    className={`rounded-lg px-3 py-1 text-[12px] font-bold transition-all ${
                      wattageFilter === item.val
                        ? "bg-forest text-white shadow-sm"
                        : "bg-ivory text-charcoal hover:bg-sage-mist"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              {/* DCR Toggle */}
              <button
                type="button"
                onClick={() => setDcrFilter(!dcrFilter)}
                className={`flex items-center gap-1.5 rounded-lg border px-3 py-1 text-[12px] font-bold transition-all ${
                  dcrFilter
                    ? "border-forest bg-forest text-white"
                    : "border-charcoal/15 bg-ivory text-charcoal hover:bg-sage-mist"
                }`}
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>DCR Only (PM Surya Ghar)</span>
              </button>

              {/* Active filters counter & reset */}
              {(techFilter !== "All" || wattageFilter !== "All" || typeFilter !== "All" || dcrFilter || search) && (
                <button
                  type="button"
                  onClick={resetAllFilters}
                  className="text-[12px] font-bold text-forest underline hover:text-forest-deep"
                >
                  Clear All Filters
                </button>
              )}
            </div>

          </div>
        </div>

        {/* Comparison Bar (Floating Bottom if items selected) */}
        {compareIds.length > 0 && (
          <div className="fixed bottom-6 left-1/2 z-40 -translate-x-1/2 rounded-2xl bg-forest px-6 py-3 text-white shadow-2xl flex items-center gap-4 border border-white/20 backdrop-blur-md">
            <div className="flex items-center gap-2">
              <Scale className="h-5 w-5 text-gold" />
              <span className="text-[13px] font-bold">
                {compareIds.length} {compareIds.length === 1 ? "panel" : "panels"} selected for comparison
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowCompareModal(true)}
                className="rounded-xl bg-white hover:bg-slate-100 px-4 py-1.5 text-[12px] font-extrabold text-slate-900 border border-slate-200 transition-transform hover:scale-105 shadow-sm"
              >
                Compare Now ({compareIds.length})
              </button>
              <button
                type="button"
                onClick={() => setCompareIds([])}
                className="rounded-lg bg-white/10 p-1.5 text-white/80 hover:bg-white/20"
                title="Clear comparison"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* Panels Grid */}
        <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filteredPanels.map((panel) => {
            const isCompared = compareIds.includes(panel.id)
            return (
              <div
                key={panel.id}
                className={`group flex flex-col justify-between rounded-3xl border bg-white p-7 shadow-sm transition-all duration-300 hover:shadow-xl ${
                  isCompared ? "border-forest ring-2 ring-forest" : "border-charcoal/10 hover:border-forest/30"
                }`}
              >
                <div>
                  {/* Real Solar Panel Photo with Spec Overlay */}
                  <div className="relative flex h-52 w-full flex-col justify-between rounded-2xl bg-slate-900 p-4 text-white overflow-hidden shadow-inner">
                    <Image
                      src={getPanelImage(panel.brand, panel.modelName)}
                      alt={`${panel.brand} ${panel.modelName}`}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-slate-950/60" />

                    <div className="relative z-10 flex items-center justify-between">
                      {panel.badge ? (
                        <span className="rounded-full bg-emerald-600/90 backdrop-blur-md px-3 py-0.5 text-[11px] font-extrabold text-white border border-white/20 shadow-sm">
                          {panel.badge}
                        </span>
                      ) : <span />}
                      {panel.dcrCompliant && (
                        <span className="rounded-full bg-slate-900/80 backdrop-blur-md px-2.5 py-0.5 text-[10px] font-bold text-amber-300 border border-amber-400/30">
                          DCR Approved
                        </span>
                      )}
                    </div>

                    <div className="relative z-10 text-center">
                      <p className="font-manrope text-[38px] font-black tracking-tight text-white drop-shadow-md">
                        {panel.wattage}W
                      </p>
                      <p className="text-[12px] font-bold text-amber-300">{panel.moduleType}</p>
                    </div>

                    <div className="relative z-10 flex items-center justify-between border-t border-white/20 pt-2 text-[11px] text-slate-200">
                      <span>Efficiency: <strong className="text-white">{panel.efficiency}%</strong></span>
                      <span className="font-medium text-emerald-300">{panel.cellTechnology}</span>
                    </div>
                  </div>

                  {/* Brand & Model Title */}
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
                      <span className="text-charcoal-muted">Performance Warranty:</span>
                      <span className="font-bold text-forest">
                        {panel.performanceWarrantyYears} Years
                      </span>
                    </div>
                  </div>

                  {/* Benefits Bullet List */}
                  <div className="mt-4 border-t border-charcoal/8 pt-3">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-forest">
                      Key Technical Advantages:
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

                {/* Compare Checkbox & Action Buttons */}
                <div className="mt-6 pt-4 border-t border-charcoal/8">
                  <div className="mb-3 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => toggleCompare(panel.id)}
                      className={`inline-flex items-center gap-1.5 text-[12px] font-bold transition-colors ${
                        isCompared ? "text-forest" : "text-charcoal-muted hover:text-forest"
                      }`}
                    >
                      <div className={`flex h-4 w-4 items-center justify-center rounded border ${
                        isCompared ? "border-forest bg-forest text-white" : "border-charcoal/30 bg-white"
                      }`}>
                        {isCompared && <Check className="h-3 w-3 stroke-[3]" />}
                      </div>
                      <span>{isCompared ? "Added to Compare" : "+ Add to Compare"}</span>
                    </button>
                    <span className="text-[11px] font-semibold text-charcoal-muted">
                      {panel.wattageDisplay}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedPanel(panel)}
                      className="flex-1 rounded-xl border border-forest py-2.5 text-[13px] font-bold text-forest transition-colors hover:bg-forest/5"
                    >
                      Full Specs
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

              </div>
            )
          })}
        </div>

        {/* Empty Search State */}
        {filteredPanels.length === 0 && (
          <div className="mt-12 rounded-2xl bg-white p-12 text-center border border-charcoal/10">
            <Info className="mx-auto h-10 w-10 text-charcoal-muted" />
            <h3 className="mt-3 font-manrope text-[18px] font-bold text-forest">
              No solar panels match your selected filters
            </h3>
            <p className="mt-1 text-[14px] text-charcoal-muted">
              Try resetting your filters or modifying your search keyword.
            </p>
            <button
              type="button"
              onClick={resetAllFilters}
              className="mt-4 rounded-xl bg-forest px-5 py-2.5 text-[13px] font-bold text-white"
            >
              Reset All Filters
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
              {selectedPanel.dcrCompliant && (
                <span className="rounded-full bg-forest/10 px-2.5 py-0.5 text-[11px] font-bold text-forest">
                  DCR Subsidy Approved
                </span>
              )}
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

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 text-[13px] border-t border-charcoal/10 pt-4">
              <div>
                <span className="text-charcoal-muted">Dimensions:</span>{" "}
                <span className="font-bold text-charcoal">{selectedPanel.dimensions}</span>
              </div>
              <div>
                <span className="text-charcoal-muted">Weight:</span>{" "}
                <span className="font-bold text-charcoal">{selectedPanel.weightKg} kg</span>
              </div>
              <div>
                <span className="text-charcoal-muted">Temp Coefficient:</span>{" "}
                <span className="font-bold text-charcoal">{selectedPanel.temperatureCoefficient}</span>
              </div>
              <div>
                <span className="text-charcoal-muted">Max System Voltage:</span>{" "}
                <span className="font-bold text-charcoal">{selectedPanel.maxSystemVoltage}</span>
              </div>
            </div>

            <div className="mt-6 space-y-4 text-[14px]">
              <div>
                <h4 className="font-bold text-forest">Key Technical Advantages:</h4>
                <ul className="mt-2 space-y-2">
                  {selectedPanel.keyBenefits.map((b, i) => (
                    <li key={i} className="flex items-start gap-2 text-charcoal">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 text-forest flex-shrink-0" />
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

      {/* Modal 2: Side-by-Side Panel Comparison */}
      {showCompareModal && comparedPanels.length > 0 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl sm:p-8">
            <button
              type="button"
              onClick={() => setShowCompareModal(false)}
              className="absolute right-5 top-5 rounded-full p-2 text-charcoal hover:bg-sage-mist"
            >
              <X className="h-6 w-6" />
            </button>

            <div className="flex items-center gap-2">
              <Scale className="h-5 w-5 text-gold" />
              <h2 className="font-manrope text-[24px] font-extrabold text-forest">
                Solar Panel Specifications Comparison
              </h2>
            </div>
            <p className="mt-1 text-[13px] text-charcoal-muted">
              Comparing technical specifications of {comparedPanels.length} Tier-1 solar modules.
            </p>

            <div className="mt-6 overflow-x-auto">
              <table className="w-full text-left text-[13px]">
                <thead>
                  <tr className="border-b border-charcoal/10">
                    <th className="py-3 pr-4 font-bold text-charcoal-muted w-1/4">Specification</th>
                    {comparedPanels.map((p) => (
                      <th key={p.id} className="py-3 px-3 font-bold text-forest">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-charcoal-muted block">
                          {p.brand}
                        </span>
                        {p.modelName}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-charcoal/8">
                  <tr>
                    <td className="py-2.5 pr-4 font-semibold text-charcoal-muted">Wattage</td>
                    {comparedPanels.map((p) => (
                      <td key={p.id} className="py-2.5 px-3 font-bold text-forest">
                        {p.wattage}W
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-2.5 pr-4 font-semibold text-charcoal-muted">Cell Technology</td>
                    {comparedPanels.map((p) => (
                      <td key={p.id} className="py-2.5 px-3 font-medium text-charcoal">
                        {p.cellTechnology}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-2.5 pr-4 font-semibold text-charcoal-muted">Module Type</td>
                    {comparedPanels.map((p) => (
                      <td key={p.id} className="py-2.5 px-3 font-medium text-charcoal">
                        {p.moduleType}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-2.5 pr-4 font-semibold text-charcoal-muted">Module Efficiency</td>
                    {comparedPanels.map((p) => (
                      <td key={p.id} className="py-2.5 px-3 font-bold text-forest">
                        {p.efficiency}%
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-2.5 pr-4 font-semibold text-charcoal-muted">DCR Status</td>
                    {comparedPanels.map((p) => (
                      <td key={p.id} className="py-2.5 px-3 font-medium">
                        {p.dcrCompliant ? (
                          <span className="text-forest font-bold">DCR Approved (Govt Subsidy)</span>
                        ) : (
                          <span className="text-charcoal-muted">Non-DCR</span>
                        )}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-2.5 pr-4 font-semibold text-charcoal-muted">Dimensions</td>
                    {comparedPanels.map((p) => (
                      <td key={p.id} className="py-2.5 px-3 text-charcoal">
                        {p.dimensions}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-2.5 pr-4 font-semibold text-charcoal-muted">Weight</td>
                    {comparedPanels.map((p) => (
                      <td key={p.id} className="py-2.5 px-3 text-charcoal">
                        {p.weightKg} kg
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-2.5 pr-4 font-semibold text-charcoal-muted">Product Warranty</td>
                    {comparedPanels.map((p) => (
                      <td key={p.id} className="py-2.5 px-3 font-bold text-charcoal">
                        {p.productWarrantyYears} Years
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-2.5 pr-4 font-semibold text-charcoal-muted">Linear Performance Warranty</td>
                    {comparedPanels.map((p) => (
                      <td key={p.id} className="py-2.5 px-3 font-bold text-forest">
                        {p.performanceWarrantyYears} Years
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-4 pr-4 font-semibold text-charcoal-muted">Enquiry Action</td>
                    {comparedPanels.map((p) => (
                      <td key={p.id} className="py-4 px-3">
                        <button
                          type="button"
                          onClick={() => {
                            setShowCompareModal(false)
                            openEnquiry(p)
                          }}
                          className="w-full rounded-xl bg-forest py-2 px-3 text-[12px] font-bold text-white transition-all hover:bg-forest-deep"
                        >
                          Enquire About {p.brand}
                        </button>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-6 flex justify-end border-t border-charcoal/10 pt-4">
              <button
                type="button"
                onClick={() => setShowCompareModal(false)}
                className="rounded-xl border border-charcoal/20 px-6 py-2.5 text-[13px] font-bold text-charcoal"
              >
                Close Comparison
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 3: Direct Panel Enquiry Form */}
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
                  className="mt-6 rounded-xl bg-emerald-600 hover:bg-emerald-500 px-6 py-2.5 text-[14px] font-bold text-white shadow-md transition-all active:scale-95"
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
