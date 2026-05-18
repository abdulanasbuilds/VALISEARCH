"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { BrainCircuit, CheckCircle2, AlertCircle, Loader2 } from "lucide-react"

export default function NewAnalysisPage() {
  const supabase = createClient()
  const router = useRouter()
  const searchParams = useSearchParams()
  const analysisId = searchParams.get("id")

  const [ideaText, setIdeaText] = useState("")
  const [credits, setCredits] = useState<number>(0)
  const [submitting, setSubmitting] = useState(false)
  
  // Progress State
  const [analysisState, setAnalysisState] = useState<any>(null)
  const [agents, setAgents] = useState<any[]>([
    { id: "idea_validator", name: "Idea Validator", status: "pending" },
    { id: "market_researcher", name: "Market Researcher", status: "pending" },
    { id: "competitor_intel", name: "Competitor Intel", status: "pending" },
    { id: "problem_prioritizer", name: "Problem Prioritizer", status: "pending" },
    { id: "product_manager", name: "Product Manager", status: "pending" },
    { id: "offer_architect", name: "Offer Architect", status: "pending" },
    { id: "growth_strategist", name: "Growth Strategist", status: "pending" },
    { id: "distribution_planner", name: "Distribution Planner", status: "pending" },
    { id: "content_creator", name: "Content Creator", status: "pending" },
    { id: "brand_namer", name: "Brand Namer", status: "pending" },
    { id: "scale_architect", name: "Scale Architect", status: "pending" },
    { id: "synthesis", name: "Synthesis Engine", status: "pending" },
  ])
  const [logs, setLogs] = useState<{timestamp: string, message: string}[]>([])

  // Helper to append logs
  const addLog = (message: string) => {
    setLogs(prev => [...prev, { timestamp: new Date().toLocaleTimeString(), message }])
  }

  // Load User & Credits
  useEffect(() => {
    async function loadUser() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: creditData } = await supabase.from("credits").select("balance").eq("user_id", user.id).single()
        setCredits(creditData?.balance ?? 0)
      }
    }
    loadUser()
  }, [supabase])

  // Realtime Subscription if we have an analysisId
  useEffect(() => {
    if (!analysisId) return

    // Fetch initial state
    async function fetchAnalysis() {
      const { data } = await supabase.from("analysis")
        .select("*, ideas(idea_text)")
        .eq("id", analysisId)
        .single()
      
      if (data) {
        setAnalysisState(data)
        if (data.status === "completed") {
          router.push(`/workspace/${analysisId}`)
        }
      }
    }
    fetchAnalysis()

    const channel = supabase.channel(`analysis:${analysisId}`)
      .on('broadcast', { event: 'agent_status' }, (payload) => {
        const { agentId, status, message } = payload.payload
        setAgents(prev => prev.map(a => a.id === agentId ? { ...a, status } : a))
        if (message) addLog(`[${agents.find(a => a.id === agentId)?.name}] ${message}`)
      })
      .on('broadcast', { event: 'analysis_complete' }, () => {
        setTimeout(() => router.push(`/workspace/${analysisId}`), 1000)
      })
      .subscribe()

    // Fallback: poll every 5 seconds just in case realtime drops
    const interval = setInterval(async () => {
      const { data } = await supabase.from("analysis").select("status").eq("id", analysisId).single()
      if (data?.status === "completed") {
        router.push(`/workspace/${analysisId}`)
      }
    }, 5000)

    return () => {
      supabase.removeChannel(channel)
      clearInterval(interval)
    }
  }, [analysisId, supabase, router, agents])

  const handleSubmit = async (type: "quick" | "full") => {
    if (!ideaText.trim() || ideaText.length < 20) return
    const cost = type === "quick" ? 1 : 2
    if (credits < cost) {
      alert("Insufficient credits. Please upgrade.")
      return
    }

    setSubmitting(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      const { data: idea } = await supabase.from("ideas").insert({
        user_id: user?.id,
        idea_text: ideaText,
        word_count: ideaText.split(/\s+/).length,
      }).select().single()

      if (idea) {
        const res = await fetch("/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ideaId: idea.id, type })
        })
        const data = await res.json()
        if (data.analysisId) {
          router.push(`/workspace/new?id=${data.analysisId}`)
        }
      }
    } catch (error) {
      console.error(error)
      setSubmitting(false)
    }
  }

  // --- RENDERING ---

  if (analysisId) {
    // STATE B: Analysis Running
    const completedAgents = agents.filter(a => a.status === "completed").length
    const ideaSnippet = Array.isArray(analysisState?.ideas) 
      ? analysisState?.ideas[0]?.idea_text 
      : analysisState?.ideas?.idea_text

    return (
      <div className="min-h-screen bg-[#F9FAFB] p-6 pb-24">
        <div className="max-w-5xl mx-auto space-y-8">
          
          {/* Idea Preview */}
          <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
            <span className="text-[10px] font-bold text-[#1B4FFF] uppercase tracking-wider mb-2 block">Your Idea</span>
            <p className="text-sm text-gray-800 italic line-clamp-3">"{ideaSnippet || 'Loading...'}"</p>
          </div>

          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Generating your intelligence report</h1>
            <p className="text-gray-500">12 specialized AI agents are researching your idea in parallel</p>
          </div>

          {/* Progress Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden mb-2">
              <div 
                className="h-full bg-[#1B4FFF] transition-all duration-500 ease-out" 
                style={{ width: `${(completedAgents / 12) * 100}%` }}
              />
            </div>
            <div className="flex justify-end">
              <span className="text-sm font-medium text-gray-600">{completedAgents} of 12 agents complete</span>
            </div>
          </div>

          {/* Agent Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {agents.map((agent) => (
              <div 
                key={agent.id}
                className={`p-4 rounded-xl border transition-all duration-300 flex items-center gap-4 ${
                  agent.status === "completed" ? "bg-green-50 border-green-200" :
                  agent.status === "running" ? "bg-blue-50 border-blue-200" :
                  agent.status === "failed" ? "bg-red-50 border-red-200" :
                  "bg-white border-gray-200"
                }`}
              >
                {/* Icon */}
                <div className="shrink-0">
                  {agent.status === "completed" ? (
                    <CheckCircle2 className="w-8 h-8 text-green-600 animate-in fade-in" />
                  ) : agent.status === "running" ? (
                    <div className="w-8 h-8 rounded-full border-2 border-blue-200 border-t-[#1B4FFF] animate-spin" />
                  ) : agent.status === "failed" ? (
                    <AlertCircle className="w-8 h-8 text-red-500" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                      <BrainCircuit className="w-4 h-4 text-gray-400" />
                    </div>
                  )}
                </div>

                {/* Text */}
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium truncate ${
                    agent.status === "completed" ? "text-green-900" :
                    agent.status === "running" ? "text-blue-900" :
                    agent.status === "failed" ? "text-red-900" :
                    "text-gray-900"
                  }`}>
                    {agent.name}
                  </p>
                  <p className={`text-xs truncate ${
                    agent.status === "completed" ? "text-green-600" :
                    agent.status === "running" ? "text-blue-600" :
                    agent.status === "failed" ? "text-red-600" :
                    "text-gray-400"
                  }`}>
                    {agent.status === "completed" ? "Complete" :
                     agent.status === "running" ? "Analyzing data..." :
                     agent.status === "failed" ? "Using baseline data" :
                     "Queued"}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Live Feed */}
          <div className="bg-gray-50 rounded-xl p-4 h-32 overflow-y-auto border border-gray-200 flex flex-col-reverse">
            {logs.length === 0 ? (
              <p className="text-sm text-gray-400 italic text-center my-auto">Waiting for agent activity...</p>
            ) : (
              <div className="space-y-2">
                {logs.map((log, i) => (
                  <div key={i} className="text-xs text-gray-600 animate-in slide-in-from-bottom-2 fade-in">
                    <span className="text-gray-400 mr-2">[{log.timestamp}]</span>
                    {log.message}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="text-center pb-8 text-sm text-gray-500">
            <p>This usually takes 30-90 seconds.</p>
            <p>You can close this tab — your report will be waiting when you return.</p>
          </div>
        </div>
      </div>
    )
  }

  // STATE A: Idea Entry
  return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col items-center pt-24 px-4">
      <div className="max-w-2xl w-full">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">Validate a new idea</h1>
        <p className="text-gray-500 mb-8 text-center">Describe your startup concept and let our 12 AI agents analyze it.</p>
        
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              What startup idea do you want to validate?
            </label>
            <textarea
              value={ideaText}
              onChange={(e) => setIdeaText(e.target.value)}
              placeholder="I want to build a platform that helps freelance designers manage their client feedback in one place. It will integrate with Figma and Slack..."
              className="w-full resize-none text-gray-900 focus:outline-none focus:ring-0 p-0 text-lg placeholder:text-gray-300"
              rows={6}
              disabled={submitting}
            />
            <div className="flex justify-between items-center mt-4 text-xs text-gray-400">
              <span>{ideaText.length} characters</span>
              <span>Min 20 required</span>
            </div>
          </div>
          <div className="px-6 py-4 bg-gray-50 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-600">Balance: {credits} credits</span>
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button 
                onClick={() => handleSubmit("quick")}
                disabled={submitting || ideaText.length < 20}
                className="flex-1 sm:flex-none px-6 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
              >
                Quick (1 credit)
              </button>
              <button 
                onClick={() => handleSubmit("full")}
                disabled={submitting || ideaText.length < 20}
                className="flex-1 sm:flex-none px-6 py-2.5 text-sm font-semibold text-white bg-[#1B4FFF] hover:bg-[#1240CC] rounded-lg shadow-sm disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
              >
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                {submitting ? "Starting..." : "Full Report (2 credits)"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
