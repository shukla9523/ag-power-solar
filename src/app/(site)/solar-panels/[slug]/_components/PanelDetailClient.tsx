"use client"

import React, { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { SolarPanelDetail } from "@data/panels"
import {
  ArrowRight,
  ShieldCheck,
  Zap,
  Award,
  Sparkles,
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
  // Gallery state
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)

  // FAQ Accordion state
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
    setLightboxIndex((prev) => (prev + 1) % panel.images.length)
  }, [panel.images.length])

  // Prev Lightbox Image
  const prevLightboxImage = useCallback(() => {
    setLightboxIndex((prev) => (prev - 1 + panel.images.length) % panel.images.length)
  }, [panel.images.length])

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

  return (
    <div className="bg-white text-slate-900 pb-20 md:pb-12">
      {/* ── a) BREADCRUMB ── */}
      <nav aria-label="Breadcrumb" className="border-b border-slate-100 bg-slate-50/70 py-3">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
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
            <li className="font-bold text-forest truncate max-w-[240px] sm:max-w-none" aria-current="page">
              {panel.name}
            </li>
          </ol>
        </div>
      </nav>

      {/* ── b) HERO SECTION: Gallery (Left) & Key Panel Info (Right) ── */}
      <section className="pt-8 pb-12 sm:pt-12 sm:pb-16 border-b border-slate-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12 items-start">
            
            {/* LEFT: Image Gallery */}
            <div className="lg:col-span-7 flex flex-col gap-4">
              {/* Main Photo with Lightbox Trigger */}
              <div
                onClick={() => openLightbox(activeImageIndex)}
                className="group relative h-[320px] sm:h-[420px] lg:h-[480px] w-full overflow-hidden rounded-2xl bg-slate-950 border border-slate-200 cursor-zoom-in shadow-md"
              >
                <Image
                  src={panel.images[activeImageIndex]?.src || panel.images[0].src}
                  alt={panel.images[activeImageIndex]?.alt || panel.name}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 55vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Subtle Gradient Scrim at Bottom */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />

                {/* Badge Top-Left */}
                <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-forest px-3.5 py-1 text-[11px] font-extrabold uppercase tracking-wider text-white shadow-md">
                    <Sparkles className="h-3.5 w-3.5 text-amber-300" />
                    <span>{panel.badge}</span>
                  </span>
                  <span className="rounded-full bg-slate-900/90 border border-white/20 px-3 py-1 text-[11.5px] font-extrabold text-amber-300 backdrop-blur-md">
                    {panel.wattageRange}
                  </span>
                </div>

                {/* Zoom Icon Button Top-Right */}
                <div className="absolute top-4 right-4 z-10">
                  <button
                    type="button"
                    aria-label="Enlarge image"
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-950/70 border border-white/30 text-white backdrop-blur-md transition-transform hover:scale-110 active:scale-95"
                  >
                    <Maximize2 className="h-4 w-4" />
                  </button>
                </div>

                {/* Image Label Bottom-Left */}
                <div className="absolute bottom-4 left-4 right-4 z-10 flex items-center justify-between text-white">
                  <span className="text-[13px] font-bold drop-shadow-md">
                    {panel.images[activeImageIndex]?.label}
                  </span>
                  <span className="text-[12px] font-semibold text-slate-300 bg-slate-950/60 px-2.5 py-0.5 rounded-full backdrop-blur-md">
                    {activeImageIndex + 1} / {panel.images.length} • Click to Zoom
                  </span>
                </div>
              </div>

              {/* Thumbnails Row */}
              <div className="grid grid-cols-5 gap-2.5 sm:gap-3">
                {panel.images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative h-16 sm:h-20 w-full overflow-hidden rounded-xl border-2 transition-all duration-200 ${
                      activeImageIndex === idx
                        ? "border-forest ring-2 ring-forest/30 scale-[1.02] shadow-sm"
                        : "border-slate-200 opacity-70 hover:opacity-100 hover:border-slate-300"
                    }`}
                    aria-label={`View ${img.label}`}
                  >
                    <Image
                      src={img.src}
                      alt={img.alt}
                      fill
                      sizes="120px"
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* RIGHT: Panel Details & CTAs */}
            <div className="lg:col-span-5 flex flex-col justify-between">
              <div>
                {/* Brand & ALMM Chip */}
                <div className="flex items-center gap-2">
                  <span className="text-[13px] font-extrabold uppercase tracking-wider text-forest">
                    {panel.brand}
                  </span>
                  <span className="text-slate-300">•</span>
                  <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[11px] font-bold text-forest-deep">
                    <Award className="h-3 w-3 text-emerald-600" />
                    Tier-1 ALMM Certified
                  </span>
                </div>

                {/* Panel Title */}
                <h1 className="mt-2.5 font-manrope text-[28px] sm:text-[34px] font-black leading-tight text-forest-deep">
                  {panel.name}
                </h1>

                {/* Technology Tag & Wattage */}
                <div className="mt-2.5 flex items-center flex-wrap gap-2 text-[13.5px]">
                  <span className="rounded-lg bg-slate-100 px-2.5 py-1 font-semibold text-slate-800">
                    {panel.technology}
                  </span>
                  <span className="rounded-lg bg-amber-50 border border-amber-200 px-2.5 py-1 font-extrabold text-amber-900">
                    {panel.wattageRange}
                  </span>
                </div>

                {/* Tagline */}
                <p className="mt-4 font-inter text-[15.5px] leading-relaxed text-slate-700">
                  {panel.tagline}
                </p>

                {/* Key Metric Badges */}
                <div className="mt-6 grid grid-cols-2 gap-3">
                  <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-3">
                    <span className="block text-[11.5px] font-semibold text-slate-500">Module Efficiency</span>
                    <strong className="font-manrope text-[20px] font-extrabold text-forest">
                      {panel.efficiency}
                    </strong>
                  </div>

                  <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-3">
                    <span className="block text-[11.5px] font-semibold text-slate-500">Linear Output Warranty</span>
                    <strong className="font-manrope text-[20px] font-extrabold text-forest">
                      {panel.warranty.performance.split(" ")[0]} Guarantee
                    </strong>
                  </div>
                </div>

                {/* Quick Subsidy Notice */}
                <div className="mt-4 rounded-xl bg-amber-50/70 border border-amber-200/80 p-3 text-[12.5px] text-amber-950 flex items-start gap-2">
                  <Sparkles className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
                  <span>
                    Eligible for <strong>up to ₹78,000</strong> direct bank subsidy under PM Surya Ghar Muft Bijli Yojana.
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 flex flex-col gap-3">
                <LocalizedClientLink
                  href={`/contact?panel=${panel.slug}`}
                  className="inline-flex min-h-[50px] w-full items-center justify-center gap-2 rounded-xl bg-forest hover:bg-forest-deep px-6 py-3 font-inter text-[15px] font-extrabold text-white shadow-md transition-all active:scale-95"
                >
                  <span>Get Free Quotation & Site Audit</span>
                  <ArrowRight className="h-4 w-4" />
                </LocalizedClientLink>

                <a
                  href={`https://wa.me/919523467849?text=Hi%20AG%20POWER%2C%20I%20am%20interested%20in%20${encodeURIComponent(panel.name)}%20(${panel.wattageRange}).%20Please%20share%20quotation.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-green-main hover:bg-emerald-700 px-6 py-3 font-inter text-[14.5px] font-bold text-white shadow-sm transition-all active:scale-95"
                >
                  <svg className="h-5 w-5 fill-white" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                  </svg>
                  <span>Chat on WhatsApp</span>
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── c) KEY HIGHLIGHTS STRIP ── */}
      <section className="bg-slate-50 py-8 border-b border-slate-200/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-xl bg-white p-4 border border-slate-200/70 shadow-xs flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-forest flex-shrink-0">
                <Zap className="h-5 w-5" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Efficiency</span>
                <p className="font-manrope text-[17px] font-black text-forest-deep">{panel.efficiency}</p>
              </div>
            </div>

            <div className="rounded-xl bg-white p-4 border border-slate-200/70 shadow-xs flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-forest flex-shrink-0">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Warranty</span>
                <p className="font-manrope text-[17px] font-black text-forest-deep">
                  {panel.warranty.performance.split(" ")[0]} Linear
                </p>
              </div>
            </div>

            <div className="rounded-xl bg-white p-4 border border-slate-200/70 shadow-xs flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-forest flex-shrink-0">
                <SunMedium className="h-5 w-5" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Technology</span>
                <p className="font-manrope text-[15px] font-black text-forest-deep line-clamp-1">{panel.technology}</p>
              </div>
            </div>

            <div className="rounded-xl bg-white p-4 border border-slate-200/70 shadow-xs flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-forest flex-shrink-0">
                <Home className="h-5 w-5" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Best For</span>
                <p className="font-manrope text-[14px] font-black text-forest-deep line-clamp-1">{panel.bestFor.title}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── d) BENEFITS SECTION ── */}
      <section className="py-12 sm:py-16 border-b border-slate-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-forest-deep mb-2">
              <CheckCircle2 className="h-3.5 w-3.5 text-forest" />
              <span>Real Customer Advantages</span>
            </span>
            <h2 className="font-manrope text-[28px] sm:text-[34px] font-black text-forest-deep">
              Why Install {panel.name}?
            </h2>
            <p className="mt-2 text-[15.5px] text-slate-600">
              Engineered specifically for harsh Indian weather, high dust loads, and maximum monthly kilowatt-hour returns.
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            {panel.benefits.map((b, i) => (
              <div
                key={i}
                className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs hover:border-emerald-300 hover:shadow-md transition-all flex items-start gap-4"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-forest flex-shrink-0">
                  <CheckCircle2 className="h-6 w-6 text-emerald-600" />
                </div>
                <div>
                  <h3 className="font-manrope text-[18px] font-bold text-slate-900">
                    {b.title}
                  </h3>
                  <p className="mt-2 font-inter text-[14.5px] leading-relaxed text-slate-600">
                    {b.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── e) TECHNICAL SPECIFICATIONS TABLE ── */}
      <section className="py-12 sm:py-16 bg-slate-50/60 border-b border-slate-200/80" id="specs">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-[12px] font-extrabold uppercase tracking-wider text-forest">
                Hardware Engineering
              </span>
              <h2 className="mt-1 font-manrope text-[28px] sm:text-[34px] font-black text-forest-deep">
                Technical Specifications
              </h2>
              <p className="mt-1 text-[14.5px] text-slate-600">
                Official physical, electrical and thermal performance ratings.
              </p>
            </div>

            {/* i) Datasheet Download Button */}
            <a
              href={panel.datasheetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 px-4 py-2.5 text-[13.5px] font-bold text-slate-800 shadow-xs transition-colors"
            >
              <FileText className="h-4 w-4 text-emerald-600" />
              <span>Download Datasheet (PDF)</span>
            </a>
          </div>

          <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="divide-y divide-slate-100">
              <div className="grid grid-cols-1 sm:grid-cols-3 p-4 hover:bg-slate-50/70 transition-colors">
                <span className="text-[13px] font-bold text-slate-500">Power Output Range</span>
                <span className="sm:col-span-2 text-[14px] font-extrabold text-slate-900 font-manrope">{panel.specs.powerRange}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 p-4 hover:bg-slate-50/70 transition-colors">
                <span className="text-[13px] font-bold text-slate-500">Cell Technology</span>
                <span className="sm:col-span-2 text-[14px] font-semibold text-slate-900">{panel.specs.cellTechnology}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 p-4 hover:bg-slate-50/70 transition-colors">
                <span className="text-[13px] font-bold text-slate-500">Number of Cells</span>
                <span className="sm:col-span-2 text-[14px] font-medium text-slate-800">{panel.specs.numberOfCells}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 p-4 hover:bg-slate-50/70 transition-colors">
                <span className="text-[13px] font-bold text-slate-500">Module Efficiency</span>
                <span className="sm:col-span-2 text-[14px] font-extrabold text-forest">{panel.specs.moduleEfficiency}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 p-4 hover:bg-slate-50/70 transition-colors">
                <span className="text-[13px] font-bold text-slate-500">Dimensions (L x W x H)</span>
                <span className="sm:col-span-2 text-[14px] font-medium text-slate-800">{panel.specs.dimensions}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 p-4 hover:bg-slate-50/70 transition-colors">
                <span className="text-[13px] font-bold text-slate-500">Weight</span>
                <span className="sm:col-span-2 text-[14px] font-medium text-slate-800">{panel.specs.weight}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 p-4 hover:bg-slate-50/70 transition-colors">
                <span className="text-[13px] font-bold text-slate-500">Front / Rear Glass</span>
                <span className="sm:col-span-2 text-[14px] font-medium text-slate-800">{panel.specs.frontRearGlass}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 p-4 hover:bg-slate-50/70 transition-colors">
                <span className="text-[13px] font-bold text-slate-500">Frame Material</span>
                <span className="sm:col-span-2 text-[14px] font-medium text-slate-800">{panel.specs.frame}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 p-4 hover:bg-slate-50/70 transition-colors">
                <span className="text-[13px] font-bold text-slate-500">Junction Box</span>
                <span className="sm:col-span-2 text-[14px] font-medium text-slate-800">{panel.specs.junctionBox}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 p-4 hover:bg-slate-50/70 transition-colors">
                <span className="text-[13px] font-bold text-slate-500">Operating Temperature</span>
                <span className="sm:col-span-2 text-[14px] font-medium text-slate-800">{panel.specs.operatingTemperature}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 p-4 hover:bg-slate-50/70 transition-colors">
                <span className="text-[13px] font-bold text-slate-500">Temperature Coefficient</span>
                <span className="sm:col-span-2 text-[14px] font-medium text-slate-800">{panel.specs.temperatureCoefficient}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 p-4 hover:bg-slate-50/70 transition-colors">
                <span className="text-[13px] font-bold text-slate-500">Max System Voltage</span>
                <span className="sm:col-span-2 text-[14px] font-medium text-slate-800">{panel.specs.maxSystemVoltage}</span>
              </div>

              {panel.specs.bifaciality && (
                <div className="grid grid-cols-1 sm:grid-cols-3 p-4 hover:bg-slate-50/70 transition-colors bg-emerald-50/30">
                  <span className="text-[13px] font-bold text-forest">Bifaciality Factor</span>
                  <span className="sm:col-span-2 text-[14px] font-extrabold text-forest">{panel.specs.bifaciality}</span>
                </div>
              )}
            </div>
          </div>
          <p className="mt-3 text-[12px] text-slate-500 italic">
            * All values referenced from official manufacturer data sheets. Actual site output may vary depending on local orientation, tilt angle, and shadow conditions.
          </p>
        </div>
      </section>

      {/* ── f) WARRANTY SECTION ── */}
      <section className="py-12 sm:py-16 border-b border-slate-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <span className="text-[12px] font-extrabold uppercase tracking-wider text-forest">
              Long-Term Peace of Mind
            </span>
            <h2 className="mt-1 font-manrope text-[28px] sm:text-[34px] font-black text-forest-deep">
              Comprehensive Dual Warranty Coverage
            </h2>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Product Warranty */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-2 text-forest">
                <ShieldCheck className="h-6 w-6" />
                <span className="text-[12px] font-extrabold uppercase tracking-wider">Product & Workmanship</span>
              </div>
              <p className="mt-2 font-manrope text-[24px] font-extrabold text-slate-900">
                {panel.warranty.product}
              </p>
              <p className="mt-2 text-[14px] text-slate-600">
                Covers any manufacturing defects, micro-crack resistance, glass delamination, and junction box structural failures.
              </p>
            </div>

            {/* Performance Warranty */}
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-6 shadow-sm">
              <div className="flex items-center gap-2 text-forest">
                <Award className="h-6 w-6" />
                <span className="text-[12px] font-extrabold uppercase tracking-wider">Linear Output Guarantee</span>
              </div>
              <p className="mt-2 font-manrope text-[24px] font-extrabold text-forest-deep">
                {panel.warranty.performance}
              </p>
              <ul className="mt-3 space-y-2">
                {panel.warranty.details.map((detail, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-[13.5px] font-medium text-slate-700">
                    <Check className="h-4 w-4 text-forest flex-shrink-0" />
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── g) PM SURYA GHAR SUBSIDY BREAKDOWN ── */}
      <section className="py-12 sm:py-16 bg-amber-50/30 border-b border-amber-200/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 border border-amber-300 px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-amber-950 mb-2">
              <Sparkles className="h-3.5 w-3.5 text-amber-600" />
              <span>Government Direct Benefit</span>
            </span>
            <h2 className="font-manrope text-[28px] sm:text-[34px] font-black text-slate-900">
              {panel.subsidyInfo.maxSubsidy}
            </h2>
            <p className="mt-2 text-[15px] text-slate-700">
              AG POWER manages your end-to-end documentation, DISCOM filings, and portal submission for zero hassle.
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {panel.subsidyInfo.steps.map((st) => (
              <div key={st.step} className="rounded-2xl bg-white border border-amber-200/80 p-5 shadow-xs relative">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-500 font-manrope text-[14px] font-black text-white mb-3">
                  {st.step}
                </span>
                <h3 className="font-manrope text-[16px] font-extrabold text-slate-900">
                  {st.title}
                </h3>
                <p className="mt-2 text-[13px] leading-relaxed text-slate-600">
                  {st.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-xl bg-amber-100/60 border border-amber-200 p-3.5 text-[12.5px] text-amber-900">
            <strong>Note:</strong> {panel.subsidyInfo.note}
          </div>
        </div>
      </section>

      {/* ── h) BEST SUITED FOR ── */}
      <section className="py-12 sm:py-16 border-b border-slate-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <span className="text-[12px] font-extrabold uppercase tracking-wider text-forest">
              Application Matrix
            </span>
            <h2 className="mt-1 font-manrope text-[28px] sm:text-[34px] font-black text-forest-deep">
              Best Suited For
            </h2>
            <p className="mt-2 text-[15px] text-slate-600">
              {panel.bestFor.description}
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            {panel.bestFor.useCases.map((uc, i) => (
              <div
                key={i}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs hover:border-forest hover:shadow-md transition-all"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-forest mb-4">
                  {i === 0 ? <Home className="h-5 w-5" /> : i === 1 ? <Building2 className="h-5 w-5" /> : <Sparkles className="h-5 w-5" />}
                </div>
                <h3 className="font-manrope text-[16.5px] font-bold text-slate-900">
                  {uc}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── j) FAQ ACCORDION ── */}
      <section className="py-12 sm:py-16 bg-slate-50/50 border-b border-slate-200/80">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3.5 py-1 text-[11px] font-extrabold uppercase tracking-wider text-forest-deep mb-2">
              <HelpCircle className="h-3.5 w-3.5 text-forest" />
              <span>Got Questions?</span>
            </span>
            <h2 className="font-manrope text-[28px] sm:text-[34px] font-black text-forest-deep">
              Frequently Asked Questions
            </h2>
            <p className="mt-2 text-[15px] text-slate-600">
              Clear answers regarding pricing, warranty claims, subsidy, and desert heat performance.
            </p>
          </div>

          <div className="mt-8 space-y-3">
            {panel.faqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden transition-colors"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="flex w-full items-center justify-between p-5 text-left transition-colors hover:bg-slate-50/70"
                    aria-expanded={isOpen}
                  >
                    <span className="font-manrope text-[16px] font-extrabold text-slate-900 pr-4">
                      {faq.question}
                    </span>
                    <ChevronDown
                      className={`h-5 w-5 text-forest flex-shrink-0 transition-transform duration-200 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-[14.5px] leading-relaxed text-slate-700 border-t border-slate-100">
                      {faq.answer}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── k) RELATED PANELS ── */}
      <section className="py-12 sm:py-16 border-b border-slate-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-[12px] font-extrabold uppercase tracking-wider text-forest">
                Compare Alternatives
              </span>
              <h2 className="mt-1 font-manrope text-[28px] sm:text-[34px] font-black text-forest-deep">
                Explore Other Tier-1 Modules
              </h2>
            </div>
            <LocalizedClientLink
              href="/solar-panels"
              className="inline-flex items-center gap-1.5 font-inter text-[14px] font-bold text-forest hover:underline"
            >
              <span>View All Panels Catalogue</span>
              <ArrowRight className="h-4 w-4" />
            </LocalizedClientLink>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            {relatedPanels.map((rp) => (
              <LocalizedClientLink
                key={rp.slug}
                href={`/solar-panels/${rp.slug}`}
                className="group flex flex-col sm:flex-row items-center gap-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs hover:border-forest hover:shadow-md transition-all"
              >
                <div className="relative h-44 w-full sm:w-44 overflow-hidden rounded-xl bg-slate-900 flex-shrink-0">
                  <Image
                    src={rp.images[0].src}
                    alt={rp.name}
                    fill
                    sizes="180px"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-2 left-2 rounded-full bg-forest px-2.5 py-0.5 text-[10px] font-extrabold text-white">
                    {rp.efficiency}
                  </div>
                </div>

                <div className="flex-1">
                  <span className="text-[11.5px] font-bold uppercase tracking-wider text-forest">
                    {rp.brand}
                  </span>
                  <h3 className="font-manrope text-[18px] font-black text-slate-900 group-hover:text-forest transition-colors">
                    {rp.name}
                  </h3>
                  <p className="mt-1 text-[13px] font-semibold text-slate-500">
                    {rp.technology} • {rp.wattageRange}
                  </p>
                  <p className="mt-2 text-[13.5px] line-clamp-2 text-slate-600">
                    {rp.tagline}
                  </p>
                  <span className="mt-3 inline-flex items-center gap-1 text-[13px] font-bold text-forest group-hover:translate-x-1 transition-transform">
                    <span>View Specifications</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </LocalizedClientLink>
            ))}
          </div>
        </div>
      </section>

      {/* ── l) BOTTOM DISCLAIMER ── */}
      <div className="bg-slate-50 py-6 border-b border-slate-200/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center text-[12.5px] text-slate-500">
          <p>
            Disclaimer: Savings, ROI aur generation site conditions, usage aur system size par depend karte hain.
            Electricity offset calculations are estimates based on standard testing conditions (STC: 1000 W/m², AM 1.5, 25°C).
          </p>
        </div>
      </div>

      {/* ── m) MOBILE STICKY CTA BAR (Bottom fixed for mobile screens) ── */}
      <div className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 p-3 shadow-lg md:hidden">
        <div className="flex items-center gap-2">
          <LocalizedClientLink
            href={`/contact?panel=${panel.slug}`}
            className="flex-1 inline-flex min-h-[46px] items-center justify-center rounded-xl bg-forest px-3 py-2 text-center text-[13.5px] font-extrabold text-white shadow-xs active:scale-95"
          >
            <span>Get Free Quote</span>
          </LocalizedClientLink>

          <a
            href={`https://wa.me/919523467849?text=Hi%20AG%20POWER%2C%20I%20want%20details%20for%20${encodeURIComponent(panel.name)}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp enquiry"
            className="flex h-[46px] w-[46px] items-center justify-center rounded-xl bg-green-main text-white active:scale-95 flex-shrink-0"
          >
            <svg className="h-5 w-5 fill-white" viewBox="0 0 24 24">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
            </svg>
          </a>

          <a
            href="tel:+919523467849"
            aria-label="Call AG POWER"
            className="flex h-[46px] w-[46px] items-center justify-center rounded-xl border border-slate-300 bg-white text-slate-800 active:scale-95 flex-shrink-0"
          >
            <Phone className="h-5 w-5 text-forest" />
          </a>
        </div>
      </div>

      {/* ── LIGHTBOX MODAL WITH ARROWS & SWIPE GESTURES ── */}
      {isLightboxOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/95 backdrop-blur-md"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Top Bar: Counter & Close */}
          <div className="absolute top-4 inset-x-4 sm:inset-x-6 flex items-center justify-between text-white z-20">
            <div>
              <p className="font-manrope text-[15px] font-extrabold">{panel.name}</p>
              <p className="text-[12px] text-slate-300">{panel.images[lightboxIndex]?.label}</p>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-[13px] font-semibold text-slate-400">
                {lightboxIndex + 1} / {panel.images.length}
              </span>
              <button
                type="button"
                onClick={closeLightbox}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                aria-label="Close image viewer"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>

          {/* Left Arrow Button */}
          <button
            type="button"
            onClick={prevLightboxImage}
            className="absolute left-3 sm:left-6 z-20 flex h-12 w-12 items-center justify-center rounded-full bg-slate-900/80 border border-white/20 text-white hover:bg-slate-800 hover:scale-110 active:scale-95 transition-all"
            aria-label="Previous photo"
          >
            <ChevronLeft className="h-7 w-7" />
          </button>

          {/* Main Enlarge Image */}
          <div className="relative h-[65vh] sm:h-[80vh] w-[90vw] sm:w-[80vw] max-w-5xl overflow-hidden rounded-2xl">
            <Image
              src={panel.images[lightboxIndex].src}
              alt={panel.images[lightboxIndex].alt}
              fill
              className="object-contain"
              sizes="90vw"
              priority
            />
          </div>

          {/* Right Arrow Button */}
          <button
            type="button"
            onClick={nextLightboxImage}
            className="absolute right-3 sm:right-6 z-20 flex h-12 w-12 items-center justify-center rounded-full bg-slate-900/80 border border-white/20 text-white hover:bg-slate-800 hover:scale-110 active:scale-95 transition-all"
            aria-label="Next photo"
          >
            <ChevronRight className="h-7 w-7" />
          </button>

          {/* Bottom Thumbnails in Lightbox */}
          <div className="absolute bottom-4 inset-x-0 flex justify-center gap-2 z-20 px-4 overflow-x-auto">
            {panel.images.map((img, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setLightboxIndex(i)}
                className={`relative h-12 w-16 sm:h-14 sm:w-20 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 ${
                  lightboxIndex === i ? "border-amber-400 scale-105" : "border-white/30 opacity-60 hover:opacity-100"
                }`}
              >
                <Image src={img.src} alt={img.alt} fill sizes="80px" className="object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
