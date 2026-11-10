/**
 * Purpose: site footer entry (server component, rendered by the (site) layout on every page).
 *
 * Both footer variants are server-rendered; FooterSwitch (client) picks the EDITZ footer on EDITZ
 * paths and the main footer elsewhere, exactly as the former all-client footer did. Only the
 * accordions and pathname checks ship as client JavaScript.
 */
import EditzFooter from "./EditzFooter"
import MainFooter from "./MainFooter"
import { FooterSwitch } from "./FooterSwitch"

export default function Footer({
  isEditzProp,
  homeFaqs,
}: {
  isEditzProp?: boolean
  homeFaqs?: { question: string; answer: string }[]
}) {
  return (
    <FooterSwitch
      isEditzProp={isEditzProp}
      editz={<EditzFooter />}
      main={<MainFooter homeFaqs={homeFaqs} />}
    />
  )
}
