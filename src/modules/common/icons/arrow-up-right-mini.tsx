/**
 * Purpose: local copy of the 15×15 "arrow up right mini" icon previously imported from
 * @medusajs/icons (same viewBox, path and stroke), so that package could be removed.
 */
import React from "react"

type ArrowUpRightMiniProps = React.SVGProps<SVGSVGElement> & { color?: string }

const ArrowUpRightMini = ({ color = "currentColor", ...props }: ArrowUpRightMiniProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={15} height={15} viewBox="0 0 15 15" fill="none" {...props}>
    <path
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="m12.167 2.833-9.334 9.334M6.824 2.833h5.343v5.342"
    />
  </svg>
)

export default ArrowUpRightMini
