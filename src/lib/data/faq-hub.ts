/**
 * Purpose: builds the /faq knowledge hub from the categorized FAQ sources.
 *
 * Implements brief Part 14:
 * Central FAQ categories:
 * - General solar questions
 * - Residential solar
 * - Commercial solar
 * - Housing society solar
 * - Solar panels
 * - Installation
 * - Maintenance
 * - Savings and subsidy
 *
 * The /faq FAQPage schema is generated from exactly this list, so what is marked up is
 * always 100% visible on the page (visible accordions).
 */

import { ALL_FAQ_CATEGORIES, FAQCategory } from "./all-faqs"

export async function getFaqHubCategories(): Promise<FAQCategory[]> {
  return ALL_FAQ_CATEGORIES
}

/** Flat list used for the /faq FAQPage schema (identical to the visible accordion). */
export function flattenFaqs(categories: FAQCategory[]): { question: string; answer: string }[] {
  return categories.flatMap((c) => c.faqs.map((f) => ({ question: f.question, answer: f.answer })))
}
