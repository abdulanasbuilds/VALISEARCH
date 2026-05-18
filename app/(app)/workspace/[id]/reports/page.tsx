"use client"

import { use, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { 
  FileText, 
  Download, 
  ArrowRight, 
  Sparkles,
  CheckCircle2,
  Share2,
  FileSpreadsheet
} from "lucide-react"

interface Props {
  params: Promise<{ id: string }>
}

export default function ReportsPage({ params }: Props) {
  const { id } = use(params)
  
  // Download simulation state
  const [downloading, setDownloading] = useState<string | null>(null)

  const triggerDownload = (type: string) => {
    setDownloading(type)
    setTimeout(() => {
      setDownloading(null)
      // Simulate direct browser download trigger by creating an alert or similar
      alert(`ValiSearch Report successfully compiled and downloaded as ${type.toUpperCase()}!`)
    }, 1500)
  }

  const reports = [
    {
      title: "Comprehensive Business Viability Report",
      desc: "All-in-one strategic analysis mapping core feasibility parameters, timing trends, and target customer profiles.",
      type: "pdf"
    },
    {
      title: "Competitor Audit & Opportunity Matrix",
      desc: "Detailed competitive mapping outlining direct rivals positioning, weaknesses, and pricing structures.",
      type: "markdown"
    },
    {
      title: "MVP Feature Scope & Execution Plan",
      desc: "Detailed product roadmap milestones timeline and task allocation parameters structured as clean datasets.",
      type: "json"
    }
  ]

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/40 pb-6">
        <div>
          <Badge variant="outline" className="border-primary/20 bg-primary/5 text-primary text-[10px] font-mono tracking-wider uppercase mb-1">
            Strategic Reports & Exports Hub
          </Badge>
          <h1 className="text-3xl font-bold tracking-tight">Strategic Reports</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Export comprehensive analysis dashboards into formatted investor materials and execution guides.
          </p>
        </div>
      </div>

      {/* Reports Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        {reports.map((report) => (
          <div 
            key={report.title}
            className="surface-card border border-border/50 p-6 rounded-2xl shadow-sm flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div className="h-9 w-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <Badge variant="secondary" className="font-mono text-[9px] uppercase tracking-wider">
                  Format: {report.type}
                </Badge>
              </div>

              <div>
                <h3 className="text-sm font-bold text-foreground leading-snug">{report.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed mt-2">{report.desc}</p>
              </div>
            </div>

            <Button 
              size="sm"
              disabled={downloading !== null}
              onClick={() => triggerDownload(report.type)}
              className="w-full mt-6 font-semibold flex items-center justify-center gap-2 h-10 bg-primary hover:bg-primary/95 text-white"
            >
              {downloading === report.type ? (
                <>
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin shrink-0" />
                  Generating...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4" />
                  Compile & Export
                </>
              )}
            </Button>
          </div>
        ))}
      </div>

      {/* High-Converting Investor Ready Callout */}
      <div className="surface-card border border-primary/20 bg-primary/5 rounded-2xl p-6 md:p-8 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[90px] rounded-full -z-10" />
        
        <div className="max-w-2xl text-left space-y-4">
          <Badge variant="outline" className="border-primary/20 bg-primary/10 text-primary text-[10px] font-mono tracking-wider uppercase">
             Strategic Advantage
          </Badge>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Preparing for a Pre-Seed Fundraise?
          </h2>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Our strategic reports are structured around standard venture capital audit guidelines. Share direct links to live visual journey canvases or export dynamic roadmap milestones to build early investment confidence.
          </p>

          <Button size="sm" className="h-9 font-semibold flex items-center gap-1.5" onClick={() => alert("Strategic Investor Pitchdeck Template copied to clipboard!")}>
            <Share2 className="h-4 w-4" />
            Share Pitchdeck Canvas
          </Button>
        </div>
      </div>

    </div>
  )
}
