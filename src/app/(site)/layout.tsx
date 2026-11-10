/**
 * Purpose: public site shell (header + footer). The homepage FAQ accordion in the footer
 * receives the same FAQ list the homepage FAQPage schema uses.
 */
import Header from "@modules/layout/components/header/Header"
import Footer from "@modules/layout/templates/footer"
import { getSeoSetting } from "@lib/data/seo"
import { getPageFaqs } from "@lib/data/page-faqs"

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const homeSeo = await getSeoSetting("homepage").catch(() => null)
  const homeFaqs = getPageFaqs("homepage", homeSeo)

  return (
    <>
      <Header />
      {children}
      <Footer homeFaqs={homeFaqs} />
    </>
  )
}
