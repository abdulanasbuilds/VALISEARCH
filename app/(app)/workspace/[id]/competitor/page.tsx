"use client"

import { use, useState } from "react"
import { POSTS } from "@/lib/blog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { 
  TrendingUp, 
  ArrowRight, 
  Flame, 
  Scale, 
  HelpCircle,
  X,
  Plus,
  Compass
} from "lucide-react"

interface Props {
  params: Promise<{ id: string }>
}

interface Competitor {
  name: string
  url: string
  positioning: string
  pricing: string
  strengths: string[]
  weaknesses: string[]
}

export default function CompetitorIntelligencePage({ params }: Props) {
  const { id } = use(params)
  
  // Manage state for details modal
  const [selectedCompetitor, setSelectedCompetitor] = useState<Competitor | null>(null)

  // Standard mock database fallbacks
  const competitors: Competitor[] = [
    {
      name: "ValidatorAI",
      url: "https://validatorai.com",
      positioning: "Simple text input generating high-level AI validation summaries.",
      pricing: "$15/mo core access",
      strengths: [
        "Highly streamlined clean landing page",
        "Immediate response generation"
      ],
      weaknesses: [
        "No real-time market search index queries",
        "Lacks deep parallel Multi-Agent analytics",
        "Does not offer execution/milestones trackers"
      ]
    },
    {
      name: "IdeaBuddy",
      url: "https://ideabuddy.com",
      positioning: "Step-by-step business planning canvas with structured templates.",
      pricing: "$9 - $49/mo plans",
      strengths: [
        "Robust step planning spreadsheets",
        "Collaborative workflow interfaces"
      ],
      weaknesses: [
        "Completely manual business modeling",
        "No parallel AI research agents to query tam/sam",
        "Slow feedback loops"
      ]
    },
    {
      name: "G2/Capterra Benchmarks",
      url: "https://g2.com",
      positioning: "Manual competitor review database and rating engine.",
      pricing: "Free public access",
      strengths: [
        "High trust organic reviewer ecosystem",
        "Large comparison datasets"
      ],
      weaknesses: [
        "Requires hours of manual scrolling",
        "Does not structure user flow roadmap diagrams",
        "Lacks automated validation metrics"
      ]
    }
  ]

  const marketGaps = [
    "No competing validator supports a **12-parallel agent synthesis system**.",
    "Rivals do not offer automated **Kanban task boards** connected directly to the strategic analysis output.",
    "Lacks visual mapping canvases showing **interactive User Journeys** or growth loop diagrams."
  ]

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/40 pb-6">
        <div>
          <Badge variant="outline" className="border-primary/20 bg-primary/5 text-primary text-[10px] font-mono tracking-wider uppercase mb-1">
            Competitor Intelligence & Rival Audit
          </Badge>
          <h1 className="text-3xl font-bold tracking-tight">Competitor Intel</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Identify direct and indirect rivals, compare features, and isolate unserved market opportunity gaps.
          </p>
        </div>
      </div>

      {/* Grid of Competitor Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        {competitors.map((comp) => (
          <div 
            key={comp.name} 
            className="surface-card border border-border/50 p-6 rounded-2xl shadow-sm flex flex-col justify-between hover:border-primary/40 transition-colors group"
          >
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">{comp.name}</h3>
                  <a href={comp.url} target="_blank" rel="noreferrer" className="text-[10px] text-muted-foreground font-mono hover:underline">
                    {comp.url.replace("https://", "")}
                  </a>
                </div>
                <Badge variant="secondary" className="font-mono text-[10px]">
                  {comp.pricing}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {comp.positioning}
              </p>
            </div>

            <Button 
              size="sm" 
              variant="ghost" 
              onClick={() => setSelectedCompetitor(comp)}
              className="w-full mt-6 border border-border/60 text-xs font-semibold"
            >
              Analyze Gap Matrix
            </Button>
          </div>
        ))}
      </div>

      {/* Feature Comparison Matrix */}
      <div className="surface-card border border-border/50 rounded-2xl p-6 shadow-sm">
        <h3 className="text-sm font-bold text-foreground mb-6 flex items-center gap-2 border-b border-border/40 pb-2">
          <Scale className="h-4 w-4 text-primary" />
          Feature Comparison Grid
        </h3>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border/40 text-muted-foreground font-mono uppercase tracking-wider">
                <th className="pb-3 font-semibold">Audited Capability</th>
                <th className="pb-3 font-semibold">ValiSearch 2.0</th>
                <th className="pb-3 font-semibold">Manual planning</th>
                <th className="pb-3 font-semibold">Basic AI tools</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              <tr className="hover:bg-muted/10">
                <td className="py-3 font-semibold text-foreground">12 Parallel-agent Audit</td>
                <td className="py-3 text-primary font-bold">Yes (90 Seconds)</td>
                <td className="py-3 text-muted-foreground">No</td>
                <td className="py-3 text-muted-foreground">No (Single query)</td>
              </tr>
              <tr className="hover:bg-muted/10">
                <td className="py-3 font-semibold text-foreground">RAG Knowledge Retrieval</td>
                <td className="py-3 text-primary font-bold">Yes (pgvector)</td>
                <td className="py-3 text-muted-foreground">No</td>
                <td className="py-3 text-muted-foreground">No</td>
              </tr>
              <tr className="hover:bg-muted/10">
                <td className="py-3 font-semibold text-foreground">Kanban Task System</td>
                <td className="py-3 text-primary font-bold">Yes (Persistent)</td>
                <td className="py-3 text-muted-foreground font-semibold text-foreground">No (Requires JIRA/Trello)</td>
                <td className="py-3 text-muted-foreground">No</td>
              </tr>
              <tr className="hover:bg-muted/10">
                <td className="py-3 font-semibold text-foreground">Interactive User Flows</td>
                <td className="py-3 text-primary font-bold">Yes (Visual Canvas)</td>
                <td className="py-3 text-muted-foreground font-semibold text-foreground">No (Requires Figma/Miro)</td>
                <td className="py-3 text-muted-foreground">No</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Opportunity Gaps Checklist */}
      <div className="surface-card border border-border/50 rounded-2xl p-6 shadow-sm">
        <h3 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2">
          <Flame className="h-4 w-4 text-amber-500 animate-pulse" />
          Unserved Market Opportunities
        </h3>
        <div className="grid sm:grid-cols-3 gap-6">
          {marketGaps.map((gap, idx) => (
            <div key={idx} className="p-4 rounded-xl border border-border/40 bg-muted/10 flex gap-3 items-start">
              <div className="h-5 w-5 rounded-full bg-primary/10 border border-primary/20 text-xs font-bold text-primary flex items-center justify-center shrink-0">
                {idx+1}
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed" dangerouslySetInnerHTML={{ __html: gap }} />
            </div>
          ))}
        </div>
      </div>

      {/* Clickable Competitor Gap Modal */}
      {selectedCompetitor && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-background border border-border/60 rounded-2xl w-full max-w-xl shadow-2xl p-6 relative">
            <button 
              onClick={() => setSelectedCompetitor(null)}
              className="absolute top-4 right-4 h-8 w-8 rounded-full border border-border flex items-center justify-center hover:bg-muted"
            >
              <X className="h-4 w-4 text-muted-foreground" />
            </button>

            <div className="mb-6">
              <Badge variant="outline" className="border-primary/20 bg-primary/5 text-primary text-[9px] font-mono tracking-wider uppercase mb-1.5">
                Rival Audit Detail
              </Badge>
              <h2 className="text-2xl font-bold tracking-tight text-foreground">{selectedCompetitor.name}</h2>
              <a href={selectedCompetitor.url} target="_blank" rel="noreferrer" className="text-xs text-primary hover:underline font-mono">
                {selectedCompetitor.url}
              </a>
            </div>

            <div className="space-y-6">
              <div>
                <h4 className="text-xs font-bold text-foreground font-mono uppercase tracking-wider mb-2">Strengths We Must Match</h4>
                <ul className="space-y-2">
                  {selectedCompetitor.strengths.map((s, i) => (
                    <li key={i} className="text-xs text-muted-foreground flex gap-2 items-start leading-relaxed">
                      <div className="h-1.5 w-1.5 rounded-full bg-green-500 shrink-0 mt-1.5" />
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="border-t border-border/40 pt-4">
                <h4 className="text-xs font-bold text-foreground font-mono uppercase tracking-wider mb-2">Weaknesses We Can Exploit</h4>
                <ul className="space-y-2">
                  {selectedCompetitor.weaknesses.map((w, i) => (
                    <li key={i} className="text-xs text-muted-foreground flex gap-2 items-start leading-relaxed">
                      <div className="h-1.5 w-1.5 rounded-full bg-amber-500 shrink-0 mt-1.5 animate-pulse" />
                      <span>{w}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <Button size="sm" onClick={() => setSelectedCompetitor(null)} className="h-9">
                Close Audit
              </Button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
