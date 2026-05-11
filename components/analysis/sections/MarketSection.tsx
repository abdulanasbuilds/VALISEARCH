import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SourceCitation } from "@/components/shared/SourceCitation"

interface MarketResearchSectionProps {
  marketSize: {
    tam?: string
    sam?: string
    som?: string
  }
  marketTrends: string[]
  sources: { title: string; url: string; snippet?: string }[]
}

export function MarketSection({
  marketSize,
  marketTrends,
  sources,
}: MarketResearchSectionProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Market Research</CardTitle>
      </CardHeader>
      <CardContent>
        {marketSize.tam || marketSize.sam || marketSize.som ? (
          <div className="mb-6 grid gap-4 md:grid-cols-3">
            {marketSize.tam && (
              <div className="rounded-lg border p-3">
                <p className="text-xs text-muted-foreground">TAM</p>
                <p className="text-lg font-semibold">{marketSize.tam}</p>
              </div>
            )}
            {marketSize.sam && (
              <div className="rounded-lg border p-3">
                <p className="text-xs text-muted-foreground">SAM</p>
                <p className="text-lg font-semibold">{marketSize.sam}</p>
              </div>
            )}
            {marketSize.som && (
              <div className="rounded-lg border p-3">
                <p className="text-xs text-muted-foreground">SOM</p>
                <p className="text-lg font-semibold">{marketSize.som}</p>
              </div>
            )}
          </div>
        ) : null}

        {marketTrends.length > 0 && (
          <div className="mb-6">
            <h4 className="mb-3 text-sm font-semibold">Key Trends</h4>
            <ul className="space-y-2">
              {marketTrends.map((trend, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  {trend}
                </li>
              ))}
            </ul>
          </div>
        )}

        {sources.length > 0 && (
          <div>
            <h4 className="mb-3 text-sm font-semibold">Sources</h4>
            <div className="space-y-2">
              {sources.map((source, i) => (
                <SourceCitation key={i} {...source} />
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}