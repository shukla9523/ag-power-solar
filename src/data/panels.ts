/**
 * @file panels.ts
 * @description Master data source for AG POWER solar panel catalogue and product detail pages.
 * Clean, verified specifications for India's leading solar photovoltaic modules.
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
  powerRange: string
  cellTechnology: string
  numberOfCells: string
  moduleEfficiency: string
  dimensions: string
  weight: string
  frontRearGlass: string
  frame: string
  junctionBox: string
  operatingTemperature: string
  temperatureCoefficient: string
  maxSystemVoltage: string
  bifaciality?: string
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
  aliases?: string[]
  name: string
  brand: string
  technology: string
  wattageRange: string
  efficiency: string
  tagline: string
  overview?: string
  badge?: string
  almm_listed?: boolean
  dcr_compliant?: boolean
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
  // 1. Waaree Arka N-Type TOPCon
  {
    slug: "waaree-arka-topcon-550w",
    aliases: ["n-type-topcon-bifacial"],
    name: "Waaree Arka N-Type TOPCon Dual-Glass Bifacial",
    brand: "Waaree",
    technology: "N-Type TOPCon Dual-Glass Bifacial",
    wattageRange: "550W - 580W",
    efficiency: "22.6%",
    tagline: "India's highest yielding dual-glass bifacial monocrystalline solar module with N-Type TOPCon cell technology, 550W–580W output, and up to 80% bifaciality factor for rear-side power harvest.",
    overview: "The Waaree Arka Series represents state-of-the-art N-Type TOPCon cell technology engineered for maximum energy yield under high ambient Indian temperatures. Featuring dual semi-tempered glass and zero Light-Induced Degradation (LID), this bifacial module captures reflected ground irradiance to deliver significantly higher kilowatt-hour generation per square foot.",
    badge: "Most Popular",
    almm_listed: true,
    dcr_compliant: true,
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
        src: "/panels/waaree-arka-topcon-550w/main.webp?v=3",
        alt: "Waaree Arka N-Type TOPCon Dual-Glass Bifacial Solar Panel - Front View",
        label: "Front Elevation",
      },
      {
        src: "/panels/waaree-arka-topcon-550w/rooftop.webp?v=3",
        alt: "Waaree Arka N-Type TOPCon - Rooftop Solar Installation",
        label: "Rooftop Installation",
      },
      {
        src: "/panels/waaree-arka-topcon-550w/closeup.webp?v=3",
        alt: "Waaree Arka N-Type TOPCon - Photovoltaic Cell Detail",
        label: "Cell Close-up",
      },
      {
        src: "/panels/waaree-arka-topcon-550w/structure.webp?v=3",
        alt: "Waaree Arka N-Type TOPCon - Structural Clamping & Mounting",
        label: "Mounting Structure",
      },
      {
        src: "/panels/waaree-arka-topcon-550w/detail.webp?v=3",
        alt: "Waaree Arka N-Type TOPCon - Dual Glass & Anodized Frame",
        label: "Surface Detail",
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

  // 2. Adani Solar Shine Mono PERC
  {
    slug: "adani-shine-mono-perc-540w",
    aliases: ["mono-perc-half-cut-mbb"],
    name: "Adani Solar Shine Mono PERC Half-Cut MBB Module",
    brand: "Adani Solar",
    technology: "Mono PERC Half-Cut Monofacial",
    wattageRange: "540W - 550W",
    efficiency: "21.3%",
    tagline: "India's highest selling, most dependable monofacial Mono PERC half-cut monocrystalline solar module delivering 540W–550W power output with 144 half-cut cells and multi-busbar architecture.",
    overview: "The Adani Solar Shine Series provides rugged durability and proven reliability across all Indian climatic zones. Equipped with high-transmission tempered glass, 144 half-cut monocrystalline cells, and multi-busbar technology, it ensures dependable generation with low resistive losses.",
    badge: "Best Value",
    almm_listed: true,
    dcr_compliant: true,
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
        src: "/panels/adani-shine-mono-perc-540w/main.webp?v=3",
        alt: "Adani Solar Shine Mono PERC Half-Cut Solar Panel - Front View",
        label: "Front Elevation",
      },
      {
        src: "/panels/adani-shine-mono-perc-540w/rooftop.webp?v=3",
        alt: "Adani Solar Shine - Residential Rooftop Array",
        label: "Rooftop Installation",
      },
      {
        src: "/panels/adani-shine-mono-perc-540w/closeup.webp?v=3",
        alt: "Adani Solar Shine - Multi-Busbar Half-Cut Cells",
        label: "Cell Close-up",
      },
      {
        src: "/panels/adani-shine-mono-perc-540w/structure.webp?v=3",
        alt: "Adani Solar Shine - Hot-Dip Galvanized Mounting Setup",
        label: "Mounting Structure",
      },
      {
        src: "/panels/adani-shine-mono-perc-540w/detail.webp?v=3",
        alt: "Adani Solar Shine - 35mm Anodized Frame & Weatherproof Backsheet",
        label: "Surface Detail",
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

  // 3. Vikram Solar SOMERA Grand TOPCon
  {
    slug: "vikram-somera-topcon-575w",
    name: "Vikram Solar SOMERA Grand N-Type TOPCon Bifacial",
    brand: "Vikram Solar",
    technology: "N-Type TOPCon Bifacial Dual-Glass",
    wattageRange: "575W - 590W",
    efficiency: "22.8%",
    tagline: "India's highest efficiency commercial-grade dual-glass N-Type TOPCon bifacial module delivering up to 590W power output with micro-gap ribbon interconnection.",
    overview: "The Vikram Solar SOMERA Grand Series is engineered for maximum power density on space-constrained commercial and industrial rooftops. Its advanced TOPCon cell matrix provides exceptional performance under diffuse irradiance conditions and hot summer ambient temperatures.",
    badge: "Highest Efficiency",
    almm_listed: true,
    dcr_compliant: true,
    customerBenefit: {
      tag: "High Power Density",
      highlight: "Up to 590W Ultra-High Output",
      points: [
        "22.8% module efficiency reduces total structural and balance-of-system cost",
        "Superior temperature coefficient of -0.29%/°C minimizes summer power drop",
        "Dual-glass encapsulation protects against PID, salt mist, and ammonia",
        "Full DCR and ALMM compliance for institutional subsidy schemes",
      ],
    },
    images: [
      {
        src: "/panels/vikram-somera-topcon-575w/main.webp?v=3",
        alt: "Vikram Solar SOMERA Grand TOPCon Bifacial Module - Front View",
        label: "Front Elevation",
      },
      {
        src: "/panels/vikram-somera-topcon-575w/rooftop.webp?v=3",
        alt: "Vikram Solar SOMERA Grand - Industrial Rooftop Array",
        label: "Rooftop Installation",
      },
      {
        src: "/panels/vikram-somera-topcon-575w/closeup.webp?v=3",
        alt: "Vikram Solar SOMERA Grand - Micro-Gap TOPCon Cells",
        label: "Cell Close-up",
      },
      {
        src: "/panels/vikram-somera-topcon-575w/structure.webp?v=3",
        alt: "Vikram Solar SOMERA Grand - Heavy-Duty Clamping Rail",
        label: "Mounting Structure",
      },
      {
        src: "/panels/vikram-somera-topcon-575w/detail.webp?v=3",
        alt: "Vikram Solar SOMERA Grand - Dual-Glass Junction Box & Connectors",
        label: "Surface Detail",
      },
    ],
    benefits: [
      {
        title: "Maximum Wattage Density",
        description: "Produces higher energy output per square foot, making it ideal for limited commercial rooftop spaces.",
        iconName: "Zap",
      },
      {
        title: "Best-in-Class Temperature Coefficient",
        description: "Low thermal degradation rate of -0.29%/°C delivers up to 4% more annual kWh in hot summer months.",
        iconName: "SunMedium",
      },
      {
        title: "Micro-Gap Ribbon Interconnection",
        description: "Eliminates cell gaps to boost active absorption area and overall module conversion efficiency.",
        iconName: "Award",
      },
      {
        title: "Certified Ammonia & Salt Mist Resistance",
        description: "Tested and certified for harsh industrial atmospheres and coastal environments.",
        iconName: "ShieldCheck",
      },
    ],
    specs: {
      powerRange: "575W - 590W",
      cellTechnology: "N-Type TOPCon Dual-Glass",
      numberOfCells: "144 (6 x 24) Half-Cut Cells",
      moduleEfficiency: "22.8%",
      dimensions: "2382 x 1134 x 30 mm",
      weight: "33.0 kg",
      frontRearGlass: "2.0 mm Semi-Tempered Glass front and rear",
      frame: "Anodized Aluminum Alloy (30 mm)",
      junctionBox: "IP68 rated with 3 bypass diodes",
      operatingTemperature: "-40°C to +85°C",
      temperatureCoefficient: "-0.29% / °C",
      maxSystemVoltage: "1500V DC (IEC)",
      bifaciality: "80% rear side gain",
    },
    warranty: {
      product: "12-Year Workmanship & Manufacturer Product Warranty",
      performance: "30-Year Linear Power Warranty",
      details: [
        "Year 1 degradation capped at ≤ 1.0%",
        "Year 2–30 annual linear degradation strictly ≤ 0.40%",
        "Guaranteed retained output of ≥ 87.4% at Year 30",
      ],
    },
    bestFor: {
      title: "Commercial & Industrial Sheds, Large Societies & Ground Mounts",
      description: "Designed for high-load industrial consumers, manufacturing plants, and large cooperative housing societies.",
      useCases: [
        "Industrial factory and warehouse metal sheds",
        "Housing society common-area solar plants (25kW - 100kW)",
        "Commercial cold storage and corporate campuses",
      ],
    },
    subsidyInfo: {
      maxSubsidy: "Up to ₹78,000 for eligible residential consumers; 40% depreciation for businesses",
      note: "Eligible for accelerated depreciation tax benefits for commercial enterprises.",
      steps: [
        {
          step: 1,
          title: "Engineering Audit & Load Assessment",
          desc: "Evaluation of sanctioned load, peak daytime consumption, and structural capacity.",
        },
        {
          step: 2,
          title: "CAD Layout & DISCOM Filing",
          desc: "Preparation of electrical drawings and net-metering CEIG documentation.",
        },
        {
          step: 3,
          title: "Turnkey EPC Installation",
          desc: "Non-penetrating structure anchoring, string cabling, and safety earthing.",
        },
        {
          step: 4,
          title: "Commissioning & Sync",
          desc: "Bi-directional net-meter sync with remote IoT cloud monitoring.",
        },
      ],
    },
    datasheetUrl: "/datasheets/vikram-somera-topcon-575w.pdf",
    faqs: [
      {
        question: "Why choose 575W TOPCon modules over conventional Mono PERC?",
        answer: "Higher wattage density means fewer panels are needed for the same plant capacity, saving rooftop area and reducing structural installation costs.",
      },
      {
        question: "Is this panel DCR certified for PM Surya Ghar?",
        answer: "Yes, Vikram Solar manufactures DCR-compliant variants fully recognized under MNRE ALMM registers for residential and institutional subsidies.",
      },
      {
        question: "What is the expected warranty lifespan?",
        answer: "It includes a 12-year product warranty and a 30-year linear performance warranty guaranteeing over 87.4% output at Year 30.",
      },
    ],
    roiNote: "Estimated 2.8 to 3.4 years payback for commercial and industrial grid-connected consumers.",
  },

  // 4. Tata Power Solar Mono PERC
  {
    slug: "tata-power-mono-perc-545w",
    aliases: ["architectural-all-black-premium"],
    name: "Tata Power Solar TP Series Half-Cell Mono PERC",
    brand: "Tata Power Solar",
    technology: "Half-Cell Monocrystalline Mono PERC",
    wattageRange: "545W - 550W",
    efficiency: "21.5%",
    tagline: "Backed by Tata Power's trusted Indian energy engineering legacy, delivering 545W–550W reliable output with 100% EL testing to eliminate micro-cracks.",
    overview: "Built on Tata's decades-long leadership in Indian power infrastructure, the TP Series delivers high conversion efficiency, anti-reflective ARC-coated glass, and stringent Electroluminescence (EL) verification. It is a preferred choice for Indian homeowners seeking brand trust and long-term asset security.",
    badge: "Legacy Trust",
    almm_listed: true,
    dcr_compliant: true,
    customerBenefit: {
      tag: "Tata Engineering Heritage",
      highlight: "Stringent 100% EL Micro-Crack Verification",
      points: [
        "100% dual-stage Electroluminescence testing prevents micro-fractures",
        "High mechanical load capacity certified for up to 5400 Pa",
        "Seamless DISCOM approval track record under PM Surya Ghar",
        "25-year linear performance warranty with trusted factory RMA support",
      ],
    },
    images: [
      {
        src: "/panels/tata-power-mono-perc-545w/main.webp?v=3",
        alt: "Tata Power Solar TP Series Mono PERC Module - Front View",
        label: "Front Elevation",
      },
      {
        src: "/panels/tata-power-mono-perc-545w/rooftop.webp?v=3",
        alt: "Tata Power Solar - Rooftop Solar Installation",
        label: "Rooftop Installation",
      },
      {
        src: "/panels/tata-power-mono-perc-545w/closeup.webp?v=3",
        alt: "Tata Power Solar - Half-Cell Matrix Detail",
        label: "Cell Close-up",
      },
      {
        src: "/panels/tata-power-mono-perc-545w/structure.webp?v=3",
        alt: "Tata Power Solar - Anodized Rail & Structure Assembly",
        label: "Mounting Structure",
      },
      {
        src: "/panels/tata-power-mono-perc-545w/detail.webp?v=3",
        alt: "Tata Power Solar - Weatherproof Junction Box & Cables",
        label: "Surface Detail",
      },
    ],
    benefits: [
      {
        title: "Backed by Tata Power Heritage",
        description: "Built with stringent manufacturing tolerances and certified quality assurance from India's trusted power conglomerate.",
        iconName: "ShieldCheck",
      },
      {
        title: "100% EL Testing",
        description: "Every module undergoes double Electroluminescence scanning to guarantee zero internal cell micro-cracks.",
        iconName: "CheckCircle2",
      },
      {
        title: "Anti-Reflective ARC Glass",
        description: "Low-iron tempered glass with anti-reflective coating increases light transmittance and dirt shedding.",
        iconName: "SunMedium",
      },
      {
        title: "Seamless PM Surya Ghar Approval",
        description: "Pre-approved across Indian DISCOM portals for expedited net-metering and subsidy clearance.",
        iconName: "Award",
      },
    ],
    specs: {
      powerRange: "545W - 550W",
      cellTechnology: "Mono PERC (Passivated Emitter and Rear Cell)",
      numberOfCells: "144 (6 x 24) Half-Cut Cells",
      moduleEfficiency: "21.5%",
      dimensions: "2278 x 1134 x 35 mm",
      weight: "28.0 kg",
      frontRearGlass: "3.2 mm Low-Iron Tempered Glass with Anti-Reflective Coating",
      frame: "Anodized Aluminum Alloy (35 mm)",
      junctionBox: "IP68 rated with 3 bypass diodes",
      operatingTemperature: "-40°C to +85°C",
      temperatureCoefficient: "-0.34% / °C",
      maxSystemVoltage: "1500V DC (IEC)",
    },
    warranty: {
      product: "12-Year Workmanship & Manufacturer Product Warranty",
      performance: "25-Year Linear Power Warranty",
      details: [
        "Year 1 degradation capped at ≤ 2.0%",
        "Year 2–25 annual linear degradation ≤ 0.55%",
        "Guaranteed retained output of ≥ 84.8% at Year 25",
      ],
    },
    bestFor: {
      title: "Residential Villas, Homes & Small Business Rooftops",
      description: "Ideal for homeowners seeking brand heritage, seamless government subsidy documentation, and hassle-free warranty backing.",
      useCases: [
        "Independent homes and residential bungalows (3kW - 10kW)",
        "Small commercial offices and retail stores",
        "Farmhouses and institutional properties",
      ],
    },
    subsidyInfo: {
      maxSubsidy: "Up to ₹78,000 under PM Surya Ghar Muft Bijli Yojana",
      note: "Full subsidy eligibility with swift portal approval across regional DISCOMs.",
      steps: [
        {
          step: 1,
          title: "National Portal Registration",
          desc: "Application registration on PM Surya Ghar portal with your consumer connection number.",
        },
        {
          step: 2,
          title: "Turnkey EPC Installation",
          desc: "Installation of Tata Power modules, grid-tie inverter, and earthing pits by AG POWER.",
        },
        {
          step: 3,
          title: "DISCOM Synchronization",
          desc: "Bi-directional net-meter installation and grid synchronization by DISCOM officials.",
        },
        {
          step: 4,
          title: "Direct Subsidy Deposit",
          desc: "Central subsidy credited directly to your bank account via Direct Benefit Transfer.",
        },
      ],
    },
    datasheetUrl: "/datasheets/tata-power-mono-perc-545w.pdf",
    faqs: [
      {
        question: "What is the turnkey cost for Tata Power solar modules?",
        answer: "Tata Power Mono PERC systems typically range between ₹49 and ₹54 per Watt including structure, inverter, cabling, DISCOM net-metering, and installation.",
      },
      {
        question: "Are these panels eligible for the central PM Surya Ghar subsidy?",
        answer: "Yes, these modules are 100% DCR compliant and ALMM listed, eligible for the maximum ₹78,000 central subsidy.",
      },
      {
        question: "How long does installation and net metering take?",
        answer: "On-site mechanical installation takes 2 days; net-meter testing and synchronization usually take 3 to 4 weeks depending on your local DISCOM.",
      },
    ],
    roiNote: "Estimated 3.4 to 4.0 years payback with guaranteed 25-year performance.",
  },

  // 5. Goldi Solar HELOC Plus TOPCon
  {
    slug: "goldi-heloc-plus-topcon-550w",
    name: "Goldi Solar HELOC Plus TOPCon Bifacial Glass-to-Glass",
    brand: "Goldi Solar",
    technology: "N-Type TOPCon Bifacial Glass-to-Glass",
    wattageRange: "550W - 570W",
    efficiency: "22.4%",
    tagline: "Advanced N-Type TOPCon bifacial glass-to-glass module featuring Class-A fire resistance rating and high shade tolerance for industrial and residential applications.",
    overview: "Goldi Solar HELOC Plus combines dual-glass safety with cutting-edge TOPCon cell efficiency. Certified for Class-A fire rating, it offers split-cell internal bypass architecture that significantly mitigates power loss from partial shade and dust accumulation.",
    badge: "",
    almm_listed: true,
    dcr_compliant: true,
    customerBenefit: {
      tag: "Dual-Glass Safety",
      highlight: "Class-A Fire Rating Certified",
      points: [
        "Class-A fire resistance rating compliant with industrial building codes",
        "Split-cell architecture maintains higher generation under partial shading",
        "22.4% module efficiency with up to 80% bifaciality for rear energy capture",
        "30-year linear performance warranty backed by factory guarantee",
      ],
    },
    images: [
      {
        src: "/panels/goldi-heloc-plus-topcon-550w/main.webp?v=3",
        alt: "Goldi Solar HELOC Plus TOPCon Module - Front View",
        label: "Front Elevation",
      },
      {
        src: "/panels/goldi-heloc-plus-topcon-550w/rooftop.webp?v=3",
        alt: "Goldi Solar HELOC Plus - Commercial Rooftop Array",
        label: "Rooftop Installation",
      },
      {
        src: "/panels/goldi-heloc-plus-topcon-550w/closeup.webp?v=3",
        alt: "Goldi Solar HELOC Plus - Bifacial TOPCon Cell Architecture",
        label: "Cell Close-up",
      },
      {
        src: "/panels/goldi-heloc-plus-topcon-550w/structure.webp?v=3",
        alt: "Goldi Solar HELOC Plus - Dual Glass Mounting Clamps",
        label: "Mounting Structure",
      },
      {
        src: "/panels/goldi-heloc-plus-topcon-550w/detail.webp?v=3",
        alt: "Goldi Solar HELOC Plus - Semi-Tempered Glass Surface",
        label: "Surface Detail",
      },
    ],
    benefits: [
      {
        title: "Class-A Fire Rating",
        description: "Dual-glass architecture provides superior fire safety compliance required for commercial and industrial insurance standards.",
        iconName: "ShieldCheck",
      },
      {
        title: "High Shade Tolerance",
        description: "Split-cell layout and internal bypass diodes reduce hotspot risks and preserve array generation during localized shading.",
        iconName: "CheckCircle2",
      },
      {
        title: "Lower Thermal Coefficient",
        description: "Operates cooler in direct tropical sunshine, boosting actual daily kilowatt-hour yields.",
        iconName: "SunMedium",
      },
      {
        title: "30-Year Performance Guarantee",
        description: "Minimal degradation over three decades ensures long-term cash flow predictability.",
        iconName: "Award",
      },
    ],
    specs: {
      powerRange: "550W - 570W",
      cellTechnology: "N-Type TOPCon Dual-Glass",
      numberOfCells: "144 (6 x 24) Half-Cut Cells",
      moduleEfficiency: "22.4%",
      dimensions: "2278 x 1134 x 30 mm",
      weight: "31.5 kg",
      frontRearGlass: "2.0 mm Semi-tempered Dual Glass",
      frame: "Anodized Aluminum Alloy (30 mm)",
      junctionBox: "IP68 rated with 3 bypass diodes",
      operatingTemperature: "-40°C to +85°C",
      temperatureCoefficient: "-0.30% / °C",
      maxSystemVoltage: "1500V DC (IEC)",
      bifaciality: "80% rear side gain",
    },
    warranty: {
      product: "12-Year Workmanship & Manufacturer Product Warranty",
      performance: "30-Year Linear Power Warranty",
      details: [
        "Year 1 degradation capped at ≤ 1.0%",
        "Year 2–30 annual linear degradation strictly ≤ 0.40%",
        "Guaranteed retained output of ≥ 87.4% at Year 30",
      ],
    },
    bestFor: {
      title: "Warehouses, Factories & Fire-Code Sensitive Commercial Sites",
      description: "Recommended for commercial buildings with stringent fire safety regulations and residential roofs requiring shade tolerance.",
      useCases: [
        "Commercial warehouses and chemical industrial facilities",
        "Apartment complexes with partial parapet shading",
        "Rooftop carports and elevated terrace structures",
      ],
    },
    subsidyInfo: {
      maxSubsidy: "Up to ₹78,000 for residential homes; 40% depreciation for enterprises",
      note: "Eligible for all PM Surya Ghar residential and commercial net-metering schemes.",
      steps: [
        {
          step: 1,
          title: "Site Survey & Shading Analysis",
          desc: "3D ray-tracing simulation to optimize panel string layout and orientation.",
        },
        {
          step: 2,
          title: "Approvals & Procurement",
          desc: "DISCOM sanction and procurement of certified balance-of-system equipment.",
        },
        {
          step: 3,
          title: "Precision Installation",
          desc: "Dual-glass module mounting with certified torque specifications.",
        },
        {
          step: 4,
          title: "Commissioning & Sync",
          desc: "Bi-directional net-meter sync and subsidy documentation filing.",
        },
      ],
    },
    datasheetUrl: "/datasheets/goldi-heloc-plus-topcon-550w.pdf",
    faqs: [
      {
        question: "What does Class-A fire rating mean for solar panels?",
        answer: "Class-A fire rating is the highest international fire resistance standard for building materials, ensuring modules will not ignite or spread flame across roof surfaces.",
      },
      {
        question: "Does the bifacial rear side generate power on concrete roofs?",
        answer: "Yes, concrete or light-colored rooftop surfaces reflect diffuse sunlight into the rear glass, typically generating an extra 8% to 15% bonus energy.",
      },
    ],
    roiNote: "Estimated 3.3 to 3.9 years payback for residential and commercial consumers.",
  },

  // 6. RenewSys Architectural Ultra All-Black
  {
    slug: "architectural-all-black-450w",
    name: "RenewSys Architectural Ultra All-Black Series",
    brand: "RenewSys",
    technology: "N-Type TOPCon All-Black Monofacial",
    wattageRange: "440W - 460W",
    efficiency: "22.1%",
    tagline: "Premium full matte black solar module with zero visible silver ribbons, engineered for luxury villas, modern residential terraces, and architectural facades.",
    overview: "For homeowners and architects who demand uncompromised aesthetics alongside high efficiency, the RenewSys Architectural All-Black Series integrates black busbars, a deep black backsheet, and an anodized matte black aluminum frame. It blends seamlessly into designer rooflines while generating dependable clean power.",
    badge: "Designer Choice",
    almm_listed: true,
    dcr_compliant: false,
    customerBenefit: {
      tag: "Architectural Aesthetics",
      highlight: "Full Matte Black Zero-Ribbon Look",
      points: [
        "Uniform matte black appearance blends elegantly with modern roof architecture",
        "Compact 1762 x 1134 mm form factor ideal for pitched roofs and designer villas",
        "Lightweight 21 kg build for versatile mounting orientations",
        "15-year product warranty and 25-year linear performance warranty",
      ],
    },
    images: [
      {
        src: "/panels/architectural-all-black-450w/main.webp?v=3",
        alt: "RenewSys Architectural All-Black Solar Panel - Front View",
        label: "Front Elevation",
      },
      {
        src: "/panels/architectural-all-black-450w/rooftop.webp?v=3",
        alt: "RenewSys Architectural All-Black - Modern Villa Rooftop Array",
        label: "Rooftop Installation",
      },
      {
        src: "/panels/architectural-all-black-450w/closeup.webp?v=3",
        alt: "RenewSys Architectural All-Black - Matte Black Cell Texture",
        label: "Cell Close-up",
      },
      {
        src: "/panels/architectural-all-black-450w/structure.webp?v=3",
        alt: "RenewSys Architectural All-Black - Black Anodized Mounting Hardware",
        label: "Mounting Structure",
      },
      {
        src: "/panels/architectural-all-black-450w/detail.webp?v=3",
        alt: "RenewSys Architectural All-Black - Seamless Frame Edge Detail",
        label: "Surface Detail",
      },
    ],
    benefits: [
      {
        title: "Full Matte Black Design",
        description: "Zero visible silver gridlines create a sleek, uniform dark appearance across residential rooflines.",
        iconName: "Sparkles",
      },
      {
        title: "Compact Villa Footprint",
        description: "Dimensions of 1762 x 1134 mm make it easy to design aesthetically pleasing arrays on segmented roofs.",
        iconName: "CheckCircle2",
      },
      {
        title: "Lightweight 21 kg Construction",
        description: "Reduces dead load on residential trusses and simplifies handling during rooftop hoisting.",
        iconName: "Award",
      },
      {
        title: "15-Year Product Warranty",
        description: "Backed by an extended 15-year comprehensive manufacturer product warranty.",
        iconName: "ShieldCheck",
      },
    ],
    specs: {
      powerRange: "440W - 460W",
      cellTechnology: "N-Type TOPCon All-Black Monofacial",
      numberOfCells: "108 (6 x 18) Half-Cut Cells",
      moduleEfficiency: "22.1%",
      dimensions: "1762 x 1134 x 30 mm",
      weight: "21.0 kg",
      frontRearGlass: "3.2 mm Anti-Reflective Low-Iron Tempered Glass + Matte Black Backsheet",
      frame: "Anodized Architectural Matte Black Aluminum Alloy (30 mm)",
      junctionBox: "IP68 rated with 3 bypass diodes",
      operatingTemperature: "-40°C to +85°C",
      temperatureCoefficient: "-0.30% / °C",
      maxSystemVoltage: "1500V DC (IEC)",
    },
    warranty: {
      product: "15-Year Manufacturer Workmanship Warranty",
      performance: "25-Year Linear Power Warranty",
      details: [
        "Year 1 degradation capped at ≤ 1.0%",
        "Year 2–25 annual linear degradation strictly ≤ 0.45%",
        "Guaranteed retained output of ≥ 88.0% at Year 25",
      ],
    },
    bestFor: {
      title: "Luxury Bungalows, Modern Villas & Architectural Residences",
      description: "Engineered specifically for luxury residences, boutique hotels, and pitched roofs where visual elegance is paramount.",
      useCases: [
        "Luxury bungalows and modern villas with visible rooflines",
        "Resorts, heritage hotels, and boutique stays",
        "Aesthetic-priority urban homes and modern penthouses",
      ],
    },
    subsidyInfo: {
      maxSubsidy: "Standard net-metering benefits apply",
      note: "Note: All-black series modules may use imported cell components and are primarily chosen for aesthetic installations rather than DCR-mandated subsidy schemes.",
      steps: [
        {
          step: 1,
          title: "Architectural 3D Layout",
          desc: "Array design aligned precisely with roof geometry and aesthetic sightlines.",
        },
        {
          step: 2,
          title: "Concealed Conduit Installation",
          desc: "Mechanical mounting with black anodized clamps and concealed cable routing.",
        },
        {
          step: 3,
          title: "Net-Meter Commissioning",
          desc: "DISCOM synchronization for seamless bi-directional grid export.",
        },
      ],
    },
    datasheetUrl: "/datasheets/renewsys-all-black-450w.pdf",
    faqs: [
      {
        question: "Why choose an all-black solar panel?",
        answer: "All-black solar panels eliminate the prominent silver gridlines of traditional modules, providing a minimalist dark appearance that elevates your home's exterior design.",
      },
      {
        question: "Do all-black panels run hotter than traditional panels?",
        answer: "While black surfaces absorb slightly more heat, modern N-Type TOPCon cell chemistry and a low temperature coefficient of -0.30%/°C keep power output stable.",
      },
    ],
    roiNote: "Estimated 3.8 to 4.5 years payback based on typical residential tariffs and luxury residential consumption.",
  },
]

export function getAllPanels(): SolarPanelDetail[] {
  return SOLAR_PANELS
}

export function getPanelBySlug(slug: string): SolarPanelDetail | undefined {
  const s = slug.toLowerCase().trim()
  return SOLAR_PANELS.find((p) => p.slug === s || (p.aliases && p.aliases.includes(s)))
}
