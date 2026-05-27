import { createClient } from "@supabase/supabase-js"
import { Resend } from "resend"
import { NextResponse } from "next/server"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: Request) {
  const { auditId, email, company, role } = await req.json()

  // Save to Supabase
  const { data: leadData, error } = await supabase
    .from("leads")
    .update({ email, company, role })
    .eq("audit_id", auditId)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const totalSavings = leadData?.total_savings ?? 0
  const auditUrl = `${process.env.NEXT_PUBLIC_APP_URL}/audit/${auditId}`

  // Send confirmation email
  try {
    await resend.emails.send({
      from: "SpendLens <onboarding@resend.dev>",
      to: email,
      subject: "Your AI Spend Audit Report",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 32px;">
          <h1 style="font-size: 24px; color: #111;">Your AI Spend Audit</h1>
          <p style="color: #555;">Hi${role ? ` ${role}` : ""},</p>
          <p style="color: #555;">
            Your audit is ready. We identified 
            <strong style="color: #16a34a;">$${totalSavings}/month</strong> 
            in potential savings for your team.
          </p>

          <div style="background: #f9fafb; border-radius: 12px; padding: 24px; margin: 24px 0;">
            <p style="margin: 0; color: #374151; font-size: 14px;">View your full audit report:</p>
            <a href="${auditUrl}" 
               style="display: inline-block; margin-top: 12px; background: #111; color: white; 
                      padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 500;">
              View My Audit
            </a>
          </div>

          ${totalSavings >= 500 ? `
          <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 20px; margin: 24px 0;">
            <p style="margin: 0 0 8px; font-weight: 600; color: #15803d;">
              You could save even more with Credex
            </p>
            <p style="margin: 0; color: #166534; font-size: 14px;">
              Credex sells discounted AI credits — Cursor, Claude, ChatGPT Enterprise and more. 
              With $${totalSavings}/mo in savings already identified, Credex credits could 
              save you an additional 20-40%.
            </p>
            <a href="https://credex.rocks" 
               style="display: inline-block; margin-top: 12px; background: #15803d; color: white; 
                      padding: 10px 20px; border-radius: 8px; text-decoration: none; font-size: 14px;">
              Book a free Credex consultation
            </a>
          </div>
          ` : ""}

          <p style="color: #9ca3af; font-size: 12px; margin-top: 32px;">
            Sent by SpendLens. You received this because you requested a copy of your audit report.
          </p>
        </div>
      `,
    })
  } catch (emailError) {
    console.error("Email send failed:", emailError)
    // Don't fail the request if email fails — lead is already saved
  }

  return NextResponse.json({ success: true })
}