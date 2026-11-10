"use client"

/**
 * Purpose: contact form UI. Submits to POST /api/contact, which saves the lead, copies it
 * to the Google Sheet and sends Zoho emails. Markup and styling are unchanged; the form
 * now reports real success or failure instead of always showing success.
 */

import { useEffect, useRef, useState } from "react"
import Link from "next/link"

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY

export default function GoogleFormContact({ source = "contact" }: { source?: "contact" | "editz" | "blog-ai" }) {
  const formRef = useRef<HTMLFormElement | null>(null)

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")
  const [website, setWebsite] = useState("") // honeypot
  const [status, setStatus] = useState("")
  const [isError, setIsError] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!TURNSTILE_SITE_KEY || document.getElementById("cf-turnstile-script")) return
    const script = document.createElement("script")
    script.id = "cf-turnstile-script"
    script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js"
    script.async = true
    script.defer = true
    document.head.appendChild(script)
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setStatus("")
    setIsError(false)

    const turnstileToken =
      (formRef.current?.querySelector('input[name="cf-turnstile-response"]') as HTMLInputElement | null)?.value || undefined

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          subject,
          message,
          website,
          source,
          sourcePage: window.location.pathname,
          consent: true,
          turnstileToken,
        }),
      })
      const data = await res.json().catch(() => null)

      if (res.ok && data?.success) {
        setStatus("Message sent successfully! We will get back to you within one business day.")
        setName("")
        setEmail("")
        setSubject("")
        setMessage("")
      } else {
        setIsError(true)
        setStatus(data?.error || "Something went wrong. Please try again.")
      }
    } catch {
      setIsError(true)
      setStatus("Network error. Please check your connection and try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto mt-10 max-w-[960px] rounded-[22px] bg-white p-7 shadow-[0_18px_50px_rgba(0,0,0,0.07)] lg:p-10">
      <form ref={formRef} onSubmit={handleSubmit} noValidate={false}>
        {/* Honeypot: hidden from people, filled by bots */}
        <div aria-hidden="true" style={{ position: "absolute", left: "-10000px", width: 1, height: 1, overflow: "hidden" }}>
          <label>
            Website
            <input type="text" name="website" tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
          </label>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-5">
            <div>
              <label className="mb-1.5 block text-[12px] font-bold uppercase tracking-[0.05em] text-navy">
                Name *
              </label>
              <input
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-[50px] w-full rounded-[12px] border border-slate-200 bg-field px-4 text-[14px] text-slate-700 outline-none transition-all placeholder:text-slate-400 focus:border-accent-sky focus:ring-2 focus:ring-accent-sky/30"
                required
                suppressHydrationWarning={true}
              />
            </div>

            <div>
              <label className="mb-1.5 block text-[12px] font-bold uppercase tracking-[0.05em] text-navy">
                Email Address *
              </label>
              <input
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-[50px] w-full rounded-[12px] border border-slate-200 bg-field px-4 text-[14px] text-slate-700 outline-none transition-all placeholder:text-slate-400 focus:border-accent-sky focus:ring-2 focus:ring-accent-sky/30"
                required
                suppressHydrationWarning={true}
              />
            </div>

            <div>
              <label className="mb-1.5 block text-[12px] font-bold uppercase tracking-[0.05em] text-navy">
                Subject *
              </label>
              <input
                type="text"
                placeholder="Project inquiry"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="h-[50px] w-full rounded-[12px] border border-slate-200 bg-field px-4 text-[14px] text-slate-700 outline-none transition-all placeholder:text-slate-400 focus:border-accent-sky focus:ring-2 focus:ring-accent-sky/30"
                required
                suppressHydrationWarning={true}
              />
            </div>
          </div>

          <div className="space-y-5">
            <div>
              <label className="mb-1.5 block text-[12px] font-bold uppercase tracking-[0.05em] text-navy">
                Message *
              </label>
              <textarea
                placeholder="Tell us about your brand, goals, or what help you need..."
                rows={9}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full rounded-[12px] border border-slate-200 bg-field px-4 py-3 text-[14px] text-slate-700 outline-none transition-all placeholder:text-slate-400 focus:border-accent-sky focus:ring-2 focus:ring-accent-sky/30"
                required
                suppressHydrationWarning={true}
              />
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-5">
          <div className="text-[13px] text-slate-600">
            <p>
              By sending this form you agree we may contact you about your enquiry. See our{" "}
              <Link href="/privacy-policy" className="underline underline-offset-2 hover:text-brand">
                privacy policy
              </Link>
              .
            </p>
            {TURNSTILE_SITE_KEY && <div className="cf-turnstile mt-3" data-sitekey={TURNSTILE_SITE_KEY} />}
          </div>

          <button
            type="submit"
            className="inline-flex h-[50px] items-center justify-center rounded-[12px] bg-brand px-8 text-[14px] font-extrabold uppercase tracking-[0.03em] text-white transition-all duration-300 hover:bg-brand-hover"
            disabled={loading}
            suppressHydrationWarning={true}
          >
            {loading ? "Sending..." : "Send Message"}
            <span className="ml-2.5 text-[18px] leading-none">›</span>
          </button>
        </div>
      </form>

      {status && (
        <p role="status" className={`mt-4 text-center font-medium ${isError ? "text-red-600" : "text-green-600"}`}>
          {status}
        </p>
      )}
    </div>
  )
}