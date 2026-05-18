"use client"

import { use, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { 
  Sliders, 
  UserPlus, 
  CreditCard, 
  Bell, 
  ShieldCheck, 
  CheckCircle2,
  Key
} from "lucide-react"

interface Props {
  params: Promise<{ id: string }>
}

export default function WorkspaceSettingsPage({ params }: Props) {
  const { id } = use(params)
  
  // State for forms
  const [name, setName] = useState("My Startup Project")
  const [industry, setIndustry] = useState("B2B SaaS")
  const [saved, setSaved] = useState(false)

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const team = [
    { email: "abdulanas237@gmail.com", role: "Owner" },
    { email: "collaborator@valisearch.com", role: "Viewer" }
  ]

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/40 pb-6">
        <div>
          <Badge variant="outline" className="border-primary/20 bg-primary/5 text-primary text-[10px] font-mono tracking-wider uppercase mb-1">
            Workspace Configuration Panel
          </Badge>
          <h1 className="text-3xl font-bold tracking-tight">Workspace Settings</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Configure metadata, manage your team permission models, and link billing settings.
          </p>
        </div>
      </div>

      {/* Main Settings Form Grid */}
      <div className="grid lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: General Configuration (8 Columns) */}
        <div className="lg:col-span-8 space-y-6">
          
          <form onSubmit={handleSave} className="surface-card border border-border/50 rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-foreground mb-4 border-b border-border/40 pb-2 flex items-center gap-1.5">
              <Sliders className="h-4 w-4 text-primary" />
              General Preferences
            </h3>

            <div className="space-y-1">
              <label className="text-[10px] font-mono uppercase text-muted-foreground font-bold">Workspace Name</label>
              <input
                required
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full h-10 px-3 rounded-lg border border-border bg-background text-xs focus:outline-none focus:border-primary"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-mono uppercase text-muted-foreground font-bold">Industry Sector</label>
              <input
                required
                type="text"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="w-full h-10 px-3 rounded-lg border border-border bg-background text-xs focus:outline-none focus:border-primary"
              />
            </div>

            <Button type="submit" className="h-10 px-6 font-semibold flex items-center gap-1.5 shrink-0 bg-primary hover:bg-primary/95 text-white">
              {saved ? (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  Preferences Saved!
                </>
              ) : (
                "Save Preferences"
              )}
            </Button>
          </form>

          {/* Team Collaboration Management */}
          <div className="surface-card border border-border/50 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex justify-between items-center border-b border-border/40 pb-2">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-1.5">
                <UserPlus className="h-4 w-4 text-primary" />
                Team Collaboration
              </h3>
              <Button size="sm" variant="ghost" className="h-8 border border-border text-xs font-semibold" onClick={() => alert("Invite link sent successfully!")}>
                Invite Founder
              </Button>
            </div>

            <div className="divide-y divide-border/30">
              {team.map((member) => (
                <div key={member.email} className="py-3 flex justify-between items-center text-xs">
                  <span className="font-semibold text-foreground">{member.email}</span>
                  <Badge variant="secondary" className="font-mono text-[10px] uppercase">
                    {member.role}
                  </Badge>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Billing, Notifications & API (4 Columns) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Quick billing summary */}
          <div className="surface-card border border-primary/20 bg-primary/5 rounded-2xl p-6 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-[85px] rounded-full -z-10" />
            
            <CreditCard className="h-6 w-6 text-primary mb-3" />
            <h4 className="text-xs font-bold text-foreground mb-1">Compute Plan Allocation</h4>
            <p className="text-[11px] text-muted-foreground leading-relaxed mb-4">
              Your account is active on the **Growth Trial** track. Consumed 10 / 50 compute credits.
            </p>

            <Button size="sm" variant="ghost" className="w-full border border-border/60 text-xs font-semibold" onClick={() => alert("Redirecting to LemonSqueezy portal...")}>
              Upgrade Account
            </Button>
          </div>

          {/* API Integrations Keys */}
          <div className="surface-card border border-border/50 rounded-2xl p-5 shadow-sm space-y-3">
            <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5 border-b border-border/40 pb-2">
              <Key className="h-4 w-4 text-muted-foreground" />
              API Integrations
            </h4>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-mono text-muted-foreground">OpenRouter Routing</span>
                <Badge variant="outline" className="text-[8px] bg-green-500/10 text-green-500 border-green-500/20 font-bold uppercase tracking-wider">Connected</Badge>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-mono text-muted-foreground">Jina AI Index Search</span>
                <Badge variant="outline" className="text-[8px] bg-green-500/10 text-green-500 border-green-500/20 font-bold uppercase tracking-wider">Connected</Badge>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  )
}
