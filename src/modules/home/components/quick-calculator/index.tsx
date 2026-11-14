"use client"

import { useState, useMemo } from "react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { Calculator, ArrowRight, Sun, Zap, IndianRupee, ShieldCheck } from "lucide-react"

type CustomerCategory = "residential" | "commercial" | "society"

export default function QuickCalculator() {
  const [category, setCategory] = useState<CustomerCategory>("residential")
  const [monthlyBill, setMonthlyBill] = useState<number>(5000)
  const [location, setLocation] = useState<string>("")

  // Calculation estimates
  const estimates = useMemo(() => {
    // Tariff assumptions per category
    const tariff = category === "commercial" ? 10.5 : category === "society" ? 8.5 : 7.5
    // Monthly units consumed
    const monthlyUnits = monthlyBill / tariff
    // 1 kW generates ~125 units per month in India
    let rawKw = monthlyUnits / 125
    let recommendedKw = Math.max(1, Math.round(rawKw * 10) / 10)
    
    // Cap residential preview at 15kW, commercial up to 100kW
    if (category === "residential") {
      recommendedKw = Math.min(15, recommendedKw)
    }

    // Cost estimate per kW (standard Indian EPC pricing)
    const costPerKw = category === "commercial" ? 52000 : 58000
    const grossInvestment = Math.round(recommendedKw * costPerKw)

    // Subsidy (Residential PM Surya Ghar: up to 3kW max ₹78,000)
    let subsidy = 0
    if (category === "residential") {
      if (recommendedKw >= 3) subsidy = 78000
      else if (recommendedKw >= 2) subsidy = 60000
      else if (recommendedKw >= 1) subsidy = 30000
    }

    const netInvestment = Math.max(0, grossInvestment - subsidy)

    // Monthly savings (~85% to 90% bill offset)
    const monthlySavings = Math.round(Math.min(monthlyBill * 0.88, recommendedKw * 125 * tariff))
    const annualSavings = monthlySavings * 12
    const paybackYears = netInvestment > 0 ? (netInvestment / annualSavings).toFixed(1) : "3.0"

    return {
      recommendedKw,
      grossInvestment,
      subsidy,
      netInvestment,
      monthlySavings,
      annualSavings,
      paybackYears,
    }
  }, [category, monthlyBill])

  return (
    <section className="bg-white py-16 sm:py-20 lg:py-24" id="quick-calculator">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-forest/15 bg-sage-mist px-4 py-1 text-[13px] font-bold uppercase tracking-wider text-forest">
            <Calculator className="h-4 w-4 text-gold" />
            <span>Interactive Estimator</span>
          </div>
          <h2 className="mt-4 font-manrope text-[32px] font-extrabold tracking-tight text-forest sm:text-[42px]">
            Calculate Your Solar Potential in Seconds
          </h2>
          <p className="mt-4 text-[16px] leading-relaxed text-charcoal/80 sm:text-[18px]">
            Slide your average monthly electricity bill to see indicative solar system capacity, estimated savings, and approximate investment.
          </p>
        </div>

        {/* Calculator Main Box */}
        <div className="mt-12 overflow-hidden rounded-3xl border border-charcoal/10 bg-ivory shadow-xl lg:grid lg:grid-cols-12">
          
          {/* Inputs Section */}
          <div className="p-8 sm:p-10 lg:col-span-7">
            
            {/* Category Selector */}
            <div>
              <label className="text-[14px] font-bold text-forest">
                1. Select Property Type
              </label>
              <div className="mt-3 grid grid-cols-3 gap-2 sm:gap-3">
                <button
                  type="button"
                  onClick={() => setCategory("residential")}
                  className={`min-h-[44px] rounded-xl border px-3 py-2.5 text-center text-[13px] font-bold transition-all ${
                    category === "residential"
                      ? "border-forest bg-forest text-white shadow-sm"
                      : "border-charcoal/15 bg-white text-charcoal hover:bg-sage-mist"
                  }`}
                >
                  Residential
                </button>
                <button
                  type="button"
                  onClick={() => setCategory("commercial")}
                  className={`min-h-[44px] rounded-xl border px-3 py-2.5 text-center text-[13px] font-bold transition-all ${
                    category === "commercial"
                      ? "border-forest bg-forest text-white shadow-sm"
                      : "border-charcoal/15 bg-white text-charcoal hover:bg-sage-mist"
                  }`}
                >
                  Commercial
                </button>
                <button
                  type="button"
                  onClick={() => setCategory("society")}
                  className={`min-h-[44px] rounded-xl border px-3 py-2.5 text-center text-[13px] font-bold transition-all ${
                    category === "society"
                      ? "border-forest bg-forest text-white shadow-sm"
                      : "border-charcoal/15 bg-white text-charcoal hover:bg-sage-mist"
                  }`}
                >
                  Housing Society
                </button>
              </div>
            </div>

            {/* Monthly Bill Input & Slider */}
            <div className="mt-8">
              <div className="flex items-center justify-between">
                <label htmlFor="bill-slider" className="text-[14px] font-bold text-forest">
                  2. Monthly Electricity Bill
                </label>
                <div className="flex items-center rounded-lg border border-charcoal/20 bg-white px-3 py-1 font-manrope text-[18px] font-extrabold text-forest">
                  ₹ {monthlyBill.toLocaleString("en-IN")}
                </div>
              </div>

              <input
                id="bill-slider"
                type="range"
                min={category === "commercial" ? 10000 : 1500}
                max={category === "commercial" ? 200000 : 35000}
                step={category === "commercial" ? 5000 : 500}
                value={monthlyBill}
                onChange={(e) => setMonthlyBill(Number(e.target.value))}
                className="mt-4 h-2 w-full cursor-pointer appearance-none rounded-lg bg-sage-mist accent-forest"
              />

              <div className="mt-2 flex justify-between text-[11px] font-medium text-charcoal-muted">
                <span>₹ {category === "commercial" ? "10,000" : "1,500"}</span>
                <span>₹ {category === "commercial" ? "2,00,000+" : "35,000+"}</span>
              </div>
            </div>

            {/* City / Location Input */}
            <div className="mt-8">
              <label htmlFor="pincode-input" className="text-[14px] font-bold text-forest">
                3. Your City or Pincode (Optional)
              </label>
              <input
                id="pincode-input"
                type="text"
                placeholder="e.g. Jaipur, Delhi, Mumbai, or 302020"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="mt-2 w-full rounded-xl border border-charcoal/20 bg-white px-4 py-3 text-[14px] text-charcoal placeholder:text-charcoal/40 focus:border-forest focus:outline-none"
              />
            </div>

            {/* Disclaimer */}
            <p className="mt-6 text-[12px] leading-relaxed text-charcoal-muted">
              *Indicative estimates based on standard irradiance and applicable state tariffs. Actual capacity depends on shadow-free rooftop area and DISCOM net-metering sanctions.
            </p>

          </div>

          {/* Result Panel (Deep Forest Green) */}
          <div className="flex flex-col justify-between bg-forest p-8 text-white sm:p-10 lg:col-span-5">
            <div>
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <span className="text-[12px] font-bold uppercase tracking-wider text-sage">
                  Indicative Assessment
                </span>
                <span className="rounded-full bg-gold/20 px-3 py-1 text-[11px] font-bold text-gold">
                  {category.toUpperCase()}
                </span>
              </div>

              {/* Recommended Capacity */}
              <div className="mt-6">
                <p className="text-[13px] text-sage">Recommended Capacity</p>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="font-manrope text-[44px] font-extrabold text-gold">
                    {estimates.recommendedKw}
                  </span>
                  <span className="font-manrope text-[20px] font-bold text-white">kW System</span>
                </div>
                <p className="text-[12px] text-sage-mist/70">
                  Approx. {Math.round(estimates.recommendedKw * 2)} solar panels (~{Math.round(estimates.recommendedKw * 85)} sq.ft roof required)
                </p>
              </div>

              {/* Savings Breakdown */}
              <div className="mt-6 space-y-3.5 border-t border-white/10 pt-6">
                <div className="flex items-center justify-between text-[14px]">
                  <span className="text-sage">Estimated Monthly Savings:</span>
                  <span className="font-manrope font-bold text-white">
                    ₹ {estimates.monthlySavings.toLocaleString("en-IN")} / mo
                  </span>
                </div>

                <div className="flex items-center justify-between text-[14px]">
                  <span className="text-sage">Estimated Annual Savings:</span>
                  <span className="font-manrope font-bold text-gold">
                    ₹ {estimates.annualSavings.toLocaleString("en-IN")} / yr
                  </span>
                </div>

                {estimates.subsidy > 0 && (
                  <div className="flex items-center justify-between text-[14px]">
                    <span className="text-sage">PM Surya Ghar Subsidy:</span>
                    <span className="font-manrope font-bold text-sage">
                      - ₹ {estimates.subsidy.toLocaleString("en-IN")}
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between text-[14px] border-t border-white/10 pt-3">
                  <span className="text-sage">Approx. Net Investment:</span>
                  <span className="font-manrope font-extrabold text-white text-[16px]">
                    ₹ {estimates.netInvestment.toLocaleString("en-IN")}*
                  </span>
                </div>

                <div className="flex items-center justify-between text-[13px]">
                  <span className="text-sage">Est. Payback Period:</span>
                  <span className="font-semibold text-white">
                    {estimates.paybackYears} Years
                  </span>
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="mt-8 space-y-3 pt-6 border-t border-white/10">
              <LocalizedClientLink
                href={`/calculator?cat=${category}&bill=${monthlyBill}`}
                className="inline-flex min-h-[48px] w-full items-center justify-center rounded-xl bg-gold px-5 font-inter text-[14px] font-bold text-forest shadow-sm transition-all hover:bg-gold-hover"
              >
                <span>Use Detailed Calculator</span>
                <ArrowRight className="ml-2 h-4 w-4" />
              </LocalizedClientLink>

              <LocalizedClientLink
                href={`/contact?cat=${category}&bill=${monthlyBill}`}
                className="inline-flex min-h-[44px] w-full items-center justify-center rounded-xl border border-white/20 bg-white/5 px-4 font-inter text-[13px] font-semibold text-white hover:bg-white/10"
              >
                Get Verified Site Feasibility Quote
              </LocalizedClientLink>
            </div>

          </div>

        </div>

      </div>
    </section>
  )
}
