"use client"
import { useState } from "react"

import { DEFAULT_BASE_URL as BASE_URL } from "@lib/schema/config"

interface SitemapLink {
  label: string
  url: string
  description: string
  priority: string
  category: string
}

const SITEMAP_LINKS: SitemapLink[] = [
  // Index
  {
    label: "Sitemap Index",
    url: `${BASE_URL}/sitemap.xml`,
    description: "Master sitemap index — lists all sub-sitemaps for search engines",
    priority: "—",
    category: "Index",
  },
  // Sub-Sitemaps
  {
    label: "Static Pages",
    url: `${BASE_URL}/sitemap/pages.xml`,
    description: "Homepage, Services, Work, Blog, About, Contact, Legal pages",
    priority: "0.5 – 1.0",
    category: "Sub-Sitemaps",
  },
  {
    label: "Services",
    url: `${BASE_URL}/sitemap/services.xml`,
    description: "All dynamic service offering pages",
    priority: "0.8",
    category: "Sub-Sitemaps",
  },
  {
    label: "Blog Posts",
    url: `${BASE_URL}/sitemap/blogs.xml`,
    description: "All published blog posts and articles",
    priority: "0.8",
    category: "Sub-Sitemaps",
  },
  {
    label: "Work / Case Studies",
    url: `${BASE_URL}/sitemap/work.xml`,
    description: "All client case studies & portfolio pages",
    priority: "0.8",
    category: "Sub-Sitemaps",
  },
  // Phase 3: Removed store sub-sitemaps (Products, Collections, Categories).
]

const ROBOTS_LINK = `${BASE_URL}/robots.txt`

export default function AdminSitemapPage() {
  const [copied, setCopied] = useState<string | null>(null)

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url)
    setCopied(url)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div className="pb-16">
      {/* ── Page Header (Identical to Pages & Services) ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-[28px] font-extrabold tracking-[-0.04em] text-white">
            Sitemap Manager
          </h1>
          <p className="mt-1 text-[14px] text-slate-400">
            {SITEMAP_LINKS.length} sitemaps total • Live XML sitemaps for Google Search Console & search bots
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <a
            href={`${BASE_URL}/sitemap.xml`}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-[10px] bg-brand px-5 py-2.5 text-[13px] font-bold text-white hover:bg-brand-hover transition-all flex items-center gap-1.5 shrink-0 h-[38px] justify-center"
          >
            View Sitemap Index ↗
          </a>
        </div>
      </div>

      {/* ── Search Console Tip Strip ── */}
      <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-[14px] bg-ink border border-charcoal p-4 text-[13px] text-slate-400">
        <div className="flex items-start sm:items-center gap-3">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-sky-500/10 border border-sky-500/20 text-sky-400 font-bold text-[12px]">
            ℹ
          </span>
          <div>
            <span className="font-semibold text-white">Google Search Console Submission:</span>{" "}
            Paste <code className="text-emerald-400 font-mono bg-admin-code px-2 py-0.5 rounded border border-charcoal text-[12px]">{BASE_URL}/sitemap.xml</code> into Search Console → Sitemaps to index all sub-sitemaps automatically.
          </div>
        </div>
        <a
          href="https://search.google.com/search-console"
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-[8px] border border-charcoal bg-charcoal/50 px-3 py-1.5 text-[12px] font-semibold text-slate-300 hover:text-white hover:border-graphite transition-all shrink-0 self-start sm:self-auto"
        >
          Open Search Console ↗
        </a>
      </div>

      {/* ── Content Table (Identical to Pages & Services) ── */}
      <div className="mt-8 overflow-hidden rounded-[18px] border border-charcoal bg-ink">
        <table className="w-full border-collapse text-left text-[13px]">
          <thead>
            <tr className="border-b border-charcoal text-[11px] font-bold uppercase tracking-[0.05em] text-slate-400">
              <th className="p-4">Sitemap Name</th>
              <th className="p-4">Type</th>
              <th className="p-4">Priority</th>
              <th className="p-4">URL</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-charcoal">
              {SITEMAP_LINKS.map((link) => (
              <tr key={link.url} className="hover:bg-charcoal/40 transition-colors group">
                <td className="p-4 font-semibold text-white">
                  <div className="flex flex-col gap-1">
                    <span className="text-[14px] text-white group-hover:text-brand transition-colors">
                      {link.label}
                    </span>
                    <span className="text-[11.5px] text-slate-400 font-normal">
                      {link.description}
                    </span>
                  </div>
                </td>
                <td className="p-4">
                  <span className="rounded bg-charcoal px-2 py-0.5 text-[11px] font-medium text-slate-300 border border-slate-700/50">
                    {link.category}
                  </span>
                </td>
                <td className="p-4">
                  <span className="rounded bg-admin-chip px-2 py-0.5 text-[11px] font-mono font-semibold text-sky-400 border border-sky-800/40">
                    {link.priority}
                  </span>
                </td>
                <td className="p-4 text-slate-400 font-mono text-[12px] truncate max-w-xs">
                  {link.url.replace(BASE_URL, "")}
                </td>
                <td className="p-4 text-right space-x-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => copyToClipboard(link.url)}
                    className="inline-block rounded-[8px] border border-charcoal bg-charcoal/50 px-3 py-1.5 text-[12px] font-semibold text-white hover:border-graphite hover:bg-charcoal transition-all"
                  >
                    {copied === link.url ? "✓ Copied" : "Copy URL"}
                  </button>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block rounded-[8px] border border-charcoal bg-charcoal/50 px-3 py-1.5 text-[12px] font-semibold text-slate-400 hover:text-slate-300 hover:border-graphite transition-all"
                  >
                    Open ↗
                  </a>
                </td>
              </tr>
            ))}

            {/* robots.txt Row */}
            <tr className="hover:bg-charcoal/40 transition-colors group">
              <td className="p-4 font-semibold text-white">
                <div className="flex flex-col gap-1">
                  <span className="text-[14px] text-white group-hover:text-brand transition-colors">
                    robots.txt
                  </span>
                  <span className="text-[11.5px] text-slate-400 font-normal">
                    Controls search engine and AI crawler access — grants all verified bots access
                  </span>
                </div>
              </td>
              <td className="p-4">
                <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-400 border border-emerald-500/20">
                  Crawler Directive
                </span>
              </td>
              <td className="p-4">
                <span className="rounded bg-admin-chip px-2 py-0.5 text-[11px] font-mono font-semibold text-slate-400 border border-slate-700/50">
                  Global
                </span>
              </td>
              <td className="p-4 text-slate-400 font-mono text-[12px]">
                /robots.txt
              </td>
              <td className="p-4 text-right space-x-2 shrink-0">
                <button
                  type="button"
                  onClick={() => copyToClipboard(ROBOTS_LINK)}
                  className="inline-block rounded-[8px] border border-charcoal bg-charcoal/50 px-3 py-1.5 text-[12px] font-semibold text-white hover:border-graphite hover:bg-charcoal transition-all"
                >
                  {copied === ROBOTS_LINK ? "✓ Copied" : "Copy URL"}
                </button>
                <a
                  href={ROBOTS_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block rounded-[8px] border border-charcoal bg-charcoal/50 px-3 py-1.5 text-[12px] font-semibold text-slate-400 hover:text-slate-300 hover:border-graphite transition-all"
                >
                  Open ↗
                </a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
