import { Metadata } from "next"
import Link from "next/link"
import { getSeoSetting } from "@lib/data/seo"
import { getPageMetaDefault } from "@lib/schema/page-defaults"
import { getPageFaqs } from "@lib/data/page-faqs"
import { getProductContent } from "@lib/data/product-pages"
import { resolveLegalPageData, buildMetadataFromResolved } from "@lib/schema/resolvers"
import JsonLd from "@modules/common/components/json-ld"
import PageFaqSection from "@modules/common/components/page-faq-section"
import GoogleFormContact from "@modules/contact/components/google-form-contact"

export const revalidate = 60

export async function generateMetadata(): Promise<Metadata> {
  const seoSetting = await getSeoSetting("blog-ai").catch(() => null)
  const defaultMeta = getPageMetaDefault("blog-ai")!
  const resolved = resolveLegalPageData(
    "blog-ai",
    defaultMeta.title,
    defaultMeta.description,
    seoSetting
  )
  return buildMetadataFromResolved(resolved)
}

export default async function BlogAiPage() {
  // Texts = code defaults + admin overrides (Admin -> Products -> Blog AI).
  const [seoSetting, content] = await Promise.all([
    getSeoSetting("blog-ai").catch(() => null),
    getProductContent("blog-ai"),
  ])
  const { hero, leadForm } = content
  const defaultMeta = getPageMetaDefault("blog-ai")!
  const faqs = getPageFaqs("blog-ai", seoSetting)

  return (
    <main className="flex flex-col items-center justify-center min-h-[70vh] bg-white text-slate-900 px-6 py-12 text-center animate-in fade-in duration-500">
      <JsonLd
        type="page"
        slug="blog-ai"
        title={defaultMeta.title}
        description={defaultMeta.description}
        seoSetting={seoSetting}
      />
      <div className="max-w-xl mx-auto space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-50 border border-pink-100 text-pink-600 text-xs font-semibold uppercase tracking-wider">
          {hero.badge}
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 leading-none">
          {hero.titlePrefix}{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-violet-600">{hero.titleAccent}</span>
        </h1>
        <p className="text-lg text-slate-600 font-medium max-w-lg mx-auto">
          {hero.description}
        </p>
        <div className="pt-6">
          <Link
            href={hero.ctaHref}
            className="inline-flex items-center justify-center px-6 py-3 rounded-full text-sm font-semibold bg-slate-900 hover:bg-slate-800 text-white transition-colors"
          >
            {hero.ctaLabel}
          </Link>
        </div>
      </div>
      {leadForm.enabled && (
        <section id="lead-form" className="w-full max-w-4xl mx-auto mt-16 text-left">
          {(leadForm.heading || leadForm.description) && (
            <div className="text-center max-w-xl mx-auto">
              {leadForm.heading && (
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">{leadForm.heading}</h2>
              )}
              {leadForm.description && <p className="mt-3 text-base text-slate-600 font-medium">{leadForm.description}</p>}
            </div>
          )}
          <GoogleFormContact source="blog-ai" />
        </section>
      )}
      {faqs && faqs.length > 0 && (
        <div className="w-full max-w-4xl mx-auto mt-16 text-left">
          <PageFaqSection
            faqs={faqs}
            title="Blog AI FAQs"
            subtitle="Everything you need to know about Mommantum AI blog automation, editorial pipelines, and LLM workflows."
          />
        </div>
      )}
    </main>
  )
}
