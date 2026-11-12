import { Metadata } from "next"
import { getSeoSetting } from "@lib/data/seo"
import { getEditzFaqs } from "@lib/data/page-faqs"
import { getProductContent } from "@lib/data/product-pages"
import { resolveEditzData, buildMetadataFromResolved } from "@lib/schema/resolvers"
import JsonLd from "@modules/common/components/json-ld"
import Navbar from "@modules/editz/components/Navbar"
import Hero from "@modules/editz/components/Hero"
import Services from "@modules/editz/components/Services"
import BrandMarquee from "@modules/editz/components/BrandMarquee"
import Benefits from "@modules/editz/components/Benefits"
import Projects from "@modules/editz/components/Projects"
import Audience from "@modules/editz/components/Audience"
import Process from "@modules/editz/components/Process"
import Testimonials from "@modules/editz/components/Testimonials"
import FAQ from "@modules/editz/components/FAQ"
import CTA from "@modules/editz/components/CTA"
import Footer from "@modules/editz/components/Footer"

export async function getEditzMetadata(): Promise<Metadata> {
  const seoSetting = await getSeoSetting("editz").catch(() => null)
  const resolved = resolveEditzData(seoSetting)
  return buildMetadataFromResolved(resolved)
}

export default async function EditzPageContent() {
  // Content = code defaults + admin overrides (Admin -> Products); FAQs stay on the SEO meta object.
  const [seoSetting, content] = await Promise.all([
    getSeoSetting("editz").catch(() => null),
    getProductContent("editz"),
  ])

  return (
    <div className="min-h-screen flex flex-col bg-editz-cream text-editz-black selection:bg-editz-red selection:text-white">
      <JsonLd type="editz" seoSetting={seoSetting} />
      <Navbar />
      <main className="flex-grow">
        <Hero content={content.hero} marqueeItems={content.marquee.items} />
        <Services content={content.services} />
        <BrandMarquee content={content.brands} />
        <Benefits content={content.benefits} />
        <Projects content={content.projects} />
        <Audience content={content.audience} />
        <Process content={content.process} />
        <Testimonials content={content.testimonials} />
        <FAQ items={getEditzFaqs(seoSetting)} />
        <CTA content={content.cta} />
      </main>
      <Footer />
    </div>
  )
}

