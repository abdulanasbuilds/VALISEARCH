export const runtime = "edge"

import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { PlusCircle, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AnalysisCard } from "@/components/workspace/AnalysisCard"
import { EmptyWorkspace } from "@/components/workspace/EmptyWorkspace"
import { IdeaInputBox } from "@/components/workspace/IdeaInputBox"

export default async function WorkspacePage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return <EmptyWorkspace />
  }

  // Get user's analyses
  const { data: analyses } = await supabase
    .from("analysis")
    .select(`
      id,
      status,
      overall_score,
      credits_used,
      created_at,
      ideas (
        idea_text,
        title
      )
    `)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(20)

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-10 flex items-center justify-between border-b border-border/40 pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Active Workspaces</h1>
          <p className="text-muted-foreground mt-1">
            Manage your deterministic startup viability analyses. ({analyses?.length ?? 0} total)
          </p>
        </div>
        <Link href="/workspace/new">
          <Button className="shadow-lg shadow-primary/20">
            <PlusCircle className="mr-2 h-4 w-4" />
            Initialize Engine
          </Button>
        </Link>
      </div>

      <IdeaInputBox />

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold tracking-tight">Execution History</h2>
      </div>

      {analyses && analyses.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {analyses.map((analysis: any) => (
            <Link key={analysis.id} href={`/workspace/${analysis.id}`}>
              <AnalysisCard
                id={analysis.id}
                title={analysis.ideas?.title || analysis.ideas?.idea_text?.slice(0, 50) || "Untitled"}
                ideaText={analysis.ideas?.idea_text || ""}
                score={analysis.overall_score}
                status={analysis.status}
                createdAt={analysis.created_at}
              />
            </Link>
          ))}
        </div>
      ) : (
        <EmptyWorkspace />
      )}
    </div>
  )
}