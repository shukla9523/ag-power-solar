"use client"

/**
 * Purpose: one collapsible card per product section. Holds a local draft, validates it with
 * the shared Zod schema before saving (the API validates again), saves via PUT and resets
 * the section to its code default via DELETE.
 */

import { useEffect, useState } from "react"
import { ChevronDown, ChevronUp, RotateCcw, Save } from "lucide-react"
import { validateSection, type ProductSlug } from "@lib/validation/product-pages"
import { Card, ErrorBanner, buttonGhost, buttonPrimary } from "../../_components/ui"
import { FieldEditor } from "./field-editors"
import type { SectionDef } from "./section-config"

export type ProductResponse = {
  slug: ProductSlug
  path: string
  content: Record<string, unknown>
  overridden: string[]
  updatedAt: string | null
  updatedBy: string | null
}

type Draft = Record<string, unknown>

function clone(value: unknown): Draft {
  return value && typeof value === "object" ? (JSON.parse(JSON.stringify(value)) as Draft) : {}
}

async function readError(res: Response, fallback: string): Promise<string> {
  const data = (await res.json().catch(() => null)) as { error?: string } | null
  return data?.error || fallback
}

export function SectionEditor({ slug, section, value, overridden, onSaved }: {
  slug: ProductSlug
  section: SectionDef
  value: unknown
  overridden: boolean
  onSaved: (data: ProductResponse) => void
}) {
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState<Draft>(() => clone(value))
  const [dirty, setDirty] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)

  useEffect(() => {
    setDraft(clone(value))
    setDirty(false)
  }, [value])

  function update(key: string, next: unknown) {
    setDraft((d) => ({ ...d, [key]: next }))
    setDirty(true)
    setNotice(null)
  }

  async function save() {
    setError(null)
    setNotice(null)
    const check = validateSection(slug, section.key, draft)
    if (!check.ok) {
      setError(check.error)
      return
    }
    setBusy(true)
    try {
      const res = await fetch(`/api/admin/products/${slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section: section.key, value: check.value }),
      })
      if (!res.ok) throw new Error(await readError(res, "Save failed"))
      onSaved((await res.json()) as ProductResponse)
      setNotice("Saved. The live page updates within a few seconds.")
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed")
    } finally {
      setBusy(false)
    }
  }

  async function reset() {
    if (!window.confirm(`Reset “${section.label}” to the default content? Your edits to this section will be removed.`)) return
    setError(null)
    setNotice(null)
    setBusy(true)
    try {
      const res = await fetch(`/api/admin/products/${slug}?section=${encodeURIComponent(section.key)}`, { method: "DELETE" })
      if (!res.ok) throw new Error(await readError(res, "Reset failed"))
      onSaved((await res.json()) as ProductResponse)
      setNotice("Section reset to the default content.")
    } catch (e) {
      setError(e instanceof Error ? e.message : "Reset failed")
    } finally {
      setBusy(false)
    }
  }

  const status = (
    <div className="flex items-center gap-2">
      <span
        className={`rounded-full px-2.5 py-1 text-[10.5px] font-bold uppercase tracking-[0.06em] ${
          overridden ? "bg-brand/15 text-brand" : "bg-admin-line text-slate-400"
        }`}
      >
        {overridden ? "Edited" : "Default"}
      </span>
      <button type="button" className={buttonGhost} onClick={() => setOpen((o) => !o)} aria-expanded={open}>
        {open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        {open ? "Close" : "Edit"}
      </button>
    </div>
  )

  return (
    <Card title={section.label} action={status}>
      {section.description && <p className="-mt-2 mb-4 text-[12.5px] text-slate-400">{section.description}</p>}
      {open && (
        <div className="space-y-5">
          {error && <ErrorBanner message={error} />}
          {section.fields.map((field) => (
            <FieldEditor
              key={field.key}
              id={`${slug}-${section.key}-${field.key}`}
              field={field}
              value={draft[field.key]}
              onChange={(next) => update(field.key, next)}
            />
          ))}
          <div className="flex flex-wrap items-center gap-2 border-t border-admin-line pt-4">
            <button type="button" className={buttonPrimary} onClick={save} disabled={busy || !dirty}>
              <Save className="h-4 w-4" /> {busy ? "Saving…" : "Save section"}
            </button>
            <button type="button" className={buttonGhost} onClick={reset} disabled={busy || !overridden}>
              <RotateCcw className="h-4 w-4" /> Reset section to default
            </button>
            {dirty && !busy && <span className="text-[12px] text-amber-400">Unsaved changes</span>}
            {notice && <span role="status" className="text-[12px] text-emerald-400">{notice}</span>}
          </div>
        </div>
      )}
    </Card>
  )
}
