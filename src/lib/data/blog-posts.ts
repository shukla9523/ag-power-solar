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
    category_id: "Government Schemes and Subsidies",
    featured_image: "/images/blog/pm-surya-ghar.webp",
    image_urls: ["/images/blog/pm-surya-ghar.webp"],
    excerpt: "A comprehensive step-by-step breakdown of the Central Government's PM Surya Ghar scheme, including eligibility rules, subsidy slabs up to ₹78,000, and DISCOM net-metering procedures.",
    author_name: "AG POWER Technical Engineering Desk",
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

      <p>To check exact payback and net investment for your house, try our interactive <a href="/calculator">AG POWER Solar Calculator</a>.</p>

      <h2>Mandatory Eligibility Requirements</h2>
      <p>To successfully claim the central subsidy without administrative rejection, your rooftop installation must meet three strict technical criteria:</p>
      <ol>
        <li><strong>Domestic Content Requirement (DCR) Modules:</strong> The solar panels installed must be manufactured in India using domestically fabricated solar cells and modules, listed under the Ministry of New and Renewable Energy (MNRE) ALMM register. Explore verified <a href="/solar-panels">Tier-1 DCR Solar Panels</a>.</li>
        <li><strong>Registered Solar EPC Partner:</strong> The installation must be executed by an empaneled, certified EPC provider such as AG POWER. Self-installations or unauthorized non-empaneled local contractors do not qualify.</li>
        <li><strong>Bi-directional Net Metering:</strong> Your state electricity distribution company (DISCOM) must approve and synchronize a certified bi-directional net meter.</li>
      </ol>

      <h2>The Step-by-Step Application Process with AG POWER</h2>
      <p>When you partner with our <a href="/services/residential-solar">Residential Solar Installation team</a>, we manage the complete end-to-end liaison on your behalf:</p>
      <p><strong>Step 1: Feasibility Audit & Document Collection:</strong> We inspect your roof, verify your consumer connection number, and prepare 3D shadow analysis diagrams.</p>
      <p><strong>Step 2: National Portal Registration:</strong> We submit your preliminary application on the National PM Surya Ghar Portal with your DISCOM consumer number.</p>
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
    category_id: "Solar Panel Technology",
    featured_image: "/images/blog/topcon-vs-mono-perc.webp",
    image_urls: ["/images/blog/topcon-vs-mono-perc.webp"],
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

      <p>Browse detailed datasheets in our <a href="/solar-panels">Solar Panel Discovery Catalogue</a>.</p>

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
    category_id: "Solar Savings and ROI",
    featured_image: "/images/blog/residential-solar-roi.webp",
    image_urls: ["/images/blog/residential-solar-roi.webp"],
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

      <p>Calculate your exact customized payback with our <a href="/calculator">Online Solar Calculator</a>.</p>

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
    category_id: "Commercial Solar",
    featured_image: "/images/blog/commercial-solar-benefits.webp",
    image_urls: ["/images/blog/commercial-solar-benefits.webp"],
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
      
      <h2>Accelerated Depreciation Under Section 32</h2>
      <p>Under Section 32 of the Indian Income Tax Act, commercial businesses installing rooftop solar power systems can claim <strong>40% accelerated depreciation</strong> in the very first operational year. This tax shielding dramatically reduces upfront net project costs, cutting payback periods to between 2.2 and 3.0 years.</p>

      <p>Connect with our <a href="/services/commercial-solar">Commercial Solar EPC Engineers</a> for an industrial feasibility audit.</p>
    `,
    faqs: [
      {
        question: "Can commercial enterprises also claim PM Surya Ghar subsidy?",
        answer: "No. PM Surya Ghar central subsidies are reserved for residential consumers. Commercial and industrial entities receive financial incentives via 40% accelerated tax depreciation and open-access net-metering instead."
      }
    ]
  },
  {
    id: "post-5",
    slug: "solar-for-apartment-complexes-housing-societies",
    title: "Solar for Apartment Complexes & Housing Societies: Slashing Common Maintenance",
    category_id: "Residential Solar",
    featured_image: "/images/blog/on-grid-vs-hybrid.webp",
    image_urls: ["/images/blog/on-grid-vs-hybrid.webp"],
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

      <p>Explore our complete <a href="/services/housing-society-solar">Housing Society Solar Solutions</a>.</p>

      <h2>RWA Subsidies & Approvals</h2>
      <p>Under PM Surya Ghar, registered Housing Societies and RWAs are eligible for <strong>₹18,000 per kW in central subsidy</strong> up to a maximum cap of 500 kW for common utility connections. AG POWER engineers provide comprehensive financial presentations, safety validation, and DISCOM liaison to help RWA committees secure quick, unanimous resident approvals.</p>
    `,
    faqs: [
      {
        question: "Does solar installation on a society roof restrict resident walking space?",
        answer: "No. AG POWER designs elevated super-structures with 7 to 9 feet clearance, allowing residents to walk, dry clothes, and enjoy the rooftop terrace without any obstruction."
      }
    ]
  },
  {
    id: "post-6",
    slug: "solar-energy-basics-on-grid-inverters-net-metering",
    title: "Solar Energy Basics in India: How On-Grid Inverters & Net-Metering Work",
    category_id: "Solar Energy Basics",
    featured_image: "/images/blog/net-metering-guide.webp",
    image_urls: ["/images/blog/net-metering-guide.webp"],
    excerpt: "Demystifying on-grid solar systems: learn how photovoltaic cells convert sunlight to direct current, how grid-tie string inverters synchronize with the DISCOM grid, and how bi-directional net meters reduce electricity bills.",
    author_name: "AG POWER EPC Operations Team",
    status: "published",
    published_at: "2026-11-08T10:00:00Z",
    updated_at: "2026-11-12T15:00:00Z",
    meta_title: "Solar Energy Basics & Net-Metering Guide | AG POWER",
    meta_description: "Learn how on-grid solar power systems, string inverters, and bi-directional net-metering work together to eliminate your monthly electricity bill.",
    content: `
      <h2>The Core Components of an On-Grid Solar System</h2>
      <p>An on-grid (or grid-tied) rooftop solar plant consists of four primary engineering components working in seamless synchronization:</p>
      <ol>
        <li><strong>Photovoltaic Solar Modules:</strong> Tier-1 silicon solar cells convert photons from solar irradiance into Direct Current (DC) electricity via the photovoltaic effect.</li>
        <li><strong>Grid-Tied String Inverter:</strong> The inverter converts variable DC power into stable, 230V single-phase or 415V three-phase Alternating Current (AC) matched perfectly to your utility grid frequency (50 Hz).</li>
        <li><strong>Bi-Directional Net-Meter:</strong> An official meter provided by your DISCOM that records both the electricity you import from the grid and the excess solar electricity you export to the grid.</li>
        <li><strong>BOS (Balance of System):</strong> Hot-dip galvanized mounting structures, UV-protected DC solar cables, dual safety earthing pits, and AC/DC Surge Protection Devices (SPDs).</li>
      </ol>

      <h2>How Net-Metering Cuts Your Bill to Zero</h2>
      <p>During daylight hours, your solar plant powers your appliances directly. If your system produces more power than your home is consuming (for instance, on a sunny weekday afternoon), the excess units automatically spin your net meter backward, banking energy credits with your DISCOM. At night, you draw power from the grid as normal. At month-end, your electricity bill only charges you for the <em>net difference</em>.</p>

      <p>Curious how much power your roof can generate? Use our <a href="/calculator">Solar Generation Estimator</a>.</p>
    `,
    faqs: [
      {
        question: "Does an on-grid solar system work during a grid power outage?",
        answer: "For safety reasons (anti-islanding protection to protect utility linemen working on power lines), grid-tied inverters automatically pause during a power outage unless paired with a hybrid battery backup."
      }
    ]
  },
  {
    id: "post-7",
    slug: "rooftop-solar-installation-step-by-step-process",
    title: "Rooftop Solar Installation Step-by-Step: Structural Mounting to Commissioning",
    category_id: "Solar Installation Guides",
    featured_image: "/images/blog/installation-step-by-step.webp",
    image_urls: ["/images/blog/installation-step-by-step.webp"],
    excerpt: "What to expect during a professional solar installation: civil structural anchoring, module clamping, chemical earthing pits, inverter synchronization, and DISCOM commissioning.",
    author_name: "AG POWER EPC Operations Team",
    status: "published",
    published_at: "2026-11-10T12:00:00Z",
    updated_at: "2026-11-14T09:00:00Z",
    meta_title: "Rooftop Solar Installation Process Guide | AG POWER",
    meta_description: "A comprehensive walk-through of the complete rooftop solar installation process from initial site survey to structural mounting and DISCOM net-meter synchronization.",
    content: `
      <h2>Precision Engineering: The AG POWER Installation Standard</h2>
      <p>A solar power plant is an outdoor infrastructure asset engineered to withstand extreme wind loads, monsoon rainstorms, and intense summer heat for 25 to 30 years. Here is our certified 5-stage installation methodology:</p>

      <h2>Stage 1: Rooftop Structural Anchoring</h2>
      <p>Depending on whether your roof is RCC concrete flat slab, pre-engineered metal shed, or inclined tiles, our technicians anchor hot-dip galvanized mounting structures with a minimum coating of 80 microns. Anchor bolts are sealed with weatherproof waterproofing compound to ensure zero roof seepage.</p>

      <h2>Stage 2: Module Placement & Dual Clamping</h2>
      <p>Tier-1 dual-glass modules are affixed using heavy-duty anodized aluminum mid-clamps and end-clamps torqued to manufacturer specifications. Tilt angles are calibrated between 12° and 26° south-facing to maximize annual solar irradiance.</p>

      <h2>Stage 3: Electrical Cabling & Chemical Earthing</h2>
      <p>UV-stabilized 4 sq.mm / 6 sq.mm multi-strand copper solar cables are routed through weatherproof conduit pipes. Dedicated chemical earthing pits are installed: one for the solar structure, one for the inverter AC/DC ground, and one for the lightning arrestor (LA), guaranteeing resistance under 2 Ohms.</p>

      <h2>Stage 4: Inverter Synchronization & Safety Testing</h2>
      <p>The grid-tie inverter is mounted in a shaded, ventilated space. Insulation resistance (megger test) and open-circuit voltage (Voc) checks are performed on every string before final grid synchronization.</p>

      <p>Schedule a site feasibility assessment with our <a href="/contact">Solar Installation Team</a>.</p>
    `,
    faqs: [
      {
        question: "How long does the physical rooftop solar installation take?",
        answer: "For residential systems between 3 kW and 10 kW, the physical installation of structures, modules, and electrical cabling is completed in just 2 to 3 working days."
      }
    ]
  },
  {
    id: "post-8",
    slug: "solar-panel-cleaning-maintenance-best-practices",
    title: "Solar Panel Cleaning & Maintenance: Best Practices to Preserve Peak kWh Yield",
    category_id: "Solar Maintenance",
    featured_image: "/images/blog/cleaning-maintenance.webp",
    image_urls: ["/images/blog/cleaning-maintenance.webp"],
    excerpt: "Learn how regular cleaning intervals, water quality guidelines, and AMC electrical diagnostics prevent soiling losses and keep your solar plant operating at maximum generation.",
    author_name: "Customer Operations & AMC Desk",
    status: "published",
    published_at: "2026-11-12T14:00:00Z",
    updated_at: "2026-11-15T11:00:00Z",
    meta_title: "Solar Panel Cleaning & Maintenance Protocols | AG POWER",
    meta_description: "Discover expert maintenance tips for rooftop solar systems in India. Cleaning frequency, water quality rules, and inverter health checks to avoid energy loss.",
    content: `
      <h2>The Real Cost of Soiling Loss in India</h2>
      <p>Ambient dust, particulate pollution, and bird droppings accumulate rapidly on solar glass in India, causing <strong>soiling losses of 8% to 15%</strong> if left uncleaned for several weeks. In dry, dusty regions, dirty panels can reduce your monthly savings by thousands of rupees.</p>

      <h2>Best Practices for Cleaning Solar Panels</h2>
      <ul>
        <li><strong>Clean During Cool Hours:</strong> Always wash panels during early morning (before 8:30 AM) or late evening. Spraying cold water on scorching hot glass during afternoon sunshine can cause thermal shock and glass micro-cracking.</li>
        <li><strong>Use Soft Water:</strong> Use soft tap water (low TDS). Hard borewell water with high calcium content will leave white mineral scale deposits that permanently impede sunlight absorption.</li>
        <li><strong>Non-Abrasive Sponges Only:</strong> Use a soft microfiber mop or soft-bristled solar cleaning brush. Never use metal scrubbers, detergent powders, or harsh acid chemicals that damage the anti-reflective coating (ARC).</li>
        <li><strong>Check Inverter Error Logs:</strong> Periodically check your smartphone monitoring app or inverter LCD display to confirm all strings are generating balanced electrical current.</li>
      </ul>

      <p>Need professional annual maintenance? Learn more on our <a href="/customer-services">Customer Services & AMC Page</a>.</p>
    `,
    faqs: [
      {
        question: "How often should I wash my solar panels?",
        answer: "In typical Indian cities, cleaning your solar modules once every 10 to 15 days is optimal to maintain peak generation."
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
