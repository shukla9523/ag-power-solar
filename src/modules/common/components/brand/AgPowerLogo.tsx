import React from "react"

interface AgPowerLogoProps {
  className?: string
  variant?: "default" | "dark"
  size?: "sm" | "md" | "lg"
}

export default function AgPowerLogo({
  className = "",
  variant = "default",
  size = "md",
}: AgPowerLogoProps) {
  const isDark = variant === "dark"

  const iconSizes = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12",
  }

  const textSizes = {
    sm: "text-[18px]",
    md: "text-[21px]",
    lg: "text-[25px]",
  }

  const subSizes = {
    sm: "text-[8.5px] tracking-[0.22em]",
    md: "text-[9.5px] tracking-[0.24em]",
    lg: "text-[11px] tracking-[0.26em]",
  }

  return (
    <div className={`group inline-flex items-center gap-2.5 sm:gap-3 select-none whitespace-nowrap ${className}`}>
      {/* ── Precision Solar Energy Emblem ── */}
      <svg
        viewBox="0 0 56 56"
        className={`${iconSizes[size]} flex-shrink-0 transition-transform duration-300 group-hover:scale-105 group-hover:rotate-6`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          {/* Radiant Sun Gold Gradient */}
          <linearGradient id="agLogoGold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FDE047" />
            <stop offset="45%" stopColor="#FBBF24" />
            <stop offset="100%" stopColor="#F59E0B" />
          </linearGradient>

          {/* Clean Energy Emerald Gradient */}
          <linearGradient id="agLogoEmerald" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#34D399" />
            <stop offset="50%" stopColor="#10B981" />
            <stop offset="100%" stopColor="#047857" />
          </linearGradient>

          {/* Subtle Ambient Glow */}
          <filter id="agSunGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Dynamic Outer Solar Rays (8 Balanced Facets) */}
        <g fill="url(#agLogoGold)">
          {/* North, South, East, West */}
          <path d="M28 2 L31.5 12 L24.5 12 Z" />
          <path d="M28 54 L31.5 44 L24.5 44 Z" />
          <path d="M2 28 L12 24.5 L12 31.5 Z" />
          <path d="M54 28 L44 24.5 L44 31.5 Z" />

          {/* Diagonal Flares */}
          <path d="M9.6 9.6 L18.8 14.5 L14.5 18.8 Z" />
          <path d="M46.4 46.4 L37.2 41.5 L41.5 37.2 Z" />
          <path d="M46.4 9.6 L41.5 18.8 L37.2 14.5 Z" />
          <path d="M9.6 46.4 L14.5 37.2 L18.8 41.5 Z" />
        </g>

        {/* Circular Clean Energy Photovoltaic Ring */}
        <circle
          cx="28"
          cy="28"
          r="16"
          stroke="url(#agLogoEmerald)"
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeDasharray="90 10"
        />

        {/* Inner Radiant Sun Core */}
        <circle cx="28" cy="28" r="10.5" fill="url(#agLogoGold)" filter="url(#agSunGlow)" />
        <circle cx="28" cy="28" r="7" fill={isDark ? "#064E3B" : "#FFFFFF"} />
        <circle cx="28" cy="28" r="4.2" fill="url(#agLogoGold)" />
        <circle cx="28" cy="28" r="2" fill="#FEF08A" />
      </svg>

      {/* ── Brand Name & Industry Subtitle Lockup ── */}
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
          <span className="ml-1 h-2 w-2 rounded-full bg-amber-400 shadow-sm" />
        </div>
        <span
          className={`font-manrope ${subSizes[size]} font-extrabold uppercase mt-1 ${
            isDark ? "text-emerald-400/90" : "text-emerald-800"
          }`}
        >
          Solar Systems
        </span>
      </div>
    </div>
  )
}
