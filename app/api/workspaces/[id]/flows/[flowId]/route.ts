import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

interface Props {
  params: Promise<{ id: string; flowId: string }>
}

export async function GET(req: NextRequest, { params }: Props) {
  const supabase = await createClient()
  const { id: workspaceId, flowId } = await params

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { data: flow, error } = await supabase
    .from("startup_flows")
    .select("*")
    .eq("id", flowId)
    .eq("workspace_id", workspaceId)
    .single()

  if (error || !flow) {
    return NextResponse.json({ error: "Flow not found" }, { status: 404 })
  }

  return NextResponse.json({ flow })
}

export async function PUT(req: NextRequest, { params }: Props) {
  const supabase = await createClient()
  const { id: workspaceId, flowId } = await params

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await req.json()
  const { title, nodes, connections } = body

  const { data: flow, error } = await supabase
    .from("startup_flows")
    .update({
      ...(title && { title }),
      ...(nodes && { nodes: JSON.stringify(nodes) }),
      ...(connections && { connections: JSON.stringify(connections) }),
    })
    .eq("id", flowId)
    .eq("workspace_id", workspaceId)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ flow })
}

export async function DELETE(req: NextRequest, { params }: Props) {
  const supabase = await createClient()
  const { id: workspaceId, flowId } = await params

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { error } = await supabase
    .from("startup_flows")
    .delete()
    .eq("id", flowId)
    .eq("workspace_id", workspaceId)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}