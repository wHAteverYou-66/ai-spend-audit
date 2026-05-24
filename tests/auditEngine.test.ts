import { describe, it, expect } from "vitest"
import { runAudit, totalSavings, UserToolInput } from "../lib/auditEngine"

// Helper to make a single tool input
function makeInput(toolId: string, planName: string, seats: number, monthlySpend: number): UserToolInput[] {
  return [{ toolId, planName, seats, monthlySpend }]
}

describe("Audit Engine", () => {

  it("returns no results for tools with 0 seats and 0 spend", () => {
    const inputs = makeInput("cursor", "Pro", 0, 0)
    const results = runAudit(inputs, "coding", 1)
    expect(results.length).toBe(0)
  })

  it("recommends Cursor Hobby for solo user on Pro plan", () => {
    const inputs = makeInput("cursor", "Pro", 1, 20)
    const results = runAudit(inputs, "coding", 1)
    expect(results.length).toBe(1)
    expect(results[0].recommendedPlan).toBe("Hobby")
    expect(results[0].monthlySavings).toBe(20)
  })

  it("recommends Cursor Hobby for 2-person team on Pro plan", () => {
    const inputs = makeInput("cursor", "Pro", 2, 40)
    const results = runAudit(inputs, "coding", 2)
    expect(results[0].recommendedPlan).toBe("Hobby")
    expect(results[0].monthlySavings).toBe(40)
  })

  it("does not recommend downgrade for Cursor Pro with 5 seats", () => {
    // 5 seats at $20 = $100 exactly — correct price, no downgrade
    const inputs = makeInput("cursor", "Pro", 5, 100)
    const results = runAudit(inputs, "coding", 5)
    // Cursor Hobby only applies to <= 2 seats, so no recommendation here
    expect(results[0].recommendedAction).toBe("No change needed")
  })

  it("recommends Claude Pro downgrade from Max for non-research use case", () => {
    const inputs = makeInput("claude", "Max", 3, 300)
    const results = runAudit(inputs, "coding", 3)
    expect(results[0].recommendedPlan).toBe("Pro")
    expect(results[0].monthlySavings).toBe(240)
  })

  it("does not downgrade Claude Max for research use case", () => {
    // Research use case — Max is justified, no downgrade
    const inputs = makeInput("claude", "Max", 2, 200)
    const results = runAudit(inputs, "research", 2)
    expect(results[0].recommendedAction).toBe("No change needed")
  })

  it("recommends GitHub Copilot Individual for small team on Enterprise", () => {
    const inputs = makeInput("github_copilot", "Enterprise", 2, 78)
    const results = runAudit(inputs, "coding", 2)
    expect(results[0].recommendedPlan).toBe("Individual")
    expect(results[0].monthlySavings).toBe(58)
  })

  it("recommends switching from ChatGPT to Cursor for coding teams", () => {
    const inputs = makeInput("chatgpt", "Plus", 3, 60)
    const results = runAudit(inputs, "coding", 3)
    expect(results[0].recommendedAction).toBe("Switch to Cursor")
  })

  it("calculates total savings correctly across multiple tools", () => {
    const inputs = [
      { toolId: "cursor", planName: "Pro", seats: 1, monthlySpend: 20 },
      { toolId: "claude", planName: "Max", seats: 2, monthlySpend: 200 },
    ]
    const results = runAudit(inputs, "coding", 2)
    const savings = totalSavings(results)
    expect(savings).toBeGreaterThan(0)
  })

  it("flags billing discrepancy when user pays more than plan price", () => {
    // GitHub Copilot Individual is $10/seat, 2 seats = $20 expected
    // User paying $60 = clear billing discrepancy
    const inputs = makeInput("github_copilot", "Individual", 2, 60)
    const results = runAudit(inputs, "coding", 2)
    expect(results[0].recommendedAction).toBe("Review billing")
  })

})