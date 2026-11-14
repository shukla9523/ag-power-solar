import { supabase } from "@lib/supabase"
import { unstable_cache } from "next/cache"

export type FAQ = {
  question: string
  answer: string
}

export type BlogPost = {
  id: string
  slug: string
  title: string
  category_id: string | null
  featured_image: string | null
  image_urls: string[]
  excerpt: string | null
  content: string | null
  author_name: string | null
  status: string
  published_at: string | null
  updated_at: string | null
  meta_title: string | null
  meta_description: string | null
  faqs: FAQ[]
}

export const FALLBACK_BLOG_POSTS: BlogPost[] = [
  {
    id: "post-1",
    slug: "pm-surya-ghar-muft-bijli-yojana-guide",
    title: "PM Surya Ghar Muft Bijli Yojana: Complete Subsidy & Application Guide (2026)",
    category_id: "Subsidies & Policy",
    featured_image: "https://images.unsplash.com/photo-1508873696983-2df5293cb395?auto=format&fit=crop&w=1200&q=80",
    image_urls: ["https://images.unsplash.com/photo-1508873696983-2df5293cb395?auto=format&fit=crop&w=1200&q=80"],
    excerpt: "A comprehensive step-by-step breakdown of the Central Government's PM Surya Ghar scheme, including eligibility rules, subsidy slabs up to ₹78,000, and DISCOM net-metering procedures.",
    author_name: "Er. Rajesh Verma, Chief Solar Engineer",
    status: "published",
    published_at: "2026-10-15T09:00:00Z",
    updated_at: "2026-11-01T10:00:00Z",
    meta_title: "PM Surya Ghar Muft Bijli Yojana Guide 2026 | Subsidy & Process",
    meta_description: "Learn how to claim up to ₹78,000 subsidy under PM Surya Ghar Muft Bijli Yojana. Sizing, eligibility, DCR panels, and net metering guide by AG POWER.",
    content: `
      <h2>Introduction: India's Flagship Residential Solar Mission</h2>
      <p>The <strong>PM Surya Ghar Muft Bijli Yojana</strong> launched by the Government of India aims to provide up to 300 units of free electricity per month to 1 crore households nationwide through rooftop solar systems. By providing direct financial subsidies directly into the consumer's bank account via Direct Benefit Transfer (DBT), the central government has made rooftop solar more affordable and financially compelling than ever before.</p>
      
      <h2>Subsidy Slabs Breakdown (Central Financial Assistance)</h2>
      <p>The subsidy is structured systematically according to the sanctioned kilowatt (kW) capacity installed:</p>
      <ul>
        <li><strong>1 kW System:</strong> ₹30,000 direct subsidy. Suitable for small households with monthly electricity bills under ₹1,500.</li>
        <li><strong>2 kW System:</strong> ₹60,000 direct subsidy. Optimal for 2-BHK apartments and homes consuming 200–250 units monthly.</li>
        <li><strong>3 kW & Above:</strong> ₹78,000 flat maximum subsidy for individual residential rooftop plants. Perfect for independent villas, row houses, and homes operating 1–2 air conditioners.</li>
        <li><strong>Housing Societies / RWAs:</strong> ₹18,000 per kW up to a maximum capacity of 500 kW for common area lighting and shared utilities.</li>
      </ul>

      <h2>Mandatory Eligibility Requirements</h2>
      <p>To successfully claim the central subsidy without administrative rejection, your rooftop installation must meet three strict technical criteria:</p>
      <ol>
        <li><strong>Domestic Content Requirement (DCR) Modules:</strong> The solar panels installed must be manufactured in India using domestically fabricated solar cells and modules, listed under the Ministry of New and Renewable Energy (MNRE) ALMM register.</li>
        <li><strong>Registered Solar EPC Partner:</strong> The installation must be executed by an empaneled, certified EPC provider such as AG POWER. Self-installations or unauthorized non-empaneled local contractors do not qualify.</li>
        <li><strong>Bi-directional Net Metering:</strong> Your state electricity distribution company (DISCOM) must approve and synchronize a certified bi-directional net meter.</li>
      </ol>

      <h2>The Step-by-Step Application Process with AG POWER</h2>
      <p>When you partner with AG POWER, our engineering team manages the complete end-to-end liaison on your behalf:</p>
      <p><strong>Step 1: Feasibility Audit & Document Collection:</strong> We inspect your roof, verify your consumer connection number, and prepare 3D shadow analysis diagrams.</p>
      <p><strong>Step 2: National Portal Registration:</strong> We submit your preliminary application on the National PM Surya Ghar Portal (pmsuryaghar.gov.in) with your DISCOM consumer number.</p>
      <p><strong>Step 3: DISCOM Technical Feasibility Approval:</strong> The local electricity board issues a technical feasibility report (TFR) sanctioning the capacity.</p>
      <p><strong>Step 4: Installation & Commissioning:</strong> Our certified technicians complete the mechanical assembly, electrical wiring, earthing pits, and lightning protection in 2–3 days.</p>
      <p><strong>Step 5: Net Meter Installation & Direct Subsidy Deposit:</strong> The DISCOM inspects the plant, replaces your unidirectional meter with a bi-directional net meter, and uploads the commissioning certificate. The central subsidy is deposited directly into your bank account within 30 to 45 days.</p>
    `,
    faqs: [
      {
        question: "Can I get a subsidy for a 5 kW or 10 kW residential system?",
        answer: "Yes, you can install a 5 kW or 10 kW system, but the central PM Surya Ghar subsidy is capped at a maximum of ₹78,000 for residential homes. The additional capacity simply operates without additional central subsidy, though it still provides full electricity bill savings."
      },
      {
        question: "Are off-grid solar systems with batteries eligible for PM Surya Ghar subsidy?",
        answer: "No. The PM Surya Ghar subsidy is strictly reserved for grid-connected (on-grid or grid-tied hybrid) solar systems equipped with official DISCOM bi-directional net meters."
      }
    ]
  },
  {
    id: "post-2",
    slug: "topcon-vs-mono-perc-solar-panels",
    title: "TOPCon vs Mono PERC Solar Panels: Which Technology Delivers Better ROI?",
    category_id: "Solar Technology",
    featured_image: "https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=1200&q=80",
    image_urls: ["https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=1200&q=80"],
    excerpt: "Understand the key technical differences between modern N-Type TOPCon and conventional P-Type Mono PERC solar modules, temperature coefficient advantages in Indian summers, and bifacial energy gains.",
    author_name: "AG POWER Technical Engineering Desk",
    status: "published",
    published_at: "2026-10-22T11:00:00Z",
    updated_at: "2026-11-04T14:00:00Z",
    meta_title: "TOPCon vs Mono PERC Solar Panels Comparison | AG POWER",
    meta_description: "Detailed technical comparison between TOPCon and Mono PERC solar panels. Learn why N-Type TOPCon delivers up to 5% more annual yield in hot climates.",
    content: `
      <h2>The Shift to N-Type TOPCon Photovoltaic Cells</h2>
      <p>For nearly a decade, P-Type Mono PERC (Passivated Emitter and Rear Cell) panels dominated the global solar market. However, in 2024–2026, the solar industry underwent a decisive generational transition to <strong>N-Type TOPCon (Tunnel Oxide Passivated Contact)</strong> technology. Today, all Tier-1 manufacturers—including Waaree, Adani, Vikram Solar, and Tata Power—have converted their prime production lines to TOPCon.</p>

      <h2>Key Technical Differences: TOPCon vs Mono PERC</h2>
      <p>Here is how the two technologies compare on the metrics that determine your 25-year return on investment:</p>
      <ul>
        <li><strong>Module Efficiency:</strong> Standard Mono PERC panels peak at roughly 20.8% to 21.4% module efficiency. Modern TOPCon modules routinely achieve 22.2% to 22.8% efficiency, generating more wattage from the exact same rooftop square footage.</li>
        <li><strong>Temperature Coefficient:</strong> Solar panels generate less electricity as their operating temperature rises in intense summer heat. Mono PERC has a temperature coefficient of -0.35%/°C. TOPCon boasts an improved coefficient of -0.30%/°C, retaining substantially higher output during scorching 40°C–45°C Indian summer afternoons.</li>
        <li><strong>Degradation Rates & Lifespan:</strong> Mono PERC suffers from Light-Induced Degradation (LID) in its first operational year (~2%) and 0.55% annually thereafter. N-Type TOPCon exhibits zero boron-oxygen LID, degrading only ~1% in year one and 0.40% annually over a 30-year operational span.</li>
        <li><strong>Bifaciality Factor:</strong> In bifacial configurations, Mono PERC panels achieve a bifaciality factor of 70%, while TOPCon reaches 80% to 85%, capturing significantly more ground-reflected albedo light.</li>
      </ul>

      <h2>Why AG POWER Standardizes on N-Type TOPCon</h2>
      <p>At AG POWER, we prioritize long-term system yield over marginal upfront equipment cost savings. By deploying Tier-1 550W+ TOPCon modules, our clients benefit from:</p>
      <ol>
        <li>Fewer panels required to achieve the target kilowatt capacity, preserving precious rooftop recreational space.</li>
        <li>Up to 4%–6% higher cumulative kilowatt-hour generation annually, particularly during peak summer cooling months.</li>
        <li>Extended 30-year linear power warranties, ensuring at least 87.4% rated power output at Year 30.</li>
      </ol>
    `,
    faqs: [
      {
        question: "Are TOPCon panels more expensive than Mono PERC panels?",
        answer: "The price difference has narrowed dramatically in 2026 to less than 3% to 5%. Because TOPCon produces more kilowatt-hours each year, the payback period is actually shorter than conventional Mono PERC."
      }
    ]
  },
  {
    id: "post-3",
    slug: "residential-solar-roi-payback-india",
    title: "Rooftop Solar ROI in India: Calculating 25-Year Electricity Bill Savings",
    category_id: "Residential Solar",
    featured_image: "https://images.unsplash.com/photo-1545259741-2ea3ebf61fa3?auto=format&fit=crop&w=1200&q=80",
    image_urls: ["https://images.unsplash.com/photo-1545259741-2ea3ebf61fa3?auto=format&fit=crop&w=1200&q=80"],
    excerpt: "A practical financial breakdown showing how a 3 kW to 5 kW residential rooftop solar plant pays for itself in under 3.5 years and generates over ₹18 Lakhs in tax-free electricity savings.",
    author_name: "Solar Financial Advisory Team",
    status: "published",
    published_at: "2026-10-28T08:30:00Z",
    updated_at: "2026-11-06T12:00:00Z",
    meta_title: "Residential Solar ROI & Payback Period in India | AG POWER",
    meta_description: "Discover the financial return on investment of a rooftop solar plant in India. 25-year cash flow projections, payback period, and net metering benefits.",
    content: `
      <h2>Solar as a High-Yield Financial Asset</h2>
      <p>Most homeowners view solar panels simply as an environmentally friendly appliance. In reality, a residential rooftop solar system is one of the highest-yielding, lowest-risk financial assets available in India today, consistently generating <strong>internal rates of return (IRR) between 24% and 32% per annum</strong>—far outpacing fixed deposits, mutual funds, and gold.</p>

      <h2>Case Study: 3 kW Residential System Financial Model</h2>
      <p>Let us examine the realistic financials for a typical family living in an independent home or villa with a monthly electricity bill averaging ₹3,500 to ₹4,500:</p>
      <ul>
        <li><strong>System Capacity:</strong> 3.0 kW on-grid solar plant.</li>
        <li><strong>Rooftop Space Required:</strong> Approx. 250 to 280 sq.ft of shadow-free area.</li>
        <li><strong>Gross Project Cost:</strong> ₹1,85,000 (all inclusive: Tier-1 TOPCon panels, grid-tie inverter, elevated mounting structure, cabling, surge protection, DISCOM net-meter liaison).</li>
        <li><strong>PM Surya Ghar Subsidy:</strong> -₹78,000 (credited to homeowner's bank account).</li>
        <li><strong>Net Capital Investment:</strong> ₹1,07,000.</li>
      </ul>

      <h2>Annual Generation & Financial Payback</h2>
      <p>In India, a 1 kW solar array produces approximately 120 to 135 units (kWh) of clean electricity per month (averaging 4 to 4.5 units per day). A 3 kW plant therefore produces approximately <strong>4,500 to 4,800 units annually</strong>.</p>
      <p>At an average DISCOM tariff rate of ₹8.00 per unit, 4,500 units equate to an immediate annual electricity savings of <strong>₹36,000 to ₹38,400 per year</strong>.</p>
      <p><strong>Payback Time:</strong> Net Investment (₹1,07,000) ÷ Annual Savings (₹36,000) = <strong>approx. 2.9 years</strong>. After less than 3 years, the system has paid for itself completely. For the remaining 22+ years of its guaranteed lifespan, all electricity generated is virtually 100% free.</p>
    `,
    faqs: [
      {
        question: "Does solar savings qualify for income tax exemption?",
        answer: "Yes. The savings on your domestic electricity bill are not treated as taxable income under Indian Income Tax laws, representing 100% tax-free financial gains."
      }
    ]
  },
  {
    id: "post-4",
    slug: "commercial-industrial-solar-depreciation",
    title: "Commercial Solar Power: 40% Accelerated Depreciation & ESG Tax Benefits",
    category_id: "Commercial & Industrial",
    featured_image: "https://images.unsplash.com/photo-1497440001374-f26997328c1b?auto=format&fit=crop&w=1200&q=80",
    image_urls: ["https://images.unsplash.com/photo-1497440001374-f26997328c1b?auto=format&fit=crop&w=1200&q=80"],
    excerpt: "How factories, warehouses, and commercial building owners can slash operating overheads, leverage Section 32 tax depreciation, and achieve payback in under 28 months.",
    author_name: "Electro Global C&I Division",
    status: "published",
    published_at: "2026-11-02T10:00:00Z",
    updated_at: "2026-11-09T16:00:00Z",
    meta_title: "Commercial Solar 40% Accelerated Depreciation Guide | AG POWER",
    meta_description: "Learn how commercial businesses and factories save on taxes with 40% accelerated depreciation on solar power plants under Section 32 of Income Tax Act.",
    content: `
      <h2>Why Commercial Tariffs Make Solar an Imperative</h2>
      <p>Commercial and industrial (C&I) electricity consumers in India face steep grid tariffs, often ranging between <strong>₹8.50 and ₹13.00+ per unit</strong>, alongside demand charges and peak-hour surcharges. Because power is a direct variable cost of goods sold, switching to captive solar power directly expands corporate EBITDA margins.</p>

      <h2>Section 32: 40% Accelerated Tax Depreciation Explained</h2>
      <p>Under Section 32 of the Indian Income Tax Act, solar photovoltaic power plants qualify for <strong>40% accelerated depreciation</strong> in the very first year of plant commissioning. If the plant is commissioned before September 30 in a financial year, the company can write off the entire 40% of capital expenditure against business profits. If commissioned after September 30, a 20% deduction applies in year one with the balance rolling into subsequent periods.</p>

      <h2>Commercial Project Payback Dynamics</h2>
      <p>Between direct electricity bill reduction, demand charge shaving, and the substantial corporate income tax shield provided by accelerated depreciation, most 50 kW to 500 kW commercial rooftop plants achieve full capital payback within <strong>2.2 to 3.2 years</strong>.</p>
    `,
    faqs: [
      {
        question: "Can commercial enterprises also claim PM Surya Ghar subsidy?",
        answer: "No. The PM Surya Ghar subsidy is specifically intended for residential consumers and housing societies. Commercial and industrial establishments leverage 40% accelerated depreciation and GST input tax credits instead."
      }
    ]
  },
  {
    id: "post-5",
    slug: "housing-society-solar-net-metering",
    title: "Solar for Apartment Complexes & Housing Societies: Slashing Common Maintenance",
    category_id: "Housing Societies",
    featured_image: "https://images.unsplash.com/photo-1558449028-b53a39d100fc?auto=format&fit=crop&w=1200&q=80",
    image_urls: ["https://images.unsplash.com/photo-1558449028-b53a39d100fc?auto=format&fit=crop&w=1200&q=80"],
    excerpt: "How Residential Welfare Associations (RWAs) can offset 70% to 90% of electricity bills for elevators, common lighting, and water pumps with shared rooftop solar.",
    author_name: "Community Solar Advisory Desk",
    status: "published",
    published_at: "2026-11-05T09:30:00Z",
    updated_at: "2026-11-10T11:00:00Z",
    meta_title: "Housing Society Solar Installation & Net Metering | AG POWER",
    meta_description: "How RWAs and apartment societies in India can install common rooftop solar plants to drastically reduce monthly maintenance bills for all residents.",
    content: `
      <h2>The Burden of Escalating Society Maintenance Costs</h2>
      <p>In high-rise apartment complexes and gated cooperative housing societies, 40% to 60% of common maintenance collections are consumed by common electricity bills. Pumping hundreds of thousands of liters of municipal and borewell water, running 24/7 elevator motors, lighting underground basements, and operating sewage treatment plants (STPs) result in commercial-rate power bills of ₹50,000 to ₹3,00,000+ each month.</p>

      <h2>How Housing Society Solar Net-Metering Operates</h2>
      <p>An on-grid solar plant is installed on the expansive, shared rooftop slab of the residential tower. The system is synchronized with the society's three-phase common service meter. Solar power generated throughout daylight hours powers water pumps and lifts in real time. Any surplus electricity flows into the utility grid and is credited toward nighttime common lighting expenses.</p>

      <h2>RWA Subsidies & Approvals</h2>
      <p>Under PM Surya Ghar, registered Housing Societies and RWAs are eligible for <strong>₹18,000 per kW in central subsidy</strong> up to a maximum cap of 500 kW for common utility connections. AG POWER engineers provide comprehensive financial presentations, safety validation, and DISCOM liaison to help RWA committees secure quick, unanimous resident approvals.</p>
    `,
    faqs: [
      {
        question: "Does solar installation on a society roof restrict resident walking space?",
        answer: "No. AG POWER designs elevated super-structures with 7 to 9 feet clearance, allowing residents to walk, dry clothes, and enjoy the rooftop terrace without any obstruction."
      }
    ]
  }
]

function normalizeImagePath(path: string): string {
  if (!path) return ""
  if (path.startsWith("http://") || path.startsWith("https://") || path.startsWith("/")) {
    return path
  }
  return `/${path}`
}

function mapPost(p: any): BlogPost {
  return {
    id: p.id,
    slug: p.slug,
    title: p.title,
    category_id: p.category_id || null,
    featured_image: p.featured_image ? normalizeImagePath(p.featured_image) : null,
    image_urls: (p.image_urls || []).map(normalizeImagePath).filter(Boolean),
    excerpt: p.excerpt || null,
    content: p.content || null,
    author_name: p.author_name || null,
    status: p.status || "draft",
    published_at: p.published_at || null,
    updated_at: p.updated_at || null,
    meta_title: p.meta_title || null,
    meta_description: p.meta_description || null,
    faqs: p.faqs || [],
  }
}

export const getBlogPosts = unstable_cache(
  async (): Promise<BlogPost[]> => {
    try {
      const { data: posts, error } = await supabase
        .from("post")
        .select("*")
        .is("deleted_at", null)
        .eq("status", "published")
        .order("created_at", { ascending: false })

      if (error || !posts || posts.length === 0) {
        return FALLBACK_BLOG_POSTS
      }
      return posts.map(mapPost)
    } catch (err) {
      console.warn("getBlogPosts database fallback:", err)
      return FALLBACK_BLOG_POSTS
    }
  },
  ["blog-posts-list"],
  { revalidate: 60, tags: ["blog-posts"] }
)

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  if (!slug) return null
  try {
    const { data: post, error } = await supabase
      .from("post")
      .select("*")
      .eq("slug", slug)
      .is("deleted_at", null)
      .eq("status", "published")
      .single()

    if (error || !post) {
      const fallback = FALLBACK_BLOG_POSTS.find((p) => p.slug === slug)
      return fallback || null
    }
    return mapPost(post)
  } catch (err) {
    console.warn("getBlogPost database fallback:", err)
    const fallback = FALLBACK_BLOG_POSTS.find((p) => p.slug === slug)
    return fallback || null
  }
}
