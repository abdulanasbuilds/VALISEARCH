import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(req: NextRequest) {
  const supabase = await createClient()

  const url = new URL(req.url)
  const category = url.searchParams.get("category")

  let query = supabase
    .from("market_insights")
    .select("*")
    .order("recorded_at", { ascending: false })
    .limit(20)

  if (category) {
    query = query.eq("category", category)
  }

  const { data: insights, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const categories = [...new Set(insights?.map((i) => i.category) || [])]

  return NextResponse.json({ 
    insights: insights || [],
    categories 
  })
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
  const { category, title, description, source, trends } = body

  if (!category || !title) {
    return NextResponse.json({ error: "Category and title are required" }, { status: 400 })
  }

  const { data: insight, error } = await supabase
    .from("market_insights")
    .insert({
      category,
      title,
      description: description || null,
      source: source || null,
      trends: trends || [],
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ insight }, { status: 201 })
}
