/**
 * Purpose: open-redirect protection for "return to" parameters.
 *
 * Only same-site paths are allowed. Browsers treat "/\evil.com" like "//evil.com", so the
 * check compares the resolved origin instead of looking at the string's first characters.
 */
export function safeReturnUrl(to: string | null | undefined, base: string, fallbackPath = "/blog"): URL {
  const fallback = new URL(fallbackPath, base)
  if (!to || !to.startsWith("/") || /[\\\u0000-\u001f]/.test(to)) return fallback
  try {
    const target = new URL(to, base)
    return target.origin === fallback.origin ? target : fallback
  } catch {
    return fallback
  }
}
