"use client"

/**
 * Purpose: Admin → Products (admin, marketer). Section-by-section editor for the EDITZ and
 * Blog AI product pages. Saved sections override the code defaults; "Reset section to
 * default" removes the override. Data comes from /api/admin/products/[slug].
 */

import { useCallback, useEffect, useRef, useState } from "react"
import { ExternalLink, RefreshCw } from "lucide-react"
import type { ProductSlug } from "@lib/validation/product-pages"
import { EmptyState, ErrorBanner, PageHeader, buttonGhost } from "../_components/ui"
import { PRODUCT_EDITORS, PRODUCT_TABS } from "./_components/section-config"
import { SectionEditor, type ProductResponse } from "./_components/section-editor"

type LoadState = { loading: boolean; error: string | null; data: ProductResponse | null }

const EMPTY: LoadState = { loading: true, error: null, data: null }

export default function ProductsPage() {
  const [slug, setSlug] = useState<ProductSlug>("editz")
  const [state, setState] = useState<Record<ProductSlug, LoadState>>({ editz: EMPTY, "blog-ai": EMPTY })

  const load = useCallback(async (target: ProductSlug) => {
    setState((s) => ({ ...s, [target]: { ...s[target], loading: true, error: null } }))
    try {
      const res = await fetch(`/api/admin/products/${target}`)
      const body = (await res.json().catch(() => null)) as (ProductResponse & { error?: string }) | null
      if (!res.ok || !body) throw new Error(body?.error || (res.status === 403 ? "You do not have access to Products." : "Could not load content"))
      setState((s) => ({ ...s, [target]: { loading: false, error: null, data: body } }))
    } catch (e) {
      setState((s) => ({ ...s, [target]: { loading: false, error: e instanceof Error ? e.message : "Could not load content", data: s[target].data } }))
    }
  }, [])

  // Load each tab once on first view; the Refresh button reloads on demand.
  const requested = useRef<Set<ProductSlug>>(new Set())
  useEffect(() => {
    if (requested.current.has(slug)) return
    requested.current.add(slug)
    void load(slug)
  }, [slug, load])

  // Only the saved section is replaced so unsaved drafts in other sections are kept.
  function applySaved(target: ProductSlug, sectionKey: string, data: ProductResponse) {
    setState((s) => {
      const current = s[target].data
      if (!current) return { ...s, [target]: { loading: false, error: null, data } }
      return {
        ...s,
        [target]: {
          loading: false,
          error: null,
          data: {
            ...current,
            content: { ...current.content, [sectionKey]: data.content[sectionKey] },
            overridden: data.overridden,
            updatedAt: data.updatedAt,
            updatedBy: data.updatedBy,
          },
        },
      }
    })
  }

  const current = state[slug]
  const viewPath = slug === "editz" ? "/editz" : "/blog-ai"

  return (
    <div>
      <PageHeader
        title="Products"
        description="Edit the EDITZ and Blog AI pages section by section. Sections you have not edited use the built-in content, so the design never changes unless you change it."
        actions={
          <>
            <button type="button" className={buttonGhost} onClick={() => void load(slug)} disabled={current.loading}>
              <RefreshCw className={`h-4 w-4 ${current.loading ? "animate-spin" : ""}`} /> Refresh
            </button>
            <a href={viewPath} target="_blank" rel="noreferrer" className={buttonGhost}>
              <ExternalLink className="h-4 w-4" /> View page
            </a>
          </>
        }
      />

      <div role="tablist" aria-label="Product" className="mb-6 inline-flex rounded-xl border border-admin-line bg-admin-panel p-1">
        {PRODUCT_TABS.map((tab) => (
          <button
            key={tab.slug}
            type="button"
            role="tab"
            aria-selected={slug === tab.slug}
            onClick={() => setSlug(tab.slug)}
            className={`rounded-lg px-4 py-2 text-[13px] font-bold transition ${
              slug === tab.slug ? "bg-brand text-white" : "text-slate-400 hover:text-white"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {current.error && <ErrorBanner message={current.error} />}

      {current.data && (
        <p className="mb-4 text-[12px] text-slate-500">
          {current.data.overridden.length} of {PRODUCT_EDITORS[slug].length} sections edited
          {current.data.updatedAt && ` · last saved ${new Date(current.data.updatedAt).toLocaleString()}`}
          {current.data.updatedBy && ` by ${current.data.updatedBy}`}
        </p>
      )}

      {current.loading && !current.data ? (
        <div className="space-y-4">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-20 animate-pulse rounded-2xl border border-admin-line bg-admin-panel/60" />
          ))}
        </div>
      ) : current.data ? (
        <div className="space-y-4">
          {PRODUCT_EDITORS[slug].map((section) => (
            <SectionEditor
              key={`${slug}-${section.key}`}
              slug={slug}
              section={section}
              value={current.data?.content[section.key]}
              overridden={current.data?.overridden.includes(section.key) ?? false}
              onSaved={(data) => applySaved(slug, section.key, data)}
            />
          ))}
        </div>
      ) : (
        !current.error && <EmptyState title="Nothing to show" description="Content could not be loaded." />
      )}
    </div>
  )
}
