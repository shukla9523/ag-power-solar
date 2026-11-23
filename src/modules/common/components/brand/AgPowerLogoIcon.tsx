import React from "react"

interface AgPowerLogoIconProps {
  className?: string
  size?: number
}

export default function AgPowerLogoIcon({ className = "h-10 w-10", size }: AgPowerLogoIconProps) {
  const dimension = size || 40

  return (
    <div className={`relative inline-flex items-center justify-center flex-shrink-0 ${className}`}>
      <svg
        width={dimension}
        height={dimension}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-full drop-shadow-[0_2px_8px_rgba(22,163,74,0.2)]"
      >
        <defs>
          <linearGradient id="ag-sun-grad" x1="12" y1="4" x2="36" y2="28" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FBBF24" />
            <stop offset="100%" stopColor="#F59E0B" />
          </linearGradient>
          <linearGradient id="ag-panel-grad" x1="8" y1="20" x2="40" y2="44" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#16A34A" />
            <stop offset="100%" stopColor="#047857" />
          </linearGradient>
          <linearGradient id="ag-leaf-grad" x1="18" y1="12" x2="38" y2="32" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#34D399" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>
        </defs>

        {/* Outer Circular Shield Base */}
        <circle cx="24" cy="24" r="22" className="fill-emerald-50/90 stroke-emerald-200/90" strokeWidth="1.5" />

        {/* Radiant Sun Rays */}
        <path
          d="M24 7V11M13 13L16 16M35 13L32 16M7 24H11M37 24H41"
          stroke="url(#ag-sun-grad)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        {/* Radiant Rising Sun */}
        <circle cx="24" cy="21" r="7" fill="url(#ag-sun-grad)" />

        {/* Rooftop Solar PV Panel */}
        <path
          d="M11 32L24 25L37 32L24 39L11 32Z"
          fill="url(#ag-panel-grad)"
        />

        {/* Solar Cell Grid Lines */}
        <path
          d="M24 25V39M17 28.5L31 35.5M31 28.5L17 35.5"
          stroke="#FFFFFF"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeOpacity="0.8"
        />

        {/* Clean Energy Leaf Accent */}
        <path
          d="M24 16C28 16 33 19 33 24C33 28 29 31 25 31C22 31 21 29 21 27C21 23 23 18 24 16Z"
          fill="url(#ag-leaf-grad)"
          fillOpacity="0.85"
        />
      </svg>
    </div>
  )
}
