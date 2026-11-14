import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { calculateSolarSavings } from "@lib/services/solar-calculator"

const calculatorSchema = z.object({
  category: z.enum(["residential", "commercial", "society"]),
  monthlyBill: z.number().min(500).max(5000000),
  city: z.string().optional(),
  pincode: z.string().optional(),
  monthlyUnits: z.number().optional(),
  rooftopAreaSqFt: z.number().optional(),
  roofType: z.enum(["flat_rcc", "slanted_metal", "tiled"]).optional(),
  electricityTariff: z.number().optional(),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = calculatorSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid calculation input",
          issues: parsed.error.issues,
        },
        { status: 400 }
      )
    }

    const result = calculateSolarSavings(parsed.data)

    return NextResponse.json({
      success: true,
      data: result,
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Calculation failed. Please verify inputs.",
      },
      { status: 500 }
    )
  }
}
