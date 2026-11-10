/**
 * Purpose: CSV export of leads (owner / admin). Cells are escaped and formula-injection safe.
 */
import { NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@lib/supabase-admin"
import { verifyUserRole } from "@lib/auth-helpers"
import { forbidden, serverError } from "@lib/util/api-response"

function csvCell(value: unknown): string {
  let text = value === null || value === undefined ? "" : String(value)
  if (/^[=+\-@\t\r]/.test(text)) text = `'${text}` // stop spreadsheet formula injection
  return `"${text.replace(/"/g, '""')}"`
}

export async function GET(req: NextRequest) {
  if (!(await verifyUserRole(req, ["admin"]))) {
    return forbidden("Only admins can export leads")
  }
  const { data, error } = await supabaseAdmin
    .from("contact_leads")
    .select("created_at, name, email, phone, subject, message, source, source_page, status, notes")
    .order("created_at", { ascending: false })
    .limit(10000)
  if (error) return serverError("Could not export leads")

  const header = ["Date", "Name", "Email", "Phone", "Subject", "Message", "Source", "Page", "Status", "Notes"]
  const rows = (data || []).map((l) =>
    [l.created_at, l.name, l.email, l.phone, l.subject, l.message, l.source, l.source_page, l.status, l.notes].map(csvCell).join(",")
  )
  return new NextResponse([header.map(csvCell).join(","), ...rows].join("\r\n"), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="mommantum-leads-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  })
}
