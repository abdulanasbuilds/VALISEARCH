"use client"

export const runtime = "edge"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Folder, ChevronRight, BarChart3, Layout, CheckSquare, MessageSquare, FileText, TrendingUp, GitBranch } from "lucide-react"
import Link from "next/link"

interface Workspace {
  id: string
  name: string
  description: string | null
  industry: string | null
  stage: string
  created_at: string
}

export default function DashboardPage() {
  const supabase = createClient()
  const [workspaces, setWorkspaces] = useState<Workspace[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const [newWorkspace, setNewWorkspace] = useState({ name: "", description: "", industry: "" })

  useEffect(() => {
    loadWorkspaces()
  }, [])

  async function loadWorkspaces() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data: memberships } = await supabase
      .from("workspace_members")
      .select("workspace_id, role, workspaces(*)")
      .eq("user_id", user.id)

    if (memberships) {
      setWorkspaces(memberships.map((m: any) => ({
        ...m.workspaces,
        role: m.role,
      })))
    }
    setLoading(false)
  }

  async function createWorkspace() {
    if (!newWorkspace.name.trim()) return

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data: workspace } = await supabase
      .from("workspaces")
      .insert({
        owner_id: user.id,
        name: newWorkspace.name,
        description: newWorkspace.description || null,
        industry: newWorkspace.industry || null,
      })
      .select()
      .single()

    if (workspace) {
      await supabase.from("workspace_members").insert({
        workspace_id: workspace.id,
        user_id: user.id,
        role: "owner",
      })
      
      setWorkspaces([...workspaces, { ...workspace, role: "owner" }])
      setNewWorkspace({ name: "", description: "", industry: "" })
      setShowCreate(false)
    }
  }

  const stageColors: Record<string, string> = {
    idea: "bg-blue-100 text-blue-700",
    validation: "bg-amber-100 text-amber-700",
    mvp: "bg-purple-100 text-purple-700",
    beta: "bg-orange-100 text-orange-700",
    growth: "bg-green-100 text-green-700",
    scaling: "bg-emerald-100 text-emerald-700",
  }

  const statCards = [
    { icon: Folder, label: "Total Workspaces", value: workspaces.length, color: "text-blue-500" },
    { icon: BarChart3, label: "Active Roadmaps", value: "-", color: "text-purple-500" },
    { icon: CheckSquare, label: "Pending Tasks", value: "-", color: "text-amber-500" },
    { icon: MessageSquare, label: "Chat Sessions", value: "-", color: "text-green-500" },
  ]

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">Manage your startup workspaces</p>
          </div>
          <Button onClick={() => setShowCreate(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Workspace
          </Button>
        </div>

        {/* Stats */}
        <div className="mb-8 grid gap-4 md:grid-cols-4">
          {statCards.map((stat) => (
            <Card key={stat.label}>
              <CardContent className="flex items-center gap-4 p-4">
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mb-8 grid gap-4 md:grid-cols-4">
          <Link href="/dashboard/roadmap">
            <Card className="cursor-pointer transition-colors hover:bg-muted/50">
              <CardContent className="flex items-center gap-4 p-4">
                <Layout className="h-8 w-8 text-purple-500" />
                <span className="font-medium">Roadmaps</span>
              </CardContent>
            </Card>
          </Link>
          <Link href="/dashboard/tasks">
            <Card className="cursor-pointer transition-colors hover:bg-muted/50">
              <CardContent className="flex items-center gap-4 p-4">
                <CheckSquare className="h-8 w-8 text-amber-500" />
                <span className="font-medium">Task Board</span>
              </CardContent>
            </Card>
          </Link>
          <Link href="/dashboard/chat">
            <Card className="cursor-pointer transition-colors hover:bg-muted/50">
              <CardContent className="flex items-center gap-4 p-4">
                <MessageSquare className="h-8 w-8 text-green-500" />
                <span className="font-medium">AI Cofounder</span>
              </CardContent>
            </Card>
          </Link>
          <Link href="/dashboard/compare">
            <Card className="cursor-pointer transition-colors hover:bg-muted/50">
              <CardContent className="flex items-center gap-4 p-4">
                <GitBranch className="h-8 w-8 text-blue-500" />
                <span className="font-medium">Compare Ideas</span>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Workspaces */}
        <Card>
          <CardHeader>
            <CardTitle>Your Workspaces</CardTitle>
          </CardHeader>
          <CardContent>
            {workspaces.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground">
                No workspaces yet. Create your first startup workspace!
              </div>
            ) : (
              <div className="space-y-3">
                {workspaces.map((ws) => (
                  <Link
                    key={ws.id}
                    href={`/workspace/${ws.id}`}
                    className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-muted/50"
                  >
                    <div className="flex items-center gap-4">
                      <Folder className="h-6 w-6 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{ws.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {ws.description || "No description"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className={stageColors[ws.stage] || "bg-gray-100"}>
                        {ws.stage}
                      </Badge>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Create Modal */}
        {showCreate && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle>Create New Workspace</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Workspace Name</label>
                  <input
                    type="text"
                    value={newWorkspace.name}
                    onChange={(e) => setNewWorkspace({ ...newWorkspace, name: e.target.value })}
                    placeholder="My Startup"
                    className="mt-1 w-full rounded-md border p-2"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Description (optional)</label>
                  <textarea
                    value={newWorkspace.description}
                    onChange={(e) => setNewWorkspace({ ...newWorkspace, description: e.target.value })}
                    placeholder="What is your startup about?"
                    className="mt-1 w-full rounded-md border p-2"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Industry (optional)</label>
                  <select
                    value={newWorkspace.industry}
                    onChange={(e) => setNewWorkspace({ ...newWorkspace, industry: e.target.value })}
                    className="mt-1 w-full rounded-md border p-2"
                  >
                    <option value="">Select industry</option>
                    <option value="saas">SaaS</option>
                    <option value="fintech">Fintech</option>
                    <option value="ecommerce">E-commerce</option>
                    <option value="healthtech">HealthTech</option>
                    <option value="edtech">EdTech</option>
                    <option value="ai">AI/ML</option>
                    <option value="marketplace">Marketplace</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setShowCreate(false)}>
                    Cancel
                  </Button>
                  <Button onClick={createWorkspace}>Create</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}