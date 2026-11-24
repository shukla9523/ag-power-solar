/**
 * @file solar-panels.ts
 * @description Data model and verified solar panel specifications catalogue.
 * Strictly informational and discovery — non-ecommerce.
 */

export interface SolarPanel {
  id: string
  slug: string
  brand: string
  modelName: string
  wattage: number
  wattageDisplay: string
  cellTechnology: "N-Type TOPCon" | "Mono PERC" | "HJT"
  moduleType: "Bifacial Dual-Glass" | "Monofacial" | "All-Black Monofacial"
  dcrCompliant: boolean
  efficiency: number // percentage e.g. 22.4
  dimensions: string // e.g. "2278 x 1134 x 30 mm"
  weightKg: number
  productWarrantyYears: number
  performanceWarrantyYears: number
  temperatureCoefficient: string // e.g. "-0.30%/°C"
  maxSystemVoltage: string // e.g. "1500V DC"
  keyBenefits: string[]
  idealApplications: string[]
  badge?: string
}

export const SOLAR_PANELS_DATA: SolarPanel[] = [
  {
    id: "waaree-arka-topcon-550w",
    slug: "waaree-arka-topcon-550w",
    brand: "Waaree",
    modelName: "Arka Series N-Type TOPCon Dual-Glass Bifacial",
    wattage: 550,
    wattageDisplay: "550W - 580W",
    cellTechnology: "N-Type TOPCon",
    moduleType: "Bifacial Dual-Glass",
    dcrCompliant: true,
    efficiency: 22.6,
    dimensions: "2278 x 1134 x 30 mm",
    weightKg: 32.5,
    productWarrantyYears: 12,
    performanceWarrantyYears: 30,
    temperatureCoefficient: "-0.30%/°C",
    maxSystemVoltage: "1500V DC",
    keyBenefits: [
      "Up to 80% bifaciality for ground reflection energy capture",
      "Superior low-light performance during sunrise, sunset & cloudy weather",
      "N-Type cell architecture eliminates Light Induced Degradation (LID)",
      "Dual-glass front and back for exceptional weather & PID resistance",
    ],
    idealApplications: [
      "Commercial industrial sheds & warehouses",
      "Ground-mount projects & parking carports",
      "High-yield residential rooftops with reflective flooring",
    ],
    badge: "Most Popular",
  },
  {
    id: "adani-shine-mono-perc-540w",
    slug: "adani-shine-mono-perc-540w",
    brand: "Adani Solar",
    modelName: "Shine Series Multi-Busbar Mono PERC Module",
    wattage: 540,
    wattageDisplay: "540W - 550W",
    cellTechnology: "Mono PERC",
    moduleType: "Monofacial",
    dcrCompliant: true,
    efficiency: 21.3,
    dimensions: "2279 x 1134 x 35 mm",
    weightKg: 28.5,
    productWarrantyYears: 12,
    performanceWarrantyYears: 25,
    temperatureCoefficient: "-0.35%/°C",
    maxSystemVoltage: "1500V DC",
    keyBenefits: [
      "Proven reliability in harsh Indian climatic environments",
      "Multi-busbar half-cut cell design minimizes resistive losses",
      "High mechanical load capacity: 5400 Pa snow / 2400 Pa wind",
      "Approved under ALMM (Approved List of Models & Manufacturers)",
    ],
    idealApplications: [
      "Residential rooftop installations (1kW - 10kW)",
      "Standard housing societies and villas",
      "Educational institutions and commercial buildings",
    ],
    badge: "Best Value",
  },
  {
    id: "vikram-somera-topcon-575w",
    slug: "vikram-somera-topcon-575w",
    brand: "Vikram Solar",
    modelName: "SOMERA Grand Series N-Type TOPCon Bifacial",
    wattage: 575,
    wattageDisplay: "575W - 590W",
    cellTechnology: "N-Type TOPCon",
    moduleType: "Bifacial Dual-Glass",
    dcrCompliant: true,
    efficiency: 22.8,
    dimensions: "2382 x 1134 x 30 mm",
    weightKg: 33.0,
    productWarrantyYears: 12,
    performanceWarrantyYears: 30,
    temperatureCoefficient: "-0.29%/°C",
    maxSystemVoltage: "1500V DC",
    keyBenefits: [
      "Maximum wattage density for space-constrained rooftops",
      "Best-in-class temperature coefficient for hot summer performance",
      "Micro-gap ribbon connection technology for higher active area",
      "Extreme durability certified against salt mist, ammonia, and sand",
    ],
    idealApplications: [
      "Large-scale commercial & industrial factories",
      "High-rise housing society common rooftops",
      "Captive solar plants & institutional campuses",
    ],
    badge: "Highest Efficiency",
  },
  {
    id: "tata-power-mono-perc-545w",
    slug: "tata-power-mono-perc-545w",
    brand: "Tata Power Solar",
    modelName: "TP Series High Efficiency Half-Cell Mono PERC",
    wattage: 545,
    wattageDisplay: "545W - 550W",
    cellTechnology: "Mono PERC",
    moduleType: "Monofacial",
    dcrCompliant: true,
    efficiency: 21.5,
    dimensions: "2278 x 1134 x 35 mm",
    weightKg: 28.0,
    productWarrantyYears: 12,
    performanceWarrantyYears: 25,
    temperatureCoefficient: "-0.34%/°C",
    maxSystemVoltage: "1500V DC",
    keyBenefits: [
      "Backed by Tata Power&apos;s trusted Indian energy engineering legacy",
      "Stringent 100% EL (Electroluminescence) testing to prevent micro-cracks",
      "Anti-reflective ARC coated tempered solar glass",
      "Seamless DISCOM subsidy verification under PM Surya Ghar",
    ],
    idealApplications: [
      "PM Surya Ghar residential installations",
      "Urban rooftop homes and farmhouses",
      "Commercial office buildings",
    ],
    badge: "Legacy Trust",
  },
  {
    id: "goldi-heloc-plus-topcon-550w",
    slug: "goldi-heloc-plus-topcon-550w",
    brand: "Goldi Solar",
    modelName: "HELOC Plus TOPCon Bifacial Glass-to-Glass",
    wattage: 550,
    wattageDisplay: "550W - 570W",
    cellTechnology: "N-Type TOPCon",
    moduleType: "Bifacial Dual-Glass",
    dcrCompliant: true,
    efficiency: 22.4,
    dimensions: "2278 x 1134 x 30 mm",
    weightKg: 31.5,
    productWarrantyYears: 12,
    performanceWarrantyYears: 30,
    temperatureCoefficient: "-0.30%/°C",
    maxSystemVoltage: "1500V DC",
    keyBenefits: [
      "Class-A fire resistance rating for industrial safety compliance",
      "Lower operating temperature enhances kWh yield in sunny climates",
      "High shade tolerance due to split-cell internal bypass diodes",
      "30-year linear performance warranty with guaranteed 87.4% output",
    ],
    idealApplications: [
      "Industrial manufacturing units & warehouses",
      "Commercial complexes & cold storage facilities",
      "Large residential societies",
    ],
  },
  {
    id: "architectural-all-black-450w",
    slug: "architectural-all-black-450w",
    brand: "RenewSys",
    modelName: "Architectural Ultra All-Black Series",
    wattage: 450,
    wattageDisplay: "440W - 460W",
    cellTechnology: "N-Type TOPCon",
    moduleType: "All-Black Monofacial",
    dcrCompliant: false,
    efficiency: 22.1,
    dimensions: "1762 x 1134 x 30 mm",
    weightKg: 21.0,
    productWarrantyYears: 15,
    performanceWarrantyYears: 25,
    temperatureCoefficient: "-0.30%/°C",
    maxSystemVoltage: "1500V DC",
    keyBenefits: [
      "Stunning full matte black appearance with zero visible silver ribbons",
      "Compact form factor ideal for pitched roofs and architectural villas",
      "Lightweight for easy handling and versatile mounting orientations",
      "Premium black anodized frame blends seamlessly into rooflines",
    ],
    idealApplications: [
      "Luxury bungalows, villas & designer residences",
      "Architectural sloped roofs and resorts",
      "Aesthetic-priority urban homes",
    ],
    badge: "Designer Choice",
  },
]

export function getAllSolarPanels(): SolarPanel[] {
  return SOLAR_PANELS_DATA
}

export function getSolarPanelBySlug(slug: string): SolarPanel | undefined {
  return SOLAR_PANELS_DATA.find((p) => p.slug === slug || p.id === slug)
}
