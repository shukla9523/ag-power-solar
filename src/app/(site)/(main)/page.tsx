import { Metadata } from "next"
import { getSeoSetting } from "@lib/data/seo"
import { resolveHomepageData, buildMetadataFromResolved } from "@lib/schema/resolvers"
import JsonLd from "@modules/common/components/json-ld"
import Hero from "@modules/home/components/hero"
import SolarSolutions from "@modules/home/components/solutions"
import WhySolar from "@modules/home/components/why-solar"
import WhyAgPower from "@modules/home/components/why-ag-power"
import QuickCalculator from "@modules/home/components/quick-calculator"
import InstallationProcess from "@modules/home/components/installation-process"
import FeaturedSolarPanels from "@modules/home/components/featured-panels"
import Testimonials from "@modules/home/components/testimonials"
import HomeFaqs from "@modules/home/components/home-faqs"
import FinalCta from "@modules/home/components/final-cta"

export const revalidate = 300

export async function generateMetadata(): Promise<Metadata> {
  const seoSetting = await getSeoSetting("homepage").catch(() => null)
  const resolved = resolveHomepageData(seoSetting)
  const baseMeta = buildMetadataFromResolved(resolved)

  return {
    ...baseMeta,
    title: "AG POWER | Clean Energy. Smarter Living. Rooftop Solar Solutions",
    description:
      "Power your home and business with smarter solar energy. Reduce electricity expenses by up to 90% and gain energy independence with AG POWER.",
    openGraph: {
      title: "AG POWER | Clean Energy. Smarter Living.",
      description:
        "India's trusted solar partner for residential, commercial, and housing society rooftop installations.",
      url: "https://www.agpower.in/",
      siteName: "AG POWER",
      locale: "en_IN",
      type: "website",
    },
  }
}

export default async function Home() {
  const seoSetting = await getSeoSetting("homepage").catch(() => null)

  return (
    <>
      <JsonLd type="homepage" seoSetting={seoSetting} />
      <main className="bg-ivory">
        {/* Section 2: Hero Banner */}
        <Hero />

        {/* Section 3: Solar Solutions (Residential, Commercial, Society) */}
        <SolarSolutions />

        {/* Section 4: Why Choose Solar? */}
        <WhySolar />

        {/* Section 5: Why AG POWER? */}
        <WhyAgPower />

        {/* Section 6: Quick Solar Calculator */}
        <QuickCalculator />

        {/* Section 7: Installation Process */}
        <InstallationProcess />

        {/* Section 8: Featured Solar Panels */}
        <FeaturedSolarPanels />

        {/* Section 9: Customer Testimonials */}
        <Testimonials />

        {/* Section 10: FAQs */}
        <HomeFaqs />

        {/* Section 11: Final Consultation CTA */}
        <FinalCta />
      </main>
    </>
  )
}
