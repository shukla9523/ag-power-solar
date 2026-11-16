"use client"
import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { supabase } from "@lib/supabase"
import MfaStep from "./MfaStep"
import { SunMedium, ArrowRight, ShieldCheck } from "lucide-react"
import { manrope, inter } from "@lib/fonts"

function AdminLoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [oauthLoading, setOauthLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()

  const [showErrorModal, setShowErrorModal] = useState(false)
  // Second step for accounts with two-factor authentication.
  const [mfaStep, setMfaStep] = useState(false)

  useEffect(() => {
    if (searchParams.get("mfa") === "required") setMfaStep(true)
    const errorParam = searchParams.get("error")
    if (errorParam) {
      setError(errorParam)
      setShowErrorModal(true)
    }
  }, [searchParams])

  function closeErrorModalAndClear() {
    setShowErrorModal(false)
    setError("")
    router.replace(window.location.pathname)
  }

  function redirectToHome() {
    router.push("/")
  }

  async function handleLogin() {
    if (!email.trim() || !password.trim()) {
      setError("Please enter both email and password")
      return
    }

    setLoading(true)
    setError("")

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
        headers: { "Content-Type": "application/json" },
      })

      const data = await res.json()

      if (res.ok && data.mfaRequired) {
        setMfaStep(true)
        return
      }

      if (res.ok) {
        // "/admin-login" → "/admin"; a disguised "/<path>-login" → "/<path>"
        const currentPath = window.location.pathname
        window.location.href = currentPath.endsWith("-login") ? currentPath.slice(0, -"-login".length) : "/admin"
      } else {
        setError(data.error || "Wrong email or password")
        if (data.error && (data.error.includes("pending") || data.error.includes("rejected"))) {
          setShowErrorModal(true)
        }
      }
    } catch {
      setError("Something went wrong. Try again.")
    } finally {
      setLoading(false)
    }
  }

  async function handleGoogleLogin() {
    setOauthLoading(true)
    setError("")
    
    try {
      // Clear stale legacy project cookies so they don't interfere with the new Supabase project
      if (typeof document !== "undefined") {
        document.cookie.split(";").forEach((c) => {
          const name = c.trim().split("=")[0]
          if (name && name.startsWith("sb-") && !name.includes("cjrkmrxpwlvhbujxzajn")) {
            document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`
          }
        })
      }

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/api/auth/callback`,
        },
      })
      if (error) throw error
    } catch (err: any) {
      setError(err.message || "Failed to start Google sign-in")
      setOauthLoading(false)
    }
  }

  return (
    <main className={`flex min-h-screen items-center justify-center bg-ivory ${inter.className}`}>
      <div className="w-full max-w-[420px] rounded-[24px] border border-charcoal/10 bg-white p-8 shadow-[0_18px_50px_rgba(23,63,50,0.08)]">

        {/* Logo */}
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-[44px] w-[44px] items-center justify-center rounded-[12px] bg-forest shadow-sm">
            <SunMedium className="h-6 w-6 text-gold" />
          </div>
          <div>
            <p className={`${manrope.className} text-[18px] font-extrabold text-forest`}>AG POWER</p>
            <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-forest/70">Administration Portal</p>
          </div>
        </div>

        <h1 className={`${manrope.className} text-[26px] font-extrabold tracking-[-0.04em] text-forest`}>
          Administrator Sign In
        </h1>
        <p className="mt-1 text-[14px] text-charcoal/80">
          Sign in with your verified administrative credentials
        </p>

        {mfaStep ? (
          <MfaStep
            onCancel={async () => {
              await fetch("/api/auth/logout", { method: "POST" })
              setMfaStep(false)
              router.replace(window.location.pathname)
            }}
          />
        ) : (
        <div className="mt-8 space-y-4">
          <div>
            <label className="mb-2 block text-[12px] font-bold uppercase tracking-[0.05em] text-forest">
              Admin Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="akashshukla9523@gmail.com"
              suppressHydrationWarning={true}
              className="h-[52px] w-full rounded-[14px] border border-charcoal/15 bg-ivory/50 px-4 text-[14px] text-charcoal outline-none transition-all placeholder:text-charcoal/40 focus:border-forest focus:ring-2 focus:ring-forest/10"
            />
          </div>

          <div>
            <label className="mb-2 block text-[12px] font-bold uppercase tracking-[0.05em] text-forest">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !loading && handleLogin()}
              placeholder="Enter your password"
              suppressHydrationWarning={true}
              className="h-[52px] w-full rounded-[14px] border border-charcoal/15 bg-ivory/50 px-4 text-[14px] text-charcoal outline-none transition-all placeholder:text-charcoal/40 focus:border-forest focus:ring-2 focus:ring-forest/10"
            />
            {error && (
              <p className="mt-2 flex items-center gap-1.5 text-[13px] text-red-600 font-medium">
                <span>⚠️</span> {error}
              </p>
            )}
          </div>

          <button
            onClick={handleLogin}
            disabled={loading || oauthLoading}
            suppressHydrationWarning={true}
            className={`${manrope.className} flex h-[52px] w-full items-center justify-center rounded-[14px] bg-forest text-[14px] font-extrabold uppercase tracking-[0.04em] text-white transition-all hover:bg-forest-deep disabled:opacity-50 cursor-pointer shadow-sm`}
          >
            {loading ? "Signing in..." : "Sign In →"}
          </button>

          <div className="relative my-6 flex items-center justify-center">
            <div className="absolute w-full border-t border-charcoal/10"></div>
            <span className="relative bg-white px-3 text-[12px] font-semibold uppercase tracking-[0.05em] text-charcoal/50">
              Or
            </span>
          </div>

          <button
            onClick={handleGoogleLogin}
            disabled={loading || oauthLoading}
            suppressHydrationWarning={true}
            className="flex h-[52px] w-full items-center justify-center gap-3 rounded-[14px] border border-charcoal/15 bg-white text-[14px] font-bold text-charcoal transition-all hover:bg-ivory disabled:opacity-50 cursor-pointer"
          >
            <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v3.92h6.69c-.29 1.5-.1.14-.1.14 1.13 2.1-1.28 3.52-2.73 4.47l4.22 3.28c2.47-2.28 3.86-5.63 3.86-9.74z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-4.22-3.28c-1.17.78-2.67 1.25-4.47 1.25-3.44 0-6.35-2.32-7.39-5.46L1.51 16.96C3.54 21.01 7.62 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M4.61 13.6c-.26-.78-.41-1.61-.41-2.48s.15-1.7.41-2.48L1.51 5.37C.54 7.3.01 9.47.01 11.72s.53 4.42 1.5 6.35l3.1-2.47z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.62 0 3.54 2.99 1.51 7.04l3.1 2.47c1.04-3.14 3.95-5.46 7.39-5.46z"
              />
            </svg>
            {oauthLoading ? "Connecting..." : "Continue with Google"}
          </button>
        </div>
        )}

        <p className="mt-6 text-center text-[12px] text-charcoal/60">
          This panel is for verified AG POWER administrators only.
        </p>
      </div>

      {/* Premium Error Modal */}
      {showErrorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy/40 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-[420px] rounded-[24px] bg-white p-8 shadow-[0_24px_60px_rgba(14,37,71,0.15)] border border-slate-100 flex flex-col items-center text-center animate-in zoom-in-95 duration-200">
            {/* Icon */}
            {error.includes("rejected") ? (
              <div className="mb-5 flex h-[64px] w-[64px] items-center justify-center rounded-full bg-rose-50 border border-rose-100 text-rose-500">
                <svg className="h-[32px] w-[32px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            ) : (
              <div className="mb-5 flex h-[64px] w-[64px] items-center justify-center rounded-full bg-amber-50 border border-amber-100 text-amber-500">
                <svg className="h-[32px] w-[32px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
            )}

            {/* Title */}
            <h3 className="text-[20px] font-extrabold text-navy tracking-tight">
              {error.includes("rejected")
                ? "Access Request Rejected"
                : error.includes("pending") || error.includes("awaiting")
                ? "Access Request Pending"
                : "Sign In Notice"}
            </h3>

            {/* Description */}
            <p className="mt-3 text-[14px] text-slate-500 leading-relaxed">
              {error.includes("rejected") 
                ? "Your access request to the administrator panel was reviewed and rejected. Please contact an owner or support administrator if you believe this is an error."
                : error.includes("pending") || error.includes("awaiting")
                ? "Your account is awaiting approval by an administrator. After an admin or owner approves your request, you will be able to log in to your dashboard."
                : error
              }
            </p>

            {/* Buttons */}
            <div className="mt-7 flex w-full flex-col gap-3">
              <button
                onClick={closeErrorModalAndClear}
                className="h-[48px] w-full rounded-[12px] bg-navy text-[14px] font-extrabold uppercase tracking-[0.03em] text-white transition-all hover:opacity-90 active:scale-[0.98]"
              >
                Close
              </button>
              <button
                onClick={redirectToHome}
                className="h-[48px] w-full rounded-[12px] border border-slate-200 bg-white text-[14px] font-bold text-slate-600 transition-all hover:bg-slate-50 active:scale-[0.98]"
              >
                Go to Homepage
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}

export default function AdminLogin() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-cloud">
        <div className="w-full max-w-[420px] rounded-[24px] bg-white p-8 text-center text-[14px] text-slate-500">
          Loading login...
        </div>
      </div>
    }>
      <AdminLoginForm />
    </Suspense>
  )
}