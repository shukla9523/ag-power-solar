/**
 * Purpose: guards for the frontend performance/markup pass (self-hosted fonts, visible heroes,
 * single H1, server-rendered EDITZ FAQ answers, lazy videos, server footer, pruned packages).
 * Components are rendered with react-dom/server to check the HTML a crawler receives. Render checks
 * need JSX support in Vitest (tsconfig uses jsx: "preserve"); without `oxc: { jsx: { runtime:
 * "automatic" } }` in vitest.config.mjs they skip, and the source-level checks still run.
 */
import { createElement } from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { readFileSync, existsSync } from "fs"
import path from "path"
import { describe, expect, it, vi, type TestContext } from "vitest"

// next/font is a compile-time transform; outside Next it only needs to return the font shape.
vi.mock("next/font/local", () => ({
  default: (opts: { variable: string }) => ({
    className: "f",
    variable: `v${opts.variable}`,
    style: { fontFamily: "f" },
  }),
}))

const ROOT = path.resolve(__dirname, "../../..")
const read = (p: string) => readFileSync(path.join(ROOT, p), "utf8")
const count = (html: string, re: RegExp) => (html.match(re) || []).length

/** Imports a .tsx module, or skips the test when this Vitest config cannot compile JSX. */
async function load<T>(ctx: TestContext, importer: () => Promise<T>): Promise<T> {
  try {
    return await importer()
  } catch (e) {
    if (/jsx|invalid JS syntax/i.test(String(e))) ctx.skip()
    throw e
  }
}

describe("fonts", () => {
  it("loads no Google Fonts stylesheet and sets lang/en-IN with a plain root wrapper", () => {
    const layout = read("src/app/layout.tsx")
    expect(layout).not.toMatch(/fonts\.googleapis\.com|fonts\.gstatic\.com/)
    expect(layout).toContain('lang="en-IN"')
    expect(layout).toContain("<div>{props.children}</div>")
    expect(layout).not.toMatch(/<main>\{props\.children\}/)
    expect(layout).toMatch(/strategy="lazyOnload"/)
  })

  it("points every next/font/local source at an installed woff2 file", () => {
    const fonts = read("src/lib/fonts.ts")
    const paths = (fonts.match(/"\.\.\/\.\.\/node_modules\/[^"]+\.woff2"/g) || []).map((m) => m.slice(1, -1))
    expect(paths.length).toBeGreaterThanOrEqual(8)
    for (const p of paths) expect(existsSync(path.resolve(ROOT, "src/lib", p)), p).toBe(true)
  })

  it("keeps the font tokens wired to the generated variables", () => {
    const css = read("src/styles/globals.css")
    for (const v of ["--font-display", "--font-ui", "--font-body", "--font-hand"]) {
      expect(css).toContain(`${v}: var(--font-`)
    }
  })
})

describe("headings and above-the-fold visibility", () => {
  it("home hero has exactly one H1 (the keyword line) and no hidden text", async (ctx) => {
    const { default: Hero } = await load(ctx, () => import("@modules/home/components/hero"))
    const html = renderToStaticMarkup(createElement(Hero))
    expect(count(html, /<h1[\s>]/g)).toBe(1)
    expect(html).toMatch(/<h1[^>]*>\s*Performance Marketing &amp; D2C Branding\s*<\/h1>/)
    expect(html).not.toMatch(/opacity:\s*0[;"]/)
  })

  it("EDITZ hero renders its H1 and CTA visible on the server", async (ctx) => {
    const { default: Hero } = await load(ctx, () => import("@modules/editz/components/Hero"))
    const html = renderToStaticMarkup(createElement(Hero))
    expect(count(html, /<h1[\s>]/g)).toBe(1)
    expect(html).not.toMatch(/opacity:\s*0[;"]/)
    expect(html).not.toMatch(/autoplay/i)
    expect(html).toMatch(/preload="none"/)
  })

  it("renderLines keeps a space before every line break", async (ctx) => {
    const { renderLines } = await load(ctx, () => import("@modules/editz/lib/lines"))
    const html = renderToStaticMarkup(createElement("h2", null, renderLines("Built to grow\nyour brand.")))
    expect(html).toBe("<h2>Built to grow <br/>your brand.</h2>")
  })
})

describe("EDITZ", () => {
  it("FAQ renders every answer in the server HTML, collapsed and aria-hidden", async (ctx) => {
    const { default: FAQ } = await load(ctx, () => import("@modules/editz/components/FAQ"))
    const items = [
      { question: "Q one?", answer: "Answer one." },
      { question: "Q two?", answer: "Answer two." },
    ]
    const html = renderToStaticMarkup(createElement(FAQ, { items }))
    expect(html).toContain("Answer one.")
    expect(html).toContain("Answer two.")
    expect(count(html, /aria-expanded="false"/g)).toBe(2)
    expect(count(html, /aria-hidden="true"/g)).toBeGreaterThanOrEqual(2)
  })

  it("imports motion/react, never framer-motion", () => {
    const dir = path.join(ROOT, "src/modules/editz/components")
    for (const f of ["Audience", "Benefits", "CTA", "FAQ", "Hero", "Navbar", "Process", "Projects", "Services", "Testimonials"]) {
      expect(read(path.relative(ROOT, path.join(dir, `${f}.tsx`)))).not.toContain("framer-motion")
    }
  })
})

describe("footer", () => {
  it("is a server component split into files under 400 lines", () => {
    const dir = "src/modules/layout/templates/footer"
    expect(read(`${dir}/index.tsx`)).not.toMatch(/^["']use client["']/m)
    for (const f of ["index.tsx", "MainFooter.tsx", "EditzFooter.tsx", "FooterAccordion.tsx", "FooterSwitch.tsx", "footer-data.ts", "FooterIcons.tsx"]) {
      expect(read(`${dir}/${f}`).split("\n").length, f).toBeLessThan(400)
    }
  })

  it("renders the main footer links and the hidden SEO block", async (ctx) => {
    const { default: MainFooter } = await load(ctx, () => import("@modules/layout/templates/footer/MainFooter"))
    const html = renderToStaticMarkup(createElement(MainFooter))
    expect(html).toContain('href="/services/performance-marketing"')
    expect(html).toContain("Popular Searches")
    expect(html).toContain('aria-expanded="false"')
  })

  it("EDITZ footer text does not join words across line breaks", async (ctx) => {
    const { default: EditzFooter } = await load(ctx, () => import("@modules/layout/templates/footer/EditzFooter"))
    const html = renderToStaticMarkup(createElement(EditzFooter))
    expect(html).toContain("Creation <br/>for Brands")
    expect(html).toContain("idea. <br/>")
  })
})

describe("dependencies", () => {
  it("drops unused packages and pins font + preset versions", () => {
    const pkg = JSON.parse(read("package.json"))
    const all = { ...pkg.dependencies, ...pkg.devDependencies } as Record<string, string>
    for (const name of [
      "@headlessui/react",
      "@radix-ui/react-accordion",
      "webpack",
      "@babel/core",
      "babel-loader",
      "@types/react-instantsearch-dom",
      "@medusajs/ui",
      "@medusajs/icons",
    ]) {
      expect(all[name], name).toBeUndefined()
    }
    expect(all["@medusajs/ui-preset"]).toMatch(/^\d+\.\d+\.\d+$/)
    for (const name of Object.keys(all).filter((n) => n.startsWith("@fontsource"))) {
      expect(all[name], name).toMatch(/^\d+\.\d+\.\d+$/)
    }
  })
})

describe("source-level guards (run without JSX support)", () => {
  it("home hero: the eyebrow is the only H1 and the slogan is a <p>", () => {
    const src = read("src/modules/home/components/hero/index.tsx")
    expect(count(src, /<h1[\s>]/g)).toBe(1)
    expect(src).toMatch(/<h1 className=\{`\$\{mansalva\.className\}[^`]*`\}>\s*Performance Marketing & D2C Branding\s*<\/h1>/)
  })

  it("hub hero headings keep a space before <br />", () => {
    expect(read("src/app/(site)/about/_components/AboutClient.tsx")).toContain('We help D2C brands{" "}')
    expect(read("src/app/(site)/services/_components/ServicesClient.tsx")).toContain('Built to grow{" "}')
  })

  it("EDITZ: FAQ answers are not conditionally mounted and section videos are lazy", () => {
    const faq = read("src/modules/editz/components/FAQ.tsx")
    expect(faq).not.toMatch(/\{isOpen && \(/)
    expect(faq).toContain("{faq.answer}")
    for (const f of ["Hero", "Projects", "Benefits"]) {
      const src = read(`src/modules/editz/components/${f}.tsx`)
      expect(src, f).toContain("<LazyVideo")
      // The only remaining <video> elements are click-opened modals with controls.
      for (const tag of src.match(/<video[\s\S]*?\/>/g) || []) expect(tag, f).toContain("controls")
    }
  })

  it("the empty /blog state still renders an H1", () => {
    const src = read("src/app/(site)/blog/page.tsx")
    const empty = src.slice(src.indexOf("if (!featured)"), src.indexOf("const popular"))
    expect(empty).toMatch(/<h1[\s>]/)
  })
})
