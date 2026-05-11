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
    <div className="p-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Your Workspace</h1>
          <p className="text-muted-foreground">
            {analyses?.length ?? 0} analysis{analyses?.length === 1 ? "" : "es"}
          </p>
        </div>
        <Link href="/workspace/new">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            New Analysis
          </Button>
        </Link>
      </div>

      <IdeaInputBox />

      {analyses && analyses.length > 0 ? (
        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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