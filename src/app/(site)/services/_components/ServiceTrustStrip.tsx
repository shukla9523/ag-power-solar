"use client"

import React from "react"
import { Award, CheckCircle2, ShieldCheck, Star } from "lucide-react"

export default function ServiceTrustStrip() {
  return (
    <section className="border-y border-emerald-900/10 bg-white py-6 sm:py-8 shadow-2xs">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4 items-center">
          
          {/* Trust Item 1 */}
          {/* TODO: REPLACE WITH REAL NUMBER: Verified total solar installations completed */}
          <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/60 p-3 sm:p-4 transition-all hover:bg-slate-50 hover:border-emerald-200">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-100">
              <CheckCircle2 className="h-6 w-6 text-forest" />
            </div>
            <div>
              <p className="font-manrope text-[18px] sm:text-[20px] font-black tracking-tight text-slate-900">
                500+
              </p>
              <p className="text-[13px] sm:text-[14px] font-medium text-slate-600 leading-tight">
                Installations Completed
              </p>
            </div>
          </div>

          {/* Trust Item 2 */}
          {/* TODO: REPLACE WITH REAL NUMBER: Years of solar EPC & engineering experience */}
          <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/60 p-3 sm:p-4 transition-all hover:bg-slate-50 hover:border-emerald-200">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-100">
              <Award className="h-6 w-6 text-forest" />
            </div>
            <div>
              <p className="font-manrope text-[18px] sm:text-[20px] font-black tracking-tight text-slate-900">
                10+ Years
              </p>
              <p className="text-[13px] sm:text-[14px] font-medium text-slate-600 leading-tight">
                Engineering Experience
              </p>
            </div>
          </div>

          {/* Trust Item 3 */}
          {/* TODO: REPLACE WITH REAL NUMBER: Real verified Google / customer rating */}
          <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/60 p-3 sm:p-4 transition-all hover:bg-slate-50 hover:border-emerald-200">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600 border border-amber-100">
              <Star className="h-6 w-6 fill-amber-400 text-amber-500" />
            </div>
            <div>
              <p className="font-manrope text-[18px] sm:text-[20px] font-black tracking-tight text-slate-900">
                4.9 / 5.0
              </p>
              <p className="text-[13px] sm:text-[14px] font-medium text-slate-600 leading-tight">
                Customer Satisfaction
              </p>
            </div>
          </div>

          {/* Trust Item 4 */}
          {/* TODO: REPLACE WITH REAL ACCREDITATION: Confirm DISCOM & MNRE empaneled channel status */}
          <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/60 p-3 sm:p-4 transition-all hover:bg-slate-50 hover:border-emerald-200">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-100">
              <ShieldCheck className="h-6 w-6 text-forest" />
            </div>
            <div>
              <p className="font-manrope text-[17px] sm:text-[18px] font-black tracking-tight text-slate-900 leading-tight">
                MNRE &amp; DISCOM
              </p>
              <p className="text-[13px] sm:text-[14px] font-medium text-slate-600 leading-tight">
                Empaneled Channel Partner
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
