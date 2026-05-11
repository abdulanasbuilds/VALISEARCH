import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const CHANGES = [
  {
    version: "1.0.0",
    date: "2026-05-11",
    badge: "Major",
    changes: [
      "Initial launch of ValiSearch",
      "12 AI agents for startup validation",
      "4 payment gateways (Stripe, Flutterwave, Paystack, Lemon Squeezy)",
      "Real-time analysis progress",
      "Complete analysis dashboard with 13 sections",
      "Credit-based subscription system",
    ],
  },
  {
    version: "0.9.0",
    date: "2026-05-01",
    badge: "Beta",
    changes: [
      "Alpha testing with early users",
      "Added all 12 agent prompts",
      "Integrated Supabase for data storage",
      "Set up authentication flow",
    ],
  },
  {
    version: "0.5.0",
    date: "2026-04-15",
    badge: "Alpha",
    changes: [
      "First prototype with 3 agents",
      "Basic idea validation",
      "Landing page launch",
    ],
  },
]

export default function ChangelogPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-3xl px-6 py-20">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold">Changelog</h1>
          <p className="text-lg text-muted-foreground">
            Follow along as we build ValiSearch
          </p>
        </div>

        <div className="space-y-8">
          {CHANGES.map((release) => (
            <Card key={release.version}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">Version {release.version}</CardTitle>
                  <Badge
                    variant={
                      release.badge === "Major"
                        ? "default"
                        : release.badge === "Beta"
                        ? "secondary"
                        : "outline"
                    }
                  >
                    {release.badge}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{release.date}</p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {release.changes.map((change) => (
                    <li key={change} className="flex items-start gap-2">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                      <span className="text-sm">{change}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}