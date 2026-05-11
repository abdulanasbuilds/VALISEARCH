import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp } from "lucide-react"

interface GrowthStrategy {
  strategy: string
  channels: string[]
  expectedOutcome: string
  timeline: string
}

interface GrowthSectionProps {
  strategies: GrowthStrategy[]
  quickWins: string[]
}

export function GrowthSection({ strategies, quickWins }: GrowthSectionProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Growth Strategy</CardTitle>
      </CardHeader>
      <CardContent>
        {strategies.length > 0 && (
          <div className="mb-6 space-y-4">
            {strategies.map((s, i) => (
              <div key={i} className="rounded-lg border p-4">
                <div className="mb-2 flex items-center justify-between">
                  <h4 className="font-medium">{s.strategy}</h4>
                  <span className="text-xs text-muted-foreground">{s.timeline}</span>
                </div>
                <div className="mb-2">
                  <span className="text-xs text-muted-foreground">Channels: </span>
                  <span className="text-sm">{s.channels.join(", ")}</span>
                </div>
                <p className="text-sm text-muted-foreground">{s.expectedOutcome}</p>
              </div>
            ))}
          </div>
        )}

        {quickWins.length > 0 && (
          <div>
            <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold">
              <TrendingUp className="h-4 w-4" />
              Quick Wins
            </h4>
            <ul className="space-y-2">
              {quickWins.map((win, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-green-500" />
                  {win}
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  )
}