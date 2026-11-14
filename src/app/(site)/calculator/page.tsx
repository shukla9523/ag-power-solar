import { Metadata } from "next"
import CalculatorClient from "./_components/CalculatorClient"

export const metadata: Metadata = {
  title: "Solar Savings Calculator | Estimate Capacity, Investment & ROI | AG POWER",
  description:
    "Calculate your rooftop solar potential in seconds. Discover recommended system capacity (kW), monthly savings, PM Surya Ghar subsidy eligibility, and payback period with AG POWER.",
  openGraph: {
    title: "Solar Calculator | AG POWER Solar Solutions",
    description:
      "Estimate rooftop solar capacity, monthly power bill savings, and investment cost for residential, commercial, and housing societies in India.",
  },
}

export default function CalculatorPage({
  searchParams,
}: {
  searchParams?: Promise<{ cat?: string; bill?: string }>
}) {
  return (
    <main className="bg-ivory min-h-screen">
      <CalculatorClient initialSearchParams={searchParams} />
    </main>
  )
}
