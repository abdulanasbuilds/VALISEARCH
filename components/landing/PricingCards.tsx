import { Check, Zap, Sparkles, Database } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

const plans = [
  {
    name: "Base Compute",
    price: 0,
    description: "Ideal for testing individual ideas",
    allocation: "6 Execution Tokens",
    features: [
      "6 startup idea analyses",
      "Deploy 12 parallel AI agents",
      "Basic validation pipeline",
      "Standard data resolution",
    ],
    cta: "Initialize Free",
    href: "/register",
    highlight: false,
  },
  {
    name: "Pro Allocation",
    price: 29,
    description: "Engineered for active builders",
    allocation: "100 Execution Tokens",
    features: [
      "100 startup idea analyses",
      "Deep analytical reasoning",
      "Real-time web search",
      "Priority execution queue",
    ],
    cta: "Deploy Pro Engine",
    href: "/register?plan=pro",
    popular: true,
    highlight: true,
  },
  {
    name: "Enterprise Core",
    price: 79,
    description: "High-throughput intelligence",
    allocation: "Unlimited Tokens",
    features: [
      "Unlimited startup analyses",
      "Custom analytical frameworks",
      "White-label reports",
      "Full API & SDK access",
    ],
    cta: "Go Enterprise",
    href: "/register?plan=enterprise",
    highlight: false,
  },
]

export function PricingCards() {
  return (
    <section className="relative overflow-hidden py-24 md:py-32 border-t border-border/40">
      {/* Background Decor */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[800px] h-[500px] bg-primary/5 blur-3xl -z-10 rounded-full" />
      
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="mb-20 text-center max-w-2xl mx-auto">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-semibold text-primary tracking-wider uppercase">
             <Zap className="h-3 w-3" />
             Pricing Architecture
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
            Compute <span className="bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">Allocation.</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Transparent, token-based pricing engineered for high-velocity startup validation.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3 items-stretch">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative flex flex-col rounded-3xl border bg-background/50 backdrop-blur-xl p-8 transition-all duration-500 group ${
                plan.highlight 
                  ? "border-primary/50 shadow-2xl shadow-primary/10 ring-1 ring-primary/20 scale-[1.02]" 
                  : "border-border/40 hover:border-primary/20"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 flex items-center gap-1 rounded-full bg-gradient-to-r from-primary to-purple-600 px-4 py-1 text-[10px] font-bold uppercase tracking-widest text-white shadow-lg">
                   Most Optimized
                </div>
              )}
              
              <div className="mb-8">
                 <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-bold tracking-tight">{plan.name}</h3>
                    {plan.highlight ? <Sparkles className="h-5 w-5 text-primary" /> : <Database className="h-5 w-5 text-muted-foreground/40" />}
                 </div>
                 <p className="text-sm text-muted-foreground leading-snug">{plan.description}</p>
              </div>
              
              <div className="mb-8">
                 <div className="flex items-baseline gap-1 mb-6">
                    <span className="text-5xl font-extrabold tracking-tighter">${plan.price}</span>
                    {plan.price > 0 && <span className="text-lg font-medium text-muted-foreground">/mo</span>}
                 </div>
                 
                 <div className="p-3 rounded-xl bg-muted/30 border border-border/50 flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-background border border-border/50 flex items-center justify-center shadow-inner">
                       <Zap className={`h-4 w-4 ${plan.highlight ? 'text-primary' : 'text-muted-foreground'}`} />
                    </div>
                    <div>
                       <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest leading-none mb-1">Capacity</p>
                       <p className="text-sm font-bold font-mono tracking-tight">{plan.allocation}</p>
                    </div>
                 </div>
              </div>
              
              <ul className="space-y-4 mb-10 flex-1">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                       <Check className="h-3 w-3 text-primary" />
                    </div>
                    <span className="text-sm text-muted-foreground leading-tight group-hover:text-foreground transition-colors">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Link href={plan.href} className="block w-full">
                <Button 
                  className={`w-full h-12 font-bold rounded-xl transition-all duration-300 ${plan.highlight ? "shadow-lg shadow-primary/30" : ""}`} 
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