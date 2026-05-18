import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface OfferSectionProps {
  solution: string
  valueProposition: string
  keyFeatures: string[]
  pricing?: string
}

export function OfferSection({
  solution,
  valueProposition,
  keyFeatures,
  pricing,
}: OfferSectionProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Solution & Offer</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6 rounded-lg bg-primary/5 p-4">
          <p className="text-sm font-medium">Value Proposition</p>
          <p className="mt-1 text-sm">{valueProposition}</p>
        </div>

        <div className="mb-6">
          <p className="mb-2 text-sm font-medium">Solution</p>
          <p className="text-sm">{solution}</p>
        </div>

        {keyFeatures.length > 0 && (
          <div className="mb-6">
            <h4 className="mb-3 text-sm font-semibold">Key Features</h4>
            <div className="flex flex-wrap gap-2">
              {keyFeatures.map((feature, i) => (
                <Badge key={i} variant="secondary">
                  {feature}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {pricing && (
          <div className="rounded-lg border border-primary/20 bg-primary/5 p-3">
            <p className="text-xs text-muted-foreground">Suggested Pricing</p>
            <p className="text-sm font-medium">{pricing}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
