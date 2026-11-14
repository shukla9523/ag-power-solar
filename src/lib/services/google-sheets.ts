/**
 * Purpose: copy an AG POWER solar lead into the team's Google Sheet.
 *
 * Implements brief Part 12.2 with 13-column lead structure:
 * 1. Enquiry ID
 * 2. Date and time (IST)
 * 3. Name
 * 4. Phone
 * 5. Email
 * 6. Category (Residential / Commercial / Society)
 * 7. Service (Selected service or panel)
 * 8. City (Location)
 * 9. Monthly bill
 * 10. Source page
 * 11. Enquiry type (Contact / Calculator / Catalogue / Customer Service)
 * 12. Message
 * 13. Status (New / Contacted / Qualified / Closed)
 */

import "server-only"
import { google } from "googleapis"
import { GOOGLE_FORM } from "@lib/config/leads"
import { formatIST } from "./mailx"

export interface SheetLead {
  id: string
  createdAt: string
  name: string
  phone?: string | null
  email: string
  category?: string | null
  service?: string | null
  city?: string | null
  monthlyBill?: string | null
  sourcePage?: string | null
  enquiryType?: string | null
  message: string
  status?: string | null
  // Backward compatibility fields
  subject?: string | null
  source?: string | null
}

export type SheetResult = { ok: true; via: "webhook" | "sheets-api" | "google-form" } | { ok: false; error: string }

function hasWebhook(): boolean {
  return Boolean(process.env.GOOGLE_SHEET_WEBHOOK_URL || process.env.GOOGLE_APPS_SCRIPT_URL)
}

function hasServiceAccount(): boolean {
  return Boolean(process.env.GOOGLE_SHEETS_ID && process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL && process.env.GOOGLE_PRIVATE_KEY)
}

/** Prefixes cells that a spreadsheet could read as a formula, so a CSV/sheet export stays safe. */
export function neutralizeFormula(value: string): string {
  if (!value) return ""
  return /^[=+\-@\t\r]/.test(value) ? `'${value}` : value
}

async function appendViaWebhook(lead: SheetLead): Promise<SheetResult> {
  const webhookUrl = process.env.GOOGLE_SHEET_WEBHOOK_URL || process.env.GOOGLE_APPS_SCRIPT_URL
  if (!webhookUrl) return { ok: false, error: "No Google Sheet Webhook URL configured" }

  const istTimestamp = formatIST(lead.createdAt ? new Date(lead.createdAt) : new Date())
  const payload = {
    enquiryId: lead.id,
    timestamp: istTimestamp,
    name: neutralizeFormula(lead.name),
    phone: lead.phone ? neutralizeFormula(lead.phone) : "",
    email: neutralizeFormula(lead.email),
    category: neutralizeFormula(lead.category || "General"),
    service: neutralizeFormula(lead.service || lead.subject || "Solar Installation"),
    city: neutralizeFormula(lead.city || ""),
    monthlyBill: neutralizeFormula(lead.monthlyBill || ""),
    sourcePage: lead.sourcePage || lead.source || "",
    enquiryType: neutralizeFormula(lead.enquiryType || "Contact"),
    message: neutralizeFormula(lead.message),
    status: lead.status || "New",
  }

  const res = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    redirect: "follow",
    signal: AbortSignal.timeout(15_000),
  })

  if (!res.ok && res.status !== 302) {
    const text = await res.text().catch(() => "")
    return { ok: false, error: `Google Apps Script HTTP ${res.status}: ${text.slice(0, 200)}` }
  }

  return { ok: true, via: "webhook" }
}

async function appendViaApi(lead: SheetLead): Promise<SheetResult> {
  const auth = new google.auth.JWT({
    email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key: (process.env.GOOGLE_PRIVATE_KEY || "").replace(/\\n/g, "\n"),
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  })
  const sheets = google.sheets({ version: "v4", auth })
  const istTimestamp = formatIST(lead.createdAt ? new Date(lead.createdAt) : new Date())

  await sheets.spreadsheets.values.append({
    spreadsheetId: process.env.GOOGLE_SHEETS_ID,
    range: process.env.GOOGLE_SHEETS_RANGE || "Leads!A:M",
    valueInputOption: "RAW",
    insertDataOption: "INSERT_ROWS",
    requestBody: {
      values: [[
        lead.id,
        istTimestamp,
        lead.name,
        lead.phone || "",
        lead.email,
        lead.category || "General",
        lead.service || lead.subject || "Solar Installation",
        lead.city || "",
        lead.monthlyBill || "",
        lead.sourcePage || lead.source || "",
        lead.enquiryType || "Contact",
        lead.message,
        lead.status || "New",
      ].map(neutralizeFormula)],
    },
  })
  return { ok: true, via: "sheets-api" }
}

async function submitGoogleForm(lead: SheetLead): Promise<SheetResult> {
  const body = new URLSearchParams({
    [GOOGLE_FORM.fields.name]: lead.name,
    [GOOGLE_FORM.fields.email]: lead.email,
    [GOOGLE_FORM.fields.subject]: lead.subject || lead.service || "AG POWER Solar Enquiry",
    [GOOGLE_FORM.fields.message]: lead.phone ? `${lead.message}\n\nPhone: ${lead.phone}` : lead.message,
  })
  const res = await fetch(`https://docs.google.com/forms/d/e/${GOOGLE_FORM.id}/formResponse`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
    redirect: "manual",
    signal: AbortSignal.timeout(10_000),
  })
  if (res.status >= 400) return { ok: false, error: `Google Form HTTP ${res.status}` }
  return { ok: true, via: "google-form" }
}

export async function appendLeadToSheet(lead: SheetLead): Promise<SheetResult> {
  try {
    if (hasWebhook()) return await appendViaWebhook(lead)
    return hasServiceAccount() ? await appendViaApi(lead) : await submitGoogleForm(lead)
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message.slice(0, 300) : "Sheet append failed" }
  }
}

export function sheetTarget(): "webhook" | "sheets-api" | "google-form" {
  if (hasWebhook()) return "webhook"
  return hasServiceAccount() ? "sheets-api" : "google-form"
}

export interface GoogleSheetRow {
  id: string
  rowNumber: number
  values: string[]
  record: Record<string, string>
}

export interface GoogleSheetTableData {
  title: string
  sheetId: string
  sheetUrl: string
  headers: string[]
  rows: GoogleSheetRow[]
  totalRows: number
  lastUpdated: string
}

/**
 * Fetches all headers and rows directly from the configured Google Sheet in real-time.
 */
export async function readSheetData(): Promise<GoogleSheetTableData> {
  const spreadsheetId = process.env.GOOGLE_SHEETS_ID
  const sheetUrl = spreadsheetId ? `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit` : ""

  if (!hasServiceAccount() || !spreadsheetId) {
    return {
      title: "Google Sheet",
      sheetId: spreadsheetId || "",
      sheetUrl,
      headers: [],
      rows: [],
      totalRows: 0,
      lastUpdated: new Date().toISOString(),
    }
  }

  const auth = new google.auth.JWT({
    email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key: (process.env.GOOGLE_PRIVATE_KEY || "").replace(/\\n/g, "\n"),
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly", "https://www.googleapis.com/auth/spreadsheets"],
  })
  const sheets = google.sheets({ version: "v4", auth })

  let title = "AG POWER Leads"
  let sheetTab = "Leads"

  try {
    const meta = await sheets.spreadsheets.get({ spreadsheetId })
    title = meta.data.properties?.title || title
    sheetTab = meta.data.sheets?.[0]?.properties?.title || sheetTab
  } catch (err) {
    console.warn("Could not fetch spreadsheet metadata:", err)
  }

  const range = process.env.GOOGLE_SHEETS_RANGE || `${sheetTab}!A1:Z500`
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range,
  })

  const rawValues = res.data.values || []
  if (rawValues.length === 0) {
    return {
      title,
      sheetId: spreadsheetId,
      sheetUrl,
      headers: [],
      rows: [],
      totalRows: 0,
      lastUpdated: new Date().toISOString(),
    }
  }

  const headers = (rawValues[0] || []).map((h: unknown) => String(h).trim()).filter(Boolean)
  const rawRows = rawValues.slice(1)

  const rows: GoogleSheetRow[] = []
  rawRows.forEach((rowArr: unknown[], index: number) => {
    if (!Array.isArray(rowArr) || !rowArr.some((c: unknown) => String(c).trim().length > 0)) {
      return
    }
    const record: Record<string, string> = {}
    const values: string[] = []
    headers.forEach((header: string, colIndex: number) => {
      let cell = rowArr[colIndex] !== undefined && rowArr[colIndex] !== null ? String(rowArr[colIndex]).trim() : ""
      if (cell.startsWith("'")) {
        cell = cell.slice(1)
      }
      record[header] = cell
      values.push(cell)
    })

    rows.push({
      id: `row_${index + 2}`,
      rowNumber: index + 2,
      values,
      record,
    })
  })

  return {
    title,
    sheetId: spreadsheetId,
    sheetUrl,
    headers,
    rows,
    totalRows: rows.length,
    lastUpdated: new Date().toISOString(),
  }
}
