import { Badge } from "@/components/ui/badge"

interface ConfidenceBadgeProps {
  level: "high" | "medium" | "low"
}

export function ConfidenceBadge({ level }: ConfidenceBadgeProps) {
  const config = {
    high: { label: "High Confidence", className: "bg-green-100 text-green-700" },
    medium: { label: "Medium Confidence", className: "bg-amber-100 text-amber-700" },
    low: { label: "Low Confidence", className: "bg-red-100 text-red-700" },
  }

  return (
    <Badge className={config[level].className}>
      {config[level].label}
    </Badge>
  )
}
