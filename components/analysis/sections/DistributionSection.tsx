import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin } from "lucide-react"

interface DistributionChannel {
  channel: string
  priority: "high" | "medium" | "low"
  description: string
  effort: string
}

interface DistributionSectionProps {
  channels: DistributionChannel[]
  partnerships: string[]
}

export function DistributionSection({ channels, partnerships }: DistributionSectionProps) {
  const priorityColors = {
    high: "text-red-500",
    medium: "text-amber-500",
    low: "text-green-500",
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Distribution Strategy</CardTitle>
      </CardHeader>
      <CardContent>
        {channels.length > 0 && (
          <div className="mb-6 space-y-3">
            {channels.map((c, i) => (
              <div key={i} className="flex items-start justify-between rounded-lg border p-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">{c.channel}</h4>
                    <span className={`text-xs ${priorityColors[c.priority]}`}>
                      {c.priority}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{c.description}</p>
                </div>
                <span className="text-xs text-muted-foreground">{c.effort}</span>
              </div>
            ))}
          </div>
        )}

        {partnerships.length > 0 && (
          <div>
            <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold">
              <MapPin className="h-4 w-4" />
              Potential Partnerships
            </h4>
            <ul className="space-y-2">
              {partnerships.map((p, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  {p}
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
