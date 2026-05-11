import { Search, Users, TrendingUp, FileText, Target, Zap } from "lucide-react"

const steps = [
  {
    icon: Search,
    title: "Describe Your Idea",
    description: "Type your startup idea in plain English. No business jargon required.",
  },
  {
    icon: Zap,
    title: "12 Agents Analyze in Parallel",
    description: "Market research, competitor intel, growth strategy — all run simultaneously.",
  },
  {
    icon: FileText,
    title: "Get Your Report",
    description: "Receive a comprehensive analysis with scores, recommendations, and next steps.",
  },
]

export function HowItWorks() {
  return (
    <section className="bg-gray-50 py-20">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight">How It Works</h2>
          <p className="mt-4 text-muted-foreground">
            From idea to insights in under 2 minutes
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {steps.map((step, index) => (
            <div key={index} className="relative text-center">
              {index < steps.length - 1 && (
                <div className="hidden absolute top-8 left-[calc(50%+40px)] w-[calc(100%-80px)] md:block">
                  <div className="border-t-2 border-dashed border-border" />
                </div>
              )}
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <step.icon className="h-8 w-8 text-primary" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">{step.title}</h3>
              <p className="text-sm text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}