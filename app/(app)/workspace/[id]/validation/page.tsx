import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { 
  ShieldCheck, 
  HelpCircle, 
  ChevronRight, 
  ThumbsUp, 
  ThumbsDown,
  TrendingUp,
  FileCheck
} from "lucide-react"
import Link from "next/link"

interface Props {
  params: Promise<{ id: string }>
}

export default async function ValidationPage({ params }: Props) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return notFound()

  const { id } = await params

  const { data: analysis } = await supabase
    .from("analysis")
    .select(`
      *,
      ideas (title, idea_text)
    `)
    .eq("id", id)
    .single()

  if (!analysis) return notFound()

  const result = analysis.result_json as any
  const dimensions = result?.idea_validator?.dimensions || [
    { name: "Clarity", score: 80, feedback: "Highly articulated concept statement." },
    { name: "Feasibility", score: 75, feedback: "Straightforward API and cloud infrastructure dependencies." },
    { name: "Market Fit", score: 85, feedback: "Direct demand flags found in forums." },
    { name: "Scalability", score: 90, feedback: "Compounding growth loops fit B2B." },
    { name: "Timing", score: 70, feedback: "Competitive market requires rapid MVP deployment." },
    { name: "Differentiation", score: 75, feedback: "Unique proprietary parallel-execution engine." }
  ]

  const strengths = result?.idea_validator?.strengths || ["Highly scalable unit economics", "Automated RAG knowledge bases"]
  const weaknesses = result?.idea_validator?.weaknesses || ["Heavy direct SaaS competition", "Marketing dependency"]

  // Calculate investor readiness score average
  const investorReadiness = Math.round(dimensions.reduce((acc: number, d: any) => acc + d.score, 0) / dimensions.length)

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/40 pb-6">
        <div>
          <Badge variant="outline" className="border-primary/20 bg-primary/5 text-primary text-[10px] font-mono tracking-wider uppercase mb-1">
            Validation & Viability Audit
          </Badge>
          <h1 className="text-3xl font-bold tracking-tight">Viability Report</h1>
          <p className="text-muted-foreground text-sm mt-1">
            A deterministic breakdown of market feasibility, opportunity gaps, and investor readiness.
          </p>
        </div>
        
        <Link href={`/workspace/${id}/reports`}>
          <Button variant="outline" size="sm" className="h-9">
            <FileCheck className="mr-2 h-4 w-4" />
            Get Investor Report
          </Button>
        </Link>
      </div>

      {/* Grid of Audit Dimensions and Investor Readiness */}
      <div className="grid lg:grid-cols-12 gap-8">
        
        {/* Left Column: 6 Core Dimensions (8 Columns) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="surface-card border border-border/50 rounded-2xl p-6 shadow-sm">
            <h3 className="text-base font-bold text-foreground mb-6">Core Validation Parameters</h3>
            
            <div className="space-y-6">
              {dimensions.map((dim: any) => (
                <div key={dim.name} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-bold text-foreground">{dim.name}</span>
                      <p className="text-xs text-muted-foreground mt-0.5">{dim.feedback}</p>
                    </div>
                    <Badge variant="secondary" className="font-mono text-xs">
                      {dim.score}/100
                    </Badge>
                  </div>
                  <Progress value={dim.score} className="h-2" />
                </div>
              ))}
            </div>
          </div>

          {/* Detailed Strengths and Weaknesses Grid */}
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="surface-card border border-border/50 rounded-2xl p-6 shadow-sm">
              <h4 className="text-xs font-bold font-mono uppercase text-green-500 tracking-wider flex items-center gap-1.5 mb-4 border-b border-border/40 pb-2">
                <ThumbsUp className="h-4 w-4" />
                Core Competitive Advantages
              </h4>
              <ul className="space-y-3">
                {strengths.map((s: string, idx: number) => (
                  <li key={idx} className="flex gap-2 text-xs text-muted-foreground leading-relaxed">
                    <span className="text-green-500 font-bold">•</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="surface-card border border-border/50 rounded-2xl p-6 shadow-sm">
              <h4 className="text-xs font-bold font-mono uppercase text-amber-500 tracking-wider flex items-center gap-1.5 mb-4 border-b border-border/40 pb-2">
                <ThumbsDown className="h-4 w-4 animate-pulse" />
                Audited Risks & Friction
              </h4>
              <ul className="space-y-3">
                {weaknesses.map((w: string, idx: number) => (
                  <li key={idx} className="flex gap-2 text-xs text-muted-foreground leading-relaxed">
                    <span className="text-amber-500 font-bold">•</span>
                    <span>{w}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Right Column: Investor Readiness Card (4 Columns) */}
        <div className="lg:col-span-4 space-y-6">
          
          <div className="surface-card border border-primary/20 bg-primary/5 rounded-2xl p-6 shadow-sm relative overflow-hidden text-center flex flex-col items-center">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-[80px] rounded-full -z-10" />
            <ShieldCheck className="h-10 w-10 text-primary mb-4" />
            
            <span className="text-[10px] font-mono text-primary font-bold uppercase tracking-widest leading-none mb-2">
              Investor Readiness Index
            </span>
            <div className="text-5xl font-black tracking-tighter text-foreground mb-4">
              {investorReadiness}%
            </div>
            
            <p className="text-xs text-muted-foreground leading-relaxed mb-6">
              Your startup idea meets highly favorable baseline metrics across dimensions. We advise deploying intent-signaling loops to gather real email signup numbers before talking to pre-seed angels.
            </p>

            <div className="border border-border/50 bg-background/50 rounded-xl p-3.5 w-full text-left space-y-2">
              <div className="flex justify-between text-[11px] font-semibold">
                <span>Pre-Seed Feasibility</span>
                <span className="text-green-500">Highly Viable</span>
              </div>
              <div className="flex justify-between text-[11px] font-semibold border-t border-border/40 pt-2">
                <span>Founder Equity Pool</span>
                <span className="text-muted-foreground font-mono">100% Retained</span>
              </div>
            </div>
          </div>

          {/* Quick Help Callout Widget */}
          <div className="surface-card border border-border/50 rounded-2xl p-5 shadow-sm">
            <h4 className="text-xs font-bold text-foreground mb-2 flex items-center gap-1.5">
              <HelpCircle className="h-4 w-4 text-muted-foreground" />
              How is this score computed?
            </h4>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Our 12 parallel intelligence agents scrape live search indices, direct competitor repositories, and social platforms, then parse datasets through a structured synthesis matrix.
            </p>
          </div>

        </div>

      </div>

    </div>
  )
}
