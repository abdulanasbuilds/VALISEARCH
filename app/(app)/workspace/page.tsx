"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { 
  Home, Plus, Settings, CreditCard, Zap, Clock, 
  ChevronRight, BrainCircuit 
} from "lucide-react"

// --- Components ---

function AnalysisCardSkeleton() {
  return (
    <div className="flex animate-pulse items-center gap-4 border-b border-gray-100 p-4 w-full">
      <div className="h-12 w-12 rounded-lg bg-gray-200 shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-4 w-3/4 rounded bg-gray-200" />
        <div className="h-3 w-1/2 rounded bg-gray-200" />
      </div>
      <div className="h-6 w-16 rounded-full bg-gray-200 shrink-0" />
      <div className="h-5 w-5 rounded bg-gray-200 shrink-0" />
    </div>
  )
}

function EmptyWorkspace() {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
      <div className="mb-6 rounded-full bg-blue-50 p-6">
        <BrainCircuit className="h-12 w-12 text-[#1B4FFF]" />
      </div>
      <h3 className="mb-2 text-xl font-semibold text-gray-900">Your first analysis is one idea away</h3>
      <p className="max-w-md text-gray-500">
        Type your startup idea above to get a complete intelligence report in 60 seconds.
      </p>
    </div>
  )
}

export default function WorkspacePage() {
  const supabase = createClient()
  const router = useRouter()
  
  const [user, setUser] = useState<{ email: string; id: string } | null>(null)
  const [profile, setProfile] = useState<{ plan: string; is_trial_active: boolean; trial_ends_at: string | null } | null>(null)
  const [credits, setCredits] = useState<number>(0)
  const [analyses, setAnalyses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [ideaText, setIdeaText] = useState("")
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    async function loadData() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push("/login?returnUrl=/workspace")
        return
      }
      setUser({ email: user.email ?? "", id: user.id })

      const [profileRes, creditsRes, analysesRes] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", user.id).single(),
        supabase.from("credits").select("balance").eq("user_id", user.id).single(),
        supabase.from("analysis")
          .select("id, overall_score, status, analysis_type, created_at, ideas(title, idea_text)")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(20)
      ])

      if (profileRes.data) setProfile(profileRes.data)
      if (creditsRes.data) setCredits(creditsRes.data.balance)
      if (analysesRes.data) setAnalyses(analysesRes.data)
      setLoading(false)
    }
    loadData()
  }, [router, supabase])

  const handleSubmit = async (type: "quick" | "full") => {
    if (!ideaText.trim() || ideaText.length < 20) return
    const cost = type === "quick" ? 1 : 2
    if (credits < cost) {
      // Show upgrade modal logic here
      alert("Insufficient credits. Please upgrade.")
      return
    }

    setSubmitting(true)
    try {
      // Create idea and trigger analysis
      const { data: idea } = await supabase.from("ideas").insert({
        user_id: user?.id,
        idea_text: ideaText,
        word_count: ideaText.split(/\s+/).length,
      }).select().single()

      if (idea) {
        // Trigger background job via API
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

  const formatRelativeTime = (dateString: string) => {
    const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' })
    const daysDifference = Math.round((new Date(dateString).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    if (daysDifference === 0) return "Today"
    return rtf.format(daysDifference, 'day')
  }

  // Derived state
  const isTrial = profile?.is_trial_active
  const trialEnds = profile?.trial_ends_at ? new Date(profile.trial_ends_at).toLocaleDateString() : ""
  
  let planBadgeColor = "bg-gray-100 text-gray-800"
  let planBadgeText = "STARTER"
  if (isTrial) {
    planBadgeColor = "bg-amber-100 text-amber-800"
    planBadgeText = "PRO TRIAL"
  } else if (profile?.plan === 'pro') {
    planBadgeColor = "bg-blue-100 text-blue-800"
    planBadgeText = "PRO"
  } else if (profile?.plan === 'business') {
    planBadgeColor = "bg-gray-800 text-white"
    planBadgeText = "BUSINESS"
  }

  const maxCredits = profile?.plan === 'starter' ? 6 : 100 // Simplified for display
  const creditsUsed = Math.max(0, maxCredits - credits)

  return (
    <div className="flex h-screen bg-[#F9FAFB] overflow-hidden">
      
      {/* LEFT SIDEBAR (Desktop) */}
      <aside className="hidden md:flex w-[240px] flex-col border-r border-gray-200 bg-white h-full">
        {/* User Profile Area */}
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-10 w-10 shrink-0 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-lg">
              {user?.email?.[0]?.toUpperCase() || "U"}
            </div>
            <div className="overflow-hidden">
              <p className="truncate text-sm font-medium text-gray-900">{user?.email}</p>
              <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold mt-1 ${planBadgeColor}`}>
                {planBadgeText}
              </span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          <Link href="/workspace" className="flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg bg-blue-50 text-[#1B4FFF]">
            <div className="flex items-center gap-3">
              <Home className="h-5 w-5" />
              All Analyses
            </div>
            <span className="bg-white text-blue-700 px-2 py-0.5 rounded-full text-xs font-bold">{analyses.length}</span>
          </Link>
          <Link href="/workspace/new" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-gray-600 hover:bg-gray-50 hover:text-gray-900">
            <Plus className="h-5 w-5" />
            New Analysis
          </Link>
          
          <div className="h-px bg-gray-200 my-4 mx-3" />
          
          <Link href="/settings" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-gray-600 hover:bg-gray-50 hover:text-gray-900">
            <Settings className="h-5 w-5" />
            Settings
          </Link>
          <Link href="/settings/billing" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-gray-600 hover:bg-gray-50 hover:text-gray-900">
            <CreditCard className="h-5 w-5" />
            Billing
          </Link>
        </nav>

        {/* Credits & Upgrade */}
        <div className="p-4 border-t border-gray-100 space-y-4">
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="flex items-center gap-1.5 text-xs font-medium text-gray-700">
                <Zap className="h-4 w-4 text-amber-500" />
                {credits} credits remaining
              </span>
            </div>
            <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-[#1B4FFF]" style={{ width: `${(credits / maxCredits) * 100}%` }} />
            </div>
          </div>

          {credits < 10 && profile?.plan === 'starter' && (
            <Link href="/settings/billing" className="block bg-blue-50 border border-blue-200 rounded-xl p-3 text-center transition-colors hover:bg-blue-100">
              <p className="text-xs font-semibold text-blue-900 mb-1">Unlock full power</p>
              <p className="text-sm font-bold text-[#1B4FFF]">&rarr; Upgrade to Pro</p>
            </Link>
          )}
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col h-full relative overflow-y-auto pb-20 md:pb-0">
        
        {/* Trial Notice (Yellow Callout) */}
        {isTrial && (
          <div className="bg-amber-50 border-b border-amber-200 px-6 py-4 flex items-start gap-3">
            <Clock className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-amber-900">You're on a 7-day Pro trial</p>
              <p className="text-sm text-amber-700 mt-0.5">
                You have full access to all 12 AI agents. Trial ends {trialEnds}. 
                <Link href="/settings/billing" className="underline font-medium ml-1">Upgrade to keep access.</Link>
              </p>
            </div>
          </div>
        )}

        <div className="flex-1 p-4 md:p-8 max-w-4xl mx-auto w-full space-y-8">
          
          {/* Header Row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900">Your analyses</h1>
              <span className="bg-gray-100 text-gray-600 px-2.5 py-0.5 rounded-full text-sm font-medium border border-gray-200">
                {analyses.length}
              </span>
            </div>
            <Link href="/workspace/new">
              <button className="bg-[#1B4FFF] hover:bg-[#1240CC] text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors shadow-sm hidden sm:block">
                New analysis
              </button>
            </Link>
          </div>

          {/* Quick Input Box */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-100 bg-gray-50">
              <label className="text-sm font-semibold text-gray-700">What's your next startup idea?</label>
            </div>
            <div className="p-4">
              <textarea
                value={ideaText}
                onChange={(e) => setIdeaText(e.target.value)}
                placeholder="Describe the problem, the solution, and who it's for..."
                className="w-full resize-none text-gray-900 focus:outline-none min-h-[80px]"
                rows={3}
                disabled={submitting}
              />
            </div>
            <div className="px-4 py-3 bg-gray-50 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-gray-500 font-medium">
                Quick: 1 credit <span className="mx-2">|</span> Full: 2 credits
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button 
                  onClick={() => handleSubmit("quick")}
                  disabled={submitting || ideaText.length < 20}
                  className="flex-1 sm:flex-none px-4 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
                >
                  Quick
                </button>
                <button 
                  onClick={() => handleSubmit("full")}
                  disabled={submitting || ideaText.length < 20}
                  className="flex-1 sm:flex-none px-4 py-2 text-sm font-semibold text-white bg-[#1B4FFF] hover:bg-[#1240CC] rounded-lg shadow-sm disabled:opacity-50 transition-colors"
                >
                  {submitting ? "Starting..." : "Full Report"}
                </button>
              </div>
            </div>
          </div>

          {/* Analyses List */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            {loading ? (
              <div className="divide-y divide-gray-100">
                <AnalysisCardSkeleton />
                <AnalysisCardSkeleton />
                <AnalysisCardSkeleton />
              </div>
            ) : analyses.length === 0 ? (
              <EmptyWorkspace />
            ) : (
              <div className="divide-y divide-gray-100">
                {analyses.map((analysis) => {
                  const score = analysis.overall_score || 0
                  const isGo = score >= 70
                  const isPivot = score >= 40 && score < 70
                  
                  let scoreColors = "bg-red-50 text-red-700 border-red-200"
                  let verdict = "STOP"
                  
                  if (isGo) {
                    scoreColors = "bg-green-50 text-green-700 border-green-200"
                    verdict = "GO"
                  } else if (isPivot) {
                    scoreColors = "bg-amber-50 text-amber-700 border-amber-200"
                    verdict = "PIVOT"
                  }

                  const ideasObj = Array.isArray(analysis.ideas) ? analysis.ideas[0] : (analysis.ideas as any)
                  const title = ideasObj?.title || ideasObj?.idea_text?.substring(0, 50) + "..." || "Untitled Analysis"

                  return (
                    <div 
                      key={analysis.id}
                      onClick={() => router.push(`/workspace/${analysis.id}`)}
                      className="flex items-center p-4 hover:bg-gray-50 cursor-pointer transition-colors w-full gap-4 group"
                    >
                      {/* Left: Score Badge */}
                      <div className={`h-12 w-12 shrink-0 rounded-xl border flex items-center justify-center font-bold text-lg ${scoreColors}`}>
                        {score || "?"}
                      </div>

                      {/* Middle: Info */}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-gray-900 truncate mb-1">
                          {title}
                        </h4>
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-gray-500">
                            {formatRelativeTime(analysis.created_at)}
                          </span>
                          <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wide">
                            {analysis.analysis_type}
                          </span>
                        </div>
                      </div>

                      {/* Right: Verdict */}
                      <div className="flex items-center gap-4 shrink-0">
                        <span className={`hidden sm:inline-block px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${scoreColors.replace('50', '100').replace('200', '300')}`}>
                          {verdict}
                        </span>
                        <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-[#1B4FFF] transition-colors" />
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
          
          {!loading && analyses.length >= 20 && (
            <div className="flex justify-center pb-8">
              <Button variant="outline" className="text-gray-600 bg-white hover:bg-gray-50">
                Load more
              </Button>
            </div>
          )}
        </div>
      </main>

      {/* MOBILE BOTTOM TAB BAR */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 flex items-center justify-around z-40 pb-safe">
        <Link href="/workspace" className="flex flex-col items-center gap-1 p-3 text-[#1B4FFF]">
          <Home className="h-5 w-5" />
          <span className="text-[10px] font-medium">Home</span>
        </Link>
        <Link href="/workspace/new" className="flex flex-col items-center gap-1 p-3 text-gray-400 hover:text-gray-600">
          <Plus className="h-5 w-5" />
          <span className="text-[10px] font-medium">New</span>
        </Link>
        <Link href="/settings" className="flex flex-col items-center gap-1 p-3 text-gray-400 hover:text-gray-600">
          <Settings className="h-5 w-5" />
          <span className="text-[10px] font-medium">Settings</span>
        </Link>
        <Link href="/settings/billing" className="flex flex-col items-center gap-1 p-3 text-gray-400 hover:text-gray-600">
          <CreditCard className="h-5 w-5" />
          <span className="text-[10px] font-medium">Billing</span>
        </Link>
      </nav>

    </div>
  )
}
