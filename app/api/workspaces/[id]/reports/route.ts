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

  const { data: reports, error } = await supabase
    .from("strategic_reports")
    .select("*")
    .eq("workspace_id", workspaceId)
    .order("generated_at", { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ reports })
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
  const { report_type } = body

  const [{ data: workspace }, { data: tasks }, { data: notes }, { data: health }] = await Promise.all([
    supabase.from("workspaces").select("*").eq("id", workspaceId).single(),
    supabase.from("tasks").select("*").eq("workspace_id", workspaceId).maybeSingle(),
    supabase.from("founder_notes").select("*").eq("workspace_id", workspaceId).maybeSingle(),
    supabase.from("health_scores").select("*").eq("workspace_id", workspaceId).order("recorded_at", { ascending: false }).limit(1).maybeSingle(),
  ])

  const taskList = tasks?.data || []
  const noteList = notes?.data || []
  const healthData = health?.data || null

  let content: any = {}

  switch (report_type) {
    case "executive_summary":
      content = generateExecutiveSummary(workspace, taskList, noteList, healthData)
      break
    case "problem_statement":
      content = generateProblemStatement(workspace)
      break
    case "market_opportunity":
      content = generateMarketOpportunity(workspace)
      break
    case "business_model":
      content = generateBusinessModel(workspace, taskList)
      break
    default:
      content = { title: "Strategic Report", body: "Report type not implemented" }
  }

  const { data: report, error } = await supabase
    .from("strategic_reports")
    .insert({
      workspace_id: workspaceId,
      report_type,
      title: content.title || `Strategic Report - ${report_type}`,
      content: JSON.stringify(content),
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ report }, { status: 201 })
}

function generateExecutiveSummary(workspace: any, tasks: any[], notes: any[], health: any) {
  const completedTasks = tasks?.filter(t => t.status === "done").length || 0
  const totalTasks = tasks?.length || 0
  
  return {
    title: `Executive Summary - ${workspace?.name}`,
    overview: `This startup is in the ${workspace?.stage || 'idea'} stage and operates in the ${workspace?.industry || 'technology'} sector.`,
    progress: `${completedTasks} of ${totalTasks} tasks completed.`,
    health: health ? `Overall health score: ${health.overall_score}/100` : "No health data available.",
    keyTakeaways: [
      "Strong market opportunity identified",
      "Clear value proposition established",
      "Execution plan in progress",
    ],
  }
}

function generateProblemStatement(workspace: any) {
  return {
    title: `Problem Statement - ${workspace?.name}`,
    problem: workspace?.description || "No specific problem defined yet.",
    targetMarket: workspace?.industry || "General market",
    currentSolution: "Existing solutions are inadequate or nonexistent.",
    opportunity: "Significant room for improvement and innovation.",
  }
}

function generateMarketOpportunity(workspace: any) {
  return {
    title: `Market Opportunity - ${workspace?.name}`,
    industry: workspace?.industry || "Technology",
    stage: workspace?.stage || "Idea",
    tam: "Market size analysis required",
    sam: "Serviceable market analysis required",
    som: "Obtainable market analysis required",
  }
}

function generateBusinessModel(workspace: any, tasks: any[]) {
  return {
    title: `Business Model - ${workspace?.name}`,
    revenueModel: "SaaS subscription model recommended",
    pricing: "Freemium with tiered pricing",
    costStructure: "Fixed: Development, Infrastructure. Variable: Support, Marketing",
    unitEconomics: "Analysis pending based on actual metrics",
  }
}