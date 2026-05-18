import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { 
  ArrowLeft, 
  LayoutDashboard, 
  ShieldCheck, 
  Globe, 
  TrendingUp, 
  Milestone, 
  Kanban, 
  GitFork, 
  MessageSquareCode, 
  HeartPulse, 
  FileSpreadsheet, 
  Sliders 
} from "lucide-react"

interface Props {
  children: React.ReactNode
  params: Promise<{ id: string }>
}

export default async function WorkspaceDetailsLayout({ children, params }: Props) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { id } = await params

  // Get active analysis metadata
  const { data: analysis } = await supabase
    .from("analysis")
    .select(`
      id,
      overall_score,
      status,
      ideas (title, idea_text)
    `)
    .eq("id", id)
    .single()

  if (!analysis) {
    redirect("/workspace")
  }

  const ideasObj = Array.isArray(analysis.ideas) ? analysis.ideas[0] : (analysis.ideas as any)
  const title = ideasObj?.title || ideasObj?.idea_text?.slice(0, 30) || "Startup Audit"

  const sidebarItems = [
    {
      title: "Command Center",
      href: `/workspace/${id}/dashboard`,
      icon: LayoutDashboard,
    },
    {
      title: "Validation Score",
      href: `/workspace/${id}/validation`,
      icon: ShieldCheck,
    },
    {
      title: "Market Intelligence",
      href: `/workspace/${id}/market`,
      icon: Globe,
    },
    {
      title: "Competitor Intel",
      href: `/workspace/${id}/competitor`,
      icon: TrendingUp,
    },
    {
      title: "Product Roadmap",
      href: `/workspace/${id}/roadmap`,
      icon: Milestone,
    },
    {
      title: "Kanban Task Board",
      href: `/workspace/${id}/kanban`,
      icon: Kanban,
    },
    {
      title: "Visual Flows",
      href: `/workspace/${id}/flows`,
      icon: GitFork,
    },
    {
      title: "AI Co-founder Chat",
      href: `/workspace/${id}/chat`,
      icon: MessageSquareCode,
    },
    {
      title: "Startup Health",
      href: `/workspace/${id}/health`,
      icon: HeartPulse,
    },
    {
      title: "Strategic Reports",
      href: `/workspace/${id}/reports`,
      icon: FileSpreadsheet,
    },
    {
      title: "Settings",
      href: `/workspace/${id}/settings`,
      icon: Sliders,
    },
  ]

  return (
    <div className="flex h-[calc(100vh-4rem)] w-full overflow-hidden bg-background">
      {/* Dynamic Workspace Sidebar */}
      <aside className="w-64 border-r border-border/40 bg-muted/5 flex flex-col h-full shrink-0">
        
        {/* Back Button and Project Title */}
        <div className="p-4 border-b border-border/40">
          <Link href="/workspace">
            <span className="flex items-center gap-2 text-xs font-mono text-muted-foreground hover:text-foreground cursor-pointer transition-colors mb-3">
              <ArrowLeft className="h-3 w-3" />
              All Workspaces
            </span>
          </Link>
          <div className="flex flex-col gap-1">
            <span className="text-xs font-mono text-primary font-bold uppercase tracking-widest leading-none">Active Project</span>
            <span className="text-sm font-bold truncate text-foreground">{title}</span>
          </div>
        </div>

        {/* Dynamic Sidebar Links */}
        <nav className="flex-1 overflow-y-auto space-y-1 p-3 no-scrollbar">
          {sidebarItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <span className="flex items-center gap-3 rounded-lg px-3 py-2 text-xs font-semibold text-muted-foreground hover:bg-muted/50 hover:text-foreground cursor-pointer transition-all duration-200">
                <item.icon className="h-4 w-4 shrink-0 text-muted-foreground" />
                {item.title}
              </span>
            </Link>
          ))}
        </nav>

        {/* Health / Score Summary Widget */}
        <div className="p-4 border-t border-border/40 bg-muted/10">
          <div className="flex justify-between items-center mb-1">
            <span className="text-[10px] font-mono uppercase text-muted-foreground">Viability Rating</span>
            <span className="text-xs font-bold text-primary">{analysis.overall_score ?? "Pending"}%</span>
          </div>
          <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-primary" style={{ width: `${analysis.overall_score ?? 0}%` }} />
          </div>
        </div>

      </aside>

      {/* Main Inner Content Window */}
      <main className="flex-1 overflow-y-auto bg-slate-50/50 p-6 md:p-8">
        {children}
      </main>
    </div>
  )
}
