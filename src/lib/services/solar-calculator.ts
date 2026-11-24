/**
 * @file solar-calculator.ts
 * @description Centralized backend calculation engine for AG POWER Solar Calculator.
 * 
 * Follows SOP Rule 2: Business calculations reside in backend services, keeping
 * frontend purely for presentation and user interaction.
 */

export interface CalculatorInput {
  category: "residential" | "commercial" | "society"
  monthlyBill: number
  city?: string
  pincode?: string
  monthlyUnits?: number
  rooftopAreaSqFt?: number
  roofType?: "flat_rcc" | "slanted_metal" | "tiled"
  electricityTariff?: number
}

export interface CalculatorResult {
  category: "residential" | "commercial" | "society"
  monthlyBill: number
  tariffUsed: number
  monthlyUnitsEstimated: number
  recommendedCapacityKw: number
  approxPanelsCount: number
  rooftopAreaRequiredSqFt: number
  monthlyGenerationKwh: number
  annualGenerationKwh: number
  grossInvestmentInr: number
  subsidyEligible: boolean
  subsidyAmountInr: number
  netInvestmentInr: number
  estimatedMonthlySavingsInr: number
  estimatedAnnualSavingsInr: number
  estimatedLifetimeSavingsInr: number // 25 years with 0.7% annual panel degradation
  paybackPeriodYears: number
  co2OffsetTonnesAnnual: number
  treesEquivalentAnnual: number
  assumptions: {
    generationPerKwDaily: number // ~4.16 kWh/day/kW -> ~125 kWh/month
    panelWattage: number // 550W High-Efficiency
    costPerKw: number
    tariffAssumption: number
  }
}

export function calculateSolarSavings(input: CalculatorInput): CalculatorResult {
  const category = (input.category || (input as unknown as { customerType?: string }).customerType || "residential") as CalculatorInput["category"]
  const { monthlyBill, monthlyUnits, rooftopAreaSqFt, roofType, electricityTariff } = input

  // Standard tariff defaults if not custom provided
  const tariffUsed = electricityTariff && electricityTariff > 0
    ? electricityTariff
    : category === "commercial"
    ? 10.5
    : category === "society"
    ? 8.5
    : 7.5

  // Derived or provided monthly units
  const unitsConsumed = monthlyUnits && monthlyUnits > 0
    ? monthlyUnits
    : Math.round(monthlyBill / tariffUsed)

  // 1 kW generates approx 125 units per month in India (approx 4.16 units/day/kW)
  const monthlyGenPerKw = 125
  let rawKw = unitsConsumed / monthlyGenPerKw

  // Minimum 1 kW
  let recommendedKw = Math.max(1, Math.round(rawKw * 10) / 10)

  // Category specific ceiling guidelines
  if (category === "residential" && recommendedKw > 15) {
    recommendedKw = 15 // Residential cap for standard rooftop
  } else if (category === "society" && recommendedKw > 100) {
    recommendedKw = 100
  }

  // 550W high-efficiency modules
  const panelWattage = 550
  const approxPanelsCount = Math.ceil((recommendedKw * 1000) / panelWattage)

  // Rooftop area needed: ~85 sq.ft per kW for shadow-free flat roof, ~75 sq.ft for slanted metal
  const areaFactor = roofType === "slanted_metal" ? 75 : 85
  const rooftopAreaRequiredSqFt = Math.round(recommendedKw * areaFactor)

  // Generation
  const monthlyGenerationKwh = Math.round(recommendedKw * monthlyGenPerKw)
  const annualGenerationKwh = Math.round(monthlyGenerationKwh * 12)

  // Capital Cost benchmarks (Indian market standard EPC turnkey pricing)
  // Higher scale commercial benefits from economies of scale
  const costPerKw = category === "commercial"
    ? 50000
    : category === "society"
    ? 53000
    : 58000

  const grossInvestmentInr = Math.round(recommendedKw * costPerKw)

  // Central Subsidy (PM Surya Ghar Muft Bijli Yojana - exclusively residential)
  let subsidyAmountInr = 0
  let subsidyEligible = false

  if (category === "residential") {
    subsidyEligible = true
    if (recommendedKw >= 3) {
      subsidyAmountInr = 78000
    } else if (recommendedKw >= 2) {
      subsidyAmountInr = 60000
    } else if (recommendedKw >= 1) {
      subsidyAmountInr = 30000
    }
  }

  const netInvestmentInr = Math.max(0, grossInvestmentInr - subsidyAmountInr)

  // Savings: up to 88% bill offset
  const estimatedMonthlySavingsInr = Math.round(
    Math.min(monthlyBill * 0.9, monthlyGenerationKwh * tariffUsed)
  )
  const estimatedAnnualSavingsInr = estimatedMonthlySavingsInr * 12

  // 25-Year Cumulative Savings assuming 0.7% annual degradation & 3% tariff inflation
  let cumulative25Yrs = 0
  let currentAnnualGen = annualGenerationKwh
  let currentTariff = tariffUsed

  for (let yr = 1; yr <= 25; yr++) {
    cumulative25Yrs += currentAnnualGen * currentTariff
    currentAnnualGen *= 0.993 // 0.7% degradation
    currentTariff *= 1.03 // 3% inflation
  }
  const estimatedLifetimeSavingsInr = Math.round(cumulative25Yrs)

  // Simple Payback period
  const paybackPeriodYears = estimatedAnnualSavingsInr > 0
    ? Number((netInvestmentInr / estimatedAnnualSavingsInr).toFixed(1))
    : 3.5

  // Environmental impact: ~0.82 kg CO2 avoided per kWh in Indian grid mix
  const co2OffsetTonnesAnnual = Number(((annualGenerationKwh * 0.82) / 1000).toFixed(1))
  const treesEquivalentAnnual = Math.round(co2OffsetTonnesAnnual * 18)

  return {
    category,
    monthlyBill,
    tariffUsed,
    monthlyUnitsEstimated: unitsConsumed,
    recommendedCapacityKw: recommendedKw,
    approxPanelsCount,
    rooftopAreaRequiredSqFt,
    monthlyGenerationKwh,
    annualGenerationKwh,
    grossInvestmentInr,
    subsidyEligible,
    subsidyAmountInr,
    netInvestmentInr,
    estimatedMonthlySavingsInr,
    estimatedAnnualSavingsInr,
    estimatedLifetimeSavingsInr,
    paybackPeriodYears,
    co2OffsetTonnesAnnual,
    treesEquivalentAnnual,
    assumptions: {
      generationPerKwDaily: 4.16,
      panelWattage,
      costPerKw,
      tariffAssumption: tariffUsed,
    },
  }
}
