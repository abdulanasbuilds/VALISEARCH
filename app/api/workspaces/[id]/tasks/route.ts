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

  const url = new URL(req.url)
  const view = url.searchParams.get("view")

  if (view === "kanban") {
    const { data: tasks, error } = await supabase
      .from("tasks")
      .select("*")
      .eq("workspace_id", workspaceId)
      .order("created_at", { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const kanban = {
      todo: tasks?.filter((t: any) => t.status === "todo") || [],
      in_progress: tasks?.filter((t: any) => t.status === "in_progress") || [],
      done: tasks?.filter((t: any) => t.status === "done") || [],
    }

    return NextResponse.json({ kanban })
  }

  const { data: tasks, error } = await supabase
    .from("tasks")
    .select("*")
    .eq("workspace_id", workspaceId)
    .order("created_at", { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ tasks })
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
  const { title, description, category, priority, status, roadmap_id } = body

  if (!title) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 })
  }

  const { data: task, error } = await supabase
    .from("tasks")
    .insert({
      workspace_id: workspaceId,
      title,
      description: description || null,
      category: category || "product",
      priority: priority || "medium",
      status: status || "todo",
      roadmap_id: roadmap_id || null,
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ task }, { status: 201 })
}