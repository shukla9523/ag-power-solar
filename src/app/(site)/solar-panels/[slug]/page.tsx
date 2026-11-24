import { Metadata } from "next"
import { notFound } from "next/navigation"
import { SOLAR_PANELS, getPanelBySlug } from "@data/panels"
import PanelDetailClient from "./_components/PanelDetailClient"
import { serializeJsonLd } from "@lib/schema/serialize"

interface PageProps {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return SOLAR_PANELS.map((panel) => ({
    slug: panel.slug,
  }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const panel = getPanelBySlug(slug)

  if (!panel) {
    return {
      title: "Solar Panel Not Found | AG POWER",
      description: "The requested solar panel model could not be found.",
    }
  }

  const title = `${panel.brand} ${panel.name} (${panel.wattageRange}) | AG POWER`
  const description = `${panel.tagline} Tier-1 ALMM certified specifications, warranty details, and turnkey installation by AG POWER.`
  const canonicalUrl = `https://www.agpower.in/solar-panels/${panel.slug}`

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: "AG POWER",
      images: [
        {
          url: panel.images[0].src,
          width: 1200,
          height: 630,
          alt: panel.images[0].alt,
        },
      ],
      type: "website",
      locale: "en_IN",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [panel.images[0].src],
    },
  }
}

export default async function SolarPanelDetailPage({ params }: PageProps) {
  const { slug } = await params
  const panel = getPanelBySlug(slug)

  if (!panel) {
    notFound()
  }

  const relatedPanels = SOLAR_PANELS.filter((p) => p.slug !== slug)

  // Product, BreadcrumbList, and FAQPage JSON-LD Schema (clean, no fake aggregate offers)
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Product",
        "@id": `https://www.agpower.in/solar-panels/${panel.slug}/#product`,
        name: panel.name,
        brand: {
          "@type": "Brand",
          name: panel.brand,
        },
        description: panel.tagline,
        image: `https://www.agpower.in${panel.images[0].src}`,
        category: "Solar Photovoltaic Modules",
      },
      {
        "@type": "BreadcrumbList",
        "@id": `https://www.agpower.in/solar-panels/${panel.slug}/#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: "https://www.agpower.in/",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Solar Panels",
            item: "https://www.agpower.in/solar-panels",
          },
          {
            "@type": "ListItem",
            position: 3,
            name: panel.name,
            item: `https://www.agpower.in/solar-panels/${panel.slug}`,
          },
        ],
      },
      {
        "@type": "FAQPage",
        "@id": `https://www.agpower.in/solar-panels/${panel.slug}/#faq`,
        mainEntity: panel.faqs.slice(0, 5).map((f) => ({
          "@type": "Question",
          name: f.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: f.answer,
          },
        })),
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(structuredData) }}
      />
      <main className="min-h-screen bg-white">
        <PanelDetailClient panel={panel} relatedPanels={relatedPanels} />
      </main>
    </>
  )
}
