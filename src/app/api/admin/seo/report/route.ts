/**
 * Purpose: on-demand SEO report for the admin panel. ?format=csv downloads it.
 */
import { NextRequest, NextResponse } from "next/server"
import { verifyUserRole } from "@lib/auth-helpers"
import { buildSeoReport } from "@lib/services/seo-report"
import { forbidden, ok, serverError } from "@lib/util/api-response"

export const maxDuration = 60

export async function GET(req: NextRequest) {
  if (!(await verifyUserRole(req, ["admin", "marketer"]))) {
    return forbidden()
  }

  try {
    const report = await buildSeoReport()
    if (req.nextUrl.searchParams.get("format") !== "csv") return ok(report)

    const cell = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`
    const lines = [
      ["Path", "Type", "Score", "Indexable", "Issues"].map(cell).join(","),
      ...report.pages.map((p) =>
        [p.path, p.kind, p.score, p.indexable ? "yes" : "no", p.issues.map((i) => `[${i.severity}] ${i.message}`).join(" | ")]
          .map(cell)
          .join(",")
      ),
    ]
    return new NextResponse(lines.join("\r\n"), {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="mommantum-seo-report-${report.generatedAt.slice(0, 10)}.csv"`,
      },
    })
  } catch {
    return serverError("Could not build the SEO report")
  }
}
