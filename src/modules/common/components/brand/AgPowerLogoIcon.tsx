import React from "react"

interface AgPowerLogoIconProps {
  className?: string
  size?: number
}

export default function AgPowerLogoIcon({ className = "h-10 w-10", size }: AgPowerLogoIconProps) {
  const style = size ? { width: size, height: size } : undefined

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      className={className}
      style={style}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="agBgGradNav" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#047857" />
          <stop offset="50%" stopColor="#064E3B" />
          <stop offset="100%" stopColor="#022C22" />
        </linearGradient>
        <linearGradient id="agGoldGradNav" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FEF08A" />
          <stop offset="40%" stopColor="#FBBF24" />
          <stop offset="100%" stopColor="#F59E0B" />
        </linearGradient>
      </defs>

      {/* Squircle Brand Background */}
      <rect width="512" height="512" rx="120" fill="url(#agBgGradNav)" />
      <rect
        x="14"
        y="14"
        width="484"
        height="484"
        rx="108"
        fill="none"
        stroke="#FBBF24"
        strokeWidth="10"
        strokeOpacity="0.4"
      />

      {/* 8 Crisp Solar Rays */}
      <path d="M256 52 L280 135 L232 135 Z" fill="url(#agGoldGradNav)" />
      <path d="M256 460 L280 377 L232 377 Z" fill="url(#agGoldGradNav)" />
      <path d="M52 256 L135 232 L135 280 Z" fill="url(#agGoldGradNav)" />
      <path d="M460 256 L377 232 L377 280 Z" fill="url(#agGoldGradNav)" />
      <path d="M400 112 L368 180 L332 144 Z" fill="url(#agGoldGradNav)" />
      <path d="M112 400 L144 332 L180 368 Z" fill="url(#agGoldGradNav)" />
      <path d="M112 112 L180 144 L144 180 Z" fill="url(#agGoldGradNav)" />
      <path d="M400 400 L332 368 L368 332 Z" fill="url(#agGoldGradNav)" />

      {/* Core Solar Orb */}
      <circle cx="256" cy="256" r="98" fill="url(#agGoldGradNav)" />
      <circle cx="256" cy="256" r="74" fill="#064E3B" />
      <circle cx="256" cy="256" r="54" fill="url(#agGoldGradNav)" />
      <circle cx="256" cy="256" r="32" fill="#FEF08A" />
    </svg>
  )
}
