"use client"

/**
 * Purpose: the pathname-dependent parts of the site footer. The footers themselves are server
 * components passed in as props; these wrappers only decide which one is shown, using the same
 * pathname rules the former all-client footer used.
 */
import { usePathname } from "next/navigation"

export function FooterSwitch({
  isEditzProp,
  editz,
  main,
}: {
  isEditzProp?: boolean
  editz: React.ReactNode
  main: React.ReactNode
}) {
  const pathname = usePathname()
  const isEditz = isEditzProp || pathname?.startsWith("/editz") || pathname?.includes("editz")
  return <>{isEditz ? editz : main}</>
}

/** Renders its children on the homepage ("/") only. */
export function HomepageOnly({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  return pathname === "/" ? <>{children}</> : null
}
