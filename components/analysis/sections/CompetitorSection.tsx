import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ExternalLink, XCircle, CheckCircle } from "lucide-react"

interface Competitor {
  name: string
  url?: string
  strengths: string[]
  weaknesses: string[]
  differentiators: string[]
}

interface CompetitorSectionProps {
  competitors: Competitor[]
  marketGaps: string[]
}

export function CompetitorSection({
  competitors,
  marketGaps,
}: CompetitorSectionProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Competitive Landscape</CardTitle>
      </CardHeader>
      <CardContent>
        {competitors.length > 0 ? (
          <div className="space-y-6">
            {competitors.map((comp, i) => (
              <div key={i} className="rounded-lg border p-4">
                <div className="mb-3 flex items-center justify-between">
                  <h4 className="font-semibold">{comp.name}</h4>
                  {comp.url && (
                    <a
                      href={comp.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-primary"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                </div>

                {comp.strengths.length > 0 && (
                  <div className="mb-3">
                    <p className="mb-1 text-xs text-muted-foreground">Strengths</p>
                    <ul className="space-y-1">
                      {comp.strengths.map((s, j) => (
                        <li key={j} className="flex items-start gap-2 text-sm">
                          <CheckCircle className="h-3 w-3 shrink-0 text-green-500" />
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {comp.weaknesses.length > 0 && (
                  <div>
                    <p className="mb-1 text-xs text-muted-foreground">Weaknesses</p>
                    <ul className="space-y-1">
                      {comp.weaknesses.map((w, j) => (
                        <li key={j} className="flex items-start gap-2 text-sm">
                          <XCircle className="h-3 w-3 shrink-0 text-red-400" />
                          {w}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No competitors identified</p>
        )}

        {marketGaps.length > 0 && (
          <div className="mt-6 border-t pt-6">
            <h4 className="mb-3 text-sm font-semibold">Market Gaps & Opportunities</h4>
            <ul className="space-y-2">
              {marketGaps.map((gap, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  {gap}
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
