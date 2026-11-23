/**
 * @file panels.ts
 * @description Master data source for AG POWER solar panel catalogue and product detail pages.
 * All specs have // TODO: datasheet se verify comments as requested.
 */

export interface PanelImage {
  src: string
  alt: string
  label: string
}

export interface PanelBenefit {
  title: string
  description: string
  iconName: "Zap" | "ShieldCheck" | "SunMedium" | "TrendingUp" | "Sparkles" | "Clock" | "Award" | "CheckCircle2"
}

export interface PanelSpecs {
  powerRange: string // TODO: datasheet se verify
  cellTechnology: string // TODO: datasheet se verify
  numberOfCells: string // TODO: datasheet se verify
  moduleEfficiency: string // TODO: datasheet se verify
  dimensions: string // TODO: datasheet se verify
  weight: string // TODO: datasheet se verify
  frontRearGlass: string // TODO: datasheet se verify
  frame: string // TODO: datasheet se verify
  junctionBox: string // TODO: datasheet se verify (IP68)
  operatingTemperature: string // TODO: datasheet se verify
  temperatureCoefficient: string // TODO: datasheet se verify
  maxSystemVoltage: string // TODO: datasheet se verify
  bifaciality?: string // TODO: datasheet se verify (sirf bifacial ke liye)
}

export interface PanelWarranty {
  product: string
  performance: string
  details: string[]
}

export interface SubsidyStep {
  step: number
  title: string
  desc: string
}

export interface PanelSubsidyInfo {
  maxSubsidy: string
  steps: SubsidyStep[]
  note: string
}

export interface PanelFaq {
  question: string
  answer: string
}

export interface SolarPanelDetail {
  slug: string
  name: string
  brand: string
  technology: string
  wattageRange: string
  efficiency: string
  tagline: string
  badge: string
  images: PanelImage[]
  benefits: PanelBenefit[]
  specs: PanelSpecs
  warranty: PanelWarranty
  bestFor: {
    title: string
    description: string
    useCases: string[]
  }
  subsidyInfo: PanelSubsidyInfo
  datasheetUrl: string
  faqs: PanelFaq[]
  roiNote: string
}

export const SOLAR_PANELS: SolarPanelDetail[] = [
  {
    slug: "n-type-topcon-bifacial",
    name: "Waaree Arka N-Type TOPCon Dual-Glass Bifacial",
    brand: "Waaree Solar",
    technology: "N-Type TOPCon Dual-Glass Bifacial",
    wattageRange: "550W - 580W",
    efficiency: "22.6%",
    tagline: "India's highest yielding dual-glass solar module engineered for up to 25% extra generation from rear reflection.",
    badge: "Highest Efficiency",
    images: [
      {
        src: "/panels/n-type-topcon-bifacial/main.webp",
        alt: "N-Type TOPCon bifacial solar panel installed on rooftop in Jaipur",
        label: "Front Elevation",
      },
      {
        src: "/panels/n-type-topcon-bifacial/back.webp",
        alt: "Waaree N-Type TOPCon dual-glass rear side bifacial cell architecture",
        label: "Rear Dual-Glass",
      },
      {
        src: "/panels/n-type-topcon-bifacial/closeup.webp",
        alt: "Close-up macro of multi-busbar N-Type TOPCon photovoltaic silicon cells",
        label: "Cell Close-up",
      },
      {
        src: "/panels/n-type-topcon-bifacial/rooftop.webp",
        alt: "Elevated residential rooftop solar pergola installation with bifacial panels",
        label: "Rooftop Install",
      },
      {
        src: "/panels/n-type-topcon-bifacial/detail.webp",
        alt: "Anodized aluminum alloy frame and IP68 junction box engineered for durability",
        label: "Frame & Junction",
      },
    ],
    benefits: [
      {
        title: "Up to 90% Monthly Bill Savings",
        description: "Dual-glass energy capture harvests direct sunlight from front and reflective albedo light from rear, reducing net grid consumption up to 90%.",
        iconName: "Zap",
      },
      {
        title: "Zero Light-Induced Degradation (LID)",
        description: "N-Type silicon wafer chemistry completely eliminates boron-oxygen defects, keeping initial year degradation under 1%.",
        iconName: "ShieldCheck",
      },
      {
        title: "+25% Extra Rear Power Harvest",
        description: "High 80% bifaciality factor generates supplementary power from white roof tile or concrete reflection throughout the year.",
        iconName: "SunMedium",
      },
      {
        title: "Extreme 150 km/h Wind & Hail Resistance",
        description: "Dual 2.0 mm tempered glass withstands violent desert sandstorms, hail impact, and 5400 Pa heavy mechanical load.",
        iconName: "Award",
      },
    ],
    specs: {
      powerRange: "550W - 580W", // TODO: datasheet se verify
      cellTechnology: "N-Type TOPCon (Tunnel Oxide Passivated Contact)", // TODO: datasheet se verify
      numberOfCells: "144 (6 x 24) Half-Cut Cells", // TODO: datasheet se verify
      moduleEfficiency: "22.6%", // TODO: datasheet se verify
      dimensions: "2278 x 1134 x 30 mm", // TODO: datasheet se verify
      weight: "32.5 kg", // TODO: datasheet se verify
      frontRearGlass: "2.0 mm Semi-tempered Dual Glass with Anti-reflective Coating", // TODO: datasheet se verify
      frame: "Anodized Aluminum Alloy (Silver/Black finish)", // TODO: datasheet se verify
      junctionBox: "IP68 rated with 3 bypass diodes", // TODO: datasheet se verify
      operatingTemperature: "-40°C to +85°C", // TODO: datasheet se verify
      temperatureCoefficient: "-0.30% / °C (Lowest heat loss in Rajasthan summer)", // TODO: datasheet se verify
      maxSystemVoltage: "1500V DC (IEC)", // TODO: datasheet se verify
      bifaciality: "80% ± 5% rear generation gain", // TODO: datasheet se verify (sirf bifacial ke liye)
    },
    warranty: {
      product: "12-Year Comprehensive Workmanship & Product Warranty",
      performance: "30-Year Linear Power Output Guarantee",
      details: [
        "Year 1 degradation capped at ≤ 1.0%",
        "Year 2–30 annual degradation strictly ≤ 0.40%",
        "At Year 30, guaranteed retained output of ≥ 87.4%",
      ],
    },
    bestFor: {
      title: "Commercial Sheds, Elevated Rooftops & High-Yield Residences",
      description: "Best suited for independent homes with white-coated terrace floors, elevated pergola structures, factories, and commercial installations seeking maximum units per square foot.",
      useCases: [
        "Residential terrace with reflective or mosaic white tiles",
        "Elevated pergola carports and sit-out rooftop lounges",
        "Commercial and industrial manufacturing sheds",
      ],
    },
    subsidyInfo: {
      maxSubsidy: "Up to ₹78,000 under PM Surya Ghar Muft Bijli Yojana",
      note: "Subsidy eligibility and disbursement amounts are subject to applicable central and state government policies, DISCOM guidelines, and DCR compliance standards.",
      steps: [
        {
          step: 1,
          title: "National Portal Application",
          desc: "AG POWER handles your direct consumer registration and application on the national PM Surya Ghar portal.",
        },
        {
          step: 2,
          title: "Feasibility & Turnkey Installation",
          desc: "Following DISCOM technical feasibility clearance, Tier-1 Waaree modules and certified inverters are installed within 2–3 days.",
        },
        {
          step: 3,
          title: "DISCOM Inspection & Net-Meter",
          desc: "Utility engineers inspect the on-site installation and synchronize the bi-directional net meter with the grid.",
        },
        {
          step: 4,
          title: "Direct Bank Subsidy Credit",
          desc: "Upon commissioning certificate issuance, the central subsidy is directly credited to your bank account via DBT.",
        },
      ],
    },
    datasheetUrl: "/datasheets/waaree-arka-topcon-550w.pdf",
    faqs: [
      {
        question: "What is the approximate turnkey cost for this panel?",
        answer: "Waaree N-Type TOPCon bifacial modules with complete turnkey rooftop installation (panels, structure, inverter, earthing, net-metering) typically range from ₹48 to ₹54 per Watt. Under PM Surya Ghar, eligible residential installations receive up to ₹78,000 in direct central subsidies.",
      },
      {
        question: "How long does the installation process take?",
        answer: "Physical rooftop assembly is completed by our certified EPC engineers in 2–3 days. The complete cycle, including DISCOM approvals and net-meter synchronization, typically takes 3–4 weeks.",
      },
      {
        question: "What maintenance is required for bifacial dual-glass panels?",
        answer: "Dual-glass modules feature anti-soiling glass that naturally repels dust. Rinsing panels with clean water twice a month is sufficient to maintain peak performance, with near-zero mechanical maintenance required.",
      },
      {
        question: "How does the PM Surya Ghar subsidy work for these panels?",
        answer: "These modules are 100% ALMM approved and DCR compliant, making them fully eligible for PM Surya Ghar Muft Bijli Yojana subsidies: ₹30,000 for 1kW, ₹60,000 for 2kW, and up to ₹78,000 for 3kW and above.",
      },
      {
        question: "How does AG POWER handle warranty claims?",
        answer: "AG POWER provides single-window local support across Rajasthan. In the rare event of a claim, our certified engineers perform on-site diagnostic testing within 24–48 hours and facilitate direct manufacturer replacement.",
      },
      {
        question: "What is the bifacial advantage and how does it perform in Rajasthan summer heat?",
        answer: "The bifacial architecture captures reflected ambient light from the rear glass, delivering up to 25% higher total yield. With a low temperature coefficient of -0.30%/°C, it maintains industry-leading generation even during intense 45°C+ summer conditions.",
      },
    ],
    roiNote: "Estimated 3.4 to 3.8 years payback period with up to 90% monthly electricity bill reduction and 30-year operational life.",
  },
  {
    slug: "mono-perc-half-cut-mbb",
    name: "Adani Solar Shine Mono PERC Half-Cut MBB Module",
    brand: "Adani Solar",
    technology: "Mono PERC Half-Cut Monofacial",
    wattageRange: "540W - 550W",
    efficiency: "21.3%",
    tagline: "India's highest selling, most dependable solar panel offering the fastest ROI and lowest capital cost per watt.",
    badge: "Best Value & Fast Payback",
    images: [
      {
        src: "/panels/mono-perc-half-cut-mbb/main.webp",
        alt: "Adani Solar Mono PERC half-cut solar panel on Jaipur residential rooftop",
        label: "Front View",
      },
      {
        src: "/panels/mono-perc-half-cut-mbb/back.webp",
        alt: "Adani Mono PERC rear Tedlar backsheet and sealed junction box",
        label: "Backsheet & Wiring",
      },
      {
        src: "/panels/mono-perc-half-cut-mbb/closeup.webp",
        alt: "Close-up macro of Adani half-cut multi-busbar solar cell layout",
        label: "Cell Matrix",
      },
      {
        src: "/panels/mono-perc-half-cut-mbb/rooftop.webp",
        alt: "Adani solar panels grid installation on standard RCC residential roof",
        label: "RCC Rooftop Install",
      },
      {
        src: "/panels/mono-perc-half-cut-mbb/detail.webp",
        alt: "Heavy-duty 35mm aluminum frame with drainage holes and grounding points",
        label: "35mm Heavy Frame",
      },
    ],
    benefits: [
      {
        title: "Fastest 3.2-Year Capital Payback",
        description: "Lowest capital acquisition cost per watt delivers the quickest break-even timeline for Indian residential grid consumers.",
        iconName: "TrendingUp",
      },
      {
        title: "Multi-Busbar (MBB) Shadow Tolerance",
        description: "Half-cut cell design halves internal resistance current, dramatically minimizing energy loss when partial trees or parapets cast shade.",
        iconName: "CheckCircle2",
      },
      {
        title: "100% ALMM Tier-1 Indian Certified",
        description: "Manufactured at Adani's Mundra gigafactory under strict BIS quality norms and eligible for all DISCOM net-metering schemes.",
        iconName: "ShieldCheck",
      },
      {
        title: "Robust 5400 Pa Mechanical Strength",
        description: "Tested to withstand heavy hail storms, severe gale force winds, and harsh desert dust accumulations without micro-cracking.",
        iconName: "Award",
      },
    ],
    specs: {
      powerRange: "540W - 550W", // TODO: datasheet se verify
      cellTechnology: "Mono PERC (Passivated Emitter and Rear Cell)", // TODO: datasheet se verify
      numberOfCells: "144 (6 x 24) Half-Cut Monocrystalline Cells", // TODO: datasheet se verify
      moduleEfficiency: "21.3%", // TODO: datasheet se verify
      dimensions: "2279 x 1134 x 35 mm", // TODO: datasheet se verify
      weight: "28.5 kg", // TODO: datasheet se verify
      frontRearGlass: "3.2 mm High Transmission Tempered Glass + Fluoropolymer Backsheet", // TODO: datasheet se verify
      frame: "Silver Anodized Aluminum Alloy (35 mm)", // TODO: datasheet se verify
      junctionBox: "IP68 rated with 3 bypass diodes", // TODO: datasheet se verify
      operatingTemperature: "-40°C to +85°C", // TODO: datasheet se verify
      temperatureCoefficient: "-0.35% / °C (High temperature stability)", // TODO: datasheet se verify
      maxSystemVoltage: "1500V DC (IEC)", // TODO: datasheet se verify
    },
    warranty: {
      product: "12-Year Workmanship & Manufacturer Product Warranty",
      performance: "25-Year Linear Output Guarantee",
      details: [
        "Year 1 degradation capped at ≤ 2.0%",
        "Year 2–25 annual linear degradation ≤ 0.55%",
        "At Year 25, guaranteed power output of ≥ 84.8%",
      ],
    },
    bestFor: {
      title: "Standard Residential Homes, Villas & Housing Societies",
      description: "Ideal for homeowners wanting the lowest upfront investment with proven Tier-1 quality, rapid subsidy credit, and trusted brand warranty.",
      useCases: [
        "Independent 1kW to 10kW residential rooftop systems",
        "Housing society common-meter power plants",
        "Educational institutions, clinics, and small retail establishments",
      ],
    },
    subsidyInfo: {
      maxSubsidy: "Up to ₹78,000 under PM Surya Ghar Muft Bijli Yojana",
      note: "Subsidy eligibility and disbursement amounts are subject to applicable central and state government policies, DISCOM guidelines, and DCR compliance standards.",
      steps: [
        {
          step: 1,
          title: "National Portal Registration",
          desc: "AG POWER registers your consumer account on the national portal with complete electricity bill and DISCOM documentation.",
        },
        {
          step: 2,
          title: "Turnkey EPC Installation",
          desc: "Adani Tier-1 modules are mounted using precision-engineered RCC mounting structures within 2 days.",
        },
        {
          step: 3,
          title: "DISCOM Net-Meter Synchronization",
          desc: "DISCOM engineers perform safety inspections and install the bi-directional net meter for export credits.",
        },
        {
          step: 4,
          title: "Direct Bank Subsidy Credit",
          desc: "The approved central financial assistance is credited directly into your Aadhaar-linked bank account via DBT.",
        },
      ],
    },
    datasheetUrl: "/datasheets/adani-shine-mono-perc-540w.pdf",
    faqs: [
      {
        question: "What is the approximate price for Adani Mono PERC panels?",
        answer: "Adani Mono PERC modules offer outstanding value, with turnkey rooftop installation averaging ₹45 to ₹49 per Watt. After applying PM Surya Ghar subsidies, the net consumer payback period is typically under 3.2 years.",
      },
      {
        question: "How much time is required from order to power generation?",
        answer: "Rooftop hardware installation requires only 2 days. The entire end-to-end commissioning, including DISCOM approvals and net-meter testing, takes approximately 3 weeks.",
      },
      {
        question: "What maintenance is required?",
        answer: "The modules feature high-transmission anti-reflective tempered glass. Light water washing once or twice a month during early morning or evening hours ensures optimal generation.",
      },
      {
        question: "Are Adani Mono PERC modules eligible for PM Surya Ghar subsidy?",
        answer: "Yes. Adani Solar's DCR-certified Mono PERC panels are 100% compliant with PM Surya Ghar regulations, providing direct DBT subsidies of up to ₹78,000 for residential consumers.",
      },
      {
        question: "How are warranty claims processed?",
        answer: "Backed by Adani Solar's nationwide service infrastructure, AG POWER manages all diagnostic testing, warranty claims, and module replacements directly for local clients.",
      },
      {
        question: "How does it perform under Rajasthan's high summer temperatures?",
        answer: "Mono PERC half-cut cells are engineered with optimized internal current paths and a -0.35%/°C temperature coefficient, delivering stable and reliable power yields in temperatures exceeding 45°C.",
      },
    ],
    roiNote: "Fastest 3.2-year return on investment with proven performance across over 10,000+ Indian installations.",
  },
  {
    slug: "architectural-all-black-premium",
    name: "Tata Power Architectural All-Black Premium Series",
    brand: "Tata Power Solar",
    technology: "N-Type Monocrystalline All-Black",
    wattageRange: "440W - 460W",
    efficiency: "22.1%",
    tagline: "Ultra-luxury full matte-black solar panels engineered to blend invisibly with premium modern villa architecture.",
    badge: "Architectural Choice",
    images: [
      {
        src: "/panels/architectural-all-black-premium/main.webp",
        alt: "Tata Power All-Black premium solar panel on luxury villa rooftop",
        label: "Full Black Finish",
      },
      {
        src: "/panels/architectural-all-black-premium/back.webp",
        alt: "Tata Power rear black encapsulation and discreet junction box",
        label: "Black Encapsulation",
      },
      {
        src: "/panels/architectural-all-black-premium/closeup.webp",
        alt: "Close-up of seamless black busbars and anti-dust hydrophobic surface",
        label: "Seamless Cells",
      },
      {
        src: "/panels/architectural-all-black-premium/rooftop.webp",
        alt: "Tata Power all-black solar array on luxury modern architectural terrace",
        label: "Villa Rooftop Array",
      },
      {
        src: "/panels/architectural-all-black-premium/detail.webp",
        alt: "Matte black anodized aluminum edge frame for architectural symmetry",
        label: "Matte Black Frame",
      },
    ],
    benefits: [
      {
        title: "Seamless Luxury Villa Aesthetics",
        description: "Full black cells, black frame, and black backsheet eliminate visible silvery grid lines for an architectural look on premium villas.",
        iconName: "Sparkles",
      },
      {
        title: "Backed by 25-Year Tata Trust",
        description: "India's most trusted energy conglomerate delivers industry-leading reliability, build quality, and bankable lifetime performance.",
        iconName: "ShieldCheck",
      },
      {
        title: "Superior Heat Resilience up to 48°C",
        description: "Advanced N-Type silicon chemistry maintains high conversion efficiency even in blistering summer heat on concrete roof decks.",
        iconName: "SunMedium",
      },
      {
        title: "Hydrophobic Anti-Dust Surface Coating",
        description: "Self-cleaning nanotech coating sheds dust and bird droppings with minimal rain or light hose washing.",
        iconName: "CheckCircle2",
      },
    ],
    specs: {
      powerRange: "440W - 460W", // TODO: datasheet se verify
      cellTechnology: "N-Type Monocrystalline Full-Black Architecture", // TODO: datasheet se verify
      numberOfCells: "108 (6 x 18) Full-Black Half-Cut Cells", // TODO: datasheet se verify
      moduleEfficiency: "22.1%", // TODO: datasheet se verify
      dimensions: "1722 x 1134 x 30 mm", // TODO: datasheet se verify
      weight: "21.5 kg (Lightweight compact design)", // TODO: datasheet se verify
      frontRearGlass: "3.2 mm Anti-Reflective Low-Iron Tempered Glass + Matte Black Backsheet", // TODO: datasheet se verify
      frame: "Anodized Architectural Matte Black Aluminum Alloy", // TODO: datasheet se verify
      junctionBox: "IP68 rated with 3 bypass diodes", // TODO: datasheet se verify
      operatingTemperature: "-40°C to +85°C", // TODO: datasheet se verify
      temperatureCoefficient: "-0.29% / °C (Outstanding heat endurance)", // TODO: datasheet se verify
      maxSystemVoltage: "1500V DC (IEC)", // TODO: datasheet se verify
    },
    warranty: {
      product: "15-Year Extended Tata Power Product & Workmanship Warranty",
      performance: "25-Year Linear Power Warranty",
      details: [
        "Year 1 degradation capped at ≤ 1.0%",
        "Year 2–25 annual linear degradation strictly ≤ 0.45%",
        "At Year 25, guaranteed power output of ≥ 88.0%",
      ],
    },
    bestFor: {
      title: "Luxury Villas, Heritage Homes & Designer Modern Terraces",
      description: "Crafted specifically for discerning clients who demand world-class rooftop aesthetics without compromising on clean energy yields.",
      useCases: [
        "Luxury modern villas with visible rooflines and terraces",
        "Boutique hotels, luxury farmhouses, and heritage stays",
        "High-end architectural residential projects in urban centres",
      ],
    },
    subsidyInfo: {
      maxSubsidy: "Up to ₹78,000 under PM Surya Ghar Muft Bijli Yojana",
      note: "Subsidy eligibility and disbursement amounts are subject to applicable central and state government policies, DISCOM guidelines, and DCR compliance standards.",
      steps: [
        {
          step: 1,
          title: "Site Survey & 3D Design",
          desc: "Our senior solar engineers conduct a detailed site survey and generate an architectural 3D layout optimized for aesthetics and yield.",
        },
        {
          step: 2,
          title: "Precision Architectural Installation",
          desc: "Tata All-Black panels are installed using concealed conduit wiring and low-profile black anodized mounting hardware.",
        },
        {
          step: 3,
          title: "DISCOM Inspection & Synchronization",
          desc: "Utility engineers perform on-site safety inspections, net-meter testing, and grid synchronization.",
        },
        {
          step: 4,
          title: "Direct Subsidy Disbursement",
          desc: "Approved central financial assistance is credited directly to your bank account via the national DBT portal.",
        },
      ],
    },
    datasheetUrl: "/datasheets/tata-power-all-black-450w.pdf",
    faqs: [
      {
        question: "What is the approximate price for Tata All-Black panels?",
        answer: "Tata Power Architectural All-Black panels are premium architectural hardware. Complete turnkey installations range from ₹52 to ₹58 per Watt, including aesthetic concealed mounting hardware and premium wiring.",
      },
      {
        question: "How long does installation take?",
        answer: "Due to meticulous aesthetic alignment and concealed cabling, mechanical installation takes 3–4 days, with full grid synchronization completed in 3–4 weeks.",
      },
      {
        question: "Do black panels absorb more heat and lose efficiency?",
        answer: "No. Advanced N-Type silicon technology and an ultra-low -0.29%/°C temperature coefficient allow these modules to outperform conventional panels even during extreme desert heat.",
      },
      {
        question: "Are Tata All-Black panels eligible for government subsidies?",
        answer: "Yes. DCR-compliant models within the Tata Power residential series are fully eligible for central PM Surya Ghar subsidies of up to ₹78,000.",
      },
      {
        question: "How is Tata Power warranty supported?",
        answer: "As an authorized partner, AG POWER handles all local service requests directly. Backed by Tata Power's 25-year reliability commitment, warranty resolutions are handled promptly on-site.",
      },
      {
        question: "How do these panels withstand dust and harsh desert environments?",
        answer: "The surface features a hydrophobic anti-dust nanotech coating that prevents dust buildup and ensures easy self-cleaning during rainfall or regular water sprays.",
      },
    ],
    roiNote: "Premium luxury aesthetics with reliable 3.8 to 4.2 years payback and 25-year peace of mind backed by Tata.",
  },
]

export function getAllPanels(): SolarPanelDetail[] {
  return SOLAR_PANELS
}

export function getPanelBySlug(slug: string): SolarPanelDetail | undefined {
  return SOLAR_PANELS.find((p) => p.slug === slug)
}
