"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useParams, useRouter } from "next/navigation"
import { BrainCircuit, ExternalLink, Calendar, CheckCircle2, ChevronRight, Download, AlertCircle } from "lucide-react"

// A helper for empty/locked states if needed
const LockedSection = ({ title, feature }: { title: string, feature: string }) => (
  <div className="rounded-xl border border-dashed border-gray-300 p-8 text-center bg-gray-50/50">
    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center border mx-auto mb-4">
      <BrainCircuit className="h-5 w-5 text-gray-400" />
    </div>
    <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
    <p className="text-sm text-gray-500 mb-4">{feature} is locked on your current plan.</p>
    <button className="text-sm font-semibold text-[#1B4FFF] hover:underline">Upgrade to Pro &rarr;</button>
  </div>
)

export default function ExecutiveReportPage() {
  const supabase = createClient()
  const router = useRouter()
  const { id } = useParams()
  
  const [analysis, setAnalysis] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    async function loadData() {
      const { data, error } = await supabase
        .from("analysis")
        .select("*, ideas(*)")
        .eq("id", id)
        .single()
        
      if (error || !data) {
        console.error(error)
        router.push("/workspace")
        return
      }
      setAnalysis(data)
      setLoading(false)
    }
    loadData()
  }, [id, supabase, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1B4FFF]" />
      </div>
    )
  }

  // Parse result JSON (handles both mock and real schema)
  const resultData = analysis.result_json || {}
  const score = analysis.overall_score || 0
  
  // Example Extractors
  const ideaData = Array.isArray(analysis.ideas) ? analysis.ideas[0] : analysis.ideas
  const title = ideaData?.title || "ValiSearch Intelligence Report"
  const verdict = score >= 70 ? "GO (Strong Potential)" : score >= 40 ? "PIVOT (Mixed Signals)" : "STOP (High Risk)"
  const verdictColor = score >= 70 ? "text-green-700 bg-green-50" : score >= 40 ? "text-amber-700 bg-amber-50" : "text-red-700 bg-red-50"

  // We mock the 13 sections if the result is empty or mocked for this demonstration
  const summary = resultData.summary || "This startup shows strong potential but requires tight execution. Focus heavily on distribution before building complex features."
  const strengths = resultData.strengths || ["Clear target audience", "High margin potential", "Growing market"]
  const risks = resultData.risks || ["Intense competition", "High initial CAC", "Technical complexity"]

  return (
    <div className="min-h-screen bg-[#F9FAFB] pb-32">
      
      {/* Top sticky nav */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
            <span className="hover:text-gray-900 cursor-pointer" onClick={() => router.push("/workspace")}>Workspace</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900 truncate max-w-[200px]">{title}</span>
          </div>
          <button className="flex items-center gap-2 text-sm font-semibold text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 px-4 py-2 rounded-lg shadow-sm transition-colors">
            <Download className="w-4 h-4" /> Export PDF
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 md:px-8 mt-12 space-y-16">
        
        {/* Header Section */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <span className="bg-[#1B4FFF] text-white text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded">Executive Summary</span>
            <span className="text-sm text-gray-500 flex items-center gap-1"><Calendar className="w-4 h-4" /> {new Date(analysis.created_at).toLocaleDateString()}</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 leading-tight mb-6">{title}</h1>
          
          <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              
              {/* Score Box */}
              <div className="shrink-0 flex flex-col items-center justify-center bg-gray-50 rounded-xl border border-gray-200 w-32 h-32">
                <span className="text-5xl font-black tracking-tighter text-gray-900">{score}</span>
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">/ 100</span>
              </div>
              
              {/* Verdict & Summary */}
              <div className="flex-1 space-y-4">
                <div>
                  <span className={`inline-block px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider mb-2 ${verdictColor}`}>
                    Verdict: {verdict}
                  </span>
                  <p className="text-lg text-gray-700 leading-relaxed">{summary}</p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                  <div>
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Top Strengths</h4>
                    <ul className="space-y-1.5">
                      {strengths.map((s: string, i: number) => (
                        <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Critical Risks</h4>
                    <ul className="space-y-1.5">
                      {risks.map((r: string, i: number) => (
                        <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0 mt-1.5 mx-1" />
                          {r}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 1. Idea Scorecard */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-4">1. Idea Scorecard</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {['Clarity', 'Feasibility', 'Market Fit', 'Scalability', 'Timing', 'Differentiation'].map((dim, i) => (
              <div key={i} className="bg-white p-4 rounded-xl border border-gray-200">
                <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{dim}</div>
                <div className="text-2xl font-bold text-gray-900 mb-2">{Math.floor(Math.random() * 20) + 80}/100</div>
                <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-[#1B4FFF]" style={{ width: '85%' }} />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 2. Market Dynamics */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-4">2. Market Dynamics</h2>
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-2">TAM / SAM / SOM Analysis</h3>
            <p className="text-gray-600 mb-4">The target market is expanding at a 15% CAGR. Your total addressable market is estimated at $4.2B globally, with a serviceable obtainable market of $50M within the first 3 years.</p>
            <div className="flex flex-wrap gap-2">
              <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded text-sm font-medium">B2B SaaS</span>
              <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded text-sm font-medium">High Growth</span>
            </div>
          </div>
        </section>

        {/* 3. Competitor Matrix */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-4">3. Competitor Matrix</h2>
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Competitor</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Strengths</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Your Edge</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {[1, 2, 3].map((_, i) => (
                  <tr key={i}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Incumbent {i+1}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">Established brand, large featureset</td>
                    <td className="px-6 py-4 text-sm text-[#1B4FFF] font-medium">Better UX, lower entry price</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* 4. Validated Pain Points */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-4">4. Validated Pain Points</h2>
          <div className="space-y-3">
            {[
              "Users hate the clunky onboarding of existing tools.",
              "Pricing is too opaque for mid-market teams.",
              "Lack of native integrations with modern stacks."
            ].map((pain, i) => (
              <div key={i} className="bg-white p-4 rounded-xl border border-gray-200 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <p className="text-gray-700 text-sm">{pain}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 5. MVP Product Roadmap */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-4">5. MVP Product Roadmap</h2>
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Phase 1: Core Value (Weeks 1-4)</h3>
            <ul className="list-disc pl-5 space-y-2 text-sm text-gray-600 mb-6">
              <li>User authentication and basic profiles</li>
              <li>Core dashboard with single primary workflow</li>
              <li>Stripe checkout integration</li>
            </ul>
            <h3 className="font-semibold text-gray-900 mb-4">Phase 2: Retention (Weeks 5-8)</h3>
            <ul className="list-disc pl-5 space-y-2 text-sm text-gray-600">
              <li>Email notifications and daily summaries</li>
              <li>Team invites and basic RBAC</li>
            </ul>
          </div>
        </section>

        {/* 6. Offer & Pricing */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-4">6. Offer & Pricing</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white p-6 rounded-xl border border-gray-200 text-center">
              <div className="text-sm font-bold text-gray-400 uppercase mb-2">Starter</div>
              <div className="text-3xl font-bold text-gray-900 mb-4">$29<span className="text-sm text-gray-500">/mo</span></div>
              <p className="text-sm text-gray-600">Perfect for individuals starting out. Includes core features.</p>
            </div>
            <div className="bg-blue-50 p-6 rounded-xl border border-blue-200 text-center">
              <div className="text-sm font-bold text-[#1B4FFF] uppercase mb-2">Pro</div>
              <div className="text-3xl font-bold text-gray-900 mb-4">$79<span className="text-sm text-gray-500">/mo</span></div>
              <p className="text-sm text-gray-600">For teams scaling up. Includes API and priority support.</p>
            </div>
          </div>
        </section>

        {/* Sections 7-12 (Mocked for brevity, but structurally identical) */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-4">7. Go-to-Market & Growth Strategy</h2>
          <p className="text-gray-600 leading-relaxed bg-white p-6 rounded-xl border border-gray-200">
            Start with outbound cold email targeting mid-level managers. Simultaneously build an SEO footprint around long-tail keywords related to the pain points identified in Section 4.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-4">8. Distribution Channels</h2>
          <div className="flex gap-4">
            <span className="bg-white border border-gray-200 px-4 py-2 rounded-lg text-sm font-medium text-gray-700">Product Hunt Launch</span>
            <span className="bg-white border border-gray-200 px-4 py-2 rounded-lg text-sm font-medium text-gray-700">LinkedIn Content</span>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-4">9. Content & Messaging</h2>
          <LockedSection title="Content Strategy" feature="Advanced Messaging Hooks" />
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-4">10. Brand Identity</h2>
          <LockedSection title="Brand Namer" feature="Automated domain and brand generation" />
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-4">11. Financial Modeling</h2>
          <LockedSection title="$10k MRR Scale Architecture" feature="Detailed financial modeling" />
        </section>

        {/* 13. Next Steps (Synthesis conclusion) */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-4">13. Actionable Next Steps</h2>
          <div className="bg-[#0C0D0E] text-white rounded-2xl p-8">
            <h3 className="text-xl font-bold mb-6">Your 7-Day Execution Plan</h3>
            <ol className="space-y-4">
              <li className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0 font-bold">1</div>
                <div>
                  <h4 className="font-semibold text-white">Buy the domain & setup landing page</h4>
                  <p className="text-sm text-gray-400 mt-1">Use Framer or Next.js. Collect emails immediately.</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0 font-bold">2</div>
                <div>
                  <h4 className="font-semibold text-white">Interview 5 potential customers</h4>
                  <p className="text-sm text-gray-400 mt-1">Validate the pricing model and exact pain points.</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0 font-bold">3</div>
                <div>
                  <h4 className="font-semibold text-white">Build the core MVP</h4>
                  <p className="text-sm text-gray-400 mt-1">Focus strictly on Phase 1 of the roadmap.</p>
                </div>
              </li>
            </ol>
          </div>
        </section>

      </div>
    </div>
  )
}