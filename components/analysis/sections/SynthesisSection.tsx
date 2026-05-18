import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Lightbulb, AlertTriangle } from "lucide-react"

interface SynthesisSectionProps {
  executiveSummary: string
  topStrengths: string[]
  topRisks: string[]
  nextSteps: string[]
}

export function SynthesisSection({
  executiveSummary,
  topStrengths,
  topRisks,
  nextSteps,
}: SynthesisSectionProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Synthesis</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6 rounded-lg bg-primary/5 p-4">
          <p className="text-sm">{executiveSummary}</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-green-600" />
              <h4 className="text-sm font-semibold">Top Strengths</h4>
            </div>
            <ul className="space-y-2">
              {topStrengths.map((s, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-green-500" />
                  {s}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="mb-3 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <h4 className="text-sm font-semibold">Top Risks</h4>
            </div>
            <ul className="space-y-2">
              {topRisks.map((r, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                  {r}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-6 border-t pt-6">
          <h4 className="mb-3 text-sm font-semibold">Immediate Next Steps</h4>
          <div className="space-y-2">
            {nextSteps.map((step, i) => (
              <div key={i} className="flex items-start gap-3 rounded-lg bg-muted/50 p-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                  {i + 1}
                </span>
                <span className="text-sm">{step}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
