"use client"

/**
 * Purpose: second sign-in step for accounts with 2FA — asks for the 6-digit authenticator
 * code and upgrades the session (password and Google sign-in both land here).
 */

import { useState } from "react"

export default function MfaStep({ onCancel }: { onCancel: () => void }) {
  const [code, setCode] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/auth/mfa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "verify", code }),
      })
      const data = await res.json().catch(() => null)
      if (!res.ok) throw new Error(data?.error || "That code is not valid")
      const path = window.location.pathname
      window.location.href = path.endsWith("-login") ? path.slice(0, -"-login".length) : "/admin"
    } catch (err) {
      setError(err instanceof Error ? err.message : "That code is not valid")
      setLoading(false)
    }
  }

  return (
    <form onSubmit={submit} className="mt-8 space-y-4">
      <div>
        <label htmlFor="mfa-code" className="mb-2 block text-[12px] font-bold uppercase tracking-[0.05em] text-forest">
          Authenticator code
        </label>
        <input
          id="mfa-code"
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
          inputMode="numeric"
          autoComplete="one-time-code"
          autoFocus
          placeholder="123456"
          className="h-[52px] w-full rounded-[14px] border border-charcoal/15 bg-ivory/50 px-4 text-center text-[20px] tracking-[0.4em] text-charcoal outline-none transition-all placeholder:text-charcoal/30 focus:border-forest focus:ring-2 focus:ring-forest/10"
        />
        <p className="mt-2 text-[12px] text-charcoal/60">Open your authenticator app and enter the current 6-digit code.</p>
        {error && <p className="mt-2 text-[12.5px] font-semibold text-red-600">⚠️ {error}</p>}
      </div>
      <button
        type="submit"
        disabled={loading || code.length !== 6}
        className="flex h-[52px] w-full items-center justify-center rounded-[14px] bg-forest text-[14px] font-extrabold uppercase tracking-[0.04em] text-white transition-all hover:bg-forest-deep disabled:opacity-50 cursor-pointer shadow-sm"
      >
        {loading ? "Verifying..." : "Verify →"}
      </button>
      <button type="button" onClick={onCancel} className="w-full text-[12.5px] font-semibold text-charcoal/60 hover:text-forest cursor-pointer">
        Use a different account
      </button>
    </form>
  )
}
