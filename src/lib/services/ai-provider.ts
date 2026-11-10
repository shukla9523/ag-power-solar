/**
 * Purpose: the only module that calls AI models (SOP AI Layer 1).
 *
 * Provider order: Cloudflare Workers AI (through AI Gateway when CLOUDFLARE_AI_GATEWAY is
 * set, for caching, rate limits, spend limits and logs), then OpenAI as a fallback.
 * Every call has a 30 s timeout and 2 retries with backoff. AI_ENABLED=false is the kill
 * switch. Keys live only in env; the browser never calls a provider.
 */

import "server-only"

export const TEXT_MODEL = process.env.CLOUDFLARE_TEXT_MODEL || "@cf/meta/llama-3.3-70b-instruct-fp8-fast"
export const IMAGE_MODEL = process.env.CLOUDFLARE_IMAGE_MODEL || "@cf/black-forest-labs/flux-1-schnell"
const OPENAI_MODEL = process.env.OPENAI_SEO_MODEL || "gpt-4o-mini"

export class AiDisabledError extends Error {
  constructor(message = "AI is disabled or not configured") {
    super(message)
  }
}

export function isAiEnabled(): boolean {
  if (process.env.AI_ENABLED === "false") return false
  return hasCloudflare() || Boolean(process.env.OPENAI_API_KEY)
}

function hasCloudflare(): boolean {
  return Boolean(process.env.CLOUDFLARE_ACCOUNT_ID && process.env.CLOUDFLARE_API_TOKEN)
}

function cloudflareUrl(model: string): string {
  const account = process.env.CLOUDFLARE_ACCOUNT_ID
  const gateway = process.env.CLOUDFLARE_AI_GATEWAY
  return gateway
    ? `https://gateway.ai.cloudflare.com/v1/${account}/${gateway}/workers-ai/${model}`
    : `https://api.cloudflare.com/client/v4/accounts/${account}/ai/run/${model}`
}

async function fetchWithRetry(url: string, init: RequestInit, attempts = 3): Promise<Response> {
  let lastError: unknown
  for (let i = 0; i < attempts; i++) {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), 30_000)
    try {
      const res = await fetch(url, { ...init, signal: controller.signal, cache: "no-store" })
      if (res.ok || (res.status < 500 && res.status !== 429)) return res
      lastError = new Error(`AI provider HTTP ${res.status}`)
    } catch (err) {
      lastError = err
    } finally {
      clearTimeout(timer)
    }
    await new Promise((r) => setTimeout(r, 500 * 2 ** i))
  }
  throw lastError instanceof Error ? lastError : new Error("AI provider unavailable")
}

export interface TextRequest {
  system: string
  user: string
  maxTokens?: number
  temperature?: number
}

/** Returns the raw text answer (callers parse and Zod-validate it). */
export async function generateText(req: TextRequest): Promise<{ text: string; provider: string; model: string }> {
  if (!isAiEnabled()) throw new AiDisabledError()
  const temperature = req.temperature ?? 0.2
  const maxTokens = req.maxTokens ?? 700

  if (hasCloudflare()) {
    const res = await fetchWithRetry(cloudflareUrl(TEXT_MODEL), {
      method: "POST",
      headers: { Authorization: `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: [
          { role: "system", content: req.system },
          { role: "user", content: req.user },
        ],
        max_tokens: maxTokens,
        temperature,
        response_format: { type: "json_object" },
      }),
    })
    if (!res.ok) throw new Error(`Workers AI request failed (${res.status})`)
    const data = (await res.json()) as { result?: { response?: unknown } }
    const response = data.result?.response
    const text = typeof response === "string" ? response : JSON.stringify(response ?? "")
    return { text, provider: "cloudflare", model: TEXT_MODEL }
  }

  const res = await fetchWithRetry("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: OPENAI_MODEL,
      messages: [
        { role: "system", content: req.system },
        { role: "user", content: req.user },
      ],
      max_tokens: maxTokens,
      temperature,
      response_format: { type: "json_object" },
    }),
  })
  if (!res.ok) throw new Error(`OpenAI request failed (${res.status})`)
  const data = (await res.json()) as { choices?: { message?: { content?: string } }[] }
  return { text: data.choices?.[0]?.message?.content || "", provider: "openai", model: OPENAI_MODEL }
}

/** Generates an image with Workers AI. Returns raw bytes (JPEG/PNG) or throws. */
export async function generateImage(prompt: string): Promise<Uint8Array> {
  if (process.env.AI_ENABLED === "false" || !hasCloudflare()) {
    throw new AiDisabledError("Image generation needs CLOUDFLARE_ACCOUNT_ID and CLOUDFLARE_API_TOKEN")
  }
  const res = await fetchWithRetry(cloudflareUrl(IMAGE_MODEL), {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify({ prompt: prompt.slice(0, 2000), steps: 6 }),
  })
  if (!res.ok) throw new Error(`Workers AI image request failed (${res.status})`)

  const contentType = res.headers.get("content-type") || ""
  if (contentType.startsWith("image/")) return new Uint8Array(await res.arrayBuffer())

  const data = (await res.json()) as { result?: { image?: string } }
  if (!data.result?.image) throw new Error("Workers AI returned no image")
  return new Uint8Array(Buffer.from(data.result.image, "base64"))
}

/** Extracts the first JSON object from a model answer. */
export function extractJson(text: string): unknown {
  const trimmed = text.trim()
  try {
    return JSON.parse(trimmed)
  } catch {
    const start = trimmed.indexOf("{")
    const end = trimmed.lastIndexOf("}")
    if (start >= 0 && end > start) return JSON.parse(trimmed.slice(start, end + 1))
    throw new Error("AI answer was not JSON")
  }
}
