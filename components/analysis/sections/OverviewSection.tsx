import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface OverviewSectionProps {
  score: number | null
  verdict: string
  ideaText: string
}

export function OverviewSection({ score, verdict, ideaText }: OverviewSectionProps) {
  const scoreColor = score
    ? score >= 70
      ? "text-green-600"
      : score >= 40
      ? "text-amber-600"
      : "text-red-600"
    : "text-muted-foreground"

  const verdictColors: Record<string, string> = {
    strong: "bg-green-500",
    promising: "bg-blue-500",
    "needs-work": "bg-amber-500",
    risky: "bg-orange-500",
    "not-recommended": "bg-red-500",
    pending: "bg-gray-500",
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 md:grid-cols-3">
          <div className="text-center">
            <div className={`text-4xl font-bold ${scoreColor}`}>
              {score ?? "--"}/100
            </div>
            <p className="text-sm text-muted-foreground">Overall Score</p>
          </div>
          <div className="text-center">
            <Badge
              className={`${verdictColors[verdict] || "bg-gray-500"} text-white`}
            >
              {verdict || "Pending"}
            </Badge>
            <p className="mt-1 text-sm text-muted-foreground">Verdict</p>
          </div>
          <div className="text-center">
            <div className="text-sm font-medium">Analysis Type</div>
            <p className="text-sm text-muted-foreground">Full (12 agents)</p>
          </div>
        </div>

        <div className="mt-6 rounded-lg bg-muted/50 p-4">
          <p className="text-sm font-medium">Your Idea</p>
          <p className="mt-1 text-sm text-muted-foreground">{ideaText}</p>
        </div>
      </CardContent>
    </Card>
  )
}
