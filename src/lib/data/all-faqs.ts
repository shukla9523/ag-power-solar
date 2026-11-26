/**
 * Centralized FAQ Data Repository for AG POWER Solar Solutions
 * 
 * Follows brief Part 14:
 * Central FAQ page categories:
 * - General solar questions
 * - Residential solar
 * - Commercial solar
 * - Housing society solar
 * - Solar panels
 * - Installation
 * - Maintenance
 * - Savings and subsidy
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
    category: "General Solar Questions",
  },
  {
    id: "home-2",
    question: "How much can I reduce my monthly electricity bill with solar?",
    answer:
      "A properly sized on-grid solar system offsets up to 80% to 90% of your grid electricity consumption. Surplus generation during sunny daylight hours is fed back into the DISCOM grid via net-metering and credited against your night-time consumption.",
    category: "Savings and Subsidy",
  },
  {
    id: "home-3",
    question: "How does the PM Surya Ghar Muft Bijli Yojana subsidy work?",
    answer:
      "Under the central PM Surya Ghar scheme, residential homeowners can receive up to ₹30,000 for a 1 kW system, ₹60,000 for a 2 kW system, and ₹78,000 for 3 kW and higher systems. AG POWER handles the complete registration, DISCOM net-metering liaison, and subsidy disbursement filing.",
    category: "Savings and Subsidy",
  },
  {
    id: "home-4",
    question: "What warranties and guarantees come with an AG POWER solar system?",
    answer:
      "All our solar panels carry a 10 to 12-year product manufacturing warranty and a 25 to 30-year linear power generation warranty. Grid-tie inverters carry 5 to 10-year warranties. In addition, AG POWER provides a 5-year comprehensive workmanship guarantee.",
    category: "Solar Panels",
  },
]

export const ALL_FAQ_CATEGORIES: FAQCategory[] = [
  {
    id: "general-solar",
    name: "General Solar Questions",
    description: "Fundamental concepts about solar energy, on-grid systems, and net metering in India.",
    icon: "sun",
    faqs: [
      {
        id: "gen-1",
        question: "How does an on-grid rooftop solar system work in India?",
        answer: "Solar panels convert sunlight into Direct Current (DC) power. A grid-tied inverter transforms this DC electricity into 230V/415V Alternating Current (AC) synchronized with your DISCOM grid power. Electricity generated powers your home directly; any excess is exported to the grid via a bi-directional net meter.",
        category: "General Solar Questions",
      },
      {
        id: "gen-2",
        question: "What is net-metering and how does it affect my electricity bill?",
        answer: "Net-metering is a billing mechanism that credits solar energy system owners for the electricity they feed back into the grid. Your DISCOM bi-directional meter measures both imported power and exported solar energy, and you are billed only for the net difference.",
        category: "General Solar Questions",
      },
      {
        id: "gen-3",
        question: "Will solar panels work on cloudy or rainy days?",
        answer: "Yes. Solar panels generate power from ambient daylight irradiance, producing approximately 25% to 40% of their peak capacity on overcast days. At night, seamless power is drawn from the DISCOM utility grid.",
        category: "General Solar Questions",
      },
    ],
  },
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
    name: "Commercial Solar",
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
      {
        id: "soc-4",
        question: "Is group housing society rooftop solar eligible for government subsidies?",
        // TODO: Verify group housing subsidy slabs with local DISCOM/MNRE scheme before updating exact amounts
        answer: "Group housing societies and residential RWAs can claim central financial assistance for common utility rooftop installations up to 500 kW capacity. Exact financial assistance is subject to current government scheme regulations, technical feasibility approvals, and regional DISCOM net-metering sanction guidelines for common connections.",
        category: "Housing Society Solar",
      },
      {
        id: "soc-5",
        question: "How does virtual net-metering work for housing societies?",
        // TODO: Check DISCOM virtual net metering policy in your specific state/circle
        answer: "Virtual net-metering allows solar power produced from a collective rooftop plant to be proportionally allocated and credited across multiple individual resident electricity meters or common service accounts. Implementation and eligibility are strictly subject to state DISCOM regulations, technical grid compatibility, and state electricity regulatory commission guidelines.",
        category: "Housing Society Solar",
      },
    ],
  },
  {
    id: "solar-panels",
    name: "Solar Panels",
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
  {
    id: "installation",
    name: "Installation",
    description: "Structure mounting, earthing, DISCOM net-meter inspection, and timelines.",
    icon: "wrench",
    faqs: [
      {
        id: "inst-1",
        question: "What mounting structures are used for rooftop solar installations?",
        answer: "AG POWER installs hot-dip galvanized steel structures with a minimum 80-micron coating, engineered to withstand wind speeds up to 150-170 km/h in accordance with IS 875 wind code standards.",
        category: "Installation",
      },
      {
        id: "inst-2",
        question: "What electrical safety protections are installed with the system?",
        answer: "Every installation includes dual AC/DC Surge Protection Devices (SPDs), dedicated chemical earthing pits for structure, inverter, and lightning arrestor, and Type-II DC isolators.",
        category: "Installation",
      },
      {
        id: "inst-3",
        question: "Who handles the DISCOM liaison and net-meter approvals?",
        answer: "AG POWER manages the complete DISCOM paperwork: application filing, site inspection coordination, meter testing, and final synchronization on your behalf.",
        category: "Installation",
      },
    ],
  },
  {
    id: "maintenance",
    name: "Maintenance",
    description: "Cleaning frequency, AMC packages, inverter care, and warranty servicing.",
    icon: "activity",
    faqs: [
      {
        id: "maint-1",
        question: "How often should rooftop solar panels be cleaned?",
        answer: "Under standard Indian environmental conditions, washing solar panels with soft water once every 10 to 15 days is recommended to prevent 8% to 12% generation loss caused by ambient dust.",
        category: "Maintenance",
      },
      {
        id: "maint-2",
        question: "What is included in an AG POWER Annual Maintenance Contract (AMC)?",
        answer: "Our AMC packages include scheduled panel washing, electrical string diagnostics, inverter health checks, thermal imaging, and priority on-call breakdown assistance.",
        category: "Maintenance",
      },
      {
        id: "maint-3",
        question: "What happens if a solar inverter or panel develops a defect?",
        answer: "AG POWER assists with immediate on-site diagnostics and handles direct warranty replacement with the equipment manufacturer without hassle to the customer.",
        category: "Maintenance",
      },
    ],
  },
  {
    id: "savings-subsidy",
    name: "Savings and Subsidy",
    description: "PM Surya Ghar subsidy eligibility, electricity savings calculation, and payback.",
    icon: "calculator",
    faqs: [
      {
        id: "sav-1",
        question: "What is the maximum subsidy available under PM Surya Ghar Muft Bijli Yojana?",
        answer: "Residential homeowners receive ₹30,000 for 1 kW, ₹60,000 for 2 kW, and a maximum of ₹78,000 for 3 kW and higher capacity systems directly deposited into their bank account via DBT.",
        category: "Savings and Subsidy",
      },
      {
        id: "sav-2",
        question: "How long does it take to receive the PM Surya Ghar subsidy in my bank account?",
        answer: "After the physical installation is commissioned and the DISCOM inspects and uploads the net-meter certificate, the subsidy is credited directly via DBT within 30 to 45 business days.",
        category: "Savings and Subsidy",
      },
      {
        id: "sav-3",
        question: "Is electricity bill savings from solar tax-free in India?",
        answer: "Yes. Reductions in your personal electricity bills are not treated as taxable income under Indian Income Tax regulations, delivering 100% tax-free financial returns.",
        category: "Savings and Subsidy",
      },
    ],
  },
]
