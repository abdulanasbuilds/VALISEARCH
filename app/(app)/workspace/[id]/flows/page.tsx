"use client"

import { use, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  GitFork, 
  ZoomIn, 
  ZoomOut, 
  Download,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  ArrowUpRight
} from "lucide-react"

interface Props {
  params: Promise<{ id: string }>
}

export default function VisualFlowsPage({ params }: Props) {
  const { id } = use(params)
  
  // Interactive Controls state
  const [zoom, setZoom] = useState(100)
  const [activeTab, setActiveTab] = useState<"journey" | "monetization">("journey")
  const [copied, setCopied] = useState(false)

  const handleZoom = (type: "in" | "out") => {
    if (type === "in") setZoom(prev => Math.min(prev + 10, 150))
    else setZoom(prev => Math.max(prev - 10, 70))
  }

  const exportDiagram = () => {
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/40 pb-6">
        <div>
          <Badge variant="outline" className="border-primary/20 bg-primary/5 text-primary text-[10px] font-mono tracking-wider uppercase mb-1">
            Visual Journeys & Business Loops
          </Badge>
          <h1 className="text-3xl font-bold tracking-tight">Visual Flows</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Map out user conversion flows, programmatic growth loops, and monetization triggers.
          </p>
        </div>

        {/* Tab Filters */}
        <div className="flex items-center gap-1.5 bg-muted/20 border border-border/40 p-1 rounded-xl shrink-0">
          <Button 
            size="sm" 
            variant={activeTab === "journey" ? "default" : "ghost"}
            onClick={() => setActiveTab("journey")}
            className="text-xs h-8 font-semibold rounded-lg"
          >
            User Journey Map
          </Button>
          <Button 
            size="sm" 
            variant={activeTab === "monetization" ? "default" : "ghost"}
            onClick={() => setActiveTab("monetization")}
            className="text-xs h-8 font-semibold rounded-lg"
          >
            Monetization Loop
          </Button>
        </div>
      </div>

      {/* Interactive Visual Canvas Container */}
      <div className="surface-card border border-border/50 rounded-2xl overflow-hidden shadow-inner relative flex flex-col min-h-[500px]">
        
        {/* Canvas Toolbar Controls */}
        <div className="border-b border-border/40 bg-muted/5 px-4 py-3 flex justify-between items-center z-10">
          <div className="flex items-center gap-2">
            <Button size="icon" variant="ghost" className="h-8 w-8 border border-border" onClick={() => handleZoom("out")}>
              <ZoomOut className="h-4 w-4" />
            </Button>
            <span className="text-[10px] font-mono text-muted-foreground w-12 text-center">{zoom}%</span>
            <Button size="icon" variant="ghost" className="h-8 w-8 border border-border" onClick={() => handleZoom("in")}>
              <ZoomIn className="h-4 w-4" />
            </Button>
          </div>

          <Button size="sm" variant="ghost" className="h-8 border border-border text-xs font-semibold flex items-center gap-1.5" onClick={exportDiagram}>
            <Download className="h-4 w-4" />
            {copied ? "JSON Schema Copied!" : "Export Flow"}
          </Button>
        </div>

        {/* Rendering Screen Canvas */}
        <div className="flex-1 flex items-center justify-center p-8 bg-slate-950/20 overflow-auto relative">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808005_1px,transparent_1px),linear-gradient(to_bottom,#80808005_1px,transparent_1px)] bg-[size:20px_20px]" />
          
          <div 
            style={{ transform: `scale(${zoom / 100})` }}
            className="transition-transform duration-200 origin-center flex flex-col md:flex-row items-center gap-8 relative z-10 w-full max-w-4xl"
          >
            {activeTab === "journey" ? (
              <>
                {/* User Journey Flow */}
                <div className="flex-1 p-5 rounded-2xl border border-border bg-background shadow-md flex flex-col justify-between min-h-[140px] text-center items-center">
                  <span className="text-[9px] font-mono uppercase text-muted-foreground">Step 01</span>
                  <h4 className="text-xs font-bold text-foreground mt-2">Organic Search / Ad</h4>
                  <p className="text-[10px] text-muted-foreground mt-1">Reader lands on premium SaaS validation blog page.</p>
                  <ArrowRight className="h-4 w-4 text-primary mt-4 md:hidden" />
                </div>

                <div className="hidden md:flex flex-col items-center">
                  <ArrowRight className="h-5 w-5 text-muted-foreground/60" />
                </div>

                <div className="flex-1 p-5 rounded-2xl border border-primary/30 bg-primary/5 shadow-md flex flex-col justify-between min-h-[140px] text-center items-center">
                  <span className="text-[9px] font-mono uppercase text-primary font-bold">Step 02</span>
                  <h4 className="text-xs font-bold text-foreground mt-2">Intent Signup</h4>
                  <p className="text-[10px] text-muted-foreground mt-1">Founders register to audit their startup idea in 90 seconds.</p>
                  <ArrowRight className="h-4 w-4 text-primary mt-4 md:hidden" />
                </div>

                <div className="hidden md:flex flex-col items-center">
                  <ArrowRight className="h-5 w-5 text-muted-foreground/60" />
                </div>

                <div className="flex-1 p-5 rounded-2xl border border-border bg-background shadow-md flex flex-col justify-between min-h-[140px] text-center items-center">
                  <span className="text-[9px] font-mono uppercase text-muted-foreground">Step 03</span>
                  <h4 className="text-xs font-bold text-foreground mt-2">Executive Audit</h4>
                  <p className="text-[10px] text-muted-foreground mt-1">12 parallel agents analyze competitors, sizing, and stack parameters.</p>
                </div>
              </>
            ) : (
              <>
                {/* Monetization Loops Flow */}
                <div className="flex-1 p-5 rounded-2xl border border-border bg-background shadow-md flex flex-col justify-between min-h-[140px] text-center items-center">
                  <span className="text-[9px] font-mono uppercase text-muted-foreground">Flow 01</span>
                  <h4 className="text-xs font-bold text-foreground mt-2">5-Day Free Trial</h4>
                  <p className="text-[10px] text-muted-foreground mt-1">Zero-friction account creation with 10 free platform credits.</p>
                  <ArrowRight className="h-4 w-4 text-primary mt-4 md:hidden" />
                </div>

                <div className="hidden md:flex flex-col items-center">
                  <ArrowUpRight className="h-5 w-5 text-muted-foreground/60" />
                </div>

                <div className="flex-1 p-5 rounded-2xl border border-primary/30 bg-primary/5 shadow-md flex flex-col justify-between min-h-[140px] text-center items-center">
                  <span className="text-[9px] font-mono uppercase text-primary font-bold">Flow 02</span>
                  <h4 className="text-xs font-bold text-foreground mt-2">Usage Trigger Upgrades</h4>
                  <p className="text-[10px] text-muted-foreground mt-1">Founder runs out of compute allocation credits, provoking a checkout loop.</p>
                  <ArrowRight className="h-4 w-4 text-primary mt-4 md:hidden" />
                </div>

                <div className="hidden md:flex flex-col items-center">
                  <ArrowUpRight className="h-5 w-5 text-muted-foreground/60" />
                </div>

                <div className="flex-1 p-5 rounded-2xl border border-border bg-background shadow-md flex flex-col justify-between min-h-[140px] text-center items-center">
                  <span className="text-[9px] font-mono uppercase text-muted-foreground">Flow 03</span>
                  <h4 className="text-xs font-bold text-foreground mt-2">Pro/Growth Plan</h4>
                  <p className="text-[10px] text-muted-foreground mt-1">Subscribes to monthly plan ($49/mo) with full RAG knowledge access.</p>
                </div>
              </>
            )}
          </div>

        </div>

      </div>

    </div>
  )
}
