import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText } from "lucide-react"

interface ContentAsset {
  type: string
  title: string
  purpose: string
  channel: string
}

interface ContentSectionProps {
  contentStrategy: string
  assets: ContentAsset[]
  keyMessages: string[]
}

export function ContentSection({
  contentStrategy,
  assets,
  keyMessages,
}: ContentSectionProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Content Strategy</CardTitle>
      </CardHeader>
      <CardContent>
        {contentStrategy && (
          <div className="mb-6 rounded-lg bg-muted/50 p-4">
            <p className="text-sm">{contentStrategy}</p>
          </div>
        )}

        {keyMessages.length > 0 && (
          <div className="mb-6">
            <h4 className="mb-3 text-sm font-semibold">Key Messages</h4>
            <ul className="space-y-2">
              {keyMessages.map((msg, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
                  {msg}
                </li>
              ))}
            </ul>
          </div>
        )}

        {assets.length > 0 && (
          <div>
            <h4 className="mb-3 text-sm font-semibold">Content Pipeline</h4>
            <div className="space-y-2">
              {assets.map((asset, i) => (
                <div key={i} className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <p className="font-medium">{asset.title}</p>
                    <p className="text-xs text-muted-foreground">{asset.type} - {asset.purpose}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{asset.channel}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
