import { Check, Database } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

const plans = [
  {
    name: "Starter Trial",
    price: 0,
    description: "Ideal for testing individual ideas before committing.",
    allocation: "2 Validations",
    features: [
      "2 startup idea analyses",
      "Deploy 12 parallel agents",
      "Standard market data",
    ],
    cta: "Start Free",
    href: "/register",
    highlight: false,
  },
  {
    name: "Pro Founder",
    price: 29,
    description: "Engineered for active builders exploring multiple markets.",
    allocation: "50 Validations",
    features: [
      "50 startup idea analyses",
      "Deep analytical reasoning",
      "Real-time web search",
      "Priority execution queue",
    ],
    cta: "Upgrade to Pro",
    href: "/register?plan=pro",
    popular: true,
    highlight: true,
  },
  {
    name: "Enterprise",
    price: 99,
    description: "High-throughput intelligence for incubators and VCs.",
    allocation: "Unlimited",
    features: [
      "Unlimited startup analyses",
      "Custom analytical frameworks",
      "White-label reports",
      "Full API & SDK access",
    ],
    cta: "Contact Sales",
    href: "/register?plan=enterprise",
    highlight: false,
  },
]

export function PricingCards() {
  return (
    <section className="py-24 md:py-32 bg-background overflow-hidden border-t border-subtle">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-20 text-center max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6 text-foreground">
            Transparent pricing. Zero hidden fees.
          </h2>
          <p className="text-lg text-muted-foreground">
            Start validating ideas instantly. Upgrade when you need more capacity.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3 items-stretch">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative flex flex-col rounded-2xl border p-8 transition-all duration-300 ${
                plan.highlight 
                  ? "border-primary shadow-sm bg-card" 
                  : "border-subtle bg-background"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center gap-1 rounded-full bg-primary px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-primary-foreground">
                   Most Popular
                </div>
              )}
              
              <div className="mb-8">
                 <h3 className="text-xl font-bold tracking-tight text-foreground mb-2">{plan.name}</h3>
                 <p className="text-sm text-muted-foreground">{plan.description}</p>
              </div>
              
              <div className="mb-8">
                 <div className="flex items-baseline gap-1 mb-4">
                    <span className="text-5xl font-extrabold tracking-tighter text-foreground">${plan.price}</span>
                    {plan.price > 0 && <span className="text-lg font-medium text-muted-foreground">/mo</span>}
                 </div>
                 <div className="text-sm font-semibold bg-muted/50 text-foreground py-2 px-3 rounded-md border border-subtle inline-block">
                    {plan.allocation}
                 </div>
              </div>
              
              <ul className="space-y-4 mb-10 flex-1">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="h-5 w-5 rounded-full bg-muted flex items-center justify-center shrink-0 mt-0.5">
                       <Check className="h-3 w-3 text-foreground" />
                    </div>
                    <span className="text-sm text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Link href={plan.href} className="block w-full">
                <Button 
                  className={`w-full h-12 font-semibold rounded-lg`} 
                  variant={plan.highlight ? "default" : "outline"}
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