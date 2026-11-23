"use client"

import { useState, useMemo } from "react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { Calculator, ArrowRight, Sun, Zap, IndianRupee, ShieldCheck } from "lucide-react"

type CustomerCategory = "residential" | "commercial" | "society"

export default function QuickCalculator() {
  const [category, setCategory] = useState<CustomerCategory>("residential")
  const [monthlyBill, setMonthlyBill] = useState<number>(5000)
  const [location, setLocation] = useState<string>("")

  const handleCategoryChange = (newCat: CustomerCategory) => {
    setCategory(newCat)
    if (newCat === "commercial" && monthlyBill < 10000) {
      setMonthlyBill(25000)
    } else if (newCat !== "commercial" && monthlyBill > 35000) {
      setMonthlyBill(6000)
    }
  }

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

    const minVal = category === "commercial" ? 10000 : 1500
    const maxVal = category === "commercial" ? 200000 : 35000
    const sliderPercent = Math.min(100, Math.max(0, ((monthlyBill - minVal) / (maxVal - minVal)) * 100))

    return {
      recommendedKw,
      grossInvestment,
      subsidy,
      netInvestment,
      monthlySavings,
      annualSavings,
      paybackYears,
      sliderPercent,
    }
  }, [category, monthlyBill])

  return (
    <section
      className="py-[72px] transition-colors"
      style={{ backgroundColor: "#F0FDF4" }}
      id="quick-calculator"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200/80 bg-emerald-100 px-3.5 py-1 text-[11px] sm:text-[12px] font-bold uppercase tracking-wider text-forest-deep mb-3">
            <Calculator className="h-3.5 w-3.5 text-amber-500" />
            <span>Solar Estimator</span>
          </div>
          <h2 className="font-manrope text-[clamp(30px,3.2vw,42px)] font-extrabold tracking-tight text-forest-deep leading-[1.2] max-w-2xl mx-auto text-balance">
            Calculate Your <span className="text-emerald-600">Solar Potential</span> in Seconds
          </h2>
          <p className="mt-4 max-w-[680px] mx-auto text-[17px] leading-relaxed text-slate-600">
            Slide your average monthly electricity bill to see indicative solar system capacity, estimated savings, and approximate investment.
          </p>
        </div>

        {/* Calculator Main Box: Left & Right Equal Height + 3px Yellow Top Border on Hover */}
        <div className="mx-auto mt-10 max-w-5xl overflow-hidden rounded-2xl border border-emerald-200/80 border-t-[3px] border-t-transparent hover:border-t-amber-400 bg-white shadow-xl transition-all duration-300 hover:shadow-[0_12px_32px_rgba(22,163,74,0.12)] lg:grid lg:grid-cols-12 items-stretch">
          
          {/* Inputs Section: Equal Height */}
          <div className="p-[28px] lg:col-span-7 bg-white flex flex-col justify-between h-full">
            <div>
              {/* Category Selector */}
              <div>
                <label className="text-[13px] font-bold text-forest-deep uppercase tracking-wide">
                  1. Select Property Type
                </label>
                <div className="mt-2.5 grid grid-cols-3 gap-1.5 sm:gap-2">
                  <button
                    type="button"
                    onClick={() => handleCategoryChange("residential")}
                    className={`min-h-[40px] rounded-xl border px-1.5 sm:px-3 py-2 text-center text-[11px] sm:text-[12.5px] font-bold transition-all ${
                      category === "residential"
                        ? "border-emerald-700 bg-emerald-700 text-white shadow-sm"
                        : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    Residential
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCategoryChange("commercial")}
                    className={`min-h-[40px] rounded-xl border px-1.5 sm:px-3 py-2 text-center text-[11px] sm:text-[12.5px] font-bold transition-all ${
                      category === "commercial"
                        ? "border-emerald-700 bg-emerald-700 text-white shadow-sm"
                        : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    Commercial
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCategoryChange("society")}
                    className={`min-h-[40px] rounded-xl border px-1.5 sm:px-3 py-2 text-center text-[11px] sm:text-[12.5px] font-bold transition-all ${
                      category === "society"
                        ? "border-emerald-700 bg-emerald-700 text-white shadow-sm"
                        : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    Society
                  </button>
                </div>
              </div>

              {/* Monthly Bill Input & Slider */}
              <div className="mt-6">
                <div className="flex items-center justify-between">
                  <label htmlFor="bill-slider" className="text-[13px] font-bold text-forest-deep uppercase tracking-wide">
                    2. Monthly Electricity Bill
                  </label>
                  <div className="flex items-center rounded-lg border border-emerald-200 bg-emerald-50/70 px-3 py-1 font-manrope text-[16px] font-extrabold text-forest-deep shadow-sm">
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
                  style={{
                    background: `linear-gradient(to right, #16A34A ${estimates.sliderPercent}%, #E2E8F0 ${estimates.sliderPercent}%)`,
                    accentColor: "#F59E0B",
                  }}
                  className="mt-3 h-2.5 w-full cursor-pointer appearance-none rounded-lg"
                />

                <div className="mt-1.5 flex justify-between text-[11px] font-medium text-slate-500">
                  <span>₹ {category === "commercial" ? "10,000" : "1,500"}</span>
                  <span>₹ {category === "commercial" ? "2,00,000+" : "35,000+"}</span>
                </div>
              </div>

              {/* City / Location Input */}
              <div className="mt-6">
                <label htmlFor="pincode-input" className="text-[13px] font-bold text-forest-deep uppercase tracking-wide">
                  3. Your City or Pincode (Optional)
                </label>
                <input
                  id="pincode-input"
                  type="text"
                  placeholder="e.g. Jaipur, Delhi, Mumbai, or 302020"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="mt-2 w-full rounded-lg border border-emerald-200 bg-slate-50 px-3.5 py-2.5 text-[13px] text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Disclaimer */}
            <p className="mt-6 text-[11px] leading-relaxed text-slate-500 border-t border-slate-100 pt-3">
              *Indicative estimates based on standard irradiance. Actual capacity depends on shadow-free rooftop area and DISCOM net-metering sanctions.
            </p>

          </div>

          {/* Result Panel: Deep Green Gradient (#14532D to #166534), Equal Height */}
          <div
            style={{
              background: "linear-gradient(135deg, #14532D 0%, #166534 100%)",
            }}
            className="relative flex flex-col justify-between overflow-hidden p-[28px] text-white lg:col-span-5 border-t lg:border-t-0 lg:border-l border-emerald-500/20 shadow-inner h-full"
          >
            <div className="relative z-10">
              <div className="flex items-center justify-between border-b border-white/20 pb-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-white">
                  Indicative Assessment
                </span>
                <span className="rounded-full bg-emerald-800/80 border border-emerald-600/60 px-2.5 py-0.5 text-[10px] font-bold text-white backdrop-blur-sm">
                  {category.toUpperCase()}
                </span>
              </div>

              {/* 1. Recommended Capacity: Yellow capacity number */}
              <div className="mt-4">
                <p className="text-[12px] text-emerald-100 font-medium">Recommended Capacity</p>
                <div className="mt-0.5 flex items-baseline gap-2">
                  <span className="font-manrope text-[34px] sm:text-[38px] font-black text-amber-400 tracking-tight leading-none">
                    {estimates.recommendedKw}
                  </span>
                  <span className="font-manrope text-[16px] sm:text-[18px] font-bold text-white">kW System</span>
                </div>
                <p className="text-[11px] text-emerald-100/90 mt-1">
                  Approx. {Math.round(estimates.recommendedKw * 2)} panels (~{Math.round(estimates.recommendedKw * 85)} sq.ft roof required)
                </p>
              </div>

              {/* Savings Breakdown: Yellow only for annual savings & payback period */}
              <div className="mt-4 space-y-2 border-t border-white/20 pt-3.5 text-[13px]">
                <div className="flex items-center justify-between">
                  <span className="text-white font-medium">Estimated Monthly Savings:</span>
                  <span className="font-manrope font-bold text-white">
                    ₹ {estimates.monthlySavings.toLocaleString("en-IN")} / mo
                  </span>
                </div>

                {/* 2. Annual Savings: Yellow */}
                <div className="flex items-center justify-between">
                  <span className="text-white font-medium">Estimated Annual Savings:</span>
                  <span className="font-manrope font-bold text-amber-400">
                    ₹ {estimates.annualSavings.toLocaleString("en-IN")} / yr
                  </span>
                </div>

                {estimates.subsidy > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-white font-medium">PM Surya Ghar Subsidy:</span>
                    <span className="font-manrope font-bold text-emerald-200">
                      - ₹ {estimates.subsidy.toLocaleString("en-IN")}
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between border-t border-white/20 pt-2">
                  <span className="text-white font-medium">Approx. Net Investment:</span>
                  <span className="font-manrope font-extrabold text-white text-[15px]">
                    ₹ {estimates.netInvestment.toLocaleString("en-IN")}*
                  </span>
                </div>

                {/* 3. Payback Period: Yellow */}
                <div className="flex items-center justify-between text-[12px]">
                  <span className="text-white font-medium">Est. Payback Period:</span>
                  <span className="font-bold text-amber-400">
                    {estimates.paybackYears} Years
                  </span>
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="relative z-10 mt-5 space-y-2.5 pt-3.5 border-t border-white/20">
              <LocalizedClientLink
                href={`/calculator?cat=${category}&bill=${monthlyBill}`}
                className="inline-flex min-h-[42px] w-full items-center justify-center rounded-lg bg-emerald-600 hover:bg-emerald-500 px-4 font-inter text-[13px] font-bold text-white shadow-md transition-all active:scale-95 hover:shadow-[0_4px_16px_rgba(22,163,74,0.4)]"
              >
                <span>Use Detailed Calculator</span>
                <ArrowRight className="ml-1.5 h-3.5 w-3.5 text-white" />
              </LocalizedClientLink>

              <LocalizedClientLink
                href={`/contact?cat=${category}&bill=${monthlyBill}`}
                className="inline-flex min-h-[38px] w-full items-center justify-center rounded-lg bg-white hover:bg-slate-50 border border-emerald-300 px-4 font-inter text-[12px] font-bold text-forest-deep shadow-sm transition-all active:scale-95"
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
