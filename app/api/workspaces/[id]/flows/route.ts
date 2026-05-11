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

  const { data: flows, error } = await supabase
    .from("startup_flows")
    .select("*")
    .eq("workspace_id", workspaceId)
    .order("created_at", { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ flows })
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
  const { title, flow_type } = body

  if (!title) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 })
  }

  const defaultNodes = [
    { id: "1", type: "start", position: { x: 100, y: 100 }, data: { label: "Start" } },
    { id: "2", type: "step", position: { x: 300, y: 100 }, data: { label: "Step 1" } },
    { id: "3", type: "end", position: { x: 500, y: 100 }, data: { label: "End" } },
  ]

  const defaultConnections = [
    { id: "c1", source: "1", target: "2" },
    { id: "c2", source: "2", target: "3" },
  ]

  const { data: flow, error } = await supabase
    .from("startup_flows")
    .insert({
      workspace_id: workspaceId,
      title,
      flow_type: flow_type || "user_journey",
      nodes: JSON.stringify(defaultNodes),
      connections: JSON.stringify(defaultConnections),
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ flow }, { status: 201 })
}