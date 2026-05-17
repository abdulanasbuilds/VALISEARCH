import { BrainCircuit, Globe, BarChart3, Terminal, Zap } from "lucide-react"

export function FeatureGrid() {
  return (
    <section className="border-b border-border/40 py-24 md:py-32 bg-muted/10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 md:mb-24">
          <h2 className="text-3xl font-semibold tracking-tighter md:text-5xl max-w-2xl">
            Engineered for comprehensive startup intelligence.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-4 auto-rows-[200px] relative z-10">
          
          {/* Bento Item 1: 12 Agents (Large Square) */}
          <div className="md:col-span-2 lg:col-span-2 row-span-2 rounded-2xl glass-card p-6 flex flex-col justify-between overflow-hidden relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 shadow-[0_0_15px_rgba(var(--primary),0.1)] group-hover:scale-110 transition-transform duration-300">
                <BrainCircuit className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-2xl font-bold tracking-tight">12 Parallel Agents</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                A swarm of specialized computational agents operating concurrently to evaluate market fit, pricing, distribution, and growth vectors.
              </p>
            </div>
            
            {/* Micro-UI snippet */}
            <div 
              className="relative z-10 mt-6 -mx-2 -mb-2 rounded-xl border border-primary/10 bg-background/50 backdrop-blur-md p-4 h-36 overflow-hidden shadow-inner"
              style={{ maskImage: "linear-gradient(to bottom, black 40%, transparent 100%)", WebkitMaskImage: "linear-gradient(to bottom, black 40%, transparent 100%)" }}
            >
               <div className="space-y-3">
                 <div className="flex items-center gap-2 text-xs font-mono"><Zap className="h-3 w-3 text-yellow-500 animate-pulse" /> [Sys] Initiating Market Research... </div>
                 <div className="flex items-center gap-2 text-xs font-mono"><Zap className="h-3 w-3 text-yellow-500 animate-pulse" style={{ animationDelay: '0.5s' }} /> [Sys] Scraping 40+ Competitors... </div>
                 <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground"><Zap className="h-3 w-3 opacity-50" /> [Sys] Generating Profit Models... </div>
               </div>
            </div>
          </div>

          {/* Bento Item 2: Live Web Data (Wide Rectangle) */}
          <div className="md:col-span-2 lg:col-span-4 row-span-1 rounded-2xl glass-card p-6 flex flex-col justify-between overflow-hidden relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10 flex flex-col md:flex-row md:items-start gap-5 h-full">
              <div className="flex-shrink-0 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 border border-blue-500/20 group-hover:scale-110 transition-transform duration-300">
                <Globe className="h-6 w-6 text-blue-500" />
              </div>
              <div className="flex-1">
                <h3 className="mb-2 text-xl font-bold tracking-tight">Real-Time Web Intelligence</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Bypasses standard LLM training cutoffs. The engine executes live search queries and scrapes social APIs to validate current market demand and identify precise customer pain points as they exist today.
                </p>
              </div>
            </div>
          </div>

          {/* Bento Item 3: TAM/SAM/SOM (Square) */}
          <div className="md:col-span-2 lg:col-span-2 row-span-1 rounded-2xl glass-card p-6 flex flex-col justify-between group overflow-hidden relative">
             <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
             <div className="relative z-10">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20 group-hover:scale-110 transition-transform duration-300">
                <BarChart3 className="h-6 w-6 text-emerald-500" />
              </div>
              <h3 className="mb-2 text-xl font-bold tracking-tight">Deterministic Modeling</h3>
              <p className="text-sm text-muted-foreground">
                Algorithmic TAM, SAM, and SOM calculations cited with verifiable industry reports.
              </p>
            </div>
          </div>

          {/* Bento Item 4: Synthesis Report (Square) */}
          <div className="md:col-span-2 lg:col-span-2 row-span-1 rounded-2xl glass-card p-6 flex flex-col justify-between group overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-bl from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500/10 border border-orange-500/20 group-hover:scale-110 transition-transform duration-300">
                <Terminal className="h-6 w-6 text-orange-500" />
              </div>
              <h3 className="mb-2 text-xl font-bold tracking-tight">Human-Readable Synthesis</h3>
              <p className="text-sm text-muted-foreground">
                Actionable executive summaries. Zero generic AI jargon or hallucinations.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}