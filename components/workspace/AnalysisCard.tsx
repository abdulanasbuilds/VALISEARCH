"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatRelativeTime, truncate } from "@/lib/utils"
import { Clock, TerminalSquare, Activity } from "lucide-react"

interface AnalysisCardProps {
  id: string
  title: string
  ideaText: string
  score: number | null
  status: string
  createdAt: string
}

export function AnalysisCard({
  id,
  title,
  ideaText,
  score,
  status,
  createdAt,
}: AnalysisCardProps) {
  const statusConfig: Record<string, { color: string, label: string, border: string }> = {
    pending: { color: "text-yellow-500", label: "PENDING", border: "border-yellow-500/20 bg-yellow-500/10" },
    running: { color: "text-blue-500", label: "EXECUTING", border: "border-blue-500/20 bg-blue-500/10" },
    completed: { color: "text-green-500", label: "COMPLETED", border: "border-green-500/20 bg-green-500/10" },
    failed: { color: "text-red-500", label: "FAILED", border: "border-red-500/20 bg-red-500/10" },
  }

  const currentStatus = statusConfig[status] || { color: "text-gray-500", label: "UNKNOWN", border: "border-gray-500/20 bg-gray-500/10" }

  return (
    <Card className="transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1 bg-background border-border/40 overflow-hidden group">
      <div className="border-b border-border/40 bg-muted/20 px-4 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
           <TerminalSquare className="h-4 w-4 text-muted-foreground" />
           <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">ID: {id.split('-')[0]}</span>
        </div>
        <div className={`px-2 py-0.5 rounded-sm text-[10px] font-mono font-bold tracking-wider border ${currentStatus.border} ${currentStatus.color}`}>
          {currentStatus.label}
        </div>
      </div>
      <CardContent className="p-5">
        <h3 className="font-semibold text-lg line-clamp-1 mb-2 group-hover:text-primary transition-colors">{title || "Untitled Execution"}</h3>
        
        <p className="mb-6 text-sm text-muted-foreground line-clamp-2 bg-muted/30 p-3 rounded-md border border-border/30 font-mono text-xs">
          {">"} {truncate(ideaText, 80)}
        </p>

        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-center gap-2">
            {score !== null ? (
              <div className="flex items-baseline gap-1">
                <span className={`text-2xl font-bold tracking-tighter ${score >= 70 ? "text-green-500" : score >= 40 ? "text-amber-500" : "text-red-500"}`}>
                  {score}
                </span>
                <span className="text-xs text-muted-foreground font-mono">/100</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-primary font-mono text-xs">
                <Activity className="h-4 w-4 animate-pulse" />
                <span>PROCESSING...</span>
              </div>
            )}
          </div>
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground font-mono">
            <Clock className="h-3 w-3" />
            {formatRelativeTime(createdAt)}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}