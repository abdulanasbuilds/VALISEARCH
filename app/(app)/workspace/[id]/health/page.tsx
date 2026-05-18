import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  HeartPulse, 
  TrendingUp, 
  Gauge, 
  HelpCircle,
  AlertTriangle,
  Zap,
  Activity
} from "lucide-react"

interface Props {
  params: Promise<{ id: string }>
}

export default async function StartupHealthPage({ params }: Props) {
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
  const score = result?.synthesis?.overall_score ?? analysis.overall_score ?? 80

  const parameters = [
    { name: "Product Readiness", score: 65, status: "Alpha Phase", desc: "Core parallel engine models are defined. User visual flows are drafted." },
    { name: "Market Timing", score: 85, status: "Highly Favorable", desc: "Accelerating spend on business validation and multi-agent SaaS orchestrators." },
    { name: "Execution Velocity", score: 75, status: "Active Sprint", desc: "Kanban tasks board initialized with direct database persistence." },
    { name: "Funding Readiness", score: 60, status: "Bootstrap Advised", desc: "Pre-seed readiness requires gathering active customer signups first." }
  ]

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/40 pb-6">
        <div>
          <Badge variant="outline" className="border-primary/20 bg-primary/5 text-primary text-[10px] font-mono tracking-wider uppercase mb-1">
            Startup Health & Risk Metrics
          </Badge>
          <h1 className="text-3xl font-bold tracking-tight">Health Analytics</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Track product readiness, market viability timings, funding indices, and execution metrics.
          </p>
        </div>
      </div>

      {/* Health Gauge Score Breakdown */}
      <div className="grid lg:grid-cols-12 gap-8">
        
        {/* Left Column: Health Parameters (8 Columns) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="surface-card border border-border/50 rounded-2xl p-6 shadow-sm">
            <h3 className="text-sm font-bold text-foreground mb-6 flex items-center gap-2 border-b border-border/40 pb-2">
              <Activity className="h-4 w-4 text-primary" />
              SaaS Health Indicators
            </h3>
            
            <div className="space-y-6">
              {parameters.map((p) => (
                <div key={p.name} className="space-y-2 p-4 border border-border/40 bg-muted/10 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-bold text-foreground">{p.name}</span>
                      <p className="text-xs text-muted-foreground mt-0.5">{p.desc}</p>
                    </div>
                    <Badge variant="secondary" className="font-mono text-xs">
                      {p.status} ({p.score}%)
                    </Badge>
                  </div>
                  <Progress value={p.score} className="h-2" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Dynamic Gauge & Quick Tips (4 Columns) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Main Health Index Gauge */}
          <div className="surface-card border border-primary/20 bg-primary/5 rounded-2xl p-6 shadow-sm relative overflow-hidden text-center flex flex-col items-center">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-[80px] rounded-full -z-10" />
            <Gauge className="h-10 w-10 text-primary mb-4" />
            
            <span className="text-[10px] font-mono text-primary font-bold uppercase tracking-widest leading-none mb-2">
              Composite Viability Score
            </span>
            <div className="text-5xl font-black tracking-tighter text-foreground mb-4">
              {score}%
            </div>
            
            <p className="text-xs text-muted-foreground leading-relaxed">
              Your overall startup health is in excellent shape. Ensure execution velocity parameters do not stall. We advise wrapping MVP definitions to launch testing channels.
            </p>
          </div>

          {/* Core Optimization Tips Card */}
          <div className="surface-card border border-border/50 rounded-2xl p-5 shadow-sm space-y-4">
            <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5 border-b border-border/40 pb-2">
              <Zap className="h-4 w-4 text-primary" />
              SaaS Actionable Tips
            </h4>
            
            <div className="space-y-3">
              <div className="flex items-start gap-2.5 text-xs text-muted-foreground leading-relaxed">
                <span className="text-primary font-bold">•</span>
                <span>Prioritize drafting user flows before allocating server budgets.</span>
              </div>
              <div className="flex items-start gap-2.5 text-xs text-muted-foreground leading-relaxed">
                <span className="text-primary font-bold">•</span>
                <span>Focus heavily on competitor pricing matrices to isolate gaps.</span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  )
}
