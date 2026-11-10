/**
 * Purpose: robots.txt. Every crawler (search engines and AI answer engines, for AEO/GEO)
 * may read the public site; private paths are disallowed for all of them. Preview /
 * staging deployments disallow everything.
 */
import { MetadataRoute } from "next"
import { DEFAULT_BASE_URL } from "@lib/schema/config"
import { isNonProductionDeployment } from "@lib/schema/resolvers/types"

const PRIVATE_PATHS = ["/api/", "/admin", "/admin-login", "/verify-email/", "/reset-password/", "/test-auth/"]

// Answer engines that should be able to read and cite Mommantum (AEO / GEO).
const AI_AGENTS = [
  "GPTBot", "OAI-SearchBot", "ChatGPT-User", "ClaudeBot", "Claude-SearchBot", "Claude-User",
  "PerplexityBot", "Perplexity-User", "Google-Extended", "Applebot-Extended", "Meta-ExternalAgent",
  "cohere-ai", "YouBot", "CCBot",
]

// Aggressive scrapers with no search or answer value.
const BLOCKED_AGENTS = ["MJ12bot", "DotBot", "BLEXBot", "PetalBot", "DataForSeoBot", "ZoominfoBot", "magpie-crawler", "Bytespider"]

export default function robots(): MetadataRoute.Robots {
  if (isNonProductionDeployment()) {
    return { rules: [{ userAgent: "*", disallow: "/" }] }
  }

  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: PRIVATE_PATHS },
      { userAgent: AI_AGENTS, allow: "/", disallow: PRIVATE_PATHS },
      { userAgent: BLOCKED_AGENTS, disallow: "/" },
    ],
    sitemap: `${DEFAULT_BASE_URL}/sitemap.xml`,
    host: DEFAULT_BASE_URL,
  }
}
