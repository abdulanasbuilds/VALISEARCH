import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  HeartPulse, 
  BrainCircuit, 
  TrendingUp, 
  Milestone, 
  CheckSquare, 
  AlertTriangle, 
  ArrowRight, 
  RefreshCw, 
  Download,
  Share2,
  BookOpen
} from "lucide-react"
import Link from "next/link"

interface Props {
  params: Promise<{ id: string }>
}

export default async function CommandCenterPage({ params }: Props) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return notFound()

  const { id } = await params

  // Get active analysis record
  const { data: analysis } = await supabase
    .from("analysis")
    .select(`
      *,
      ideas (title, idea_text)
    `)
    .eq("id", id)
    .eq("user_id", user.id)
    .single()

  if (!analysis) return notFound()

  const result = analysis.result_json as any
  const ideaTitle = analysis.ideas?.title || "My Startup Idea"
  const ideaText = analysis.ideas?.idea_text || ""

  // Extract metrics or map static fallbacks if JIT is still running
  const score = result?.synthesis?.overall_score ?? analysis.overall_score ?? 0
  const verdict = result?.synthesis?.verdict ?? "pending"
  const topStrengths = result?.synthesis?.top_3_strengths ?? ["Market need exists", "Scalable infrastructure"]
  const topRisks = result?.synthesis?.top_3_risks ?? ["Heavy direct competitors", "High customer acquisition cost"]
  const nextSteps = result?.synthesis?.immediate_next_steps ?? ["Design simple user intent mockups", "Launch 48-hour cold email sequence"]
  
  // Roadmap phases count
  const roadmapPhases = result?.product_manager?.feature_roadmap?.length ?? 3

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      
      {/* Top Welcome & Actions Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/40 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="outline" className="border-primary/20 bg-primary/5 text-primary text-[10px] font-mono tracking-wider uppercase">
              Dashboard Command Center
            </Badge>
            <span className="text-xs text-muted-foreground font-mono">ID: {id.slice(0,8)}</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">{ideaTitle}</h1>
          <p className="text-muted-foreground text-sm mt-1 line-clamp-1">
            {ideaText}
          </p>
        </div>
        
        <div className="flex gap-2 shrink-0">
          <Button variant="outline" size="sm" className="h-9">
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>
          <Link href={`/workspace/${id}/reports`}>
            <Button variant="outline" size="sm" className="h-9">
              <Download className="mr-2 h-4 w-4" />
              Reports
            </Button>
          </Link>
          <Button className="h-9 shadow-lg shadow-primary/20 bg-primary hover:bg-primary/95 text-white">
            <RefreshCw className="mr-2 h-4 w-4" />
            Audit Idea
          </Button>
        </div>
      </div>

      {/* Main Command Center Grid */}
      <div className="grid md:grid-cols-12 gap-8">
        
        {/* Left Column: Core Health, Strengths & Risks (8 Columns) */}
        <div className="md:col-span-8 space-y-8">
          
          {/* Executive Overview & Score Panel */}
          <div className="surface-card border border-border/50 rounded-2xl p-6 relative overflow-hidden shadow-sm">
            <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 blur-[60px] rounded-full -z-10" />
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div className="space-y-3">
                <span className="text-[10px] font-mono text-primary font-bold uppercase tracking-widest leading-none">AI Synthesis Verdict</span>
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-bold tracking-tight capitalize">{verdict} Validation</h2>
                  <Badge className={`rounded ${
                    verdict === "strong" ? "bg-green-500/10 text-green-500 border-green-500/20" : "bg-amber-500/10 text-amber-500 border-amber-500/20"
                  }`}>
                    {score}% Score
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed max-w-lg">
                  {result?.synthesis?.executive_summary || "The 12-agent validation engine has completed the business intelligence audit. Review actionable steps to build customer intent benchmarks."}
                </p>
              </div>

              {/* Huge Radial Visual */}
              <div className="flex flex-col items-center justify-center p-4 border border-border/60 bg-muted/20 rounded-xl shrink-0 w-full sm:w-auto text-center">
                <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mb-1">Viability</span>
                <span className="text-4xl font-black tracking-tighter text-foreground">{score}%</span>
                <Link href={`/workspace/${id}/validation`} className="mt-2 text-[10px] font-bold text-primary flex items-center gap-0.5 hover:underline">
                  Full Analysis
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          </div>

          {/* Strengths and Risks Lists */}
          <div className="grid sm:grid-cols-2 gap-6">
            
            {/* Top Strengths */}
            <Card className="border border-border/40 shadow-sm rounded-xl">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-bold tracking-tight text-foreground flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-500" />
                  Key Strengths
                </CardTitle>
                <CardDescription className="text-xs">Dynamic strategic advantages.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {topStrengths.map((str: string, i: number) => (
                  <div key={i} className="flex gap-2.5 items-start text-xs text-muted-foreground leading-relaxed">
                    <span className="font-mono text-primary font-bold">+{i+1}</span>
                    <span>{str}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Risk Factors */}
            <Card className="border border-border/40 shadow-sm rounded-xl">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-bold tracking-tight text-foreground flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-500" />
                  Risk Factors
                </CardTitle>
                <CardDescription className="text-xs">Immediate viability friction points.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {topRisks.map((risk: string, i: number) => (
                  <div key={i} className="flex gap-2.5 items-start text-xs text-muted-foreground leading-relaxed">
                    <span className="font-mono text-amber-500 font-bold">-{i+1}</span>
                    <span>{risk}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

          </div>

          {/* Actionable Next Steps (Connected directly to Kanban) */}
          <div className="surface-card border border-border/50 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4 border-b border-border/40 pb-3">
              <h3 className="text-sm font-bold tracking-tight text-foreground flex items-center gap-2">
                <CheckSquare className="h-4 w-4 text-primary" />
                Actionable Tasks
              </h3>
              <Link href={`/workspace/${id}/kanban`} className="text-xs text-primary font-bold hover:underline flex items-center gap-0.5">
                Go to Kanban
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
            
            <div className="space-y-3.5">
              {nextSteps.map((step: string, i: number) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-lg border border-border/40 bg-muted/10">
                  <div className="h-5 w-5 rounded border border-border flex items-center justify-center shrink-0 mt-0.5 font-mono text-[9px] font-bold text-muted-foreground bg-background">
                    {i+1}
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-foreground leading-relaxed">{step}</p>
                    <span className="text-[10px] text-muted-foreground font-mono uppercase tracking-wider mt-1 block">Priority: High</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Execution Tracking, Alerts & Quick Launch (4 Columns) */}
        <div className="md:col-span-4 space-y-8">
          
          {/* Startup Health Score */}
          <div className="surface-card border border-border/50 rounded-2xl p-6 shadow-sm">
            <h3 className="text-sm font-bold tracking-tight text-foreground flex items-center gap-2 mb-4">
              <HeartPulse className="h-4 w-4 text-red-500 animate-pulse" />
              Startup Health Index
            </h3>
            
            <div className="space-y-4">
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span>Product Feasibility</span>
                  <span>{result?.idea_validator?.dimensions?.find((d: any) => d.name === "Feasibility")?.score ?? 75}%</span>
                </div>
                <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary" style={{ width: `${result?.idea_validator?.dimensions?.find((d: any) => d.name === "Feasibility")?.score ?? 75}%` }} />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span>Market Timing</span>
                  <span>{result?.idea_validator?.dimensions?.find((d: any) => d.name === "Timing")?.score ?? 80}%</span>
                </div>
                <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary" style={{ width: `${result?.idea_validator?.dimensions?.find((d: any) => d.name === "Timing")?.score ?? 80}%` }} />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span>Differentiation Gap</span>
                  <span>{result?.idea_validator?.dimensions?.find((d: any) => d.name === "Differentiation")?.score ?? 70}%</span>
                </div>
                <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary" style={{ width: `${result?.idea_validator?.dimensions?.find((d: any) => d.name === "Differentiation")?.score ?? 70}%` }} />
                </div>
              </div>
            </div>

            <Link href={`/workspace/${id}/health`}>
              <Button size="sm" variant="ghost" className="w-full mt-5 border border-border/65 text-xs font-semibold">
                Explore Health Analytics
              </Button>
            </Link>
          </div>

          {/* Product MVP Launch Roadmap Tracker */}
          <div className="surface-card border border-border/50 rounded-2xl p-6 shadow-sm">
            <h3 className="text-sm font-bold tracking-tight text-foreground flex items-center gap-2 mb-4">
              <Milestone className="h-4 w-4 text-primary" />
              Launch Roadmap
            </h3>
            
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="h-5 w-5 rounded-full bg-primary/10 border border-primary/20 text-[9px] font-bold text-primary flex items-center justify-center shrink-0 mt-0.5">P1</div>
                <div>
                  <h4 className="text-xs font-semibold text-foreground">MVP Core Definition</h4>
                  <p className="text-[10px] text-muted-foreground leading-relaxed mt-0.5">Build only {roadmapPhases} primary modules.</p>
                </div>
              </div>

              <div className="flex gap-3 opacity-60">
                <div className="h-5 w-5 rounded-full bg-muted border border-border text-[9px] font-bold text-muted-foreground flex items-center justify-center shrink-0 mt-0.5">P2</div>
                <div>
                  <h4 className="text-xs font-semibold text-foreground">Validation Benchmarks</h4>
                  <p className="text-[10px] text-muted-foreground leading-relaxed mt-0.5">Acquire 100 organic subscriber signups.</p>
                </div>
              </div>
            </div>

            <Link href={`/workspace/${id}/roadmap`}>
              <Button size="sm" variant="ghost" className="w-full mt-5 border border-border/65 text-xs font-semibold">
                View Feature Roadmap
              </Button>
            </Link>
          </div>

          {/* Interactive AI Co-founder Recommendation snippet */}
          <div className="surface-card border border-primary/20 bg-primary/5 rounded-2xl p-5 relative overflow-hidden shadow-sm">
            <h4 className="text-xs font-bold text-primary uppercase tracking-widest font-mono flex items-center gap-1.5 mb-2">
              <BrainCircuit className="h-4 w-4" />
              AI Co-founder Alert
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed mb-4">
              "Based on competitor benchmarks, your target buyers seek zero-friction trials. Let's design a user flow model mapping an automatic 5-day trial access loop."
            </p>
            <Link href={`/workspace/${id}/chat`}>
              <span className="text-[10px] font-bold text-primary hover:underline flex items-center gap-0.5 cursor-pointer">
                Chat with Co-founder
                <ArrowRight className="h-3 w-3" />
              </span>
            </Link>
          </div>

        </div>

      </div>

    </div>
  )
}
