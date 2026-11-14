import { Metadata } from "next"
import CustomerServicesClient from "./_components/CustomerServicesClient"

export const metadata: Metadata = {
  title: "Customer Services & Maintenance | AG POWER Solar Solutions",
  description:
    "Comprehensive solar services: professional solar consultation, installation assistance, AMC maintenance, panel cleaning, and technical inverter support by AG POWER.",
  openGraph: {
    title: "Customer Services | AG POWER",
    description:
      "Expert solar maintenance, rooftop assessment, and technical support across India by AG POWER.",
  },
}

export default function CustomerServicesPage() {
  return (
    <main className="bg-ivory min-h-screen">
      <CustomerServicesClient />
    </main>
  )
}
