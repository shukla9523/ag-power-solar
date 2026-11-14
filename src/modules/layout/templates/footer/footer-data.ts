/**
 * Purpose: AG POWER Solar website footer link lists and company details.
 */

export type FooterLink = { name: string; href: string }

export const solarSolutionsLinks: FooterLink[] = [
  { name: "Residential Rooftop Solar", href: "/services/residential-solar" },
  { name: "Commercial & Industrial Solar", href: "/services/commercial-solar" },
  { name: "Housing Society Solar", href: "/services/housing-society-solar" },
  { name: "Solar Savings Calculator", href: "/calculator" },
  { name: "Tier-1 Solar Panels Catalogue", href: "/solar-panels" },
  { name: "Customer Services & Maintenance", href: "/customer-services" },
]

export const companyLinks: FooterLink[] = [
  { name: "About AG POWER", href: "/about" },
  { name: "Customer Services", href: "/customer-services" },
  { name: "Solar Knowledge Blogs", href: "/blog" },
  { name: "Solar Installation FAQs", href: "/faq" },
  { name: "Contact & Free Consultation", href: "/contact" },
  { name: "Privacy Policy", href: "/privacy-policy" },
  { name: "Terms of Service", href: "/terms-and-conditions" },
]

export const solarGuideLinks: FooterLink[] = [
  { name: "PM Surya Ghar Muft Bijli Yojana Subsidy Guide", href: "/blog" },
  { name: "TOPCon vs Mono PERC: Choosing the Right Panel", href: "/blog" },
  { name: "How to Calculate Solar ROI & Payback Period", href: "/calculator" },
  { name: "Net Metering Regulations & Process in India", href: "/blog" },
  { name: "Housing Society Common Area Solar Guide", href: "/services/housing-society-solar" },
]

// Backward-compatibility exports for Editz footer
export const editzQuickLinks: FooterLink[] = companyLinks
export const editzVideoEditing: FooterLink[] = solarSolutionsLinks
export const editzAiVideo: FooterLink[] = solarGuideLinks

export const popularSearches = `Rooftop Solar Installation · Residential Solar Panels · Commercial Solar Energy India · Housing Society Solar System · PM Surya Ghar Muft Bijli Yojana · Solar Panel Subsidy in India · Solar Calculator · Solar Net Metering · Best Solar Panels India · TOPCon Solar Modules · Mono PERC Bifacial Panels · 3kW Solar System Cost · 5kW Solar System Price · On-Grid Rooftop Solar · Solar Maintenance Services · Industrial Solar Solutions`

export const seoContent = `AG POWER (Electro Global) is a premier clean energy solutions provider in India, delivering engineered rooftop solar installations for independent homeowners, commercial enterprises, factories, and housing societies. We provide end-to-end solar services including feasibility assessment, custom design, MNRE subsidy assistance, net-metering approvals, professional installation, and lifelong maintenance. Power your home and business with smarter, cleaner energy and take control of your electricity bills with AG POWER.`
