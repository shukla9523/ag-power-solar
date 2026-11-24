"use client"

import { useState, useMemo, useEffect, Suspense } from "react"
import Image from "next/image"
import { useSearchParams, useRouter } from "next/navigation"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { SolarPanel } from "@lib/data/solar-panels"
import { getPanelCardImage } from "@lib/config/images"
import {
  Search,
  CheckCircle2,
  X,
  SlidersHorizontal,
  ArrowRight,
  Heart,
  Eye,
  Scale,
  Sparkles,
  Zap,
  ShieldCheck,
  Check,
} from "lucide-react"

interface Props {
  initialPanels: SolarPanel[]
}

function CatalogueClientContent({ initialPanels }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()

  // URL search params sync
  const paramSearch = searchParams.get("search") || ""
  const paramBrand = searchParams.get("brand") || "All"
  const paramTech = searchParams.get("tech") || "All"
  const paramWattage = searchParams.get("wattage") || "All"
  const paramDcr = searchParams.get("dcr") === "true"
  const paramSort = (searchParams.get("sort") as "recommended" | "wattage" | "efficiency") || "recommended"

  const [search, setSearch] = useState(paramSearch)
  const [brandFilter, setBrandFilter] = useState<string>(paramBrand)
  const [techFilter, setTechFilter] = useState<string>(paramTech)
  const [wattageFilter, setWattageFilter] = useState<string>(paramWattage)
  const [dcrFilter, setDcrFilter] = useState<boolean>(paramDcr)
  const [sortBy, setSortBy] = useState<"recommended" | "wattage" | "efficiency">(paramSort)

  // PHASE 2: Shortlist state (localStorage synced)
  const [shortlist, setShortlist] = useState<string[]>([])
  useEffect(() => {
    try {
      const saved = localStorage.getItem("ag_power_shortlist")
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed)) setShortlist(parsed)
      }
    } catch {}
  }, [])

  const toggleShortlist = (slug: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setShortlist((prev) => {
      const next = prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
      try {
        localStorage.setItem("ag_power_shortlist", JSON.stringify(next))
      } catch {}
      return next
    })
  }

  // PHASE 2: Compare state (Max 3 panels)
  const [compareList, setCompareList] = useState<string[]>([])
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false)

  const toggleCompare = (slug: string) => {
    setCompareList((prev) => {
      if (prev.includes(slug)) {
        return prev.filter((s) => s !== slug)
      }
      if (prev.length >= 3) {
        alert("You can compare up to 3 solar panels at a time.")
        return prev
      }
      return [...prev, slug]
    })
  }

  // Selected panels for comparison
  const comparedPanels = useMemo(() => {
    return initialPanels.filter((p) => compareList.includes(p.slug))
  }, [initialPanels, compareList])

  // Highest efficiency amongst compared panels
  const highestComparedEfficiency = useMemo(() => {
    if (comparedPanels.length === 0) return 0
    return Math.max(...comparedPanels.map((p) => p.efficiency))
  }, [comparedPanels])

  // PHASE 2: Quick View modal state
  const [quickViewPanel, setQuickViewPanel] = useState<SolarPanel | null>(null)

  // Distinct brands list
  const distinctBrands = useMemo(() => {
    const brands = Array.from(new Set(initialPanels.map((p) => p.brand.replace(" / Tier-1", "").trim())))
    return ["All", ...brands]
  }, [initialPanels])

  // Sync state to URL search params cleanly
  useEffect(() => {
    const params = new URLSearchParams()
    if (search) params.set("search", search)
    if (brandFilter !== "All") params.set("brand", brandFilter)
    if (techFilter !== "All") params.set("tech", techFilter)
    if (wattageFilter !== "All") params.set("wattage", wattageFilter)
    if (dcrFilter) params.set("dcr", "true")
    if (sortBy !== "recommended") params.set("sort", sortBy)

    const query = params.toString()
    router.replace(query ? `/solar-panels?${query}` : "/solar-panels", { scroll: false })
  }, [search, brandFilter, techFilter, wattageFilter, dcrFilter, sortBy, router])

  // Filtered & sorted list
  const filteredPanels = useMemo(() => {
    return initialPanels
      .filter((panel) => {
        const cleanBrand = panel.brand.replace(" / Tier-1", "").trim()
        const matchesBrand = brandFilter === "All" || cleanBrand.toLowerCase() === brandFilter.toLowerCase()

        const matchesSearch =
          panel.brand.toLowerCase().includes(search.toLowerCase()) ||
          panel.modelName.toLowerCase().includes(search.toLowerCase()) ||
          panel.cellTechnology.toLowerCase().includes(search.toLowerCase())

        const matchesTech = techFilter === "All" || panel.cellTechnology === techFilter
        const matchesDcr = !dcrFilter || panel.dcrCompliant

        let matchesWattage = true
        if (wattageFilter === "<500W") {
          matchesWattage = panel.wattage < 500
        } else if (wattageFilter === "500W-550W") {
          matchesWattage = panel.wattage >= 500 && panel.wattage <= 550
        } else if (wattageFilter === ">550W") {
          matchesWattage = panel.wattage > 550
        }

        return matchesBrand && matchesSearch && matchesTech && matchesDcr && matchesWattage
      })
      .sort((a, b) => {
        if (sortBy === "efficiency") {
          return b.efficiency - a.efficiency
        }
        if (sortBy === "wattage") {
          return b.wattage - a.wattage
        }
        return 0
      })
  }, [initialPanels, search, brandFilter, techFilter, wattageFilter, dcrFilter, sortBy])

  function resetAllFilters() {
    setSearch("")
    setBrandFilter("All")
    setTechFilter("All")
    setWattageFilter("All")
    setDcrFilter(false)
    setSortBy("recommended")
  }

  const hasActiveFilters =
    search !== "" ||
    brandFilter !== "All" ||
    techFilter !== "All" ||
    wattageFilter !== "All" ||
    dcrFilter ||
    sortBy !== "recommended"

  return (
    <div className="bg-slate-50/50 py-10 sm:py-14 lg:py-16">
      <div className="mx-auto w-full max-w-[1200px] px-4 sm:px-6 lg:px-8">
        
        {/* Header (Clean, Trustworthy, Solid Background) */}
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-slate-900 leading-tight">
            Solar Panels Catalogue
          </h1>
          <p className="mt-3.5 text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
            Explore verified photovoltaic modules from India&apos;s leading manufacturers. Compare N-Type TOPCon and Mono PERC specifications engineered for long-term rooftop generation.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="mt-8 sm:mt-10 rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-xs">
          <div className="flex flex-col gap-4">
            
            {/* Top Row: Search Input + Shortlist Badge + Sort Dropdown */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by brand, model, or technology..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/60 pl-10 pr-9 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-forest focus:bg-white focus:outline-none transition-colors"
                />
                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                    aria-label="Clear search"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>

              {/* Shortlist Badge & Enquiry Button (if active) */}
              {shortlist.length > 0 && (
                <LocalizedClientLink
                  href={`/contact?panels=${shortlist.join(",")}`}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-rose-50 border border-rose-200 px-3 py-2 text-xs font-bold text-rose-700 hover:bg-rose-100 transition-colors shadow-2xs"
                >
                  <Heart className="h-3.5 w-3.5 fill-rose-500 text-rose-500" />
                  <span>Enquire Shortlisted ({shortlist.length})</span>
                </LocalizedClientLink>
              )}

              {/* Sort By Dropdown */}
              <div className="flex items-center gap-2 self-end sm:self-auto flex-shrink-0">
                <SlidersHorizontal className="h-4 w-4 text-slate-500" />
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as "recommended" | "wattage" | "efficiency")}
                  className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-800 focus:border-forest focus:outline-none cursor-pointer"
                >
                  <option value="recommended">Recommended</option>
                  <option value="wattage">Highest Wattage</option>
                  <option value="efficiency">Highest Efficiency</option>
                </select>
              </div>
            </div>

            {/* Filter Pills Groups */}
            <div className="flex flex-col gap-3 border-t border-slate-100 pt-3.5 text-xs">
              {/* Brand Filter */}
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="font-semibold text-slate-500 min-w-[55px]">Brand:</span>
                {distinctBrands.map((brand) => (
                  <button
                    key={brand}
                    type="button"
                    onClick={() => setBrandFilter(brand)}
                    className={`rounded-lg px-2.5 py-1 font-semibold transition-all cursor-pointer ${
                      brandFilter === brand
                        ? "bg-forest text-white shadow-xs"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    {brand}
                  </button>
                ))}
              </div>

              {/* Technology & Wattage Filters */}
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
                {/* Tech Filter */}
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="font-semibold text-slate-500 min-w-[55px]">Tech:</span>
                  {["All", "N-Type TOPCon", "Mono PERC"].map((tech) => (
                    <button
                      key={tech}
                      type="button"
                      onClick={() => setTechFilter(tech)}
                      className={`rounded-lg px-2.5 py-1 font-semibold transition-all cursor-pointer ${
                        techFilter === tech
                          ? "bg-forest text-white shadow-xs"
                          : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                      }`}
                    >
                      {tech}
                    </button>
                  ))}
                </div>

                {/* Wattage Filter */}
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="font-semibold text-slate-500">Power:</span>
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
                      className={`rounded-lg px-2.5 py-1 font-semibold transition-all cursor-pointer ${
                        wattageFilter === item.val
                          ? "bg-forest text-white shadow-xs"
                          : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>

                {/* DCR Toggle (PM Surya Ghar) */}
                <button
                  type="button"
                  onClick={() => setDcrFilter(!dcrFilter)}
                  className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1 font-semibold transition-all cursor-pointer ${
                    dcrFilter
                      ? "border-forest bg-forest text-white shadow-xs"
                      : "border-slate-200 bg-white text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>DCR Only (PM Surya Ghar)</span>
                </button>

                {/* Reset Filters */}
                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={resetAllFilters}
                    className="text-xs font-semibold text-forest underline hover:text-forest-deep ml-auto cursor-pointer"
                  >
                    Reset all filters
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Panels Grid: Equal-Height Cards (3 desktop, 2 tablet, 1 mobile) with Hover Lift & Slow Zoom */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 items-stretch w-full transition-opacity duration-300">
          {filteredPanels.map((panel, idx) => {
            const cleanBrand = panel.brand.replace(" / Tier-1", "").trim()
            const isShortlisted = shortlist.includes(panel.slug)
            const isCompared = compareList.includes(panel.slug)

            return (
              <div
                key={panel.id}
                className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-forest/40 h-full w-full"
              >
                <div>
                  {/* Card Image: Clamped to 210-225px, clean photo, slow hover zoom */}
                  <div className="relative h-[210px] sm:h-[225px] w-full overflow-hidden rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center p-3">
                    <Image
                      src={getPanelCardImage(panel.slug)}
                      alt={`${cleanBrand} ${panel.modelName}`}
                      fill
                      priority={idx < 6}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-contain p-2 transition-transform duration-500 group-hover:scale-[1.04]"
                    />

                    {/* Top Left Admin Badge (Clean, no DCR burned text) */}
                    {panel.badge && (
                      <div className="absolute top-2.5 left-2.5 pointer-events-none z-10">
                        <span className="rounded-md bg-forest px-2.5 py-0.5 text-[11px] font-bold text-white shadow-2xs">
                          {panel.badge}
                        </span>
                      </div>
                    )}

                    {/* Top Right Heart (Shortlist button) */}
                    <button
                      type="button"
                      onClick={(e) => toggleShortlist(panel.slug, e)}
                      className={`absolute top-2.5 right-2.5 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 border transition-all active:scale-90 ${
                        isShortlisted
                          ? "border-rose-300 text-rose-500 shadow-xs"
                          : "border-slate-200 text-slate-400 hover:text-rose-500 hover:border-rose-200"
                      }`}
                      aria-label={isShortlisted ? "Remove from shortlist" : "Add to shortlist"}
                    >
                      <Heart className={`h-4 w-4 ${isShortlisted ? "fill-rose-500 text-rose-500" : ""}`} />
                    </button>

                    {/* Hover Quick View Trigger Pill */}
                    <div className="absolute bottom-2.5 inset-x-2.5 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                      <button
                        type="button"
                        onClick={() => setQuickViewPanel(panel)}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-white/95 px-3 py-1 text-[11.5px] font-bold text-slate-800 shadow-sm border border-slate-200 hover:bg-slate-50 active:scale-95"
                      >
                        <Eye className="h-3.5 w-3.5 text-forest" />
                        <span>Quick View</span>
                      </button>
                    </div>
                  </div>

                  {/* Brand & Model Title */}
                  <div className="mt-3.5">
                    <span className="text-[12px] font-bold uppercase tracking-wider text-forest">
                      {cleanBrand}
                    </span>
                    <h2 className="mt-1 font-manrope text-[18px] sm:text-[19px] font-bold text-slate-900 leading-snug line-clamp-2">
                      {panel.modelName}
                    </h2>
                  </div>

                  {/* Wattage Range & Efficiency */}
                  <div className="mt-2 flex items-center flex-wrap gap-2 text-[12.5px] font-medium text-slate-600">
                    <span className="font-bold text-slate-900">{panel.wattageDisplay}</span>
                    <span className="text-slate-300">•</span>
                    <span className="font-semibold text-forest">{panel.efficiency}% Efficiency</span>
                    <span className="text-slate-300">•</span>
                    <span className="text-slate-500 truncate max-w-[140px]">{panel.cellTechnology}</span>
                  </div>

                  {/* Specs Table (Compact 13-14px) */}
                  <div className="mt-3.5 space-y-1 border-t border-slate-100 pt-2.5 text-[13px] sm:text-[13.5px]">
                    <div className="flex items-center justify-between py-1">
                      <span className="text-slate-500 font-medium">Dimensions:</span>
                      <span className="font-semibold text-slate-800">{panel.dimensions}</span>
                    </div>
                    <div className="flex items-center justify-between py-1">
                      <span className="text-slate-500 font-medium">Weight:</span>
                      <span className="font-semibold text-slate-800">{panel.weightKg} kg</span>
                    </div>
                    <div className="flex items-center justify-between py-1">
                      <span className="text-slate-500 font-medium">Performance Warranty:</span>
                      <span className="font-bold text-forest">{panel.performanceWarrantyYears} Years</span>
                    </div>
                  </div>

                  {/* Key Advantages */}
                  <div className="mt-3 border-t border-slate-100 pt-2.5">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                      Key Technical Advantages:
                    </p>
                    <ul className="space-y-1 text-[12.5px] sm:text-[13px] text-slate-600">
                      {panel.keyBenefits.slice(0, 2).map((benefit, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                          <span className="line-clamp-1">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Compare Checkbox & Action Buttons */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col gap-2.5">
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer select-none text-[12px] font-semibold text-slate-600 hover:text-slate-900">
                      <input
                        type="checkbox"
                        checked={isCompared}
                        onChange={() => toggleCompare(panel.slug)}
                        className="h-4 w-4 rounded border-slate-300 text-forest focus:ring-forest cursor-pointer"
                      />
                      <span>Compare (Max 3)</span>
                    </label>

                    <button
                      type="button"
                      onClick={() => setQuickViewPanel(panel)}
                      className="text-[12px] font-semibold text-slate-500 hover:text-forest flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      <span>Preview</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <LocalizedClientLink
                      href={`/solar-panels/${panel.slug}`}
                      className="flex-1 inline-flex min-h-[38px] items-center justify-center rounded-xl border border-slate-300 bg-white hover:bg-slate-50 py-1.5 px-3 text-xs sm:text-[12.5px] font-bold text-slate-800 transition-colors shadow-2xs text-center"
                    >
                      <span>Full Specs</span>
                    </LocalizedClientLink>

                    <LocalizedClientLink
                      href={`/contact?panel=${panel.slug}`}
                      className="flex-1 inline-flex min-h-[38px] items-center justify-center gap-1 rounded-xl bg-forest hover:bg-forest-deep py-1.5 px-3 text-xs sm:text-[12.5px] font-bold text-white transition-all shadow-xs text-center"
                    >
                      <span>Enquire Now</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </LocalizedClientLink>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Empty State */}
        {filteredPanels.length === 0 && (
          <div className="mt-12 rounded-2xl border border-slate-200 bg-white p-10 sm:p-14 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-500 mb-3">
              <Search className="h-6 w-6" />
            </div>
            <h3 className="font-manrope text-lg font-bold text-slate-900">
              No solar panels match your active filters
            </h3>
            <p className="mt-1 text-sm text-slate-600 max-w-md mx-auto">
              Try adjusting your search keywords, clearing brand filters, or resetting the power range.
            </p>
            <button
              type="button"
              onClick={resetAllFilters}
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-forest hover:bg-forest-deep px-5 py-2.5 text-xs font-bold text-white shadow-xs transition-all cursor-pointer"
            >
              <span>Clear All Filters</span>
            </button>
          </div>
        )}

      </div>

      {/* PHASE 2: Sticky Compare Bar (Appears when 2+ panels are selected) */}
      {compareList.length >= 2 && (
        <div className="fixed bottom-0 inset-x-0 z-40 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 py-3 px-4 shadow-2xl text-white animate-in slide-in-from-bottom duration-300">
          <div className="mx-auto max-w-[1200px] flex flex-wrap items-center justify-between gap-4">
            
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Scale className="h-5 w-5 text-emerald-400" />
                <span className="text-sm font-bold">Compare ({compareList.length}/3 panels):</span>
              </div>

              <div className="flex items-center gap-2">
                {comparedPanels.map((p) => (
                  <div
                    key={p.slug}
                    className="flex items-center gap-1.5 rounded-lg bg-slate-800/90 border border-slate-700 px-2.5 py-1 text-xs"
                  >
                    <span className="font-semibold text-emerald-300 truncate max-w-[100px] sm:max-w-[140px]">
                      {p.modelName}
                    </span>
                    <button
                      type="button"
                      onClick={() => toggleCompare(p.slug)}
                      className="text-slate-400 hover:text-white"
                      aria-label="Remove from compare"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2.5 ml-auto">
              <button
                type="button"
                onClick={() => setCompareList([])}
                className="text-xs text-slate-400 hover:text-white underline cursor-pointer"
              >
                Clear All
              </button>

              <button
                type="button"
                onClick={() => setIsCompareModalOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-xl bg-forest hover:bg-forest-deep px-4 py-2 text-xs font-bold text-white shadow-md active:scale-95 cursor-pointer"
              >
                <span>Compare Side-by-Side</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PHASE 2: Compare Modal with Side-by-Side Specifications Table */}
      {isCompareModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 sm:p-6 backdrop-blur-xs overflow-y-auto"
        >
          <div className="relative w-full max-w-5xl rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden my-8">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 bg-slate-50">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-forest">
                  <Scale className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900">
                    Side-by-Side Solar Panel Comparison
                  </h3>
                  <p className="text-xs text-slate-500">
                    Compare electrical, physical, and warranty metrics from verified datasheets.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsCompareModalOpen(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-700"
                aria-label="Close comparison"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Comparison Table */}
            <div className="overflow-x-auto p-6">
              <table className="w-full text-left text-xs sm:text-sm border-collapse">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="py-3 px-4 font-bold text-slate-500 w-1/4 uppercase tracking-wider text-[11px]">
                      Parameter
                    </th>
                    {comparedPanels.map((p) => {
                      const isBestEfficiency = p.efficiency === highestComparedEfficiency
                      return (
                        <th key={p.slug} className="py-3 px-4 font-bold text-slate-900 w-1/4">
                          <div className="flex flex-col gap-1.5">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-forest">
                              {p.brand}
                            </span>
                            <span className="font-manrope text-[14px] sm:text-[15px] font-bold text-slate-900 line-clamp-2">
                              {p.modelName}
                            </span>
                            {isBestEfficiency && (
                              <span className="inline-flex items-center gap-1 self-start rounded-md bg-emerald-50 border border-emerald-300 px-2 py-0.5 text-[10.5px] font-extrabold text-emerald-800">
                                <Sparkles className="h-3 w-3 text-amber-500" />
                                Highest Efficiency
                              </span>
                            )}
                          </div>
                        </th>
                      )
                    })}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  <tr className="bg-slate-50/50">
                    <td className="py-3 px-4 font-semibold text-slate-600">Rated Power Range</td>
                    {comparedPanels.map((p) => (
                      <td key={p.slug} className="py-3 px-4 font-bold text-slate-900">
                        {p.wattageDisplay}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-semibold text-slate-600">Module Efficiency</td>
                    {comparedPanels.map((p) => (
                      <td key={p.slug} className="py-3 px-4 font-bold text-forest text-[14px]">
                        {p.efficiency}%
                      </td>
                    ))}
                  </tr>
                  <tr className="bg-slate-50/50">
                    <td className="py-3 px-4 font-semibold text-slate-600">Cell Technology</td>
                    {comparedPanels.map((p) => (
                      <td key={p.slug} className="py-3 px-4 font-medium text-slate-800">
                        {p.cellTechnology}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-semibold text-slate-600">Dimensions</td>
                    {comparedPanels.map((p) => (
                      <td key={p.slug} className="py-3 px-4 font-medium text-slate-800">
                        {p.dimensions}
                      </td>
                    ))}
                  </tr>
                  <tr className="bg-slate-50/50">
                    <td className="py-3 px-4 font-semibold text-slate-600">Weight</td>
                    {comparedPanels.map((p) => (
                      <td key={p.slug} className="py-3 px-4 font-medium text-slate-800">
                        {p.weightKg} kg
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-semibold text-slate-600">Performance Warranty</td>
                    {comparedPanels.map((p) => (
                      <td key={p.slug} className="py-3 px-4 font-bold text-forest">
                        {p.performanceWarrantyYears} Years Linear Output
                      </td>
                    ))}
                  </tr>
                  <tr className="bg-slate-50/50">
                    <td className="py-3 px-4 font-semibold text-slate-600">PM Surya Ghar Subsidy</td>
                    {comparedPanels.map((p) => (
                      <td key={p.slug} className="py-3 px-4">
                        {p.dcrCompliant ? (
                          <span className="inline-flex items-center gap-1 text-emerald-700 font-bold text-xs">
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                            Eligible (DCR Certified)
                          </span>
                        ) : (
                          <span className="text-slate-500 text-xs">Commercial / Non-DCR</span>
                        )}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-semibold text-slate-600">Action</td>
                    {comparedPanels.map((p) => (
                      <td key={p.slug} className="py-3 px-4">
                        <LocalizedClientLink
                          href={`/contact?panel=${p.slug}`}
                          className="inline-flex w-full items-center justify-center gap-1 rounded-xl bg-forest hover:bg-forest-deep px-3 py-2 text-xs font-bold text-white shadow-xs transition-all active:scale-95 text-center"
                        >
                          <span>Enquire Quote</span>
                          <ArrowRight className="h-3.5 w-3.5" />
                        </LocalizedClientLink>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>

          </div>
        </div>
      )}

      {/* PHASE 2: Quick View Modal */}
      {quickViewPanel && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 p-4 sm:p-6 backdrop-blur-xs"
        >
          <div className="relative w-full max-w-2xl rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-200">
            <button
              type="button"
              onClick={() => setQuickViewPanel(null)}
              className="absolute top-4 right-4 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              aria-label="Close modal"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
              <div className="relative aspect-[4/3] w-full rounded-xl bg-slate-50 border border-slate-100 overflow-hidden flex items-center justify-center">
                <Image
                  src={getPanelCardImage(quickViewPanel.slug)}
                  alt={quickViewPanel.modelName}
                  fill
                  sizes="(max-width: 640px) 100vw, 300px"
                  className="object-contain p-3"
                />
              </div>

              <div>
                <span className="text-[12px] font-bold uppercase tracking-wider text-forest">
                  {quickViewPanel.brand}
                </span>
                <h3 className="mt-1 font-manrope text-xl font-bold text-slate-900 leading-snug">
                  {quickViewPanel.modelName}
                </h3>

                <div className="mt-2.5 flex items-center gap-2 text-xs font-semibold text-slate-600">
                  <span className="rounded-md bg-slate-100 px-2 py-0.5 text-slate-800">
                    {quickViewPanel.wattageDisplay}
                  </span>
                  <span className="rounded-md bg-emerald-50 text-forest px-2 py-0.5">
                    {quickViewPanel.efficiency}% Eff.
                  </span>
                </div>

                <div className="mt-4 space-y-1.5 border-t border-slate-100 pt-3 text-xs text-slate-600">
                  <div className="flex justify-between py-0.5">
                    <span className="text-slate-500">Dimensions:</span>
                    <span className="font-semibold text-slate-900">{quickViewPanel.dimensions}</span>
                  </div>
                  <div className="flex justify-between py-0.5">
                    <span className="text-slate-500">Weight:</span>
                    <span className="font-semibold text-slate-900">{quickViewPanel.weightKg} kg</span>
                  </div>
                  <div className="flex justify-between py-0.5">
                    <span className="text-slate-500">Warranty:</span>
                    <span className="font-bold text-forest">{quickViewPanel.performanceWarrantyYears} Years</span>
                  </div>
                </div>

                <div className="mt-5 flex items-center gap-2.5">
                  <LocalizedClientLink
                    href={`/solar-panels/${quickViewPanel.slug}`}
                    className="flex-1 inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white hover:bg-slate-50 py-2 px-3 text-xs font-bold text-slate-800 shadow-2xs"
                  >
                    <span>Full Specifications</span>
                  </LocalizedClientLink>

                  <LocalizedClientLink
                    href={`/contact?panel=${quickViewPanel.slug}`}
                    className="flex-1 inline-flex items-center justify-center gap-1 rounded-xl bg-forest hover:bg-forest-deep py-2 px-3 text-xs font-bold text-white shadow-xs"
                  >
                    <span>Get Quote</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </LocalizedClientLink>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export default function CatalogueClient({ initialPanels }: Props) {
  return (
    <Suspense
      fallback={
        <div className="mx-auto w-full max-w-[1200px] px-4 sm:px-6 lg:px-8 py-16 text-center text-slate-500">
          Loading solar panels catalogue...
        </div>
      }
    >
      <CatalogueClientContent initialPanels={initialPanels} />
    </Suspense>
  )
}
