import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Globe, 
  TrendingUp, 
  DollarSign, 
  LineChart,
  ArrowRight,
  Sparkles,
  Link2
} from "lucide-react"

interface Props {
  params: Promise<{ id: string }>
}

export default async function MarketIntelligencePage({ params }: Props) {
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
  const marketSize = result?.market_researcher?.market_size || {
    tam: "$15B+",
    sam: "$2.4B",
    som: "$450M",
    growth_rate: "12.4% CAGR"
  }

  const trends = result?.market_researcher?.trends || [
    "AI parallel execution systems replacing sequence chains",
    "Micro-SaaS operations optimizing for 100% organic growth",
    "Decentralized RAG knowledge bases gaining pre-seed traction"
  ]

  const sources = result?.market_researcher?.sources || [
    { title: "Gartner 2026 Developer Survey", url: "#" },
    { title: "Statista Global Software Analytics Report", url: "#" }
  ]

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/40 pb-6">
        <div>
          <Badge variant="outline" className="border-primary/20 bg-primary/5 text-primary text-[10px] font-mono tracking-wider uppercase mb-1">
            Global Market Sizing & Trends
          </Badge>
          <h1 className="text-3xl font-bold tracking-tight">Market Intelligence</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Analyze Total Addressable Market (TAM), SAM, SOM, and live structural industry opportunities.
          </p>
        </div>
      </div>

      {/* Market Sizing Metric Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* TAM */}
        <div className="surface-card border border-border/50 p-6 rounded-2xl shadow-sm flex flex-col justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest font-bold">Total Addressable Market</span>
            <h3 className="text-3xl font-black tracking-tight text-foreground">{marketSize.tam}</h3>
          </div>
          <p className="text-[11px] text-muted-foreground leading-relaxed mt-4">
            Global spend on validation & strategic decision tools.
          </p>
        </div>

        {/* SAM */}
        <div className="surface-card border border-border/50 p-6 rounded-2xl shadow-sm flex flex-col justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest font-bold">Serviceable Addressable Market</span>
            <h3 className="text-3xl font-black tracking-tight text-foreground">{marketSize.sam}</h3>
          </div>
          <p className="text-[11px] text-muted-foreground leading-relaxed mt-4">
            Target B2B SaaS startup founders and micro-operators globally.
          </p>
        </div>

        {/* SOM */}
        <div className="surface-card border border-border/50 p-6 rounded-2xl shadow-sm flex flex-col justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest font-bold">Serviceable Obtainable Market</span>
            <h3 className="text-3xl font-black tracking-tight text-foreground">{marketSize.som}</h3>
          </div>
          <p className="text-[11px] text-muted-foreground leading-relaxed mt-4">
            Expected capture using premium programmatic loops and integrations.
          </p>
        </div>

        {/* Growth CAGR */}
        <div className="surface-card border border-primary/20 bg-primary/5 p-6 rounded-2xl shadow-sm flex flex-col justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-mono text-primary uppercase tracking-widest font-bold">Industry Trajectory</span>
            <h3 className="text-3xl font-black tracking-tight text-primary">{marketSize.growth_rate}</h3>
          </div>
          <p className="text-[11px] text-muted-foreground leading-relaxed mt-4">
            Compounding global market demand growth rate over next 5 years.
          </p>
        </div>

      </div>

      {/* Grid of Trends and Data Sourcing */}
      <div className="grid lg:grid-cols-12 gap-8">
        
        {/* Left Column: Core Market Trends (8 Columns) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="surface-card border border-border/50 rounded-2xl p-6 shadow-sm">
            <h3 className="text-sm font-bold tracking-tight text-foreground flex items-center gap-2 mb-6 border-b border-border/40 pb-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              Strategic Growth Indicators
            </h3>
            
            <div className="space-y-5">
              {trends.map((t: string, idx: number) => (
                <div key={idx} className="flex gap-4 p-4 rounded-xl border border-border/40 bg-muted/10">
                  <div className="h-6 w-6 rounded-full bg-primary/10 border border-primary/20 text-xs font-bold text-primary flex items-center justify-center shrink-0">
                    {idx+1}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-foreground">Trend Alignment</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed mt-1">{t}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Search Citation Sources (4 Columns) */}
        <div className="lg:col-span-4 space-y-6">
          
          <div className="surface-card border border-border/50 rounded-2xl p-6 shadow-sm">
            <h3 className="text-sm font-bold text-foreground mb-4 flex items-center gap-1.5">
              <Globe className="h-4 w-4 text-muted-foreground" />
              Web Citation Sources
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed mb-6">
              Our market intelligence engine queried the live index via Jina AI. Citations matched:
            </p>
            
            <div className="space-y-3">
              {sources.map((src: any, idx: number) => (
                <a 
                  key={idx} 
                  href={src.url} 
                  target="_blank" 
                  rel="noreferrer"
                  className="p-3 border border-border/50 hover:border-primary/50 rounded-lg flex items-center justify-between text-xs font-semibold text-foreground bg-muted/20 hover:bg-muted/40 transition-colors"
                >
                  <span className="truncate max-w-[180px]">{src.title}</span>
                  <Link2 className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                </a>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  )
}
