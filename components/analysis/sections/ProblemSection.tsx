import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"

interface ProblemSectionProps {
  problemStatement: string
  painPoints: string[]
  severity: "high" | "medium" | "low"
  targetAudience: string
}

export function ProblemSection({
  problemStatement,
  painPoints,
  severity,
  targetAudience,
}: ProblemSectionProps) {
  const severityColors = {
    high: "bg-red-500",
    medium: "bg-amber-500",
    low: "bg-green-500",
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Problem & Pain Points</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex items-center gap-2">
          <span
            className={`h-2 w-2 rounded-full ${severityColors[severity]}`}
          />
          <span className="text-sm font-medium capitalize">{severity} Severity</span>
        </div>

        <div className="mb-6 rounded-lg bg-muted/50 p-4">
          <p className="text-sm">{problemStatement}</p>
        </div>

        {targetAudience && (
          <div className="mb-6">
            <p className="mb-2 text-xs text-muted-foreground">Target Audience</p>
            <p className="text-sm">{targetAudience}</p>
          </div>
        )}

        {painPoints.length > 0 && (
          <div>
            <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold">
              <AlertCircle className="h-4 w-4" />
              Pain Points Identified
            </h4>
            <ul className="space-y-2">
              {painPoints.map((point, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-red-400" />
                  {point}
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  )
}