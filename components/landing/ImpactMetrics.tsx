import { ArrowUpRight } from "lucide-react"

export function ImpactMetrics() {
  return (
    <section className="py-24 border-b border-border/40 bg-background">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8 md:gap-12 divide-y md:divide-y-0 md:divide-x divide-border/50">
          
          <div className="flex flex-col items-center justify-center text-center pt-8 md:pt-0">
            <div className="flex items-start text-5xl font-bold tracking-tighter text-foreground mb-2">
              40<span className="text-3xl mt-1 text-primary">hrs</span>
              <ArrowUpRight className="h-6 w-6 text-green-500 ml-1" />
            </div>
            <h3 className="text-lg font-medium">Average Time Saved</h3>
            <p className="text-sm text-muted-foreground mt-2 max-w-[250px]">
              Compared to manual market research and competitor analysis.
            </p>
          </div>

          <div className="flex flex-col items-center justify-center text-center pt-8 md:pt-0">
            <div className="flex items-start text-5xl font-bold tracking-tighter text-foreground mb-2">
              12<span className="text-3xl mt-1 text-primary">x</span>
            </div>
            <h3 className="text-lg font-medium">Parallel Agents</h3>
            <p className="text-sm text-muted-foreground mt-2 max-w-[250px]">
              Simultaneous workflows executing complex analytical frameworks.
            </p>
          </div>

          <div className="flex flex-col items-center justify-center text-center pt-8 md:pt-0">
            <div className="flex items-start text-5xl font-bold tracking-tighter text-foreground mb-2">
              $0
            </div>
            <h3 className="text-lg font-medium">Cost of Failure</h3>
            <p className="text-sm text-muted-foreground mt-2 max-w-[250px]">
              Avoid building products that have no market demand or extreme friction.
            </p>
          </div>

        </div>
      </div>
    </section>
  )
}
