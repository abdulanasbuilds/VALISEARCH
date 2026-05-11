import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

interface Props {
  params: Promise<{ id: string }>
}

export async function GET(req: NextRequest, { params }: Props) {
  const supabase = await createClient()
  const { id: workspaceId } = await params

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { data: scores, error } = await supabase
    .from("health_scores")
    .select("*")
    .eq("workspace_id", workspaceId)
    .order("recorded_at", { ascending: false })
    .limit(10)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const latestScore = scores?.[0] || null
  
  return NextResponse.json({ 
    scores: scores || [],
    latest: latestScore,
    trend: calculateTrend(scores || [])
  })
}

export async function POST(req: NextRequest, { params }: Props) {
  const supabase = await createClient()
  const { id: workspaceId } = await params

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await req.json()
  const { 
    validation_strength, 
    differentiation, 
    monetization_readiness,
    technical_feasibility,
    market_opportunity,
    execution_progress,
    risks,
    recommendations
  } = body

  const overall = Math.round(
    (validation_strength + differentiation + monetization_readiness + 
     technical_feasibility + market_opportunity + execution_progress) / 6
  )

  const { data: score, error } = await supabase
    .from("health_scores")
    .insert({
      workspace_id: workspaceId,
      validation_strength,
      differentiation,
      monetization_readiness,
      technical_feasibility,
      market_opportunity,
      execution_progress,
      overall_score: overall,
      risks: risks || [],
      recommendations: recommendations || [],
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ score }, { status: 201 })
}

function calculateTrend(scores: any[]) {
  if (scores.length < 2) return "stable"
  
  const recent = scores.slice(0, 3).reduce((acc, s) => acc + (s.overall_score || 0), 0) / Math.min(scores.slice(0, 3).length, 3)
  const older = scores.slice(3, 6).reduce((acc, s) => acc + (s.overall_score || 0), 0) / Math.min(scores.slice(3, 6).length, 3)
  
  if (recent > older + 5) return "improving"
  if (recent < older - 5) return "declining"
  return "stable"
}