import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

interface Props {
  params: Promise<{ id: string }>
}

export async function GET(req: NextRequest, { params }: Props) {
  const supabase = await createClient()
  const { id } = await params

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { data: membership } = await supabase
    .from("workspace_members")
    .select("*, workspaces(*)")
    .eq("workspace_id", id)
    .eq("user_id", user.id)
    .single()

  if (!membership) {
    return NextResponse.json({ error: "Workspace not found" }, { status: 404 })
  }

  const workspace = {
    ...membership.workspaces,
    role: membership.role,
  }

  const [roadmaps, tasks, notes, flows, healthScores] = await Promise.all([
    supabase.from("roadmaps").select("*").eq("workspace_id", id).order("created_at", { ascending: false }),
    supabase.from("tasks").select("*").eq("workspace_id", id).order("created_at", { ascending: false }),
    supabase.from("founder_notes").select("*").eq("workspace_id", id).order("created_at", { ascending: false }),
    supabase.from("startup_flows").select("*").eq("workspace_id", id).order("created_at", { ascending: false }),
    supabase.from("health_scores").select("*").eq("workspace_id", id).order("recorded_at", { ascending: false }).limit(10),
  ])

  return NextResponse.json({
    workspace,
    roadmaps: roadmaps.data || [],
    tasks: tasks.data || [],
    notes: notes.data || [],
    flows: flows.data || [],
    healthScores: healthScores.data || [],
  })
}

export async function PUT(req: NextRequest, { params }: Props) {
  const supabase = await createClient()
  const { id } = await params

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { data: membership } = await supabase
    .from("workspace_members")
    .select("*, workspaces(*)")
    .eq("workspace_id", id)
    .eq("user_id", user.id)
    .single()

  if (!membership || !["owner", "admin", "editor"].includes(membership.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const body = await req.json()
  const { name, description, industry, stage, is_archived } = body

  const { data: workspace, error } = await supabase
    .from("workspaces")
    .update({
      ...(name && { name }),
      ...(description !== undefined && { description }),
      ...(industry && { industry }),
      ...(stage && { stage }),
      ...(is_archived !== undefined && { is_archived }),
    })
    .eq("id", id)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ workspace })
}

export async function DELETE(req: NextRequest, { params }: Props) {
  const supabase = await createClient()
  const { id } = await params

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { data: membership } = await supabase
    .from("workspace_members")
    .select("*")
    .eq("workspace_id", id)
    .eq("user_id", user.id)
    .single()

  if (!membership || membership.role !== "owner") {
    return NextResponse.json({ error: "Only owner can delete workspace" }, { status: 403 })
  }

  const { error } = await supabase
    .from("workspaces")
    .update({ is_archived: true })
    .eq("id", id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}