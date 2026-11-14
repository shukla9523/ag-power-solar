import { Metadata } from "next"
import { getAllSolarPanels } from "@lib/data/solar-panels"
import CatalogueClient from "./_components/CatalogueClient"

export const metadata: Metadata = {
  title: "Tier-1 Solar Panels Catalogue | TOPCon & Mono PERC Modules | AG POWER",
  description:
    "Explore AG POWER's verified Tier-1 solar panel catalogue. Discover high-efficiency N-Type TOPCon, Mono PERC, and bifacial dual-glass modules for residential and commercial rooftops.",
  openGraph: {
    title: "Solar Panels Catalogue | AG POWER",
    description:
      "Compare Tier-1 solar modules from Waaree, Adani, Vikram Solar, Tata Power, and Goldi Solar. Verified technical specifications and direct enquiry.",
  },
}

export default function SolarPanelsPage() {
  const panels = getAllSolarPanels()

  return (
    <main className="bg-ivory min-h-screen">
      <CatalogueClient initialPanels={panels} />
    </main>
  )
}
