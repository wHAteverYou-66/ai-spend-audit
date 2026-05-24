export type Plan = {
  name: string
  pricePerUser: number
}

export type Tool = {
  id: string
  label: string
  plans: Plan[]
}

export type UserToolInput = {
  toolId: string
  planName: string
  seats: number
  monthlySpend: number
}

export type AuditResult = {
  toolId: string
  toolLabel: string
  currentPlan: string
  currentSpend: number
  recommendedAction: string
  recommendedPlan: string
  monthlySavings: number
  reason: string
}

export const TOOLS: Tool[] = [
  {
    id: "cursor",
    label: "Cursor",
    plans: [
      { name: "Hobby", pricePerUser: 0 },
      { name: "Pro", pricePerUser: 20 },
      { name: "Business", pricePerUser: 40 },
    ],
  },
  {
    id: "github_copilot",
    label: "GitHub Copilot",
    plans: [
      { name: "Individual", pricePerUser: 10 },
      { name: "Business", pricePerUser: 19 },
      { name: "Enterprise", pricePerUser: 39 },
    ],
  },
  {
    id: "claude",
    label: "Claude (Anthropic)",
    plans: [
      { name: "Free", pricePerUser: 0 },
      { name: "Pro", pricePerUser: 20 },
      { name: "Max", pricePerUser: 100 },
      { name: "Team", pricePerUser: 30 },
    ],
  },
  {
    id: "chatgpt",
    label: "ChatGPT",
    plans: [
      { name: "Plus", pricePerUser: 20 },
      { name: "Team", pricePerUser: 30 },
    ],
  },
  {
    id: "gemini",
    label: "Gemini",
    plans: [
      { name: "Free", pricePerUser: 0 },
      { name: "Advanced", pricePerUser: 19.99 },
    ],
  },
  {
    id: "windsurf",
    label: "Windsurf",
    plans: [
      { name: "Free", pricePerUser: 0 },
      { name: "Pro", pricePerUser: 15 },
      { name: "Teams", pricePerUser: 35 },
    ],
  },
]

export function runAudit(inputs: UserToolInput[], useCase: string, teamSize: number): AuditResult[] {
  const results: AuditResult[] = []

  for (const input of inputs) {
    if (input.monthlySpend === 0 && input.seats === 0) continue

    const tool = TOOLS.find((t) => t.id === input.toolId)
    if (!tool) continue

    const currentPlan = tool.plans.find((p) => p.name === input.planName)
    if (!currentPlan) continue

    const expectedSpend = currentPlan.pricePerUser * input.seats
    let recommendedPlan = input.planName
    let recommendedAction = "No change needed"
    let monthlySavings = 0
    let reason = "Your current plan fits your usage well."

    // Cursor: Hobby is free for 1-2 users only
    if (input.toolId === "cursor" && input.seats <= 2 && input.planName !== "Hobby") {
      monthlySavings = currentPlan.pricePerUser * input.seats
      recommendedPlan = "Hobby"
      recommendedAction = "Downgrade to Hobby"
      reason = `Cursor Hobby is free for individuals. With only ${input.seats} seat(s), you don't need a paid plan unless you need priority access.`
    }

    // Cursor: 3+ seats on Pro is correct — no recommendation
    else if (input.toolId === "cursor" && input.seats > 2) {
      recommendedAction = "No change needed"
      reason = "Cursor Pro is the right plan for your team size."
    }

    // Claude Max: justified for research use case — no recommendation
    else if (input.toolId === "claude" && input.planName === "Max" && useCase === "research") {
      recommendedAction = "No change needed"
      reason = "Claude Max is well-suited for heavy research workflows where context and usage limits matter."
    }

    // Claude Max: overkill for non-research
    else if (input.toolId === "claude" && input.planName === "Max" && useCase !== "research") {
      monthlySavings = (100 - 20) * input.seats
      recommendedPlan = "Pro"
      recommendedAction = "Downgrade to Pro"
      reason = `Claude Max ($100/user) is designed for very heavy users. Pro ($20/user) covers most coding and writing workflows. Saves $${monthlySavings}/mo.`
    }

    // Check if user is overpaying vs expected price
    else if (input.monthlySpend > expectedSpend * 1.1) {
      reason = `You appear to be paying $${input.monthlySpend}/mo but ${tool.label} ${input.planName} for ${input.seats} seats should cost $${expectedSpend}/mo. Review your billing.`
      monthlySavings = input.monthlySpend - expectedSpend
      recommendedAction = "Review billing"
    }

    // GitHub Copilot: Enterprise overkill for small teams
    else if (input.toolId === "github_copilot" && input.seats <= 3 && input.planName === "Enterprise") {
      monthlySavings = (currentPlan.pricePerUser - 10) * input.seats
      recommendedPlan = "Individual"
      recommendedAction = "Downgrade to Individual"
      reason = `Enterprise features (policy management, audit logs) are unnecessary for a team of ${input.seats}. Individual at $10/seat saves you $${monthlySavings}/mo.`
    }

    // ChatGPT: switch to Cursor for coding teams
    else if (input.toolId === "chatgpt" && useCase === "coding" && input.seats >= 2) {
      monthlySavings = Math.round(input.monthlySpend * 0.3)
      recommendedPlan = "Cursor Pro"
      recommendedAction = "Switch to Cursor"
      reason = `For coding teams, Cursor Pro ($20/user) includes IDE integration and is purpose-built for developers. ChatGPT is general-purpose and costs more for this use case.`
    }

    // Windsurf Teams: small teams don't need Teams plan
    else if (input.toolId === "windsurf" && input.planName === "Teams" && input.seats <= 3) {
      monthlySavings = (35 - 15) * input.seats
      recommendedPlan = "Pro"
      recommendedAction = "Downgrade to Pro"
      reason = `Windsurf Teams adds admin controls useful for larger orgs. For ${input.seats} people, Pro ($15/user) has the same AI features. Saves $${monthlySavings}/mo.`
    }

    // Generic: suggest cheaper plan if saving > $10
    else {
      const cheaperPlans = tool.plans
        .filter((p) => p.pricePerUser < currentPlan.pricePerUser)
        .sort((a, b) => b.pricePerUser - a.pricePerUser)

      if (cheaperPlans.length > 0) {
        const bestCheaper = cheaperPlans[0]
        const saving = (currentPlan.pricePerUser - bestCheaper.pricePerUser) * input.seats
        if (saving > 10 && input.monthlySpend <= expectedSpend * 1.1) {
          monthlySavings = saving
          recommendedPlan = bestCheaper.name
          recommendedAction = `Downgrade to ${bestCheaper.name}`
          reason = `${bestCheaper.name} plan covers the core features for your use case at $${bestCheaper.pricePerUser}/user vs $${currentPlan.pricePerUser}/user.`
        }
      }
    }

    results.push({
      toolId: input.toolId,
      toolLabel: tool.label,
      currentPlan: input.planName,
      currentSpend: input.monthlySpend,
      recommendedAction,
      recommendedPlan,
      monthlySavings: Math.round(monthlySavings),
      reason,
    })
  }

  return results
}

export function totalSavings(results: AuditResult[]): number {
  return results.reduce((sum, r) => sum + r.monthlySavings, 0)
}