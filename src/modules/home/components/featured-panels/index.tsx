/**
 * Section 8: Featured Solar Panels
 * Showcases Tier-1 panels with technical specs, efficiencies, and enquiry actions.
 */
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { Zap, ArrowRight, ShieldCheck, SunMedium, Layers, CheckCircle2 } from "lucide-react"

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
    badge: "Best Value",
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
  },
]

export default function FeaturedSolarPanels() {
  return (
    <section className="bg-white py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-forest/15 bg-sage-mist px-4 py-1 text-[13px] font-bold uppercase tracking-wider text-forest">
              <Layers className="h-4 w-4 text-forest" />
              <span>Technology Showcase</span>
            </div>
            <h2 className="mt-4 font-manrope text-[32px] font-extrabold tracking-tight text-forest sm:text-[40px]">
              High-Efficiency Tier-1 Solar Panels
            </h2>
            <p className="mt-3 text-[16px] text-charcoal/80">
              We deploy certified, high-yield photovoltaic modules with superior temperature coefficients and industry-leading linear warranties.
            </p>
          </div>

          <LocalizedClientLink
            href="/solar-panels"
            className="inline-flex min-h-[46px] items-center gap-2 rounded-xl border border-forest px-5 font-inter text-[14px] font-bold text-forest transition-colors hover:bg-forest hover:text-white"
          >
            <span>View Full Catalogue</span>
            <ArrowRight className="h-4 w-4" />
          </LocalizedClientLink>
        </div>

        {/* 3 Featured Panel Cards */}
        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {featuredPanels.map((panel) => (
            <div
              key={panel.id}
              className="group flex flex-col justify-between rounded-2xl border border-charcoal/10 bg-ivory p-7 shadow-sm transition-all duration-300 hover:border-forest/30 hover:shadow-xl"
            >
              <div>
                {/* Visual Panel Header */}
                <div className="relative flex h-48 w-full items-center justify-center rounded-xl bg-forest p-4 text-white overflow-hidden">
                  {/* Decorative grid representing PV cells */}
                  <div className="absolute inset-0 grid grid-cols-6 grid-rows-3 gap-1 p-2 opacity-25">
                    {[...Array(18)].map((_, i) => (
                      <div key={i} className="rounded border border-white/40 bg-white/10" />
                    ))}
                  </div>

                  <div className="relative z-10 text-center">
                    <span className="rounded-full bg-gold px-3 py-1 text-[11px] font-bold text-forest">
                      {panel.badge}
                    </span>
                    <p className="mt-3 font-manrope text-[32px] font-extrabold text-white">
                      {panel.wattage}
                    </p>
                    <p className="text-[12px] text-sage">{panel.technology}</p>
                  </div>
                </div>

                {/* Model Details */}
                <div className="mt-6">
                  <span className="text-[12px] font-bold uppercase tracking-wider text-charcoal-muted">
                    {panel.brand}
                  </span>
                  <h3 className="mt-1 font-manrope text-[20px] font-bold text-forest">
                    {panel.model}
                  </h3>
                </div>

                {/* Specs List */}
                <div className="mt-6 space-y-2.5 border-t border-charcoal/10 pt-5 text-[13px]">
                  <div className="flex items-center justify-between">
                    <span className="text-charcoal-muted">Module Efficiency:</span>
                    <span className="font-bold text-forest">{panel.efficiency}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-charcoal-muted">Bifacial Advantage:</span>
                    <span className="font-medium text-charcoal">{panel.bifaciality}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-charcoal-muted">Warranty Protection:</span>
                    <span className="font-medium text-charcoal">{panel.warranty}</span>
                  </div>
                  <div className="flex items-center justify-between border-t border-charcoal/8 pt-2">
                    <span className="text-charcoal-muted">Ideal Application:</span>
                    <span className="text-right font-medium text-forest">{panel.idealFor}</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-8 pt-4">
                <LocalizedClientLink
                  href={`/contact?panel=${panel.id}`}
                  className="inline-flex min-h-[44px] w-full items-center justify-center rounded-xl bg-forest px-4 font-inter text-[13px] font-bold text-white transition-all hover:bg-forest-deep"
                >
                  <span>Enquire About This Panel</span>
                  <ArrowRight className="ml-1.5 h-4 w-4 text-gold" />
                </LocalizedClientLink>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
