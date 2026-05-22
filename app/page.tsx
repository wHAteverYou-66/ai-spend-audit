"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { TOOLS, runAudit, UserToolInput } from "@/lib/auditEngine"
import { nanoid } from "nanoid"

const USE_CASES = ["coding", "writing", "data", "research", "mixed"]

const defaultInputs: UserToolInput[] = TOOLS.map((tool) => ({
  toolId: tool.id,
  planName: tool.plans[0].name,
  seats: 0,
  monthlySpend: 0,
}))

export default function Home() {
  const router = useRouter()
  const [inputs, setInputs] = useState<UserToolInput[]>(defaultInputs)
  const [teamSize, setTeamSize] = useState(1)
  const [useCase, setUseCase] = useState("mixed")
  const [loading, setLoading] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("auditFormState")
    if (saved) {
      const parsed = JSON.parse(saved)
      setInputs(parsed.inputs ?? defaultInputs)
      setTeamSize(parsed.teamSize ?? 1)
      setUseCase(parsed.useCase ?? "mixed")
    }
  }, [])

  // Save to localStorage on every change
  useEffect(() => {
    localStorage.setItem("auditFormState", JSON.stringify({ inputs, teamSize, useCase }))
  }, [inputs, teamSize, useCase])

  function updateInput(toolId: string, field: keyof UserToolInput, value: string | number) {
    setInputs((prev) =>
      prev.map((inp) => (inp.toolId === toolId ? { ...inp, [field]: value } : inp))
    )
  }

  async function handleSubmit() {
    setLoading(true)
    const auditId = nanoid(10)
    const results = runAudit(inputs, useCase, teamSize)

    // Save to Supabase via API route
    await fetch("/api/save-audit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ auditId, inputs, useCase, teamSize, results }),
    })

    router.push(`/audit/${auditId}`)
  }

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">AI Spend Audit</h1>
          <p className="text-gray-500 text-lg">
            Find out where your team is overspending on AI tools — free, instant, no login required.
          </p>
        </div>

        {/* Team info */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
          <h2 className="font-semibold text-gray-800 mb-4">Your team</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Team size</label>
              <input
                type="number"
                min={1}
                value={teamSize}
                onChange={(e) => setTeamSize(Number(e.target.value))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Primary use case</label>
              <select
                value={useCase}
                onChange={(e) => setUseCase(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
              >
                {USE_CASES.map((uc) => (
                  <option key={uc} value={uc}>
                    {uc.charAt(0).toUpperCase() + uc.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Tool inputs */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
          <h2 className="font-semibold text-gray-800 mb-4">AI tools you pay for</h2>
          <p className="text-sm text-gray-400 mb-6">Leave seats at 0 for tools you don't use.</p>

          <div className="space-y-6">
            {TOOLS.map((tool) => {
              const inp = inputs.find((i) => i.toolId === tool.id)!
              return (
                <div key={tool.id} className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
                  <p className="font-medium text-gray-700 mb-3">{tool.label}</p>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Plan</label>
                      <select
                        value={inp.planName}
                        onChange={(e) => updateInput(tool.id, "planName", e.target.value)}
                        className="w-full border border-gray-200 rounded-lg px-2 py-2 text-sm"
                      >
                        {tool.plans.map((p) => (
                          <option key={p.name} value={p.name}>
                            {p.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Seats</label>
                      <input
                        type="number"
                        min={0}
                        value={inp.seats}
                        onChange={(e) => updateInput(tool.id, "seats", Number(e.target.value))}
                        className="w-full border border-gray-200 rounded-lg px-2 py-2 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Monthly spend ($)</label>
                      <input
                        type="number"
                        min={0}
                        value={inp.monthlySpend}
                        onChange={(e) => updateInput(tool.id, "monthlySpend", Number(e.target.value))}
                        className="w-full border border-gray-200 rounded-lg px-2 py-2 text-sm"
                      />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-gray-900 text-white py-4 rounded-2xl font-semibold text-lg hover:bg-gray-700 transition disabled:opacity-50"
        >
          {loading ? "Running audit..." : "Run my free audit →"}
        </button>

        <p className="text-center text-xs text-gray-400 mt-4">
          No login required. Email is optional and only asked after you see results.
        </p>
      </div>
    </main>
  )
}