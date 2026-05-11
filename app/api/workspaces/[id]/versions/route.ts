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

  const { data: versions, error } = await supabase
    .from("startup_versions")
    .select("*")
    .eq("workspace_id", workspaceId)
    .order("version_number", { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ versions })
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
  const { idea_text, changes_summary } = body

  if (!idea_text) {
    return NextResponse.json({ error: "Idea text is required" }, { status: 400 })
  }

  const { data: lastVersion } = await supabase
    .from("startup_versions")
    .select("version_number")
    .eq("workspace_id", workspaceId)
    .order("version_number", { ascending: false })
    .limit(1)
    .single()

  const newVersionNumber = (lastVersion?.version_number || 0) + 1

  const { data: existingLatest } = await supabase
    .from("startup_versions")
    .select("idea_text")
    .eq("workspace_id", workspaceId)
    .order("version_number", { ascending: false })
    .limit(1)
    .single()

  const pivotDetected = existingLatest?.idea_text && 
    calculateSimilarity(existingLatest.idea_text, idea_text) < 0.7

  const { data: version, error } = await supabase
    .from("startup_versions")
    .insert({
      workspace_id: workspaceId,
      version_number: newVersionNumber,
      idea_text,
      changes_summary: changes_summary || null,
      pivot_detected: pivotDetected,
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ version }, { status: 201 })
}

function calculateSimilarity(text1: string, text2: string): number {
  const words1 = new Set(text1.toLowerCase().split(" "))
  const words2 = new Set(text2.toLowerCase().split(" "))
  const intersection = new Set([...words1].filter(x => words2.has(x)))
  return intersection.size / Math.max(words1.size, words2.size)
}