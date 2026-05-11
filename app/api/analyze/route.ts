import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import { ideaSchema } from "@/lib/validations/idea"

// Credit costs
const CREDIT_COSTS = { quick: 1, full: 2, deep: 3 } as const

export async function POST(request: Request) {
  try {
    const supabase = await createClient()

    // Verify auth
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Validate input
    const body = await request.json()
    const validation = ideaSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid input", details: validation.error.issues },
        { status: 400 }
      )
    }

    const { ideaText, analysisType = "full" } = validation.data
    const cost = CREDIT_COSTS[analysisType] ?? 2

    // Check credits
    const { data: creditData, error: creditError } = await supabase
      .from("credits")
      .select("balance")
      .eq("user_id", user.id)
      .single()

    if (creditError || !creditData) {
      return NextResponse.json({ error: "Failed to check credits" }, { status: 500 })
    }

    if (creditData.balance < cost) {
      return NextResponse.json(
        { error: "Insufficient credits", balance: creditData.balance, cost },
        { status: 402 }
      )
    }

    // Deduct credits
    const { error: deductError } = await supabase
      .from("credits")
      .update({ balance: creditData.balance - cost })
      .eq("user_id", user.id)

    if (deductError) {
      return NextResponse.json({ error: "Failed to deduct credits" }, { status: 500 })
    }

    // Log transaction
    await supabase.from("credit_transactions").insert({
      user_id: user.id,
      amount: -cost,
      reason: `Analysis: ${analysisType}`,
    })

    // Create idea record
    const { data: idea, error: ideaError } = await supabase
      .from("ideas")
      .insert({
        user_id: user.id,
        idea_text: ideaText,
        word_count: ideaText.split(/\s+/).length,
      })
      .select()
      .single()

    if (ideaError) {
      return NextResponse.json({ error: "Failed to save idea" }, { status: 500 })
    }

    // Create analysis record
    const { data: analysis, error: analysisError } = await supabase
      .from("analysis")
      .insert({
        idea_id: idea.id,
        user_id: user.id,
        status: "pending",
        analysis_type: analysisType,
        credits_used: cost,
      })
      .select()
      .single()

    if (analysisError) {
      return NextResponse.json({ error: "Failed to create analysis" }, { status: 500 })
    }

    // TODO: In production, trigger the Trigger.dev job here
    // const { id: jobId } = await client.trigger("analyze-idea", { ... })

    // For now, return analysis ID and let frontend poll for results
    // The actual analysis will be triggered via Edge Function or background job

    return NextResponse.json({
      analysisId: analysis.id,
      status: "pending",
      creditsUsed: cost,
      remainingCredits: creditData.balance - cost,
    })
  } catch (error) {
    console.error("Analyze API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}