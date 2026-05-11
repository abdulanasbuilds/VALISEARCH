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

  const { data: roadmaps, error } = await supabase
    .from("roadmaps")
    .select(`
      *,
      milestones (*)
    `)
    .eq("workspace_id", workspaceId)
    .order("created_at", { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ roadmaps })
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
  const { title, current_phase } = body

  if (!title) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 })
  }

  const { data: roadmap, error } = await supabase
    .from("roadmaps")
    .insert({
      workspace_id: workspaceId,
      title,
      current_phase: current_phase || "idea",
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ roadmap }, { status: 201 })
}