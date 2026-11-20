import React from "react"
import Image from "next/image"

interface AgPowerLogoIconProps {
  className?: string
  size?: number
}

export default function AgPowerLogoIcon({ className = "h-10 w-10", size }: AgPowerLogoIconProps) {
  const dimension = size || 40

  return (
    <div className={`relative inline-flex items-center justify-center flex-shrink-0 ${className}`}>
      <Image
        src="/images/brand/ag-power-emblem.webp"
        alt="AG POWER Emblem"
        width={dimension}
        height={dimension}
        className="h-full w-full object-contain"
      />
    </div>
  )
}
