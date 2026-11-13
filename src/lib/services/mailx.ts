/**
 * Purpose: MailX (Mailflare) HTTPS REST API client for Mommantum.
 * Strictly uses HTTPS REST API (no SMTP / Nodemailer), ensuring full compatibility
 * with serverless and cloud hosting platforms like Vercel where SMTP ports are blocked.
 *
 * Endpoint: POST https://mailx.rapidchip.in/api/v1/send
 * Sender: Mommantum <sales@notify.mommantum.com>
 * Recipient: Submitter's email
 * CC: kuldeep@mommantum.com, sharmasaurabh2604@gmail.com
 * Resilience: Automatically retries sending without CC if the CC send fails (e.g., suppression list error).
 */

import "server-only"

export interface MailXInput {
  to: string
  cc?: string[]
  subject: string
  html: string
  text: string
}

export interface MailXResult {
  ok: boolean
  messageId?: string
  error?: string
  retriedWithoutCc?: boolean
}

export const DEFAULT_MAILX_URL = "https://mailx.rapidchip.in"
export const DEFAULT_MAILX_API_KEY = "ep_s-BuOZ4om-8CXQP7p1VYD"
export const DEFAULT_MAILX_MAILBOX_ID = "mbx_nVJOTc9KtoLToxNZwlp0k"
export const DEFAULT_MAIL_FROM = "Mommantum <sales@notify.mommantum.com>"
export const DEFAULT_CALENDAR_URL = "https://calendar.app.google/TFNjVK79KmTMEgsW6"
export const DEFAULT_CC_RECIPIENTS = ["kuldeep@mommantum.com", "sharmasaurabh2604@gmail.com"]

export function getMailXConfig() {
  return {
    url: (process.env.MAILFLARE_URL || process.env.MAILX_URL || DEFAULT_MAILX_URL).replace(/\/+$/, ""),
    apiKey: process.env.MAILFLARE_API_KEY || process.env.MAILX_API_KEY || DEFAULT_MAILX_API_KEY,
    mailboxId: process.env.MAILFLARE_MAILBOX_ID || process.env.MAILX_MAILBOX_ID || DEFAULT_MAILX_MAILBOX_ID,
    from: process.env.MAIL_FROM || process.env.EMAIL_FROM || DEFAULT_MAIL_FROM,
    calendarUrl: process.env.CALENDAR_BOOKING_URL || DEFAULT_CALENDAR_URL,
  }
}

export function isMailXConfigured(): boolean {
  const config = getMailXConfig()
  return Boolean(config.url && config.apiKey && config.mailboxId)
}

/** Formats a timestamp into Indian Standard Time (IST). */
export function formatIST(date = new Date()): string {
  try {
    return (
      date.toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      }) + " IST"
    )
  } catch {
    return date.toISOString()
  }
}

async function postMailX(
  config: ReturnType<typeof getMailXConfig>,
  input: MailXInput,
  includeCc: boolean
): Promise<{ ok: boolean; messageId?: string; error?: string }> {
  const payload: Record<string, unknown> = {
    mailboxId: config.mailboxId,
    from: config.from,
    to: input.to,
    subject: input.subject,
    html: input.html,
    text: input.text,
  }

  if (includeCc && input.cc && input.cc.length > 0) {
    payload.cc = input.cc
  }

  const res = await fetch(`${config.url}/api/v1/send`, {
    method: "POST",
    headers: {
      authorization: `Bearer ${config.apiKey}`,
      "content-type": "application/json",
    },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(15_000),
  })

  if (!res.ok) {
    const errText = await res.text().catch(() => "")
    return { ok: false, error: `MailX HTTP ${res.status}: ${errText.slice(0, 300)}` }
  }

  const data = (await res.json().catch(() => ({}))) as { messageId?: string }
  return { ok: true, messageId: data.messageId }
}

/**
 * Sends an email via MailX HTTPS REST API with built-in resilience.
 * If sending with CC fails (e.g. suppression list error), automatically retries sending to the primary recipient alone.
 */
export async function sendMailX(input: MailXInput): Promise<MailXResult> {
  const config = getMailXConfig()
  const hasCc = Boolean(input.cc && input.cc.length > 0)

  try {
    const firstAttempt = await postMailX(config, input, hasCc)
    if (firstAttempt.ok) {
      return { ok: true, messageId: firstAttempt.messageId }
    }

    if (hasCc) {
      console.warn("MailX send with CC failed, retrying primary recipient alone:", firstAttempt.error)
      const secondAttempt = await postMailX(config, input, false)
      if (secondAttempt.ok) {
        return { ok: true, messageId: secondAttempt.messageId, retriedWithoutCc: true }
      }
      return { ok: false, error: secondAttempt.error }
    }

    return { ok: false, error: firstAttempt.error }
  } catch (err) {
    if (hasCc) {
      console.warn("MailX exception with CC, retrying primary recipient alone:", err)
      try {
        const secondAttempt = await postMailX(config, input, false)
        if (secondAttempt.ok) {
          return { ok: true, messageId: secondAttempt.messageId, retriedWithoutCc: true }
        }
        return { ok: false, error: secondAttempt.error }
      } catch (retryErr) {
        return { ok: false, error: retryErr instanceof Error ? retryErr.message : "Retry failed" }
      }
    }
    return { ok: false, error: err instanceof Error ? err.message : "MailX send failed" }
  }
}

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
}

/**
 * Builds the branded confirmation email HTML & plaintext for a contact inquiry.
 */
export function buildContactConfirmationEmail(lead: {
  name: string
  email: string
  subject: string
  message: string
  phone?: string | null
  timestampIST?: string
}): { html: string; text: string; subject: string } {
  const istTime = lead.timestampIST || formatIST()
  const config = getMailXConfig()
  const calendarBookingUrl = config.calendarUrl
  const safeName = escapeHtml(lead.name)
  const safeSubject = escapeHtml(lead.subject)
  const safeMessage = escapeHtml(lead.message)
  const safePhone = lead.phone ? escapeHtml(lead.phone) : null

  const emailSubject = `Thank you for contacting Mommantum – Strategy Session & Confirmation`

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Thank You for Contacting Mommantum</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f3f4f6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6; padding: 36px 16px;">
    <tr>
      <td align="center">
        <table width="620" cellpadding="0" cellspacing="0" style="max-width: 620px; width: 100%; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.06); border: 1px solid #e2e8f0;">
          
          <!-- BRAND ACCENT BAR -->
          <tr>
            <td style="height: 5px; background: linear-gradient(90deg, #e61e73 0%, #ff4081 50%, #0e2547 100%);"></td>
          </tr>

          <!-- HEADER -->
          <tr>
            <td style="background-color: #0e2547; padding: 30px 36px; text-align: left;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td valign="middle">
                    <span style="font-size: 24px; font-weight: 800; color: #ffffff; letter-spacing: -0.03em;">
                      Mommantum<span style="color: #e61e73;">.</span>
                    </span>
                  </td>
                  <td align="right" valign="middle">
                    <span style="color: #cbd5e1; font-size: 12px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase;">
                      Creative &amp; Growth Studio
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- MAIN CONTENT -->
          <tr>
            <td style="padding: 36px 36px 28px 36px;">
              <h1 style="font-size: 22px; font-weight: 800; color: #0e2547; margin: 0 0 14px 0; line-height: 1.3;">
                Thank you for contacting Mommantum!
              </h1>

              <p style="font-size: 15px; line-height: 1.6; color: #475569; margin: 0 0 20px 0;">
                Hi <strong>${safeName}</strong>,<br/>
                We have received your message regarding <strong>${safeSubject}</strong>. Our team is excited to learn more about your brand and explore how we can help you scale.
              </p>

              <!-- CALENDAR BOOKING CARD -->
              <div style="background: linear-gradient(180deg, #fdf2f7 0%, #fce7f3 100%); border-radius: 14px; border: 1px solid #fbcfe8; padding: 26px 24px; margin: 26px 0; text-align: center;">
                <div style="display: inline-block; background-color: #e61e73; color: #ffffff; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; padding: 4px 12px; border-radius: 999px; margin-bottom: 12px;">
                  Priority Step
                </div>
                <h2 style="color: #0e2547; font-size: 19px; font-weight: 800; margin: 0 0 8px 0;">
                  📅 Book Your 1-on-1 Strategy &amp; Discovery Session
                </h2>
                <p style="font-size: 14px; color: #64748b; margin: 0 0 20px 0; line-height: 1.55; max-width: 480px; margin-left: auto; margin-right: auto;">
                  Skip the back-and-forth. Pick a 20–30 minute slot with our founders to map out your campaign roadmap, creative production, and growth targets.
                </p>
                <a href="${calendarBookingUrl}" target="_blank" rel="noopener noreferrer" style="display: inline-block; background-color: #e61e73; color: #ffffff; font-size: 15px; font-weight: 700; text-decoration: none; padding: 14px 32px; border-radius: 10px; box-shadow: 0 6px 18px rgba(230, 30, 115, 0.35);">
                  Book Strategy Slot (10 AM &ndash; 6 PM IST) &rarr;
                </a>

                <!-- MEETING RULES & PARAMETERS -->
                <div style="margin-top: 20px; padding-top: 16px; border-top: 1px dashed #f472b6; font-size: 12.5px; color: #831843; text-align: left; line-height: 1.6;">
                  <strong>⚡ Scheduling Rules &amp; Guidelines:</strong>
                  <ul style="margin: 6px 0 0 0; padding-left: 20px;">
                    <li><strong>Availability:</strong> 10:00 AM &ndash; 6:00 PM IST (Mon &ndash; Sat)</li>
                    <li><strong>Advance Window:</strong> Maximum 4-day advance booking window</li>
                    <li><strong>Buffer:</strong> 1-hour buffer gap maintained between client calls</li>
                    <li><strong>Double-Booking:</strong> Real-time calendar slot lock prevents double-booking</li>
                  </ul>
                </div>
              </div>

              <!-- MEETING PARTICIPANTS BOX -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 26px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #f8fafc; padding: 18px;">
                <tr>
                  <td>
                    <p style="font-size: 13.5px; font-weight: 700; color: #0e2547; margin: 0 0 8px 0;">
                      👥 Meeting Participants Included on the Invitation:
                    </p>
                    <ul style="margin: 0; padding-left: 20px; font-size: 13px; color: #475569; line-height: 1.7;">
                      <li><strong>Kuldeep Ahir:</strong> <a href="mailto:ahirkuldeep1709@gmail.com" style="color: #e61e73; text-decoration: none;">ahirkuldeep1709@gmail.com</a></li>
                      <li><strong>Saurabh Sharma:</strong> <a href="mailto:sharmasaurabh2604@gmail.com" style="color: #e61e73; text-decoration: none;">sharmasaurabh2604@gmail.com</a></li>
                    </ul>
                  </td>
                </tr>
              </table>

              <!-- MOMMANTUM SERVICE ECOSYSTEM -->
              <div style="margin: 30px 0;">
                <p style="font-size: 12px; font-weight: 700; text-transform: uppercase; color: #94a3b8; letter-spacing: 0.08em; margin: 0 0 14px 0;">
                  Explore The Mommantum Growth Ecosystem
                </p>
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td width="48%" valign="top" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 16px; margin-bottom: 12px;">
                      <strong style="color: #0e2547; font-size: 14px;">🎬 EDITZ Video Studio</strong>
                      <p style="font-size: 12.5px; color: #64748b; margin: 6px 0 0 0; line-height: 1.5;">
                        High-retention short-form video editing for Reels, TikToks &amp; YouTube Shorts with dynamic motion graphics.
                      </p>
                    </td>
                    <td width="4%"></td>
                    <td width="48%" valign="top" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 16px; margin-bottom: 12px;">
                      <strong style="color: #0e2547; font-size: 14px;">🤖 Blog AI Platform</strong>
                      <p style="font-size: 12.5px; color: #64748b; margin: 6px 0 0 0; line-height: 1.5;">
                        Autonomous AI SEO content engine that writes, verifies, and indexes rank-ready articles.
                        <br/><a href="https://auto-blog.electroglobal.in/" target="_blank" rel="noopener noreferrer" style="color: #e61e73; font-weight: 600; text-decoration: none;">Visit Blog AI &rarr;</a>
                      </p>
                    </td>
                  </tr>
                  <tr><td height="12"></td></tr>
                  <tr>
                    <td width="48%" valign="top" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 16px;">
                      <strong style="color: #0e2547; font-size: 14px;">📈 Performance Marketing</strong>
                      <p style="font-size: 12.5px; color: #64748b; margin: 6px 0 0 0; line-height: 1.5;">
                        High-ROAS Meta &amp; Google ad campaigns, creative testing pipelines, and conversion rate optimization.
                      </p>
                    </td>
                    <td width="4%"></td>
                    <td width="48%" valign="top" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 16px;">
                      <strong style="color: #0e2547; font-size: 14px;">🧠 AI Agentic Workflows</strong>
                      <p style="font-size: 12.5px; color: #64748b; margin: 6px 0 0 0; line-height: 1.5;">
                        Tailored generative AI workflows, intelligent chatbots, and automated operations pipelines.
                      </p>
                    </td>
                  </tr>
                </table>
              </div>

              <!-- DIRECT SUPPORT DETAILS -->
              <div style="border-top: 1px solid #e2e8f0; padding-top: 22px; margin-top: 26px;">
                <p style="font-size: 14.5px; font-weight: 700; color: #0e2547; margin: 0 0 6px 0;">
                  Need immediate support or have urgent questions?
                </p>
                <p style="font-size: 13.5px; color: #475569; margin: 0 0 10px 0; line-height: 1.5;">
                  You can reply directly to this email or reach our leadership team directly:
                </p>
                <table cellpadding="0" cellspacing="0" style="margin: 8px 0;">
                  <tr>
                    <td style="padding: 4px 16px 4px 0;">
                      ✉️ <a href="mailto:kuldeep@mommantum.com" style="color: #e61e73; font-weight: 600; text-decoration: none; font-size: 13.5px;">kuldeep@mommantum.com</a>
                    </td>
                    <td style="padding: 4px 0;">
                      ✉️ <a href="mailto:sharmasaurabh2604@gmail.com" style="color: #e61e73; font-weight: 600; text-decoration: none; font-size: 13.5px;">sharmasaurabh2604@gmail.com</a>
                    </td>
                  </tr>
                </table>
              </div>

              <!-- SUBMISSION RECAP -->
              <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 14px 18px; margin-top: 24px; font-size: 12.5px; color: #64748b; line-height: 1.6;">
                <strong style="color: #334155;">Your Submitted Details:</strong><br/>
                &bull; <strong>Name:</strong> ${safeName}<br/>
                &bull; <strong>Email:</strong> ${escapeHtml(lead.email)}<br/>
                ${safePhone ? `&bull; <strong>Phone:</strong> ${safePhone}<br/>` : ""}
                &bull; <strong>Subject:</strong> ${safeSubject}<br/>
                &bull; <strong>Message:</strong> ${safeMessage}<br/>
                &bull; <strong>Logged At:</strong> ${istTime}
              </div>

            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td style="background-color: #f8fafc; padding: 22px 36px; border-top: 1px solid #e2e8f0; text-align: center; font-size: 12px; color: #94a3b8; line-height: 1.6;">
              &copy; 2026 Mommantum. All rights reserved.<br/>
              B-147, Anand Vihar, Jagatpura, Jaipur-302017, Rajasthan &bull; <a href="https://www.mommantum.com" style="color: #94a3b8; text-decoration: underline;">www.mommantum.com</a><br/>
              Sent automatically from <strong>sales@notify.mommantum.com</strong>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`

  const text = `Thank you for contacting Mommantum!

Hi ${lead.name},

We have received your message regarding "${lead.subject}". Our team is reviewing your requirements.

============================================================
📅 BOOK YOUR 1-ON-1 STRATEGY SESSION (10:00 AM – 6:00 PM IST)
============================================================
Pick a 20–30 minute slot with our founders directly on Google Calendar:
${calendarBookingUrl}

Meeting Rules & Guidelines:
• Availability: 10:00 AM – 6:00 PM IST
• Advance Window: Maximum 4-day advance booking
• Buffer: 1-hour buffer gap between client calls
• Live availability sync prevents double-booking

Session Participants:
• Kuldeep Ahir: ahirkuldeep1709@gmail.com
• Saurabh Sharma: sharmasaurabh2604@gmail.com

============================================================
THE MOMMANTUM GROWTH ECOSYSTEM
============================================================
• EDITZ Video Studio: Short-form video editing, Reels/TikToks & motion graphics (https://www.mommantum.com/editz)
• Full-Stack Services: Performance Marketing, AI Agents, SEO/AEO/GEO & Web Development (https://www.mommantum.com/services)
• Blog AI: Autonomous AI SEO Content Engine (https://auto-blog.electroglobal.in/)
• Creative Strategy & CRO: Brand positioning, funnels and conversion optimization

============================================================
DIRECT SUPPORT & CONTACT
============================================================
If you want to connect now or have any questions:
• kuldeep@mommantum.com
• sharmasaurabh2604@gmail.com

Your Submitted Details:
• Name: ${lead.name}
• Email: ${lead.email}
${lead.phone ? `• Phone: ${lead.phone}\n` : ""}• Subject: ${lead.subject}
• Message: ${lead.message}
• Logged At: ${istTime}

Best regards,
The Mommantum Team
https://www.mommantum.com
sales@notify.mommantum.com`

  return { html, text, subject: emailSubject }
}

