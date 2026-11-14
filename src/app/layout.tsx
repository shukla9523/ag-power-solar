import { Metadata } from "next"
import "styles/globals.css"
import { dmSans as bodyFont, fontVariables } from "@lib/fonts"
import Script from "next/script"
import { DEFAULT_BASE_URL } from "@lib/schema/config"
import { getSiteSetting } from "@lib/data/seo"
import { buildThemeCss } from "@lib/theme/theme-tokens"

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
  formatDetection: { telephone: false },
  ...(process.env.GOOGLE_SITE_VERIFICATION
    ? { verification: { google: process.env.GOOGLE_SITE_VERIFICATION } }
    : {}),
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  // Admin → Settings → Theme overrides (validated hex → CSS variables); empty when unchanged.
  const site = await getSiteSetting().catch(() => null)
  const themeCss = buildThemeCss((site as { theme_tokens?: unknown } | null)?.theme_tokens)

  return (
    <html lang="en-IN" className={fontVariables}>
      <head>
        {themeCss && <style id="theme-tokens" dangerouslySetInnerHTML={{ __html: themeCss }} />}
        {/*
          Google Tag Manager. lazyOnload: GTM is fetched after the window load event, during idle
          time, so it never competes with the LCP image, fonts or hydration. Nothing in the app
          pushes to dataLayer before then; the only cost is that a visitor who leaves before the
          page finishes loading is not counted.
        */}
        <Script
          id="gtm-script"
          strategy="lazyOnload"
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-T375Z2FR');`,
          }}
        />
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
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-T375Z2FR"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        {/* End Google Tag Manager (noscript) */}

        {/* Plain wrapper: each page renders its own <main> landmark. */}
        <div>{props.children}</div>
      </body>
    </html>
  )
}
