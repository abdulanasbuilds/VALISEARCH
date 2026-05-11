import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface Dimension {
  name: string
  score: number
  label: string
  rationale: string
}

interface ValidationSectionProps {
  dimensions: Dimension[]
  strengths: string[]
  weaknesses: string[]
}

export function ValidationSection({ dimensions, strengths, weaknesses }: ValidationSectionProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Validation Score</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {dimensions.map((dim, i) => (
            <div key={i}>
              <div className="mb-1 flex items-center justify-between">
                <span className="text-sm font-medium">{dim.name}</span>
                <span className="text-sm text-muted-foreground">
                  {dim.score}/100 ({dim.label})
                </span>
              </div>
              <Progress
                value={dim.score}
                className="h-2"
              />
              <p className="mt-1 text-xs text-muted-foreground">{dim.rationale}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div>
            <h4 className="mb-2 text-sm font-semibold">Strengths</h4>
            <ul className="space-y-1">
              {strengths.map((s, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <span className="text-green-500">+</span>
                  {s}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="mb-2 text-sm font-semibold">Areas to Improve</h4>
            <ul className="space-y-1">
              {weaknesses.map((w, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <span className="text-red-500">-</span>
                  {w}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}