"use client"

import React, { useState, useEffect, useCallback, useMemo } from "react"
import Image from "next/image"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { SolarPanelDetail } from "@data/panels"
import {
  ArrowRight,
  ShieldCheck,
  Zap,
  Award,
  ChevronRight,
  SunMedium,
  CheckCircle2,
  FileText,
  Phone,
  ChevronDown,
  X,
  ChevronLeft,
  Maximize2,
  HelpCircle,
  Building2,
  Home,
  Check,
} from "lucide-react"

interface PanelDetailClientProps {
  panel: SolarPanelDetail
  relatedPanels: SolarPanelDetail[]
}

export default function PanelDetailClient({ panel, relatedPanels }: PanelDetailClientProps) {
  // Compute distinct images to prevent rendering identical/duplicate images
  const distinctImages = useMemo(() => {
    return Array.from(new Map(panel.images.map((img) => [img.src, img])).values())
  }, [panel.images])

  const hasMultipleImages = distinctImages.length > 1

  // Gallery state
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)

  // FAQ Accordion state (limit to max 5 FAQs)
  const displayFaqs = useMemo(() => panel.faqs.slice(0, 5), [panel.faqs])
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0)

  // Touch swipe tracking for lightbox
  const [touchStartX, setTouchStartX] = useState<number | null>(null)
  const [touchEndX, setTouchEndX] = useState<number | null>(null)

  // Open Lightbox
  const openLightbox = (index: number) => {
    setLightboxIndex(index)
    setIsLightboxOpen(true)
    document.body.style.overflow = "hidden"
  }

  // Close Lightbox
  const closeLightbox = useCallback(() => {
    setIsLightboxOpen(false)
    document.body.style.overflow = ""
  }, [])

  // Next Lightbox Image
  const nextLightboxImage = useCallback(() => {
    setLightboxIndex((prev) => (prev + 1) % distinctImages.length)
  }, [distinctImages.length])

  // Prev Lightbox Image
  const prevLightboxImage = useCallback(() => {
    setLightboxIndex((prev) => (prev - 1 + distinctImages.length) % distinctImages.length)
  }, [distinctImages.length])

  // Keyboard navigation for Lightbox
  useEffect(() => {
    if (!isLightboxOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox()
      if (e.key === "ArrowRight") nextLightboxImage()
      if (e.key === "ArrowLeft") prevLightboxImage()
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isLightboxOpen, closeLightbox, nextLightboxImage, prevLightboxImage])

  // Touch handlers for mobile swipe in Lightbox
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEndX(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (!touchStartX || !touchEndX) return
    const distance = touchStartX - touchEndX
    const isLeftSwipe = distance > 50
    const isRightSwipe = distance < -50

    if (isLeftSwipe) {
      nextLightboxImage()
    } else if (isRightSwipe) {
      prevLightboxImage()
    }

    setTouchStartX(null)
    setTouchEndX(null)
  }

  const currentImage = distinctImages[activeImageIndex] || distinctImages[0]

  return (
    <div className="bg-white text-slate-900 pb-28 md:pb-16">
      {/* ── BREADCRUMB (1200px centered) ── */}
      <nav aria-label="Breadcrumb" className="border-b border-slate-200/80 bg-slate-50/70 py-3">
        <div className="mx-auto w-full max-w-[1200px] px-4 sm:px-6 lg:px-8">
          <ol className="flex items-center flex-wrap gap-1.5 text-[12.5px] font-medium text-slate-600">
            <li>
              <LocalizedClientLink href="/" className="hover:text-forest transition-colors">
                Home
              </LocalizedClientLink>
            </li>
            <li>
              <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
            </li>
            <li>
              <LocalizedClientLink href="/solar-panels" className="hover:text-forest transition-colors">
                Solar Panels
              </LocalizedClientLink>
            </li>
            <li>
              <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
            </li>
            <li className="font-semibold text-forest truncate max-w-[240px] sm:max-w-none" aria-current="page">
              {panel.name}
            </li>
          </ol>
        </div>
      </nav>

      {/* ── HERO SECTION: 2-Column Grid (1200px centered) ── */}
      <section className="py-8 sm:py-12 border-b border-slate-200/80">
        <div className="mx-auto w-full max-w-[1200px] px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
            
            {/* LEFT: Image Gallery (~55% width on desktop, 4:3 aspect ratio, capped at 440px height) */}
            <div className="lg:col-span-7 flex flex-col gap-3">
              <div
                onClick={() => openLightbox(activeImageIndex)}
                className="group relative w-full aspect-[4/3] max-h-[440px] overflow-hidden rounded-2xl bg-slate-50 border border-slate-200 cursor-zoom-in shadow-xs flex items-center justify-center"
              >
                <Image
                  src={currentImage.src}
                  alt={currentImage.alt || panel.name}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 55vw"
                  className="object-contain p-4 transition-transform duration-300 group-hover:scale-105"
                />

                {/* Top-Right Zoom Button */}
                <div className="absolute top-3.5 right-3.5 z-10">
                  <button
                    type="button"
                    aria-label="Enlarge image"
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 border border-slate-200 text-slate-700 shadow-xs backdrop-blur-xs transition-transform hover:scale-105 active:scale-95"
                  >
                    <Maximize2 className="h-4 w-4" />
                  </button>
                </div>

                {/* Optional Counter - ONLY if multiple distinct images exist */}
                {hasMultipleImages && (
                  <div className="absolute bottom-3 right-3 z-10">
                    <span className="text-[11.5px] font-medium text-slate-700 bg-white/90 border border-slate-200 px-2.5 py-0.5 rounded-full shadow-xs">
                      {activeImageIndex + 1} / {distinctImages.length}
                    </span>
                  </div>
                )}
              </div>

              {/* Thumbnails Row - ONLY rendered if multiple distinct images exist */}
              {hasMultipleImages && (
                <div className="flex gap-2.5 overflow-x-auto pb-1">
                  {distinctImages.map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative h-16 w-20 flex-shrink-0 overflow-hidden rounded-xl border-2 transition-all ${
                        activeImageIndex === idx
                          ? "border-forest ring-1 ring-forest/30 shadow-xs"
                          : "border-slate-200 bg-slate-50 opacity-70 hover:opacity-100 hover:border-slate-300"
                      }`}
                      aria-label={`View photo ${idx + 1}`}
                    >
                      <Image
                        src={img.src}
                        alt={img.alt}
                        fill
                        sizes="80px"
                        className="object-contain p-1"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* RIGHT: Panel Details & Compact Specs (~45% width) */}
            <div className="lg:col-span-5 flex flex-col justify-start">
              <div>
                {/* Brand & Badges */}
                <div className="flex items-center flex-wrap gap-2">
                  <span className="text-[13px] font-bold uppercase tracking-wider text-forest">
                    {panel.brand}
                  </span>
                  {panel.badge ? (
                    <span className="inline-flex items-center rounded-md bg-forest px-2 py-0.5 text-[11px] font-semibold text-white">
                      {panel.badge}
                    </span>
                  ) : null}
                  {panel.almm_listed && (
                    <span className="inline-flex items-center gap-1 rounded-md bg-blue-50 border border-blue-200 px-2 py-0.5 text-[11px] font-semibold text-blue-700">
                      <ShieldCheck className="h-3 w-3 text-blue-600" />
                      ALMM Listed
                    </span>
                  )}
                  {panel.dcr_compliant && (
                    <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
                      <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                      DCR Compliant
                    </span>
                  )}
                </div>

                {/* H1 Title: max text-3xl md:text-4xl, font-semibold */}
                <h1 className="mt-2.5 text-2xl sm:text-3xl lg:text-[32px] font-semibold text-slate-900 leading-snug">
                  {panel.name}
                </h1>

                {/* Technology & Wattage */}
                <div className="mt-2.5 flex items-center flex-wrap gap-2 text-[13px]">
                  <span className="rounded-md bg-slate-100 px-2.5 py-1 font-medium text-slate-800">
                    {panel.technology}
                  </span>
                  <span className="rounded-md bg-slate-100 px-2.5 py-1 font-semibold text-slate-800">
                    {panel.wattageRange}
                  </span>
                </div>

                {/* Factual Datasheet Tagline */}
                <p className="mt-3.5 text-[14.5px] leading-relaxed text-slate-600">
                  {panel.tagline}
                </p>

                {/* Compact Technical Specifications Table (TASK 5) */}
                <div className="mt-5 overflow-hidden rounded-xl border border-slate-200 bg-white text-[13px]">
                  <div className="divide-y divide-slate-100">
                    <div className="flex justify-between items-center py-2 px-3.5 bg-slate-50/70">
                      <span className="text-slate-500 font-medium">Power Range</span>
                      <span className="font-semibold text-slate-900">{panel.specs.powerRange}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 px-3.5">
                      <span className="text-slate-500 font-medium">Module Efficiency</span>
                      <span className="font-semibold text-forest">{panel.specs.moduleEfficiency}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 px-3.5 bg-slate-50/70">
                      <span className="text-slate-500 font-medium">Linear Warranty</span>
                      <span className="font-semibold text-slate-900">
                        {panel.warranty.performance.split(" ")[0]} Linear Output
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 px-3.5">
                      <span className="text-slate-500 font-medium">Cell Technology</span>
                      <span className="font-semibold text-slate-900 text-right truncate max-w-[200px]">
                        {panel.specs.cellTechnology.split("(")[0].trim()}
                      </span>
                    </div>
                    {panel.specs.dimensions && (
                      <div className="flex justify-between items-center py-2 px-3.5 bg-slate-50/70">
                        <span className="text-slate-500 font-medium">Dimensions</span>
                        <span className="font-semibold text-slate-900">{panel.specs.dimensions}</span>
                      </div>
                    )}
                    {panel.specs.weight && (
                      <div className="flex justify-between items-center py-2 px-3.5">
                        <span className="text-slate-500 font-medium">Weight</span>
                        <span className="font-semibold text-slate-900">
                          {panel.specs.weight.split("(")[0].trim()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Dedicated Subsidy Text Link (TASK 1) */}
                <p className="mt-3.5 text-[12.5px] text-slate-600 leading-normal">
                  Eligible for central subsidy under PM Surya Ghar Muft Bijli Yojana.{" "}
                  <LocalizedClientLink
                    href="/calculator"
                    className="font-semibold text-forest underline hover:text-forest-deep"
                  >
                    Calculate subsidy savings →
                  </LocalizedClientLink>
                </p>
              </div>

              {/* Action Buttons: Primary + WhatsApp (TASK 4) */}
              <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <LocalizedClientLink
                  href={`/contact?panel=${panel.slug}`}
                  className="inline-flex min-h-[46px] flex-1 items-center justify-center gap-2 rounded-xl bg-forest hover:bg-forest-deep px-5 py-2.5 text-[14px] font-bold text-white shadow-xs transition-all active:scale-95 text-center"
                >
                  <span>Get Free Quote</span>
                  <ArrowRight className="h-4 w-4" />
                </LocalizedClientLink>

                <a
                  href={`https://wa.me/919523467849?text=${encodeURIComponent(`Hi, I'd like details about ${panel.name} (${panel.wattageRange}).`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[46px] items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 px-4 py-2.5 text-[14px] font-semibold text-slate-800 transition-all active:scale-95"
                >
                  <svg className="h-4 w-4 fill-emerald-600 flex-shrink-0" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                  </svg>
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── OVERVIEW SECTION (1200px centered) ── */}
      {panel.overview && (
        <section className="py-8 sm:py-12 border-b border-slate-200/80 bg-white">
          <div className="mx-auto w-full max-w-[1200px] px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <span className="text-[12px] font-bold uppercase tracking-wider text-forest">
                Engineering Overview
              </span>
              <h2 className="mt-1 text-2xl sm:text-[26px] font-semibold text-slate-900">
                About the {panel.name}
              </h2>
              <p className="mt-3.5 text-[15px] sm:text-[15.5px] leading-relaxed text-slate-600">
                {panel.overview}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* ── KEY HIGHLIGHTS STRIP (1200px centered) ── */}
      <section className="bg-slate-50 py-6 border-b border-slate-200/80">
        <div className="mx-auto w-full max-w-[1200px] px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="rounded-xl bg-white p-3.5 border border-slate-200/80 shadow-2xs flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-forest flex-shrink-0">
                <Zap className="h-5 w-5" />
              </div>
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Efficiency</span>
                <p className="text-[15px] font-bold text-slate-900">{panel.efficiency}</p>
              </div>
            </div>

            <div className="rounded-xl bg-white p-3.5 border border-slate-200/80 shadow-2xs flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-forest flex-shrink-0">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Warranty</span>
                <p className="text-[15px] font-bold text-slate-900">
                  {panel.warranty.performance.split(" ")[0]} Linear
                </p>
              </div>
            </div>

            <div className="rounded-xl bg-white p-3.5 border border-slate-200/80 shadow-2xs flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-forest flex-shrink-0">
                <SunMedium className="h-5 w-5" />
              </div>
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Technology</span>
                <p className="text-[14px] font-bold text-slate-900 truncate max-w-[140px]">{panel.technology}</p>
              </div>
            </div>

            <div className="rounded-xl bg-white p-3.5 border border-slate-200/80 shadow-2xs flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-forest flex-shrink-0">
                <Home className="h-5 w-5" />
              </div>
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Application</span>
                <p className="text-[13.5px] font-bold text-slate-900 truncate max-w-[140px]">{panel.bestFor.title.split(",")[0]}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TECHNICAL SPECIFICATIONS TABLE (1200px centered) ── */}
      <section className="py-10 sm:py-14 bg-slate-50/60 border-b border-slate-200/80" id="specs">
        <div className="mx-auto w-full max-w-[1200px] px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl sm:text-[28px] font-semibold text-slate-900">
                Technical Specifications
              </h2>
              <p className="mt-1 text-[14px] text-slate-600">
                Physical, electrical, and thermal parameters referenced from the manufacturer datasheet.
              </p>
            </div>

            {panel.datasheetUrl && (
              <a
                href={panel.datasheetUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 px-4 py-2 text-[13px] font-semibold text-slate-800 shadow-2xs transition-colors self-start sm:self-auto"
              >
                <FileText className="h-4 w-4 text-emerald-600" />
                <span>Download Datasheet (PDF)</span>
              </a>
            )}
          </div>

          <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xs">
            <div className="divide-y divide-slate-100">
              {panel.specs.powerRange && (
                <div className="grid grid-cols-1 sm:grid-cols-3 p-3.5 hover:bg-slate-50/70 transition-colors">
                  <span className="text-[13px] font-semibold text-slate-500">Power Output Range</span>
                  <span className="sm:col-span-2 text-[13.5px] font-bold text-slate-900">{panel.specs.powerRange}</span>
                </div>
              )}

              {panel.specs.cellTechnology && (
                <div className="grid grid-cols-1 sm:grid-cols-3 p-3.5 hover:bg-slate-50/70 transition-colors">
                  <span className="text-[13px] font-semibold text-slate-500">Cell Technology</span>
                  <span className="sm:col-span-2 text-[13.5px] font-medium text-slate-900">{panel.specs.cellTechnology}</span>
                </div>
              )}

              {panel.specs.numberOfCells && (
                <div className="grid grid-cols-1 sm:grid-cols-3 p-3.5 hover:bg-slate-50/70 transition-colors">
                  <span className="text-[13px] font-semibold text-slate-500">Number of Cells</span>
                  <span className="sm:col-span-2 text-[13.5px] font-medium text-slate-800">{panel.specs.numberOfCells}</span>
                </div>
              )}

              {panel.specs.moduleEfficiency && (
                <div className="grid grid-cols-1 sm:grid-cols-3 p-3.5 hover:bg-slate-50/70 transition-colors">
                  <span className="text-[13px] font-semibold text-slate-500">Module Efficiency</span>
                  <span className="sm:col-span-2 text-[13.5px] font-bold text-forest">{panel.specs.moduleEfficiency}</span>
                </div>
              )}

              {panel.specs.dimensions && (
                <div className="grid grid-cols-1 sm:grid-cols-3 p-3.5 hover:bg-slate-50/70 transition-colors">
                  <span className="text-[13px] font-semibold text-slate-500">Dimensions (L x W x H)</span>
                  <span className="sm:col-span-2 text-[13.5px] font-medium text-slate-800">{panel.specs.dimensions}</span>
                </div>
              )}

              {panel.specs.weight && (
                <div className="grid grid-cols-1 sm:grid-cols-3 p-3.5 hover:bg-slate-50/70 transition-colors">
                  <span className="text-[13px] font-semibold text-slate-500">Weight</span>
                  <span className="sm:col-span-2 text-[13.5px] font-medium text-slate-800">{panel.specs.weight}</span>
                </div>
              )}

              {panel.specs.frontRearGlass && (
                <div className="grid grid-cols-1 sm:grid-cols-3 p-3.5 hover:bg-slate-50/70 transition-colors">
                  <span className="text-[13px] font-semibold text-slate-500">Front / Rear Structure</span>
                  <span className="sm:col-span-2 text-[13.5px] font-medium text-slate-800">{panel.specs.frontRearGlass}</span>
                </div>
              )}

              {panel.specs.frame && (
                <div className="grid grid-cols-1 sm:grid-cols-3 p-3.5 hover:bg-slate-50/70 transition-colors">
                  <span className="text-[13px] font-semibold text-slate-500">Frame Material</span>
                  <span className="sm:col-span-2 text-[13.5px] font-medium text-slate-800">{panel.specs.frame}</span>
                </div>
              )}

              {panel.specs.junctionBox && (
                <div className="grid grid-cols-1 sm:grid-cols-3 p-3.5 hover:bg-slate-50/70 transition-colors">
                  <span className="text-[13px] font-semibold text-slate-500">Junction Box</span>
                  <span className="sm:col-span-2 text-[13.5px] font-medium text-slate-800">{panel.specs.junctionBox}</span>
                </div>
              )}

              {panel.specs.operatingTemperature && (
                <div className="grid grid-cols-1 sm:grid-cols-3 p-3.5 hover:bg-slate-50/70 transition-colors">
                  <span className="text-[13px] font-semibold text-slate-500">Operating Temperature</span>
                  <span className="sm:col-span-2 text-[13.5px] font-medium text-slate-800">{panel.specs.operatingTemperature}</span>
                </div>
              )}

              {panel.specs.temperatureCoefficient && (
                <div className="grid grid-cols-1 sm:grid-cols-3 p-3.5 hover:bg-slate-50/70 transition-colors">
                  <span className="text-[13px] font-semibold text-slate-500">Temperature Coefficient</span>
                  <span className="sm:col-span-2 text-[13.5px] font-medium text-slate-800">{panel.specs.temperatureCoefficient}</span>
                </div>
              )}

              {panel.specs.maxSystemVoltage && (
                <div className="grid grid-cols-1 sm:grid-cols-3 p-3.5 hover:bg-slate-50/70 transition-colors">
                  <span className="text-[13px] font-semibold text-slate-500">Max System Voltage</span>
                  <span className="sm:col-span-2 text-[13.5px] font-medium text-slate-800">{panel.specs.maxSystemVoltage}</span>
                </div>
              )}

              {panel.specs.bifaciality && (
                <div className="grid grid-cols-1 sm:grid-cols-3 p-3.5 hover:bg-slate-50/70 transition-colors bg-emerald-50/30">
                  <span className="text-[13px] font-semibold text-forest">Bifaciality Factor</span>
                  <span className="sm:col-span-2 text-[13.5px] font-bold text-forest">{panel.specs.bifaciality}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── ENGINEERING HIGHLIGHTS (1200px centered) ── */}
      <section className="py-10 sm:py-14 border-b border-slate-200/80">
        <div className="mx-auto w-full max-w-[1200px] px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <h2 className="text-2xl sm:text-[28px] font-semibold text-slate-900">
              Module Engineering Highlights
            </h2>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {panel.benefits.map((b, i) => (
              <div
                key={i}
                className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs flex items-start gap-3.5"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-forest flex-shrink-0">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-[15.5px] font-semibold text-slate-900">
                    {b.title}
                  </h3>
                  <p className="mt-1.5 text-[13.5px] leading-relaxed text-slate-600">
                    {b.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WARRANTY SECTION (1200px centered) ── */}
      <section className="py-10 sm:py-14 border-b border-slate-200/80">
        <div className="mx-auto w-full max-w-[1200px] px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <h2 className="text-2xl sm:text-[28px] font-semibold text-slate-900">
              Warranty Coverage
            </h2>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs">
              <div className="flex items-center gap-2 text-forest">
                <ShieldCheck className="h-5 w-5" />
                <span className="text-[12px] font-bold uppercase tracking-wider">Product & Workmanship</span>
              </div>
              <p className="mt-2 text-xl font-bold text-slate-900">
                {panel.warranty.product}
              </p>
              <p className="mt-2 text-[13.5px] text-slate-600 leading-relaxed">
                Covers manufacturing defects, frame integrity, and junction box functionality under normal operating conditions.
              </p>
            </div>

            <div className="rounded-xl border border-emerald-200 bg-emerald-50/40 p-5 shadow-2xs">
              <div className="flex items-center gap-2 text-forest">
                <Award className="h-5 w-5" />
                <span className="text-[12px] font-bold uppercase tracking-wider">Linear Output Guarantee</span>
              </div>
              <p className="mt-2 text-xl font-bold text-forest-deep">
                {panel.warranty.performance}
              </p>
              <ul className="mt-3 space-y-1.5">
                {panel.warranty.details.map((detail, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-[13px] font-medium text-slate-700">
                    <Check className="h-3.5 w-3.5 text-forest flex-shrink-0" />
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── BEST SUITED FOR (1200px centered) ── */}
      <section className="py-10 sm:py-14 border-b border-slate-200/80">
        <div className="mx-auto w-full max-w-[1200px] px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <h2 className="text-2xl sm:text-[28px] font-semibold text-slate-900">
              Recommended Use Cases
            </h2>
            <p className="mt-1 text-[14px] text-slate-600">
              {panel.bestFor.description}
            </p>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {panel.bestFor.useCases.map((uc, i) => (
              <div
                key={i}
                className="rounded-xl border border-slate-200 bg-white p-4.5 shadow-2xs"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-forest mb-3">
                  {i === 0 ? <Home className="h-4 w-4" /> : i === 1 ? <Building2 className="h-4 w-4" /> : <SunMedium className="h-4 w-4" />}
                </div>
                <h3 className="text-[14.5px] font-semibold text-slate-900 leading-snug">
                  {uc}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ACCORDION (Max 5 Questions, 1200px centered) ── */}
      <section className="py-10 sm:py-14 bg-slate-50/60 border-b border-slate-200/80">
        <div className="mx-auto w-full max-w-[1200px] px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <h2 className="text-2xl sm:text-[28px] font-semibold text-slate-900">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="mt-6 space-y-2.5 max-w-3xl">
            {displayFaqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx
              return (
                <div
                  key={idx}
                  className="rounded-xl border border-slate-200 bg-white shadow-2xs overflow-hidden transition-colors"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="flex w-full items-center justify-between p-4 text-left transition-colors hover:bg-slate-50/70"
                    aria-expanded={isOpen}
                  >
                    <span className="text-[14.5px] font-semibold text-slate-900 pr-4">
                      {faq.question}
                    </span>
                    <ChevronDown
                      className={`h-4 w-4 text-slate-500 flex-shrink-0 transition-transform duration-200 ${
                        isOpen ? "rotate-180 text-forest" : ""
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 pt-1 text-[13.5px] leading-relaxed text-slate-600 border-t border-slate-100">
                      {faq.answer}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── RELATED PANELS (1200px centered) ── */}
      {relatedPanels.length > 0 && (
        <section className="py-10 sm:py-14 border-b border-slate-200/80">
          <div className="mx-auto w-full max-w-[1200px] px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <h2 className="text-2xl sm:text-[28px] font-semibold text-slate-900">
                  Compare Other Panels
                </h2>
              </div>
              <LocalizedClientLink
                href="/solar-panels"
                className="inline-flex items-center gap-1.5 text-[13.5px] font-semibold text-forest hover:underline self-start sm:self-auto"
              >
                <span>View Full Catalogue</span>
                <ArrowRight className="h-4 w-4" />
              </LocalizedClientLink>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedPanels.map((rp) => (
                <LocalizedClientLink
                  key={rp.slug}
                  href={`/solar-panels/${rp.slug}`}
                  className="group flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-2xs hover:border-slate-300 hover:shadow-sm transition-all"
                >
                  <div>
                    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center">
                      <Image
                        src={rp.images[0]?.src || "/panels/n-type-topcon-bifacial/main.webp"}
                        alt={rp.name}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-contain p-4 transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute top-2 right-2 rounded-md bg-white/90 border border-slate-200 px-2 py-0.5 text-[11px] font-bold text-slate-800">
                        {rp.efficiency}
                      </div>
                    </div>

                    <div className="mt-3">
                      <span className="text-[11.5px] font-semibold uppercase tracking-wider text-forest">
                        {rp.brand}
                      </span>
                      <h3 className="mt-0.5 text-[15.5px] font-semibold text-slate-900 group-hover:text-forest transition-colors leading-snug">
                        {rp.name}
                      </h3>
                      <p className="mt-1 text-[12.5px] font-medium text-slate-500">
                        {rp.technology} • {rp.wattageRange}
                      </p>
                      <p className="mt-1.5 text-[13px] line-clamp-2 text-slate-600 leading-normal">
                        {rp.tagline}
                      </p>
                    </div>
                  </div>

                  <span className="mt-3 inline-flex items-center gap-1 text-[13px] font-semibold text-forest group-hover:translate-x-0.5 transition-transform">
                    <span>View Specifications</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </LocalizedClientLink>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── FINAL CTA STRIP (1200px centered) ── */}
      <section className="py-12 sm:py-16 bg-gradient-to-br from-forest-deep via-forest to-forest-deep text-white">
        <div className="mx-auto w-full max-w-[1200px] px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 rounded-2xl bg-white/5 border border-white/10 p-6 sm:p-8 backdrop-blur-xs">
            <div>
              <span className="text-[12px] font-semibold uppercase tracking-wider text-emerald-300">
                Turnkey Solar EPC & Engineering
              </span>
              <h2 className="mt-1 text-2xl sm:text-3xl font-bold tracking-tight text-white">
                Ready to install {panel.brand} modules?
              </h2>
              <p className="mt-2 text-emerald-100 text-[14.5px] max-w-xl">
                Get a comprehensive site assessment, 3D shadow analysis, and turnkey MNRE/discom approval for your solar setup.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <LocalizedClientLink
                href={`/contact?panel=${panel.slug}`}
                className="inline-flex min-h-[46px] items-center justify-center gap-2 rounded-xl bg-white px-5 py-2.5 text-[14px] font-bold text-forest shadow-xs hover:bg-slate-50 transition-all active:scale-95"
              >
                <span>Get Free Quote</span>
                <ArrowRight className="h-4 w-4" />
              </LocalizedClientLink>
              <a
                href="tel:+919523467849"
                className="inline-flex min-h-[46px] items-center justify-center gap-2 rounded-xl border border-white/30 bg-transparent px-5 py-2.5 text-[14px] font-bold text-white hover:bg-white/10 transition-all active:scale-95"
              >
                <Phone className="h-4 w-4" />
                <span>Call +91 95234 67849</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── MOBILE STICKY CTA BAR (<768px screen, does not overlap footer) ── */}
      <div className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 p-2.5 shadow-lg md:hidden">
        <div className="flex items-center gap-2">
          <LocalizedClientLink
            href={`/contact?panel=${panel.slug}`}
            className="flex-1 inline-flex min-h-[44px] items-center justify-center rounded-xl bg-forest px-3 py-2 text-center text-[13.5px] font-bold text-white active:scale-95 shadow-xs"
          >
            <span>Get Free Quote</span>
          </LocalizedClientLink>

          <a
            href={`https://wa.me/919523467849?text=${encodeURIComponent(`Hi, I'd like details about ${panel.name} (${panel.wattageRange}).`)}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp enquiry"
            className="flex h-[44px] w-[44px] items-center justify-center rounded-xl border border-slate-300 bg-white text-emerald-600 active:scale-95 flex-shrink-0"
          >
            <svg className="h-4 w-4 fill-emerald-600" viewBox="0 0 24 24">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
            </svg>
          </a>

          <a
            href="tel:+919523467849"
            aria-label="Call AG POWER"
            className="flex h-[44px] w-[44px] items-center justify-center rounded-xl border border-slate-300 bg-white text-slate-800 active:scale-95 flex-shrink-0"
          >
            <Phone className="h-4 w-4 text-forest" />
          </a>
        </div>
      </div>

      {/* ── LIGHTBOX MODAL WITH ARROWS & SWIPE ── */}
      {isLightboxOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/95 backdrop-blur-md"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Top Bar: Title & Close */}
          <div className="absolute top-4 inset-x-4 sm:inset-x-6 flex items-center justify-between text-white z-20">
            <div>
              <p className="text-[14px] font-semibold">{panel.name}</p>
            </div>

            <div className="flex items-center gap-3">
              {hasMultipleImages && (
                <span className="text-[12px] font-medium text-slate-400">
                  {lightboxIndex + 1} / {distinctImages.length}
                </span>
              )}
              <button
                type="button"
                onClick={closeLightbox}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                aria-label="Close image viewer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Left Arrow Button (only if multiple images) */}
          {hasMultipleImages && (
            <button
              type="button"
              onClick={prevLightboxImage}
              className="absolute left-3 sm:left-6 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-slate-900/80 border border-white/20 text-white hover:bg-slate-800 active:scale-95 transition-all"
              aria-label="Previous photo"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
          )}

          {/* Main Enlarge Image */}
          <div className="relative h-[70vh] w-[90vw] sm:w-[80vw] max-w-4xl overflow-hidden rounded-2xl flex items-center justify-center">
            <Image
              src={distinctImages[lightboxIndex]?.src || distinctImages[0].src}
              alt={distinctImages[lightboxIndex]?.alt || panel.name}
              fill
              className="object-contain p-4"
              sizes="90vw"
              priority
            />
          </div>

          {/* Right Arrow Button (only if multiple images) */}
          {hasMultipleImages && (
            <button
              type="button"
              onClick={nextLightboxImage}
              className="absolute right-3 sm:right-6 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-slate-900/80 border border-white/20 text-white hover:bg-slate-800 active:scale-95 transition-all"
              aria-label="Next photo"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          )}

          {/* Bottom Thumbnails in Lightbox (only if multiple images) */}
          {hasMultipleImages && (
            <div className="absolute bottom-4 inset-x-0 flex justify-center gap-2 z-20 px-4 overflow-x-auto">
              {distinctImages.map((img, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setLightboxIndex(i)}
                  className={`relative h-12 w-16 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 ${
                    lightboxIndex === i ? "border-forest scale-105" : "border-white/30 opacity-60 hover:opacity-100"
                  }`}
                >
                  <Image src={img.src} alt={img.alt} fill sizes="80px" className="object-contain p-1" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
