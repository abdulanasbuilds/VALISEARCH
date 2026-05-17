export const runtime = "edge"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { GitCommit, Zap, Rocket, Terminal } from "lucide-react"

const CHANGES = [
  {
    version: "1.0.0",
    date: "May 11, 2026",
    badge: "Major",
    changes: [
      "Initial launch of ValiSearch Engine v1.0",
      "Parallel execution of 12 specialized AI agents",
      "Global payment infrastructure (Stripe, Paystack, Flutterwave)",
      "Real-time analytical pipeline telemetry",
      "Multi-agent synthesis dashboard architecture",
      "Compute Allocation credit system",
    ],
  },
  {
    version: "0.9.0",
    date: "May 01, 2026",
    badge: "Beta",
    changes: [
      "Alpha integration with early founder cohorts",
      "Agent prompt engineering & optimization",
      "Supabase persistent state management",
      "Security-hardened authentication flow",
    ],
  },
  {
    version: "0.5.0",
    date: "Apr 15, 2026",
    badge: "Alpha",
    changes: [
      "Core analytical prototype (3 agents)",
      "Market viability validation algorithms",
      "Public landing page deployment",
    ],
  },
]

export default function ChangelogPage() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-3xl -z-10 opacity-50" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-purple-500/5 blur-3xl -z-10 opacity-50" />
      
      <div className="mx-auto max-w-4xl px-6 py-24 relative z-10">
        <div className="mb-20 text-center max-w-2xl mx-auto">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-semibold text-primary tracking-wider uppercase">
            <GitCommit className="h-3 w-3" />
            System Updates
          </div>
          <h1 className="mb-6 text-5xl font-extrabold tracking-tight text-foreground md:text-6xl">
            Protocol <span className="bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">Changelog.</span>
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Tracking the evolution of the ValiSearch analytical engine and core infrastructure.
          </p>
        </div>

        <div className="relative space-y-12">
          {/* Vertical Timeline Line */}
          <div className="absolute left-0 sm:left-1/2 top-4 bottom-4 w-px bg-gradient-to-b from-primary/50 via-border/50 to-transparent -translate-x-1/2 hidden sm:block" />

          {CHANGES.map((release, idx) => (
            <div key={release.version} className={`relative flex flex-col sm:flex-row items-center gap-8 ${idx % 2 === 0 ? 'sm:flex-row' : 'sm:flex-row-reverse'}`}>
              
              {/* Timeline Node */}
              <div className="absolute left-0 sm:left-1/2 w-4 h-4 rounded-full bg-background border-2 border-primary -translate-x-1/2 z-20 hidden sm:block shadow-[0_0_10px_rgba(var(--primary),0.5)]" />

              <div className="w-full sm:w-1/2">
                <Card className="border-border/40 bg-background/50 backdrop-blur-xl hover:border-primary/40 transition-all duration-300 rounded-2xl overflow-hidden group">
                  <CardHeader className="bg-muted/10 border-b border-border/20 py-4 px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Terminal className="h-4 w-4 text-primary opacity-50" />
                        <CardTitle className="text-lg font-mono tracking-tight group-hover:text-primary transition-colors">v{release.version}</CardTitle>
                      </div>
                      <Badge
                        variant={release.badge === "Major" ? "default" : "outline"}
                        className={`text-[10px] font-bold uppercase tracking-widest ${release.badge === 'Major' ? 'bg-primary' : 'border-primary/20 text-primary bg-primary/5'}`}
                      >
                        {release.badge}
                      </Badge>
                    </div>
                    <p className="text-[10px] font-mono text-muted-foreground mt-1 uppercase tracking-widest">{release.date}</p>
                  </CardHeader>
                  <CardContent className="p-6">
                    <ul className="space-y-3">
                      {release.changes.map((change) => (
                        <li key={change} className="flex items-start gap-3">
                          <div className="h-5 w-5 rounded-md bg-primary/5 border border-primary/10 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-primary/10 transition-colors">
                             <Zap className="h-3 w-3 text-primary" />
                          </div>
                          <span className="text-sm text-muted-foreground leading-snug group-hover:text-foreground transition-colors">{change}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>

              {/* Spacing for the other side on desktop */}
              <div className="hidden sm:block sm:w-1/2" />
            </div>
          ))}
        </div>

        {/* Beta Notice */}
        <div className="mt-24 p-8 rounded-2xl border border-dashed border-primary/20 bg-primary/5 flex flex-col md:flex-row items-center gap-6 max-w-2xl mx-auto">
           <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <Rocket className="h-6 w-6 text-primary" />
           </div>
           <div>
              <h3 className="font-bold text-lg">Pushing to Production</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">We ship new analytical engines and UI refinements every 48 hours. Stay tuned for the upcoming SDK launch.</p>
           </div>
        </div>
      </div>
    </div>
  )
}