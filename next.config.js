/**
 * Purpose: Next.js config — image optimisation, legacy-store redirects, security headers,
 * cache headers and rewrites (sitemap.xml, /api/v1 alias). Type errors fail the build (tsc is clean as of 2026-11-08).
 */

// Content-Security-Policy (review S7). Two parts:
// - ENFORCED: directives that cannot break any page (no plugins, no <base> hijack, no framing
//   by other sites).
// - REPORT-ONLY: the full allowlist (GTM / Google Analytics, Cloudflare Turnstile, Supabase,
//   Google Maps embed, video hosts). Browsers only log violations, so nothing breaks; after a
//   week with a clean console it can be switched to enforced (see docs/setup-guide.md).
const CSP_ENFORCED = ["object-src 'none'", "base-uri 'self'", "frame-ancestors 'self'", "upgrade-insecure-requests"].join("; ")
const SUPABASE_HOSTS = "https://*.supabase.co wss://*.supabase.co"
const GOOGLE_HOSTS = "https://www.googletagmanager.com https://*.google-analytics.com https://*.analytics.google.com https://www.google.com"
const CLARITY_HOSTS = "https://*.clarity.ms https://c.bing.com"
const AD_HOSTS = "https://*.doubleclick.net https://googleads.g.doubleclick.net"
const CSP_REPORT_ONLY = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline' ${GOOGLE_HOSTS} ${CLARITY_HOSTS} ${AD_HOSTS} https://challenges.cloudflare.com`,
  "style-src 'self' 'unsafe-inline'",
  `img-src 'self' data: blob: ${SUPABASE_HOSTS} https://images.unsplash.com ${GOOGLE_HOSTS} ${CLARITY_HOSTS} ${AD_HOSTS} https://*.gstatic.com`,
  "font-src 'self' data:",
  `connect-src 'self' ${SUPABASE_HOSTS} ${GOOGLE_HOSTS} ${CLARITY_HOSTS} ${AD_HOSTS} https://challenges.cloudflare.com`,
  "frame-src 'self' https://challenges.cloudflare.com https://www.google.com https://www.googletagmanager.com https://www.youtube.com https://www.youtube-nocookie.com https://player.vimeo.com https://www.loom.com",
  "media-src 'self' blob: https://*.supabase.co",
  "worker-src 'self' blob:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'self'",
].join("; ")

// Applied to every response.
const SECURITY_HEADERS = [
  { key: "Content-Security-Policy", value: CSP_ENFORCED },
  { key: "Content-Security-Policy-Report-Only", value: CSP_REPORT_ONLY },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin-allow-popups" },
]

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  reactStrictMode: true,
  compress: true,
  poweredByHeader: false,
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [360, 414, 640, 768, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    minimumCacheTTL: 31536000,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        pathname: "/**",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/store",
        destination: "/",
        permanent: true,
      },
      {
        source: "/products/:path*",
        destination: "/",
        permanent: true,
      },
      {
        source: "/collections/:path*",
        destination: "/",
        permanent: true,
      },
      {
        source: "/categories/:path*",
        destination: "/",
        permanent: true,
      },
      {
        source: "/cart",
        destination: "/",
        permanent: true,
      },
      {
        source: "/checkout",
        destination: "/",
        permanent: true,
      },
      {
        source: "/account/:path*",
        destination: "/",
        permanent: true,
      },
      {
        source: "/order/:path*",
        destination: "/",
        permanent: true,
      },
      {
        source: "/terms-of-service",
        destination: "/terms-and-conditions",
        permanent: true,
      },
    ]
  },
  async headers() {
    const isProd = process.env.NODE_ENV === "production"

    const adminHeaders = [
      { source: "/:path*", headers: SECURITY_HEADERS },
      {
        // Auth-related pages must never be cached either.
        source: "/(verify-email|reset-password|test-auth)/:path*",
        headers: [{ key: "Cache-Control", value: "no-store, max-age=0" }],
      },
      {
        // Admin routes must never be cached by any browser or proxy
        source: "/(admin|admin-login|api)/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
          },
          {
            key: "Pragma",
            value: "no-cache",
          },
          {
            key: "Expires",
            value: "0",
          },
        ],
      },
    ]

    // In development mode, apply ONLY the admin/API no-cache rule.
    // Do not set any Cache-Control header for static chunks, images, videos, or HTML pages.
    if (!isProd) {
      return adminHeaders
    }

    return [
      ...adminHeaders,
      {
        // Long-lived cache for all static assets (_next/static) in production only
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        // Public marketing pages caching - strictly excluded for admin and api routes
        source: "/((?!_next/static|_next/image|admin|admin-login|api|favicon.ico|logo.png|images|assets).*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, s-maxage=60, stale-while-revalidate=300",
          },
        ],
      },
      {
        // Cache all local static images and media in /public directory for 1 year in production
        source: "/:path*.(png|jpg|jpeg|gif|webp|svg|ico|mp4|webm)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ]
  },
  async rewrites() {
    return [
      {
        source: "/sitemap.xml",
        destination: "/sitemap",
      },
      {
        // NTF-325: versioned API alias (non-breaking). /api/v1/* is served by the existing
        // /api/* route handlers, so clients can switch to /api/v1 now; route files stay put.
        source: "/api/v1/:path*",
        destination: "/api/:path*",
      },
    ]
  },
}

module.exports = nextConfig
