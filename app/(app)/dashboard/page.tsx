"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Plus, 
  Folder, 
  ChevronRight, 
  BarChart3, 
  Layout, 
  CheckSquare, 
  MessageSquare, 
  Sparkles, 
  TrendingUp, 
  Activity, 
  Layers,
  Zap,
  Briefcase
} from "lucide-react"
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

    // Query workspaces where user is a member
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
      
      setWorkspaces(prev => [...prev, { ...workspace, role: "owner" }])
      setNewWorkspace({ name: "", description: "", industry: "" })
      setShowCreate(false)
    }
  }

  const stageColors: Record<string, string> = {
    idea: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    validation: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    mvp: "bg-purple-500/10 text-purple-500 border-purple-500/20",
    growth: "bg-green-500/10 text-green-500 border-green-500/20",
  }

  if (loading) {
    return (
      <div className="py-24 text-center space-y-4">
        <div className="h-8 w-8 rounded-full border-4 border-primary border-t-transparent animate-spin mx-auto" />
        <span className="text-xs font-mono text-muted-foreground uppercase tracking-widest">Hydrating Control Center...</span>
      </div>
    )
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto py-6">
      
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/40 pb-6">
        <div>
          <Badge variant="outline" className="border-primary/20 bg-primary/5 text-primary text-[10px] font-mono tracking-wider uppercase mb-1.5">
             Startup Command Center
          </Badge>
          <h1 className="text-3xl font-bold tracking-tight">Launcher</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Access startup workspace modules, create new ideas, and execute validations.
          </p>
        </div>

        <Button 
          onClick={() => setShowCreate(true)}
          className="shadow-lg shadow-primary/20 h-9 font-semibold flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          New Workspace
        </Button>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        
        {/* Total Workspaces */}
        <div className="surface-card border border-border/50 p-5 rounded-xl shadow-sm flex items-center gap-4">
          <div className="h-10 w-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
            <Folder className="h-5 w-5 text-primary" />
          </div>
          <div>
            <span className="text-[10px] font-mono text-muted-foreground uppercase font-bold tracking-widest leading-none">Workspaces</span>
            <p className="text-2xl font-black tracking-tight text-foreground mt-1">{workspaces.length}</p>
          </div>
        </div>

        {/* Health viabilities */}
        <div className="surface-card border border-border/50 p-5 rounded-xl shadow-sm flex items-center gap-4">
          <div className="h-10 w-10 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-center shrink-0">
            <Activity className="h-5 w-5 text-green-500" />
          </div>
          <div>
            <span className="text-[10px] font-mono text-muted-foreground uppercase font-bold tracking-widest leading-none">Health Rating</span>
            <p className="text-2xl font-black tracking-tight text-foreground mt-1">82%</p>
          </div>
        </div>

        {/* Roadmap Progress */}
        <div className="surface-card border border-border/50 p-5 rounded-xl shadow-sm flex items-center gap-4">
          <div className="h-10 w-10 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center shrink-0">
            <Layers className="h-5 w-5 text-purple-500" />
          </div>
          <div>
            <span className="text-[10px] font-mono text-muted-foreground uppercase font-bold tracking-widest leading-none">Roadmap Progress</span>
            <p className="text-2xl font-black tracking-tight text-foreground mt-1">Phase 1</p>
          </div>
        </div>

        {/* Tasks remaining */}
        <div className="surface-card border border-border/50 p-5 rounded-xl shadow-sm flex items-center gap-4">
          <div className="h-10 w-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
            <CheckSquare className="h-5 w-5 text-amber-500" />
          </div>
          <div>
            <span className="text-[10px] font-mono text-muted-foreground uppercase font-bold tracking-widest leading-none">Sprints Board</span>
            <p className="text-2xl font-black tracking-tight text-foreground mt-1">Active</p>
          </div>
        </div>

      </div>

      {/* Main Content: Workspaces Launcher list */}
      <div className="grid lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Workspaces List (8 Columns) */}
        <div className="lg:col-span-8 space-y-6">
          <Card className="border border-border/50 shadow-sm rounded-2xl overflow-hidden bg-background">
            <CardHeader className="border-b border-border/40 bg-muted/5 py-4">
              <CardTitle className="text-sm font-bold text-foreground">Launch Workspace</CardTitle>
              <CardDescription className="text-xs">Click on any workspace below to access full analytics child modules.</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              {workspaces.length === 0 ? (
                <div className="py-12 border-2 border-dashed border-border/40 rounded-xl flex flex-col items-center justify-center text-center p-6 space-y-3">
                  <Briefcase className="h-8 w-8 text-muted-foreground opacity-60" />
                  <h4 className="text-xs font-bold text-foreground">No startup workspaces created yet</h4>
                  <p className="text-[11px] text-muted-foreground max-w-sm leading-relaxed">
                    Create a workspace from the top-right button, or validate a new idea on the homepage.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {workspaces.map((ws) => (
                    <Link
                      key={ws.id}
                      href={`/workspace/${ws.id}/dashboard`}
                      className="flex items-center justify-between rounded-xl border border-border/50 p-4 transition-colors hover:border-primary bg-muted/5 hover:bg-muted/10"
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-lg bg-primary/5 border border-primary/10 flex items-center justify-center text-primary font-black text-sm shrink-0">
                          {ws.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-foreground leading-snug">{ws.name}</p>
                          <p className="text-[10px] text-muted-foreground mt-0.5 line-clamp-1">
                            {ws.description || "No description provided."}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className={`rounded text-[9px] font-mono leading-none capitalize ${stageColors[ws.stage] || "bg-muted"}`}>
                          {ws.stage}
                        </Badge>
                        <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: AI Suggestions & Quick links (4 Columns) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Quick Idea Creation Link */}
          <div className="surface-card border border-primary/20 bg-primary/5 rounded-2xl p-6 shadow-sm relative overflow-hidden flex flex-col justify-between min-h-[180px]">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-[85px] rounded-full -z-10" />
            
            <div className="space-y-1.5">
              <span className="text-[10px] font-mono text-primary font-bold uppercase tracking-widest leading-none mb-1 block">Quick Start</span>
              <h4 className="text-sm font-bold text-foreground">Need to validate a new concept?</h4>
              <p className="text-[11px] text-muted-foreground leading-relaxed mt-1">
                Trigger our 12-parallel agent validation orchestrator to gather sizing and competitive data immediately.
              </p>
            </div>

            <Link href="/" className="mt-5 block w-full">
              <Button size="sm" className="w-full h-10 font-semibold shadow-lg shadow-primary/20 bg-primary hover:bg-primary/95 text-white flex items-center gap-1.5">
                <Zap className="h-4 w-4" />
                Validate Startup Idea
              </Button>
            </Link>
          </div>

        </div>

      </div>

      {/* Creation Modal Form */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 backdrop-blur-sm p-4">
          <form 
            onSubmit={(e) => { e.preventDefault(); createWorkspace(); }}
            className="bg-background border border-border/60 rounded-2xl w-full max-w-md shadow-2xl p-6 space-y-4"
          >
            <div className="flex justify-between items-center pb-2 border-b border-border/40">
              <h3 className="text-sm font-bold text-foreground">New Startup Workspace</h3>
              <Button type="button" variant="ghost" size="sm" onClick={() => setShowCreate(false)}>Cancel</Button>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-mono uppercase text-muted-foreground font-bold">Workspace Title</label>
              <input
                required
                type="text"
                value={newWorkspace.name}
                onChange={(e) => setNewWorkspace({ ...newWorkspace, name: e.target.value })}
                placeholder="e.g. CarbonStream AI"
                className="w-full h-10 px-3 rounded-lg border border-border bg-background text-xs focus:outline-none focus:border-primary"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-mono uppercase text-muted-foreground font-bold">Description</label>
              <textarea
                value={newWorkspace.description}
                onChange={(e) => setNewWorkspace({ ...newWorkspace, description: e.target.value })}
                placeholder="What is your startup concept about?"
                className="w-full p-3 rounded-lg border border-border bg-background text-xs focus:outline-none focus:border-primary resize-none"
                rows={3}
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-mono uppercase text-muted-foreground font-bold">Industry Sector</label>
              <select
                value={newWorkspace.industry}
                onChange={(e) => setNewWorkspace({ ...newWorkspace, industry: e.target.value })}
                className="w-full h-10 px-2 rounded-lg border border-border bg-background text-xs focus:outline-none focus:border-primary"
              >
                <option value="">Select industry</option>
                <option value="saas">SaaS / Cloud</option>
                <option value="ai">AI / ML Operations</option>
                <option value="fintech">Fintech</option>
                <option value="healthtech">Healthtech</option>
                <option value="marketplace">Marketplace</option>
                <option value="ecommerce">E-Commerce</option>
              </select>
            </div>

            <Button type="submit" className="w-full h-11 font-semibold mt-4">
              Initialize Workspace
            </Button>
          </form>
        </div>
      )}

    </div>
  )
}
