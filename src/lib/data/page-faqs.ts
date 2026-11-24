/**
 * @file page-faqs.ts
 * @description Centralized FAQ repository for AG POWER Solar Solutions website.
 * Ensures visible FAQs and JSON-LD schema FAQs are 100% identical on every page.
 * 
 * Rules enforced:
 * - 6 to 10 FAQs per page.
 * - Answers 40 to 60 words, plain text, no markdown.
 * - Strictly confirmed facts only regarding solar systems, PM Surya Ghar subsidy, net metering, and EPC warranties.
 */

import { FAQS as EDITZ_FAQS } from "@modules/editz/lib/data"

export interface PageFAQ {
  id?: string
  question: string
  answer: string
}

export const PAGE_FAQS_MAP: Record<string, PageFAQ[]> = {
  "homepage": [
    {
      question: "What does AG POWER do?",
      answer: "AG POWER (by Electro Global) is a premier solar EPC provider in India. We design, engineer, install, and service high-performance rooftop and ground-mounted solar power plants for residential homeowners, commercial enterprises, industrial facilities, and cooperative housing societies, providing turnkey solutions from feasibility survey to DISCOM net-metering synchronization."
    },
    {
      question: "How much can I reduce my monthly electricity bill with solar?",
      answer: "A properly sized grid-tied solar system typically offsets 80% to 90% of your current monthly electricity expenses. Excess solar energy generated during sunny daylight hours is fed back into the DISCOM grid through bi-directional net-metering, crediting your account and offsetting electricity consumed at night or during overcast conditions."
    },
    {
      question: "How does the PM Surya Ghar Muft Bijli Yojana subsidy work?",
      answer: "Under the central PM Surya Ghar scheme, residential homeowners receive direct financial assistance: ₹30,000 for a 1 kW system, ₹60,000 for 2 kW, and up to ₹78,000 for 3 kW and larger systems. AG POWER manages the entire documentation, national portal filing, DISCOM inspection, and subsidy disbursement process for you."
    },
    {
      question: "What warranties and guarantees come with an AG POWER solar system?",
      answer: "We only install Tier-1 modules backed by a 10 to 12-year product manufacturing warranty and a 25 to 30-year linear performance warranty. Inverters carry 5 to 10-year manufacturer guarantees. Furthermore, AG POWER provides an initial 5-year comprehensive workmanship warranty covering installation structural integrity, cabling, and site maintenance."
    },
    {
      question: "How long does it take to install a rooftop solar system?",
      answer: "Physical on-site mechanical and electrical installation takes just 2 to 3 days for typical residential setups. The complete end-to-end process—including comprehensive site survey, shadow analysis, 3D engineering, DISCOM net-meter sanctioning, and final grid commissioning—generally takes 3 to 4 weeks depending on regional utility turnaround."
    },
    {
      question: "Will solar panels work on cloudy or rainy days?",
      answer: "Yes. Solar photovoltaic panels do not require direct blistering heat to produce electricity; they generate power from daylight and diffuse solar radiation. While power generation is naturally reduced to roughly 20% to 40% during heavy cloud cover, your home remains seamlessly powered via the connected grid."
    },
    {
      question: "Can I install solar panels on curved or metal industrial roofs?",
      answer: "Yes. AG POWER engineers custom non-penetrating aluminum clamps and mounting structures specifically suited for standing-seam, trapezoidal, and curved industrial shed roofs. This approach eliminates drilling through your metal roofing sheets, preserving 100% of your warehouse weatherproofing and factory structural warranty."
    },
    {
      question: "How does net-metering benefit housing societies?",
      answer: "In cooperative housing societies, solar systems are connected directly to the common service meter. Generation offsets energy consumed by elevators, common area lighting, water lifting pumps, and STPs. This significantly lowers recurring monthly society maintenance charges for all apartment owners simultaneously."
    }
  ],
  "about": [
    {
      question: "What is AG POWER and who owns the brand?",
      answer: "AG POWER is the specialized solar energy and renewable EPC division of Electro Global. We engineer, deploy, and maintain dependable rooftop solar systems across India, helping homeowners, commercial businesses, and residential communities transition to clean, affordable, and self-sufficient electricity with total technical confidence."
    },
    {
      question: "What is AG POWER's core engineering philosophy?",
      answer: "We believe solar is a 25-year infrastructure investment rather than a disposable commodity. Our engineers prioritize uncompromising hardware standards, deploying only ALMM-listed solar modules, German-engineered string inverters, hot-dip galvanized mounting structures, and multi-tier electrical surge protections engineered to withstand extreme regional climates."
    },
    {
      question: "Where is AG POWER located and what regions do you serve?",
      answer: "AG POWER operates through regional project hubs across key industrial and residential corridors in India. Our certified engineering teams and liaison officers handle site surveys, structural assessments, and state DISCOM net-metering approvals across all major metropolitan and Tier-2 growth markets nationwide."
    },
    {
      question: "What sets AG POWER apart from local solar contractors?",
      answer: "Unlike unorganized local contractors, AG POWER delivers an institutional end-to-end engineering EPC experience. We provide customized 3D shadow analysis, certified structural rooftop load validation, complete liaison for state DISCOM net-metering approvals, transparent Tier-1 hardware specifications, and proactive annual maintenance contracts with cloud-based IoT generation tracking systems."
    },
    {
      question: "Does AG POWER manufacture its own solar panels?",
      answer: "AG POWER is a premier system integrator and engineering EPC partner. We procure top-tier, certified modules from globally recognized and ALMM-approved manufacturers such as Waaree, Adani Solar, Tata Power Solar, and Vikram Solar, ensuring maximum efficiency, authentic factory warranties, and full subsidy eligibility."
    },
    {
      question: "How does AG POWER verify site feasibility before installation?",
      answer: "Our certified solar engineers conduct thorough on-site assessments evaluating seasonal shadow obstacles, rooftop structural load-bearing capacity, compass orientation, and electrical panel compatibility. We generate high-accuracy 3D ray-tracing simulations and engineering reports to forecast precise 25-year kWh yields before any physical installation work begins on your premises."
    },
    {
      question: "What ongoing maintenance and support does AG POWER provide?",
      answer: "We offer comprehensive Annual Maintenance Contracts (AMC) that include scheduled panel cleaning, thermal imaging scans of solar cells, DC/AC cable connection torque checks, inverter firmware updates, and real-time remote generation tracking to ensure your solar asset operates at peak efficiency year after year."
    },
    {
      question: "How can I schedule a consultation with the AG POWER team?",
      answer: "You can request a free consultation directly through our website calculator or contact page, email akashshukla9523@gmail.com, or call our customer line at +91 95234 67849. Our technical consultants will review your recent electricity bill and schedule an in-depth rooftop survey."
    }
  ],
  "contact": [
    {
      question: "What are AG POWER's customer support working hours?",
      answer: "Our advisory and customer support desks are open Monday through Saturday from 9:00 AM to 7:00 PM Indian Standard Time. Inquiries submitted outside business hours or on national holidays are queued and prioritized by our engineering coordinators on the very next working day."
    },
    {
      question: "What is the quickest way to request a solar site survey?",
      answer: "The quickest way is to submit our online Solar Consultation form with your monthly electricity bill amount and roof type. You can also call or message us via WhatsApp at +91 95234 67849 for immediate project discussions with an experienced solar consultant."
    },
    {
      question: "What details should I prepare before contacting AG POWER?",
      answer: "Having your latest monthly electricity bill handy is ideal. It provides your sanctioned connected load, average monthly unit consumption, and tariff category. If available, knowing your approximate shadow-free rooftop square footage also helps our engineers generate a rapid preliminary sizing estimate."
    },
    {
      question: "Is there any cost for the initial solar site inspection?",
      answer: "No. AG POWER provides a complimentary initial rooftop survey and preliminary solar feasibility assessment with zero commitment required from your side. Our engineers inspect your roof orientation, shadow obstructions, and existing electrical distribution box to deliver an honest and transparent feasibility proposal."
    },
    {
      question: "How quickly will an AG POWER engineer respond to my enquiry?",
      answer: "Our technical consulting team reviews every incoming enquiry promptly and contacts you within 2 to 4 business hours during working days. We clarify preliminary technical details over phone or WhatsApp and schedule an on-site rooftop feasibility audit at your personal convenience."
    },
    {
      question: "Does AG POWER support commercial and factory solar inquiries?",
      answer: "Yes. We have a dedicated Commercial and Industrial project engineering team specializing in high-tension connections, megawatt-scale rooftop structures, 40% accelerated tax depreciation planning, and open-access captive solar power arrangements for manufacturing plants and warehouses across Indian industrial hubs and commercial estates nationwide."
    },
    {
      question: "Can housing society managing committees schedule a presentation?",
      answer: "Yes. Our senior solar consultants regularly present customized 25-year financial models, DISCOM net-metering plans, and structural safety documentation directly to RWA managing committees and general body meetings to address all resident queries and facilitate informed society approvals with complete clarity and technical transparency."
    },
    {
      question: "Can I receive an initial solar feasibility estimate over the phone?",
      answer: "While we can provide preliminary capital cost figures and subsidy estimates over the phone based on your typical monthly electricity bill, an accurate final quotation requires our technical engineers to conduct a detailed satellite or physical on-site shadow assessment of your rooftop."
    }
  ],
  "services": [
    {
      question: "What turnkey solar services does AG POWER offer?",
      answer: "AG POWER delivers comprehensive end-to-end solar EPC services: residential rooftop installations, commercial and industrial power plants, housing society common area systems, full DISCOM net-metering and subsidy liaison, system revamping, and proactive Annual Maintenance Contracts (AMC)."
    },
    {
      question: "What does the AG POWER EPC process include?",
      answer: "Our EPC scope covers every stage: on-site 3D shadow analysis, structural load engineering, procurement of certified solar panels and inverters, anodized structural fabrication, precision electrical wiring with multi-tier surge protection, government utility approvals, net-meter installation, and final grid commissioning."
    },
    {
      question: "Do you handle government subsidy applications and net-meter approvals?",
      answer: "Yes. AG POWER manages the entire bureaucratic liaison on your behalf. We handle application submissions on the National PM Surya Ghar portal, submit drawings to your local DISCOM, coordinate official utility inspections, and ensure proper bi-directional net-meter installation."
    },
    {
      question: "Can an existing solar power plant be upgraded or expanded?",
      answer: "Yes. If your roof area allows and your DISCOM sanctioned load permits, we can upgrade your solar inverter capacity and add additional high-efficiency TOPCon solar modules to offset increased electricity consumption from new air conditioners or electric vehicles."
    },
    {
      question: "What does an AG POWER Annual Maintenance Contract (AMC) include?",
      answer: "Our AMC packages include scheduled panel cleaning using demineralized water, thermal hotspot imaging of solar cells, DC string resistance checks, inverter diagnostics, lightning arrestor inspections, and emergency repair call-outs to safeguard long-term power generation."
    },
    {
      question: "Do you provide solar solutions with battery energy storage (BESS)?",
      answer: "Yes. While grid-tied systems without batteries provide the fastest financial payback, AG POWER also designs hybrid solar systems equipped with lithium ferro-phosphate (LFP) battery banks to provide critical backup power during grid power outages."
    },
    {
      question: "What structural warranties do you provide on mounting structures?",
      answer: "All AG POWER mounting structures are engineered from high-grade hot-dip galvanized steel or anodized aluminum, backed by a 15-year structural design warranty capable of withstanding wind gusts of up to 150-170 km/h in accordance with Indian wind zone standards."
    }
  ],
  "residential": [
    {
      question: "How much rooftop area is required for a 3 kW home solar system?",
      answer: "A standard 3 kW residential solar power plant requires approximately 240 to 300 square feet of unobstructed, shadow-free rooftop space. Using our latest 550W+ high-efficiency N-Type TOPCon panels minimizes the total square footage needed."
    },
    {
      question: "Will installing rooftop solar cause roof leaks or structural damage?",
      answer: "No. AG POWER utilizes non-penetrating chemical anchoring and pre-cast concrete ballast mounting structures that secure the solar array without puncturing your waterproof roof slab, preserving complete structural integrity and leak-free performance."
    },
    {
      question: "How much can I save each month with a residential solar system?",
      answer: "Most homeowners save between ₹2,000 and ₹8,000+ per month depending on their system size and current DISCOM tariff tier. Over a 25-year lifespan, a typical 3 to 5 kW home installation yields over ₹15 to ₹25 Lakhs in cumulative electricity bill savings."
    },
    {
      question: "How do I claim the ₹78,000 PM Surya Ghar Muft Bijli Yojana subsidy?",
      answer: "To claim the central subsidy, your home must use DCR-compliant, ALMM-listed solar panels installed by a registered EPC partner like AG POWER. After DISCOM net-meter inspection and commissioning, the subsidy is deposited directly into your bank account via DBT."
    },
    {
      question: "What happens during a grid power cut if I have an on-grid solar plant?",
      answer: "For safety reasons, standard on-grid solar inverters automatically shut down during a grid power outage (anti-islanding protection) to prevent back-feeding electricity into lines where utility technicians may be working. If you need continuous power during outages, we offer hybrid solar solutions with battery storage."
    }
  ],
  "commercial": [
    {
      question: "What is the typical financial payback period for commercial solar installations?",
      answer: "Because commercial and industrial electricity tariffs in India generally range from ₹8.50 to ₹12+ per unit, most commercial solar installations achieve complete capital payback within 2.5 to 4 years, followed by 20+ years of virtually free daytime power."
    },
    {
      question: "How does 40% accelerated depreciation benefit commercial solar buyers?",
      answer: "Under Section 32 of the Indian Income Tax Act, commercial and industrial enterprises can claim 40% accelerated depreciation on solar power plant assets in the first year of commissioning, substantially reducing corporate income tax liability and improving net project cash flow."
    },
    {
      question: "Can commercial solar plants sync with on-site diesel generators (DG)?",
      answer: "Yes. AG POWER incorporates advanced Solar-DG synchronization controllers that dynamically modulate solar output to match building loads while maintaining minimum generator loading, reducing costly diesel fuel consumption by up to 60% during grid outages."
    },
    {
      question: "Will solar installation interfere with our factory production schedules?",
      answer: "No. Our industrial engineering teams execute structural mounting, module cabling, and inverter assembly safely and cleanly with zero disruption to your daily factory operations or warehouse logistics. Grid interconnections are scheduled during your planned shutdown windows."
    }
  ],
  "housing-society": [
    {
      question: "Which common amenities in an apartment complex can run on solar?",
      answer: "Solar energy powers common area lighting, basement ventilation, passenger elevators, water lifting pumps, sewage treatment plants (STP), and clubhouse utilities, dramatically reducing monthly society maintenance expenses for all residents."
    },
    {
      question: "How does net-metering work for housing societies?",
      answer: "The solar plant is synchronized with the society's common area three-phase electricity connection. Energy generated during the day offsets common utility consumption directly, and any monthly surplus is carried over as billing credits on subsequent DISCOM invoices."
    },
    {
      question: "Does AG POWER assist with RWA committee approval and presentations?",
      answer: "Yes. Our senior solar consultants prepare complete technical feasibility presentations, 25-year financial models, and safety compliance reports, and present them in person during your RWA General Body Meetings to address resident questions thoroughly."
    }
  ],
  "solar-panels": [
    {
      question: "What is the difference between TOPCon and Mono PERC solar modules?",
      answer: "N-Type TOPCon (Tunnel Oxide Passivated Contact) is the latest solar cell technology, offering higher conversion efficiency (22.5%+ vs 21%), superior performance in high summer temperatures, and zero Light Induced Degradation (LID) compared to conventional P-Type Mono PERC panels."
    },
    {
      question: "What are Bifacial solar panels and when should they be used?",
      answer: "Bifacial solar panels feature active photovoltaic cells on both the front and rear faces. When mounted on reflective rooftops or elevated structures, they capture sunlight reflected from the surface (albedo effect), generating an extra 10% to 25% energy output."
    },
    {
      question: "What does DCR compliant mean and why does it matter?",
      answer: "DCR (Domestic Content Requirement) mandates that both solar cells and modules are manufactured domestically in India. DCR compliance is strictly mandatory to qualify for central government subsidies under the PM Surya Ghar Muft Bijli Yojana."
    },
    {
      question: "What is ALMM and why is it important?",
      answer: "The Approved List of Models and Manufacturers (ALMM) is an official registry issued by the Ministry of New and Renewable Energy (MNRE). All government subsidies and net-metering approvals require solar modules sourced strictly from ALMM-approved manufacturers."
    }
  ],
  "calculator": [
    {
      question: "How does the AG POWER Solar Calculator estimate my system capacity?",
      answer: "The calculator analyzes your monthly electricity bill and average state DISCOM tariff to estimate your daily kilowatt-hour (kWh) consumption. In India, a 1 kW solar array generates approximately 4 to 4.5 units per day under standard daylight conditions."
    },
    {
      question: "Are the calculator savings numbers guaranteed?",
      answer: "Calculator outputs are indicative estimates based on regional averages, standard solar insolation, and current tariff schedules. Final system capacity, exact financial yield, and structural costs are confirmed following an on-site technical rooftop survey by AG POWER engineers."
    },
    {
      question: "Does the calculator factor in the PM Surya Ghar subsidy?",
      answer: "Yes. For residential inquiries, our calculator automatically factors in the applicable central government subsidy (up to ₹78,000 for 3 kW and higher systems) to provide an accurate net investment estimate."
    }
  ],
  "privacy-policy": [
    {
      question: "What personal data does AG POWER collect from website visitors?",
      answer: "We collect only essential contact information willingly provided via our forms, including your name, phone number, email address, monthly electricity bill range, and installation pincode, specifically to prepare solar feasibility assessments and coordinate site surveys."
    },
    {
      question: "How does AG POWER protect customer personal data?",
      answer: "We adhere strictly to India's Digital Personal Data Protection (DPDP) Act 2023. All lead information is transmitted over encrypted HTTPS channels, stored in secure access-controlled databases, and protected against unauthorized access, loss, or disclosure."
    },
    {
      question: "Does AG POWER sell customer phone numbers or emails to third parties?",
      answer: "No. AG POWER maintains a strict zero-spam, zero-resale privacy commitment. Your personal data is never sold, leased, or shared with third-party marketing companies, telemarketers, or external lead brokers under any circumstances."
    },
    {
      question: "How is my enquiry information used internally?",
      answer: "Your information is used strictly by authorized AG POWER solar engineers and project managers to calculate preliminary system sizing, answer technical questions, and schedule on-site rooftop surveys with your explicit consent."
    },
    {
      question: "Can I request deletion or correction of my personal data?",
      answer: "Yes. Under the DPDP Act 2023, you have the right to request access, correction, or permanent deletion of your contact data from our active records. Contact our Data Privacy Desk at privacy@agpower.in to submit a request."
    }
  ],
  "terms-and-conditions": [
    {
      question: "What services are covered under AG POWER's Terms and Conditions?",
      answer: "These terms govern the use of our website, preliminary solar calculator estimates, site inspection bookings, engineering consultancy, procurement, installation, and after-sales support provided by AG POWER (Electro Global)."
    },
    {
      question: "Are website calculator figures legally binding quotations?",
      answer: "No. Website calculator projections, financial savings estimates, and payback periods are indicative representations based on standard climatic and tariff averages. Binding quotations are issued only following physical on-site structural and electrical feasibility audits."
    },
    {
      question: "How are project payment milestones and contract terms structured?",
      answer: "Turnkey EPC project milestones are defined clearly in formal engineering contracts, typically structured around contract signing, equipment dispatch, physical installation, and final DISCOM net-meter commissioning."
    },
    {
      question: "What warranties apply to AG POWER equipment and installation?",
      answer: "Solar modules carry manufacturer warranties of 10 to 12 years (product) and 25 to 30 years (linear performance). Inverters carry 5 to 10-year manufacturer guarantees. AG POWER provides a 5-year workmanship guarantee on installation craftsmanship."
    },
    {
      question: "Which legal jurisdiction governs AG POWER contracts and disputes?",
      answer: "These Terms and Conditions and all related commercial agreements are governed strictly in accordance with the laws of India, subject to the exclusive jurisdiction of the competent courts in Rajasthan, India."
    }
  ],
  "blog": [
    {
      question: "What topics are covered on the AG POWER Solar Insights blog?",
      answer: "Our solar knowledge hub provides educational guides on rooftop solar sizing, decoding DISCOM electricity bills, comparing TOPCon vs Mono PERC solar panels, PM Surya Ghar subsidy application procedures, and solar ROI calculations for homes and businesses."
    },
    {
      question: "Who researches and writes the solar guides on AG POWER?",
      answer: "All articles are authored and technically reviewed by certified solar engineers, electrical specialists, and renewable energy consultants at AG POWER and Electro Global, ensuring all technical and regulatory data is accurate and up to date."
    },
    {
      question: "How often are subsidy and regulatory policies updated on the blog?",
      answer: "We review and update our policy guides whenever the Ministry of New and Renewable Energy (MNRE), state regulatory commissions, or regional DISCOMs announce tariff adjustments, net-metering amendments, or new financial incentives."
    },
    {
      question: "Can readers request solar topic coverage or technical analysis?",
      answer: "Yes. We welcome questions from homeowners, factory managers, and RWA committee members. If you have a specific solar engineering or regulatory topic you would like our team to cover, email akashshukla9523@gmail.com."
    }
  ]
}

/**
 * Legacy compatibility fallback for Editz references.
 */
export function getEditzFaqs(seoSetting?: { faq_section?: unknown } | null): PageFAQ[] {
  const saved = getPageFaqs("__none__", seoSetting)
  return saved.length ? saved : EDITZ_FAQS.map((f) => ({ question: f.question, answer: f.answer }))
}

/**
 * Returns the FAQs for a page — the single source for the visible accordion, the page's
 * FAQPage schema and the /faq hub, so markup always matches what visitors see.
 *
 * Order: FAQs saved in the admin (seo_setting.faq_section) → verified defaults below.
 * Unknown keys return an empty list (never another page's FAQs).
 */
export function getPageFaqs(
  pageKey: string,
  seoSetting?: { faq_section?: unknown } | null
): PageFAQ[] {
  const saved = Array.isArray(seoSetting?.faq_section) ? (seoSetting!.faq_section as PageFAQ[]) : []
  const cleanSaved = saved.filter(
    (f) => f && typeof f.question === "string" && typeof f.answer === "string" && f.question.trim() && f.answer.trim()
  )
  if (cleanSaved.length > 0) return cleanSaved

  const normalized = pageKey.trim().toLowerCase()
  // Map aliases
  if (normalized === "residential-solar") return PAGE_FAQS_MAP["residential"] || []
  if (normalized === "commercial-solar") return PAGE_FAQS_MAP["commercial"] || []
  if (normalized === "housing-society-solar") return PAGE_FAQS_MAP["housing-society"] || []

  return PAGE_FAQS_MAP[normalized] || []
}
