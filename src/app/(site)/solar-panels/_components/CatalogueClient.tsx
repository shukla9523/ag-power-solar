"use client"

import { useState, useMemo, useEffect, Suspense } from "react"
import Image from "next/image"
import { useSearchParams, useRouter } from "next/navigation"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { SolarPanel } from "@lib/data/solar-panels"
import {
  Search,
  CheckCircle2,
  X,
  SlidersHorizontal,
  ArrowRight,
} from "lucide-react"

interface Props {
  initialPanels: SolarPanel[]
}

function getPanelImage(slug: string): string {
  return `/panels/${slug}/main.webp?v=3`
}

function CatalogueClientContent({ initialPanels }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Initialize from searchParams
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
        // "recommended" default: keep natural catalogue order
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
            {/* Top Row: Search Input + Sort Dropdown */}
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

        {/* Panels Grid: Equal-Height Cards (3 per row desktop, 2 tablet, 1 mobile) */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 items-stretch w-full overflow-hidden">
          {filteredPanels.map((panel, idx) => {
            const cleanBrand = panel.brand.replace(" / Tier-1", "").trim()
            return (
              <div
                key={panel.id}
                className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-xs hover:border-forest/40 hover:shadow-md transition-all h-full w-full"
              >
                <div>
                  {/* Card Image: Clamped to 210-230px height, clean photo ONLY */}
                  <div className="relative h-[210px] sm:h-[225px] w-full overflow-hidden rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center p-3">
                    <Image
                      src={getPanelImage(panel.slug)}
                      alt={`${cleanBrand} ${panel.modelName}`}
                      fill
                      priority={idx < 6}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-contain p-2 transition-transform duration-300 group-hover:scale-105"
                    />

                    {/* Top Badges (Top Left: Admin Badge, Top Right: DCR Approved) */}
                    <div className="absolute top-2.5 inset-x-2.5 flex items-center justify-between pointer-events-none z-10">
                      {panel.badge ? (
                        <span className="rounded-md bg-forest px-2.5 py-0.5 text-[11px] font-bold text-white shadow-2xs">
                          {panel.badge}
                        </span>
                      ) : (
                        <span />
                      )}

                      {panel.dcrCompliant && (
                        <span className="rounded-md bg-amber-500 px-2.5 py-0.5 text-[10.5px] font-extrabold text-white shadow-2xs">
                          DCR Approved
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Brand & Model Title (12px brand, 18-19px title) */}
                  <div className="mt-3.5">
                    <span className="text-[12px] font-bold uppercase tracking-wider text-forest">
                      {cleanBrand}
                    </span>
                    <h2 className="mt-1 font-manrope text-[18px] sm:text-[19px] font-bold text-slate-900 leading-snug line-clamp-2">
                      {panel.modelName}
                    </h2>
                  </div>

                  {/* Wattage Range & Efficiency (Normal text below image) */}
                  <div className="mt-2 flex items-center flex-wrap gap-2 text-[12.5px] font-medium text-slate-600">
                    <span className="font-bold text-slate-900">{panel.wattageDisplay}</span>
                    <span className="text-slate-300">•</span>
                    <span className="font-semibold text-forest">{panel.efficiency}% Efficiency</span>
                    <span className="text-slate-300">•</span>
                    <span className="text-slate-500 truncate max-w-[140px]">{panel.cellTechnology}</span>
                  </div>

                  {/* Specs Table (14px font, compact) */}
                  <div className="mt-3.5 space-y-1 border-t border-slate-100 pt-2.5 text-[13.5px] sm:text-[14px]">
                    <div className="flex items-center justify-between py-1">
                      <span className="text-slate-500 font-medium">Dimensions:</span>
                      <span className="font-semibold text-slate-800 text-[13px] sm:text-[13.5px]">{panel.dimensions}</span>
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

                {/* Bottom-Pinned Action Buttons */}
                <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center gap-2.5">
                  <LocalizedClientLink
                    href={`/solar-panels/${panel.slug}`}
                    className="flex-1 inline-flex min-h-[40px] items-center justify-center rounded-xl border border-slate-300 bg-white hover:bg-slate-50 py-2 px-3 text-xs sm:text-[13px] font-bold text-slate-800 transition-colors shadow-2xs text-center"
                  >
                    <span>Full Specs</span>
                  </LocalizedClientLink>

                  <LocalizedClientLink
                    href={`/contact?panel=${panel.slug}`}
                    className="flex-1 inline-flex min-h-[40px] items-center justify-center gap-1 rounded-xl bg-forest hover:bg-forest-deep py-2 px-3 text-xs sm:text-[13px] font-bold text-white transition-all shadow-xs text-center"
                  >
                    <span>Enquire Now</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </LocalizedClientLink>
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
