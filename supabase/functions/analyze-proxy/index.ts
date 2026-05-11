import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
}

interface RequestBody {
  ideaText: string
  userId: string
  analysisId: string
  analysisType: string
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    const openRouterKey = Deno.env.get("OPENROUTER_API_KEY")

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const body: RequestBody = await req.json()
    const { ideaText, userId, analysisId, analysisType } = body

    // Simulate running analysis - in production this would call OpenRouter
    console.log(`Running analysis ${analysisId} for user ${userId}`)
    console.log(`Idea: ${ideaText.substring(0, 50)}...`)

    // Mock analysis result (in production, run the 12 agents)
    const mockResult = {
      idea_validator: {
        overall_score: 68,
        verdict: "Promising",
        dimensions: [],
        strengths: ["Clear problem statement"],
        weaknesses: ["Competition exists"],
        recommendation: "Proceed with differentiation",
      },
      synthesis: {
        executive_summary: "This is a promising startup idea that addresses a real market need.",
        overall_score: 68,
        verdict: "promising",
        key_insights: [],
        top_3_strengths: ["Clear value proposition", "Growing market", "Team experience"],
        top_3_risks: ["Competition", "Execution risk", "Market timing"],
        one_line_pitch: "AI-powered startup validation for emerging market founders",
      },
    }

    // Update analysis record with result
    await supabase
      .from("analysis")
      .update({
        status: "completed",
        overall_score: mockResult.synthesis.overall_score,
        result_json: mockResult,
      })
      .eq("id", analysisId)

    // Update analysis progress
    await supabase
      .from("analysis_progress")
      .upsert({
        analysis_id: analysisId,
        agent_name: "synthesis",
        status: "completed",
        started_at: new Date().toISOString(),
        completed_at: new Date().toISOString(),
      })

    return new Response(
      JSON.stringify({
        success: true,
        analysisId,
        status: "completed",
        score: mockResult.synthesis.overall_score,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    )
  } catch (error) {
    console.error("Edge function error:", error)
    return new Response(
      JSON.stringify({ error: "Analysis failed" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    )
  }
})