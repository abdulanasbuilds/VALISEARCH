"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Plus, X, GripVertical } from "lucide-react"

interface Task {
  id: string
  title: string
  description: string | null
  category: string
  priority: string
  status: string
}

const categories = ["product", "research", "branding", "marketing", "validation", "operations", "monetization"]
const priorities = ["low", "medium", "high", "urgent"]

const priorityColors: Record<string, string> = {
  low: "bg-gray-100 text-gray-700",
  medium: "bg-blue-100 text-blue-700",
  high: "bg-amber-100 text-amber-700",
  urgent: "bg-red-100 text-red-700",
}

const categoryColors: Record<string, string> = {
  product: "bg-purple-100 text-purple-700",
  research: "bg-cyan-100 text-cyan-700",
  branding: "bg-pink-100 text-pink-700",
  marketing: "bg-orange-100 text-orange-700",
  validation: "bg-green-100 text-green-700",
  operations: "bg-gray-100 text-gray-700",
  monetization: "bg-amber-100 text-amber-700",
}

const columns = [
  { id: "todo", title: "To Do", color: "border-gray-300" },
  { id: "in_progress", title: "In Progress", color: "border-blue-500" },
  { id: "done", title: "Done", color: "border-green-500" },
]

export default function TasksPage() {
  const supabase = createClient()
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    category: "product",
    priority: "medium",
  })
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
      loadTasks(memberships.workspace_id)
    } else {
      setLoading(false)
    }
  }

  async function loadTasks(wsId: string) {
    const { data: taskData } = await supabase
      .from("tasks")
      .select("*")
      .eq("workspace_id", wsId)
      .order("created_at", { ascending: false })

    if (taskData) {
      setTasks(taskData)
    }
    setLoading(false)
  }

  async function createTask() {
    if (!newTask.title.trim() || !workspaceId) return

    const { data: task } = await supabase
      .from("tasks")
      .insert({
        workspace_id: workspaceId,
        title: newTask.title,
        description: newTask.description || null,
        category: newTask.category,
        priority: newTask.priority,
        status: "todo",
      })
      .select()
      .single()

    if (task) {
      setTasks([task, ...tasks])
      setNewTask({ title: "", description: "", category: "product", priority: "medium" })
      setShowCreate(false)
    }
  }

  async function updateTaskStatus(taskId: string, newStatus: string) {
    await supabase
      .from("tasks")
      .update({ status: newStatus })
      .eq("id", taskId)

    setTasks(tasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t))
  }

  const groupedTasks = columns.reduce((acc, col) => {
    acc[col.id] = tasks.filter(t => t.status === col.id)
    return acc
  }, {} as Record<string, Task[]>)

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
              <p className="text-muted-foreground">Create a workspace first to use the task board.</p>
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
            <h1 className="text-2xl font-bold">Task Board</h1>
            <p className="text-muted-foreground">Organize and track your startup tasks</p>
          </div>
          <Button onClick={() => setShowCreate(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Task
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {columns.map((col) => (
            <div key={col.id} className={`rounded-lg border-t-4 ${col.color} bg-white p-4`}>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-semibold">{col.title}</h2>
                <Badge variant="secondary">{groupedTasks[col.id]?.length || 0}</Badge>
              </div>
              <div className="space-y-3">
                {groupedTasks[col.id]?.map((task) => (
                  <div
                    key={task.id}
                    className="rounded-lg border bg-muted/30 p-3"
                    draggable
                  >
                    <div className="mb-2 flex items-start justify-between">
                      <span className="font-medium">{task.title}</span>
                      <GripVertical className="h-4 w-4 cursor-move text-muted-foreground" />
                    </div>
                    {task.description && (
                      <p className="mb-2 text-sm text-muted-foreground line-clamp-2">
                        {task.description}
                      </p>
                    )}
                    <div className="flex gap-2">
                      <Badge className={categoryColors[task.category] || "bg-gray-100"}>
                        {task.category}
                      </Badge>
                      <Badge className={priorityColors[task.priority] || "bg-gray-100"}>
                        {task.priority}
                      </Badge>
                    </div>
                    {col.id !== "done" && (
                      <select
                        className="mt-2 w-full rounded border p-1 text-xs"
                        value={task.status}
                        onChange={(e) => updateTaskStatus(task.id, e.target.value)}
                      >
                        <option value="todo">Move to To Do</option>
                        <option value="in_progress">Move to In Progress</option>
                        <option value="done">Move to Done</option>
                      </select>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Create Task Modal */}
        {showCreate && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle>Create New Task</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Task Title</label>
                  <Input
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    placeholder="Build waitlist page"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Description</label>
                  <Textarea
                    value={newTask.description}
                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                    placeholder="Additional details..."
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Category</label>
                    <select
                      value={newTask.category}
                      onChange={(e) => setNewTask({ ...newTask, category: e.target.value })}
                      className="w-full rounded-md border p-2"
                    >
                      {categories.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Priority</label>
                    <select
                      value={newTask.priority}
                      onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                      className="w-full rounded-md border p-2"
                    >
                      {priorities.map((p) => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setShowCreate(false)}>Cancel</Button>
                  <Button onClick={createTask}>Create Task</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}