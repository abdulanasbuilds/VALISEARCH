import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(req: NextRequest) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await req.json()
  const { workspace_ids, comparison_type } = body

  if (!workspace_ids || workspace_ids.length < 2) {
    return NextResponse.json({ error: "At least 2 workspaces required" }, { status: 400 })
  }

  const workspaces = await Promise.all(
    workspace_ids.map((id: string) =>
      supabase.from("workspaces").select("*").eq("id", id).single()
    )
  )

  const results = {
    workspaces: workspaces.map((w) => w.data),
    comparison: compareWorkspaces(workspaces.map((w) => w.data), comparison_type),
    winner: determineWinner(workspaces.map((w) => w.data), comparison_type),
    recommendations: generateRecommendations(workspaces.map((w) => w.data)),
  }

  const { data: session, error } = await supabase
    .from("comparison_sessions")
    .insert({
      user_id: user.id,
      workspace_ids,
      comparison_type: comparison_type || "general",
      results: JSON.stringify(results),
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ session, results })
}

function compareWorkspaces(workspaces: any[], type: string) {
  const stages = ["idea", "validation", "mvp", "beta", "growth", "scaling"]
  
  const stageScores = {
    idea: 1,
    validation: 2,
    mvp: 3,
    beta: 4,
    growth: 5,
    scaling: 6,
  }

  return workspaces.map((ws) => ({
    name: ws.name,
    stage: ws.stage,
    stage_score: stageScores[ws.stage as keyof typeof stageScores] || 1,
    industry: ws.industry,
    description: ws.description,
  }))
}

function determineWinner(workspaces: any[], type: string) {
  const stages = ["idea", "validation", "mvp", "beta", "growth", "scaling"]
  const stageScores = {
    idea: 1,
    validation: 2,
    mvp: 3,
    beta: 4,
    growth: 5,
    scaling: 6,
  }

  let winnerIndex = 0
  let maxScore = 0

  workspaces.forEach((ws, i) => {
    const score = stageScores[ws.stage as keyof typeof stageScores] || 1
    if (score > maxScore) {
      maxScore = score
      winnerIndex = i
    }
  })

  return workspaces[winnerIndex]?.name || "No winner"
}

function generateRecommendations(workspaces: any[]) {
  const recs = [
    "Focus on advancing through startup stages systematically",
    "Prioritize validation before heavy investment",
    "Build a strong foundation before scaling",
    "Document all strategic decisions for future reference",
  ]
  return recs
}