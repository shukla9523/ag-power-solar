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
  badge: string
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
    tagline: "India's highest yielding dual-glass solar module engineered for up to 25% extra generation from rear reflection.",
    badge: "Highest Efficiency",
    customerBenefit: {
      tag: "Up to 90% Bill Savings",
      highlight: "+25% Extra Generation from Rear Glass",
      points: [
        "Cuts monthly electricity bills by up to 90%",
        "Direct PM Surya Ghar subsidy eligible (up to ₹78,000)",
        "30-Year linear power warranty guarantees long-term output",
        "Dual-glass structure survives 150 km/h wind & hailstorms",
      ],
    },
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
      note: "Subsidy eligibility aur amount government rules par depend karta hai. DCR compliance aur DISCOM net-metering approval zaroori hota hai.",
      steps: [
        {
          step: 1,
          title: "National Portal Application",
          desc: "AG POWER team aapke DISCOM consumer account ke saath PM Surya Ghar portal par application submit karti hai.",
        },
        {
          step: 2,
          title: "Feasibility & Turnkey Installation",
          desc: "DISCOM feasibility clearance ke baad 2–3 din me Waaree Tier-1 modules aur certified inverter install ho jate hain.",
        },
        {
          step: 3,
          title: "DISCOM Inspection & Net-Meter",
          desc: "Bijli vibhag ke engineers site inspection karke bidirectional net-meter synchronize karte hain.",
        },
        {
          step: 4,
          title: "Direct Bank Subsidy Credit",
          desc: "Commissioning certificate upload hone ke 30 din ke andar subsidy sidhe aapke bank account me transfer ho jati hai.",
        },
      ],
    },
    datasheetUrl: "/datasheets/waaree-arka-topcon-550w.pdf",
    faqs: [
      {
        question: "Is panel ki approx price kya hoti hai?",
        answer: "Waaree N-Type TOPCon bifacial modules ka complete turnkey rooftop installation (panels, structure, inverter, earthing, net-metering) typically ₹48 se ₹54 per Watt ke range me aata hai. PM Surya Ghar subsidy ke baad 3kW system par ₹78,000 tak ki direct discount saving milti hai.",
      },
      {
        question: "Installation me kitna time lagta hai?",
        answer: "Mechanical aur electrical installation hamari certified EPC team sirf 2 se 3 din me poora kar leti hai. DISCOM approval aur net-meter sync milakar complete end-to-end process 3 se 4 hafte me ready ho jata hai.",
      },
      {
        question: "Maintenance kaise aur kitni karni padti hai?",
        answer: "Dual-glass design hone ki wajah se ye dust-resistant hai. Har 15 din me saaf paani se terrace pipe ke zariye panel dhona kaafi hota hai. Isme koi moving mechanical parts nahi hote, isliye running maintenance lagbhag zero hoti hai.",
      },
      {
        question: "PM Surya Ghar subsidy is panel par kaise milti hai?",
        answer: "Waaree ke ye modules 100% ALMM approved aur DCR compliant hain, isliye ye PM Surya Ghar Muft Bijli Yojana ke liye poori tarah eligible hain. 1kW par ₹30,000, 2kW par ₹60,000 aur 3kW ya usse upar par maximum ₹78,000 direct bank subsidy milti hai.",
      },
      {
        question: "Warranty claim ka process kya hai?",
        answer: "AG POWER provides single-window local support in Jaipur and Rajasthan. Warranty claim hone par hamare engineer 24 se 48 ghante me on-site aakar test karte hain aur manufacturer se direct replacement facilitate karate hain.",
      },
      {
        question: "Bifacial ka kya fayda hai aur Rajasthan ki garmi me kaisa perform karega?",
        answer: "Bifacial panel peeche ke glass se bhi reflected light capture karta hai, jisse 15% se 25% zyada units banti hain. Iska temperature coefficient -0.30%/°C hai, jo Rajasthan ki 45°C+ summer heat me bhi normal panels se kaafi behtar output deta hai.",
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
    customerBenefit: {
      tag: "3.2-Year Fast ROI",
      highlight: "Lowest Capital Cost per Watt in India",
      points: [
        "Fastest payback period with immediate grid bill savings",
        "Full DISCOM net-metering & ALMM Tier-1 compliance",
        "Half-cut multi-busbar cells minimize tree & building shadow loss",
        "25-Year performance warranty backed by Adani Solar",
      ],
    },
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
      note: "Subsidy eligibility aur amount government rules par depend karta hai. DCR modules hona zaroori hota hai.",
      steps: [
        {
          step: 1,
          title: "Registration on Portal",
          desc: "AG POWER customer support electricity bill ke basis par direct portal registration karti hai.",
        },
        {
          step: 2,
          title: "Turnkey Installation",
          desc: "Adani Tier-1 modules standard RCC roof mounting brackets ke saath 2 din me install ho jate hain.",
        },
        {
          step: 3,
          title: "Discom Net-Meter Sync",
          desc: "Bijli Nigam site visit karke bi-directional net-meter sync karta hai.",
        },
        {
          step: 4,
          title: "Bank Account Subsidy",
          desc: "Centre ki taraf se approved subsidy direct DBT ke roop me aapke bank me jama ho jati hai.",
        },
      ],
    },
    datasheetUrl: "/datasheets/adani-shine-mono-perc-540w.pdf",
    faqs: [
      {
        question: "Is panel ki approx price kya hoti hai?",
        answer: "Adani Mono PERC modules sabse economical aur value-for-money hote hain. Complete turnkey installation approx ₹45 se ₹49 per Watt me ho jata hai. PM Surya Ghar subsidy ke baad 3kW plant par net customer cost kaafi kam padti hai.",
      },
      {
        question: "Installation me kitna time lagta hai?",
        answer: "Standard residential rooftop par installation sirf 2 din me complete ho jati hai. DISCOM paperwork aur meter installation ke saath poora system 3 hafte me chal padta hai.",
      },
      {
        question: "Maintenance me kya karna hota hai?",
        answer: "Adani Mono PERC panels par anti-reflective tempered glass hota hai. Mahine me do baar subah ya shaam ke samay saaf paani se wash karna regular generation ke liye kaafi hai.",
      },
      {
        question: "Kya is panel par PM Surya Ghar subsidy milti hai?",
        answer: "Haan, bilkul. Adani Solar ke DCR certified Mono PERC panels PM Surya Ghar scheme ke under 100% approved hain. Up to ₹78,000 tak ki direct bank subsidy milti hai.",
      },
      {
        question: "Warranty claim kaise hota hai?",
        answer: "Adani Solar ka service network poore Bharat me faila hai. Kisi bhi issue ke liye AG POWER helpline par call karein, hamari team inspection aur replacement claim handle karti hai.",
      },
      {
        question: "Rajasthan ki garmi me iska performance kaisa rehta hai?",
        answer: "Mono PERC technology Indian conditions ke liye time-tested hai. -0.35%/°C temperature coefficient ke sath ye 42°C-46°C summer heat me bhi consistent units generate karta hai.",
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
    customerBenefit: {
      tag: "Luxury Villa Aesthetics",
      highlight: "Seamless Full Matte Black Finish",
      points: [
        "Blends seamlessly with modern rooftop architecture",
        "Superior generation even during extreme 45°C+ summer heat",
        "Backed by 25-Year Tata Power reliability & trust",
        "Anti-dust hydrophobic coating reduces cleaning effort",
      ],
    },
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
      note: "Subsidy eligibility aur amount government rules par depend karta hai. DCR compliance status verify karna hota hai.",
      steps: [
        {
          step: 1,
          title: "Site Survey & 3D Design",
          desc: "Hamare senior solar architect terrace ka aesthetic 3D shadow layout design karte hain.",
        },
        {
          step: 2,
          title: "Precision Installation",
          desc: "Tata All-Black panels concealed wiring aur concealed structural clamps ke saath lagaye jate hain.",
        },
        {
          step: 3,
          title: "DISCOM Approval & Sync",
          desc: "DISCOM inspection aur net-meter testing execute ki jaati hai.",
        },
        {
          step: 4,
          title: "Subsidy Disbursement",
          desc: "National portal ke direct clearance ke zariye subsidy direct bank account me transfer hoti hai.",
        },
      ],
    },
    datasheetUrl: "/datasheets/tata-power-all-black-450w.pdf",
    faqs: [
      {
        question: "Is panel ki approx price kya hoti hai?",
        answer: "Tata Power Architectural All-Black series premium architectural hardware hai. Iska complete turnkey installation approximately ₹52 se ₹58 per Watt aata hai, jisme aesthetic concealed mounting structure aur premium cabling shamil rehti hai.",
      },
      {
        question: "Installation me kitna time lagta hai?",
        answer: "Aesthetic finish aur concealed conduit wiring ke karan installation me 3 se 4 din lagte hain. DISCOM approvals ke sath 3–4 hafte me plant live ho jata hai.",
      },
      {
        question: "Kya black panel zyada garam hokar efficiency kam karta hai?",
        answer: "Nahi. Isme latest N-Type silicon technology aur -0.29%/°C ka ultra-low temperature coefficient hai, jo normal panels ke muqable high heat me bhi behtar performance deta hai.",
      },
      {
        question: "Is panel par PM Surya Ghar subsidy milti hai?",
        answer: "Haan, Tata Power ke DCR series panels par central PM Surya Ghar subsidy 100% applicable hai (up to ₹78,000 tak).",
      },
      {
        question: "Tata Power warranty claim kaise hota hai?",
        answer: "Tata Power ka pan-India corporate support hai aur AG POWER direct authorized EPC partner hai. Direct local engineer visit aur swift resolution milta hai.",
      },
      {
        question: "Rajasthan ki garmi aur dhool me ye kaisa rahega?",
        answer: "Iske tempered glass par hydrophobic anti-dust coating hai, jisse dhool chipakti nahi hai aur aasan paani ke spray se panel chamak jata hai.",
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
