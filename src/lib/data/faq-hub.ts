/**
 * Purpose: builds the /faq knowledge hub from the same FAQ sources each page uses.
 *
 * Every page's FAQs (admin-edited in the meta object, or the verified defaults) appear on
 * /faq as their own accordion category, followed by the general knowledge-base categories.
 * The /faq FAQPage schema is generated from exactly this list, so what is marked up is
 * always what is shown. Duplicate questions are shown once.
 */

import { getSeoSetting } from "./seo"
import { getEditzFaqs, getPageFaqs } from "./page-faqs"
import { ALL_FAQ_CATEGORIES, FAQCategory } from "./all-faqs"

const PAGE_CATEGORIES: { key: string; name: string; description: string; icon: string }[] = [
  { key: "homepage", name: "About AG POWER", description: "Company overview, engineering standards, and rooftop solar benefits.", icon: "☀️" },
  { key: "residential", name: "Residential Solar", description: "Home rooftop installations, net-metering, and PM Surya Ghar subsidy.", icon: "🏡" },
  { key: "commercial", name: "Commercial & Industrial", description: "Factory, warehouse, and office solar plants, ROI, and tax depreciation.", icon: "🏢" },
  { key: "housing-society", name: "Housing Society Solar", description: "Apartment and RWA common area solar solutions and net metering.", icon: "🏘️" },
  { key: "solar-panels", name: "Solar Panels & Tech", description: "TOPCon vs Mono PERC, Bifacial modules, DCR compliance, and warranties.", icon: "⚡" },
  { key: "calculator", name: "Savings & Calculator", description: "Estimating system kW capacity, bill reduction, and payback periods.", icon: "🧮" },
  { key: "services", name: "EPC & Maintenance", description: "Site surveys, DISCOM net-metering liaison, AMC, and inverter care.", icon: "🛠️" },
  { key: "about", name: "Engineering & Company", description: "Electro Global heritage, Tier-1 standards, and certified engineers.", icon: "🌱" },
  { key: "contact", name: "Consultations & Process", description: "Booking a free site survey, timeline, and what happens next.", icon: "📞" },
]

const normalize = (q: string) => q.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim()

export async function getFaqHubCategories(): Promise<FAQCategory[]> {
  const seen = new Set<string>()
  const categories: FAQCategory[] = []

  const pageSettings = await Promise.all(
    PAGE_CATEGORIES.map((c) => getSeoSetting(c.key).catch(() => null))
  )

  PAGE_CATEGORIES.forEach((meta, index) => {
    const setting = pageSettings[index]
    const faqs = meta.key === "editz" ? getEditzFaqs(setting) : getPageFaqs(meta.key, setting)
    const items = faqs
      .filter((f) => {
        const key = normalize(f.question)
        if (!key || seen.has(key)) return false
        seen.add(key)
        return true
      })
      .map((f, i) => ({ id: `${meta.key}-${i + 1}`, question: f.question, answer: f.answer, category: meta.name }))
    if (items.length) {
      categories.push({ id: meta.key, name: meta.name, description: meta.description, icon: meta.icon, faqs: items })
    }
  })

  for (const category of ALL_FAQ_CATEGORIES) {
    const items = category.faqs.filter((f) => {
      const key = normalize(f.question)
      if (!key || seen.has(key)) return false
      seen.add(key)
      return true
    })
    if (items.length) categories.push({ ...category, faqs: items })
  }

  return categories
}

/** Flat list used for the /faq FAQPage schema (identical to the visible accordion). */
export function flattenFaqs(categories: FAQCategory[]): { question: string; answer: string }[] {
  return categories.flatMap((c) => c.faqs.map((f) => ({ question: f.question, answer: f.answer })))
}
