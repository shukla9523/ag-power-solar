"use client"

import { useState, useMemo } from "react"
import {
  Calculator,
  Sun,
  Zap,
  TrendingDown,
  ShieldCheck,
  Building2,
  Home,
  Users2,
  ArrowRight,
  Leaf,
  CheckCircle2,
  Info,
  Calendar,
  Layers,
  Sparkles,
} from "lucide-react"
import { calculateSolarSavings, CalculatorResult } from "@lib/services/solar-calculator"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

interface Props {
  initialCat?: string
  initialBill?: string
}

export default function CalculatorClient({ initialCat, initialBill }: Props) {
  const validCat = (initialCat as "residential" | "commercial" | "society") || "residential"
  const validBill = initialBill && !isNaN(Number(initialBill)) ? Number(initialBill) : 6000

  const [category, setCategory] = useState<"residential" | "commercial" | "society">(validCat)
  const [monthlyBill, setMonthlyBill] = useState<number>(validBill)
  const [city, setCity] = useState<string>("")
  const [pincode, setPincode] = useState<string>("")
  const [roofArea, setRoofArea] = useState<number | undefined>(undefined)
  const [roofType, setRoofType] = useState<"flat_rcc" | "slanted_metal" | "tiled">("flat_rcc")
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false)
  const [tariff, setTariff] = useState<number | undefined>(undefined)

  const handleCategoryChange = (newCat: "residential" | "commercial" | "society") => {
    setCategory(newCat)
    if (newCat === "commercial" && monthlyBill < 15000) {
      setMonthlyBill(30000)
    } else if (newCat !== "commercial" && monthlyBill > 40000) {
      setMonthlyBill(8000)
    }
  }

  // Enquiry modal state
  const [enquirySent, setEnquirySent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [enquiryError, setEnquiryError] = useState("")

  // Calculate live results
  const result: CalculatorResult = useMemo(() => {
    return calculateSolarSavings({
      category,
      monthlyBill,
      city,
      pincode,
      rooftopAreaSqFt: roofArea,
      roofType,
      electricityTariff: tariff,
    })
  }, [category, monthlyBill, city, pincode, roofArea, roofType, tariff])

  // Submit consultation with calculation details
  async function handleEnquirySubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setEnquiryError("")

    try {
      const payload = {
        name,
        phone,
        email,
        category,
        city: city || "Not specified",
        pincode: pincode || "",
        monthly_bill: String(monthlyBill),
        enquiry_type: "Calculator",
        source_page: "/calculator",
        message: `Calculator Enquiry: Recommended ${result.recommendedCapacityKw} kW System. Est. Net Investment: ₹${result.netInvestmentInr.toLocaleString("en-IN")}. Est. Monthly Savings: ₹${result.estimatedMonthlySavingsInr.toLocaleString("en-IN")}.`,
        calculation_details: result,
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
        setEnquiryError(data.error || "Submission failed. Please check your phone number.")
      }
    } catch (err) {
      setEnquiryError("Network error. Please try again or call +91 95234 67849.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="py-6 sm:py-9 lg:py-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        
        {/* Page Hero Header (Compact) */}
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="font-manrope text-[24px] font-extrabold tracking-tight text-slate-900 sm:text-[30px] lg:text-[32px]">
            Solar Savings &amp; ROI Calculator
          </h1>
          <p className="mt-1.5 text-[13.5px] leading-relaxed text-slate-600 sm:text-[14.5px]">
            Input your average power bill to calculate system capacity, monthly savings, government subsidies, and long-term financial yield.
          </p>
        </div>

        {/* Calculator Main Grid (Compact Proportions) */}
        <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-12 items-start">
          
          {/* Left Column: Inputs Form (7 cols) */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5 shadow-xs lg:col-span-7">
            
            {/* 1. Category */}
            <div>
              <h3 className="text-[12px] font-bold uppercase tracking-wider text-slate-800">
                1. Select Property Category
              </h3>
              <div className="mt-2 grid grid-cols-3 gap-2 sm:gap-2.5">
                <button
                  type="button"
                  onClick={() => handleCategoryChange("residential")}
                  className={`flex flex-col items-center justify-center rounded-lg border p-2.5 sm:p-3 text-center transition-all cursor-pointer ${
                    category === "residential"
                      ? "border-emerald-700 bg-emerald-700 text-white shadow-xs"
                      : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 hover:border-slate-300"
                  }`}
                >
                  <Home className={`h-4 w-4 sm:h-4.5 sm:w-4.5 ${category === "residential" ? "text-amber-400" : "text-slate-600"}`} />
                  <span className="mt-1 text-[11.5px] font-bold">Residential</span>
                  <span className="text-[9.5px] opacity-75">Home / Villa</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleCategoryChange("commercial")}
                  className={`flex flex-col items-center justify-center rounded-lg border p-2.5 sm:p-3 text-center transition-all cursor-pointer ${
                    category === "commercial"
                      ? "border-emerald-700 bg-emerald-700 text-white shadow-xs"
                      : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 hover:border-slate-300"
                  }`}
                >
                  <Building2 className={`h-4 w-4 sm:h-4.5 sm:w-4.5 ${category === "commercial" ? "text-amber-400" : "text-slate-600"}`} />
                  <span className="mt-1 text-[11.5px] font-bold">Commercial</span>
                  <span className="text-[9.5px] opacity-75">Factory / Office</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleCategoryChange("society")}
                  className={`flex flex-col items-center justify-center rounded-lg border p-2.5 sm:p-3 text-center transition-all cursor-pointer ${
                    category === "society"
                      ? "border-emerald-700 bg-emerald-700 text-white shadow-xs"
                      : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 hover:border-slate-300"
                  }`}
                >
                  <Users2 className={`h-4 w-4 sm:h-4.5 sm:w-4.5 ${category === "society" ? "text-amber-400" : "text-slate-600"}`} />
                  <span className="mt-1 text-[11.5px] font-bold">Society</span>
                  <span className="text-[9.5px] opacity-75">RWA / Apartment</span>
                </button>
              </div>
            </div>

            {/* 2. Monthly Electricity Bill */}
            <div className="mt-4 border-t border-slate-100 pt-3.5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-[12px] font-bold uppercase tracking-wider text-slate-800">
                    2. Monthly Electricity Bill
                  </h3>
                  <p className="text-[10.5px] text-slate-500">
                    Adjust to match your average monthly power invoice
                  </p>
                </div>
                <div className="rounded-md border border-slate-200 bg-slate-50 px-2.5 py-0.5 font-manrope text-[15px] font-extrabold text-slate-900 shadow-2xs">
                  ₹ {monthlyBill.toLocaleString("en-IN")}
                </div>
              </div>

              <input
                type="range"
                min={category === "commercial" ? 15000 : 1500}
                max={category === "commercial" ? 300000 : 40000}
                step={category === "commercial" ? 5000 : 500}
                value={monthlyBill}
                onChange={(e) => setMonthlyBill(Number(e.target.value))}
                className="mt-3 h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-slate-100 accent-amber-500"
              />

              <div className="mt-1 flex justify-between text-[10.5px] font-semibold text-slate-500">
                <span>₹ {category === "commercial" ? "15,000" : "1,500"}</span>
                <span>₹ {category === "commercial" ? "3,00,000+" : "40,000+"}</span>
              </div>
            </div>

            {/* 3. Location info */}
            <div className="mt-4 border-t border-slate-100 pt-3.5">
              <h3 className="text-[12px] font-bold uppercase tracking-wider text-slate-800">
                3. Installation Location
              </h3>
              <div className="mt-2 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                <div>
                  <label className="text-[10.5px] font-bold text-slate-600 uppercase">City</label>
                  <input
                    type="text"
                    placeholder="e.g. Jaipur, Delhi, NCR, Pune"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="mt-0.5 w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-1.5 text-[12.5px] text-slate-900 placeholder:text-slate-400 focus:border-emerald-600 focus:bg-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10.5px] font-bold text-slate-600 uppercase">Pincode</label>
                  <input
                    type="text"
                    placeholder="e.g. 302020"
                    maxLength={6}
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    className="mt-0.5 w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-1.5 text-[12.5px] text-slate-900 placeholder:text-slate-400 focus:border-emerald-600 focus:bg-white focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* 4. Optional Advanced Controls */}
            <div className="mt-3.5 border-t border-slate-100 pt-3">
              <button
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="text-[11.5px] font-bold text-emerald-700 hover:text-emerald-800 hover:underline cursor-pointer"
              >
                {showAdvanced ? "– Hide Optional Roof & Tariff Details" : "+ Add Roof Type & Custom Tariff Details (Optional)"}
              </button>

              {showAdvanced && (
                <div className="mt-2.5 grid grid-cols-1 gap-2.5 rounded-lg border border-slate-200 bg-slate-50 p-2.5 sm:grid-cols-2">
                  <div>
                    <label className="text-[10.5px] font-bold text-slate-600 uppercase">Roof Type</label>
                    <select
                      value={roofType}
                      onChange={(e) => setRoofType(e.target.value as any)}
                      className="mt-0.5 w-full rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-[12.5px] text-slate-900"
                    >
                      <option value="flat_rcc">Flat RCC Concrete Roof</option>
                      <option value="slanted_metal">Industrial Slanted Metal Sheet</option>
                      <option value="tiled">Slanted Tiled Roof</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10.5px] font-bold text-slate-600 uppercase">Available Rooftop Area (sq ft)</label>
                    <input
                      type="number"
                      placeholder="e.g. 500"
                      value={roofArea || ""}
                      onChange={(e) => setRoofArea(e.target.value ? Number(e.target.value) : undefined)}
                      className="mt-0.5 w-full rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-[12.5px] text-slate-900"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Consultation Form Box */}
            <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50/40 p-3.5 sm:p-4 shadow-2xs">
              <h4 className="font-manrope text-[14.5px] font-bold text-slate-900">
                Want an Engineer to Verify This Estimate?
              </h4>
              <p className="mt-0.5 text-[11px] text-slate-600">
                Submit your contact details and our solar EPC engineering team will conduct a free 3D satellite feasibility check.
              </p>

              {enquirySent ? (
                <div className="mt-3 rounded-lg bg-slate-900 p-3 text-center text-white border border-white/10">
                  <CheckCircle2 className="mx-auto h-5 w-5 text-amber-400" />
                  <p className="mt-1 font-manrope text-[13.5px] font-bold text-white">
                    Calculation Details Received!
                  </p>
                  <p className="mt-0.5 text-[11px] text-slate-300">
                    Our solar consultant will contact you within 2 business hours with a formal proposal.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleEnquirySubmit} className="mt-3 space-y-2">
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    <input
                      type="text"
                      required
                      placeholder="Your Full Name *"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full rounded-md border border-slate-200 bg-white px-3 py-1.5 text-[12.5px] text-slate-900 placeholder:text-slate-400 focus:border-emerald-600 focus:outline-none"
                    />
                    <input
                      type="tel"
                      required
                      placeholder="Phone Number (10 digits) *"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full rounded-md border border-slate-200 bg-white px-3 py-1.5 text-[12.5px] text-slate-900 placeholder:text-slate-400 focus:border-emerald-600 focus:outline-none"
                    />
                  </div>
                  <input
                    type="email"
                    placeholder="Email Address (Optional)"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-md border border-slate-200 bg-white px-3 py-1.5 text-[12.5px] text-slate-900 placeholder:text-slate-400 focus:border-emerald-600 focus:outline-none"
                  />

                  {enquiryError && (
                    <p className="text-[11px] font-semibold text-red-600">{enquiryError}</p>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-lg bg-emerald-600 hover:bg-emerald-500 py-2 text-[13px] font-bold text-white shadow-2xs transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
                  >
                    {loading ? "Submitting Request..." : "Request Verified Rooftop Quote →"}
                  </button>
                </form>
              )}
            </div>

          </div>

          {/* Right Column: Calculated Results Panel (Compact & High Contrast Glassmorphism) */}
          <div className="relative flex flex-col justify-between overflow-hidden rounded-xl bg-gradient-to-br from-emerald-950 via-slate-950 to-emerald-950 p-4 sm:p-5 text-white shadow-xl lg:col-span-5 backdrop-blur-2xl border border-white/10 before:absolute before:inset-0 before:bg-gradient-to-br before:from-emerald-400/10 before:via-transparent before:to-transparent before:pointer-events-none sticky top-20">
            {/* Ambient solar blur */}
            <div className="pointer-events-none absolute -top-12 -right-12 h-32 w-32 rounded-full bg-amber-500/15 blur-2xl" />

            <div className="relative z-10">
              <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                  <span className="text-[10.5px] font-bold uppercase tracking-wider text-emerald-300">
                    Solar Projection
                  </span>
                </div>
                <span className="rounded-full bg-amber-500/20 border border-amber-500/30 px-2 py-0.5 text-[9.5px] font-bold text-amber-300 backdrop-blur-sm">
                  {result.category.toUpperCase()}
                </span>
              </div>

              {/* Recommended Capacity (Compact) */}
              <div className="mt-3">
                <span className="text-[11px] text-slate-300 font-medium">Recommended Solar Capacity</span>
                <div className="mt-0.5 flex items-baseline gap-1.5">
                  <span className="font-manrope text-[28px] sm:text-[32px] font-black text-amber-400 tracking-tight leading-none">
                    {result.recommendedCapacityKw}
                  </span>
                  <span className="font-manrope text-[15px] font-bold text-white">kW System</span>
                </div>
                <p className="mt-1 text-[10.5px] text-slate-300">
                  Approx. {result.approxPanelsCount} High-Efficiency Panels ({result.assumptions.panelWattage}W each)
                </p>
                <p className="text-[10.5px] text-slate-300">
                  Roof area required: ~{result.rooftopAreaRequiredSqFt} sq.ft
                </p>
              </div>

              {/* Financial Metrics (Compact Rows with High Contrast) */}
              <div className="mt-3.5 space-y-1.5 border-t border-white/10 pt-3 text-[12px] sm:text-[12.5px]">
                <div className="flex items-center justify-between">
                  <span className="text-slate-300 font-medium">Expected Monthly Generation:</span>
                  <span className="font-manrope font-bold text-white">
                    {result.monthlyGenerationKwh.toLocaleString("en-IN")} kWh
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-300 font-medium">Monthly Bill Savings:</span>
                  <span className="font-manrope font-bold text-amber-400">
                    ₹ {result.estimatedMonthlySavingsInr.toLocaleString("en-IN")} / mo
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-300 font-medium">Annual Bill Savings:</span>
                  <span className="font-manrope font-bold text-white">
                    ₹ {result.estimatedAnnualSavingsInr.toLocaleString("en-IN")} / yr
                  </span>
                </div>

                <div className="flex items-center justify-between border-t border-white/10 pt-1.5">
                  <span className="text-slate-300 font-medium">Gross Turnkey Cost:</span>
                  <span className="font-manrope font-medium text-white/90">
                    ₹ {result.grossInvestmentInr.toLocaleString("en-IN")}
                  </span>
                </div>

                {result.subsidyAmountInr > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300 font-medium">Central Subsidy (PM Surya Ghar):</span>
                    <span className="font-manrope font-bold text-emerald-400">
                      – ₹ {result.subsidyAmountInr.toLocaleString("en-IN")}
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between rounded-lg bg-white/10 border border-white/15 p-2 my-0.5">
                  <span className="text-[12px] font-bold text-white">Estimated Net Investment:</span>
                  <span className="font-manrope text-[16px] font-black text-amber-400">
                    ₹ {result.netInvestmentInr.toLocaleString("en-IN")}*
                  </span>
                </div>

                <div className="flex items-center justify-between text-[11.5px]">
                  <span className="text-slate-300 font-medium">Capital Payback Period:</span>
                  <span className="font-manrope font-bold text-amber-300">
                    ~{result.paybackPeriodYears} Years
                  </span>
                </div>

                <div className="flex items-center justify-between text-[11.5px]">
                  <span className="text-slate-300 font-medium">25-Year Cumulative Savings:</span>
                  <span className="font-manrope font-extrabold text-amber-400">
                    ₹ {result.estimatedLifetimeSavingsInr.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              {/* Environmental Impact Pill */}
              <div className="mt-3 rounded-lg border border-white/10 bg-white/5 p-2.5">
                <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-300">
                  <Leaf className="h-3 w-3 text-emerald-400" />
                  <span>Annual Carbon Offset</span>
                </div>
                <div className="mt-1.5 flex items-center justify-between">
                  <div>
                    <p className="font-manrope text-[15px] font-bold text-white">
                      {result.co2OffsetTonnesAnnual} Tonnes
                    </p>
                    <p className="text-[9.5px] text-slate-300">CO₂ eliminated / yr</p>
                  </div>
                  <div className="text-right">
                    <p className="font-manrope text-[15px] font-bold text-amber-400">
                      ~{result.treesEquivalentAnnual} Trees
                    </p>
                    <p className="text-[9.5px] text-slate-300">Planted equivalent</p>
                  </div>
                </div>
              </div>

            </div>

            {/* Bottom Disclaimer */}
            <div className="mt-3 border-t border-white/10 pt-2 text-[9.5px] leading-relaxed text-slate-400">
              Disclaimer: All calculations are indicative estimates based on typical solar irradiance and applicable DISCOM rules. Actual system capacity, subsidy sanction, and electricity savings depend on physical site inspection, shadow analysis, and DISCOM net-metering approvals.
            </div>

          </div>

        </div>

      </div>
    </div>
  )
}
