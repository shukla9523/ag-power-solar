/**
 * Central Image Registry for AG POWER Solar Solutions
 * 
 * All panel product galleries, blog post covers, project showcases, and team photos
 * are centrally defined here. To replace any photo in the future, simply update the file
 * in public/images/... or change the path in this configuration.
 */

export interface ProductGalleryItem {
  src: string
  alt: string
  caption: string
  type: "front" | "back" | "rooftop" | "closeup" | "mounting"
}

export interface PanelImageConfig {
  slug: string
  brand: string
  modelName: string
  cardImage: string
  cardAlt: string
  gallery: ProductGalleryItem[]
}

export const PANEL_IMAGE_CONFIGS: Record<string, PanelImageConfig> = {
  "waaree-arka-topcon-550w": {
    slug: "waaree-arka-topcon-550w",
    brand: "Waaree",
    modelName: "Arka Series N-Type TOPCon Dual-Glass Bifacial",
    cardImage: "/images/panels/waaree-arka-topcon-550w/front.webp",
    cardAlt: "Waaree Arka Series N-Type TOPCon dual-glass bifacial solar panel array",
    gallery: [
      {
        src: "/images/panels/waaree-arka-topcon-550w/front.webp",
        alt: "Waaree Arka N-Type TOPCon bifacial module front view",
        caption: "Front view of N-Type TOPCon 144 half-cut bifacial dual-glass module",
        type: "front"
      },
      {
        src: "/images/panels/waaree-arka-topcon-550w/back.webp",
        alt: "Waaree Arka module rear IP68 junction box and dual-glass bifacial backsheet",
        caption: "IP68 rated junction box with bypass diodes and MC4 connectors",
        type: "back"
      },
      {
        src: "/images/panels/waaree-arka-topcon-550w/rooftop.webp",
        alt: "Waaree Arka solar panels installed on residential rooftop array in India",
        caption: "Elevated rooftop installation engineered for high wind load and tropical heat",
        type: "rooftop"
      },
      {
        src: "/images/panels/waaree-arka-topcon-550w/closeup.webp",
        alt: "Macro close-up of Waaree N-Type TOPCon multi-busbar solar cell",
        caption: "High-efficiency silicon cell wafer with 16BB multi-busbar gridlines",
        type: "closeup"
      },
      {
        src: "/images/panels/waaree-arka-topcon-550w/mounting.webp",
        alt: "Commercial shed solar installation with Waaree TOPCon modules",
        caption: "Commercial metal-shed mounting structure alignment",
        type: "mounting"
      }
    ]
  },

  "adani-shine-mono-perc-540w": {
    slug: "adani-shine-mono-perc-540w",
    brand: "Adani Solar",
    modelName: "Shine Series Multi-Busbar Mono PERC Module",
    cardImage: "/images/panels/adani-shine-mono-perc-540w/front.webp",
    cardAlt: "Adani Solar Shine Series multi-busbar mono PERC module rooftop array",
    gallery: [
      {
        src: "/images/panels/adani-shine-mono-perc-540w/front.webp",
        alt: "Adani Solar Shine Series Mono PERC module front view",
        caption: "Frontal view of 144 half-cut monocrystalline PERC solar module",
        type: "front"
      },
      {
        src: "/images/panels/adani-shine-mono-perc-540w/back.webp",
        alt: "Adani Solar module backsheet, aluminum frame, and split junction box",
        caption: "Weather-resistant backsheet with anodized aluminum frame structure",
        type: "back"
      },
      {
        src: "/images/panels/adani-shine-mono-perc-540w/rooftop.webp",
        alt: "Adani Solar rooftop photovoltaic installation generating residential solar energy",
        caption: "Completed 3.3 kW residential rooftop solar array in Rajasthan",
        type: "rooftop"
      },
      {
        src: "/images/panels/adani-shine-mono-perc-540w/closeup.webp",
        alt: "Macro detail of Adani Mono PERC half-cut cell interconnection",
        caption: "Precision laser-cut half-cell technology minimizing resistive losses",
        type: "closeup"
      },
      {
        src: "/images/panels/adani-shine-mono-perc-540w/mounting.webp",
        alt: "Ground mount solar installation with Adani Solar PV modules",
        caption: "Fixed-tilt ground mounting structure aligned for maximum solar irradiance",
        type: "mounting"
      }
    ]
  },

  "vikram-somera-topcon-575w": {
    slug: "vikram-somera-topcon-575w",
    brand: "Vikram Solar",
    modelName: "SOMERA Grand Series N-Type TOPCon Bifacial",
    cardImage: "/images/panels/vikram-somera-topcon-575w/front.webp",
    cardAlt: "Vikram Solar SOMERA Grand Series 575W N-Type TOPCon bifacial module",
    gallery: [
      {
        src: "/images/panels/vikram-somera-topcon-575w/front.webp",
        alt: "Vikram Solar SOMERA Grand Series module front view",
        caption: "Front view of 575W-590W N-Type TOPCon bifacial solar panel",
        type: "front"
      },
      {
        src: "/images/panels/vikram-somera-topcon-575w/back.webp",
        alt: "Vikram Solar split junction box and bifacial rear glass",
        caption: "Dual-glass encapsulation ensuring zero PID and anti-reflective durability",
        type: "back"
      },
      {
        src: "/images/panels/vikram-somera-topcon-575w/rooftop.webp",
        alt: "Rooftop solar installation on Indian homes under PM Surya Ghar",
        caption: "Indian residential terrace installation with elevated GI mounting",
        type: "rooftop"
      },
      {
        src: "/images/panels/vikram-somera-topcon-575w/closeup.webp",
        alt: "Macro detail of Vikram Solar TOPCon cell busbars",
        caption: "Low temperature coefficient cell design for hot Indian summer performance",
        type: "closeup"
      },
      {
        src: "/images/panels/vikram-somera-topcon-575w/mounting.webp",
        alt: "Commercial shed mounting structure with Vikram Solar modules",
        caption: "Industrial rooftop array on prefabricated steel shed structure",
        type: "mounting"
      }
    ]
  },

  "tata-power-mono-perc-545w": {
    slug: "tata-power-mono-perc-545w",
    brand: "Tata Power Solar",
    modelName: "TP Series High Efficiency Half-Cell Mono PERC",
    cardImage: "/images/panels/tata-power-mono-perc-545w/front.webp",
    cardAlt: "Tata Power Solar TP Series 545W Mono PERC half-cell module",
    gallery: [
      {
        src: "/images/panels/tata-power-mono-perc-545w/front.webp",
        alt: "Tata Power Solar TP Series module front view",
        caption: "Front view of 545W-550W high efficiency half-cell Mono PERC panel",
        type: "front"
      },
      {
        src: "/images/panels/tata-power-mono-perc-545w/back.webp",
        alt: "Tata Power Solar module IP68 junction box and aluminum anodized frame",
        caption: "Heavy-duty 35mm anodized aluminum frame rated for 5400 Pa snow load",
        type: "back"
      },
      {
        src: "/images/panels/tata-power-mono-perc-545w/rooftop.webp",
        alt: "Tata Power Solar residential rooftop installation on Indian villa",
        caption: "Grid-tied rooftop solar power plant installed on residential property",
        type: "rooftop"
      },
      {
        src: "/images/panels/tata-power-mono-perc-545w/closeup.webp",
        alt: "Close-up of Tata Power Solar monocrystalline silicon cells",
        caption: "100% EL inspected silicon cells ensuring zero micro-cracks",
        type: "closeup"
      },
      {
        src: "/images/panels/tata-power-mono-perc-545w/mounting.webp",
        alt: "Commercial installation with Tata Power Solar modules",
        caption: "Commercial and institutional rooftop solar array",
        type: "mounting"
      }
    ]
  },

  "goldi-heloc-plus-topcon-550w": {
    slug: "goldi-heloc-plus-topcon-550w",
    brand: "Goldi Solar",
    modelName: "HELOC Plus TOPCon Bifacial Glass-to-Glass",
    cardImage: "/images/panels/goldi-heloc-plus-topcon-550w/front.webp",
    cardAlt: "Goldi Solar HELOC Plus 550W TOPCon bifacial glass-to-glass module",
    gallery: [
      {
        src: "/images/panels/goldi-heloc-plus-topcon-550w/front.webp",
        alt: "Goldi Solar HELOC Plus module front view",
        caption: "Front view of HELOC Plus N-Type TOPCon bifacial glass-to-glass panel",
        type: "front"
      },
      {
        src: "/images/panels/goldi-heloc-plus-topcon-550w/back.webp",
        alt: "Goldi Solar rear dual-glass bifacial construction and junction box",
        caption: "Dual 2.0 mm semi-tempered glass back with IP68 waterproof junction box",
        type: "back"
      },
      {
        src: "/images/panels/goldi-heloc-plus-topcon-550w/rooftop.webp",
        alt: "Goldi Solar rooftop photovoltaic installation in residential housing",
        caption: "Rooftop solar installation delivering high kWh yield in sunny climate",
        type: "rooftop"
      },
      {
        src: "/images/panels/goldi-heloc-plus-topcon-550w/closeup.webp",
        alt: "Close-up of Goldi Solar N-Type TOPCon 16-busbar cell technology",
        caption: "16BB cell architecture with Class-A fire resistance rating",
        type: "closeup"
      },
      {
        src: "/images/panels/goldi-heloc-plus-topcon-550w/mounting.webp",
        alt: "Ground mount solar installation with Goldi Solar bifacial panels",
        caption: "Ground-mount array capturing up to 80% bifacial albedo light from rear",
        type: "mounting"
      }
    ]
  },

  "architectural-all-black-450w": {
    slug: "architectural-all-black-450w",
    brand: "ReNewSys",
    modelName: "Architectural Ultra All-Black Series",
    cardImage: "/images/panels/architectural-all-black-450w/front.webp",
    cardAlt: "ReNewSys Architectural Ultra All-Black 450W solar module",
    gallery: [
      {
        src: "/images/panels/architectural-all-black-450w/front.webp",
        alt: "ReNewSys Architectural Ultra All-Black module front view",
        caption: "Full matte-black aesthetic with zero visible silver ribbons",
        type: "front"
      },
      {
        src: "/images/panels/architectural-all-black-450w/back.webp",
        alt: "ReNewSys all-black module rear split junction box",
        caption: "Black anodized frame with integrated split bypass junction enclosure",
        type: "back"
      },
      {
        src: "/images/panels/architectural-all-black-450w/rooftop.webp",
        alt: "Architectural all-black solar panel rooftop installation on luxury villa",
        caption: "Premium residential villa installation seamlessly blending with roof architecture",
        type: "rooftop"
      },
      {
        src: "/images/panels/architectural-all-black-450w/closeup.webp",
        alt: "Close-up of seamless black backsheet and dark silicon cell wafer",
        caption: "Uniform dark silicon appearance engineered for designer residences",
        type: "closeup"
      },
      {
        src: "/images/panels/architectural-all-black-450w/mounting.webp",
        alt: "Flush rooftop mounting system for architectural all-black solar panels",
        caption: "Low-profile mounting brackets for pitched and tiled roofs",
        type: "mounting"
      }
    ]
  }
}

/**
 * Get the central card image for any panel slug
 */
export function getPanelCardImage(slug: string): string {
  const config = PANEL_IMAGE_CONFIGS[slug]
  if (config) return config.cardImage
  return `/images/panels/${slug}/front.webp?v=4`
}

/**
 * Get the central 5-image gallery for any panel slug
 */
export function getPanelGallery(slug: string): ProductGalleryItem[] {
  const config = PANEL_IMAGE_CONFIGS[slug]
  if (config) return config.gallery
  return [
    { src: `/images/panels/${slug}/front.webp?v=4`, alt: "Solar panel front view", caption: "Front view", type: "front" },
    { src: `/images/panels/${slug}/back.webp?v=4`, alt: "Solar panel junction box and frame", caption: "Rear frame and junction box", type: "back" },
    { src: `/images/panels/${slug}/rooftop.webp?v=4`, alt: "Rooftop solar installation", caption: "Rooftop array", type: "rooftop" },
    { src: `/images/panels/${slug}/closeup.webp?v=4`, alt: "Solar cell close up", caption: "Cell closeup", type: "closeup" },
    { src: `/images/panels/${slug}/mounting.webp?v=4`, alt: "Mounting structure", caption: "Mounting structure", type: "mounting" },
  ]
}

/**
 * Central blog post cover images
 */
export const BLOG_COVER_IMAGES: Record<string, string> = {
  "pm-surya-ghar-muft-bijli-yojana-guide": "/images/blog/real-solar-pm-surya-ghar.webp?v=2026",
  "topcon-vs-mono-perc-solar-panels": "/images/blog/real-solar-topcon-technology.webp?v=2026",
  "residential-solar-roi-payback-india": "/images/blog/real-solar-residential-roi.webp?v=2026",
  "commercial-industrial-solar-benefits": "/images/blog/real-solar-commercial-plant.webp?v=2026",
  "solar-for-apartment-complexes-housing-societies": "/images/blog/real-solar-housing-society.webp?v=2026",
  "solar-for-housing-societies-slashing-maintenance": "/images/blog/real-solar-housing-society.webp?v=2026",
  "solar-energy-basics-on-grid-inverters-net-metering": "/images/blog/real-solar-net-metering.webp?v=2026",
  "how-grid-tie-solar-system-works": "/images/blog/real-solar-net-metering.webp?v=2026",
  "rooftop-solar-installation-step-by-step-process": "/images/blog/real-solar-installation-process.webp?v=2026",
  "complete-solar-installation-process": "/images/blog/real-solar-installation-process.webp?v=2026",
  "solar-panel-cleaning-maintenance-guide": "/images/blog/real-solar-panel-cleaning.webp?v=2026",
  "solar-net-metering-guide-india": "/images/blog/real-solar-net-metering.webp?v=2026",
  "solar-maintenance-cleaning-guide": "/images/blog/real-solar-panel-cleaning.webp?v=2026",
  "on-grid-vs-hybrid-solar-systems": "/images/blog/real-solar-housing-society.webp?v=2026",
  "rooftop-solar-installation-step-by-step": "/images/blog/real-solar-installation-process.webp?v=2026"
}
