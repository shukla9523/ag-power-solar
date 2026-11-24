"use client"

import React from "react"
import Link from "next/link"
import {
  X,
  Building2,
  Phone,
  Mail,
  MapPin,
  ExternalLink,
  MessageCircle,
  Globe,
  Instagram,
  Facebook,
  Linkedin,
  Youtube,
  Edit3,
} from "lucide-react"

export interface CompanyProfileData {
  name: string
  legalName?: string
  tagline?: string
  phone?: string
  whatsapp?: string
  email?: string
  address?: string
  googleMapsUrl?: string
  websiteUrl?: string
  socialLinks?: {
    instagram?: string
    facebook?: string
    linkedin?: string
    youtube?: string
  }
}

interface CompanyProfileModalProps {
  isOpen: boolean
  onClose: () => void
  profile: CompanyProfileData | null
}

export default function CompanyProfileModal({
  isOpen,
  onClose,
  profile,
}: CompanyProfileModalProps) {
  if (!isOpen) return null

  const data: CompanyProfileData = profile || {
    name: "AG POWER Solar",
    legalName: "AG POWER (Electro Global)",
    tagline: "Enterprise Solar EPC & Rooftop Solutions",
    phone: "+91 95234 67849",
    whatsapp: "+91 95234 67849",
    email: "akashshukla9523@gmail.com",
    address: "Electro Global, Corporate Office, Patna, Bihar, India",
    googleMapsUrl: "https://maps.google.com/?q=Patna+Bihar+India",
    websiteUrl: "https://agpower.in",
    socialLinks: {
      instagram: "https://instagram.com/agpowersolar",
      facebook: "https://facebook.com/agpowersolar",
      linkedin: "https://linkedin.com/company/agpowersolar",
      youtube: "https://youtube.com/@agpowersolar",
    },
  }

  const cleanWaNumber = (data.whatsapp || "").replace(/\D/g, "")

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Drawer / Modal Container */}
      <div className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-slate-700/80 bg-slate-900 shadow-2xl transition-all">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-[17px] font-extrabold text-white">{data.name}</h2>
              <p className="text-[11px] font-medium text-slate-400">{data.legalName || "Corporate Profile"}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors cursor-pointer"
            title="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="max-h-[75vh] overflow-y-auto px-6 py-5 space-y-5 scrollbar-thin scrollbar-thumb-slate-700 [scrollbar-width:thin]">
          {/* Tagline */}
          {data.tagline && (
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3.5 text-[13px] font-semibold text-emerald-300">
              {data.tagline}
            </div>
          )}

          {/* Contact Details Grid */}
          <div className="space-y-3">
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Official Communication & Presence
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[13px]">
              {data.phone && (
                <a
                  href={`tel:${data.phone.replace(/\s+/g, "")}`}
                  className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-950/60 p-3 text-slate-200 hover:border-emerald-500/50 hover:text-white transition-all group"
                >
                  <Phone className="h-4 w-4 text-emerald-400 group-hover:scale-110 transition-transform" />
                  <div>
                    <span className="block text-[10px] uppercase font-bold text-slate-400">Phone</span>
                    <span className="font-semibold text-slate-200">{data.phone}</span>
                  </div>
                </a>
              )}

              {data.whatsapp && (
                <a
                  href={`https://wa.me/${cleanWaNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-950/60 p-3 text-slate-200 hover:border-emerald-500/50 hover:text-white transition-all group"
                >
                  <MessageCircle className="h-4 w-4 text-emerald-400 group-hover:scale-110 transition-transform" />
                  <div>
                    <span className="block text-[10px] uppercase font-bold text-slate-400">WhatsApp ↗</span>
                    <span className="font-semibold text-slate-200">{data.whatsapp}</span>
                  </div>
                </a>
              )}

              {data.email && (
                <a
                  href={`mailto:${data.email}`}
                  className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-950/60 p-3 text-slate-200 hover:border-emerald-500/50 hover:text-white transition-all group"
                >
                  <Mail className="h-4 w-4 text-sky-400 group-hover:scale-110 transition-transform" />
                  <div className="truncate">
                    <span className="block text-[10px] uppercase font-bold text-slate-400">Email</span>
                    <span className="font-semibold text-slate-200 truncate">{data.email}</span>
                  </div>
                </a>
              )}

              {data.websiteUrl && (
                <a
                  href={data.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-950/60 p-3 text-slate-200 hover:border-emerald-500/50 hover:text-white transition-all group"
                >
                  <Globe className="h-4 w-4 text-purple-400 group-hover:scale-110 transition-transform" />
                  <div>
                    <span className="block text-[10px] uppercase font-bold text-slate-400">Website ↗</span>
                    <span className="font-semibold text-slate-200">agpower.in</span>
                  </div>
                </a>
              )}
            </div>

            {/* Address */}
            {data.address && (
              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3.5 space-y-2">
                <div className="flex items-start gap-3">
                  <MapPin className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
                  <div className="text-[13px]">
                    <span className="block text-[10px] uppercase font-bold text-slate-400">Headquarters / Office</span>
                    <p className="font-medium text-slate-200 mt-0.5">{data.address}</p>
                  </div>
                </div>
                {data.googleMapsUrl && (
                  <div className="pt-1 pl-7">
                    <a
                      href={data.googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-[12px] font-bold text-emerald-400 hover:text-emerald-300 hover:underline"
                    >
                      <span>View on Google Maps</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Social Profiles */}
          {data.socialLinks && Object.values(data.socialLinks).some(Boolean) && (
            <div className="space-y-2.5 pt-1">
              <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Official Channels
              </h3>
              <div className="flex flex-wrap items-center gap-2">
                {data.socialLinks.instagram && (
                  <a
                    href={data.socialLinks.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-950/80 px-3 py-2 text-[12px] font-semibold text-slate-300 hover:border-pink-500/50 hover:text-pink-400 transition-all"
                  >
                    <Instagram className="h-3.5 w-3.5" />
                    <span>Instagram ↗</span>
                  </a>
                )}
                {data.socialLinks.facebook && (
                  <a
                    href={data.socialLinks.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-950/80 px-3 py-2 text-[12px] font-semibold text-slate-300 hover:border-blue-500/50 hover:text-blue-400 transition-all"
                  >
                    <Facebook className="h-3.5 w-3.5" />
                    <span>Facebook ↗</span>
                  </a>
                )}
                {data.socialLinks.linkedin && (
                  <a
                    href={data.socialLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-950/80 px-3 py-2 text-[12px] font-semibold text-slate-300 hover:border-sky-500/50 hover:text-sky-400 transition-all"
                  >
                    <Linkedin className="h-3.5 w-3.5" />
                    <span>LinkedIn ↗</span>
                  </a>
                )}
                {data.socialLinks.youtube && (
                  <a
                    href={data.socialLinks.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-950/80 px-3 py-2 text-[12px] font-semibold text-slate-300 hover:border-red-500/50 hover:text-red-400 transition-all"
                  >
                    <Youtube className="h-3.5 w-3.5" />
                    <span>YouTube ↗</span>
                  </a>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-slate-800 bg-slate-950 px-6 py-3.5">
          <Link
            href="/admin/settings"
            onClick={onClose}
            className="inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-slate-400 hover:text-emerald-400 transition-colors"
          >
            <Edit3 className="h-3.5 w-3.5" />
            <span>Edit in Settings</span>
          </Link>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-slate-800 px-5 py-2 text-[13px] font-bold text-white hover:bg-slate-700 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
