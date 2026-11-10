/**
 * Purpose: /faq knowledge hub. Shows every page's FAQs (homepage, services, Editz, Blog AI,
 * case studies, ...) plus the general knowledge base as accordions, and emits ONE FAQPage
 * schema built from exactly the same list — what is marked up is what visitors see.
 */

import { Metadata } from "next"
import FaqPageClient from "./_components/FaqPageClient"
import JsonLd from "@modules/common/components/json-ld"
import { getSeoSetting } from "@lib/data/seo"
import { flattenFaqs, getFaqHubCategories } from "@lib/data/faq-hub"
import { resolveLegalPageData, buildMetadataFromResolved } from "@lib/schema/resolvers"
import { getPageMetaDefault } from "@lib/schema/page-defaults"

export const revalidate = 3600

const FALLBACK = getPageMetaDefault("faq")!

export async function generateMetadata(): Promise<Metadata> {
  const [seoSetting, categories] = await Promise.all([
    getSeoSetting("faq").catch(() => null),
    getFaqHubCategories(),
  ])
  return buildMetadataFromResolved(
    resolveLegalPageData("faq", FALLBACK.title, FALLBACK.description, seoSetting, flattenFaqs(categories))
  )
}

export default async function FaqPage() {
  const [seoSetting, categories] = await Promise.all([
    getSeoSetting("faq").catch(() => null),
    getFaqHubCategories(),
  ])
  return (
    <>
      <JsonLd
        type="page"
        slug="faq"
        title={FALLBACK.title}
        description={FALLBACK.description}
        seoSetting={seoSetting}
        faqs={flattenFaqs(categories)}
      />
      {/* Unstyled landmark: the root layout wrapper is a plain <div>, so the page owns <main>. */}
      <main>
        <FaqPageClient categories={categories} />
      </main>
    </>
  )
}
