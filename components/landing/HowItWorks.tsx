import { Terminal, Cpu, LineChart } from "lucide-react"

const steps = [
  {
    icon: Terminal,
    step: "01",
    title: "Idea Initialization",
    description: "Input your core startup concept. The engine normalizes the data and prepares the context vectors.",
  },
  {
    icon: Cpu,
    step: "02",
    title: "Parallel Execution",
    description: "12 specialized AI agents launch simultaneously, querying live market data, scraping competitors, and running financial models.",
  },
  {
    icon: LineChart,
    step: "03",
    title: "Synthesis & Scoring",
    description: "A final orchestrator agent aggregates the outputs, calculates a deterministic viability score, and generates a strategic roadmap.",
  },
]

export function HowItWorks() {
  return (
    <section className="border-b border-border/40 py-24 md:py-32 bg-background">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 md:mb-24">
          <h2 className="text-3xl font-semibold tracking-tighter md:text-5xl">
            The Validation Pipeline
          </h2>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
            A deterministic, parallel-processing architecture designed to eliminate assumptions from your startup strategy.
          </p>
        </div>

        <div className="relative">
          {/* Continuous structural line for desktop */}
          <div className="hidden md:block absolute top-[28px] left-[10%] right-[10%] h-[1px] bg-border/60" />
          
          <div className="grid gap-12 md:grid-cols-3 md:gap-8 relative z-10">
            {steps.map((step, index) => (
              <div key={index} className="relative group">
                <div className="mb-6 flex items-center justify-between">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-border/50 bg-background shadow-sm transition-all group-hover:border-primary/50 group-hover:shadow-md">
                    <step.icon className="h-6 w-6 text-foreground/80 group-hover:text-primary transition-colors" />
                  </div>
                  <span className="text-sm font-mono text-muted-foreground/50 group-hover:text-primary/50 transition-colors">
                    {step.step}
                  </span>
                </div>
                <h3 className="mb-3 text-xl font-medium tracking-tight text-foreground">
                  {step.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}