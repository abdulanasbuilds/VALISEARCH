import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { triggerAnalysisJob } from "@/lib/jobs/analysis" // We'll mock/implement this next if needed

export const maxDuration = 300 // 5 minutes max on Vercel Pro
export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { ideaId, type = "quick" } = await req.json()

    if (!ideaId) {
      return NextResponse.json({ error: "Missing idea ID" }, { status: 400 })
    }

    // 1. Verify credit balance
    const cost = type === "quick" ? 1 : 2
    const { data: credits, error: creditError } = await supabase
      .from("credits")
      .select("balance")
      .eq("user_id", user.id)
      .single()

    if (creditError || !credits || credits.balance < cost) {
      return NextResponse.json({ error: "Insufficient credits" }, { status: 402 })
    }

    // 2. Verify idea exists & belongs to user
    const { data: idea, error: ideaError } = await supabase
      .from("ideas")
      .select("*")
      .eq("id", ideaId)
      .eq("user_id", user.id)
      .single()

    if (ideaError || !idea) {
      return NextResponse.json({ error: "Idea not found" }, { status: 404 })
    }

    // 3. Create analysis record
    const { data: analysis, error: analysisError } = await supabase
      .from("analysis")
      .insert({
        user_id: user.id,
        idea_id: ideaId,
        analysis_type: type,
        status: "processing",
      })
      .select()
      .single()

    if (analysisError || !analysis) {
      console.error("Failed to create analysis:", analysisError)
      return NextResponse.json({ error: "Failed to create analysis record" }, { status: 500 })
    }

    // 4. Deduct credits
    await supabase.rpc('decrement_credits', { 
      user_id_param: user.id, 
      amount_to_deduct: cost 
    })

    // 5. Trigger Background Job (Trigger.dev or custom async function)
    // Note: In production, we'd fire an event to Trigger.dev here.
    // For this build, if triggerAnalysisJob exists, we call it asynchronously (no await).
    if (typeof triggerAnalysisJob === 'function') {
      // Fire and forget
      triggerAnalysisJob(analysis.id, idea.idea_text).catch(console.error)
    } else {
      // Mock background job for demonstration if trigger file doesn't exist yet
      runMockAgents(analysis.id, supabase).catch(console.error)
    }

    return NextResponse.json({ analysisId: analysis.id })

  } catch (error) {
    console.error("API Analyze Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// Simple mock runner if Trigger.dev is not fully wired in the current branch
async function runMockAgents(analysisId: string, supabase: any) {
  const agents = [
    "idea_validator", "market_researcher", "competitor_intel",
    "problem_prioritizer", "product_manager", "offer_architect",
    "growth_strategist", "distribution_planner", "content_creator",
    "brand_namer", "scale_architect", "synthesis"
  ]

  // Broadcast initial running state
  for (const agent of agents) {
    await supabase.channel(`analysis:${analysisId}`).send({
      type: 'broadcast',
      event: 'agent_status',
      payload: { agentId: agent, status: 'running' }
    })
  }

  // Simulate Parallel execution
  await Promise.allSettled(
    agents.map(async (agent) => {
      // Random delay between 5s and 15s
      const delay = Math.floor(Math.random() * 10000) + 5000
      await new Promise(resolve => setTimeout(resolve, delay))
      
      await supabase.channel(`analysis:${analysisId}`).send({
        type: 'broadcast',
        event: 'agent_status',
        payload: { agentId: agent, status: 'completed' }
      })
    })
  )

  // Mark complete
  await supabase.from("analysis")
    .update({ 
      status: 'completed', 
      overall_score: Math.floor(Math.random() * 40) + 60,
      result_json: { mocked: true, timestamp: new Date().toISOString() } 
    })
    .eq('id', analysisId)

  await supabase.channel(`analysis:${analysisId}`).send({
    type: 'broadcast',
    event: 'analysis_complete',
    payload: {}
  })
}
