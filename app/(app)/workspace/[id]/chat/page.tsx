"use client"

import { use, useEffect, useState, useRef } from "react"
import { createClient } from "@/lib/supabase/client"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { 
  MessageSquareCode, 
  Send, 
  BrainCircuit, 
  Clock, 
  ArrowRight,
  Sparkles,
  RefreshCw
} from "lucide-react"

interface Props {
  params: Promise<{ id: string }>
}

interface ChatMessage {
  id: string
  sender: "user" | "ai"
  message: string
  created_at: string
}

export default function CoFounderChatPage({ params }: Props) {
  const { id } = use(params)
  const supabase = createClient()
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [sessionId, setSessionId] = useState<string | null>(null)
  
  // Input state
  const [inputMessage, setInputMessage] = useState("")
  const [aiTyping, setAiTyping] = useState(false)

  // Auto-scroll chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, aiTyping])

  useEffect(() => {
    async function initChatSession() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        // 1. Get or create a session for this workspace/analysis ID
        const { data: existingSession } = await supabase
          .from("ai_chat_sessions")
          .select("id")
          .eq("workspace_id", id)
          .maybeSingle()

        let currentSessionId = existingSession?.id

        if (!currentSessionId) {
          const { data: createdSession } = await supabase
            .from("ai_chat_sessions")
            .insert({
              workspace_id: id,
              title: "Co-founder Advisor Session"
            })
            .select()
            .single()

          if (createdSession) {
            currentSessionId = createdSession.id
          }
        }

        setSessionId(currentSessionId)

        // 2. Load past messages
        if (currentSessionId) {
          const { data: dbMessages } = await supabase
            .from("ai_chat_messages")
            .select("*")
            .eq("session_id", currentSessionId)
            .order("created_at", { ascending: true })

          if (dbMessages && dbMessages.length > 0) {
            setMessages(dbMessages as ChatMessage[])
          } else {
            // Populate welcome onboarding message
            const welcomeText = "Hey there! I am your AI Co-founder. I have parsed your startup idea validation report. Let's design premium user loops or map competitor pricing gaps to build customer intent. What component should we focus on first?"
            
            const { data: welcomeMsg } = await supabase
              .from("ai_chat_messages")
              .insert({
                session_id: currentSessionId,
                sender: "ai",
                message: welcomeText
              })
              .select()
              .single()

            if (welcomeMsg) {
              setMessages([welcomeMsg as ChatMessage])
            }
          }
        }
      } catch (err) {
        console.error("Error loading chat:", err)
      } finally {
        setLoading(false)
      }
    }

    initChatSession()
  }, [id])

  // Send message
  async function handleSendMessage(e: React.FormEvent) {
    e.preventDefault()
    if (!inputMessage.trim() || !sessionId || aiTyping) return

    const userText = inputMessage.trim()
    setInputMessage("")

    // Optimistically push user message
    const tempUserMsg: ChatMessage = {
      id: Math.random().toString(),
      sender: "user",
      message: userText,
      created_at: new Date().toISOString()
    }
    setMessages(prev => [...prev, tempUserMsg])

    try {
      // 1. Save user message to database
      await supabase
        .from("ai_chat_messages")
        .insert({
          session_id: sessionId,
          sender: "user",
          message: userText
        })

      // 2. Trigger AI thinking state
      setAiTyping(true)

      // Get contextual prompt response based on keywords
      let cofounderReply = "That is a great direction! To optimize that loop, we should outline intent mockups to gather organic signups. How about we design a 3-step User Journey Map inside Visual Flows to test this assumption?"
      
      if (userText.toLowerCase().includes("pricing") || userText.toLowerCase().includes("monetize")) {
        cofounderReply = "Interesting approach on pricing! Let's examine our Competitor Intel matrix. ValidatorAI and IdeaBuddy rely heavily on rigid $15-$49 plans. We should implement a credit usage tier to match exact compute consumption, maximizing buyer retention."
      } else if (userText.toLowerCase().includes("competitor") || userText.toLowerCase().includes("rival")) {
        cofounderReply = "Absolutely. Out of the direct rivals we audited (ValidatorAI, IdeaBuddy), our primary advantage lies inpgvector RAG integration and visual flows mapping. Let's isolate their weak points inside our Competitor Intel panel!"
      }

      // Simulate network delay
      setTimeout(async () => {
        try {
          // 3. Save AI message to database
          const { data: dbAiMsg } = await supabase
            .from("ai_chat_messages")
            .insert({
              session_id: sessionId,
              sender: "ai",
              message: cofounderReply
            })
            .select()
            .single()

          if (dbAiMsg) {
            setMessages(prev => [...prev.filter(m => m.id !== tempUserMsg.id), tempUserMsg, dbAiMsg as ChatMessage])
          }
        } catch (err) {
          console.error("Error saving AI message:", err)
        } finally {
          setAiTyping(false)
        }
      }, 1500)

    } catch (err) {
      console.error("Error sending message:", err)
      setAiTyping(false)
    }
  }

  if (loading) {
    return (
      <div className="py-20 text-center space-y-4">
        <div className="h-8 w-8 rounded-full border-4 border-primary border-t-transparent animate-spin mx-auto" />
        <span className="text-xs font-mono text-muted-foreground uppercase tracking-widest">Waking Up AI Co-founder...</span>
      </div>
    )
  }

  return (
    <div className="h-[calc(100vh-10rem)] max-w-5xl mx-auto flex flex-col justify-between border border-border/50 bg-muted/5 rounded-2xl overflow-hidden shadow-sm">
      
      {/* Dynamic Chat Header */}
      <div className="bg-background border-b border-border/40 px-6 py-4 flex justify-between items-center shrink-0">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
            <BrainCircuit className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-foreground flex items-center gap-1.5">
              AI Co-founder Advisor
              <Badge className="bg-green-500/10 text-green-500 border-green-500/20 text-[9px] font-mono leading-none">Online</Badge>
            </h1>
            <p className="text-[10px] text-muted-foreground font-mono">Workspace Context Active</p>
          </div>
        </div>
      </div>

      {/* Messages Grid Container */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-950/5">
        
        {messages.map((msg) => (
          <div 
            key={msg.id}
            className={`flex items-start gap-3 max-w-[80%] ${msg.sender === "user" ? "ml-auto flex-row-reverse" : ""}`}
          >
            {/* Avatar Node */}
            <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold font-mono shadow-sm ${
              msg.sender === "user" ? "bg-muted border border-border text-foreground" : "bg-primary text-white"
            }`}>
              {msg.sender === "user" ? "ME" : "CF"}
            </div>

            {/* Chat bubble body */}
            <div className={`p-4 rounded-2xl border text-xs leading-relaxed ${
              msg.sender === "user"
                ? "bg-foreground text-background border-transparent rounded-tr-none"
                : "bg-background text-muted-foreground border-border/50 rounded-tl-none"
            }`}>
              <span dangerouslySetInnerHTML={{ __html: msg.message }} />
            </div>
          </div>
        ))}

        {/* AI Typing Loader */}
        {aiTyping && (
          <div className="flex items-start gap-3 max-w-[80%]">
            <div className="h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center shrink-0 text-xs font-mono font-bold animate-pulse">
              CF
            </div>
            <div className="p-4 rounded-2xl border border-border/50 bg-background text-muted-foreground rounded-tl-none flex items-center gap-1">
              <div className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Chat Form Stdin Input */}
      <form onSubmit={handleSendMessage} className="bg-background border-t border-border/40 p-4 shrink-0 flex gap-2">
        <input
          required
          type="text"
          disabled={aiTyping}
          placeholder="Ask your co-founder about pricing loop strategies, direct competitor gaps..."
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          className="flex-1 h-11 px-4 text-xs rounded-xl border border-border bg-background text-foreground focus:outline-none focus:border-primary disabled:opacity-50"
        />
        
        <Button type="submit" disabled={aiTyping} className="h-11 px-5 rounded-xl font-semibold flex items-center gap-1.5 shrink-0 bg-primary hover:bg-primary/95 text-white">
          Send
          <Send className="h-3.5 w-3.5" />
        </Button>
      </form>

    </div>
  )
}
