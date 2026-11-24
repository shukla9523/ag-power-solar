import { NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@lib/supabase-admin"
import { SOLAR_PANELS } from "@data/panels"

export async function GET(req: NextRequest) {
  try {
    // Attempt to query Supabase products table
    const { data, error } = await supabaseAdmin
      .from("products")
      .select("*")
      .order("created_at", { ascending: true })

    if (!error && data && data.length > 0) {
      return NextResponse.json({ success: true, data })
    }

    // Fallback to static master dataset
    const fallbackData = SOLAR_PANELS.map((p) => ({
      id: p.slug,
      slug: p.slug,
      name: p.name,
      brand: p.brand,
      technology: p.technology,
      wattage_range: p.wattageRange,
      efficiency: p.efficiency,
      overview: p.overview,
      badge: p.badge || null,
      almm_listed: p.almm_listed ?? true,
      dcr_compliant: p.dcr_compliant ?? false,
      datasheet_url: p.datasheetUrl,
      temperature_coefficient: p.specs.temperatureCoefficient,
      product_warranty: p.warranty.product,
      suitable_for: p.bestFor.title,
      gallery: p.images,
      status: "published",
    }))

    return NextResponse.json({ success: true, data: fallbackData })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch products" },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { data, error } = await supabaseAdmin
      .from("products")
      .insert([body])
      .select()
      .single()

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 400 })
    }

    return NextResponse.json({ success: true, data })
  } catch {
    return NextResponse.json({ success: false, error: "Failed to create product" }, { status: 500 })
  }
}
