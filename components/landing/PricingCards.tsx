import { Check } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { PLANS } from "@/lib/constants"

const plans = [
  {
    name: "Free",
    price: 0,
    description: "Perfect for trying things out",
    features: [
      "6 credits/month",
      "Full 12-agent analysis",
      "Export as text",
      "Community support",
    ],
    cta: "Get Started",
    href: "/register",
  },
  {
    name: "Pro",
    price: 29,
    description: "For serious founders building",
    features: [
      "100 credits/month",
      "Full 12-agent analysis",
      "Deep analysis with web search",
      "Priority support",
      "Export all formats",
    ],
    cta: "Start Pro Trial",
    href: "/register?plan=pro",
    popular: true,
  },
  {
    name: "Premium",
    price: 79,
    description: "For scaling teams",
    features: [
      "Unlimited credits",
      "Full 12-agent analysis",
      "Deep analysis with web search",
      "Priority support",
      "Export all formats",
      "API access (coming soon)",
      "Custom agents (coming soon)",
    ],
    cta: "Contact Sales",
    href: "mailto:hello@valisearch.ai",
  },
]

export function PricingCards() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight">Simple, Transparent Pricing</h2>
          <p className="mt-4 text-muted-foreground">
            Start free, upgrade when you're ready
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {plans.map((plan, index) => (
            <Card
              key={index}
              className={`relative ${plan.popular ? "border-primary shadow-lg" : ""}`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="rounded-full bg-primary px-3 py-1 text-xs font-medium text-white">
                    Most Popular
                  </span>
                </div>
              )}
              <CardHeader>
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <span className="text-4xl font-bold">${plan.price}</span>
                  {plan.price > 0 && <span className="text-muted-foreground">/month</span>}
                </div>
                <ul className="space-y-3">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-green-600" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Link href={plan.href} className="w-full">
                  <Button className="w-full" variant={plan.popular ? "default" : "outline"}>
                    {plan.cta}
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>

        <p className="mt-8 text-center text-sm text-muted-foreground">
          All plans include our 30-day money-back guarantee
        </p>
      </div>
    </section>
  )
}