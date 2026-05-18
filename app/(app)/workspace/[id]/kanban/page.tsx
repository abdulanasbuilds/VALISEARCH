"use client"

import { use, useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { 
  Kanban, 
  Plus, 
  Trash2, 
  Clock, 
  ArrowRight,
  Sparkles,
  User,
  CheckCircle2,
  AlertCircle
} from "lucide-react"

interface Props {
  params: Promise<{ id: string }>
}

interface Task {
  id: string
  title: string
  description: string
  priority: "high" | "medium" | "low"
  status: "todo" | "in_progress" | "done"
  category: string
  created_at: string
}

export default function KanbanBoardPage({ params }: Props) {
  const { id } = use(params)
  const supabase = createClient()

  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  
  // Form State
  const [showAddForm, setShowAddForm] = useState(false)
  const [newTaskTitle, setNewTaskTitle] = useState("")
  const [newTaskDesc, setNewTaskDesc] = useState("")
  const [newTaskPriority, setNewTaskPriority] = useState<"high" | "medium" | "low">("medium")
  const [newTaskCategory, setNewTaskCategory] = useState("product")

  useEffect(() => {
    async function initWorkspaceAndLoadTasks() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        // 1. Get analysis info to populate the workspace record
        const { data: analysis } = await supabase
          .from("analysis")
          .select("*, ideas(title, idea_text)")
          .eq("id", id)
          .single()

        if (!analysis) return

        // 2. Ensure the workspace record exists in the workspaces table
        const { data: existingWorkspace } = await supabase
          .from("workspaces")
          .select("id")
          .eq("id", id)
          .maybeSingle()

        if (!existingWorkspace) {
          await supabase
            .from("workspaces")
            .insert({
              id: id,
              owner_id: user.id,
              name: analysis.ideas?.title || "My Startup Workspace",
              description: analysis.ideas?.idea_text || "",
              stage: "idea"
            })
        }

        // 3. Load tasks from database
        const { data: dbTasks } = await supabase
          .from("tasks")
          .select("*")
          .eq("workspace_id", id)
          .order("created_at", { ascending: true })

        if (dbTasks && dbTasks.length > 0) {
          setTasks(dbTasks as Task[])
        } else {
          // Populate default tasks if database is empty to prevent dead empty screens
          const defaultTasks: Omit<Task, "id" | "created_at">[] = [
            {
              title: "Draft 48-Hour Validation landing page",
              description: "Build a sleek CTA landing page with basic email subscription triggers.",
              priority: "high",
              status: "todo",
              category: "product"
            },
            {
              title: "Scrape direct competitor pricing parameters",
              description: "Audit pricing tables from ValidatorAI and IdeaBuddy to adjust monetization models.",
              priority: "medium",
              status: "in_progress",
              category: "market"
            },
            {
              title: "Examine TAM opportunity gaps",
              description: "Validate sizing matrices across unserved micro-SaaS developers.",
              priority: "low",
              status: "done",
              category: "market"
            }
          ]

          // Insert defaults
          const inserts = defaultTasks.map(t => ({
            ...t,
            workspace_id: id
          }))

          const { data: insertedTasks } = await supabase
            .from("tasks")
            .insert(inserts)
            .select()

          if (insertedTasks) {
            setTasks(insertedTasks as Task[])
          }
        }
      } catch (err) {
        console.error("Error loading tasks:", err)
      } finally {
        setLoading(false)
      }
    }

    initWorkspaceAndLoadTasks()
  }, [id])

  // Move task status
  async function moveTask(taskId: string, currentStatus: "todo" | "in_progress" | "done", direction: "forward" | "backward") {
    let nextStatus: "todo" | "in_progress" | "done"
    
    if (direction === "forward") {
      nextStatus = currentStatus === "todo" ? "in_progress" : "done"
    } else {
      nextStatus = currentStatus === "done" ? "in_progress" : "todo"
    }

    // Optimistic Update
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: nextStatus } : t))

    try {
      await supabase
        .from("tasks")
        .update({ status: nextStatus })
        .eq("id", taskId)
    } catch (err) {
      console.error("Error updating task status:", err)
    }
  }

  // Create Task
  async function handleAddTask(e: React.FormEvent) {
    e.preventDefault()
    if (!newTaskTitle) return

    try {
      const { data: createdTask } = await supabase
        .from("tasks")
        .insert({
          workspace_id: id,
          title: newTaskTitle,
          description: newTaskDesc,
          priority: newTaskPriority,
          status: "todo",
          category: newTaskCategory
        })
        .select()
        .single()

      if (createdTask) {
        setTasks(prev => [...prev, createdTask as Task])
      }

      setNewTaskTitle("")
      setNewTaskDesc("")
      setShowAddForm(false)
    } catch (err) {
      console.error("Error creating task:", err)
    }
  }

  // Delete Task
  async function handleDeleteTask(taskId: string) {
    // Optimistic Update
    setTasks(prev => prev.filter(t => t.id !== taskId))

    try {
      await supabase
        .from("tasks")
        .delete()
        .eq("id", taskId)
    } catch (err) {
      console.error("Error deleting task:", err)
    }
  }

  const columns: { title: string; status: "todo" | "in_progress" | "done" }[] = [
    { title: "To Do", status: "todo" },
    { title: "In Progress", status: "in_progress" },
    { title: "Completed", status: "done" }
  ]

  if (loading) {
    return (
      <div className="py-20 text-center space-y-4">
        <div className="h-8 w-8 rounded-full border-4 border-primary border-t-transparent animate-spin mx-auto" />
        <span className="text-xs font-mono text-muted-foreground uppercase tracking-widest">Hydrating Kanban Board...</span>
      </div>
    )
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/40 pb-6">
        <div>
          <Badge variant="outline" className="border-primary/20 bg-primary/5 text-primary text-[10px] font-mono tracking-wider uppercase mb-1">
            Execution Kanban Board
          </Badge>
          <h1 className="text-3xl font-bold tracking-tight">Task Workspace</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Manage startup execution items, assign tasks, and track validation pipelines.
          </p>
        </div>

        <Button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="shadow-lg shadow-primary/20 h-9 font-semibold flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Execution Task
        </Button>
      </div>

      {/* Quick Add Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form 
            onSubmit={handleAddTask} 
            className="bg-background border border-border/60 rounded-2xl w-full max-w-md shadow-2xl p-6 space-y-4"
          >
            <div className="flex justify-between items-center pb-2 border-b border-border/40">
              <h3 className="text-sm font-bold text-foreground">Add Startup Task</h3>
              <Button type="button" variant="ghost" size="sm" onClick={() => setShowAddForm(false)}>Cancel</Button>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-mono uppercase text-muted-foreground font-bold">Task Title</label>
              <input
                required
                type="text"
                placeholder="e.g. Set up payment sandbox checkout"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                className="w-full h-10 px-3 rounded-lg border border-border bg-background text-xs focus:outline-none focus:border-primary"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-mono uppercase text-muted-foreground font-bold">Description</label>
              <textarea
                rows={3}
                placeholder="Detail task requirements..."
                value={newTaskDesc}
                onChange={(e) => setNewTaskDesc(e.target.value)}
                className="w-full p-3 rounded-lg border border-border bg-background text-xs focus:outline-none focus:border-primary resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase text-muted-foreground font-bold">Priority</label>
                <select
                  value={newTaskPriority}
                  onChange={(e) => setNewTaskPriority(e.target.value as any)}
                  className="w-full h-10 px-2 rounded-lg border border-border bg-background text-xs focus:outline-none"
                >
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase text-muted-foreground font-bold">Category</label>
                <select
                  value={newTaskCategory}
                  onChange={(e) => setNewTaskCategory(e.target.value)}
                  className="w-full h-10 px-2 rounded-lg border border-border bg-background text-xs focus:outline-none"
                >
                  <option value="product">Product</option>
                  <option value="market">Market</option>
                  <option value="growth">Growth</option>
                </select>
              </div>
            </div>

            <Button type="submit" className="w-full h-11 font-semibold mt-4">
              Create Task
            </Button>
          </form>
        </div>
      )}

      {/* Kanban Board Grid */}
      <div className="grid md:grid-cols-3 gap-6 items-start">
        {columns.map((col) => {
          const colTasks = tasks.filter(t => t.status === col.status)
          
          return (
            <div key={col.status} className="border border-border/50 bg-muted/5 rounded-2xl p-4 space-y-4">
              <div className="flex justify-between items-center border-b border-border/40 pb-2">
                <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-foreground flex items-center gap-1.5">
                  <div className={`h-2 w-2 rounded-full ${
                    col.status === "todo" ? "bg-amber-500" : col.status === "in_progress" ? "bg-primary" : "bg-green-500"
                  }`} />
                  {col.title}
                </h3>
                <Badge variant="secondary" className="text-[10px] font-mono leading-none">
                  {colTasks.length}
                </Badge>
              </div>

              <div className="space-y-3 min-h-[300px]">
                {colTasks.map((task) => (
                  <div 
                    key={task.id}
                    className="surface-card border border-border/50 rounded-xl p-4 shadow-sm hover:border-primary/30 transition-colors flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-[9px] font-mono uppercase font-bold text-primary tracking-widest">{task.category}</span>
                        <Badge className={`rounded text-[8px] font-mono uppercase ${
                          task.priority === "high" ? "bg-red-500/10 text-red-500 border-red-500/20" : task.priority === "medium" ? "bg-primary/10 text-primary border-primary/20" : "bg-muted text-muted-foreground border-transparent"
                        }`}>
                          {task.priority}
                        </Badge>
                      </div>
                      <h4 className="text-xs font-bold text-foreground leading-snug">{task.title}</h4>
                      <p className="text-[11px] text-muted-foreground leading-relaxed">{task.description}</p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-border/30 flex justify-between items-center">
                      <button 
                        onClick={() => handleDeleteTask(task.id)}
                        className="text-muted-foreground hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>

                      <div className="flex gap-1.5">
                        {col.status !== "todo" && (
                          <Button 
                            size="icon" 
                            variant="ghost" 
                            className="h-6 w-6 border border-border"
                            onClick={() => moveTask(task.id, col.status, "backward")}
                          >
                            ←
                          </Button>
                        )}
                        {col.status !== "done" && (
                          <Button 
                            size="icon" 
                            variant="ghost" 
                            className="h-6 w-6 border border-border"
                            onClick={() => moveTask(task.id, col.status, "forward")}
                          >
                            →
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {colTasks.length === 0 && (
                  <div className="py-12 border-2 border-dashed border-border/40 rounded-xl flex flex-col items-center justify-center text-center p-4">
                    <AlertCircle className="h-5 w-5 text-muted-foreground opacity-60 mb-2" />
                    <span className="text-[10px] font-mono text-muted-foreground uppercase">Column Empty</span>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

    </div>
  )
}
