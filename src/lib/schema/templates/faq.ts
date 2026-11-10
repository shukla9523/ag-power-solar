import { getEntityId } from "../config"
import { devWarn } from "../validate"

export interface FAQItem {
  question: string
  answer: string
}

export interface FAQTemplateOptions {
  pageUrl: string
  faqs: FAQItem[]
}

/**
 * Creates FAQPage schema.
 * Emits ONLY when there is at least 1 valid Q&A item; duplicate questions are dropped.
 * Warns in dev mode if service FAQ answers are outside 40-60 words.
 */
export function createFAQSchema(options: FAQTemplateOptions): Record<string, any> | null {
  const { pageUrl, faqs } = options
  if (!faqs || !Array.isArray(faqs) || faqs.length === 0) {
    return null
  }

  // One Question per distinct question text inside a single FAQPage.
  const seenQuestions = new Set<string>()
  const validFaqs = faqs.filter((f) => {
    if (!f || typeof f.question !== "string" || !f.question.trim() || typeof f.answer !== "string" || !f.answer.trim()) {
      return false
    }
    const key = f.question.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim()
    if (!key || seenQuestions.has(key)) return false
    seenQuestions.add(key)
    return true
  })

  if (validFaqs.length === 0) {
    return null
  }

  // Soft word count check for quality
  validFaqs.forEach((f, idx) => {
    const wordCount = f.answer.trim().split(/\s+/).length
    if (wordCount < 30 || wordCount > 70) {
      devWarn(`FAQ index ${idx} ("${f.question.slice(0, 30)}...") has answer length of ${wordCount} words (recommendation: 40-60 words).`)
    }
  })

  const faqId = getEntityId(pageUrl, "#faq")

  return {
    "@type": "FAQPage",
    "@id": faqId,
    mainEntity: validFaqs.map((f) => ({
      "@type": "Question",
      name: f.question.trim(),
      acceptedAnswer: {
        "@type": "Answer",
        text: f.answer.trim(),
      },
    })),
  }
}
