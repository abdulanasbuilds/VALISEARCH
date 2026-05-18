import { ExternalLink } from "lucide-react"

interface SourceCitationProps {
  title: string
  url: string
  snippet?: string
}

export function SourceCitation({ title, url, snippet }: SourceCitationProps) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="block rounded border border-border p-3 transition-colors hover:bg-muted/50"
    >
      <div className="flex items-start justify-between gap-2">
        <span className="text-sm font-medium line-clamp-1">{title}</span>
        <ExternalLink className="h-4 w-4 shrink-0 text-muted-foreground" />
      </div>
      {snippet && (
        <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{snippet}</p>
      )}
    </a>
  )
}
