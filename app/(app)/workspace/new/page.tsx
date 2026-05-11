import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { AnalysisProgress } from "@/components/analysis/AnalysisProgress"

interface Props {
  params: Promise<{ id: string }>
}

export default async function NewAnalysisPage({ params }: Props) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { id } = await params

  return <AnalysisProgress analysisId={id} />
}