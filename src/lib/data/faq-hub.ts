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
  { key: "homepage", name: "About Mommantum", description: "The agency, how we work and what we deliver.", icon: "🏠" },
  { key: "services", name: "Our Services", description: "Performance marketing, SEO, web, AI and video services.", icon: "🧭" },
  { key: "editz", name: "EDITZ Video Editing", description: "Short-form, long-form, podcast and ad video editing.", icon: "🎬" },
  { key: "blog-ai", name: "Blog AI", description: "AI-assisted blog planning, writing and publishing.", icon: "🤖" },
  { key: "work", name: "Case Studies", description: "How we approach client projects and results.", icon: "📈" },
  { key: "about", name: "Team & Studio", description: "Who we are and our Jaipur studio.", icon: "👋" },
  { key: "blog", name: "Blog & Guides", description: "Our articles and growth playbooks.", icon: "📝" },
  { key: "contact", name: "Working With Us", description: "Getting in touch and starting a project.", icon: "✉️" },
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
