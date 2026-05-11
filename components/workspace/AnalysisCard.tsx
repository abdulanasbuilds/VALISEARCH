"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatRelativeTime, truncate } from "@/lib/utils"
import { Clock } from "lucide-react"

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
  const statusColors: Record<string, string> = {
    pending: "bg-yellow-500",
    running: "bg-blue-500",
    completed: "bg-green-500",
    failed: "bg-red-500",
  }

  return (
    <Card className="transition-all hover:shadow-md hover:border-primary/50">
      <CardContent className="p-4">
        <div className="mb-2 flex items-start justify-between">
          <h3 className="font-semibold line-clamp-1">{title || "Untitled"}</h3>
          <Badge
            variant="secondary"
            className={`${statusColors[status] || "bg-gray-500"} text-white`}
          >
            {status}
          </Badge>
        </div>

        <p className="mb-3 text-sm text-muted-foreground line-clamp-2">
          {truncate(ideaText, 100)}
        </p>

        <div className="flex items-center justify-between text-sm">
          {score !== null ? (
            <span
              className={`font-bold ${
                score >= 70 ? "text-green-600" : score >= 40 ? "text-amber-600" : "text-red-600"
              }`}
            >
              {score}/100
            </span>
          ) : (
            <span className="text-muted-foreground">Processing...</span>
          )}
          <span className="flex items-center gap-1 text-muted-foreground">
            <Clock className="h-3 w-3" />
            {formatRelativeTime(createdAt)}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}