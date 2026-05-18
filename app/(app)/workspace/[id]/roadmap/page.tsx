import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Milestone, 
  Sparkles, 
  TrendingUp, 
  Cpu, 
  ListTodo,
  Calendar,
  Layers
} from "lucide-react"

interface Props {
  params: Promise<{ id: string }>
}

export default async function ProductRoadmapPage({ params }: Props) {
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
  
  const mvpFeatures = result?.product_manager?.mvp_features || [
    "12-parallel agent validation pipeline orchestrator",
    "Supabase postgres database with robust RLS policies",
    "Interactive Kanban tasks board"
  ]

  const featureRoadmap = result?.product_manager?.feature_roadmap || [
    { phase: "Phase 1: Core", title: "Parallel Engine Integration", description: "Standardize triggers and local agent execution loops." },
    { phase: "Phase 2: Growth", title: "Visual Journey Canvases", description: "Design interactive visual flow systems for Monetization Loops." },
    { phase: "Phase 3: Scale", title: "Investor-ready Reports", description: "Automate PDF export templates and team permission shares." }
  ]

  const techStack = result?.product_manager?.tech_stack || "Next.js 16, Supabase, Tailwind v4, Trigger.dev"

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/40 pb-6">
        <div>
          <Badge variant="outline" className="border-primary/20 bg-primary/5 text-primary text-[10px] font-mono tracking-wider uppercase mb-1">
            MVP Phases & Execution Milestones
          </Badge>
          <h1 className="text-3xl font-bold tracking-tight">Product Roadmap</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Track execution dependencies, feature prioritizations, and your startup roadmap.
          </p>
        </div>
      </div>

      {/* Main Roadmap & Stack Layout */}
      <div className="grid lg:grid-cols-12 gap-8">
        
        {/* Left Column: Phases Timeline (8 Columns) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="surface-card border border-border/50 rounded-2xl p-6 shadow-sm">
            <h3 className="text-sm font-bold text-foreground mb-6 flex items-center gap-2 border-b border-border/40 pb-2">
              <Layers className="h-4 w-4 text-primary" />
              MVP Execution Plan
            </h3>
            
            <div className="space-y-8 relative pl-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-border/60">
              {featureRoadmap.map((item: any, idx: number) => (
                <div key={idx} className="relative group">
                  {/* Visual Node Pin */}
                  <div className="absolute -left-[22px] top-1 h-3.5 w-3.5 rounded-full border-2 border-primary bg-background group-hover:bg-primary transition-colors shrink-0" />
                  
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-mono text-primary font-bold uppercase tracking-wider">{item.phase}</span>
                      <Badge variant="secondary" className="text-[9px] font-mono leading-none">Status: Pending</Badge>
                    </div>
                    <h4 className="text-sm font-bold text-foreground">{item.title}</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed mt-1">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: MVP Core Features & Tech Stack (4 Columns) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* MVP Core Features List */}
          <div className="surface-card border border-border/50 rounded-2xl p-6 shadow-sm">
            <h3 className="text-sm font-bold text-foreground mb-4 flex items-center gap-1.5">
              <ListTodo className="h-4 w-4 text-muted-foreground" />
              MVP Scope
            </h3>
            
            <ul className="space-y-3">
              {mvpFeatures.map((feat: string, idx: number) => (
                <li key={idx} className="text-xs text-muted-foreground flex gap-2.5 items-start leading-relaxed">
                  <div className="h-4 w-4 rounded-full bg-primary/10 border border-primary/20 text-[9px] font-bold text-primary flex items-center justify-center shrink-0 mt-0.5">{idx+1}</div>
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* AI Tech Stack Abstraction Card */}
          <div className="surface-card border border-primary/20 bg-primary/5 rounded-2xl p-5 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-3xl -z-10 rounded-full" />
            <span className="text-[10px] font-mono text-primary font-bold uppercase tracking-widest leading-none mb-2 block flex items-center gap-1">
              <Cpu className="h-4 w-4" />
              Audited Technology Stack
            </span>
            <p className="text-xs text-muted-foreground leading-relaxed mb-4">
              "We recommend adopting an edge-native framework to ensure absolute loading speeds."
            </p>
            <div className="border border-border/40 bg-background/50 rounded-xl p-3 text-[10px] font-mono font-bold text-foreground">
              {techStack}
            </div>
          </div>

        </div>

      </div>

    </div>
  )
}
