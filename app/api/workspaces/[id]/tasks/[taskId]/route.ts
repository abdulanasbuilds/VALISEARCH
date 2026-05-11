import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

interface Props {
  params: Promise<{ id: string; taskId: string }>
}

export async function PUT(req: NextRequest, { params }: Props) {
  const supabase = await createClient()
  const { id: workspaceId, taskId } = await params

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await req.json()
  const { title, description, category, priority, status, roadmap_id, assigned_to } = body

  const { data: task, error } = await supabase
    .from("tasks")
    .update({
      ...(title && { title }),
      ...(description !== undefined && { description }),
      ...(category && { category }),
      ...(priority && { priority }),
      ...(status && { status }),
      ...(roadmap_id !== undefined && { roadmap_id }),
      ...(assigned_to !== undefined && { assigned_to }),
    })
    .eq("id", taskId)
    .eq("workspace_id", workspaceId)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ task })
}

export async function DELETE(req: NextRequest, { params }: Props) {
  const supabase = await createClient()
  const { id: workspaceId, taskId } = await params

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { error } = await supabase
    .from("tasks")
    .delete()
    .eq("id", taskId)
    .eq("workspace_id", workspaceId)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}