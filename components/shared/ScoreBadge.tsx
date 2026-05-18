import { Badge } from "@/components/ui/badge"
import { SCORE_THRESHOLDS } from "@/lib/constants"

interface ScoreBadgeProps {
  score: number
}

export function ScoreBadge({ score }: ScoreBadgeProps) {
  let colorClass = "bg-gray-500"
  const textClass = "text-white"

  if (score >= SCORE_THRESHOLDS.good) {
    colorClass = "bg-green-500"
  } else if (score >= SCORE_THRESHOLDS.moderate) {
    colorClass = "bg-amber-500"
  } else {
    colorClass = "bg-red-500"
  }

  return (
    <Badge className={`${colorClass} ${textClass}`}>
      {score}/100
    </Badge>
  )
}
