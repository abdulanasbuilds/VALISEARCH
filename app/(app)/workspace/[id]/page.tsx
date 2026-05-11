import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatRelativeTime } from "@/lib/utils"
import { ArrowLeft, Share2, Download, RefreshCw } from "lucide-react"
import Link from "next/link"
import { OverviewSection } from "@/components/analysis/sections/OverviewSection"
import { ValidationSection } from "@/components/analysis/sections/ValidationSection"
import { SynthesisSection } from "@/components/analysis/sections/SynthesisSection"
import { MarketSection } from "@/components/analysis/sections/MarketSection"
import { ProblemSection } from "@/components/analysis/sections/ProblemSection"
import { OfferSection } from "@/components/analysis/sections/OfferSection"
import { CompetitorSection } from "@/components/analysis/sections/CompetitorSection"
import { GrowthSection } from "@/components/analysis/sections/GrowthSection"
import { DistributionSection } from "@/components/analysis/sections/DistributionSection"
import { ContentSection } from "@/components/analysis/sections/ContentSection"
import { BrandSection } from "@/components/analysis/sections/BrandSection"
import { ScaleSection } from "@/components/analysis/sections/ScaleSection"
import { ProductSection } from "@/components/analysis/sections/ProductSection"

interface Props {
  params: Promise<{ id: string }>
}

export default async function AnalysisDashboardPage({ params }: Props) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { id } = await params

  // Get analysis with idea
  const { data: analysis } = await supabase
    .from("analysis")
    .select(`
      *,
      ideas (idea_text, title)
    `)
    .eq("id", id)
    .eq("user_id", user.id)
    .single()

  if (!analysis) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Card>
          <CardContent className="p-8 text-center">
            <h2 className="mb-2 text-xl font-semibold">Analysis not found</h2>
            <p className="mb-4 text-muted-foreground">
              This analysis doesn't exist or you don't have access.
            </p>
            <Link href="/workspace">
              <Button>Back to Workspace</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  const result = analysis.result_json as any
  const ideaText = analysis.ideas?.idea_text || ""

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="border-b bg-white px-6 py-4">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/workspace">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div>
                <h1 className="text-xl font-bold">
                  {analysis.ideas?.title || ideaText.slice(0, 50) || "Analysis"}
                </h1>
                <p className="text-sm text-muted-foreground">
                  {formatRelativeTime(analysis.created_at)} •{" "}
                  <Badge
                    variant="secondary"
                    className={
                      analysis.status === "completed"
                        ? "bg-green-500 text-white"
                        : analysis.status === "failed"
                        ? "bg-red-500 text-white"
                        : ""
                    }
                  >
                    {analysis.status}
                  </Badge>
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
              <Button variant="outline" size="sm">
                <RefreshCw className="mr-2 h-4 w-4" />
                Re-run
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-6xl p-6">
        {analysis.status === "completed" && result ? (
          <div className="space-y-6">
            {/* Overview */}
            <OverviewSection
              score={result.synthesis?.overall_score ?? analysis.overall_score}
              verdict={result.synthesis?.verdict || "pending"}
              ideaText={ideaText}
            />

            {/* Validation Score */}
            <ValidationSection
              dimensions={result.idea_validator?.dimensions || []}
              strengths={result.idea_validator?.strengths || []}
              weaknesses={result.idea_validator?.weaknesses || []}
            />

            {/* Market Research */}
            <MarketSection
              marketSize={result.market_researcher?.market_size || {}}
              marketTrends={result.market_researcher?.trends || []}
              sources={result.market_researcher?.sources || []}
            />

            {/* Problem & Pain Points */}
            <ProblemSection
              problemStatement={result.problem_prioritizer?.problem_statement || ""}
              painPoints={result.problem_prioritizer?.pain_points || []}
              severity={result.problem_prioritizer?.severity || "medium"}
              targetAudience={result.problem_prioritizer?.target_audience || ""}
            />

            {/* Solution & Offer */}
            <OfferSection
              solution={result.offer_architect?.solution || ""}
              valueProposition={result.offer_architect?.value_proposition || ""}
              keyFeatures={result.offer_architect?.key_features || []}
              pricing={result.offer_architect?.pricing}
            />

            {/* Competitive Landscape */}
            <CompetitorSection
              competitors={result.competitor_intel?.competitors || []}
              marketGaps={result.competitor_intel?.market_gaps || []}
            />

            {/* Growth Strategy */}
            <GrowthSection
              strategies={result.growth_strategist?.strategies || []}
              quickWins={result.growth_strategist?.quick_wins || []}
            />

            {/* Distribution Strategy */}
            <DistributionSection
              channels={result.distribution_planner?.channels || []}
              partnerships={result.distribution_planner?.partnerships || []}
            />

            {/* Content Strategy */}
            <ContentSection
              contentStrategy={result.content_creator?.content_strategy || ""}
              assets={result.content_creator?.content_assets || []}
              keyMessages={result.content_creator?.key_messages || []}
            />

            {/* Brand Identity */}
            <BrandSection
              brandName={result.brand_namer?.brand_name}
              tagline={result.brand_namer?.tagline}
              brandVoice={result.brand_namer?.brand_voice || ""}
              visualIdentity={result.brand_namer?.visual_identity || ""}
              positioning={result.brand_namer?.positioning || ""}
            />

            {/* Scale Roadmap */}
            <ScaleSection
              scalePlan={result.scale_architect?.scale_plan || []}
              challenges={result.scale_architect?.challenges || []}
              resources={result.scale_architect?.resources_needed || []}
            />

            {/* Product Roadmap */}
            <ProductSection
              productName={result.product_manager?.product_name}
              mvpFeatures={result.product_manager?.mvp_features || []}
              roadmap={result.product_manager?.feature_roadmap || []}
              techStack={result.product_manager?.tech_stack}
            />

            {/* Synthesis */}
            <SynthesisSection
              executiveSummary={result.synthesis?.executive_summary || ""}
              topStrengths={result.synthesis?.top_3_strengths || []}
              topRisks={result.synthesis?.top_3_risks || []}
              nextSteps={result.synthesis?.immediate_next_steps || []}
            />
          </div>
        ) : analysis.status === "pending" || analysis.status === "running" ? (
          <div className="py-20 text-center">
            <h2 className="text-xl font-semibold">Analysis in progress...</h2>
            <p className="text-muted-foreground">
              This page will update automatically when complete.
            </p>
          </div>
        ) : (
          <div className="py-20 text-center">
            <h2 className="text-xl font-semibold">Analysis failed</h2>
            <p className="text-muted-foreground">
              Something went wrong. Please try again.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}