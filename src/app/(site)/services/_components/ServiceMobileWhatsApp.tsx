"use client"

import React from "react"
import { MessageSquare } from "lucide-react"

/**
 * ServiceMobileWhatsApp - Sticky floating WhatsApp button for mobile devices (<1024px).
 * Gives mobile visitors instant 1-tap contact with solar engineers.
 * 
 * TODO: REPLACE PLACEHOLDER WHATSAPP NUMBER WITH YOUR ACTUAL BUSINESS WHATSAPP NUMBER
 */
export default function ServiceMobileWhatsApp() {
  // TODO: Replace with your actual WhatsApp business phone number (country code without '+')
  const whatsappNumber = "919523467849"
  const message = encodeURIComponent(
    "Hello AG POWER, I am visiting your services page and would like a free solar rooftop consultation."
  )

  return (
    <aside
      aria-label="Mobile WhatsApp Contact"
      className="fixed bottom-5 right-4 z-40 sm:bottom-6 sm:right-6 lg:hidden"
    >
      <a
        href={`https://wa.me/${whatsappNumber}?text=${message}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with Solar Consultant on WhatsApp"
        className="group relative flex h-14 items-center gap-2.5 rounded-full bg-social-whatsapp px-4 text-slate-950 shadow-2xl transition-all duration-300 hover:scale-105 hover:opacity-95 active:scale-95 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2"
      >
        {/* Pulsing beacon indicator */}
        <span className="relative flex h-3 w-3">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
          <span className="relative inline-flex h-3 w-3 rounded-full bg-white" />
        </span>

        {/* WhatsApp Icon */}
        <MessageSquare className="h-5 w-5 fill-slate-950 text-slate-950" />

        <span className="font-manrope text-[14px] font-extrabold tracking-tight">
          WhatsApp Us
        </span>
      </a>
    </aside>
  )
}
