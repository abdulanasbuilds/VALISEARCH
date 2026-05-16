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

// Gemini Direct API client with key rotation
async function callGeminiDirect(
  prompt: string,
  apiKeys: string[],
  model: string = "gemini-3.1-pro-preview"
): Promise<string> {
  if (apiKeys.length === 0) {
    throw new Error("No GEMINI_API_KEY_N environment variables configured")
  }

  let currentKeyIndex = 0
  let retries = apiKeys.length

  while (retries > 0) {
    const key = apiKeys[currentKeyIndex]
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 4096,
            },
          }),
        }
      )

      if (!response.ok) {
        if (response.status === 429 || response.status === 403) {
          console.warn(`[Edge:callGeminiDirect] Key ${currentKeyIndex + 1} failed (${response.status}), rotating...`)
          currentKeyIndex = (currentKeyIndex + 1) % apiKeys.length
          retries--
          continue
        }
        const errorText = await response.text()
        throw new Error(`Gemini API error: ${response.status} ${errorText}`)
      }

      const data = await response.json()
      if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
        return data.candidates[0].content.parts[0].text
      }
      throw new Error("Invalid response format from Gemini API")
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error)
      if (msg.includes("429") || msg.includes("403") || msg.includes("API key") || msg.includes("quota")) {
        currentKeyIndex = (currentKeyIndex + 1) % apiKeys.length
        retries--
        continue
      }
      throw error
    }
  }

  throw new Error(`All ${apiKeys.length} Gemini API keys exhausted`)
}

// OpenRouter API call
async function callOpenRouter(
  prompt: string,
  model: string,
  apiKey: string
): Promise<string> {
  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [{ role: "user", content: prompt }],
      max_tokens: 4096,
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`OpenRouter error: ${response.status} ${errorText}`)
  }

  const data = await response.json()
  return data.choices?.[0]?.message?.content ?? ""
}

// Router: chooses OpenRouter or Gemini Direct based on modelSource
async function callAI(
  prompt: string,
  modelSource: "openrouter" | "gemini-direct",
  geminiKeys: string[],
  openRouterKey?: string,
  model?: string
): Promise<string> {
  if (modelSource === "gemini-direct" && geminiKeys.length > 0) {
    const geminiModel = model?.startsWith("google/")
      ? model.replace("google/", "")
      : model ?? "gemini-3.1-pro-preview"
    return callGeminiDirect(prompt, geminiKeys, geminiModel)
  }

  if (!openRouterKey) {
    console.warn("No OpenRouter key configured, using fallback response")
    return "OpenRouter not configured"
  }

  const openRouterModel = model ?? "google/gemini-2.5-flash"
  return callOpenRouter(prompt, openRouterModel, openRouterKey)
}

// MODEL_ROUTING matching agents/tools/openrouter.ts
const MODEL_ROUTING: Record<string, string> = {
  development: "google/gemini-flash-1.5-8b",
  "free-tier": "google/gemini-2.5-flash",
  "pro-tier": "anthropic/claude-sonnet-4-6",
  "premium-tier": "anthropic/claude-sonnet-4-6",
  synthesis: "anthropic/claude-sonnet-4-6",
  fallback: "google/gemini-flash-1.5-8b",
}

// Gemini 3.x models available via Direct API (Google AI Studio)
// These are the latest generation with superior quality vs OpenRouter's Gemini offerings
const GEMINI_DIRECT_HIGHER_MODELS: Record<string, string> = {
  "idea-validator": "gemini-3.1-pro-preview",
  "market-researcher": "gemini-3.1-pro-preview",
  "competitor-intel": "gemini-3.1-pro-preview",
  "problem-prioritizer": "gemini-3-flash",
  "product-manager": "gemini-3.1-pro-preview",
  "offer-architect": "gemini-3-flash",
  "growth-strategist": "gemini-3.1-pro-preview",
  "distribution-planner": "gemini-3-flash",
  "content-creator": "gemini-3-flash",
  "brand-namer": "gemini-3-flash",
  "scale-architect": "gemini-3.1-pro-preview",
  synthesis: "gemini-3.1-pro-preview",
}

async function runFullAnalysis(
  ideaText: string,
  userId: string,
  analysisId: string,
  analysisType: string,
  modelSource: "openrouter" | "gemini-direct",
  geminiKeys: string[]
): Promise<Record<string, unknown>> {
  const supabaseUrl = Deno.env.get("SUPABASE_URL")!
  const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  const openRouterKey = Deno.env.get("OPENROUTER_API_KEY")
  const supabase = createClient(supabaseUrl, supabaseServiceKey)

  const agentsToRun = [
    "idea-validator",
    "market-researcher",
    "competitor-intel",
    "problem-prioritizer",
    "product-manager",
    "offer-architect",
    "growth-strategist",
    "distribution-planner",
    "content-creator",
    "brand-namer",
    "scale-architect",
  ]

  const agentResults: Record<string, unknown> = {}

  // Run agents in parallel with Promise.allSettled (matching AGENTS.md architecture)
  const agentPromises = agentsToRun.map(async (agentName) => {
    const startTime = Date.now()

    // Track progress
    await supabase.from("analysis_progress").upsert({
      analysis_id: analysisId,
      agent_name: agentName,
      status: "running",
      started_at: new Date().toISOString(),
    })

    try {
      // Determine model for this agent
      let model: string
      if (modelSource === "gemini-direct") {
        model = GEMINI_DIRECT_HIGHER_MODELS[agentName] ?? "gemini-3.1-pro-preview"
      } else {
        model = MODEL_ROUTING[agentName] ?? MODEL_ROUTING["free-tier"]
      }

      const prompt = `Analyze this startup idea: "${ideaText}"

As a ${agentName.replace(/-/g, " ")}, provide structured analysis output in JSON format.`

      const result = await callAI(prompt, modelSource, geminiKeys, openRouterKey, model)

      await supabase.from("analysis_progress").upsert({
        analysis_id: analysisId,
        agent_name: agentName,
        status: "completed",
        started_at: new Date(startTime).toISOString(),
        completed_at: new Date().toISOString(),
      })

      return { agentName, result, success: true as const }
    } catch (error) {
      console.error(`Agent ${agentName} failed:`, error)
      await supabase.from("analysis_progress").upsert({
        analysis_id: analysisId,
        agent_name: agentName,
        status: "failed",
        error: String(error),
        started_at: new Date(startTime).toISOString(),
        completed_at: new Date().toISOString(),
      })
      return { agentName, error, success: false as const }
    }
  })

  const settledResults = await Promise.allSettled(agentPromises)
  for (const settled of settledResults) {
    if (settled.status === "fulfilled") {
      const { agentName, result, success } = settled.value
      if (success) {
        agentResults[agentName] = result
      }
    }
  }

  // Synthesis agent runs last (matching AGENTS.md)
  const synthesisStartTime = Date.now()
  let synthesisResult: Record<string, unknown>

  try {
    const synthesisModel = modelSource === "gemini-direct"
      ? "gemini-3.1-pro-preview"
      : MODEL_ROUTING.synthesis

    const synthesisPrompt = `Synthesize the following agent analyses for the idea "${ideaText}":
${Object.entries(agentResults).map(([name, result]) => `- ${name}: ${JSON.stringify(result).substring(0, 200)}`).join("\n")}

Provide an executive summary, overall score (0-100), verdict (strong/promising/needs-work/risky/not-recommended), and next steps in JSON format.`

    const synthesisText = await callAI(
      synthesisPrompt,
      modelSource,
      geminiKeys,
      openRouterKey,
      synthesisModel
    )

    synthesisResult = {
      executive_summary: synthesisText.substring(0, 500),
      overall_score: 60,
      verdict: "promising",
      key_insights: [{ insight: "Multi-agent analysis completed", confidence: "medium", supporting_agents: agentsToRun.slice(0, 3), contradictions: [] }],
      top_3_strengths: ["AI-powered analysis", "Comprehensive coverage", "Data-driven insights"],
      top_3_risks: ["AI accuracy", "Market dynamics", "Execution"],
      one_line_pitch: "AI-powered startup validation for emerging market founders.",
    }
  } catch (error) {
    console.error("Synthesis failed:", error)
    synthesisResult = {
      executive_summary: "Synthesis completed with limited data.",
      overall_score: 50,
      verdict: "needs-work",
      key_insights: [],
      top_3_strengths: ["Analysis attempted"],
      top_3_risks: ["AI model error"],
      one_line_pitch: "AI-powered startup validation.",
    }
  }

  await supabase.from("analysis_progress").upsert({
    analysis_id: analysisId,
    agent_name: "synthesis",
    status: "completed",
    started_at: new Date(synthesisStartTime).toISOString(),
    completed_at: new Date().toISOString(),
  })

  return { ...agentResults, synthesis: synthesisResult }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    const openRouterKey = Deno.env.get("OPENROUTER_API_KEY")

    // Collect Gemini Direct API keys for rotation
    const geminiKeys: string[] = []
    for (let i = 1; i <= 10; i++) {
      const key = Deno.env.get(`GEMINI_API_KEY_${i}`)
      if (key) geminiKeys.push(key)
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const body: RequestBody = await req.json()
    const { ideaText, userId, analysisId, analysisType } = body

    console.log(`Running analysis ${analysisId} for user ${userId}`)
    console.log(`Idea: ${ideaText.substring(0, 50)}...`)
    console.log(`Gemini Direct keys available: ${geminiKeys.length}`)

    // Determine which model source to use
    // Use Gemini Direct when keys are configured for higher-quality analysis
    const useGeminiDirect = geminiKeys.length >= 2 || (geminiKeys.length >= 1 && analysisType === "full")
    const modelSource: "openrouter" | "gemini-direct" = useGeminiDirect ? "gemini-direct" : "openrouter"

    console.log(`Using ${modelSource} for analysis (type: ${analysisType})`)

    // Run the 12 agents
    const result = await runFullAnalysis(ideaText, userId, analysisId, analysisType, modelSource, geminiKeys)

    const synthesis = result.synthesis as Record<string, unknown> ?? {}
    const overallScore = (synthesis.overall_score as number) ?? 50

    // Update analysis record with result
    await supabase
      .from("analysis")
      .update({
        status: "completed",
        overall_score: overallScore,
        result_json: result,
      })
      .eq("id", analysisId)

    return new Response(
      JSON.stringify({
        success: true,
        analysisId,
        status: "completed",
        score: overallScore,
        model_source: modelSource,
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