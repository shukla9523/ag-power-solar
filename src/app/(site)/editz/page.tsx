import { Metadata } from "next"
import EditzPageContent, { getEditzMetadata } from "@modules/editz/components/EditzPageContent"

export const revalidate = 60

export async function generateMetadata(): Promise<Metadata> {
  return getEditzMetadata()
}

export default async function EditzPage() {
  return <EditzPageContent />
}
