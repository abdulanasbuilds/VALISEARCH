import { Check, Zap } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

const plans = [
  {
    name: "Developer",
    price: 0,
    description: "For testing the engine",
    features: [
      "2 execution credits",
      "Standard parallel analysis",
      "Export as text",
      "Community support",
    ],
    cta: "Initialize Free",
    href: "/register",
    variant: "default"
  },
  {
    name: "Founder",
    price: 49,
    description: "For serious validation",
    features: [
      "25 execution credits/mo",
      "Deep analysis with web search",
      "Priority agent queue",
      "Export PDF/CSV/JSON",
    ],
    cta: "Start Subscription",
    href: "/register?plan=founder",
    popular: true,
    variant: "primary"
  },
  {
    name: "Enterprise",
    price: 199,
    description: "For incubators & studios",
    features: [
      "Unlimited execution credits",
      "Custom agent configuration",
      "API Access (Beta)",
      "Dedicated account manager",
    ],
    cta: "Contact Sales",
    href: "mailto:hello@valisearch.ai",
    variant: "default"
  },
]

export function PricingCards() {
  return (
    <section className="border-b border-border/40 py-24 md:py-32 bg-muted/10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 md:mb-24 text-center max-w-2xl mx-auto">
          <h2 className="text-3xl font-semibold tracking-tighter md:text-5xl">
            Compute Allocation
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Transparent pricing based on analytical compute requirements.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3 items-start">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative rounded-2xl border bg-background p-8 shadow-sm transition-all duration-300 ${
                plan.popular 
                  ? "border-primary/50 shadow-md shadow-primary/5 ring-1 ring-primary/20 scale-[1.02]" 
                  : "border-border/50 hover:border-border"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center gap-1 rounded-full bg-primary px-3 py-1 text-xs font-mono font-medium text-primary-foreground shadow-sm">
                  <Zap className="h-3 w-3" /> [ RECOMMENDED ]
                </div>
              )}
              
              <div className="mb-6">
                <h3 className="text-xl font-medium tracking-tight mb-2">{plan.name}</h3>
                <p className="text-sm text-muted-foreground">{plan.description}</p>
              </div>
              
              <div className="mb-8 pb-8 border-b border-border/40">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-semibold tracking-tighter">${plan.price}</span>
                  {plan.price > 0 && <span className="text-sm text-muted-foreground font-mono">/mo</span>}
                </div>
              </div>
              
              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                    <Check className={`h-4 w-4 shrink-0 mt-0.5 ${plan.popular ? 'text-primary' : 'text-foreground/40'}`} />
                    <span className="leading-tight">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Link href={plan.href} className="block w-full mt-auto">
                <Button 
                  className="w-full font-medium" 
                  variant={plan.popular ? "default" : "outline"}
                  size="lg"
                >
                  {plan.cta}
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}