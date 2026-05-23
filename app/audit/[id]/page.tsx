import { createClient } from "@supabase/supabase-js"
import { notFound } from "next/navigation"
import ResultsClient from "./ResultsClient"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  return {
    title: "Your AI Spend Audit — SpendLens",
    description: "See where your team is overspending on AI tools.",
    openGraph: {
      title: "Your AI Spend Audit — SpendLens",
      description: "Free AI spend audit. See your savings in seconds.",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "Your AI Spend Audit — SpendLens",
      description: "Free AI spend audit. See your savings in seconds.",
    },
  }
}

export default async function AuditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const { data, error } = await supabase
    .from("leads")
    .select("*")
    .eq("audit_id", id)
    .single()

  if (error || !data) return notFound()

  return <ResultsClient auditData={data} />
}
