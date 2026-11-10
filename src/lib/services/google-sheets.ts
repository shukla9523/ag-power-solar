/**
 * Purpose: copy a lead into the team's Google Sheet.
 *
 * Preferred: Sheets API with a service account (GOOGLE_SHEETS_ID, GOOGLE_SERVICE_ACCOUNT_EMAIL,
 * GOOGLE_PRIVATE_KEY; share the sheet with the service-account email as Editor).
 * Fallback: submit the existing Google Form server-side, whose responses sheet the team
 * already uses — works with zero extra setup. Never throws.
 */

import "server-only"
import { google } from "googleapis"
import { GOOGLE_FORM } from "@lib/config/leads"

export interface SheetLead {
  id: string
  createdAt: string
  name: string
  email: string
  phone?: string | null
  subject: string
  message: string
  source: string
  sourcePage?: string | null
}

export type SheetResult = { ok: true; via: "sheets-api" | "google-form" } | { ok: false; error: string }

function hasServiceAccount(): boolean {
  return Boolean(process.env.GOOGLE_SHEETS_ID && process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL && process.env.GOOGLE_PRIVATE_KEY)
}

async function appendViaApi(lead: SheetLead): Promise<SheetResult> {
  const auth = new google.auth.JWT({
    email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key: (process.env.GOOGLE_PRIVATE_KEY || "").replace(/\\n/g, "\n"),
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  })
  const sheets = google.sheets({ version: "v4", auth })
  await sheets.spreadsheets.values.append({
    spreadsheetId: process.env.GOOGLE_SHEETS_ID,
    range: process.env.GOOGLE_SHEETS_RANGE || "Leads!A:I",
    // RAW: visitor text is stored as plain text, never parsed as a formula (=HYPERLINK, =IMPORTXML…).
    valueInputOption: "RAW",
    insertDataOption: "INSERT_ROWS",
    requestBody: {
      values: [[
        lead.createdAt, lead.name, lead.email, lead.phone || "", lead.subject,
        lead.message, lead.source, lead.sourcePage || "", lead.id,
      ].map(neutralizeFormula)],
    },
  })
  return { ok: true, via: "sheets-api" }
}

/** Prefixes cells that a spreadsheet could read as a formula, so a CSV/sheet export stays safe. */
export function neutralizeFormula(value: string): string {
  return /^[=+\-@\t\r]/.test(value) ? `'${value}` : value
}

async function submitGoogleForm(lead: SheetLead): Promise<SheetResult> {
  const body = new URLSearchParams({
    [GOOGLE_FORM.fields.name]: lead.name,
    [GOOGLE_FORM.fields.email]: lead.email,
    [GOOGLE_FORM.fields.subject]: lead.source === "contact" ? lead.subject : `[${lead.source}] ${lead.subject}`,
    [GOOGLE_FORM.fields.message]: lead.phone ? `${lead.message}\n\nPhone: ${lead.phone}` : lead.message,
  })
  const res = await fetch(`https://docs.google.com/forms/d/e/${GOOGLE_FORM.id}/formResponse`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
    redirect: "manual",
    signal: AbortSignal.timeout(10_000),
  })
  // Google answers 200 (or a 3xx to the thank-you page) when the response is recorded.
  if (res.status >= 400) return { ok: false, error: `Google Form HTTP ${res.status}` }
  return { ok: true, via: "google-form" }
}

export async function appendLeadToSheet(lead: SheetLead): Promise<SheetResult> {
  try {
    return hasServiceAccount() ? await appendViaApi(lead) : await submitGoogleForm(lead)
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message.slice(0, 300) : "Sheet append failed" }
  }
}

export function sheetTarget(): "sheets-api" | "google-form" {
  return hasServiceAccount() ? "sheets-api" : "google-form"
}
