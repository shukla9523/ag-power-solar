/**
 * Centralized FAQ Data Repository for AG POWER Solar Solutions
 */

export interface FAQItem {
  id: string
  question: string
  answer: string
  category: string
}

export interface FAQCategory {
  id: string
  name: string
  description: string
  icon: string
  faqs: FAQItem[]
}

export const HOMEPAGE_FOOTER_FAQS: FAQItem[] = [
  {
    id: "home-1",
    question: "What does AG POWER do?",
    answer:
      "AG POWER (by Electro Global) is a leading solar EPC provider in India. We design, engineer, install, and maintain high-efficiency rooftop and ground-mounted solar power plants for residential homeowners, commercial enterprises, factories, and housing societies.",
    category: "General",
  },
  {
    id: "home-2",
    question: "How much can I reduce my monthly electricity bill with solar?",
    answer:
      "A properly sized on-grid solar system offsets up to 80% to 90% of your grid electricity consumption. Surplus generation during sunny daylight hours is fed back into the DISCOM grid via net-metering and credited against your night-time consumption.",
    category: "General",
  },
  {
    id: "home-3",
    question: "How does the PM Surya Ghar Muft Bijli Yojana subsidy work?",
    answer:
      "Under the central PM Surya Ghar scheme, residential homeowners can receive up to ₹30,000 for a 1 kW system, ₹60,000 for a 2 kW system, and ₹78,000 for 3 kW and higher systems. AG POWER handles the complete registration, DISCOM net-metering liaison, and subsidy disbursement filing.",
    category: "Subsidy",
  },
  {
    id: "home-4",
    question: "What warranties and guarantees come with an AG POWER solar system?",
    answer:
      "All our Tier-1 solar panels carry a 10 to 12-year product manufacturing warranty and a 25 to 30-year linear power generation warranty. Grid-tie inverters carry 5 to 10-year warranties. In addition, AG POWER provides a 5-year comprehensive workmanship guarantee.",
    category: "Warranty",
  },
]

export const ALL_FAQ_CATEGORIES: FAQCategory[] = [
  {
    id: "residential-solar",
    name: "Residential Solar",
    description: "Questions about home rooftop solar, space required, and electricity savings.",
    icon: "home",
    faqs: [
      {
        id: "res-1",
        question: "How much rooftop area is needed for a residential solar plant?",
        answer: "A standard 1 kW solar plant requires roughly 80 to 100 square feet of shadow-free rooftop space. A typical 3 kW home system requires approximately 250 to 300 sq.ft of clear area.",
        category: "Residential Solar",
      },
      {
        id: "res-2",
        question: "Will the solar installation damage my roof or cause leakages?",
        answer: "No. AG POWER uses specialized non-penetrating chemical anchoring or pre-cast concrete ballast structures designed specifically to protect your rooftop waterproofing integrity.",
        category: "Residential Solar",
      },
      {
        id: "res-3",
        question: "What capacity system do I need for my home?",
        answer: "System capacity depends on your monthly bill: For bills between ₹2,000 to ₹4,000/mo, a 2-3 kW system is ideal. For ₹5,000 to ₹8,000/mo, a 4-5 kW system is recommended. For larger villas with multiple ACs, a 7-10 kW system is optimal.",
        category: "Residential Solar",
      },
      {
        id: "res-4",
        question: "How long does a home solar installation take?",
        answer: "Physical on-site installation typically takes 2 to 3 days. The complete cycle including site survey, 3D design, DISCOM net-meter sanctioning, and commissioning takes roughly 3 to 4 weeks.",
        category: "Residential Solar",
      },
    ],
  },
  {
    id: "commercial-solar",
    name: "Commercial & Industrial",
    description: "Questions for factories, warehouses, offices, and institutions.",
    icon: "building",
    faqs: [
      {
        id: "com-1",
        question: "What is the typical ROI and payback period for commercial solar?",
        answer: "Because commercial and industrial electricity tariffs range from ₹9 to ₹12+ per unit, most commercial installations achieve full capital payback within 2.5 to 4 years, followed by 20+ years of virtually zero-cost power.",
        category: "Commercial Solar",
      },
      {
        id: "com-2",
        question: "Can commercial enterprises claim accelerated depreciation on solar?",
        answer: "Yes. Under Section 32 of the Income Tax Act, commercial businesses and industrial units can claim 40% accelerated depreciation in the first year of solar plant commissioning, significantly lowering tax liabilities.",
        category: "Commercial Solar",
      },
      {
        id: "com-3",
        question: "Can solar panels be installed on industrial curved or trapezoidal tin sheds?",
        answer: "Yes. AG POWER engineers custom anodized aluminum clamp mounting systems designed specifically for trapezoidal, standing-seam, and curved metal roofs with zero roof sheet penetration.",
        category: "Commercial Solar",
      },
      {
        id: "com-4",
        question: "Will our production lines experience downtime during installation?",
        answer: "No. All heavy structural assembly, string cabling, and inverter mounting are executed without interfering with your facility's daily manufacturing operations.",
        category: "Commercial Solar",
      },
    ],
  },
  {
    id: "housing-society-solar",
    name: "Housing Society Solar",
    description: "Questions for RWAs, apartment complexes, and high-rise societies.",
    icon: "users",
    faqs: [
      {
        id: "soc-1",
        question: "Which common amenities in a housing society can run on solar?",
        answer: "Solar directly powers elevators, borewell and water lifting pumps, basement & perimeter security lighting, clubhouse facilities, and sewage treatment plants (STPs).",
        category: "Housing Society Solar",
      },
      {
        id: "soc-2",
        question: "How does net-metering work for a housing society common connection?",
        answer: "The solar plant is synchronized with the society's common area commercial/bulk meter. Any generation offsets common area consumption directly, lowering maintenance costs for every resident.",
        category: "Housing Society Solar",
      },
      {
        id: "soc-3",
        question: "Does AG POWER help with RWA committee approval and presentations?",
        answer: "Yes. Our senior engineers provide complete feasibility presentations, financial ROI models, and technical Q&A sessions for your RWA General Body Meeting.",
        category: "Housing Society Solar",
      },
    ],
  },
  {
    id: "solar-panels",
    name: "Solar Panels & Technology",
    description: "Questions about Mono PERC vs TOPCon, Bifacial technology, and efficiencies.",
    icon: "layers",
    faqs: [
      {
        id: "pan-1",
        question: "What is the difference between TOPCon and Mono PERC solar panels?",
        answer: "N-Type TOPCon panels are newer-generation modules offering higher efficiency (22.5%+), better temperature tolerance in hot summers, and zero Light Induced Degradation compared to standard Mono PERC modules.",
        category: "Solar Panels",
      },
      {
        id: "pan-2",
        question: "What are Bifacial solar panels and how do they benefit me?",
        answer: "Bifacial panels have solar cells on both the front and rear sides. They generate additional electricity (up to 15-25% extra) by absorbing sunlight reflected from the roof floor (albedo effect).",
        category: "Solar Panels",
      },
      {
        id: "pan-3",
        question: "What does DCR compliant mean?",
        answer: "DCR (Domestic Content Requirement) mandates that both solar cells and modules are manufactured in India. DCR compliance is required to qualify for central government subsidies under PM Surya Ghar.",
        category: "Solar Panels",
      },
    ],
  },
]
