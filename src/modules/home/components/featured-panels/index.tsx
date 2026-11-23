import React from "react"
import Image from "next/image"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { ArrowRight, CheckCircle2, ShieldCheck, Zap, Award, Sparkles, TrendingDown } from "lucide-react"

const featuredPanels = [
  {
    id: "topcon-bifacial-550w",
    brand: "Waaree Solar",
    model: "N-Type TOPCon Dual-Glass Bifacial",
    wattage: "550W - 580W",
    technology: "N-Type TOPCon Bifacial",
    efficiency: "22.6%",
    bifaciality: "Up to 80% rear side gain",
    warranty: "12-Yr Product / 30-Yr Linear Power",
    idealFor: "Commercial rooftops & High-yield residences",
    badge: "Highest Efficiency",
    image: "/images/panels/waaree-topcon-bifacial.webp",
    customerBenefit: {
      tag: "Up to 90% Bill Savings",
      highlight: "+25% Extra Generation from Rear Glass",
      points: [
        "Cuts monthly electricity bills by up to 90%",
        "Direct PM Surya Ghar subsidy eligible (up to ₹78,000)",
        "30-Year linear power warranty guarantees long-term output",
        "Dual-glass structure survives 150 km/h wind & hailstorms",
      ],
    },
  },
  {
    id: "mono-perc-540w",
    brand: "Adani Solar",
    model: "Mono PERC Half-Cut MBB Module",
    wattage: "540W - 550W",
    technology: "Mono PERC Monofacial",
    efficiency: "21.3%",
    bifaciality: "Front side optimized",
    warranty: "12-Yr Product / 25-Yr Linear Power",
    idealFor: "Standard residential rooftops & Villas",
    badge: "Best Value & Fast Payback",
    image: "/images/panels/adani-mono-perc.webp",
    customerBenefit: {
      tag: "3.2-Year Fast ROI",
      highlight: "Lowest Capital Cost per Watt in India",
      points: [
        "Fastest payback period with immediate grid bill savings",
        "Full DISCOM net-metering & ALMM Tier-1 compliance",
        "Half-cut multi-busbar cells minimize tree & building shadow loss",
        "25-Year performance warranty backed by Adani Solar",
      ],
    },
  },
  {
    id: "all-black-450w",
    brand: "Tata Power Solar",
    model: "Architectural All-Black Premium Series",
    wattage: "440W - 460W",
    technology: "N-Type Monocrystalline",
    efficiency: "22.1%",
    bifaciality: "Full matte black aesthetic",
    warranty: "15-Yr Product / 25-Yr Linear Power",
    idealFor: "Modern luxury architectural residences",
    badge: "Architectural Choice",
    image: "/images/panels/tata-power-all-black.webp",
    customerBenefit: {
      tag: "Luxury Villa Aesthetics",
      highlight: "Seamless Full Matte Black Finish",
      points: [
        "Blends seamlessly with modern rooftop architecture",
        "Superior generation even during extreme 45°C+ summer heat",
        "Backed by 25-Year Tata Power reliability & trust",
        "Anti-dust hydrophobic coating reduces cleaning effort",
      ],
    },
  },
]

export default function FeaturedSolarPanels() {
  return (
    <section className="bg-white py-24" id="solar-panels">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200/80 bg-emerald-100 px-3.5 py-1 text-[11px] sm:text-[12px] font-bold uppercase tracking-wider text-forest-deep mb-3">
              <Award className="h-3.5 w-3.5 text-emerald-600" />
              <span>Certified Hardware</span>
            </div>
            <h2 className="font-manrope text-[32px] sm:text-[40px] font-extrabold tracking-tight text-forest-deep leading-[1.2]">
              High-Efficiency <span className="text-emerald-600">Tier-1 Solar Panels</span>
            </h2>
            <p className="mt-3 max-w-[700px] text-[16px] text-slate-600">
              Real high-efficiency photovoltaic modules engineered for maximum generation, harsh Indian weather durability, and guaranteed 25–30 year customer returns.
            </p>
          </div>

          <LocalizedClientLink
            href="/solar-panels"
            className="inline-flex min-h-[46px] w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-white hover:bg-emerald-50/50 border border-emerald-300 px-5 font-inter text-[14px] font-bold text-forest-deep transition-all shadow-sm active:scale-95 text-center"
          >
            <span>View Full Catalogue</span>
            <ArrowRight className="h-4 w-4 text-emerald-700" />
          </LocalizedClientLink>
        </div>

        {/* 3 Featured Panel Cards with Real Photos & Customer Benefits */}
        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {featuredPanels.map((panel, idx) => (
            <div
              key={panel.id}
              className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-emerald-200/80 bg-white shadow-sm transition-all duration-300 hover:border-emerald-400 hover:shadow-[0_12px_32px_rgba(22,163,74,0.12)] hover:-translate-y-1"
            >
              <div>
                {/* ── Real Solar Panel Photo with Customer Benefits Overlay ── */}
                <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-slate-900">
                  <Image
                    src={panel.image}
                    alt={`${panel.brand} ${panel.model}`}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    priority={idx === 0}
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                  />

                  {/* Directional Scrim for Maximum Text Readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 via-50% to-transparent" />

                  {/* Top Floating Badges */}
                  <div className="absolute top-3.5 inset-x-3.5 flex items-center justify-between z-10">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600/95 px-3 py-1 text-[11px] font-extrabold uppercase tracking-wide text-white backdrop-blur-md shadow-md border border-white/20">
                      <Sparkles className="h-3 w-3 text-amber-300" />
                      <span>{panel.badge}</span>
                    </span>

                    <span className="rounded-full bg-slate-950/85 px-3 py-1 font-manrope text-[13px] font-black text-amber-400 backdrop-blur-md shadow-md border border-white/20">
                      {panel.wattage}
                    </span>
                  </div>

                  {/* Bottom Overlaid Customer Benefit Bar */}
                  <div className="absolute bottom-3.5 inset-x-3.5 z-10">
                    <div className="rounded-xl border border-white/25 bg-slate-950/80 p-3 text-white backdrop-blur-md shadow-xl">
                      <div className="flex items-center gap-2">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-400 text-slate-950 flex-shrink-0">
                          <Zap className="h-3 w-3 fill-current" />
                        </span>
                        <p className="font-manrope text-[13.5px] font-extrabold text-amber-300">
                          {panel.customerBenefit.tag}
                        </p>
                      </div>
                      <p className="mt-1 text-[11.5px] font-medium text-slate-200 line-clamp-1">
                        {panel.customerBenefit.highlight}
                      </p>
                    </div>
                  </div>
                </div>

                {/* ── Card Content: Brand & Customer Advantages ── */}
                <div className="p-6 sm:p-7">
                  {/* Brand & Model */}
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] font-extrabold uppercase tracking-wider text-emerald-700">
                      {panel.brand}
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-bold text-slate-700">
                      <Award className="h-3 w-3 text-emerald-600" />
                      Tier-1 ALMM
                    </span>
                  </div>

                  <h3 className="mt-2 font-manrope text-[20px] font-extrabold leading-snug text-slate-900 group-hover:text-emerald-700 transition-colors">
                    {panel.model}
                  </h3>

                  <p className="mt-1 text-[12.5px] font-semibold text-slate-500">
                    {panel.technology}
                  </p>

                  {/* Customer Benefits Checklist */}
                  <div className="mt-5 rounded-2xl bg-emerald-50/50 border border-emerald-100 p-4">
                    <p className="text-[11.5px] font-extrabold uppercase tracking-wider text-emerald-900">
                      Direct Customer Benefits:
                    </p>
                    <ul className="mt-2.5 space-y-2">
                      {panel.customerBenefit.points.map((pt, i) => (
                        <li key={i} className="flex items-start gap-2 text-[12.5px] text-slate-700 font-medium">
                          <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Technical Specifications Grid */}
                  <div className="mt-5 grid grid-cols-2 gap-3 border-t border-slate-100 pt-4 text-[12.5px]">
                    <div className="rounded-xl bg-slate-50 p-2.5">
                      <span className="text-slate-500 block text-[11px]">Efficiency</span>
                      <strong className="font-manrope font-extrabold text-slate-900 text-[14px]">
                        {panel.efficiency}
                      </strong>
                    </div>

                    <div className="rounded-xl bg-slate-50 p-2.5">
                      <span className="text-slate-500 block text-[11px]">Warranty</span>
                      <strong className="font-manrope font-extrabold text-slate-900 text-[13px]">
                        {panel.warranty.split("/")[1] || panel.warranty}
                      </strong>
                    </div>

                    <div className="rounded-xl bg-slate-50 p-2.5 col-span-2">
                      <span className="text-slate-500 block text-[11px]">Best Suited For</span>
                      <span className="font-medium text-slate-800 text-[12px]">
                        {panel.idealFor}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Button: Main Green Button */}
              <div className="p-6 sm:p-7 pt-0">
                <LocalizedClientLink
                  href={`/contact?panel=${panel.id}`}
                  className="inline-flex min-h-[48px] w-full items-center justify-center rounded-xl bg-emerald-600 hover:bg-emerald-500 px-5 font-inter text-[14px] font-extrabold text-white shadow-md transition-all active:scale-95"
                >
                  <span>Enquire For This Panel</span>
                  <ArrowRight className="ml-2 h-4 w-4 text-white" />
                </LocalizedClientLink>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
