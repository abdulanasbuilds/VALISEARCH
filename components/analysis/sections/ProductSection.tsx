import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface ProductSectionProps {
  productName?: string
  mvpFeatures: string[]
  roadmap: { feature: string; priority: string; timeline: string }[]
  techStack?: string[]
}

export function ProductSection({
  productName,
  mvpFeatures,
  roadmap,
  techStack,
}: ProductSectionProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Product Roadmap</CardTitle>
      </CardHeader>
      <CardContent>
        {productName && (
          <div className="mb-6 rounded-lg border border-primary/20 bg-primary/5 p-4">
            <h3 className="font-bold">{productName}</h3>
          </div>
        )}

        {mvpFeatures.length > 0 && (
          <div className="mb-6">
            <h4 className="mb-3 text-sm font-semibold">MVP Features</h4>
            <div className="flex flex-wrap gap-2">
              {mvpFeatures.map((f, i) => (
                <Badge key={i} variant="secondary">
                  {f}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {roadmap.length > 0 && (
          <div className="mb-6">
            <h4 className="mb-3 text-sm font-semibold">Feature Roadmap</h4>
            <div className="space-y-3">
              {roadmap.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <span className="text-sm">{item.feature}</span>
                  <div className="flex gap-2 text-xs">
                    <span className="text-muted-foreground">{item.priority}</span>
                    <span className="text-muted-foreground">{item.timeline}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {techStack && techStack.length > 0 && (
          <div>
            <h4 className="mb-3 text-sm font-semibold">Suggested Tech Stack</h4>
            <div className="flex flex-wrap gap-2">
              {techStack.map((tech, i) => (
                <Badge key={i} variant="outline">
                  {tech}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}