"use client"

/**
 * Purpose: Admin → Settings (owner / admin): site details, theme colours (centralised design
 * tokens, applied without a redeploy), and integration health with an SMTP test.
 */

import { useEffect, useState } from "react"
import { CheckCircle2, CircleAlert, Send } from "lucide-react"
import { THEME_TOKENS } from "@lib/theme/theme-tokens"
import { Card, ErrorBanner, PageHeader, buttonGhost, buttonPrimary, inputClass } from "../_components/ui"

type Integration = { key: string; label: string; ok: boolean; detail: string }

const SITE_FIELDS: { key: string; label: string; placeholder: string }[] = [
  { key: "site_name", label: "Site name", placeholder: "Mommantum" },
  { key: "twitter_handle", label: "X / Twitter handle", placeholder: "@mommantum" },
  { key: "default_og_image", label: "Default share image URL (1200×630)", placeholder: "https://www.mommantum.com/opengraph-image.jpg" },
  { key: "leads_sheet_url", label: "Leads Google Sheet URL", placeholder: "https://docs.google.com/spreadsheets/d/…" },
  { key: "google_site_verification", label: "Google Search Console verification code", placeholder: "abc123…" },
]

export default function SettingsPage() {
  const [site, setSite] = useState<Record<string, string>>({})
  const [theme, setTheme] = useState<Record<string, string>>({})
  const [integrations, setIntegrations] = useState<Integration[]>([])
  const [ownerEmail, setOwnerEmail] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetch("/api/admin/seo/site")
      .then((r) => r.json())
      .then((d) => {
        const s = d.setting || {}
        setSite(Object.fromEntries(SITE_FIELDS.map((f) => [f.key, s[f.key] || ""])))
        setTheme(s.theme_tokens || {})
      })
      .catch(() => setError("Could not load site settings"))
    fetch("/api/admin/settings/integrations")
      .then(async (r) => {
        if (!r.ok) throw new Error()
        const d = await r.json()
        setIntegrations(d.integrations)
        setOwnerEmail(d.ownerEmail)
      })
      .catch(() => setError("Settings are available to the owner and admins only."))
  }, [])

  async function save(payload: Record<string, unknown>, okMessage: string) {
    setSaving(true)
    setError(null)
    setNotice(null)
    try {
      const res = await fetch("/api/admin/seo/site", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Save failed")
      setNotice(okMessage)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed")
    } finally {
      setSaving(false)
    }
  }

  async function testEmail() {
    setNotice(null)
    setError(null)
    const res = await fetch("/api/admin/settings/integrations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "test-email" }),
    })
    const data = await res.json()
    if (res.ok) setNotice(data.message)
    else setError(data.error)
  }

  const groups = Array.from(new Set(THEME_TOKENS.map((t) => t.group)))

  return (
    <div>
      <PageHeader title="Settings" description={`Site details, theme and integrations. Owner account: ${ownerEmail || "—"} (protected).`} />
      {error && <ErrorBanner message={error} />}
      {notice && <div className="mb-6 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-[13px] text-emerald-300">{notice}</div>}

      <div className="grid gap-6 xl:grid-cols-2">
        <Card title="Site details">
          <div className="space-y-4">
            {SITE_FIELDS.map((f) => (
              <label key={f.key} className="block">
                <span className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-slate-400">{f.label}</span>
                <input value={site[f.key] || ""} placeholder={f.placeholder} onChange={(e) => setSite((s) => ({ ...s, [f.key]: e.target.value }))} className={inputClass} />
              </label>
            ))}
            <button
              disabled={saving}
              onClick={() => save(Object.fromEntries(Object.entries(site).map(([k, v]) => [k, v.trim() || null])), "Site details saved.")}
              className={buttonPrimary}
            >
              Save site details
            </button>
          </div>
        </Card>

        <Card title="Integrations">
          <ul className="divide-y divide-admin-line">
            {integrations.map((i) => (
              <li key={i.key} className="flex items-center justify-between gap-3 py-2.5">
                <span className="flex items-center gap-2 text-[13px] text-slate-200">
                  {i.ok ? <CheckCircle2 size={15} className="text-emerald-400" /> : <CircleAlert size={15} className="text-amber-400" />}
                  {i.label}
                </span>
                <span className="text-right text-[11.5px] text-slate-500">{i.detail}</span>
              </li>
            ))}
          </ul>
          <button onClick={testEmail} className={`${buttonGhost} mt-4`}>
            <Send size={14} /> Send test email
          </button>
          <p className="mt-3 text-[11.5px] text-slate-500">Secrets are set in the Vercel environment and are never shown here. See docs/setup-guide.md.</p>
        </Card>
      </div>

      <Card title="Theme colours" className="mt-6">
        <p className="mb-5 text-[12.5px] text-slate-400">
          These colours drive the whole website from one place (src/styles/tokens.css). Changes apply on the next page load without a redeploy. Text colours must keep 4.5:1 contrast on white.
        </p>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {groups.map((group) => (
            <div key={group}>
              <p className="mb-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">{group}</p>
              <div className="space-y-3">
                {THEME_TOKENS.filter((t) => t.group === group).map((t) => {
                  const value = theme[t.key] || t.default
                  return (
                    <label key={t.key} className="flex items-center gap-3">
                      <input type="color" value={value} onChange={(e) => setTheme((s) => ({ ...s, [t.key]: e.target.value }))} className="h-9 w-12 cursor-pointer rounded border border-admin-line bg-transparent" />
                      <span className="flex-1 text-[12.5px] text-slate-200">{t.label}</span>
                      <code className="text-[11px] text-slate-500">{value}</code>
                    </label>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 flex gap-3">
          <button disabled={saving} onClick={() => save({ theme_tokens: theme }, "Theme saved. Reload the site to see it.")} className={buttonPrimary}>Save theme</button>
          <button
            disabled={saving}
            onClick={() => {
              setTheme({})
              save({ theme_tokens: {} }, "Theme reset to the default brand colours.")
            }}
            className={buttonGhost}
          >
            Reset to defaults
          </button>
        </div>
      </Card>
    </div>
  )
}
