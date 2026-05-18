import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Rocket } from "lucide-react"

interface ScalePlan {
  phase: string
  milestones: string[]
  timeline: string
}

interface ScaleSectionProps {
  scalePlan: ScalePlan[]
  challenges: string[]
  resources: string[]
}

export function ScaleSection({ scalePlan, challenges, resources }: ScaleSectionProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Scale Roadmap</CardTitle>
      </CardHeader>
      <CardContent>
        {scalePlan.length > 0 && (
          <div className="mb-6 space-y-4">
            {scalePlan.map((phase, i) => (
              <div key={i} className="rounded-lg border p-4">
                <div className="mb-2 flex items-center justify-between">
                  <h4 className="flex items-center gap-2 font-medium">
                    <Rocket className="h-4 w-4 text-primary" />
                    {phase.phase}
                  </h4>
                  <span className="text-xs text-muted-foreground">{phase.timeline}</span>
                </div>
                <ul className="space-y-1">
                  {phase.milestones.map((m, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm">
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                      {m}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        {challenges.length > 0 && (
          <div className="mb-6">
            <h4 className="mb-3 text-sm font-semibold">Scaling Challenges</h4>
            <ul className="space-y-2">
              {challenges.map((c, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                  {c}
                </li>
              ))}
            </ul>
          </div>
        )}

        {resources.length > 0 && (
          <div>
            <h4 className="mb-3 text-sm font-semibold">Required Resources</h4>
            <ul className="space-y-2">
              {resources.map((r, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-green-500" />
                  {r}
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
