import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Palette } from "lucide-react"

interface BrandSectionProps {
  brandName?: string
  tagline?: string
  brandVoice: string
  visualIdentity: string
  positioning: string
}

export function BrandSection({
  brandName,
  tagline,
  brandVoice,
  visualIdentity,
  positioning,
}: BrandSectionProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Brand Identity</CardTitle>
      </CardHeader>
      <CardContent>
        {(brandName || tagline) && (
          <div className="mb-6 rounded-lg border border-primary/20 bg-primary/5 p-4">
            {brandName && (
              <h3 className="text-xl font-bold">{brandName}</h3>
            )}
            {tagline && (
              <p className="text-sm text-muted-foreground">{tagline}</p>
            )}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <p className="mb-1 text-xs text-muted-foreground">Positioning</p>
            <p className="text-sm">{positioning}</p>
          </div>
          <div>
            <p className="mb-1 text-xs text-muted-foreground">Brand Voice</p>
            <p className="text-sm">{brandVoice}</p>
          </div>
          <div>
            <p className="mb-1 text-xs text-muted-foreground">Visual Identity</p>
            <p className="text-sm">{visualIdentity}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}