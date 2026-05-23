import { NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

function fallbackSummary(results: any[], totalMonthly: number, useCase: string): string {
  if (totalMonthly === 0) {
    return `Your team's AI tool spending looks well-optimized for ${useCase} workflows. You're on appropriate plans across your stack with no obvious overspend. Keep reviewing quarterly as pricing and alternatives evolve.`
  }
  const topSaving = [...results].sort((a, b) => b.monthlySavings - a.monthlySavings)[0]
  return `Your audit identified $${totalMonthly}/month in potential savings. The biggest opportunity is ${topSaving.toolLabel}, where switching to ${topSaving.recommendedPlan} could save $${topSaving.monthlySavings}/month. These optimizations are based on your ${useCase} use case and current vendor pricing.`
}

export async function POST(req: Request) {
  const { results, useCase, teamSize, totalMonthly } = await req.json()

  const toolSummary = results
    .filter((r: any) => r.monthlySavings > 0)
    .map((r: any) => `${r.toolLabel}: ${r.recommendedAction} (save $${r.monthlySavings}/mo)`)
    .join(", ")

  const prompt = `You are an AI spend optimization advisor. Write a concise 80-100 word personalized summary for a startup audit report.

Context:
- Team size: ${teamSize}
- Primary use case: ${useCase}
- Total potential savings: $${totalMonthly}/month
- Key recommendations: ${toolSummary || "spending is already optimized"}

Write in second person. Be specific, mention the numbers, sound like a knowledgeable advisor. No bullet points. No heading. Just the paragraph.`

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })
    const result = await model.generateContent(prompt)
    const summary = result.response.text()
    return NextResponse.json({ summary })
  } catch (err) {
    console.error("Gemini API error:", err)
    const summary = fallbackSummary(results, totalMonthly, useCase)
    return NextResponse.json({ summary })
  }
}
