/**
 * Purpose: Clients & Leads API for Mommantum Administration.
 * Strictly dynamic: reads headers and rows directly from the connected Google Sheet in real-time.
 * No hardcoding — only entries, rows, and columns available in the Google Sheet are returned.
 */

import { NextRequest } from "next/server"
import { requireSession } from "@lib/auth-helpers"
import { forbidden, ok, fail, serverError } from "@lib/util/api-response"
import { readSheetData, appendLeadToSheet } from "@lib/services/google-sheets"

export async function GET(req: NextRequest) {
  const session = await requireSession(req, ["admin", "marketer"])
  if (!session) return forbidden()

  const params = req.nextUrl.searchParams
  const q = (params.get("q") || "").toLowerCase().trim()
  const sort = params.get("sort") || "desc" // default newest first

  try {
    const sheetData = await readSheetData()

    let rows = [...sheetData.rows]

    // Sort: "desc" shows the newest entries (bottom of the sheet) first; "asc" shows sheet order
    if (sort === "desc") {
      rows.reverse()
    }

    // Dynamic search across all columns in the sheet
    if (q) {
      rows = rows.filter((row) =>
        row.values.some((cell: string) => cell.toLowerCase().includes(q))
      )
    }

    return ok({
      title: sheetData.title,
      sheetId: sheetData.sheetId,
      sheetUrl: sheetData.sheetUrl,
      headers: sheetData.headers,
      rows,
      total: rows.length,
      totalInSheet: sheetData.totalRows,
      lastUpdated: sheetData.lastUpdated,
    })
  } catch (err) {
    return serverError(err instanceof Error ? err.message : "Failed to load Google Sheet data")
  }
}

export async function POST(req: NextRequest) {
  const session = await requireSession(req, ["admin", "marketer"])
  if (!session) return forbidden()

  try {
    const body = await req.json()
    if (!body.name || !body.email) {
      return fail("Name and email are required to add an entry.", "BAD_REQUEST", 400)
    }

    const appendRes = await appendLeadToSheet({
      id: `manual_${Date.now()}`,
      createdAt: new Date().toISOString(),
      name: String(body.name).trim(),
      email: String(body.email).trim().toLowerCase(),
      phone: body.phone ? String(body.phone).trim() : "",
      subject: body.subject ? String(body.subject).trim() : "Direct Entry",
      message: body.message ? String(body.message).trim() : "",
      source: "admin",
      sourcePage: "/admin/clients",
    })

    if (!appendRes.ok) {
      return fail(appendRes.error || "Failed to append to Google Sheet", "SHEET_APPEND_FAILED", 500)
    }

    return ok({ success: true, message: "Entry successfully added to Google Sheet." })
  } catch (err) {
    return serverError(err instanceof Error ? err.message : "Failed to add entry")
  }
}
