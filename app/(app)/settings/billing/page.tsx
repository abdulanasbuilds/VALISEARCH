export const runtime = "edge"

import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CreditCard, Zap, Crown, ArrowRight } from "lucide-react"
import Link from "next/link"

export default async function BillingPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const [creditData, subscriptionData] = await Promise.all([
    supabase.from("credits").select("balance").eq("user_id", user.id).single(),
    supabase.from("subscriptions").select("*").eq("user_id", user.id).single(),
  ])

  const credits = creditData?.data?.balance ?? 0
  const subscription = subscriptionData?.data

  const planInfo = subscription
    ? subscription.plan_id === 1
      ? { name: "Pro", credits: "100/month", icon: Zap }
      : subscription.plan_id === 2
      ? { name: "Premium", credits: "Unlimited", icon: Crown }
      : { name: "Free", credits: "6", icon: CreditCard }
    : { name: "Free", credits: "6", icon: CreditCard }

  const PlanIcon = planInfo.icon

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <h1 className="mb-8 text-2xl font-bold">Billing & Credits</h1>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Credit Balance
            </CardTitle>
            <CardDescription>Your available analysis credits</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4 text-4xl font-bold">{credits}</div>
            <p className="text-sm text-muted-foreground">
              {credits === 0
                ? "No credits remaining"
                : credits === 1
                ? "1 analysis remaining"
                : `${credits} analyses remaining`}
            </p>
            {credits < 5 && (
              <Link href="/pricing" className="mt-4 block">
                <Button size="sm">
                  Add Credits <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PlanIcon className="h-5 w-5" />
              Current Plan
            </CardTitle>
            <CardDescription>Your subscription status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4 flex items-center gap-2">
              <span className="text-2xl font-bold">{planInfo.name}</span>
              <Badge variant={subscription?.status === "active" ? "default" : "secondary"}>
                {subscription?.status || "free"}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              {planInfo.credits} per month
            </p>
            <Link href="/pricing" className="mt-4 block">
              <Button variant="outline" size="sm">
                {subscription ? "Change Plan" : "Upgrade"}
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {subscription && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Subscription Details</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-sm text-muted-foreground">Subscription ID</dt>
                <dd className="font-mono text-sm">{subscription.ls_subscription_id}</dd>
              </div>
              <div>
                <dt className="text-sm text-muted-foreground">Status</dt>
                <dd className="text-sm">{subscription.status}</dd>
              </div>
              {subscription.current_period_end && (
                <div>
                  <dt className="text-sm text-muted-foreground">Next billing</dt>
                  <dd className="text-sm">
                    {new Date(subscription.current_period_end).toLocaleDateString()}
                  </dd>
                </div>
              )}
            </dl>
          </CardContent>
        </Card>
      )}

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Credit History</CardTitle>
          <CardDescription>Your recent credit transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <TransactionList userId={user.id} />
        </CardContent>
      </Card>
    </div>
  )
}

async function TransactionList({ userId }: { userId: string }) {
  const supabase = await createClient()

  const { data: transactions } = await supabase
    .from("credit_transactions")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(10)

  if (!transactions || transactions.length === 0) {
    return <p className="text-sm text-muted-foreground">No transactions yet</p>
  }

  return (
    <div className="space-y-3">
      {transactions.map((tx) => (
        <div key={tx.id} className="flex items-center justify-between rounded-lg border p-3">
          <div>
            <p className="text-sm font-medium">{tx.description}</p>
            <p className="text-xs text-muted-foreground">
              {new Date(tx.created_at).toLocaleDateString()}
            </p>
          </div>
          <span
            className={`font-medium ${tx.amount > 0 ? "text-green-600" : "text-red-600"}`}
          >
            {tx.amount > 0 ? "+" : ""}{tx.amount}
          </span>
        </div>
      ))}
    </div>
  )
}