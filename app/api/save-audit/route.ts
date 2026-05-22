import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(req: Request) {
  const body = await req.json()
  const { auditId, inputs, useCase, teamSize, results } = body

  const totalSavings = results.reduce((sum: number, r: any) => sum + r.monthlySavings, 0)

  const { error } = await supabase.from("leads").insert({
    audit_id: auditId,
    audit_data: { inputs, useCase, teamSize, results },
    total_savings: totalSavings,
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true, auditId })
}