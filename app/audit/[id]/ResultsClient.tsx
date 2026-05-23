"use client"

import { useState } from "react"
import Link from "next/link"
import { AuditResult } from "@/lib/auditEngine"

type Props = {
  auditData: {
    audit_id: string
    total_savings: number
    audit_data: {
      results: AuditResult[]
      useCase: string
      teamSize: number
    }
    email?: string
  }
}

export default function ResultsClient({ auditData }: Props) {
  const { results, useCase, teamSize } = auditData.audit_data
  const totalMonthly = auditData.total_savings
  const totalAnnual = totalMonthly * 12
  const shareUrl = typeof window !== "undefined" ? window.location.href : ""

  const [email, setEmail] = useState("")
  const [company, setCompany] = useState("")
  const [role, setRole] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [copying, setCopying] = useState(false)
  const [aiSummary, setAiSummary] = useState<string | null>(null)
  const [summaryLoading, setSummaryLoading] = useState(false)

  async function handleEmailSubmit() {
    await fetch("/api/save-lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        auditId: auditData.audit_id,
        email,
        company,
        role,
      }),
    })
    setSubmitted(true)
  }

  async function handleGetSummary() {
    setSummaryLoading(true)
    const res = await fetch("/api/ai-summary", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ results, useCase, teamSize, totalMonthly }),
    })
    const data = await res.json()
    setAiSummary(data.summary)
    setSummaryLoading(false)
  }

  function copyLink() {
    navigator.clipboard.writeText(shareUrl)
    setCopying(true)
    setTimeout(() => setCopying(false), 2000)
  }

  const savingsColor =
    totalMonthly >= 500
      ? "text-green-600"
      : totalMonthly >= 100
      ? "text-yellow-600"
      : "text-gray-600"

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Your AI Spend Audit</h1>
          <p className="text-gray-500">Team size: {teamSize} · Use case: {useCase}</p>
        </div>

        {/* Hero savings card */}
        <div className="bg-white rounded-2xl border border-gray-200 p-8 mb-6 text-center shadow-sm">
          <p className="text-sm text-gray-400 uppercase tracking-wide mb-2">Potential savings</p>
          <p className={`text-6xl font-bold mb-1 ${savingsColor}`}>
            ${totalMonthly.toLocaleString()}<span className="text-2xl">/mo</span>
          </p>
          <p className="text-2xl text-gray-400 font-medium">
            ${totalAnnual.toLocaleString()} per year
          </p>

          {totalMonthly === 0 && (
            <p className="mt-4 text-gray-500 text-sm">
              ✅ You're spending well. No obvious overspend found.
            </p>
          )}
        </div>

        {/* Credex CTA for high savings */}
        {totalMonthly >= 500 && (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-6 mb-6">
            <p className="font-semibold text-green-800 mb-1">
              You could save even more with Credex
            </p>
            <p className="text-green-700 text-sm mb-3">
              Credex sells discounted AI credits — Cursor, Claude, ChatGPT Enterprise and more —
              sourced from companies that overforecast. With ${totalMonthly}/mo in savings already
              identified, Credex credits could save you an additional 20–40%.
            </p>
            <a href="https://credex.rocks"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-green-700 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-green-800 transition">
            Book a free Credex consultation
          </a>
          </div>
        )}

        {/* Per-tool breakdown */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
          <h2 className="font-semibold text-gray-800 mb-5">Per-tool breakdown</h2>
          <div className="space-y-5">
            {results.map((r) => (
              <div key={r.toolId} className="border-b border-gray-100 pb-5 last:border-0 last:pb-0">
                <div className="flex justify-between items-start mb-1">
                  <p className="font-medium text-gray-800">{r.toolLabel}</p>
                  {r.monthlySavings > 0 ? (
                    <span className="text-green-600 font-semibold text-sm">
                      Save ${r.monthlySavings}/mo
                    </span>
                  ) : (
                    <span className="text-gray-400 text-sm">Optimal</span>
                  )}
                </div>
                <p className="text-xs text-gray-400 mb-1">
                  {r.currentPlan} · ${r.currentSpend}/mo {"->"}{" "}
                  <span className="font-medium text-gray-600">{r.recommendedAction}</span>
                </p>
                <p className="text-sm text-gray-500">{r.reason}</p>
              </div>
            ))}
          </div>
        </div>

        {/* AI Summary */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
          <h2 className="font-semibold text-gray-800 mb-3">AI-generated summary</h2>
          {aiSummary ? (
            <p className="text-gray-600 text-sm leading-relaxed">{aiSummary}</p>
          ) : (
            <button
              onClick={handleGetSummary}
              disabled={summaryLoading}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition disabled:opacity-50"
            >
              {summaryLoading ? "Generating..." : "Generate personalized summary"}
            </button>
          )}
        </div>

        {/* Share */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
          <h2 className="font-semibold text-gray-800 mb-3">Share this audit</h2>
          <div className="flex gap-3">
            <input
              readOnly
              value={shareUrl}
              className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-500 bg-gray-50"
            />
            <button
              onClick={copyLink}
              className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-700 transition"
            >
              {copying ? "Copied!" : "Copy link"}
            </button>
          </div>
        </div>

        {/* Email capture */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
          <h2 className="font-semibold text-gray-800 mb-1">Get this report via email</h2>
          <p className="text-sm text-gray-400 mb-4">
            Optional. We'll send a copy and notify you when new optimizations apply to your stack.
          </p>

          {submitted ? (
            <p className="text-green-600 font-medium text-sm">✅ Got it! Check your inbox shortly.</p>
          ) : (
            <div className="space-y-3">
              {/* Honeypot — hidden from humans, catches bots */}
              <input type="text" name="website" className="hidden" tabIndex={-1} autoComplete="off" />

              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Company (optional)"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="border border-gray-200 rounded-lg px-3 py-2 text-sm"
                />
                <input
                  type="text"
                  placeholder="Your role (optional)"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="border border-gray-200 rounded-lg px-3 py-2 text-sm"
                />
              </div>
              <button
                onClick={handleEmailSubmit}
                disabled={!email}
                className="w-full bg-gray-900 text-white py-2 rounded-lg text-sm font-medium hover:bg-gray-700 transition disabled:opacity-50"
              >
                Send me the report
              </button>
            </div>
          )}
        </div>

        {totalMonthly < 100 && (
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 mb-6 text-sm text-blue-700">
            ✅ You're spending well on AI tools. We'll notify you when better options emerge for your stack.
          </div>
        )}

        <div className="text-center">
          <Link href="/" className="text-sm text-gray-400 hover:text-gray-600 transition">
            ← Run a new audit
          </Link>
        </div>
      </div>
    </main>
  )
}