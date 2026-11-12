import { Metadata } from "next"
import { notFound } from "next/navigation"
import EditzPageContent, { getEditzMetadata } from "@modules/editz/components/EditzPageContent"
import { EDITZ_SECTION_IDS, isEditzSectionId } from "@modules/editz/lib/scroll"

export const revalidate = 60

export function generateStaticParams() {
  return EDITZ_SECTION_IDS.map((section) => ({ section }))
}

export async function generateMetadata(): Promise<Metadata> {
  return getEditzMetadata()
}

export default async function EditzSectionPage({
  params,
}: {
  params: Promise<{ section: string }>
}) {
  const { section } = await params
  if (!isEditzSectionId(section)) {
    notFound()
  }
  return <EditzPageContent />
}

