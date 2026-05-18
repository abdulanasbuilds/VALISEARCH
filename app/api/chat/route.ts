import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(req: NextRequest) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await req.json()
  const { workspace_id, message, session_id } = body

  if (!workspace_id || !message) {
    return NextResponse.json({ error: "workspace_id and message are required" }, { status: 400 })
  }

  let chatSessionId = session_id

  if (!session_id) {
    const { data: session, error: sessionError } = await supabase
      .from("ai_chat_sessions")
      .insert({
        workspace_id,
        user_id: user.id,
        title: message.slice(0, 50) + "...",
      })
      .select()
      .single()

    if (sessionError) {
      return NextResponse.json({ error: sessionError.message }, { status: 500 })
    }

    chatSessionId = session.id
  }

  const { data: userMessage, error: userMsgError } = await supabase
    .from("ai_chat_messages")
    .insert({
      session_id: chatSessionId,
      role: "user",
      content: message,
    })
    .select()
    .single()

  if (userMsgError) {
    return NextResponse.json({ error: userMsgError.message }, { status: 500 })
  }

  const { data: workspace } = await supabase
    .from("workspaces")
    .select("*")
    .eq("id", workspace_id)
    .single()

  const { data: recentTasks } = await supabase
    .from("tasks")
    .select("title, status, category, priority")
    .eq("workspace_id", workspace_id)
    .order("created_at", { ascending: false })
    .limit(5)

  const { data: recentNotes } = await supabase
    .from("founder_notes")
    .select("title, content")
    .eq("workspace_id", workspace_id)
    .order("created_at", { ascending: false })
    .limit(3)

  const systemPrompt = `You are ValiSearch AI, an intelligent startup co-founder and strategic advisor. You're helping the founder with their startup "${workspace?.name || 'unnamed'}" which is in the "${workspace?.stage || 'idea'}" stage.

${workspace?.description ? `Description: ${workspace.description}` : ''}
${workspace?.industry ? `Industry: ${workspace.industry}` : ''}

Recent Tasks: ${JSON.stringify(recentTasks || [])}
Recent Notes: ${JSON.stringify(recentNotes || [])}

Provide strategic, actionable advice. Be conversational but professional. Use the workspace context to give relevant suggestions. When appropriate, recommend specific next actions, tasks, or milestones.

Keep responses concise but insightful. If they ask about tasks, suggest creating them. If they ask about the roadmap, offer to help plan it.`

  let responseContent = "I'm here to help with your startup journey. As your AI co-founder, I can help you with:\n\n- Strategic planning and next steps\n- Task management and prioritization\n- Roadmap planning\n- Market insights\n- Problem-solving\n\nWhat would you like to work on?"

  const { data: aiMessage, error: aiMsgError } = await supabase
    .from("ai_chat_messages")
    .insert({
      session_id: chatSessionId,
      role: "assistant",
      content: responseContent,
    })
    .select()
    .single()

  if (aiMsgError) {
    console.error("AI message error:", aiMsgError)
  }

  return NextResponse.json({
    session_id: chatSessionId,
    user_message: userMessage,
    ai_message: aiMessage || { content: responseContent },
  })
}
