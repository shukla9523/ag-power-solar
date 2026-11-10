/**
 * Purpose: one-time backfill — converts images that ALREADY live in Supabase Storage (old blog,
 * service and case-study images) to WebP and points the database at the new .webp files.
 * New uploads are converted automatically by the app; this script handles what came before.
 *
 * Safe by default:
 *   node scripts/convert-storage-images-to-webp.mjs           → dry run, lists what would change
 *   node scripts/convert-storage-images-to-webp.mjs --apply   → converts + updates rows
 *
 * - Reads NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY from .env.local (or the env).
 * - Only images in YOUR public storage are touched; external URLs are left alone.
 * - Original files stay in storage (nothing is deleted), so this can be re-run or undone.
 * - Social share images (seo_setting og_image / twitter_image) are left as they are.
 */

import fs from "node:fs"
import path from "node:path"
import sharp from "sharp"
import { createClient } from "@supabase/supabase-js"

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1")), "..")
const APPLY = process.argv.includes("--apply")

function loadEnv() {
  const file = path.join(ROOT, ".env.local")
  if (!fs.existsSync(file)) return
  for (const line of fs.readFileSync(file, "utf8").split(/\r?\n/)) {
    const m = /^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/.exec(line)
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "")
  }
}

loadEnv()
const URL_BASE = (process.env.NEXT_PUBLIC_SUPABASE_URL || "").replace(/\/+$/, "")
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
if (!URL_BASE || !KEY) {
  console.error("Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (in .env.local or the environment).")
  process.exit(1)
}
const supabase = createClient(URL_BASE, KEY, { auth: { persistSession: false } })
const PREFIX = `${URL_BASE}/storage/v1/object/public/`
const NON_WEBP = /\.(png|jpe?g|gif)(\?.*)?$/i

function parse(url) {
  if (typeof url !== "string" || !url.startsWith(PREFIX) || !NON_WEBP.test(url)) return null
  const rest = decodeURIComponent(url.slice(PREFIX.length).split("?")[0])
  const i = rest.indexOf("/")
  return i > 0 ? { bucket: rest.slice(0, i), path: rest.slice(i + 1) } : null
}

const converted = new Map()

async function toWebpUrl(url) {
  if (converted.has(url)) return converted.get(url)
  const loc = parse(url)
  if (!loc) return url
  const target = loc.path.replace(/\.(png|jpe?g|gif)$/i, ".webp")
  const newUrl = supabase.storage.from(loc.bucket).getPublicUrl(target).data.publicUrl
  if (APPLY) {
    const { data, error } = await supabase.storage.from(loc.bucket).download(loc.path)
    if (error || !data) {
      console.warn(`  ! could not download ${loc.bucket}/${loc.path} — kept original`)
      converted.set(url, url)
      return url
    }
    const input = Buffer.from(await data.arrayBuffer())
    const meta = await sharp(input, { animated: true }).metadata()
    const webp = await sharp(input, { animated: (meta.pages || 1) > 1 })
      .rotate()
      .resize({ width: 2000, withoutEnlargement: true })
      .webp({ quality: meta.hasAlpha ? 88 : 82, alphaQuality: 90, effort: 5 })
      .toBuffer()
    const up = await supabase.storage.from(loc.bucket).upload(target, webp, { contentType: "image/webp", upsert: true, cacheControl: "31536000" })
    if (up.error) {
      console.warn(`  ! upload failed for ${target} — kept original`)
      converted.set(url, url)
      return url
    }
    console.log(`  ✓ ${loc.bucket}/${loc.path} ${(input.length / 1024).toFixed(0)} KB → ${(webp.length / 1024).toFixed(0)} KB`)
  } else {
    console.log(`  would convert ${loc.bucket}/${loc.path}`)
  }
  converted.set(url, newUrl)
  return newUrl
}

async function rewriteHtml(html) {
  if (typeof html !== "string") return html
  let out = html
  for (const m of Array.from(html.matchAll(/(?:src|srcset)=["']([^"']+)["']/gi))) {
    for (const part of m[1].split(",")) {
      const candidate = part.trim().split(/\s+/)[0]
      if (parse(candidate)) out = out.split(candidate).join(await toWebpUrl(candidate))
    }
  }
  return out
}

async function processTable(table, key, fields) {
  const { data, error } = await supabase.from(table).select(`${key}, ${fields.join(", ")}`)
  if (error) {
    console.warn(`Skipping ${table}: ${error.message}`)
    return 0
  }
  let changed = 0
  for (const row of data || []) {
    const update = {}
    for (const field of fields) {
      const value = row[field]
      if (field === "content") {
        const next = await rewriteHtml(value)
        if (next !== value) update[field] = next
      } else if (Array.isArray(value)) {
        const next = await Promise.all(value.map((v) => toWebpUrl(v)))
        if (JSON.stringify(next) !== JSON.stringify(value)) update[field] = next
      } else if (parse(value)) {
        update[field] = await toWebpUrl(value)
      }
    }
    if (Object.keys(update).length) {
      changed++
      console.log(`${table} ${row[key]}: ${Object.keys(update).join(", ")}`)
      if (APPLY) {
        const { error: upErr } = await supabase.from(table).update(update).eq(key, row[key])
        if (upErr) console.warn(`  ! update failed: ${upErr.message}`)
      }
    }
  }
  return changed
}

async function main() {
  console.log(APPLY ? "Converting storage images to WebP…\n" : "DRY RUN — nothing will change. Add --apply to convert.\n")
  const totals = [
    ["post", await processTable("post", "id", ["featured_image", "image_urls", "content"])],
    ["services", await processTable("services", "slug", ["image"])],
    ["case_studies", await processTable("case_studies", "id", ["image"])],
    ["media_assets", 0],
  ]
  console.log(`\n${converted.size} image(s) ${APPLY ? "converted" : "to convert"}; rows ${APPLY ? "updated" : "to update"}: ${totals.map(([t, n]) => `${t} ${n}`).join(", ")}.`)
  if (APPLY) console.log("Originals were kept in storage. Re-run safely at any time.")
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
