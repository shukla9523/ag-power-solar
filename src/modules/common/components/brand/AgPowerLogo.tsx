import React from "react"
import AgPowerLogoIcon from "./AgPowerLogoIcon"

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
    sm: { width: 34, height: 34, class: "h-8 w-8" },
    md: { width: 42, height: 42, class: "h-9 w-9 sm:h-10 sm:w-10" },
    lg: { width: 48, height: 48, class: "h-11 w-11 sm:h-12 sm:w-12" },
  }

  const textSizes = {
    sm: "text-[17px] sm:text-[19px]",
    md: "text-[20px] sm:text-[23px]",
    lg: "text-[24px] sm:text-[27px]",
  }

  const subSizes = {
    sm: "text-[8.5px] sm:text-[9px] tracking-[0.14em] sm:tracking-[0.24em]",
    md: "text-[9.5px] sm:text-[10.5px] tracking-[0.14em] sm:tracking-[0.25em]",
    lg: "text-[11px] sm:text-[12px] tracking-[0.16em] sm:tracking-[0.26em]",
  }

  const iconDim = iconDimensions[size]

  return (
    <div
      className={`group inline-flex items-center gap-2.5 sm:gap-3 select-none whitespace-nowrap cursor-pointer transition-all ${
        layout === "stacked" ? "flex-col text-center" : "flex-row"
      } ${className}`}
    >
      {/* ── Modern Vector Solar Shield Emblem ── */}
      <div className={`${iconDim.class} flex-shrink-0 transition-transform duration-300 group-hover:scale-105`}>
        <AgPowerLogoIcon size={iconDim.width} className="h-full w-full" />
      </div>

      {/* ── Brand Name & Industry Subtitle Lockup ── */}
      {showText && (
        <div className="flex flex-col justify-center leading-none">
          <div className="flex items-center">
            <span
              className={`${textSizes[size]} font-black tracking-tight transition-colors duration-200 ${
                isDark ? "text-[var(--footer-text)]" : "text-slate-900 group-hover:text-forest-deep"
              }`}
            >
              AG
            </span>
            <span
              className={`${textSizes[size]} font-black tracking-tight ${
                isDark ? "text-[var(--footer-text)]" : "text-emerald-600 group-hover:text-emerald-500"
              } ml-1.5 transition-colors duration-200`}
            >
              POWER
            </span>
            {/* Small Solar Spark in Radiant Gold */}
            <span className="ml-1.5 h-1.5 w-1.5 rounded-full bg-amber-400 inline-block shadow-xs" />
          </div>

          <span
            className={`${subSizes[size]} font-bold uppercase mt-1 transition-colors duration-200 ${
              isDark ? "text-[var(--footer-text)]" : "text-forest-deep group-hover:text-emerald-700"
            }`}
          >
            Solar Solutions
          </span>
        </div>
      )}
    </div>
  )
}
