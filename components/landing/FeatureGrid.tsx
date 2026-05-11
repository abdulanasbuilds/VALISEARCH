import { BarChart3, Globe, Shield, Clock, BrainCircuit, MessageSquare } from "lucide-react"

const features = [
  {
    icon: BrainCircuit,
    title: "12 Specialized AI Agents",
    description: "Each agent focuses on a specific aspect: market, competitors, growth, branding, and more.",
  },
  {
    icon: Globe,
    title: "Real Web Data",
    description: "Agents search the live web for current market data, competitors, and community discussions.",
  },
  {
    icon: BarChart3,
    title: "TAM/SAM/SOM Analysis",
    description: "Get clear market size estimates with source citations from real market research.",
  },
  {
    icon: Shield,
    title: "Competitor Intelligence",
    description: "See who's already solving this problem and identify gaps you can fill.",
  },
  {
    icon: Clock,
    title: "Results in Minutes",
    description: "Parallel agent execution means you get a full analysis in under 2 minutes.",
  },
  {
    icon: MessageSquare,
    title: "Human-Readable Reports",
    description: "No jargon or confusing metrics. Actionable insights you can use immediately.",
  },
]

export function FeatureGrid() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight">Why ValiSearch?</h2>
          <p className="mt-4 text-muted-foreground">
            Everything you need to validate and build your startup
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <div
              key={index}
              className="rounded-xl border border-border bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <feature.icon className="mb-4 h-8 w-8 text-primary" />
              <h3 className="mb-2 font-semibold">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}