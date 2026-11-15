import { Metadata } from "next"
import JsonLd from "@modules/common/components/json-ld"
import { getBlogPosts } from "@lib/data/blog-posts"
import { getSeoSetting } from "@lib/data/seo"
import { resolveCollectionData, buildMetadataFromResolved } from "@lib/schema/resolvers"
import { inter } from "@lib/fonts"
import { getPageFaqs } from "@lib/data/page-faqs"
import PageFaqSection from "@modules/common/components/page-faq-section"
import BlogListingClient from "./_components/BlogListingClient"

export const revalidate = 60

export async function generateMetadata(): Promise<Metadata> {
  const [blogPosts, seoSetting] = await Promise.all([
    getBlogPosts(),
    getSeoSetting("blog").catch(() => null),
  ])
  const resolved = resolveCollectionData({
    section: "blog",
    items: blogPosts,
    seoSetting,
  })
  return buildMetadataFromResolved(resolved)
}

export default async function BlogPage() {
  const [blogPosts, seoSetting] = await Promise.all([
    getBlogPosts(),
    getSeoSetting("blog").catch(() => null),
  ])

  const [featured, ...rest] = blogPosts

  if (!featured) {
    return (
      <main className={`flex min-h-[60vh] items-center justify-center bg-ivory ${inter.className}`}>
        <div className="text-center">
          <h1 className="sr-only">Solar Insights & Engineering Guides</h1>
          <p className="text-charcoal/60 text-lg">No solar articles published yet.</p>
        </div>
      </main>
    )
  }

  const popular = blogPosts.slice(0, 5)
  const faqs = getPageFaqs("blog", seoSetting)

  return (
    <main className={`relative overflow-hidden bg-ivory pt-12 pb-20 lg:pt-16 lg:pb-24 ${inter.className}`}>
      <JsonLd
        type="collection"
        section="blog"
        items={blogPosts}
        seoSetting={seoSetting}
      />

      <BlogListingClient initialPosts={blogPosts} />

      {faqs && faqs.length > 0 && (
        <div className="mt-16">
          <PageFaqSection
            faqs={faqs}
            title="Solar Knowledge FAQs"
            subtitle="Answers to common questions regarding our solar engineering research, subsidy guides, and technology comparisons."
          />
        </div>
      )}
    </main>
  )
}
