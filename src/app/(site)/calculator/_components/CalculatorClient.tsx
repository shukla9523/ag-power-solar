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
      setEnquiryError("Network error. Please try again or call +91 98765 43210.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="py-12 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Page Hero Header */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-forest/15 bg-sage-mist px-4 py-1 text-[13px] font-bold uppercase tracking-wider text-forest">
            <Calculator className="h-4 w-4 text-gold" />
            <span>Solar Feasibility Engine</span>
          </div>
          <h1 className="mt-4 font-manrope text-[36px] font-extrabold tracking-tight text-forest sm:text-[48px]">
            Solar Savings & ROI Calculator
          </h1>
          <p className="mt-4 text-[16px] leading-relaxed text-charcoal/80 sm:text-[18px]">
            Input your average power bill to calculate system capacity, monthly savings, government subsidies, and long-term financial yield.
          </p>
        </div>

        {/* Calculator Main Grid */}
        <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-12">
          
          {/* Left Column: Inputs Form (7 cols) */}
          <div className="rounded-3xl border border-charcoal/10 bg-white p-6 shadow-sm sm:p-8 lg:col-span-7">
            
            {/* 1. Category */}
            <div>
              <h3 className="text-[14px] font-bold uppercase tracking-wider text-forest">
                1. Select Property Category
              </h3>
              <div className="mt-3 grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setCategory("residential")}
                  className={`flex flex-col items-center justify-center rounded-2xl border p-4 text-center transition-all ${
                    category === "residential"
                      ? "border-forest bg-forest text-white shadow-md"
                      : "border-charcoal/15 bg-ivory text-charcoal hover:bg-sage-mist"
                  }`}
                >
                  <Home className={`h-6 w-6 ${category === "residential" ? "text-gold" : "text-forest"}`} />
                  <span className="mt-2 text-[13px] font-bold">Residential</span>
                  <span className="text-[10px] opacity-75">Home / Villa</span>
                </button>

                <button
                  type="button"
                  onClick={() => setCategory("commercial")}
                  className={`flex flex-col items-center justify-center rounded-2xl border p-4 text-center transition-all ${
                    category === "commercial"
                      ? "border-forest bg-forest text-white shadow-md"
                      : "border-charcoal/15 bg-ivory text-charcoal hover:bg-sage-mist"
                  }`}
                >
                  <Building2 className={`h-6 w-6 ${category === "commercial" ? "text-gold" : "text-forest"}`} />
                  <span className="mt-2 text-[13px] font-bold">Commercial</span>
                  <span className="text-[10px] opacity-75">Factory / Office</span>
                </button>

                <button
                  type="button"
                  onClick={() => setCategory("society")}
                  className={`flex flex-col items-center justify-center rounded-2xl border p-4 text-center transition-all ${
                    category === "society"
                      ? "border-forest bg-forest text-white shadow-md"
                      : "border-charcoal/15 bg-ivory text-charcoal hover:bg-sage-mist"
                  }`}
                >
                  <Users2 className={`h-6 w-6 ${category === "society" ? "text-gold" : "text-forest"}`} />
                  <span className="mt-2 text-[13px] font-bold">Housing Society</span>
                  <span className="text-[10px] opacity-75">RWA / Apartment</span>
                </button>
              </div>
            </div>

            {/* 2. Monthly Electricity Bill */}
            <div className="mt-8 border-t border-charcoal/8 pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-[14px] font-bold uppercase tracking-wider text-forest">
                    2. Monthly Electricity Bill
                  </h3>
                  <p className="text-[12px] text-charcoal-muted">
                    Adjust to match your average monthly power invoice
                  </p>
                </div>
                <div className="rounded-xl border border-forest/20 bg-ivory px-4 py-1.5 font-manrope text-[20px] font-black text-forest">
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
                className="mt-5 h-2.5 w-full cursor-pointer appearance-none rounded-lg bg-sage-mist accent-forest"
              />

              <div className="mt-2 flex justify-between text-[11px] font-semibold text-charcoal-muted">
                <span>₹ {category === "commercial" ? "15,000" : "1,500"}</span>
                <span>₹ {category === "commercial" ? "3,00,000+" : "40,000+"}</span>
              </div>
            </div>

            {/* 3. Location info */}
            <div className="mt-8 border-t border-charcoal/8 pt-6">
              <h3 className="text-[14px] font-bold uppercase tracking-wider text-forest">
                3. Installation Location
              </h3>
              <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-[12px] font-semibold text-charcoal">City</label>
                  <input
                    type="text"
                    placeholder="e.g. Jaipur, Delhi, NCR, Pune"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-charcoal/20 bg-ivory px-4 py-2.5 text-[14px] text-charcoal focus:border-forest focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[12px] font-semibold text-charcoal">Pincode</label>
                  <input
                    type="text"
                    placeholder="e.g. 302020"
                    maxLength={6}
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-charcoal/20 bg-ivory px-4 py-2.5 text-[14px] text-charcoal focus:border-forest focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* 4. Optional Advanced Controls */}
            <div className="mt-8 border-t border-charcoal/8 pt-4">
              <button
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="text-[13px] font-bold text-forest hover:underline"
              >
                {showAdvanced ? "– Hide Optional Roof & Tariff Details" : "+ Add Roof Type & Custom Tariff Details (Optional)"}
              </button>

              {showAdvanced && (
                <div className="mt-4 grid grid-cols-1 gap-4 rounded-2xl bg-ivory p-4 sm:grid-cols-2">
                  <div>
                    <label className="text-[12px] font-semibold text-charcoal">Roof Type</label>
                    <select
                      value={roofType}
                      onChange={(e) => setRoofType(e.target.value as any)}
                      className="mt-1 w-full rounded-xl border border-charcoal/20 bg-white px-3 py-2 text-[13px] text-charcoal"
                    >
                      <option value="flat_rcc">Flat RCC Concrete Roof</option>
                      <option value="slanted_metal">Industrial Slanted Metal Sheet</option>
                      <option value="tiled">Slanted Tiled Roof</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[12px] font-semibold text-charcoal">Available Rooftop Area (sq ft)</label>
                    <input
                      type="number"
                      placeholder="e.g. 500"
                      value={roofArea || ""}
                      onChange={(e) => setRoofArea(e.target.value ? Number(e.target.value) : undefined)}
                      className="mt-1 w-full rounded-xl border border-charcoal/20 bg-white px-3 py-2 text-[13px] text-charcoal"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Consultation Form Box */}
            <div className="mt-10 rounded-2xl border border-forest/20 bg-sage-mist/50 p-6">
              <h4 className="font-manrope text-[18px] font-bold text-forest">
                Want an Engineer to Verify This Estimate?
              </h4>
              <p className="mt-1 text-[13px] text-charcoal/80">
                Submit your contact details and our solar EPC engineering team will conduct a free 3D satellite feasibility check.
              </p>

              {enquirySent ? (
                <div className="mt-4 rounded-xl bg-forest p-4 text-center text-white">
                  <CheckCircle2 className="mx-auto h-8 w-8 text-gold" />
                  <p className="mt-2 font-manrope text-[16px] font-bold text-white">
                    Calculation Details Received!
                  </p>
                  <p className="mt-1 text-[13px] text-sage">
                    Our solar consultant will contact you within 2 business hours with a formal proposal.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleEnquirySubmit} className="mt-4 space-y-3">
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <input
                      type="text"
                      required
                      placeholder="Your Full Name *"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full rounded-xl border border-charcoal/20 bg-white px-3.5 py-2.5 text-[14px] focus:border-forest focus:outline-none"
                    />
                    <input
                      type="tel"
                      required
                      placeholder="Phone Number (10 digits) *"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full rounded-xl border border-charcoal/20 bg-white px-3.5 py-2.5 text-[14px] focus:border-forest focus:outline-none"
                    />
                  </div>
                  <input
                    type="email"
                    placeholder="Email Address (Optional)"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-charcoal/20 bg-white px-3.5 py-2.5 text-[14px] focus:border-forest focus:outline-none"
                  />

                  {enquiryError && (
                    <p className="text-[12px] font-semibold text-red-600">{enquiryError}</p>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-xl bg-forest py-3 text-[14px] font-bold text-white shadow-md transition-all hover:bg-forest-deep disabled:opacity-50"
                  >
                    {loading ? "Submitting Request..." : "Request Verified Rooftop Quote →"}
                  </button>
                </form>
              )}
            </div>

          </div>

          {/* Right Column: Calculated Results Panel (5 cols) */}
          <div className="flex flex-col justify-between rounded-3xl bg-forest p-8 text-white shadow-xl lg:col-span-5">
            <div>
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-gold" />
                  <span className="text-[12px] font-bold uppercase tracking-wider text-sage">
                    Solar Projection
                  </span>
                </div>
                <span className="rounded-full bg-gold px-3 py-0.5 text-[11px] font-black text-forest">
                  {result.category.toUpperCase()}
                </span>
              </div>

              {/* Recommended Capacity */}
              <div className="mt-6">
                <span className="text-[13px] text-sage">Recommended Solar Capacity</span>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="font-manrope text-[46px] font-extrabold text-gold">
                    {result.recommendedCapacityKw}
                  </span>
                  <span className="font-manrope text-[22px] font-bold text-white">kW System</span>
                </div>
                <p className="mt-1 text-[12px] text-sage-mist/70">
                  Approx. {result.approxPanelsCount} Tier-1 Panels ({result.assumptions.panelWattage}W each)
                </p>
                <p className="text-[12px] text-sage-mist/70">
                  Roof area required: ~{result.rooftopAreaRequiredSqFt} sq.ft
                </p>
              </div>

              {/* Financial Metrics */}
              <div className="mt-8 space-y-4 border-t border-white/10 pt-6">
                <div className="flex items-center justify-between">
                  <span className="text-[14px] text-sage">Expected Monthly Generation:</span>
                  <span className="font-manrope text-[15px] font-bold text-white">
                    {result.monthlyGenerationKwh.toLocaleString("en-IN")} kWh
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[14px] text-sage">Monthly Bill Savings:</span>
                  <span className="font-manrope text-[16px] font-bold text-gold">
                    ₹ {result.estimatedMonthlySavingsInr.toLocaleString("en-IN")} / mo
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[14px] text-sage">Annual Bill Savings:</span>
                  <span className="font-manrope text-[16px] font-bold text-white">
                    ₹ {result.estimatedAnnualSavingsInr.toLocaleString("en-IN")} / yr
                  </span>
                </div>

                <div className="flex items-center justify-between border-t border-white/10 pt-3">
                  <span className="text-[14px] text-sage">Gross Turnkey Cost:</span>
                  <span className="font-manrope text-[14px] font-medium text-white/80">
                    ₹ {result.grossInvestmentInr.toLocaleString("en-IN")}
                  </span>
                </div>

                {result.subsidyAmountInr > 0 && (
                  <div className="flex items-center justify-between text-[14px]">
                    <span className="text-sage">Central Subsidy (PM Surya Ghar):</span>
                    <span className="font-manrope font-bold text-sage">
                      – ₹ {result.subsidyAmountInr.toLocaleString("en-IN")}
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between rounded-xl bg-white/10 p-3.5">
                  <span className="text-[14px] font-bold text-white">Estimated Net Investment:</span>
                  <span className="font-manrope text-[20px] font-extrabold text-gold">
                    ₹ {result.netInvestmentInr.toLocaleString("en-IN")}*
                  </span>
                </div>

                <div className="flex items-center justify-between text-[13px]">
                  <span className="text-sage">Capital Payback Period:</span>
                  <span className="font-manrope text-[15px] font-bold text-white">
                    ~{result.paybackPeriodYears} Years
                  </span>
                </div>

                <div className="flex items-center justify-between text-[13px]">
                  <span className="text-sage">25-Year Cumulative Savings:</span>
                  <span className="font-manrope text-[15px] font-extrabold text-gold">
                    ₹ {result.estimatedLifetimeSavingsInr.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              {/* Environmental Impact Pill */}
              <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-center gap-2 text-[12px] font-bold uppercase tracking-wider text-sage">
                  <Leaf className="h-4 w-4 text-sage" />
                  <span>Annual Carbon Offset</span>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <div>
                    <p className="font-manrope text-[20px] font-bold text-white">
                      {result.co2OffsetTonnesAnnual} Tonnes
                    </p>
                    <p className="text-[11px] text-sage">CO₂ emissions eliminated / yr</p>
                  </div>
                  <div className="text-right">
                    <p className="font-manrope text-[20px] font-bold text-gold">
                      ~{result.treesEquivalentAnnual} Trees
                    </p>
                    <p className="text-[11px] text-sage">Planted equivalent</p>
                  </div>
                </div>
              </div>

            </div>

            {/* Bottom Disclaimer */}
            <div className="mt-8 border-t border-white/10 pt-4 text-[11px] leading-relaxed text-sage/80">
              Disclaimer: All calculations are indicative estimates based on typical solar irradiance and applicable DISCOM rules. Actual system capacity, subsidy sanction, and electricity savings depend on physical site inspection, shadow analysis, and DISCOM net-metering approvals.
            </div>

          </div>

        </div>

      </div>
    </div>
  )
}
