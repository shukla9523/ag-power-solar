"use client"

/**
 * Purpose: the only stateful parts of the footers — the mobile accordions. Link content is passed
 * in from the server footers (as children or plain data), so only this toggle logic ships as JS.
 */
import { ChevronDown } from "lucide-react"
import { useState } from "react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { epilogue, outfit } from "@lib/fonts"
import type { FooterLink } from "./footer-data"

// ── Mobile-only accordion ─────────────────────────────────────────────────────
export function FooterAccordion({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(false)

  return (
    <div className="border-b border-slate-100 lg:border-none">
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between py-4 lg:hidden"
      >
        <span className={`${epilogue.className} text-[15px] font-extrabold tracking-[-0.02em] text-navy`}>
          {title}
        </span>
        <ChevronDown
          size={15}
          className="shrink-0 text-slate-400 transition-transform duration-200"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
        />
      </button>

      {/* Mobile content */}
      <div
        className="overflow-hidden transition-all duration-300 lg:hidden"
        style={{ maxHeight: open ? "600px" : "0px" }}
      >
        <div className="pb-5">{children}</div>
      </div>

      {/* Desktop — always visible */}
      <div className="hidden lg:block">
        <p className={`${epilogue.className} mb-5 text-[11px] font-extrabold uppercase tracking-[0.1em] text-slate-400`}>
          {title}
        </p>
        {children}
      </div>
    </div>
  )
}

// ── Mobile Quick Links accordion ─────────────────────────────────────────────
export function MobileQuickLinks({ links }: { links: FooterLink[] }) {
  const [open, setOpen] = useState(false)

  const alwaysVisible = links[0]
  const hidden = links.slice(1)

  return (
    <div className="border-b border-slate-100 lg:hidden">
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between py-4"
      >
        <span className={`${epilogue.className} text-[15px] font-extrabold tracking-[-0.02em] text-navy`}>
          Quick Links
        </span>
        <ChevronDown
          size={15}
          className="shrink-0 text-slate-400 transition-transform duration-200"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
        />
      </button>

      <div className="pb-2">
        <LocalizedClientLink
          href={alwaysVisible.href}
          className={`${outfit.className} block py-1.5 text-[13.5px] font-medium text-slate-600 transition-colors hover:text-brand`}
        >
          {alwaysVisible.name}
        </LocalizedClientLink>
      </div>

      <div
        className="overflow-hidden transition-all duration-300"
        style={{ maxHeight: open ? "400px" : "0px" }}
      >
        <div className="flex flex-col gap-0 pb-5">
          {hidden.map((item) => (
            <LocalizedClientLink
              key={item.name}
              href={item.href}
              className={`${outfit.className} py-1.5 text-[13.5px] font-medium text-slate-600 transition-colors hover:text-brand`}
            >
              {item.name}
            </LocalizedClientLink>
          ))}
        </div>
      </div>
    </div>
  )
}
