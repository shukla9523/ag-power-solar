import { Metadata, Viewport } from "next"
import "styles/globals.css"
import { dmSans as bodyFont, fontVariables } from "@lib/fonts"
import Script from "next/script"
import { DEFAULT_BASE_URL } from "@lib/schema/config"
import { getSiteSetting } from "@lib/data/seo"
import { buildThemeCss } from "@lib/theme/theme-tokens"

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
}

/**
 * Site-wide defaults only. Canonical URLs and robots are set by each page from its own
 * meta object, so no page can inherit the homepage canonical or a site-wide noindex.
 */
export const metadata: Metadata = {
  metadataBase: new URL(DEFAULT_BASE_URL),
  title: "AG POWER | Clean Energy. Smarter Living.",
  description:
    "Power your home and business with smarter solar energy. Make the switch to cleaner energy, reduce electricity expenses and take control of your energy future with AG POWER.",
  applicationName: "AG POWER",
  icons: {
    icon: [
      { url: "/favicon.ico?v=agpower-2", sizes: "32x32" },
      { url: "/favicon-32x32.png?v=agpower-2", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png?v=agpower-2", sizes: "16x16", type: "image/png" },
      { url: "/favicon.png?v=agpower-2", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png?v=agpower-2", sizes: "180x180", type: "image/png" },
    ],
    shortcut: "/favicon.ico?v=agpower-2",
  },
  manifest: "/site.webmanifest",
  formatDetection: { telephone: false },
  ...(process.env.GOOGLE_SITE_VERIFICATION
    ? { verification: { google: process.env.GOOGLE_SITE_VERIFICATION } }
    : {}),
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  // Admin → Settings → Theme overrides (validated hex → CSS variables); empty when unchanged.
  const site = await getSiteSetting().catch(() => null)
  const themeCss = buildThemeCss((site as { theme_tokens?: unknown } | null)?.theme_tokens)
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID

  return (
    <html lang="en-IN" className={fontVariables}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        {themeCss && <style id="theme-tokens" dangerouslySetInnerHTML={{ __html: themeCss }} />}
        {/*
          Google Tag Manager. Loaded only when NEXT_PUBLIC_GTM_ID is explicitly configured.
        */}
        {gtmId && (
          <Script
            id="gtm-script"
            strategy="lazyOnload"
            dangerouslySetInnerHTML={{
              __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${gtmId}');`,
            }}
          />
        )}
        {/* End Google Tag Manager */}

        {/* Development mode cache busting: unregister stale service workers and wipe CacheStorage */}
        {process.env.NODE_ENV !== "production" && (
          <script
            dangerouslySetInnerHTML={{
              __html: `
                if (typeof window !== 'undefined') {
                  if ('serviceWorker' in navigator) {
                    navigator.serviceWorker.getRegistrations().then(function(regs) {
                      for (var i = 0; i < regs.length; i++) {
                        regs[i].unregister();
                      }
                    });
                  }
                  if ('caches' in window) {
                    caches.keys().then(function(names) {
                      for (var i = 0; i < names.length; i++) {
                        caches.delete(names[i]);
                      }
                    });
                  }
                }
              `,
            }}
          />
        )}
      </head>
      <body className={bodyFont.className}>
        {/* Google Tag Manager (noscript) */}
        {gtmId && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
            />
          </noscript>
        )}
        {/* End Google Tag Manager (noscript) */}

        {/* Plain wrapper: each page renders its own <main> landmark. */}
        <div>{props.children}</div>
      </body>
    </html>
  )
}
