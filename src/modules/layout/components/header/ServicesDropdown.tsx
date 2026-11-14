/**
 * @file ServicesDropdown.tsx
 * @description Desktop megamenu for AG POWER Solar Solutions.
 */
"use client"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { Home, Building2, Users2, Calculator, ArrowRight, SunMedium, ShieldCheck, Zap } from "lucide-react"

export default function ServicesDropdown() {
  return (
    <div
      className="invisible absolute left-1/2 top-full z-50 mt-3 w-[720px] -translate-x-1/2 rounded-[16px] border border-charcoal/10 bg-white p-5 opacity-0 shadow-[0_20px_50px_rgba(23,63,50,0.12)] transition-all duration-200 group-hover:visible group-hover:opacity-100"
    >
      <div className="mb-4 flex items-center justify-between border-b border-charcoal/8 pb-3">
        <div className="flex items-center gap-2">
          <SunMedium className="h-4 w-4 text-gold" />
          <span className="text-[12px] font-bold uppercase tracking-wider text-charcoal">
            AG POWER Solar Solutions
          </span>
        </div>
        <LocalizedClientLink
          href="/calculator"
          className="flex items-center gap-1 text-[12px] font-bold text-forest hover:text-gold"
        >
          <span>Calculate Savings</span>
          <ArrowRight className="h-3 w-3" />
        </LocalizedClientLink>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {/* Residential */}
        <LocalizedClientLink
          href="/services/residential-solar"
          className="group/item flex flex-col rounded-xl border border-transparent bg-ivory p-4 transition-all hover:border-forest/20 hover:bg-sage-mist"
        >
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-forest text-gold">
            <Home className="h-5 w-5" />
          </div>
          <h4 className="text-[15px] font-bold text-forest group-hover/item:text-forest">
            Residential Solar
          </h4>
          <p className="mt-1 text-[12px] leading-relaxed text-charcoal/80">
            Clean rooftop solar for independent homes & villas. Reduce electricity bills by up to 90%.
          </p>
          <span className="mt-3 inline-flex items-center gap-1 text-[12px] font-semibold text-forest">
            Learn More <ArrowRight className="h-3 w-3 transition-transform group-hover/item:translate-x-1" />
          </span>
        </LocalizedClientLink>

        {/* Commercial */}
        <LocalizedClientLink
          href="/services/commercial-solar"
          className="group/item flex flex-col rounded-xl border border-transparent bg-ivory p-4 transition-all hover:border-forest/20 hover:bg-sage-mist"
        >
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-forest text-gold">
            <Building2 className="h-5 w-5" />
          </div>
          <h4 className="text-[15px] font-bold text-forest group-hover/item:text-forest">
            Commercial Solar
          </h4>
          <p className="mt-1 text-[12px] leading-relaxed text-charcoal/80">
            High-efficiency solar systems for factories, offices, warehouses, and institutions.
          </p>
          <span className="mt-3 inline-flex items-center gap-1 text-[12px] font-semibold text-forest">
            Learn More <ArrowRight className="h-3 w-3 transition-transform group-hover/item:translate-x-1" />
          </span>
        </LocalizedClientLink>

        {/* Housing Society */}
        <LocalizedClientLink
          href="/services/housing-society-solar"
          className="group/item flex flex-col rounded-xl border border-transparent bg-ivory p-4 transition-all hover:border-forest/20 hover:bg-sage-mist"
        >
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-forest text-gold">
            <Users2 className="h-5 w-5" />
          </div>
          <h4 className="text-[15px] font-bold text-forest group-hover/item:text-forest">
            Housing Society
          </h4>
          <p className="mt-1 text-[12px] leading-relaxed text-charcoal/80">
            Solar power for lifts, water pumps, clubhouse, and society common lighting.
          </p>
          <span className="mt-3 inline-flex items-center gap-1 text-[12px] font-semibold text-forest">
            Learn More <ArrowRight className="h-3 w-3 transition-transform group-hover/item:translate-x-1" />
          </span>
        </LocalizedClientLink>
      </div>

      {/* Bottom strip */}
      <div className="mt-3 flex items-center justify-between rounded-lg bg-forest px-4 py-2.5 text-white">
        <div className="flex items-center gap-2 text-[12px]">
          <ShieldCheck className="h-4 w-4 text-gold" />
          <span>Tier-1 Modules · 25-Year Performance Warranty · MNRE Approved</span>
        </div>
        <LocalizedClientLink
          href="/solar-panels"
          className="flex items-center gap-1 text-[12px] font-bold text-gold hover:underline"
        >
          View Panels <ArrowRight className="h-3 w-3" />
        </LocalizedClientLink>
      </div>
    </div>
  )
}
