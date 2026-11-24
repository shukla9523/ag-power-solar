/**
 * Site Statistics Configuration for AG POWER Solar Solutions
 * 
 * Replace these placeholder statistics with audited business milestones
 * once official installation counters are ready.
 */
export interface SiteStat {
  id: string
  value: number
  suffix: string
  label: string
  description: string
}

export const SITE_STATS: SiteStat[] = [
  {
    id: "rooftops-commissioned",
    value: 500,
    suffix: "+",
    label: "Rooftops Commissioned",
    description: "Across residential, commercial, and industrial sites in Rajasthan & North India",
    // REPLACE WITH REAL NUMBERS
  },
  {
    id: "megawatts-installed",
    value: 12,
    suffix: "+ MW",
    label: "Solar Capacity Installed",
    description: "Clean grid-tied power generation capacity",
    // REPLACE WITH REAL NUMBERS
  },
  {
    id: "annual-co2-offset",
    value: 15000,
    suffix: "+ Tons",
    label: "CO₂ Offset Annually",
    description: "Equivalent to over 2.5 lakh mature trees planted",
    // REPLACE WITH REAL NUMBERS
  },
  {
    id: "subsidy-success-rate",
    value: 99.4,
    suffix: "%",
    label: "Subsidy Sanction Rate",
    description: "Under PM Surya Ghar Muft Bijli Yojana & DISCOMs",
    // REPLACE WITH REAL NUMBERS
  },
]
