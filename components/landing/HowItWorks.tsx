import { Terminal, Cpu, LineChart, Search, FileText, CheckCircle2 } from "lucide-react"

export function HowItWorks() {
  return (
    <section className="border-b border-subtle py-24 md:py-32 bg-background overflow-hidden">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-20 md:mb-32 text-center max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold tracking-tight md:text-5xl text-foreground">
            The validation pipeline.
          </h2>
          <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
            A deterministic, parallel-processing architecture designed to eliminate assumptions from your startup strategy in three distinct phases.
          </p>
        </div>

        <div className="space-y-32">
          {/* Step 1: Text Left, Realistic UI Right */}
          <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">
            <div>
              <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-lg border border-subtle bg-muted shadow-sm">
                <Terminal className="h-5 w-5 text-foreground" />
              </div>
              <h3 className="text-2xl font-bold tracking-tight mb-4">
                1. Idea Initialization & Context
              </h3>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Input your core startup concept. The engine normalizes the data, establishes market boundaries, and prepares the context vectors required for deep analysis.
              </p>
            </div>
            <div className="relative rounded-2xl border border-subtle bg-muted/20 p-8 overflow-hidden h-[340px] flex items-center justify-center shadow-inner">
               <div className="w-full max-w-sm surface-card p-5 relative z-10 shadow-lg">
                 <div className="flex items-center gap-2 mb-4 border-b border-subtle pb-3">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-foreground">Idea Description</span>
                 </div>
                 <p className="text-sm text-foreground/80 leading-relaxed mb-4">
                   "A developer tool that uses AI to automatically write pull request summaries by analyzing git diffs..."
                 </p>
                 <div className="space-y-3">
                   <div className="flex items-center justify-between text-xs">
                     <span className="text-muted-foreground font-mono">Market Context</span>
                     <span className="font-medium text-foreground">B2B SaaS / DevTools</span>
                   </div>
                   <div className="flex items-center justify-between text-xs">
                     <span className="text-muted-foreground font-mono">Target Audience</span>
                     <span className="font-medium text-foreground">Software Engineers</span>
                   </div>
                 </div>
                 <div className="mt-5 pt-3 border-t border-subtle flex justify-end">
                   <div className="px-4 py-1.5 bg-foreground text-background rounded-md text-xs font-semibold flex items-center gap-1.5 shadow-sm">
                     <CheckCircle2 className="h-3 w-3" />
                     Context Initialized
                   </div>
                 </div>
               </div>
            </div>
          </div>

          {/* Step 2: UI Left, Text Right */}
          <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">
            <div className="order-2 md:order-1 relative rounded-2xl border border-subtle bg-muted/20 p-8 overflow-hidden h-[340px] flex flex-col items-center justify-center shadow-inner">
               <div className="w-full max-w-sm flex flex-col gap-3 relative z-10">
                 {/* Realistic Agent Execution Rows */}
                 <div className="surface-card p-3 flex items-center gap-4 shadow-sm relative overflow-hidden">
                   <div className="absolute left-0 top-0 bottom-0 w-1 bg-green-500"></div>
                   <div className="h-8 w-8 rounded-md bg-muted flex items-center justify-center shrink-0">
                     <Search className="h-4 w-4 text-foreground" />
                   </div>
                   <div className="flex-1">
                     <div className="flex justify-between items-center mb-1">
                       <span className="text-sm font-semibold">Market Researcher</span>
                       <span className="text-[10px] font-mono text-green-500">100%</span>
                     </div>
                     <p className="text-xs text-muted-foreground truncate">Analyzed 15 industry reports...</p>
                   </div>
                 </div>
                 
                 <div className="surface-card p-3 flex items-center gap-4 shadow-sm relative overflow-hidden">
                   <div className="absolute left-0 top-0 bottom-0 w-1 bg-green-500"></div>
                   <div className="h-8 w-8 rounded-md bg-muted flex items-center justify-center shrink-0">
                     <Search className="h-4 w-4 text-foreground" />
                   </div>
                   <div className="flex-1">
                     <div className="flex justify-between items-center mb-1">
                       <span className="text-sm font-semibold">Competitor Intel</span>
                       <span className="text-[10px] font-mono text-green-500">100%</span>
                     </div>
                     <p className="text-xs text-muted-foreground truncate">Scraped G2 reviews for 8 rivals...</p>
                   </div>
                 </div>

                 <div className="surface-card p-3 flex items-center gap-4 shadow-md ring-1 ring-primary/20 relative overflow-hidden transform scale-[1.02] transition-all">
                   <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary animate-pulse"></div>
                   <div className="h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                     <Cpu className="h-4 w-4 text-primary animate-pulse" />
                   </div>
                   <div className="flex-1">
                     <div className="flex justify-between items-center mb-1">
                       <span className="text-sm font-semibold text-foreground">Problem Prioritizer</span>
                       <span className="text-[10px] font-mono text-primary animate-pulse">Running</span>
                     </div>
                     <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden mt-2">
                       <div className="h-full bg-primary w-[65%]"></div>
                     </div>
                   </div>
                 </div>
               </div>
            </div>
            <div className="order-1 md:order-2">
              <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-lg border border-subtle bg-muted shadow-sm">
                <Cpu className="h-5 w-5 text-foreground" />
              </div>
              <h3 className="text-2xl font-bold tracking-tight mb-4">
                2. Parallel Agent Execution
              </h3>
              <p className="text-muted-foreground text-lg leading-relaxed">
                12 specialized AI agents launch simultaneously. They query live market data, scrape competitor reviews, run financial models, and analyze social sentiment in real-time.
              </p>
            </div>
          </div>

          {/* Step 3: Text Left, UI Right */}
          <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">
            <div>
              <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-lg border border-subtle bg-muted shadow-sm">
                <LineChart className="h-5 w-5 text-foreground" />
              </div>
              <h3 className="text-2xl font-bold tracking-tight mb-4">
                3. Synthesis & Scoring
              </h3>
              <p className="text-muted-foreground text-lg leading-relaxed">
                A final orchestrator agent aggregates the outputs, calculates a deterministic viability score based on 6 core dimensions, and generates a highly actionable strategic roadmap.
              </p>
            </div>
            <div className="relative rounded-2xl border border-subtle bg-muted/20 p-8 overflow-hidden h-[340px] flex items-center justify-center shadow-inner">
               <div className="w-full max-w-sm surface-card p-6 relative z-10 shadow-xl flex flex-col">
                 <div className="flex items-center justify-between border-b border-subtle pb-4 mb-4">
                   <div className="flex flex-col">
                     <span className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-1">Viability Score</span>
                     <div className="text-5xl font-bold tracking-tighter text-foreground">82<span className="text-xl text-muted-foreground font-normal">/100</span></div>
                   </div>
                   <div className="h-14 w-14 rounded-full border-4 border-green-500/20 flex items-center justify-center">
                     <span className="text-sm font-bold text-green-500">Strong</span>
                   </div>
                 </div>
                 
                 <div className="space-y-4">
                   <div>
                     <div className="flex justify-between text-xs mb-1.5">
                       <span className="font-medium text-foreground">Market Fit</span>
                       <span className="text-muted-foreground">90/100</span>
                     </div>
                     <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                       <div className="h-full bg-foreground w-[90%]"></div>
                     </div>
                   </div>
                   <div>
                     <div className="flex justify-between text-xs mb-1.5">
                       <span className="font-medium text-foreground">Feasibility</span>
                       <span className="text-muted-foreground">85/100</span>
                     </div>
                     <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                       <div className="h-full bg-foreground w-[85%]"></div>
                     </div>
                   </div>
                   <div>
                     <div className="flex justify-between text-xs mb-1.5">
                       <span className="font-medium text-foreground">Differentiation</span>
                       <span className="text-muted-foreground">60/100</span>
                     </div>
                     <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                       <div className="h-full bg-foreground w-[60%] opacity-60"></div>
                     </div>
                   </div>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}