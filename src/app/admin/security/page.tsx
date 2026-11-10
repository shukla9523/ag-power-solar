"use client"

/**
 * Purpose: Security page for every admin account — turn two-factor authentication (TOTP)
 * on or off. Reached directly from the sidebar (Settings) or forced via REQUIRE_ADMIN_MFA.
 */

import { useEffect, useState } from "react"
import { ShieldCheck, ShieldOff } from "lucide-react"
import { Card, ErrorBanner, PageHeader, buttonGhost, buttonPrimary, inputClass } from "../_components/ui"

type Status = { enabled: boolean; aal: string; required: boolean; pending: boolean }

export default function SecurityPage() {
  const [status, setStatus] = useState<Status | null>(null)
  const [enrolment, setEnrolment] = useState<{ factorId: string; qrCode: string; secret: string } | null>(null)
  const [code, setCode] = useState("")
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const [setupRequired, setSetupRequired] = useState(false)

  async function load() {
    const res = await fetch("/api/auth/mfa", { cache: "no-store" })
    if (res.ok) setStatus(await res.json())
  }

  useEffect(() => {
    setSetupRequired(new URLSearchParams(window.location.search).get("setup") === "required")
    load()
  }, [])

  async function post(body: Record<string, unknown>) {
    setBusy(true)
    setError(null)
    setNotice(null)
    try {
      const res = await fetch("/api/auth/mfa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Something went wrong")
      return data
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong")
      return null
    } finally {
      setBusy(false)
    }
  }

  async function start() {
    const data = await post({ action: "enroll" })
    if (data) setEnrolment(data)
  }

  async function confirm() {
    const data = await post({ action: "verify", code, factorId: enrolment?.factorId })
    if (data) {
      setEnrolment(null)
      setCode("")
      setNotice("Two-factor authentication is on. You will be asked for a code at every sign-in.")
      await load()
      if (setupRequired) window.location.href = window.location.pathname.replace(/\/security$/, "")
    }
  }

  async function disable() {
    if (!window.confirm("Turn off two-factor authentication for your account?")) return
    const data = await post({ action: "disable", code })
    if (data) {
      setCode("")
      setNotice("Two-factor authentication is off.")
      await load()
    }
  }

  return (
    <div>
      <PageHeader title="Security" description="Protect your admin account with a 6-digit code from an authenticator app (Google Authenticator, Microsoft Authenticator, 1Password, Authy)." />
      {setupRequired && !status?.enabled && (
        <div className="mb-6 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-[13px] text-amber-200">
          Two-factor authentication is required for owner and admin accounts. Set it up to continue.
        </div>
      )}
      {error && <ErrorBanner message={error} />}
      {notice && <div className="mb-6 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-[13px] text-emerald-300">{notice}</div>}

      <Card title="Two-factor authentication" className="max-w-2xl">
        {!status && <div className="h-20 animate-pulse rounded-xl bg-admin-line/40" />}

        {status && status.enabled && (
          <div className="space-y-4">
            <p className="flex items-center gap-2 text-[13.5px] text-emerald-300"><ShieldCheck size={17} /> On — a code is required at every sign-in.</p>
            {!status.required && (
              <div className="flex flex-wrap items-end gap-3">
                <label className="block">
                  <span className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-slate-400">Current code to turn it off</span>
                  <input value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))} inputMode="numeric" autoComplete="one-time-code" placeholder="123456" className={`${inputClass} w-40 tracking-[0.3em]`} />
                </label>
                <button onClick={disable} disabled={busy || code.length !== 6} className={buttonGhost}><ShieldOff size={14} /> Turn off</button>
              </div>
            )}
          </div>
        )}

        {status && !status.enabled && !enrolment && (
          <div className="space-y-4">
            <p className="text-[13.5px] text-slate-300">2FA is off. Anyone with your password (or Google account) could sign in.</p>
            <button onClick={start} disabled={busy} className={buttonPrimary}><ShieldCheck size={15} /> Set up 2FA</button>
          </div>
        )}

        {enrolment && (
          <div className="grid gap-6 sm:grid-cols-[200px_1fr]">
            {/* eslint-disable-next-line @next/next/no-img-element -- data URI QR code from Supabase */}
            <img src={enrolment.qrCode} alt="QR code for your authenticator app" className="h-[200px] w-[200px] rounded-xl bg-white p-2" />
            <div className="space-y-4">
              <ol className="list-decimal space-y-1 pl-5 text-[13px] text-slate-300">
                <li>Open your authenticator app and scan the QR code.</li>
                <li>Or enter this key manually: <code className="break-all text-brand">{enrolment.secret}</code></li>
                <li>Type the 6-digit code it shows.</li>
              </ol>
              <div className="flex flex-wrap items-end gap-3">
                <input value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))} inputMode="numeric" autoComplete="one-time-code" placeholder="123456" className={`${inputClass} w-40 tracking-[0.3em]`} />
                <button onClick={confirm} disabled={busy || code.length !== 6} className={buttonPrimary}>Verify & turn on</button>
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}
