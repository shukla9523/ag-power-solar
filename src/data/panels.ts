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

export interface PanelCustomerBenefit {
  tag: string
  highlight: string
  points: string[]
}

export interface SolarPanelDetail {
  slug: string
  name: string
  brand: string
  technology: string
  wattageRange: string
  efficiency: string
  tagline: string
  badge?: string
  almm_listed?: boolean
  customerBenefit: PanelCustomerBenefit
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
    tagline: "Dual-glass bifacial monocrystalline solar module with N-Type TOPCon cell technology, 550W–580W output, and up to 80% bifaciality factor for rear-side power harvest.",
    badge: "",
    almm_listed: true,
    customerBenefit: {
      tag: "Dual-Glass Architecture",
      highlight: "Up to 80% Bifaciality Factor",
      points: [
        "Bifacial dual-glass construction captures reflected light from rear side",
        "Eligible for PM Surya Ghar Muft Bijli Yojana central subsidy",
        "30-year linear performance warranty with ≤0.40% annual degradation",
        "Dual 2.0 mm semi-tempered glass rated for 5400 Pa mechanical load",
      ],
    },
    images: [
      {
        src: "/panels/n-type-topcon-bifacial/main.webp",
        alt: "Waaree Arka N-Type TOPCon Dual-Glass Bifacial Solar Panel",
        label: "Module Overview",
      },
    ],
    benefits: [
      {
        title: "Bifacial Power Harvest",
        description: "Dual-glass construction captures direct solar irradiance from front cells and reflected albedo light from rear glass, delivering up to 80% bifaciality.",
        iconName: "SunMedium",
      },
      {
        title: "Zero Light-Induced Degradation (LID)",
        description: "N-Type silicon wafer chemistry eliminates boron-oxygen defects, keeping initial first-year degradation within 1.0%.",
        iconName: "ShieldCheck",
      },
      {
        title: "Low Temperature Coefficient",
        description: "Temperature coefficient of -0.30%/°C maintains high conversion efficiency during elevated ambient temperature conditions.",
        iconName: "Zap",
      },
      {
        title: "5400 Pa Mechanical Load Resistance",
        description: "Dual 2.0 mm semi-tempered glass and anodized aluminum frame withstand 5400 Pa front snow/mechanical load and 2400 Pa rear wind load.",
        iconName: "Award",
      },
    ],
    specs: {
      powerRange: "550W - 580W",
      cellTechnology: "N-Type TOPCon (Tunnel Oxide Passivated Contact)",
      numberOfCells: "144 (6 x 24) Half-Cut Cells",
      moduleEfficiency: "22.6%",
      dimensions: "2278 x 1134 x 30 mm",
      weight: "32.5 kg",
      frontRearGlass: "2.0 mm Semi-tempered Dual Glass with Anti-reflective Coating",
      frame: "Anodized Aluminum Alloy (Silver/Black finish)",
      junctionBox: "IP68 rated with 3 bypass diodes",
      operatingTemperature: "-40°C to +85°C",
      temperatureCoefficient: "-0.30% / °C",
      maxSystemVoltage: "1500V DC (IEC)",
      bifaciality: "80% ± 5% rear generation gain",
    },
    warranty: {
      product: "12-Year Workmanship & Manufacturer Product Warranty",
      performance: "30-Year Linear Power Output Guarantee",
      details: [
        "Year 1 degradation capped at ≤ 1.0%",
        "Year 2–30 annual linear degradation strictly ≤ 0.40%",
        "Guaranteed retained output of ≥ 87.4% at Year 30",
      ],
    },
    bestFor: {
      title: "Commercial Sheds, Elevated Rooftops & High-Yield Residences",
      description: "Recommended for independent homes with reflective terrace floors, elevated pergola structures, and commercial installations seeking maximum energy yield per square foot.",
      useCases: [
        "Residential terrace with reflective or mosaic white tiles",
        "Elevated pergola carports and sit-out rooftop lounges",
        "Commercial and industrial manufacturing sheds",
      ],
    },
    subsidyInfo: {
      maxSubsidy: "Up to ₹78,000 under PM Surya Ghar Muft Bijli Yojana",
      note: "Subsidy eligibility and disbursement amounts are subject to applicable central and state DISCOM guidelines and DCR compliance standards.",
      steps: [
        {
          step: 1,
          title: "National Portal Application",
          desc: "Consumer registration and application filing on the national PM Surya Ghar portal.",
        },
        {
          step: 2,
          title: "Feasibility & Installation",
          desc: "DISCOM feasibility clearance and mounting of ALMM-listed modules and certified inverter.",
        },
        {
          step: 3,
          title: "Inspection & Net-Metering",
          desc: "DISCOM safety inspection, testing, and bi-directional net meter grid synchronization.",
        },
        {
          step: 4,
          title: "DBT Subsidy Disbursement",
          desc: "Central subsidy credited directly to your bank account via DBT upon commissioning.",
        },
      ],
    },
    datasheetUrl: "/datasheets/waaree-arka-topcon-550w.pdf",
    faqs: [
      {
        question: "What is the approximate turnkey cost for this panel?",
        answer: "Waaree N-Type TOPCon bifacial modules with complete turnkey rooftop installation (panels, structure, inverter, earthing, net-metering) typically range from ₹48 to ₹54 per Watt depending on structure height and capacity.",
      },
      {
        question: "How long does the installation process take?",
        answer: "Physical rooftop mounting is completed in 2–3 days. The complete cycle, including DISCOM technical feasibility approvals and net-meter synchronization, typically takes 3–4 weeks.",
      },
      {
        question: "What maintenance is required for bifacial dual-glass panels?",
        answer: "Dual-glass modules feature anti-soiling glass surfaces. Cleaning panels with clean water twice a month is recommended to maintain peak generation.",
      },
      {
        question: "How does the PM Surya Ghar subsidy apply to these panels?",
        answer: "These modules are ALMM approved and DCR compliant, qualifying for central subsidies under PM Surya Ghar: ₹30,000 for 1kW, ₹60,000 for 2kW, and up to ₹78,000 for 3kW and above.",
      },
      {
        question: "How does AG POWER handle warranty claims?",
        answer: "AG POWER provides local warranty support. In the event of an issue, our engineers perform on-site diagnostics and coordinate directly with the manufacturer for replacement.",
      },
    ],
    roiNote: "Estimated 3.5 to 4.2 years payback based on typical residential tariff and standard irradiance conditions.",
  },
  {
    slug: "mono-perc-half-cut-mbb",
    name: "Adani Solar Shine Mono PERC Half-Cut MBB Module",
    brand: "Adani Solar",
    technology: "Mono PERC Half-Cut Monofacial",
    wattageRange: "540W - 550W",
    efficiency: "21.3%",
    tagline: "Monofacial Mono PERC half-cut monocrystalline solar module delivering 540W–550W power output with 144 half-cut cells and multi-busbar architecture.",
    badge: "",
    almm_listed: true,
    customerBenefit: {
      tag: "Mono PERC Technology",
      highlight: "144 Half-Cut Cell Architecture",
      points: [
        "144 half-cut monocrystalline cells with multi-busbar interconnection",
        "21.3% module efficiency under standard test conditions",
        "Eligible for PM Surya Ghar Muft Bijli Yojana central subsidy",
        "25-year linear performance warranty with 12-year product warranty",
      ],
    },
    images: [
      {
        src: "/panels/mono-perc-half-cut-mbb/main.webp",
        alt: "Adani Solar Shine Mono PERC Half-Cut Solar Panel",
        label: "Module Overview",
      },
    ],
    benefits: [
      {
        title: "Half-Cut Cell Architecture",
        description: "Splitting cells halves internal electrical current, reducing resistive power losses and optimizing shadow performance.",
        iconName: "CheckCircle2",
      },
      {
        title: "Multi-Busbar (MBB) Design",
        description: "Multi-busbar conductors decrease current path distance across cells, enhancing module reliability and current collection.",
        iconName: "Zap",
      },
      {
        title: "ALMM Approved & DCR Compliant",
        description: "Manufactured in accordance with MNRE ALMM guidelines for Indian residential and commercial grid-tied systems.",
        iconName: "ShieldCheck",
      },
      {
        title: "5400 Pa Mechanical Strength",
        description: "Silver anodized 35 mm aluminum alloy frame certified for 5400 Pa front mechanical load and 2400 Pa rear wind load.",
        iconName: "Award",
      },
    ],
    specs: {
      powerRange: "540W - 550W",
      cellTechnology: "Mono PERC (Passivated Emitter and Rear Cell)",
      numberOfCells: "144 (6 x 24) Half-Cut Monocrystalline Cells",
      moduleEfficiency: "21.3%",
      dimensions: "2279 x 1134 x 35 mm",
      weight: "28.5 kg",
      frontRearGlass: "3.2 mm High Transmission Tempered Glass + Fluoropolymer Backsheet",
      frame: "Silver Anodized Aluminum Alloy (35 mm)",
      junctionBox: "IP68 rated with 3 bypass diodes",
      operatingTemperature: "-40°C to +85°C",
      temperatureCoefficient: "-0.35% / °C",
      maxSystemVoltage: "1500V DC (IEC)",
    },
    warranty: {
      product: "12-Year Workmanship & Manufacturer Product Warranty",
      performance: "25-Year Linear Output Guarantee",
      details: [
        "Year 1 degradation capped at ≤ 2.0%",
        "Year 2–25 annual linear degradation ≤ 0.55%",
        "Guaranteed retained output of ≥ 84.8% at Year 25",
      ],
    },
    bestFor: {
      title: "Standard Residential Homes, Villas & Housing Societies",
      description: "Recommended for residential and institutional rooftops requiring high efficiency, DCR compliance for subsidies, and proven reliability.",
      useCases: [
        "Independent 1kW to 10kW residential rooftop systems",
        "Housing society common-meter power plants",
        "Educational institutions, clinics, and commercial establishments",
      ],
    },
    subsidyInfo: {
      maxSubsidy: "Up to ₹78,000 under PM Surya Ghar Muft Bijli Yojana",
      note: "Subsidy eligibility and disbursement amounts are subject to applicable central and state DISCOM guidelines and DCR compliance standards.",
      steps: [
        {
          step: 1,
          title: "National Portal Registration",
          desc: "Consumer account registration and application on the national PM Surya Ghar portal.",
        },
        {
          step: 2,
          title: "Turnkey Installation",
          desc: "Adani high-efficiency modules mounted using certified RCC mounting structures and inverter setup.",
        },
        {
          step: 3,
          title: "Net-Meter Synchronization",
          desc: "DISCOM safety inspection and bi-directional net-meter installation for grid export.",
        },
        {
          step: 4,
          title: "DBT Subsidy Credit",
          desc: "Central financial assistance credited directly into your Aadhaar-linked bank account.",
        },
      ],
    },
    datasheetUrl: "/datasheets/adani-shine-mono-perc-540w.pdf",
    faqs: [
      {
        question: "What is the approximate price for Adani Mono PERC panels?",
        answer: "Adani Mono PERC modules with turnkey rooftop installation typically range from ₹45 to ₹49 per Watt depending on system capacity and mounting structure design.",
      },
      {
        question: "How much time is required from order to commissioning?",
        answer: "Rooftop hardware installation requires 2 days. The complete commissioning timeline, including DISCOM feasibility and net-meter testing, takes approximately 3 weeks.",
      },
      {
        question: "What maintenance is required?",
        answer: "Modules feature anti-reflective tempered glass. Rinsing with water once or twice a month during early morning or evening hours ensures optimal power output.",
      },
      {
        question: "Are Adani Mono PERC modules eligible for PM Surya Ghar subsidy?",
        answer: "Yes. DCR-certified Adani Mono PERC panels meet all PM Surya Ghar guidelines, qualifying for direct DBT subsidies of up to ₹78,000 for residential systems.",
      },
      {
        question: "How are warranty claims handled?",
        answer: "AG POWER manages diagnostic inspection and warranty coordination directly with Adani Solar's service network for all local installations.",
      },
    ],
    roiNote: "Estimated 3.2 to 3.8 years payback depending on monthly consumption tier and net-metering tariff.",
  },
  {
    slug: "architectural-all-black-premium",
    name: "Tata Power Architectural All-Black Premium Series",
    brand: "Tata Power Solar",
    technology: "N-Type Monocrystalline All-Black",
    wattageRange: "440W - 460W",
    efficiency: "22.1%",
    tagline: "Monocrystalline all-black solar module with black anodized aluminum frame and black backsheet, engineered for rooftop aesthetic integration and 440W–460W power output.",
    badge: "",
    almm_listed: true,
    customerBenefit: {
      tag: "All-Black Design",
      highlight: "Full Black Frame & Backsheet",
      points: [
        "Uniform black cells, frame, and backsheet for discreet architectural appearance",
        "22.1% module efficiency with compact 1722 x 1134 mm footprint",
        "15-year product warranty and 25-year linear power warranty",
        "IP68 rated junction box with weather-resistant anodized frame",
      ],
    },
    images: [
      {
        src: "/panels/architectural-all-black-premium/main.webp",
        alt: "Tata Power Architectural All-Black Solar Panel",
        label: "Module Overview",
      },
    ],
    benefits: [
      {
        title: "Integrated Architectural Aesthetics",
        description: "Black cells, black frame, and black backsheet provide a uniform dark appearance that integrates cleanly into residential rooflines.",
        iconName: "Sparkles",
      },
      {
        title: "Compact High-Density Layout",
        description: "Dimensions of 1722 x 1134 mm allow flexible array configurations on rooftops with limited or segmented surface area.",
        iconName: "CheckCircle2",
      },
      {
        title: "Thermal Performance",
        description: "Temperature coefficient of -0.29%/°C maintains reliable power generation across elevated ambient temperatures.",
        iconName: "SunMedium",
      },
      {
        title: "Manufacturer Warranty",
        description: "Backed by 15-year manufacturer product warranty and 25-year linear output guarantee from Tata Power.",
        iconName: "ShieldCheck",
      },
    ],
    specs: {
      powerRange: "440W - 460W",
      cellTechnology: "N-Type Monocrystalline Full-Black Architecture",
      numberOfCells: "108 (6 x 18) Full-Black Half-Cut Cells",
      moduleEfficiency: "22.1%",
      dimensions: "1722 x 1134 x 30 mm",
      weight: "21.5 kg",
      frontRearGlass: "3.2 mm Anti-Reflective Low-Iron Tempered Glass + Matte Black Backsheet",
      frame: "Anodized Architectural Matte Black Aluminum Alloy",
      junctionBox: "IP68 rated with 3 bypass diodes",
      operatingTemperature: "-40°C to +85°C",
      temperatureCoefficient: "-0.29% / °C",
      maxSystemVoltage: "1500V DC (IEC)",
    },
    warranty: {
      product: "15-Year Tata Power Product & Workmanship Warranty",
      performance: "25-Year Linear Power Warranty",
      details: [
        "Year 1 degradation capped at ≤ 1.0%",
        "Year 2–25 annual linear degradation strictly ≤ 0.45%",
        "Guaranteed retained output of ≥ 88.0% at Year 25",
      ],
    },
    bestFor: {
      title: "Luxury Villas, Heritage Homes & Designer Modern Terraces",
      description: "Recommended for properties where rooftop aesthetics and visual integration with architectural lines are key considerations.",
      useCases: [
        "Modern villas with visible rooflines and terraces",
        "Boutique hotels, farmhouses, and heritage stays",
        "Residential projects with premium facade standards",
      ],
    },
    subsidyInfo: {
      maxSubsidy: "Up to ₹78,000 under PM Surya Ghar Muft Bijli Yojana",
      note: "Subsidy eligibility and disbursement amounts are subject to applicable central and state DISCOM guidelines and DCR compliance standards.",
      steps: [
        {
          step: 1,
          title: "Site Survey & 3D Design",
          desc: "Site survey and 3D array layout optimized for rooftop aesthetics and solar yield.",
        },
        {
          step: 2,
          title: "Precision Installation",
          desc: "Tata All-Black panels mounted using concealed conduit routing and black anodized hardware.",
        },
        {
          step: 3,
          title: "DISCOM Inspection",
          desc: "Utility safety inspection, bi-directional net-meter testing, and grid synchronization.",
        },
        {
          step: 4,
          title: "Direct Subsidy Disbursement",
          desc: "Central financial assistance credited directly to your bank account via the national DBT portal.",
        },
      ],
    },
    datasheetUrl: "/datasheets/tata-power-all-black-450w.pdf",
    faqs: [
      {
        question: "What is the approximate price for Tata All-Black panels?",
        answer: "Tata Power Architectural All-Black panels with complete turnkey installation typically range from ₹52 to ₹58 per Watt, including concealed conduit routing and anodized mounting structures.",
      },
      {
        question: "How long does installation take?",
        answer: "Mechanical installation takes 2–3 days, with full grid synchronization and net-meter commissioning completed in 3–4 weeks.",
      },
      {
        question: "Do black panels lose efficiency in high summer temperatures?",
        answer: "Advanced N-Type silicon chemistry and a temperature coefficient of -0.29%/°C enable stable operation during elevated summer temperatures.",
      },
      {
        question: "Are Tata All-Black panels eligible for government subsidies?",
        answer: "Yes. DCR-compliant models within the series qualify for central PM Surya Ghar subsidies of up to ₹78,000 for residential systems.",
      },
      {
        question: "How is warranty support provided?",
        answer: "AG POWER coordinates diagnostic testing and warranty service directly with Tata Power for on-site resolution.",
      },
    ],
    roiNote: "Estimated 3.8 to 4.5 years payback based on residential rooftop installation and net-metering credits.",
  },
]

export function getAllPanels(): SolarPanelDetail[] {
  return SOLAR_PANELS
}

export function getPanelBySlug(slug: string): SolarPanelDetail | undefined {
  return SOLAR_PANELS.find((p) => p.slug === slug)
}
