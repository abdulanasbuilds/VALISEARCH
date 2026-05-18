import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { data: memberships } = await supabase
    .from("workspace_members")
    .select("workspace_id, role, workspaces(*)")
    .eq("user_id", user.id)

  if (!memberships || memberships.length === 0) {
    return NextResponse.json({ workspaces: [] })
  }

  const workspaces = memberships.map((m: any) => ({
    ...m.workspaces,
    role: m.role,
  }))

  return NextResponse.json({ workspaces })
}

export async function POST(req: NextRequest) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await req.json()
  const { name, description, industry, stage } = body

  if (!name) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 })
  }

  const { data: workspace, error } = await supabase
    .from("workspaces")
    .insert({
      owner_id: user.id,
      name,
      description: description || null,
      industry: industry || null,
      stage: stage || "idea",
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  await supabase.from("workspace_members").insert({
    workspace_id: workspace.id,
    user_id: user.id,
    role: "owner",
  })

  return NextResponse.json({ workspace }, { status: 201 })
}
