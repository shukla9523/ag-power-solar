import { Metadata } from "next"
import { getSeoSetting } from "@lib/data/seo"
import { resolveAboutData, buildMetadataFromResolved } from "@lib/schema/resolvers"
import JsonLd from "@modules/common/components/json-ld"
import { getPageFaqs } from "@lib/data/page-faqs"
import PageFaqSection from "@modules/common/components/page-faq-section"
import AboutClient from "./_components/AboutClient"

export const revalidate = 60

export async function generateMetadata(): Promise<Metadata> {
  const seoSetting = await getSeoSetting("about").catch(() => null)
  const resolved = resolveAboutData(seoSetting)
  return buildMetadataFromResolved(resolved)
}

export default async function AboutPage() {
  const countryCode = "in"
  const seoSetting = await getSeoSetting("about").catch(() => null)
  const faqs = getPageFaqs("about", seoSetting)

  return (
    <>
      <JsonLd type="about" seoSetting={seoSetting} />
      <AboutClient countryCode={countryCode}>
        {faqs && faqs.length > 0 && (
          <PageFaqSection
            faqs={faqs}
            title="About AG POWER FAQs"
            subtitle="Verified answers about our solar EPC engineering, Tier-1 standards, and Electro Global leadership."
          />
        )}
      </AboutClient>
    </>
  )
}
