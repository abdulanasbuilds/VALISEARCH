import { Terminal, Activity, Database, CheckCircle2, AlertTriangle, ShieldCheck } from "lucide-react"

const agentLogs = [
  { agent: "Market Size", status: "success", metric: "$14.2B TAM" },
  { agent: "Competitors", status: "success", metric: "42 Identified" },
  { agent: "Pricing Model", status: "warning", metric: "High Friction" },
  { agent: "Distribution", status: "success", metric: "SEO/Inbound" },
]

export function DashboardMockup() {
  return (
    <section className="border-b border-border/40 py-24 md:py-32 bg-background">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 md:mb-24 text-center max-w-3xl mx-auto">
          <h2 className="text-3xl font-semibold tracking-tighter md:text-5xl">
            Command Center for Founders
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Monitor parallel agent executions, drill down into raw data, and export investor-ready synthesis reports from a single pane of glass.
          </p>
        </div>

        {/* Dashboard Window UI */}
        <div className="mx-auto max-w-5xl rounded-2xl border border-border/50 bg-background shadow-2xl overflow-hidden ring-1 ring-border/10">
          
          {/* Mac-style Window Header */}
          <div className="flex items-center justify-between border-b border-border/40 bg-muted/30 px-4 py-3">
            <div className="flex gap-1.5">
              <div className="h-3 w-3 rounded-full bg-red-500/80" />
              <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
              <div className="h-3 w-3 rounded-full bg-green-500/80" />
            </div>
            <div className="text-xs font-mono text-muted-foreground/70 flex items-center gap-2">
              <Activity className="h-3 w-3" /> valisearch-engine-ui
            </div>
            <div className="w-12"></div> {/* Spacer for symmetry */}
          </div>

          <div className="grid md:grid-cols-[220px_1fr] min-h-[400px]">
            {/* Sidebar */}
            <div className="border-r border-border/40 bg-muted/10 p-4 hidden md:block">
              <div className="mb-6 px-2 flex items-center gap-2">
                 <Terminal className="h-4 w-4 text-primary" />
                 <span className="font-semibold text-sm tracking-tight">Active Workspaces</span>
              </div>
              <nav className="space-y-1">
                {["Project Alpha", "Fintech API", "B2B SaaS DevTool"].map((item, i) => (
                  <div
                    key={item}
                    className={`rounded-lg px-3 py-2 text-xs font-medium cursor-pointer transition-colors ${
                      i === 0 
                        ? "bg-primary/10 text-primary border border-primary/20" 
                        : "text-muted-foreground hover:bg-muted/50 hover:text-foreground border border-transparent"
                    }`}
                  >
                    {item}
                  </div>
                ))}
              </nav>
            </div>

            {/* Main Content Area */}
            <div className="p-6 bg-background relative overflow-hidden">
              {/* Subtle background grid */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />
              
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-8">
                  <div>
                    <h3 className="text-2xl font-semibold tracking-tight">Project Alpha Analysis</h3>
                    <p className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
                      <Database className="h-3 w-3" /> Synthesis Complete • 2 minutes ago
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-4xl font-bold tracking-tighter text-primary">82<span className="text-lg text-muted-foreground font-normal">/100</span></div>
                    <div className="text-xs font-mono text-primary/80 uppercase tracking-wider mt-1">Viability Score</div>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4 mb-8">
                  {agentLogs.map((log, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-xl border border-border/50 bg-muted/10">
                      <div className="flex items-center gap-3">
                        {log.status === 'success' ? (
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                        ) : (
                          <AlertTriangle className="h-4 w-4 text-yellow-500" />
                        )}
                        <span className="text-sm font-medium">{log.agent}</span>
                      </div>
                      <span className="text-xs font-mono text-muted-foreground">{log.metric}</span>
                    </div>
                  ))}
                </div>

                <div className="rounded-xl border border-border/50 bg-muted/10 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <ShieldCheck className="h-4 w-4 text-primary" />
                    <span className="text-sm font-semibold">Executive Verdict</span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Strong market pull identified for SMB segment. However, current pricing hypothesis encounters high friction compared to incumbent tools. Recommend adopting a freemium acquisition model.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
