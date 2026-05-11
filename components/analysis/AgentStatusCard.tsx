import { Card, CardContent } from "@/components/ui/card"
import { Loader2, CheckCircle2, XCircle, Clock } from "lucide-react"

interface AgentStatusCardProps {
  agentName: string
  description: string
  status: "pending" | "running" | "completed" | "failed"
}

export function AgentStatusCard({ agentName, description, status }: AgentStatusCardProps) {
  const statusConfig = {
    pending: {
      icon: Clock,
      color: "text-muted-foreground",
      bgColor: "bg-muted/30",
    },
    running: {
      icon: Loader2,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    completed: {
      icon: CheckCircle2,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    failed: {
      icon: XCircle,
      color: "text-red-500",
      bgColor: "bg-red-500/10",
    },
  }

  const config = statusConfig[status]
  const Icon = config.icon

  return (
    <Card className={`${config.bgColor} border-0`}>
      <CardContent className="flex items-center gap-3 p-3">
        <Icon className={`h-5 w-5 shrink-0 ${config.color} ${status === "running" ? "animate-spin" : ""}`} />
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">{agentName}</p>
          <p className="truncate text-xs text-muted-foreground">{description}</p>
        </div>
      </CardContent>
    </Card>
  )
}