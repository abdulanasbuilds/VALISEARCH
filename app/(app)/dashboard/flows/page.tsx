"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Plus, GitBranch, Users, ArrowRight, Layout, Network } from "lucide-react"
import Link from "next/link"

interface Flow {
  id: string
  title: string
  flow_type: string
  created_at: string
}

const flowTypeColors: Record<string, string> = {
  user_journey: "bg-blue-100 text-blue-700",
  product_flow: "bg-purple-100 text-purple-700",
  growth_funnel: "bg-green-100 text-green-700",
  lifecycle: "bg-amber-100 text-amber-700",
}

const flowTypeLabels: Record<string, string> = {
  user_journey: "User Journey",
  product_flow: "Product Flow",
  growth_funnel: "Growth Funnel",
  lifecycle: "Lifecycle",
}

export default function FlowsPage() {
  const supabase = createClient()
  const [flows, setFlows] = useState<Flow[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const [newFlow, setNewFlow] = useState({ title: "", flow_type: "user_journey" })
  const [workspaceId, setWorkspaceId] = useState<string | null>(null)

  useEffect(() => {
    loadInitialData()
  }, [])

  async function loadInitialData() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data: memberships } = await supabase
      .from("workspace_members")
      .select("workspace_id")
      .eq("user_id", user.id)
      .limit(1)
      .single()

    if (memberships?.workspace_id) {
      setWorkspaceId(memberships.workspace_id)
      loadFlows(memberships.workspace_id)
    } else {
      setLoading(false)
    }
  }

  async function loadFlows(wsId: string) {
    const { data: flowData } = await supabase
      .from("startup_flows")
      .select("*")
      .eq("workspace_id", wsId)
      .order("created_at", { ascending: false })

    if (flowData) {
      setFlows(flowData)
    }
    setLoading(false)
  }

  async function createFlow() {
    if (!newFlow.title.trim() || !workspaceId) return

    const { data: flow } = await supabase
      .from("startup_flows")
      .insert({
        workspace_id: workspaceId,
        title: newFlow.title,
        flow_type: newFlow.flow_type,
      })
      .select()
      .single()

    if (flow) {
      setFlows([flow, ...flows])
      setNewFlow({ title: "", flow_type: "user_journey" })
      setShowCreate(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    )
  }

  if (!workspaceId) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="mx-auto max-w-7xl">
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">Create a workspace first to use visual flows.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Visual Flows</h1>
            <p className="text-muted-foreground">Create and manage startup workflows</p>
          </div>
          <Button onClick={() => setShowCreate(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create Flow
          </Button>
        </div>

        {flows.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Network className="mx-auto mb-4 h-12 w-12 text-muted-foreground/50" />
              <p className="text-muted-foreground mb-4">No flows created yet</p>
              <Button onClick={() => setShowCreate(true)}>Create Your First Flow</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {flows.map((flow) => (
              <Card key={flow.id} className="transition-colors hover:bg-muted/50">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <Badge className={flowTypeColors[flow.flow_type] || "bg-gray-100"}>
                      {flowTypeLabels[flow.flow_type] || flow.flow_type}
                    </Badge>
                  </div>
                  <CardTitle className="mt-2 text-lg">{flow.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Created {new Date(flow.created_at).toLocaleDateString()}
                    </span>
                    <Link href={`/dashboard/flows/${flow.id}`}>
                      <Button variant="ghost" size="sm">
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Quick Start Templates */}
        <div className="mt-8">
          <h2 className="mb-4 text-lg font-semibold">Quick Start Templates</h2>
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="cursor-pointer transition-colors hover:bg-muted/50" onClick={() => { setNewFlow({ title: "User Signup Flow", flow_type: "user_journey" }); setShowCreate(true) }}>
              <CardContent className="flex items-center gap-4 p-4">
                <Users className="h-8 w-8 text-blue-500" />
                <div>
                  <p className="font-medium">User Journey</p>
                  <p className="text-sm text-muted-foreground">Map user signup flow</p>
                </div>
              </CardContent>
            </Card>
            <Card className="cursor-pointer transition-colors hover:bg-muted/50" onClick={() => { setNewFlow({ title: "Product Roadmap", flow_type: "product_flow" }); setShowCreate(true) }}>
              <CardContent className="flex items-center gap-4 p-4">
                <Layout className="h-8 w-8 text-purple-500" />
                <div>
                  <p className="font-medium">Product Flow</p>
                  <p className="text-sm text-muted-foreground">Design product flow</p>
                </div>
              </CardContent>
            </Card>
            <Card className="cursor-pointer transition-colors hover:bg-muted/50" onClick={() => { setNewFlow({ title: "Growth Pipeline", flow_type: "growth_funnel" }); setShowCreate(true) }}>
              <CardContent className="flex items-center gap-4 p-4">
                <GitBranch className="h-8 w-8 text-green-500" />
                <div>
                  <p className="font-medium">Growth Funnel</p>
                  <p className="text-sm text-muted-foreground">Build conversion funnel</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Create Modal */}
        {showCreate && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle>Create New Flow</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Flow Title</label>
                  <Input
                    value={newFlow.title}
                    onChange={(e) => setNewFlow({ ...newFlow, title: e.target.value })}
                    placeholder="My startup flow"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Flow Type</label>
                  <select
                    value={newFlow.flow_type}
                    onChange={(e) => setNewFlow({ ...newFlow, flow_type: e.target.value })}
                    className="w-full rounded-md border p-2"
                  >
                    <option value="user_journey">User Journey</option>
                    <option value="product_flow">Product Flow</option>
                    <option value="growth_funnel">Growth Funnel</option>
                    <option value="lifecycle">Lifecycle</option>
                  </select>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setShowCreate(false)}>Cancel</Button>
                  <Button onClick={createFlow}>Create</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
