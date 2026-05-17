import { ArrowUpRight } from "lucide-react"

export function ImpactMetrics() {
  return (
    <section className="py-24 border-b border-subtle bg-background">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            Concrete proof of ROI.
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          
          <div className="surface-card p-8 flex flex-col justify-center text-left hover:border-primary/50 transition-colors">
            <div className="flex items-center text-5xl font-bold tracking-tighter text-foreground mb-4">
              40<span className="text-2xl mt-2 ml-1 text-muted-foreground font-medium">hrs</span>
            </div>
            <h3 className="text-lg font-semibold text-foreground">Saved per project</h3>
            <p className="text-sm text-muted-foreground mt-2">
              Bypassing manual market research, reading industry reports, and competitor mapping.
            </p>
          </div>

          <div className="surface-card p-8 flex flex-col justify-center text-left hover:border-primary/50 transition-colors">
            <div className="flex items-center text-5xl font-bold tracking-tighter text-foreground mb-4">
              +150<span className="text-2xl mt-2 ml-1 text-muted-foreground font-medium">%</span>
            </div>
            <h3 className="text-lg font-semibold text-foreground">Launch confidence</h3>
            <p className="text-sm text-muted-foreground mt-2">
              Statistically backed decisions based on live search trends and API sentiment data.
            </p>
          </div>

          <div className="surface-card p-8 flex flex-col justify-center text-left hover:border-primary/50 transition-colors">
            <div className="flex items-center text-5xl font-bold tracking-tighter text-foreground mb-4">
              $0
            </div>
            <h3 className="text-lg font-semibold text-foreground">Wasted development</h3>
            <p className="text-sm text-muted-foreground mt-2">
              Completely eliminate the risk of building complex software that nobody actually wants.
            </p>
          </div>

        </div>
      </div>
    </section>
  )
}
