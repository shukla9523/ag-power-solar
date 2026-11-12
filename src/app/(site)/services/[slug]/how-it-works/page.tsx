import { Metadata } from "next"
import ServiceDetailPage, {
  generateMetadata as generateServiceMetadata,
  generateStaticParams as generateServiceStaticParams,
} from "../page"

export const revalidate = 60

export async function generateStaticParams() {
  return generateServiceStaticParams()
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  return generateServiceMetadata(props)
}

export default ServiceDetailPage

