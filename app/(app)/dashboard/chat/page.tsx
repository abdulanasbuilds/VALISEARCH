"use client"

export const runtime = "edge"

import { useEffect, useState, useRef } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, Bot, User, Sparkles, Lightbulb, Target, TrendingUp } from "lucide-react"

interface Message {
  role: "user" | "assistant"
  content: string
  created_at: string
}

export default function ChatPage() {
  const supabase = createClient()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [workspaceId, setWorkspaceId] = useState<string | null>(null)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    loadInitialData()
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

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
      
      const { data: sessions } = await supabase
        .from("ai_chat_sessions")
        .select("id")
        .eq("workspace_id", memberships.workspace_id)
        .order("created_at", { ascending: false })
        .limit(1)
        .single()

      if (sessions?.id) {
        setSessionId(sessions.id)
        const { data: chatMessages } = await supabase
          .from("ai_chat_messages")
          .select("*")
          .eq("session_id", sessions.id)
          .order("created_at", { ascending: true })

        if (chatMessages) {
          setMessages(chatMessages)
        }
      }
    }
  }

  async function sendMessage() {
    if (!input.trim() || !workspaceId || loading) return

    const userMessage = input
    setInput("")
    setLoading(true)

    setMessages(prev => [...prev, {
      role: "user",
      content: userMessage,
      created_at: new Date().toISOString(),
    }])

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          workspace_id: workspaceId,
          message: userMessage,
          session_id: sessionId,
        }),
      })

      const data = await res.json()

      if (data.session_id && !sessionId) {
        setSessionId(data.session_id)
      }

      if (data.ai_message) {
        setMessages(prev => [...prev, {
          role: "assistant",
          content: data.ai_message.content,
          created_at: new Date().toISOString(),
        }])
      }
    } catch (error) {
      console.error("Chat error:", error)
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "Sorry, I encountered an error. Please try again.",
        created_at: new Date().toISOString(),
      }])
    }

    setLoading(false)
  }

  const quickPrompts = [
    { label: "Suggest next steps", icon: Target, prompt: "What should be my next steps for this startup?" },
    { label: "Generate ideas", icon: Lightbulb, prompt: "Give me 5 creative ideas for this startup" },
    { label: "Growth strategy", icon: TrendingUp, prompt: "How can I grow this startup faster?" },
    { label: "Strategic advice", icon: Sparkles, prompt: "What strategic advice do you have for my startup?" },
  ]

  function handleQuickPrompt(prompt: string) {
    setInput(prompt)
  }

  if (!workspaceId) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="mx-auto max-w-4xl">
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">Create a workspace first to use the AI Cofounder.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">AI Cofounder</h1>
          <p className="text-muted-foreground">Your strategic startup advisor</p>
        </div>

        <Card className="h-[600px] flex flex-col">
          <CardHeader className="border-b">
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-primary" />
              Strategic Assistant
            </CardTitle>
          </CardHeader>
          
          <div className="flex-1 overflow-y-auto p-4">
            {messages.length === 0 ? (
              <div className="space-y-6">
                <div className="text-center text-muted-foreground">
                  <Bot className="mx-auto mb-4 h-12 w-12 text-muted-foreground/50" />
                  <p>Start a conversation with your AI co-founder</p>
                </div>
                
                <div>
                  <p className="mb-3 text-sm font-medium">Quick prompts:</p>
                  <div className="grid gap-2 md:grid-cols-2">
                    {quickPrompts.map((q) => (
                      <Button
                        key={q.label}
                        variant="outline"
                        className="justify-start"
                        onClick={() => handleQuickPrompt(q.prompt)}
                      >
                        <q.icon className="mr-2 h-4 w-4" />
                        {q.label}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    {msg.role === "assistant" && (
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                        <Bot className="h-4 w-4 text-primary" />
                      </div>
                    )}
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        msg.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                    </div>
                    {msg.role === "user" && (
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                        <User className="h-4 w-4 text-primary" />
                      </div>
                    )}
                  </div>
                ))}
                {loading && (
                  <div className="flex gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                      <Bot className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex items-center gap-2 rounded-lg bg-muted p-3">
                      <div className="h-2 w-2 animate-bounce rounded-full bg-primary" style={{ animationDelay: "0ms" }} />
                      <div className="h-2 w-2 animate-bounce rounded-full bg-primary" style={{ animationDelay: "150ms" }} />
                      <div className="h-2 w-2 animate-bounce rounded-full bg-primary" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          <div className="border-t p-4">
            <form
              onSubmit={(e) => {
                e.preventDefault()
                sendMessage()
              }}
              className="flex gap-2"
            >
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask your co-founder anything..."
                disabled={loading}
              />
              <Button type="submit" disabled={loading || !input.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </Card>
      </div>
    </div>
  )
}