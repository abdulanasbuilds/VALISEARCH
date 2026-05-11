import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

const analysisItems = [
  { name: "Food delivery app for Ghana", score: 78, date: "2 hours ago" },
  { name: "SaaS for African logistics", score: 65, date: "1 day ago" },
  { name: "EdTech platform for Kenya", score: 82, date: "3 days ago" },
]

export function DashboardMockup() {
  return (
    <section className="bg-gray-50 py-20">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight">Your Workspace</h2>
          <p className="mt-4 text-muted-foreground">
            Track all your analyses in one place
          </p>
        </div>

        <div className="mx-auto max-w-4xl rounded-xl border border-border bg-white shadow-2xl">
          <div className="flex items-center gap-4 border-b border-border px-6 py-4">
            <div className="h-8 w-8 rounded-lg bg-primary" />
            <span className="font-semibold">ValiSearch</span>
            <Badge variant="secondary" className="ml-auto">6 credits</Badge>
          </div>

          <div className="grid md:grid-cols-4">
            <div className="border-r border-border bg-gray-50/50 p-4">
              <nav className="space-y-2">
                {["Workspace", "New Analysis", "Settings", "Billing"].map((item, i) => (
                  <div
                    key={item}
                    className={`rounded-lg px-3 py-2 text-sm ${i === 0 ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:bg-gray-100"}`}
                  >
                    {item}
                  </div>
                ))}
              </nav>
            </div>

            <div className="col-span-3 p-6">
              <h3 className="mb-4 text-lg font-semibold">Recent Analyses</h3>
              <div className="space-y-4">
                {analysisItems.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between rounded-lg border border-border p-4"
                  >
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-muted-foreground">{item.date}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">{item.score}</div>
                      <p className="text-xs text-muted-foreground">/100</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}