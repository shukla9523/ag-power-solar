import React from "react"
import Image from "next/image"

interface AgPowerLogoProps {
  className?: string
  variant?: "default" | "dark"
  size?: "sm" | "md" | "lg"
  showText?: boolean
  layout?: "horizontal" | "stacked"
}

export default function AgPowerLogo({
  className = "",
  variant = "default",
  size = "md",
  showText = true,
  layout = "horizontal",
}: AgPowerLogoProps) {
  const isDark = variant === "dark"

  const iconDimensions = {
    sm: { width: 32, height: 32, class: "h-8 w-8" },
    md: { width: 40, height: 40, class: "h-9 w-9 sm:h-10 sm:w-10" },
    lg: { width: 48, height: 48, class: "h-11 w-11 sm:h-12 sm:w-12" },
  }

  const textSizes = {
    sm: "text-[16px] sm:text-[18px]",
    md: "text-[18px] sm:text-[21px]",
    lg: "text-[22px] sm:text-[25px]",
  }

  const subSizes = {
    sm: "text-[8px] sm:text-[8.5px] tracking-[0.22em]",
    md: "text-[8.5px] sm:text-[9.5px] tracking-[0.22em] sm:tracking-[0.24em]",
    lg: "text-[10px] sm:text-[11px] tracking-[0.24em] sm:tracking-[0.26em]",
  }

  if (layout === "stacked") {
    const stackedSizes = {
      sm: { width: 110, height: 94 },
      md: { width: 140, height: 119 },
      lg: { width: 170, height: 145 },
    }
    const dim = stackedSizes[size]
    return (
      <div className={`group inline-flex flex-col items-center select-none ${className}`}>
        <Image
          src={isDark ? "/images/brand/ag-power-logo-white.webp" : "/images/brand/ag-power-logo.webp"}
          alt="AG POWER Solar"
          width={dim.width}
          height={dim.height}
          className="h-auto w-auto object-contain transition-transform duration-300 group-hover:scale-105"
          priority
        />
      </div>
    )
  }

  const iconDim = iconDimensions[size]

  return (
    <div className={`group inline-flex items-center gap-2.5 sm:gap-3 select-none whitespace-nowrap ${className}`}>
      {/* ── Official AG POWER Globe & Solar Panel Emblem ── */}
      <div className={`relative ${iconDim.class} flex-shrink-0 transition-transform duration-300 group-hover:scale-105`}>
        <Image
          src="/images/brand/ag-power-emblem.webp"
          alt="AG POWER Official Brandmark"
          width={iconDim.width}
          height={iconDim.height}
          className="h-full w-full object-contain drop-shadow-xs"
          priority
        />
      </div>

      {/* ── Brand Name & Industry Subtitle Lockup ── */}
      {showText && (
        <div className="flex flex-col justify-center leading-none">
          <div className="flex items-center">
            <span
              className={`font-manrope ${textSizes[size]} font-black tracking-[-0.035em] ${
                isDark ? "text-white" : "text-slate-900"
              }`}
            >
              AG
            </span>
            <span className={`font-manrope ${textSizes[size]} font-black tracking-[-0.035em] text-emerald-600 ml-1.5`}>
              POWER
            </span>
            <span className="ml-1 h-2 w-2 rounded-full bg-emerald-500 shadow-xs" />
          </div>
          <span
            className={`font-manrope ${subSizes[size]} font-extrabold uppercase mt-1 ${
              isDark ? "text-emerald-400/90" : "text-emerald-800"
            }`}
          >
            Solar Systems
          </span>
        </div>
      )}
    </div>
  )
}
