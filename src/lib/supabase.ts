/**
 * Purpose: public (anon key) Supabase client for storefront reads and the browser PKCE flow.
 * Only NEXT_PUBLIC_* values are used, read through @lib/env getPublicEnv() (placeholders
 * keep builds/tests working when env is absent; real requests then fail closed).
 */
import { createClient } from "@supabase/supabase-js"
import { getPublicEnv } from "@lib/env"

const isBrowser = typeof window !== "undefined"

const { supabaseUrl: SUPABASE_URL, supabaseAnonKey: SUPABASE_ANON_KEY } = getPublicEnv()

// Custom cookie storage for PKCE flow verifier sharing with server
const cookieStorage = {
  getItem(key: string) {
    if (!isBrowser) return null
    const name = key + "="
    const decodedCookie = decodeURIComponent(document.cookie)
    const ca = decodedCookie.split(';')
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i]
      while (c.charAt(0) === ' ') {
        c = c.substring(1)
      }
      if (c.indexOf(name) === 0) {
        return c.substring(name.length, c.length)
      }
    }
    return null
  },
  setItem(key: string, value: string) {
    if (!isBrowser) return
    const d = new Date()
    d.setTime(d.getTime() + (2 * 60 * 60 * 1000)) // 2 hours is more than enough for OAuth redirects
    const expires = "expires=" + d.toUTCString()
    const secureFlag = window.location.protocol === "https:" ? "Secure;" : ""
    document.cookie = `${key}=${value};${expires};path=/;SameSite=Lax;${secureFlag}`
  },
  removeItem(key: string) {
    if (!isBrowser) return
    document.cookie = `${key}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;SameSite=Lax;`
  }
}

// Public client — for storefront pages
export const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  {
    auth: {
      flowType: "pkce",
      storage: cookieStorage,
    },
  }
)