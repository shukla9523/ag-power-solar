/**
 * @file page-defaults.ts
 * @description Centralized fallback meta title and description for static pages.
 * Configured for AG POWER Solar Solutions (Electro Global).
 * 
 * Rules:
 * - Title: 50 to 60 characters
 * - Description: 140 to 160 characters
 */

export interface PageMetaDefault {
  title: string
  description: string
}

export const PAGE_META_DEFAULTS: Record<string, PageMetaDefault> = {
  homepage: {
    title: "AG POWER | Rooftop Solar Solutions & EPC Systems India",
    description:
      "AG POWER (by Electro Global) delivers turnkey rooftop solar solutions for homes, commercial businesses, and housing societies with PM Surya Ghar subsidy.",
  },
  about: {
    title: "About AG POWER | Solar Energy Solutions by Electro Global",
    description:
      "Learn about AG POWER, an engineering-first solar EPC company delivering Tier-1 rooftop solar systems, expert DISCOM liaison, and 25-year reliability.",
  },
  contact: {
    title: "Contact AG POWER | Request a Free Rooftop Solar Survey",
    description:
      "Connect with AG POWER solar engineers for a free site audit, shadow analysis, and customized rooftop solar proposal. Call or WhatsApp +91 98765 43210.",
  },
  services: {
    title: "Solar EPC Services | Residential, Commercial & Society",
    description:
      "Turnkey solar EPC services by AG POWER: residential rooftop plants, commercial solar, housing society common systems, DISCOM liaison, and solar AMC.",
  },
  "solar-panels": {
    title: "Solar Panel Catalogue | Tier-1 N-Type TOPCon & Bifacial",
    description:
      "Explore Tier-1 ALMM solar panels from Waaree, Adani, Tata Power, and Vikram Solar. Compare N-Type TOPCon and Bifacial module specs with AG POWER.",
  },
  calculator: {
    title: "Solar Savings Calculator | Estimate kW, Cost & Subsidy",
    description:
      "Calculate recommended solar system capacity, monthly bill reduction, PM Surya Ghar subsidy, and 25-year return on investment with AG POWER today.",
  },
  "customer-services": {
    title: "Solar Customer Services & Maintenance | AG POWER EPC",
    description:
      "Comprehensive solar customer services: free rooftop feasibility surveys, DISCOM net-metering liaison, Annual Maintenance Contracts, and cleaning.",
  },
  work: {
    title: "Solar Project Portfolio | AG POWER Rooftop Installations",
    description:
      "Explore verified residential, commercial, and housing society solar installations executed across India with high-efficiency Tier-1 solar modules.",
  },
  blog: {
    title: "Solar Insights Blog | Rooftop Guides & Subsidy Updates",
    description:
      "Read expert guides on rooftop solar sizing, net-metering regulations, PM Surya Ghar procedures, and solar technology comparisons from AG POWER.",
  },
  editz: {
    title: "AG POWER Media | Clean Energy Documentation & Videos",
    description:
      "Visual documentation, case study breakdowns, and customer video walkthroughs of rooftop solar installations engineered across India by AG POWER.",
  },
  "blog-ai": {
    title: "Solar Knowledge Center | Powered by AG POWER Engineers",
    description:
      "Accurate technical solar insights and regulatory guides to help Indian homeowners and enterprises transition smoothly to rooftop solar power.",
  },
  "privacy-policy": {
    title: "Privacy Policy | AG POWER Data Protection Practices",
    description:
      "Read the AG POWER privacy policy. We adhere to DPDP Act 2023 principles, protecting your contact data and using it solely for solar feasibility audits.",
  },
  "terms-and-conditions": {
    title: "Terms and Conditions | AG POWER Solar Solutions India",
    description:
      "Read the terms and conditions governing AG POWER website usage, indicative calculator estimates, site inspection bookings, and turnkey EPC contracts.",
  },
  faq: {
    title: "Solar FAQs | AG POWER Subsidies, Net Metering & ROI",
    description:
      "Find clear answers to questions on PM Surya Ghar subsidies, net metering, Tier-1 solar panel technology, and 25-year rooftop savings with AG POWER.",
  },
}

export function getPageMetaDefault(pageKey: string): PageMetaDefault | undefined {
  return PAGE_META_DEFAULTS[pageKey]
}
