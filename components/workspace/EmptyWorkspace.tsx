import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Rocket, ArrowRight } from "lucide-react"
import Link from "next/link"

export function EmptyWorkspace() {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center p-8">
      <Card className="w-full max-w-md">
        <CardContent className="pt-8 pb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Rocket className="h-8 w-8 text-primary" />
          </div>
          <h2 className="mb-2 text-xl font-semibold">No analyses yet</h2>
          <p className="mb-6 text-muted-foreground">
            Start by validating your first startup idea. It only takes 2 minutes.
          </p>
          <Link href="/workspace/new">
            <Button>
              Create Your First Analysis
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}